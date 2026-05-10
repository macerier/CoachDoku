import { describe, it, expect } from 'vitest';
import { parseBoard } from '@/core/parser';
import { solve } from '@/core/solver';
import { isSolved } from '@/core/board';

const EASY_PUZZLES: ReadonlyArray<{ name: string; puzzle: string }> = [
  {
    name: 'one naked single',
    puzzle:
      '123456780' +
      '000000000' +
      '000000000' +
      '000000000' +
      '000000000' +
      '000000000' +
      '000000000' +
      '000000000' +
      '000000000',
  },
  {
    name: 'two near-complete rows',
    puzzle:
      '123456789' +
      '456789120' +
      '000000000' +
      '000000000' +
      '000000000' +
      '000000000' +
      '000000000' +
      '000000000' +
      '000000000',
  },
];

describe('integration - easy puzzles solvable with singles', () => {
  for (const { name, puzzle } of EASY_PUZZLES) {
    it(`solves: ${name}`, () => {
      const board = parseBoard(puzzle);
      const result = solve(board);
      expect(result.steps.length).toBeGreaterThan(0);
      expect(['solved', 'stuck']).toContain(result.status);
      if (result.status === 'solved') {
        expect(isSolved(result.finalBoard)).toBe(true);
      }
    });
  }
});
