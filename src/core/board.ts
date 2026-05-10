import type { Board, Cell, CellIndex, Digit } from '@/types/board';
import type { Move } from '@/types/move';
import { ALL_DIGITS, NO_DIGITS, hasDigit, removeDigit } from '@/core/candidates';
import { PEERS } from '@/core/peers';

function makeCell(index: CellIndex): Cell {
  return {
    index,
    value: 0,
    candidates: ALL_DIGITS,
    given: false,
  };
}

export function createEmptyBoard(): Board {
  const cells: Cell[] = [];
  for (let i = 0; i < 81; i++) {
    cells.push(makeCell(i));
  }
  return { cells };
}

export function getCell(board: Board, c: CellIndex): Cell {
  return board.cells[c];
}

export function applyPlacement(board: Board, c: CellIndex, d: Digit): Board {
  const current = board.cells[c];
  if (current.value !== 0 && current.value !== d) {
    throw new Error(
      `applyPlacement: cell ${c} already has value ${current.value}, cannot place ${d}`,
    );
  }
  if (current.value === d) {
    return board;
  }

  const peerSet = new Set(PEERS[c]);
  const nextCells = board.cells.map((cell) => {
    if (cell.index === c) {
      return { ...cell, value: d, candidates: NO_DIGITS, given: false };
    }
    if (peerSet.has(cell.index) && hasDigit(cell.candidates, d)) {
      return { ...cell, candidates: removeDigit(cell.candidates, d) };
    }
    return cell;
  });

  return { cells: nextCells };
}

export function applyElimination(board: Board, c: CellIndex, d: Digit): Board {
  const cell = board.cells[c];
  if (!hasDigit(cell.candidates, d)) {
    return board;
  }
  const nextCells = board.cells.map((current) =>
    current.index === c ? { ...current, candidates: removeDigit(current.candidates, d) } : current,
  );
  return { cells: nextCells };
}

export function applyMove(board: Board, move: Move): Board {
  let next = board;
  for (const elim of move.eliminations) {
    next = applyElimination(next, elim.cell, elim.digit);
  }
  for (const place of move.placements) {
    next = applyPlacement(next, place.cell, place.digit);
  }
  return next;
}

export function isSolved(board: Board): boolean {
  return board.cells.every((cell) => cell.value !== 0);
}

export function emptyCells(board: Board): CellIndex[] {
  return board.cells.filter((cell) => cell.value === 0).map((cell) => cell.index);
}

export function cellsWithCandidate(board: Board, d: Digit): CellIndex[] {
  return board.cells
    .filter((cell) => cell.value === 0 && hasDigit(cell.candidates, d))
    .map((cell) => cell.index);
}
