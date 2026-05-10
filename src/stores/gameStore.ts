import { create } from 'zustand';
import { applyMove } from '@/core/board';
import { hasDigit, removeDigit, addDigit, ALL_DIGITS, NO_DIGITS } from '@/core/candidates';
import { HOUSE_CELLS, CELL_HOUSES } from '@/core/houses';
import { parseBoard } from '@/core/parser';
import { solve } from '@/core/solver';
import { indexToCol, indexToRow, coordsToIndex } from '@/core/coords';
import type { Board, Cell, CellIndex, Digit } from '@/types/board';
import type { SolveStep } from '@/types/solver';

const INITIAL_PUZZLE =
  '530070000' +
  '600195000' +
  '098000060' +
  '800060003' +
  '400803001' +
  '700020006' +
  '060000280' +
  '000419005' +
  '000080079';

const HISTORY_CAP = 100;

function applyStepsThrough(
  initial: Board,
  steps: ReadonlyArray<SolveStep>,
  throughIndex: number,
): Board {
  let board = initial;
  for (let i = 0; i <= throughIndex; i++) {
    board = applyMove(board, steps[i].move);
  }
  return board;
}

function stripCandidates(board: Board): Board {
  return {
    cells: board.cells.map((c) =>
      !c.given && c.value === 0 ? { ...c, candidates: NO_DIGITS } : c,
    ),
  };
}

function computeAutoCandidates(board: Board): Board {
  return {
    cells: board.cells.map((c) => {
      if (c.given || c.value !== 0) return c;
      let candidates = ALL_DIGITS;
      for (const house of CELL_HOUSES[c.index]) {
        for (const peer of HOUSE_CELLS[house]) {
          if (peer === c.index) continue;
          const v = board.cells[peer].value;
          if (v !== 0 && hasDigit(candidates, v)) {
            candidates = removeDigit(candidates, v);
          }
        }
      }
      return { ...c, candidates };
    }),
  };
}

interface GameStore {
  initialBoard: Board;
  currentBoard: Board;
  steps: ReadonlyArray<SolveStep>;
  currentStepIndex: number;
  isPlaying: boolean;

  mode: 'coach' | 'play';
  userBoard: Board;
  selectedCell: CellIndex | null;
  editMode: 'value' | 'candidate';
  history: ReadonlyArray<Board>;
  historyIndex: number;

  loadPuzzle: (puzzleString: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  jumpTo: (i: number) => void;
  reset: () => void;
  jumpToEnd: () => void;
  togglePlay: () => void;

  setMode: (m: 'coach' | 'play') => void;
  selectCell: (c: CellIndex | null) => void;
  moveSelection: (dr: number, dc: number) => void;
  toggleEditMode: () => void;
  inputDigit: (d: Digit) => void;
  clearCell: () => void;
  autoFillCandidates: () => void;
  clearAllCandidates: () => void;
  resetUserBoard: () => void;
  undo: () => void;
  redo: () => void;
}

const initialBoard = parseBoard(INITIAL_PUZZLE);
const initialResult = solve(initialBoard);
const initialUserBoard = stripCandidates(initialBoard);

function pushHistorySlice(
  history: ReadonlyArray<Board>,
  historyIndex: number,
  next: Board,
): { userBoard: Board; history: ReadonlyArray<Board>; historyIndex: number } {
  const truncated = history.slice(0, historyIndex + 1);
  const appended = [...truncated, next];
  const capped = appended.length > HISTORY_CAP ? appended.slice(-HISTORY_CAP) : appended;
  return {
    userBoard: next,
    history: capped,
    historyIndex: capped.length - 1,
  };
}

function updateCell(board: Board, index: CellIndex, patch: Partial<Cell>): Board {
  return {
    cells: board.cells.map((c) => (c.index === index ? { ...c, ...patch } : c)),
  };
}

export const useGameStore = create<GameStore>((set, get) => ({
  initialBoard,
  currentBoard: initialBoard,
  steps: initialResult.steps,
  currentStepIndex: -1,
  isPlaying: false,

  mode: 'coach',
  userBoard: initialUserBoard,
  selectedCell: null,
  editMode: 'value',
  history: [initialUserBoard],
  historyIndex: 0,

  loadPuzzle: (s) => {
    const board = parseBoard(s);
    const result = solve(board);
    const stripped = stripCandidates(board);
    set({
      initialBoard: board,
      currentBoard: board,
      steps: result.steps,
      currentStepIndex: -1,
      isPlaying: false,
      userBoard: stripped,
      selectedCell: null,
      history: [stripped],
      historyIndex: 0,
    });
  },
  nextStep: () => {
    const { steps, currentStepIndex, initialBoard } = get();
    if (currentStepIndex >= steps.length - 1) return;
    const next = currentStepIndex + 1;
    set({
      currentStepIndex: next,
      currentBoard: applyStepsThrough(initialBoard, steps, next),
    });
  },
  prevStep: () => {
    const { steps, currentStepIndex, initialBoard } = get();
    const next = Math.max(currentStepIndex - 1, -1);
    set({
      currentStepIndex: next,
      currentBoard: applyStepsThrough(initialBoard, steps, next),
      isPlaying: false,
    });
  },
  jumpTo: (i) => {
    const { steps, initialBoard } = get();
    const clamped = Math.max(-1, Math.min(i, steps.length - 1));
    set({
      currentStepIndex: clamped,
      currentBoard: applyStepsThrough(initialBoard, steps, clamped),
    });
  },
  reset: () => {
    const { initialBoard } = get();
    set({ currentStepIndex: -1, currentBoard: initialBoard, isPlaying: false });
  },
  jumpToEnd: () => {
    const { steps, initialBoard } = get();
    const last = steps.length - 1;
    set({
      currentStepIndex: last,
      currentBoard: applyStepsThrough(initialBoard, steps, last),
      isPlaying: false,
    });
  },
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

  setMode: (m) => set({ mode: m }),
  selectCell: (c) => set({ selectedCell: c }),
  moveSelection: (dr, dc) => {
    const { selectedCell } = get();
    if (selectedCell === null) {
      set({ selectedCell: 0 });
      return;
    }
    const r = Math.max(0, Math.min(8, indexToRow(selectedCell) + dr));
    const c = Math.max(0, Math.min(8, indexToCol(selectedCell) + dc));
    set({ selectedCell: coordsToIndex(r, c) });
  },
  toggleEditMode: () =>
    set((s) => ({ editMode: s.editMode === 'value' ? 'candidate' : 'value' })),
  inputDigit: (d) => {
    const { userBoard, selectedCell, editMode, history, historyIndex } = get();
    if (selectedCell === null) return;
    const cell = userBoard.cells[selectedCell];
    if (cell.given) return;
    let next: Board;
    if (editMode === 'value') {
      next = updateCell(userBoard, selectedCell, { value: d, candidates: NO_DIGITS });
    } else {
      if (cell.value !== 0) return;
      const toggled = hasDigit(cell.candidates, d)
        ? removeDigit(cell.candidates, d)
        : addDigit(cell.candidates, d);
      next = updateCell(userBoard, selectedCell, { candidates: toggled });
    }
    set(pushHistorySlice(history, historyIndex, next));
  },
  clearCell: () => {
    const { userBoard, selectedCell, history, historyIndex } = get();
    if (selectedCell === null) return;
    const cell = userBoard.cells[selectedCell];
    if (cell.given) return;
    const next = updateCell(userBoard, selectedCell, { value: 0, candidates: NO_DIGITS });
    set(pushHistorySlice(history, historyIndex, next));
  },
  autoFillCandidates: () => {
    const { userBoard, history, historyIndex } = get();
    const next = computeAutoCandidates(userBoard);
    set(pushHistorySlice(history, historyIndex, next));
  },
  clearAllCandidates: () => {
    const { userBoard, history, historyIndex } = get();
    const next = stripCandidates(userBoard);
    set(pushHistorySlice(history, historyIndex, next));
  },
  resetUserBoard: () => {
    const { initialBoard } = get();
    const stripped = stripCandidates(initialBoard);
    set({
      userBoard: stripped,
      history: [stripped],
      historyIndex: 0,
      selectedCell: null,
      editMode: 'value',
    });
  },
  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const i = historyIndex - 1;
    set({ historyIndex: i, userBoard: history[i] });
  },
  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const i = historyIndex + 1;
    set({ historyIndex: i, userBoard: history[i] });
  },
}));
