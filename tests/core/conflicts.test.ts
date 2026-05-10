import { describe, it, expect } from 'vitest';
import { findConflicts } from '@/core/conflicts';
import { createEmptyBoard } from '@/core/board';
import type { Board, Cell } from '@/types/board';

function boardWithValues(map: Record<number, number>): Board {
  const base = createEmptyBoard();
  const cells: Cell[] = base.cells.map((c) =>
    map[c.index] !== undefined ? { ...c, value: map[c.index], candidates: 0 } : c,
  );
  return { cells };
}

describe('findConflicts', () => {
  it('returns empty set for an empty board', () => {
    const conflicts = findConflicts(createEmptyBoard());
    expect(conflicts.size).toBe(0);
  });

  it('returns empty set when no duplicates exist', () => {
    const board = boardWithValues({ 0: 5, 9: 6, 18: 7 });
    expect(findConflicts(board).size).toBe(0);
  });

  it('flags two cells in the same row with duplicate value', () => {
    const board = boardWithValues({ 0: 5, 4: 5 });
    const c = findConflicts(board);
    expect(c.has(0)).toBe(true);
    expect(c.has(4)).toBe(true);
    expect(c.size).toBe(2);
  });

  it('flags duplicates in the same column', () => {
    const board = boardWithValues({ 0: 7, 27: 7 });
    const c = findConflicts(board);
    expect(c.has(0)).toBe(true);
    expect(c.has(27)).toBe(true);
  });

  it('flags duplicates in the same box', () => {
    const board = boardWithValues({ 0: 3, 10: 3 });
    const c = findConflicts(board);
    expect(c.has(0)).toBe(true);
    expect(c.has(10)).toBe(true);
  });

  it('flags multiple independent conflicts', () => {
    const board = boardWithValues({ 0: 5, 4: 5, 27: 7, 36: 7 });
    const c = findConflicts(board);
    expect(c.has(0)).toBe(true);
    expect(c.has(4)).toBe(true);
    expect(c.has(27)).toBe(true);
    expect(c.has(36)).toBe(true);
  });
});
