import type { Board, Cell, Digit } from '@/types/board';
import { applyPlacement, createEmptyBoard, getCell } from '@/core/board';

const VALID_DIGITS = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
const EMPTY_CHARS = new Set(['0', '.']);

export function parseBoard(input: string): Board {
  const stripped = input.replace(/\s+/g, '');
  if (stripped.length !== 81) {
    throw new Error(`parseBoard: invalid length, expected 81 characters, got ${stripped.length}`);
  }

  let board = createEmptyBoard();
  const placements: { index: number; digit: Digit }[] = [];

  for (let i = 0; i < 81; i++) {
    const ch = stripped[i];
    if (EMPTY_CHARS.has(ch)) {
      continue;
    }
    if (!VALID_DIGITS.has(ch)) {
      throw new Error(`parseBoard: invalid character ${ch} at position ${i}`);
    }
    placements.push({ index: i, digit: Number(ch) as Digit });
  }

  for (const { index, digit } of placements) {
    board = applyPlacement(board, index, digit);
  }

  const cells: Cell[] = board.cells.map((cell) =>
    cell.value !== 0 ? { ...cell, given: true } : cell,
  );

  return { cells };
}

export function formatBoard(board: Board): string {
  let out = '';
  for (let i = 0; i < 81; i++) {
    const value = getCell(board, i).value;
    out += value === 0 ? '0' : String(value);
  }
  return out;
}
