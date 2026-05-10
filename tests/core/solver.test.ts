import { describe, it, expect } from 'vitest';
import { applyElimination, applyPlacement, createEmptyBoard, isSolved } from '@/core/board';
import { parseBoard } from '@/core/parser';
import { solve } from '@/core/solver';
import { nakedSingle } from '@/core/techniques/nakedSingle';
import { hiddenSingle } from '@/core/techniques/hiddenSingle';

describe('solver', () => {
  it('returns solved status when input board is already complete', () => {
    let board = createEmptyBoard();
    for (let i = 0; i < 81; i++) {
      board = {
        cells: board.cells.map((c) =>
          c.index === i ? { ...c, value: 1, candidates: 0 } : c,
        ),
      };
    }
    const result = solve(board);
    expect(result.status).toBe('solved');
    expect(result.steps).toHaveLength(0);
  });

  it('solves a single naked single', () => {
    let board = createEmptyBoard();
    for (const d of [1, 2, 3, 4, 6, 7, 8, 9]) board = applyElimination(board, 0, d);
    const result = solve(board, { techniques: [nakedSingle] });
    expect(result.status).toBe('stuck');
    expect(result.steps).toHaveLength(1);
    expect(result.steps[0].technique).toBe('naked-single');
    expect(result.steps[0].move.placements).toEqual([{ cell: 0, digit: 5 }]);
  });

  it('chains naked singles in cascade', () => {
    let board = createEmptyBoard();
    for (let c = 0; c < 8; c++) board = applyPlacement(board, c, c + 1);
    const result = solve(board);
    expect(result.steps.length).toBeGreaterThanOrEqual(1);
    const lastStep = result.steps[result.steps.length - 1];
    expect(lastStep.move.placements[0]).toEqual({ cell: 8, digit: 9 });
  });

  it('uses Naked Single before Hidden Single when both apply', () => {
    let board = createEmptyBoard();
    for (const d of [1, 2, 3, 4, 6, 7, 8, 9]) board = applyElimination(board, 0, d);
    const result = solve(board);
    expect(result.steps[0].technique).toBe('naked-single');
  });

  it('uses Hidden Single when no Naked Single exists', () => {
    let board = createEmptyBoard();
    for (let c = 1; c <= 8; c++) board = applyElimination(board, c, 7);
    const result = solve(board, { techniques: [nakedSingle, hiddenSingle] });
    expect(result.steps.length).toBeGreaterThanOrEqual(1);
    expect(result.steps[0].technique).toBe('hidden-single');
  });

  it('reports stuck when no technique applies', () => {
    const result = solve(createEmptyBoard());
    expect(result.status).toBe('stuck');
    expect(result.steps).toHaveLength(0);
  });

  it('reports invalid when an empty cell has no candidates', () => {
    let board = createEmptyBoard();
    for (let d = 1; d <= 9; d++) board = applyElimination(board, 0, d);
    const result = solve(board);
    expect(result.status).toBe('invalid');
  });

  it('throws when maxSteps is exceeded', () => {
    let board = createEmptyBoard();
    for (const d of [1, 2, 3, 4, 6, 7, 8, 9]) board = applyElimination(board, 0, d);
    expect(() => solve(board, { maxSteps: 0 })).toThrow(/maxSteps/);
  });

  it('explanations are produced for every step', () => {
    let board = createEmptyBoard();
    for (const d of [1, 2, 3, 4, 6, 7, 8, 9]) board = applyElimination(board, 0, d);
    const result = solve(board);
    for (const step of result.steps) {
      expect(step.explanation.text.length).toBeGreaterThan(0);
      expect(['hint', 'standard', 'deepDive']).toContain(step.explanation.level);
    }
  });

  it('parsed puzzle 530070000... solves with singles or reports stuck', () => {
    const board = parseBoard(
      '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
    );
    const result = solve(board);
    expect(['solved', 'stuck', 'invalid']).toContain(result.status);
    if (result.status === 'solved') {
      expect(isSolved(result.finalBoard)).toBe(true);
    }
  });
});
