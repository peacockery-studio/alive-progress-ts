import { describe, test, expect, beforeEach } from 'bun:test';
import {
  formatDuration,
  formatRate,
  RateSmoother,
  Timer,
  ETACalculator
} from '../src/utils/timing';

describe('formatDuration', () => {
  describe('short format', () => {
    test('formats sub-second durations', () => {
      expect(formatDuration(0.5, true)).toBe('0.5s');
      expect(formatDuration(0.15, true)).toBe('0.1s');
    });

    test('formats seconds', () => {
      expect(formatDuration(5, true)).toBe('5.0s');
      expect(formatDuration(5.5, true)).toBe('5.5s');
    });

    test('formats minutes and seconds', () => {
      expect(formatDuration(65, true)).toBe('1m5s');
      expect(formatDuration(125, true)).toBe('2m5s');
    });

    test('formats hours and minutes', () => {
      expect(formatDuration(3665, true)).toBe('1h1m');
      expect(formatDuration(7325, true)).toBe('2h2m');
    });
  });

  describe('long format', () => {
    test('formats sub-minute durations', () => {
      expect(formatDuration(5)).toBe('5.0s');
      expect(formatDuration(45.5)).toBe('45.5s');
    });

    test('formats minutes', () => {
      expect(formatDuration(65)).toBe('1:05');
      expect(formatDuration(125)).toBe('2:05');
    });

    test('formats hours', () => {
      expect(formatDuration(3665)).toBe('1:01:05');
      expect(formatDuration(7325)).toBe('2:02:05');
    });
  });

  test('handles invalid values', () => {
    expect(formatDuration(Infinity, true)).toBe('?');
    expect(formatDuration(-1, true)).toBe('?');
    expect(formatDuration(NaN, true)).toBe('?');
  });
});

describe('formatRate', () => {
  test('formats low rates', () => {
    expect(formatRate(0.5)).toBe('0.50/s');
    expect(formatRate(0.75)).toBe('0.75/s');
  });

  test('formats normal rates', () => {
    expect(formatRate(1.5)).toBe('1.5/s');
    expect(formatRate(50)).toBe('50.0/s');
    expect(formatRate(150)).toBe('150/s');
  });

  test('formats high rates with k suffix', () => {
    expect(formatRate(1500)).toBe('1.5k/s');
    expect(formatRate(50000)).toBe('50.0k/s');
  });

  test('formats very high rates with M suffix', () => {
    expect(formatRate(1500000)).toBe('1.5M/s');
    expect(formatRate(50000000)).toBe('50.0M/s');
  });

  test('includes unit when specified', () => {
    expect(formatRate(1000, 'B')).toBe('1.0k B/s');
  });

  test('handles invalid values', () => {
    expect(formatRate(Infinity)).toBe('?/s');
    expect(formatRate(-1)).toBe('?/s');
    expect(formatRate(NaN)).toBe('?/s');
  });
});

describe('RateSmoother', () => {
  let smoother: RateSmoother;

  beforeEach(() => {
    smoother = new RateSmoother(0.5);
  });

  test('first update returns the input value', () => {
    expect(smoother.update(100)).toBe(100);
  });

  test('smooths subsequent values', () => {
    smoother.update(100);
    // With alpha=0.5: smoothed = 0.5 * 50 + 0.5 * 100 = 75
    expect(smoother.update(50)).toBe(75);
  });

  test('get returns current smoothed rate', () => {
    smoother.update(100);
    expect(smoother.get()).toBe(100);
  });

  test('reset clears the smoother', () => {
    smoother.update(100);
    smoother.reset();
    expect(smoother.get()).toBe(0);
    // After reset, first update should return input value
    expect(smoother.update(50)).toBe(50);
  });

  test('exponential smoothing converges', () => {
    // Following the pattern from the Python tests
    const alpha = 0.5;
    const smoother = new RateSmoother(alpha);

    const data = [
      [88, 88],
      [75, 81.5],
      [60, 70.75],
      [75, 72.875],
    ] as const;

    for (const [input, expected] of data) {
      const result = smoother.update(input);
      expect(result).toBeCloseTo(expected, 5);
    }
  });
});

describe('Timer', () => {
  test('elapsed returns time since creation', async () => {
    const timer = new Timer();
    await Bun.sleep(50);
    const elapsed = timer.elapsed();
    expect(elapsed).toBeGreaterThan(0.04);
    expect(elapsed).toBeLessThan(0.2);
  });

  test('pause and resume work correctly', async () => {
    const timer = new Timer();
    await Bun.sleep(50);

    timer.pause();
    const elapsedAtPause = timer.elapsed();

    await Bun.sleep(50);

    // While paused, elapsed should not increase much
    const elapsedWhilePaused = timer.elapsed();
    expect(elapsedWhilePaused).toBeCloseTo(elapsedAtPause, 1);

    timer.resume();
    await Bun.sleep(50);

    // After resume, elapsed should continue from pause point
    const elapsedAfterResume = timer.elapsed();
    expect(elapsedAfterResume).toBeGreaterThan(elapsedAtPause);
  });

  test('isPaused returns correct state', () => {
    const timer = new Timer();
    expect(timer.isPaused()).toBe(false);

    timer.pause();
    expect(timer.isPaused()).toBe(true);

    timer.resume();
    expect(timer.isPaused()).toBe(false);
  });

  test('reset resets the timer', async () => {
    const timer = new Timer();
    await Bun.sleep(50);

    timer.reset();
    const elapsed = timer.elapsed();
    expect(elapsed).toBeLessThan(0.05);
  });
});

describe('ETACalculator', () => {
  test('calculates ETA based on progress', async () => {
    const calc = new ETACalculator(0.5);

    // Simulate some progress
    await Bun.sleep(100);
    const eta1 = calc.update(10, 100);

    // ETA should be positive (we have remaining work)
    expect(eta1).toBeGreaterThan(0);
  });

  test('returns Infinity when no progress', () => {
    const calc = new ETACalculator();
    const eta = calc.update(0, 100);
    expect(eta).toBe(Infinity);
  });

  test('getRate returns current rate', async () => {
    const calc = new ETACalculator(0.5);

    // Initially 0
    expect(calc.getRate()).toBe(0);

    // After some updates, should have a rate
    await Bun.sleep(50);
    calc.update(10, 100);
    await Bun.sleep(50);
    calc.update(20, 100);

    expect(calc.getRate()).toBeGreaterThan(0);
  });

  test('reset clears the calculator', async () => {
    const calc = new ETACalculator();

    await Bun.sleep(50);
    calc.update(50, 100);

    calc.reset();
    expect(calc.getRate()).toBe(0);
  });
});
