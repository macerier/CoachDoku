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
