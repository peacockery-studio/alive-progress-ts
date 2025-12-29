import { describe, test, expect } from 'bun:test';
import {
  splitGraphemes,
  getCharWidth,
  getGraphemeWidth,
  toCells,
  getCellsWidth,
  getStringWidth,
  joinCells,
  padCells,
  truncateCells,
  fixCells,
  cellsFromString,
  cellsToString,
  type Cell
} from '../src/utils/cells';

describe('splitGraphemes', () => {
  test('splits ASCII text correctly', () => {
    expect(splitGraphemes('hello')).toEqual(['h', 'e', 'l', 'l', 'o']);
  });

  test('handles empty string', () => {
    expect(splitGraphemes('')).toEqual([]);
  });

  test('splits emoji correctly', () => {
    const result = splitGraphemes('👋🌍');
    expect(result.length).toBe(2);
  });

  test('handles mixed ASCII and emoji', () => {
    const result = splitGraphemes('Hi 👋');
    expect(result).toEqual(['H', 'i', ' ', '👋']);
  });
});

describe('getCharWidth', () => {
  test('ASCII characters have width 1', () => {
    expect(getCharWidth('a')).toBe(1);
    expect(getCharWidth('Z')).toBe(1);
    expect(getCharWidth('0')).toBe(1);
    expect(getCharWidth(' ')).toBe(1);
  });

  test('emoji have width 2', () => {
    expect(getCharWidth('😀')).toBe(2);
    expect(getCharWidth('🌍')).toBe(2);
  });

  test('CJK characters have width 2', () => {
    expect(getCharWidth('中')).toBe(2);
    expect(getCharWidth('日')).toBe(2);
  });
});

describe('getGraphemeWidth', () => {
  test('simple characters', () => {
    expect(getGraphemeWidth('a')).toBe(1);
    expect(getGraphemeWidth('中')).toBe(2);
  });

  test('emoji graphemes', () => {
    expect(getGraphemeWidth('👋')).toBe(2);
  });
});

describe('toCells', () => {
  test('converts ASCII string to cells', () => {
    const cells = toCells('abc');
    expect(cells.length).toBe(3);
    expect(cells[0]).toEqual({ grapheme: 'a', width: 1 });
    expect(cells[1]).toEqual({ grapheme: 'b', width: 1 });
    expect(cells[2]).toEqual({ grapheme: 'c', width: 1 });
  });

  test('handles empty string', () => {
    expect(toCells('')).toEqual([]);
  });

  test('converts emoji to cells with correct width', () => {
    const cells = toCells('👋');
    expect(cells.length).toBe(1);
    expect(cells[0].grapheme).toBe('👋');
    expect(cells[0].width).toBe(2);
  });
});

describe('getCellsWidth', () => {
  test('calculates width of ASCII cells', () => {
    const cells = toCells('hello');
    expect(getCellsWidth(cells)).toBe(5);
  });

  test('calculates width with wide characters', () => {
    const cells = toCells('a中b');
    expect(getCellsWidth(cells)).toBe(4); // 1 + 2 + 1
  });

  test('empty array has width 0', () => {
    expect(getCellsWidth([])).toBe(0);
  });
});

describe('getStringWidth', () => {
  test('ASCII string width', () => {
    expect(getStringWidth('hello')).toBe(5);
  });

  test('string with wide chars', () => {
    expect(getStringWidth('hi中')).toBe(4); // 1 + 1 + 2
  });

  test('empty string', () => {
    expect(getStringWidth('')).toBe(0);
  });
});

describe('joinCells', () => {
  test('joins cells back to string', () => {
    const cells = toCells('hello');
    expect(joinCells(cells)).toBe('hello');
  });

  test('handles empty array', () => {
    expect(joinCells([])).toBe('');
  });
});

describe('padCells', () => {
  test('pads cells to target width (left align)', () => {
    const cells = toCells('hi');
    const padded = padCells(cells, 5, ' ', 'left');
    expect(getCellsWidth(padded)).toBe(5);
    expect(cellsToString(padded)).toBe('hi   ');
  });

  test('pads cells to target width (right align)', () => {
    const cells = toCells('hi');
    const padded = padCells(cells, 5, ' ', 'right');
    expect(getCellsWidth(padded)).toBe(5);
    expect(cellsToString(padded)).toBe('   hi');
  });

  test('pads cells to target width (center align)', () => {
    const cells = toCells('hi');
    const padded = padCells(cells, 6, ' ', 'center');
    expect(getCellsWidth(padded)).toBe(6);
    expect(cellsToString(padded)).toBe('  hi  ');
  });

  test('returns original if already at target width', () => {
    const cells = toCells('hello');
    const padded = padCells(cells, 5, ' ');
    expect(padded).toEqual(cells);
  });

  test('returns original if larger than target width', () => {
    const cells = toCells('hello world');
    const padded = padCells(cells, 5, ' ');
    expect(padded).toEqual(cells);
  });
});

describe('truncateCells', () => {
  test('truncates cells to max width', () => {
    const cells = toCells('hello world');
    const truncated = truncateCells(cells, 5);
    expect(getCellsWidth(truncated)).toBe(5);
    expect(cellsToString(truncated)).toBe('hello');
  });

  test('returns original if under max width', () => {
    const cells = toCells('hi');
    const truncated = truncateCells(cells, 10);
    expect(truncated).toEqual(cells);
  });

  test('handles empty cells', () => {
    expect(truncateCells([], 5)).toEqual([]);
  });
});

describe('fixCells', () => {
  test('pads if too short', () => {
    const cells = toCells('hi');
    const fixed = fixCells(cells, 5, '-');
    expect(getCellsWidth(fixed)).toBe(5);
    expect(cellsToString(fixed)).toBe('hi---');
  });

  test('truncates if too long', () => {
    const cells = toCells('hello world');
    const fixed = fixCells(cells, 5);
    expect(getCellsWidth(fixed)).toBe(5);
    expect(cellsToString(fixed)).toBe('hello');
  });

  test('returns same if exact width', () => {
    const cells = toCells('hello');
    const fixed = fixCells(cells, 5);
    expect(fixed).toEqual(cells);
  });
});

describe('cellsFromString and cellsToString', () => {
  test('roundtrip conversion', () => {
    const original = 'hello world';
    const cells = cellsFromString(original);
    const result = cellsToString(cells);
    expect(result).toBe(original);
  });

  test('roundtrip with emoji', () => {
    const original = 'hi 👋 there';
    const cells = cellsFromString(original);
    const result = cellsToString(cells);
    expect(result).toBe(original);
  });
});
