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

export type {
  Bar,
  BarFactory,
  BarFrame,
  BarOptions,
} from "./animations/bars.js";
// Bar factories
export {
  arrowBar,
  barFactory,
  blocksBar,
  bubblesBar,
  classicBar,
  fishBar,
  halloweenBar,
  smoothBar,
  tipOnlyBar,
} from "./animations/bars.js";
export type {
  Spinner,
  SpinnerFactory,
  SpinnerFrame,
} from "./animations/spinners.js";
// Spinner factories
export {
  alongsideSpinner,
  bouncingSpinner,
  delayedSpinner,
  frameSpinner,
  pulsingSpinner,
  scrollingSpinner,
  sequentialSpinner,
} from "./animations/spinners.js";
export type { AliveBarOptions, ResolvedConfig } from "./core/configuration.js";
// Configuration
export {
  config,
  getGlobalConfig,
  resetGlobalConfig,
  resolveConfig,
  setGlobalConfig,
} from "./core/configuration.js";
export type { ProgressBar, Receipt } from "./core/progress.js";
// Core progress bar
export { aliveBar, aliveIt, aliveItSync } from "./core/progress.js";
export type { Theme } from "./styles/internal.js";
// Built-in styles
export {
  bars,
  getBar,
  getSpinner,
  getTheme,
  listBars,
  listSpinners,
  listThemes,
  spinners,
  themes,
} from "./styles/internal.js";
export {
  getCellsWidth,
  getStringWidth,
  splitGraphemes,
  toCells,
} from "./utils/cells.js";
export {
  bgColors,
  brightColors,
  colorize,
  colors,
  cursor,
  screen,
  stripAnsi,
  style,
  styles,
} from "./utils/colors.js";
export type {
  TerminalOptions,
  TerminalWriter,
} from "./utils/terminal/index.js";
export {
  createTerminal,
  getTerminalWidth,
  isTTY,
} from "./utils/terminal/index.js";
// Utilities
export {
  ETACalculator,
  formatDuration,
  formatRate,
  RateSmoother,
  Timer,
} from "./utils/timing.js";

// Default export for convenience
import { aliveBar, aliveIt } from "./core/progress.js";
export default { aliveBar, aliveIt };
