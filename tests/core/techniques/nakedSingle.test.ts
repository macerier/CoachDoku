import { describe, it, expect } from 'vitest';
import { parseBoard } from '@/core/parser';
import { applyElimination, createEmptyBoard, getCell } from '@/core/board';
import { nakedSingle } from '@/core/techniques/nakedSingle';

describe('nakedSingle', () => {
  it('exposes correct metadata', () => {
    expect(nakedSingle.id).toBe('naked-single');
    expect(nakedSingle.name).toBe('Naked Single');
    expect(nakedSingle.difficulty).toBe(4);
    expect(nakedSingle.category).toBe('single');
  });

  it('returns empty array on a fresh empty board', () => {
    expect(nakedSingle.detect(createEmptyBoard())).toEqual([]);
  });

  it('detects a single naked single when a cell has one candidate', () => {
    let board = createEmptyBoard();
    for (const d of [1, 2, 3, 4, 6, 7, 8, 9]) {
      board = applyElimination(board, 0, d);
    }
    expect(getCell(board, 0).candidates).not.toBe(0);

    const moves = nakedSingle.detect(board);
    expect(moves).toHaveLength(1);
    expect(moves[0].techniqueId).toBe('naked-single');
    expect(moves[0].placements).toEqual([{ cell: 0, digit: 5 }]);
    expect(moves[0].eliminations).toEqual([]);
    expect(moves[0].evidence.cells).toEqual([0]);
  });

  it('detects multiple naked singles on the same board', () => {
    let board = createEmptyBoard();
    for (const d of [1, 2, 3, 4, 6, 7, 8, 9]) board = applyElimination(board, 0, d);
    for (const d of [1, 2, 4, 5, 6, 7, 8, 9]) board = applyElimination(board, 80, d);

    const moves = nakedSingle.detect(board);
    expect(moves).toHaveLength(2);
    const placements = moves.map((m) => m.placements[0]);
    expect(placements).toContainEqual({ cell: 0, digit: 5 });
    expect(placements).toContainEqual({ cell: 80, digit: 3 });
  });

  it('does not detect naked singles in cells that already have a value', () => {
    const board = parseBoard('1' + '0'.repeat(80));
    const moves = nakedSingle.detect(board);
    expect(moves.find((m) => m.placements[0].cell === 0)).toBeUndefined();
  });

  it('explain returns non-empty text for all three levels', () => {
    let board = createEmptyBoard();
    for (const d of [1, 2, 3, 4, 6, 7, 8, 9]) board = applyElimination(board, 0, d);
    const move = nakedSingle.detect(board)[0];

    const hint = nakedSingle.explain(move, 'hint');
    const standard = nakedSingle.explain(move, 'standard');
    const deepDive = nakedSingle.explain(move, 'deepDive');

    expect(hint.text).toContain('R1C1');
    expect(standard.text).toContain('R1C1');
    expect(standard.text).toContain('5');
    expect(deepDive.text.length).toBeGreaterThan(20);
    expect(hint.level).toBe('hint');
    expect(standard.level).toBe('standard');
    expect(deepDive.level).toBe('deepDive');
  });
});
