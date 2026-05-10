import { describe, it, expect } from 'vitest';
import { ALL_DIGITS, NO_DIGITS, hasDigit } from '@/core/candidates';
import {
  createEmptyBoard,
  getCell,
  applyPlacement,
  applyElimination,
  applyMove,
  isSolved,
  emptyCells,
  cellsWithCandidate,
} from '@/core/board';
import { getPeers } from '@/core/peers';
import type { Move } from '@/types/move';

describe('board', () => {
  it('createEmptyBoard returns 81 empty cells with all candidates', () => {
    const b = createEmptyBoard();
    expect(b.cells).toHaveLength(81);
    for (const cell of b.cells) {
      expect(cell.value).toBe(0);
      expect(cell.candidates).toBe(ALL_DIGITS);
      expect(cell.given).toBe(false);
    }
  });

  it('getCell returns the cell at a given index', () => {
    const b = createEmptyBoard();
    expect(getCell(b, 0).index).toBe(0);
    expect(getCell(b, 40).index).toBe(40);
    expect(getCell(b, 80).index).toBe(80);
  });

  it('applyPlacement sets value, clears candidates, marks non-given', () => {
    const b = createEmptyBoard();
    const next = applyPlacement(b, 0, 5);
    const cell = getCell(next, 0);
    expect(cell.value).toBe(5);
    expect(cell.candidates).toBe(NO_DIGITS);
    expect(cell.given).toBe(false);
  });

  it('applyPlacement removes the placed digit from all peer candidates', () => {
    const b = createEmptyBoard();
    const next = applyPlacement(b, 0, 5);
    for (const peer of getPeers(0)) {
      expect(hasDigit(getCell(next, peer).candidates, 5)).toBe(false);
    }
  });

  it('applyPlacement does not modify non-peer cells', () => {
    const b = createEmptyBoard();
    const next = applyPlacement(b, 0, 5);
    expect(getCell(next, 80).candidates).toBe(ALL_DIGITS);
  });

  it('applyPlacement returns a new board (immutability)', () => {
    const b = createEmptyBoard();
    const next = applyPlacement(b, 0, 5);
    expect(next).not.toBe(b);
    expect(getCell(b, 0).value).toBe(0);
  });

  it('applyPlacement throws when overwriting a different value', () => {
    const b1 = applyPlacement(createEmptyBoard(), 0, 5);
    expect(() => applyPlacement(b1, 0, 7)).toThrow();
  });

  it('applyPlacement is a no-op when the same value is placed again', () => {
    const b1 = applyPlacement(createEmptyBoard(), 0, 5);
    const b2 = applyPlacement(b1, 0, 5);
    expect(getCell(b2, 0).value).toBe(5);
  });

  it('applyElimination removes a candidate', () => {
    const b = createEmptyBoard();
    const next = applyElimination(b, 0, 5);
    expect(hasDigit(getCell(next, 0).candidates, 5)).toBe(false);
    expect(hasDigit(getCell(next, 0).candidates, 4)).toBe(true);
  });

  it('applyElimination returns the same board reference when no-op', () => {
    const b = applyElimination(createEmptyBoard(), 0, 5);
    const again = applyElimination(b, 0, 5);
    expect(again).toBe(b);
  });

  it('applyMove applies eliminations then placements', () => {
    const b = createEmptyBoard();
    const move: Move = {
      techniqueId: 'test',
      eliminations: [{ cell: 0, digit: 1 }],
      placements: [{ cell: 1, digit: 5 }],
      evidence: { cells: [], highlights: [] },
    };
    const next = applyMove(b, move);
    expect(hasDigit(getCell(next, 0).candidates, 1)).toBe(false);
    expect(getCell(next, 1).value).toBe(5);
  });

  it('isSolved is false for an empty board', () => {
    expect(isSolved(createEmptyBoard())).toBe(false);
  });

  it('isSolved is true when all cells have a value', () => {
    let b = createEmptyBoard();
    for (let i = 0; i < 81; i++) {
      b = {
        cells: b.cells.map((cell) =>
          cell.index === i ? { ...cell, value: 1, candidates: 0 } : cell,
        ),
      };
    }
    expect(isSolved(b)).toBe(true);
  });

  it('emptyCells returns indices with value 0', () => {
    const b = createEmptyBoard();
    expect(emptyCells(b)).toHaveLength(81);
    const next = applyPlacement(b, 5, 3);
    expect(emptyCells(next)).not.toContain(5);
    expect(emptyCells(next)).toHaveLength(80);
  });

  it('cellsWithCandidate returns empty cells that still have the candidate', () => {
    const b = createEmptyBoard();
    const all = cellsWithCandidate(b, 5);
    expect(all).toHaveLength(81);

    const placed = applyPlacement(b, 0, 5);
    const remaining = cellsWithCandidate(placed, 5);
    expect(remaining).not.toContain(0);
    for (const peer of getPeers(0)) {
      expect(remaining).not.toContain(peer);
    }
  });
});
