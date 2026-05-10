import { create } from 'zustand';
import { applyMove } from '@/core/board';
import { parseBoard } from '@/core/parser';
import { solve } from '@/core/solver';
import type { Board } from '@/types/board';
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

interface GameStore {
  initialBoard: Board;
  currentBoard: Board;
  steps: ReadonlyArray<SolveStep>;
  currentStepIndex: number;
  isPlaying: boolean;
  loadPuzzle: (puzzleString: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  jumpTo: (i: number) => void;
  reset: () => void;
  jumpToEnd: () => void;
  togglePlay: () => void;
}

const initialBoard = parseBoard(INITIAL_PUZZLE);
const initialResult = solve(initialBoard);

export const useGameStore = create<GameStore>((set, get) => ({
  initialBoard,
  currentBoard: initialBoard,
  steps: initialResult.steps,
  currentStepIndex: -1,
  isPlaying: false,
  loadPuzzle: (s) => {
    const board = parseBoard(s);
    const result = solve(board);
    set({
      initialBoard: board,
      currentBoard: board,
      steps: result.steps,
      currentStepIndex: -1,
      isPlaying: false,
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
}));
