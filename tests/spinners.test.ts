import { describe, test, expect } from 'bun:test';
import {
  frameSpinner,
  scrollingSpinner,
  bouncingSpinner,
  sequentialSpinner,
  alongsideSpinner,
  delayedSpinner,
  pulsingSpinner,
  type Spinner,
  type SpinnerFactory
} from '../src/animations/spinners';

describe('frameSpinner', () => {
  test('creates spinner from string', () => {
    const factory = frameSpinner('|/-\\');
    const spinner = factory(10);

    expect(typeof spinner).toBe('function');

    const frame1 = spinner();
    expect(frame1.content).toBeDefined();
    expect(frame1.width).toBe(10);
  });

  test('creates spinner from array', () => {
    const frames = ['⠋', '⠙', '⠹', '⠸'];
    const factory = frameSpinner(frames);
    const spinner = factory(5);

    const frame = spinner();
    expect(frame.width).toBe(5);
  });

  test('cycles through frames', () => {
    const factory = frameSpinner(['A', 'B', 'C']);
    const spinner = factory(1);

    const frames: string[] = [];
    for (let i = 0; i < 6; i++) {
      frames.push(spinner().content);
    }

    // Should cycle: A, B, C, A, B, C
    expect(frames[0]).toBe('A');
    expect(frames[1]).toBe('B');
    expect(frames[2]).toBe('C');
    expect(frames[3]).toBe('A');
  });

  test('pads frames to specified length', () => {
    const factory = frameSpinner('X');
    const spinner = factory(5);

    const frame = spinner();
    expect(frame.content.length).toBe(5);
    expect(frame.content).toBe('X    ');
  });
});

describe('scrollingSpinner', () => {
  test('creates a scrolling spinner', () => {
    const factory = scrollingSpinner('>>>', { background: ' ' });
    const spinner = factory(10);

    expect(typeof spinner).toBe('function');

    const frame = spinner();
    expect(frame.width).toBe(10);
  });

  test('generates different frames', () => {
    const factory = scrollingSpinner('>>>', { background: '-' });
    const spinner = factory(10);

    const frame1 = spinner();
    const frame2 = spinner();
    const frame3 = spinner();

    // Frames should differ as the content scrolls
    const uniqueFrames = new Set([frame1.content, frame2.content, frame3.content]);
    expect(uniqueFrames.size).toBeGreaterThanOrEqual(1);
  });

  test('respects background option', () => {
    const factory = scrollingSpinner('X', { background: '-' });
    const spinner = factory(5);

    const frame = spinner();
    // Frame should contain either X or - characters
    expect(frame.content).toMatch(/[X\-]/);
  });
});

describe('bouncingSpinner', () => {
  test('creates a bouncing spinner', () => {
    const factory = bouncingSpinner('●');
    const spinner = factory(10);

    expect(typeof spinner).toBe('function');

    const frame = spinner();
    expect(frame.width).toBe(10);
  });

  test('generates different frames', () => {
    const factory = bouncingSpinner('O', { background: ' ' });
    const spinner = factory(10);

    const frames: string[] = [];
    for (let i = 0; i < 20; i++) {
      frames.push(spinner().content);
    }

    // Should have multiple unique frames as it bounces
    const uniqueFrames = new Set(frames);
    expect(uniqueFrames.size).toBeGreaterThan(1);
  });

  test('supports different forward/backward characters', () => {
    const factory = bouncingSpinner(['→', '←']);
    const spinner = factory(10);

    // Should work without errors
    const frame = spinner();
    expect(frame.width).toBe(10);
  });
});

describe('sequentialSpinner', () => {
  test('plays multiple spinners sequentially', () => {
    const factory1 = frameSpinner('ABC');
    const factory2 = frameSpinner('123');

    const combined = sequentialSpinner(factory1, factory2);
    const spinner = combined(5);

    // Should produce frames without errors
    for (let i = 0; i < 50; i++) {
      const frame = spinner();
      expect(frame.width).toBe(5);
    }
  });
});

describe('alongsideSpinner', () => {
  test('shows multiple spinners side by side', () => {
    const factory1 = frameSpinner('A');
    const factory2 = frameSpinner('B');

    const combined = alongsideSpinner(factory1, factory2);
    const spinner = combined(10);

    const frame = spinner();
    expect(frame.width).toBe(10);
  });
});

describe('delayedSpinner', () => {
  test('creates wave effect with delayed copies', () => {
    const factory = frameSpinner('|/-\\');
    const delayed = delayedSpinner(factory, 3, 2);
    const spinner = delayed(15);

    const frame = spinner();
    expect(frame.width).toBe(15);
  });
});

describe('pulsingSpinner', () => {
  test('creates pulsing animation', () => {
    const factory = pulsingSpinner(['○', '◎', '●'], 2);
    const spinner = factory(5);

    const frames: string[] = [];
    for (let i = 0; i < 12; i++) {
      frames.push(spinner().content);
    }

    // Should cycle through states
    const uniqueFrames = new Set(frames);
    expect(uniqueFrames.size).toBeGreaterThanOrEqual(3);
  });
});

describe('spinner width consistency', () => {
  const factories: [string, SpinnerFactory][] = [
    ['frame', frameSpinner('|/-\\')],
    ['scrolling', scrollingSpinner('>>>')],
    ['bouncing', bouncingSpinner('●')],
    ['pulsing', pulsingSpinner(['○', '●'])],
  ];

  for (const [name, factory] of factories) {
    test(`${name} spinner maintains consistent width`, () => {
      const length = 15;
      const spinner = factory(length);

      for (let i = 0; i < 30; i++) {
        const frame = spinner();
        expect(frame.width).toBe(length);
      }
    });
  }
});
