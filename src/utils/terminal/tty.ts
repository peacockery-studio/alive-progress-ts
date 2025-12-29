/**
 * TTY terminal implementation with full ANSI support.
 */

import { cursor, screen } from '../colors.js';

export interface TerminalWriter {
  write(text: string): void;
  writeLine(text: string): void;
  clearLine(): void;
  carriageReturn(): void;
  hideCursor(): void;
  showCursor(): void;
  flush(): void;
  isInteractive(): boolean;
  getWidth(): number;
}

/**
 * TTY terminal writer with full animation support.
 */
export class TTYWriter implements TerminalWriter {
  private stream: NodeJS.WriteStream;

  constructor(stream: NodeJS.WriteStream = process.stdout) {
    this.stream = stream;
  }

  write(text: string): void {
    this.stream.write(text);
  }

  writeLine(text: string): void {
    this.stream.write(text + '\n');
  }

  clearLine(): void {
    this.stream.write(screen.clearLine + cursor.toColumn(1));
  }

  carriageReturn(): void {
    this.stream.write('\r');
  }

  hideCursor(): void {
    this.stream.write(cursor.hide);
  }

  showCursor(): void {
    this.stream.write(cursor.show);
  }

  flush(): void {
    // Node.js stdout is buffered, but write is synchronous for TTY
  }

  isInteractive(): boolean {
    return this.stream.isTTY === true;
  }

  getWidth(): number {
    return this.stream.columns || 80;
  }
}
