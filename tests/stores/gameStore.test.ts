import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '@/stores/gameStore';
import { isSolved } from '@/core/board';

describe('gameStore', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  it('initial state has board, steps, index -1, not playing', () => {
    const s = useGameStore.getState();
    expect(s.initialBoard).toBeDefined();
    expect(s.currentBoard).toBe(s.initialBoard);
    expect(s.currentStepIndex).toBe(-1);
    expect(s.isPlaying).toBe(false);
    expect(s.steps.length).toBeGreaterThan(0);
  });

  it('nextStep advances index to 0 and changes board', () => {
    const before = useGameStore.getState();
    useGameStore.getState().nextStep();
    const after = useGameStore.getState();
    expect(after.currentStepIndex).toBe(0);
    expect(after.currentBoard).not.toBe(before.currentBoard);
  });

  it('nextStep at last step is a no-op', () => {
    useGameStore.getState().jumpToEnd();
    const indexAtEnd = useGameStore.getState().currentStepIndex;
    useGameStore.getState().nextStep();
    expect(useGameStore.getState().currentStepIndex).toBe(indexAtEnd);
  });

  it('prevStep decrements and clamps at -1', () => {
    useGameStore.getState().nextStep();
    useGameStore.getState().nextStep();
    expect(useGameStore.getState().currentStepIndex).toBe(1);
    useGameStore.getState().prevStep();
    expect(useGameStore.getState().currentStepIndex).toBe(0);
    useGameStore.getState().prevStep();
    expect(useGameStore.getState().currentStepIndex).toBe(-1);
    useGameStore.getState().prevStep();
    expect(useGameStore.getState().currentStepIndex).toBe(-1);
  });

  it('prevStep stops playback', () => {
    useGameStore.getState().togglePlay();
    expect(useGameStore.getState().isPlaying).toBe(true);
    useGameStore.getState().prevStep();
    expect(useGameStore.getState().isPlaying).toBe(false);
  });

  it('jumpTo clamps and updates board', () => {
    useGameStore.getState().jumpTo(5);
    expect(useGameStore.getState().currentStepIndex).toBe(5);
    useGameStore.getState().jumpTo(-99);
    expect(useGameStore.getState().currentStepIndex).toBe(-1);
    useGameStore.getState().jumpTo(99999);
    const last = useGameStore.getState().steps.length - 1;
    expect(useGameStore.getState().currentStepIndex).toBe(last);
  });

  it('reset restores initial state', () => {
    useGameStore.getState().nextStep();
    useGameStore.getState().nextStep();
    useGameStore.getState().togglePlay();
    useGameStore.getState().reset();
    const s = useGameStore.getState();
    expect(s.currentStepIndex).toBe(-1);
    expect(s.currentBoard).toBe(s.initialBoard);
    expect(s.isPlaying).toBe(false);
  });

  it('jumpToEnd goes to last step and stops playback', () => {
    useGameStore.getState().togglePlay();
    useGameStore.getState().jumpToEnd();
    const s = useGameStore.getState();
    expect(s.currentStepIndex).toBe(s.steps.length - 1);
    expect(s.isPlaying).toBe(false);
  });

  it('togglePlay flips isPlaying', () => {
    const before = useGameStore.getState().isPlaying;
    useGameStore.getState().togglePlay();
    expect(useGameStore.getState().isPlaying).toBe(!before);
  });

  it('jumpToEnd produces a defined board', () => {
    useGameStore.getState().jumpToEnd();
    const { currentBoard, steps } = useGameStore.getState();
    if (steps.length > 0) {
      expect(currentBoard).toBeDefined();
      expect(typeof isSolved(currentBoard)).toBe('boolean');
    }
  });
});

import { hasDigit } from '@/core/candidates';

describe('gameStore play mode', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
    useGameStore.getState().resetUserBoard();
    useGameStore.getState().setMode('coach');
  });

  it('initial mode is coach; userBoard has stripped candidates on non-givens', () => {
    const s = useGameStore.getState();
    expect(s.mode).toBe('coach');
    for (const cell of s.userBoard.cells) {
      if (!cell.given && cell.value === 0) {
        expect(cell.candidates).toBe(0);
      }
    }
  });

  it('setMode switches mode', () => {
    useGameStore.getState().setMode('play');
    expect(useGameStore.getState().mode).toBe('play');
    useGameStore.getState().setMode('coach');
    expect(useGameStore.getState().mode).toBe('coach');
  });

  it('selectCell sets and clears selection', () => {
    useGameStore.getState().selectCell(40);
    expect(useGameStore.getState().selectedCell).toBe(40);
    useGameStore.getState().selectCell(null);
    expect(useGameStore.getState().selectedCell).toBeNull();
  });

  it('moveSelection clamps within board', () => {
    useGameStore.getState().selectCell(0);
    useGameStore.getState().moveSelection(0, 1);
    expect(useGameStore.getState().selectedCell).toBe(1);
    useGameStore.getState().moveSelection(1, 0);
    expect(useGameStore.getState().selectedCell).toBe(10);
    useGameStore.getState().moveSelection(0, -2);
    expect(useGameStore.getState().selectedCell).toBe(9);
  });

  it('moveSelection from null sets to cell 0', () => {
    useGameStore.getState().selectCell(null);
    useGameStore.getState().moveSelection(0, 1);
    expect(useGameStore.getState().selectedCell).toBe(0);
  });

  it('toggleEditMode flips value and candidate', () => {
    expect(useGameStore.getState().editMode).toBe('value');
    useGameStore.getState().toggleEditMode();
    expect(useGameStore.getState().editMode).toBe('candidate');
    useGameStore.getState().toggleEditMode();
    expect(useGameStore.getState().editMode).toBe('value');
  });

  it('inputDigit in value mode places digit and clears candidates', () => {
    useGameStore.getState().selectCell(2);
    useGameStore.getState().inputDigit(4);
    const cell = useGameStore.getState().userBoard.cells[2];
    expect(cell.value).toBe(4);
    expect(cell.candidates).toBe(0);
  });

  it('inputDigit in candidate mode toggles bit', () => {
    useGameStore.getState().selectCell(2);
    useGameStore.getState().toggleEditMode();
    useGameStore.getState().inputDigit(7);
    let cell = useGameStore.getState().userBoard.cells[2];
    expect(hasDigit(cell.candidates, 7)).toBe(true);
    useGameStore.getState().inputDigit(7);
    cell = useGameStore.getState().userBoard.cells[2];
    expect(hasDigit(cell.candidates, 7)).toBe(false);
  });

  it('inputDigit on given cell is a no-op', () => {
    useGameStore.getState().selectCell(0);
    useGameStore.getState().inputDigit(9);
    expect(useGameStore.getState().userBoard.cells[0].value).toBe(5);
  });

  it('clearCell zeros value and candidates', () => {
    useGameStore.getState().selectCell(2);
    useGameStore.getState().inputDigit(4);
    useGameStore.getState().clearCell();
    const cell = useGameStore.getState().userBoard.cells[2];
    expect(cell.value).toBe(0);
    expect(cell.candidates).toBe(0);
  });

  it('autoFillCandidates populates candidates for empty non-givens', () => {
    useGameStore.getState().autoFillCandidates();
    const s = useGameStore.getState();
    const someEmpty = s.userBoard.cells.find((c) => !c.given && c.value === 0)!;
    expect(someEmpty.candidates).not.toBe(0);
    const c1 = s.userBoard.cells[1];
    if (c1.value === 0) {
      expect(hasDigit(c1.candidates, 5)).toBe(false);
    }
  });

  it('clearAllCandidates zeros candidates on non-given empty cells', () => {
    useGameStore.getState().autoFillCandidates();
    useGameStore.getState().clearAllCandidates();
    const s = useGameStore.getState();
    for (const cell of s.userBoard.cells) {
      if (!cell.given && cell.value === 0) {
        expect(cell.candidates).toBe(0);
      }
    }
  });

  it('undo reverts last edit', () => {
    useGameStore.getState().selectCell(2);
    useGameStore.getState().inputDigit(4);
    expect(useGameStore.getState().userBoard.cells[2].value).toBe(4);
    useGameStore.getState().undo();
    expect(useGameStore.getState().userBoard.cells[2].value).toBe(0);
  });

  it('redo restores after undo', () => {
    useGameStore.getState().selectCell(2);
    useGameStore.getState().inputDigit(4);
    useGameStore.getState().undo();
    useGameStore.getState().redo();
    expect(useGameStore.getState().userBoard.cells[2].value).toBe(4);
  });

  it('new edit after undo truncates redo tail', () => {
    useGameStore.getState().selectCell(2);
    useGameStore.getState().inputDigit(4);
    useGameStore.getState().inputDigit(5);
    useGameStore.getState().undo();
    useGameStore.getState().inputDigit(6);
    useGameStore.getState().redo();
    expect(useGameStore.getState().userBoard.cells[2].value).toBe(6);
  });

  it('resetUserBoard restores stripped initial', () => {
    useGameStore.getState().selectCell(2);
    useGameStore.getState().inputDigit(4);
    useGameStore.getState().resetUserBoard();
    expect(useGameStore.getState().userBoard.cells[2].value).toBe(0);
    expect(useGameStore.getState().historyIndex).toBe(0);
    expect(useGameStore.getState().selectedCell).toBeNull();
  });
});
