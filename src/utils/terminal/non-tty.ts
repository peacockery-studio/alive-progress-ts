/**
 * Non-TTY terminal implementation for pipes, files, and non-interactive environments.
 * Only outputs the final receipt, no animations.
 */

import type { TerminalWriter } from "./tty.js";

/**
 * Non-TTY terminal writer that suppresses animations.
 */
export class NonTTYWriter implements TerminalWriter {
  private readonly stream: NodeJS.WriteStream;
  private buffer = "";

  constructor(stream: NodeJS.WriteStream = process.stdout) {
    this.stream = stream;
  }

  write(_text: string): void {
    // Suppress intermediate output in non-TTY mode
  }

  writeLine(text: string): void {
    // Only print final output lines
    this.stream.write(`${text}\n`);
  }

  clearLine(): void {
    // No-op in non-TTY mode
  }

  carriageReturn(): void {
    // No-op in non-TTY mode
  }

  hideCursor(): void {
    // No-op in non-TTY mode
  }

  showCursor(): void {
    // No-op in non-TTY mode
  }

  flush(): void {
    if (this.buffer) {
      this.stream.write(this.buffer);
      this.buffer = "";
    }
  }

  isInteractive(): boolean {
    return false;
  }

  getWidth(): number {
    return 80; // Default width for non-TTY
  }
}

/**
 * Void writer that suppresses all output.
 */
export class VoidWriter implements TerminalWriter {
  write(_text: string): void {
    // Intentionally empty - void writer suppresses all output
  }
  writeLine(_text: string): void {
    // Intentionally empty - void writer suppresses all output
  }
  clearLine(): void {
    // Intentionally empty - void writer suppresses all output
  }
  carriageReturn(): void {
    // Intentionally empty - void writer suppresses all output
  }
  hideCursor(): void {
    // Intentionally empty - void writer suppresses all output
  }
  showCursor(): void {
    // Intentionally empty - void writer suppresses all output
  }
  flush(): void {
    // Intentionally empty - void writer suppresses all output
  }
  isInteractive(): boolean {
    return false;
  }
  getWidth(): number {
    return 80;
  }
}
