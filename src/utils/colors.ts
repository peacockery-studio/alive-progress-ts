/**
 * ANSI color and styling utilities for terminal output.
 */

// ANSI escape codes
export const ESC = "\x1b";
export const CSI = `${ESC}[`;

// Reset all styles
export const RESET = `${CSI}0m`;

// Basic colors
export const colors = {
  black: `${CSI}30m`,
  red: `${CSI}31m`,
  green: `${CSI}32m`,
  yellow: `${CSI}33m`,
  blue: `${CSI}34m`,
  magenta: `${CSI}35m`,
  cyan: `${CSI}36m`,
  white: `${CSI}37m`,
  default: `${CSI}39m`,
} as const;

// Bright colors
export const brightColors = {
  black: `${CSI}90m`,
  red: `${CSI}91m`,
  green: `${CSI}92m`,
  yellow: `${CSI}93m`,
  blue: `${CSI}94m`,
  magenta: `${CSI}95m`,
  cyan: `${CSI}96m`,
  white: `${CSI}97m`,
} as const;

// Background colors
export const bgColors = {
  black: `${CSI}40m`,
  red: `${CSI}41m`,
  green: `${CSI}42m`,
  yellow: `${CSI}43m`,
  blue: `${CSI}44m`,
  magenta: `${CSI}45m`,
  cyan: `${CSI}46m`,
  white: `${CSI}47m`,
  default: `${CSI}49m`,
} as const;

// Text styles
export const styles = {
  bold: `${CSI}1m`,
  dim: `${CSI}2m`,
  italic: `${CSI}3m`,
  underline: `${CSI}4m`,
  blink: `${CSI}5m`,
  inverse: `${CSI}7m`,
  hidden: `${CSI}8m`,
  strikethrough: `${CSI}9m`,
} as const;

// Cursor control
export const cursor = {
  hide: `${CSI}?25l`,
  show: `${CSI}?25h`,
  up: (n = 1) => `${CSI}${n}A`,
  down: (n = 1) => `${CSI}${n}B`,
  forward: (n = 1) => `${CSI}${n}C`,
  back: (n = 1) => `${CSI}${n}D`,
  toColumn: (n: number) => `${CSI}${n}G`,
  toPosition: (row: number, col: number) => `${CSI}${row};${col}H`,
  save: `${CSI}s`,
  restore: `${CSI}u`,
} as const;

// Line/screen control
export const screen = {
  clearLine: `${CSI}2K`,
  clearLineEnd: `${CSI}0K`,
  clearLineStart: `${CSI}1K`,
  clearScreen: `${CSI}2J`,
  clearScreenEnd: `${CSI}0J`,
  clearScreenStart: `${CSI}1J`,
} as const;

/**
 * Apply a color to text.
 */
export function colorize(text: string, color: string): string {
  return `${color}${text}${RESET}`;
}

/**
 * Apply multiple styles to text.
 */
export function style(text: string, ...codes: string[]): string {
  return `${codes.join("")}${text}${RESET}`;
}

/**
 * Create a 256-color foreground code.
 */
export function fg256(colorCode: number): string {
  return `${CSI}38;5;${colorCode}m`;
}

/**
 * Create a 256-color background code.
 */
export function bg256(colorCode: number): string {
  return `${CSI}48;5;${colorCode}m`;
}

/**
 * Create an RGB foreground color.
 */
export function fgRgb(r: number, g: number, b: number): string {
  return `${CSI}38;2;${r};${g};${b}m`;
}

/**
 * Create an RGB background color.
 */
export function bgRgb(r: number, g: number, b: number): string {
  return `${CSI}48;2;${r};${g};${b}m`;
}

/**
 * Strip ANSI codes from a string.
 */
export function stripAnsi(text: string): string {
  // Using Unicode escape for ESC character to satisfy linter
  // biome-ignore lint/suspicious/noControlCharactersInRegex: ANSI escape codes require control characters
  return text.replace(/\x1b\[[0-9;]*m/g, "");
}

/**
 * Get the visible length of a string (excluding ANSI codes).
 */
export function visibleLength(text: string): number {
  return stripAnsi(text).length;
}
