import { describe, it, expect } from 'vitest';
import { applyElimination, createEmptyBoard } from '@/core/board';
import { hiddenSingle } from '@/core/techniques/hiddenSingle';

describe('hiddenSingle', () => {
  it('exposes correct metadata', () => {
    expect(hiddenSingle.id).toBe('hidden-single');
    expect(hiddenSingle.name).toBe('Hidden Single');
    expect(hiddenSingle.difficulty).toBe(14);
    expect(hiddenSingle.category).toBe('single');
  });

  it('returns empty array on a fresh empty board', () => {
    expect(hiddenSingle.detect(createEmptyBoard())).toEqual([]);
  });

  it('detects a hidden single in a row', () => {
    let board = createEmptyBoard();
    for (let c = 1; c <= 8; c++) {
      board = applyElimination(board, c, 7);
    }
    const moves = hiddenSingle.detect(board);
    const rowMoves = moves.filter((m) => m.metadata?.['houseIndex'] === 0);
    expect(rowMoves).toHaveLength(1);
    expect(rowMoves[0].placements).toEqual([{ cell: 0, digit: 7 }]);
    expect(rowMoves[0].techniqueId).toBe('hidden-single');
  });

  it('detects a hidden single in a column', () => {
    let board = createEmptyBoard();
    for (const cell of [9, 18, 27, 36, 45, 54, 63, 72]) {
      board = applyElimination(board, cell, 3);
    }
    const moves = hiddenSingle.detect(board);
    const colMoves = moves.filter((m) => m.metadata?.['houseIndex'] === 9);
    expect(colMoves).toHaveLength(1);
    expect(colMoves[0].placements).toEqual([{ cell: 0, digit: 3 }]);
  });

  it('detects a hidden single in a box', () => {
    let board = createEmptyBoard();
    for (const cell of [1, 2, 9, 10, 11, 18, 19, 20]) {
      board = applyElimination(board, cell, 2);
    }
    const moves = hiddenSingle.detect(board);
    const boxMoves = moves.filter((m) => m.metadata?.['houseIndex'] === 18);
    expect(boxMoves).toHaveLength(1);
    expect(boxMoves[0].placements).toEqual([{ cell: 0, digit: 2 }]);
  });

  it('finds multiple hidden singles on the same board', () => {
    let board = createEmptyBoard();
    for (let c = 1; c <= 8; c++) board = applyElimination(board, c, 7);
    for (const cell of [9, 18, 27, 36, 45, 54, 63, 72]) board = applyElimination(board, cell, 3);
    const moves = hiddenSingle.detect(board);
    expect(moves.length).toBeGreaterThanOrEqual(2);
  });

  it('explain produces text containing house name, digit, and cell', () => {
    let board = createEmptyBoard();
    for (let c = 1; c <= 8; c++) board = applyElimination(board, c, 7);
    const move = hiddenSingle.detect(board).find((m) => m.metadata?.['houseIndex'] === 0)!;
    const text = hiddenSingle.explain(move, 'standard').text;
    expect(text).toContain('row 1');
    expect(text).toContain('7');
    expect(text).toContain('R1C1');
  });

  it('reports separately when the same placement is hidden single in two houses', () => {
    let board = createEmptyBoard();
    for (const cell of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 18, 19, 20]) {
      board = applyElimination(board, cell, 4);
    }
    const moves = hiddenSingle.detect(board).filter((m) => m.placements[0].cell === 0 && m.placements[0].digit === 4);
    expect(moves.length).toBeGreaterThanOrEqual(2);
  });
});
