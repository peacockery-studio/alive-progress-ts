/**
 * alive-progress - A beautiful, animated progress bar for TypeScript CLI applications.
 *
 * @example
 * import { aliveBar, aliveIt } from 'alive-progress';
 *
 * // Basic usage
 * const { bar, done } = aliveBar(100);
 * for (let i = 0; i < 100; i++) {
 *   await doWork();
 *   bar();
 * }
 * done();
 *
 * // Auto-iterating
 * for await (const item of aliveIt(items)) {
 *   await processItem(item);
 * }
 *
 * @packageDocumentation
 */

// Core progress bar
export { aliveBar, aliveIt, aliveItSync } from './core/progress.js';
export type { ProgressBar, Receipt } from './core/progress.js';

// Configuration
export { config, setGlobalConfig, getGlobalConfig, resetGlobalConfig, resolveConfig } from './core/configuration.js';
export type { AliveBarOptions, ResolvedConfig } from './core/configuration.js';

// Spinner factories
export {
  frameSpinner,
  scrollingSpinner,
  bouncingSpinner,
  sequentialSpinner,
  alongsideSpinner,
  delayedSpinner,
  pulsingSpinner
} from './animations/spinners.js';
export type { Spinner, SpinnerFactory, SpinnerFrame } from './animations/spinners.js';

// Bar factories
export {
  barFactory,
  smoothBar,
  classicBar,
  blocksBar,
  bubblesBar,
  fishBar,
  halloweenBar,
  arrowBar,
  tipOnlyBar
} from './animations/bars.js';
export type { Bar, BarFactory, BarFrame, BarOptions } from './animations/bars.js';

// Built-in styles
export {
  spinners,
  bars,
  themes,
  getSpinner,
  getBar,
  getTheme,
  listSpinners,
  listBars,
  listThemes
} from './styles/internal.js';
export type { Theme } from './styles/internal.js';

// Utilities
export { Timer, ETACalculator, RateSmoother, formatDuration, formatRate } from './utils/timing.js';
export { getStringWidth, splitGraphemes, toCells, getCellsWidth } from './utils/cells.js';
export { colors, brightColors, bgColors, styles, cursor, screen, colorize, style, stripAnsi } from './utils/colors.js';
export { createTerminal, isTTY, getTerminalWidth } from './utils/terminal/index.js';
export type { TerminalWriter, TerminalOptions } from './utils/terminal/index.js';

// Default export for convenience
import { aliveBar, aliveIt } from './core/progress.js';
export default { aliveBar, aliveIt };
