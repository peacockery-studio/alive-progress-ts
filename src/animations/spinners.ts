/**
 * Spinner animation factories.
 *
 * Spinners are cyclical animations that play while progress is being made.
 * They provide visual feedback that work is happening.
 */

import { toCells, getCellsWidth, fixCells, cellsToString, type Cell } from '../utils/cells.js';

/**
 * A compiled spinner frame ready for display.
 */
export interface SpinnerFrame {
  content: string;
  width: number;
}

/**
 * A spinner is a function that returns the next animation frame.
 */
export type Spinner = () => SpinnerFrame;

/**
 * A spinner factory creates a spinner with a specific length.
 */
export type SpinnerFactory = (length: number) => Spinner;

/**
 * Internal spinner spec for compilation.
 */
interface SpinnerSpec {
  frames: string[][];  // cycles x frames
}

/**
 * Compile a spinner spec into an optimized spinner function.
 */
function compileSpinner(spec: SpinnerSpec, length: number): Spinner {
  // Pre-compile all frames
  const compiledFrames: SpinnerFrame[] = [];

  for (const cycle of spec.frames) {
    for (const frame of cycle) {
      const cells = toCells(frame);
      const fixed = fixCells(cells, length, ' ');
      compiledFrames.push({
        content: cellsToString(fixed),
        width: length
      });
    }
  }

  let index = 0;
  const totalFrames = compiledFrames.length;

  return () => {
    const frame = compiledFrames[index];
    index = (index + 1) % totalFrames;
    return frame;
  };
}

/**
 * Create a frame spinner from static frames.
 * Each frame is displayed in sequence.
 *
 * @example
 * frameSpinner('|/-\\')  // Classic spinner
 * frameSpinner(['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'])  // Dots spinner
 */
export function frameSpinner(frames: string | string[]): SpinnerFactory {
  const frameArray = typeof frames === 'string' ? [...frames] : frames;

  return (length: number) => {
    const spec: SpinnerSpec = {
      frames: [frameArray]
    };
    return compileSpinner(spec, length);
  };
}

/**
 * Create a scrolling spinner where characters scroll across the display.
 *
 * @param chars - Characters to scroll
 * @param options - Scrolling options
 */
export function scrollingSpinner(
  chars: string,
  options: {
    length?: number;
    background?: string;
    right?: boolean;
    hide?: boolean;
    wrap?: boolean;
  } = {}
): SpinnerFactory {
  const {
    background = ' ',
    right = false,
    hide = true,
    wrap = false
  } = options;

  return (length: number) => {
    const charCells = toCells(chars);
    const charWidth = getCellsWidth(charCells);
    const bgCell: Cell = { grapheme: background, width: 1 };

    // Generate frames
    const frames: string[] = [];
    const totalPositions = hide ? length + charWidth : length;

    for (let pos = 0; pos < totalPositions; pos++) {
      const frameCells: Cell[] = [];
      const startPos = right ? (length - pos - 1) : (pos - (hide ? charWidth : 0));

      for (let i = 0; i < length; i++) {
        const charIndex = i - startPos;
        if (charIndex >= 0 && charIndex < charCells.length) {
          frameCells.push(charCells[charIndex]);
        } else if (wrap && charIndex < 0) {
          const wrappedIndex = (charIndex % charCells.length + charCells.length) % charCells.length;
          if (wrappedIndex < charCells.length) {
            frameCells.push(charCells[wrappedIndex]);
          } else {
            frameCells.push(bgCell);
          }
        } else {
          frameCells.push(bgCell);
        }
      }

      frames.push(cellsToString(fixCells(frameCells, length)));
    }

    const spec: SpinnerSpec = { frames: [frames] };
    return compileSpinner(spec, length);
  };
}

/**
 * Create a bouncing spinner where characters bounce back and forth.
 */
export function bouncingSpinner(
  chars: string | [string, string],
  options: {
    length?: number;
    background?: string;
  } = {}
): SpinnerFactory {
  const { background = ' ' } = options;

  const [forwardChars, backwardChars] = typeof chars === 'string'
    ? [chars, chars]
    : chars;

  return (length: number) => {
    const forwardCells = toCells(forwardChars);
    const backwardCells = toCells(backwardChars);
    const charWidth = getCellsWidth(forwardCells);
    const bgCell: Cell = { grapheme: background, width: 1 };

    const frames: string[] = [];
    const maxPos = length - charWidth;

    // Forward
    for (let pos = 0; pos <= maxPos; pos++) {
      const frameCells: Cell[] = [];
      for (let i = 0; i < length; i++) {
        const charIndex = i - pos;
        if (charIndex >= 0 && charIndex < forwardCells.length) {
          frameCells.push(forwardCells[charIndex]);
        } else {
          frameCells.push(bgCell);
        }
      }
      frames.push(cellsToString(fixCells(frameCells, length)));
    }

    // Backward
    for (let pos = maxPos - 1; pos > 0; pos--) {
      const frameCells: Cell[] = [];
      for (let i = 0; i < length; i++) {
        const charIndex = i - pos;
        if (charIndex >= 0 && charIndex < backwardCells.length) {
          frameCells.push(backwardCells[charIndex]);
        } else {
          frameCells.push(bgCell);
        }
      }
      frames.push(cellsToString(fixCells(frameCells, length)));
    }

    const spec: SpinnerSpec = { frames: [frames] };
    return compileSpinner(spec, length);
  };
}

/**
 * Create a sequential spinner that plays multiple spinners one after another.
 */
export function sequentialSpinner(...factories: SpinnerFactory[]): SpinnerFactory {
  return (length: number) => {
    const spinners = factories.map(f => f(length));
    let currentIndex = 0;
    let frameCount = 0;
    const framesPerSpinner = 20;  // Switch spinner after this many frames

    return () => {
      const frame = spinners[currentIndex]();
      frameCount++;

      if (frameCount >= framesPerSpinner) {
        frameCount = 0;
        currentIndex = (currentIndex + 1) % spinners.length;
      }

      return frame;
    };
  };
}

/**
 * Create an alongside spinner that shows multiple spinners side by side.
 */
export function alongsideSpinner(...factories: SpinnerFactory[]): SpinnerFactory {
  return (length: number) => {
    const perSpinner = Math.floor(length / factories.length);
    const spinners = factories.map(f => f(perSpinner));

    return () => {
      const parts = spinners.map(s => s().content);
      const combined = parts.join('');
      const cells = fixCells(toCells(combined), length);
      return {
        content: cellsToString(cells),
        width: length
      };
    };
  };
}

/**
 * Create a delayed spinner that shows the same animation multiple times with offset.
 */
export function delayedSpinner(factory: SpinnerFactory, count: number, offset: number = 1): SpinnerFactory {
  return (length: number) => {
    const perCopy = Math.floor(length / count);
    const spinners: Spinner[] = [];

    // Create spinner copies with different starting positions
    for (let i = 0; i < count; i++) {
      const spinner = factory(perCopy);
      // Advance each copy by offset frames
      for (let j = 0; j < i * offset; j++) {
        spinner();
      }
      spinners.push(spinner);
    }

    return () => {
      const parts = spinners.map(s => s().content);
      const combined = parts.join('');
      const cells = fixCells(toCells(combined), length);
      return {
        content: cellsToString(cells),
        width: length
      };
    };
  };
}

/**
 * Utility to create a spinner that pulses between states.
 */
export function pulsingSpinner(states: string[], pause: number = 2): SpinnerFactory {
  const frames: string[] = [];

  // Add each state with pauses
  for (let i = 0; i < states.length; i++) {
    for (let p = 0; p < pause; p++) {
      frames.push(states[i]);
    }
  }

  // Reverse back
  for (let i = states.length - 2; i > 0; i--) {
    for (let p = 0; p < pause; p++) {
      frames.push(states[i]);
    }
  }

  return frameSpinner(frames);
}
