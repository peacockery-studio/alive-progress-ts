/**
 * Terminal abstraction layer for different output environments.
 */

import { NonTTYWriter, VoidWriter } from "./non-tty.js";
import { type TerminalWriter, TTYWriter } from "./tty.js";

export { NonTTYWriter, VoidWriter } from "./non-tty.js";
export type { TerminalWriter } from "./tty.js";
export { TTYWriter } from "./tty.js";

export interface TerminalOptions {
  stream?: NodeJS.WriteStream;
  forceTty?: boolean | null;
  disable?: boolean;
}

/**
 * Create a terminal writer based on the environment.
 */
export function createTerminal(options: TerminalOptions = {}): TerminalWriter {
  const { stream = process.stdout, forceTty = null, disable = false } = options;

  // Disabled mode
  if (disable) {
    return new VoidWriter();
  }

  // Force TTY mode if specified
  if (forceTty === true) {
    return new TTYWriter(stream);
  }

  // Force non-TTY mode if specified
  if (forceTty === false) {
    return new NonTTYWriter(stream);
  }

  // Auto-detect based on stream
  if (stream.isTTY) {
    return new TTYWriter(stream);
  }

  return new NonTTYWriter(stream);
}

/**
 * Check if running in a TTY environment.
 */
export function isTTY(stream: NodeJS.WriteStream = process.stdout): boolean {
  return stream.isTTY === true;
}

/**
 * Get terminal width.
 */
export function getTerminalWidth(
  stream: NodeJS.WriteStream = process.stdout
): number {
  return stream.columns || 80;
}
