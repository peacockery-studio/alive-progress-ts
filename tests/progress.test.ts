import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { aliveBar, aliveIt, aliveItSync, type Receipt } from '../src/core/progress';
import { resetGlobalConfig } from '../src/core/configuration';

describe('aliveBar', () => {
  beforeEach(() => {
    resetGlobalConfig();
  });

  afterEach(() => {
    resetGlobalConfig();
  });

  test('creates progress bar with total', () => {
    const { bar, done } = aliveBar(100, { disable: true });

    expect(bar).toBeDefined();
    expect(done).toBeDefined();
    expect(typeof bar).toBe('function');
    expect(typeof done).toBe('function');

    done();
  });

  test('creates progress bar without total (unknown mode)', () => {
    const { bar, done } = aliveBar(null, { disable: true });

    expect(bar).toBeDefined();
    bar();
    bar();

    const receipt = done();
    expect(receipt.total).toBeNull();
    expect(receipt.count).toBe(2);
  });

  test('bar() increments counter', () => {
    const { bar, done } = aliveBar(100, { disable: true });

    expect(bar.current).toBe(0);

    bar();
    expect(bar.current).toBe(1);

    bar();
    expect(bar.current).toBe(2);

    bar(5);
    expect(bar.current).toBe(7);

    done();
  });

  test('bar.text can be set', () => {
    const { bar, done } = aliveBar(100, { disable: true });

    bar.text = 'Processing...';
    expect(bar.text).toBe('Processing...');

    bar.setText('Updated');
    expect(bar.text).toBe('Updated');

    done();
  });

  test('bar.title can be set', () => {
    const { bar, done } = aliveBar(100, { disable: true, title: 'Initial' });

    expect(bar.title).toBe('Initial');

    bar.title = 'Updated';
    expect(bar.title).toBe('Updated');

    bar.setTitle('Final');
    expect(bar.title).toBe('Final');

    done();
  });

  test('bar.elapsed returns elapsed time', async () => {
    const { bar, done } = aliveBar(100, { disable: true });

    await Bun.sleep(50);
    const elapsed = bar.elapsed;

    expect(elapsed).toBeGreaterThan(0.04);

    done();
  });

  test('bar.pause() pauses and returns resume function', async () => {
    const { bar, done } = aliveBar(100, { disable: true });

    bar();
    await Bun.sleep(50);
    const elapsedBefore = bar.elapsed;

    const resume = bar.pause();
    await Bun.sleep(50);
    const elapsedWhilePaused = bar.elapsed;

    // Elapsed should not increase much while paused
    expect(elapsedWhilePaused).toBeCloseTo(elapsedBefore, 1);

    resume();
    await Bun.sleep(50);
    const elapsedAfter = bar.elapsed;

    // Elapsed should continue after resume
    expect(elapsedAfter).toBeGreaterThan(elapsedWhilePaused);

    done();
  });

  test('bar.monitor returns formatted progress', () => {
    const { bar, done } = aliveBar(100, { disable: true });

    bar();
    bar();

    const monitor = bar.monitor;
    expect(monitor).toContain('2');
    expect(monitor).toContain('100');
    expect(monitor).toContain('%');

    done();
  });

  test('skipped items are tracked correctly', () => {
    const { bar, done } = aliveBar(100, { disable: true });

    bar(50, { skipped: true });
    bar();
    bar();

    // current should not include skipped
    expect(bar.current).toBe(2);

    done();
  });

  test('done() returns receipt', () => {
    const { bar, done } = aliveBar(100, { disable: true });

    for (let i = 0; i < 100; i++) {
      bar();
    }

    const receipt = done();

    expect(receipt.total).toBe(100);
    expect(receipt.count).toBe(100);
    expect(receipt.percent).toBe(100);
    expect(receipt.elapsed).toBeGreaterThanOrEqual(0);
    expect(receipt.rate).toBeGreaterThanOrEqual(0);
    expect(receipt.success).toBe(true);
    expect(receipt.overflow).toBe(false);
    expect(receipt.underflow).toBe(false);
  });

  test('receipt shows overflow', () => {
    const { bar, done } = aliveBar(10, { disable: true });

    for (let i = 0; i < 15; i++) {
      bar();
    }

    const receipt = done();

    expect(receipt.overflow).toBe(true);
    expect(receipt.success).toBe(false);
  });

  test('receipt shows underflow', () => {
    const { bar, done } = aliveBar(100, { disable: true });

    for (let i = 0; i < 50; i++) {
      bar();
    }

    const receipt = done();

    expect(receipt.underflow).toBe(true);
    expect(receipt.success).toBe(false);
  });

  test('bar.receipt is available after done()', () => {
    const { bar, done } = aliveBar(10, { disable: true });

    bar();
    bar();

    expect(bar.receipt).toBeNull();

    done();

    expect(bar.receipt).not.toBeNull();
    expect(bar.receipt?.count).toBe(2);
  });
});

describe('aliveBar manual mode', () => {
  test('manual mode sets percentage directly', () => {
    const { bar, done } = aliveBar(100, { disable: true, manual: true });

    bar(0.5); // 50%
    expect(bar.current).toBe(50);

    bar(0.75); // 75%
    expect(bar.current).toBe(75);

    done();
  });
});

describe('aliveBar options', () => {
  test('disable option suppresses output', () => {
    const { bar, done } = aliveBar(100, { disable: true });

    // Should work without errors
    bar();
    bar();
    done();
  });

  test('title option sets initial title', () => {
    const { bar, done } = aliveBar(100, { disable: true, title: 'Test' });
    expect(bar.title).toBe('Test');
    done();
  });

  test('dualLine option can be set', () => {
    // Just verify it doesn't throw
    const { done } = aliveBar(100, { disable: true, dualLine: true });
    done();
  });

  test('receipt option can be disabled', () => {
    const { done } = aliveBar(100, { disable: true, receipt: false });
    // Should work without errors
    done();
  });
});

describe('aliveIt', () => {
  test('iterates over array', async () => {
    const items = [1, 2, 3, 4, 5];
    const collected: number[] = [];

    for await (const item of aliveIt(items, { disable: true })) {
      collected.push(item);
    }

    expect(collected).toEqual(items);
  });

  test('works with options', async () => {
    const items = ['a', 'b', 'c'];
    const collected: string[] = [];

    for await (const item of aliveIt(items, { disable: true, title: 'Processing' })) {
      collected.push(item);
    }

    expect(collected).toEqual(items);
  });

  test('detects length from array', async () => {
    const items = [1, 2, 3];
    let count = 0;

    for await (const _ of aliveIt(items, { disable: true })) {
      count++;
    }

    expect(count).toBe(3);
  });
});

describe('aliveItSync', () => {
  test('iterates synchronously over array', () => {
    const items = [1, 2, 3, 4, 5];
    const collected: number[] = [];

    for (const item of aliveItSync(items, { disable: true })) {
      collected.push(item);
    }

    expect(collected).toEqual(items);
  });

  test('works with Set', () => {
    const items = new Set([1, 2, 3]);
    const collected: number[] = [];

    for (const item of aliveItSync(items, { disable: true })) {
      collected.push(item);
    }

    expect(collected).toEqual([1, 2, 3]);
  });

  test('works with generator', () => {
    function* gen() {
      yield 1;
      yield 2;
      yield 3;
    }

    const collected: number[] = [];

    for (const item of aliveItSync(gen(), { disable: true })) {
      collected.push(item);
    }

    expect(collected).toEqual([1, 2, 3]);
  });
});

describe('receipt data types', () => {
  test('receipt has correct types', () => {
    const { bar, done } = aliveBar(10, { disable: true });

    for (let i = 0; i < 10; i++) {
      bar();
    }

    const receipt = done();

    expect(typeof receipt.total).toBe('number');
    expect(typeof receipt.count).toBe('number');
    expect(typeof receipt.percent).toBe('number');
    expect(typeof receipt.elapsed).toBe('number');
    expect(typeof receipt.rate).toBe('number');
    expect(typeof receipt.success).toBe('boolean');
    expect(typeof receipt.overflow).toBe('boolean');
    expect(typeof receipt.underflow).toBe('boolean');
  });
});
