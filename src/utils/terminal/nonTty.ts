/**
 * Non-TTY terminal implementation for pipes, files, and non-interactive environments.
 * Only outputs the final receipt, no animations.
 */

import type { TerminalWriter } from './tty.js';

/**
 * Non-TTY terminal writer that suppresses animations.
 */
export class NonTTYWriter implements TerminalWriter {
  private stream: NodeJS.WriteStream;
  private buffer: string = '';

  constructor(stream: NodeJS.WriteStream = process.stdout) {
    this.stream = stream;
  }

  write(_text: string): void {
    // Suppress intermediate output in non-TTY mode
  }

  writeLine(text: string): void {
    // Only print final output lines
    this.stream.write(text + '\n');
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
      this.buffer = '';
    }
  }

  isInteractive(): boolean {
    return false;
  }

  getWidth(): number {
    return 80;  // Default width for non-TTY
  }
}

/**
 * Void writer that suppresses all output.
 */
export class VoidWriter implements TerminalWriter {
  write(_text: string): void {}
  writeLine(_text: string): void {}
  clearLine(): void {}
  carriageReturn(): void {}
  hideCursor(): void {}
  showCursor(): void {}
  flush(): void {}
  isInteractive(): boolean { return false; }
  getWidth(): number { return 80; }
}
