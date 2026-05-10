import { describe, it, expect } from 'vitest';
import { hasDigit } from '@/core/candidates';
import { parseBoard, formatBoard } from '@/core/parser';
import { getCell } from '@/core/board';

const EASY_PUZZLE =
  '530070000' +
  '600195000' +
  '098000060' +
  '800060003' +
  '400803001' +
  '700020006' +
  '060000280' +
  '000419005' +
  '000080079';

describe('parser', () => {
  it('parses an 81-char puzzle and sets givens', () => {
    const board = parseBoard(EASY_PUZZLE);
    expect(board.cells).toHaveLength(81);
    expect(getCell(board, 0).value).toBe(5);
    expect(getCell(board, 0).given).toBe(true);
    expect(getCell(board, 4).value).toBe(7);
    expect(getCell(board, 4).given).toBe(true);
  });

  it('empty cells have given=false', () => {
    const board = parseBoard(EASY_PUZZLE);
    expect(getCell(board, 2).value).toBe(0);
    expect(getCell(board, 2).given).toBe(false);
  });

  it('candidates propagate from givens', () => {
    const board = parseBoard(EASY_PUZZLE);
    expect(hasDigit(getCell(board, 1).candidates, 5)).toBe(false);
  });

  it('accepts "." as empty cell', () => {
    const dotted = EASY_PUZZLE.replace(/0/g, '.');
    const board = parseBoard(dotted);
    expect(getCell(board, 2).value).toBe(0);
    expect(getCell(board, 0).value).toBe(5);
  });

  it('strips whitespace and newlines before validation', () => {
    const spaced = (EASY_PUZZLE.match(/.{9}/g) ?? []).join('\n');
    const board = parseBoard(spaced);
    expect(getCell(board, 0).value).toBe(5);
  });

  it('throws on wrong length', () => {
    expect(() => parseBoard('123')).toThrow(/length/i);
    expect(() => parseBoard('0'.repeat(82))).toThrow(/length/i);
  });

  it('throws on invalid character with position info', () => {
    const bad = EASY_PUZZLE.slice(0, 5) + 'X' + EASY_PUZZLE.slice(6);
    expect(() => parseBoard(bad)).toThrow(/invalid character/i);
    expect(() => parseBoard(bad)).toThrow(/position/i);
  });

  it('formatBoard produces 81 chars with 0 for empties', () => {
    const board = parseBoard(EASY_PUZZLE);
    const out = formatBoard(board);
    expect(out).toHaveLength(81);
    expect(out).toBe(EASY_PUZZLE);
  });

  it('roundtrip parse -> format equals original (whitespace stripped)', () => {
    const puzzles = [EASY_PUZZLE, '0'.repeat(81)];
    for (const p of puzzles) {
      expect(formatBoard(parseBoard(p))).toBe(p);
    }
  });

  it('roundtrip with dotted input produces 0-formatted output', () => {
    const dotted = EASY_PUZZLE.replace(/0/g, '.');
    expect(formatBoard(parseBoard(dotted))).toBe(EASY_PUZZLE);
  });
});
