/**
 * Cell utilities for handling Unicode grapheme clusters correctly.
 *
 * In terminal display:
 * - Most characters take 1 cell
 * - Wide characters (CJK, some emoji) take 2 cells
 * - Grapheme clusters (emoji with modifiers, flags) may be 1 grapheme but multiple chars
 */

import GraphemeSplitter from 'grapheme-splitter';

const splitter = new GraphemeSplitter();

/**
 * A cell represents a display unit in the terminal.
 * It can be a single character or a grapheme cluster.
 */
export interface Cell {
  grapheme: string;
  width: number;  // 1 or 2 (for wide chars)
}

/**
 * Split a string into grapheme clusters.
 */
export function splitGraphemes(text: string): string[] {
  return splitter.splitGraphemes(text);
}

/**
 * Get the display width of a character.
 * Wide characters (CJK, emoji) return 2, others return 1.
 */
export function getCharWidth(char: string): number {
  const code = char.codePointAt(0);
  if (code === undefined) return 0;

  // Common emoji ranges and wide characters
  if (
    // CJK characters
    (code >= 0x4E00 && code <= 0x9FFF) ||
    (code >= 0x3400 && code <= 0x4DBF) ||
    (code >= 0x20000 && code <= 0x2A6DF) ||
    // CJK compatibility
    (code >= 0xF900 && code <= 0xFAFF) ||
    // Fullwidth characters
    (code >= 0xFF00 && code <= 0xFFEF) ||
    // Various emoji ranges
    (code >= 0x1F300 && code <= 0x1F9FF) ||
    (code >= 0x2600 && code <= 0x26FF) ||
    (code >= 0x2700 && code <= 0x27BF) ||
    (code >= 0x1F600 && code <= 0x1F64F) ||
    (code >= 0x1F680 && code <= 0x1F6FF) ||
    (code >= 0x1F1E0 && code <= 0x1F1FF)  // Flags
  ) {
    return 2;
  }

  return 1;
}

/**
 * Get the display width of a grapheme (which may contain multiple codepoints).
 */
export function getGraphemeWidth(grapheme: string): number {
  // For grapheme clusters (like emoji with skin tone), use the base width
  const firstCode = grapheme.codePointAt(0);
  if (firstCode === undefined) return 0;

  // Most emoji grapheme clusters are 2 cells wide
  if (grapheme.length > 1 && firstCode > 0x1F000) {
    return 2;
  }

  return getCharWidth(grapheme);
}

/**
 * Convert a string to cells with width information.
 */
export function toCells(text: string): Cell[] {
  const graphemes = splitGraphemes(text);
  return graphemes.map(grapheme => ({
    grapheme,
    width: getGraphemeWidth(grapheme)
  }));
}

/**
 * Get the total display width of cells.
 */
export function getCellsWidth(cells: Cell[]): number {
  return cells.reduce((sum, cell) => sum + cell.width, 0);
}

/**
 * Get the display width of a string.
 */
export function getStringWidth(text: string): number {
  return getCellsWidth(toCells(text));
}

/**
 * Join cells back into a string.
 */
export function joinCells(cells: Cell[]): string {
  return cells.map(c => c.grapheme).join('');
}

/**
 * Pad cells to a specific width.
 */
export function padCells(cells: Cell[], targetWidth: number, fillChar: string = ' ', align: 'left' | 'right' | 'center' = 'left'): Cell[] {
  const currentWidth = getCellsWidth(cells);
  if (currentWidth >= targetWidth) return cells;

  const paddingNeeded = targetWidth - currentWidth;
  const fillCell: Cell = { grapheme: fillChar, width: getCharWidth(fillChar) };
  const fillCount = Math.ceil(paddingNeeded / fillCell.width);
  const padding = Array(fillCount).fill(fillCell);

  switch (align) {
    case 'right':
      return [...padding, ...cells];
    case 'center':
      const leftCount = Math.floor(fillCount / 2);
      const rightCount = fillCount - leftCount;
      return [...Array(leftCount).fill(fillCell), ...cells, ...Array(rightCount).fill(fillCell)];
    default:
      return [...cells, ...padding];
  }
}

/**
 * Truncate cells to a specific width.
 */
export function truncateCells(cells: Cell[], maxWidth: number): Cell[] {
  const result: Cell[] = [];
  let width = 0;

  for (const cell of cells) {
    if (width + cell.width > maxWidth) break;
    result.push(cell);
    width += cell.width;
  }

  return result;
}

/**
 * Fix cells to exactly match a target width by truncating or padding.
 */
export function fixCells(cells: Cell[], targetWidth: number, fillChar: string = ' '): Cell[] {
  const currentWidth = getCellsWidth(cells);

  if (currentWidth === targetWidth) return cells;
  if (currentWidth > targetWidth) return truncateCells(cells, targetWidth);
  return padCells(cells, targetWidth, fillChar);
}

/**
 * Create cells from a string.
 */
export function cellsFromString(text: string): Cell[] {
  return toCells(text);
}

/**
 * Convert cells to string.
 */
export function cellsToString(cells: Cell[]): string {
  return joinCells(cells);
}
