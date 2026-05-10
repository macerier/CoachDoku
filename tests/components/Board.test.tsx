import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import Board from '@/components/Board';
import { useGameStore } from '@/stores/gameStore';

describe('Board', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  it('renders 81 cells', () => {
    const { container } = render(<Board />);
    expect(container.querySelectorAll('[data-cell-index]')).toHaveLength(81);
  });

  it('displays a given digit from the initial puzzle', () => {
    render(<Board />);
    expect(screen.getAllByText('5').length).toBeGreaterThan(0);
  });

  it('passes highlights from current step to cells', () => {
    useGameStore.getState().nextStep();
    const { container } = render(<Board />);
    const highlighted = container.querySelectorAll('[data-highlight]:not([data-highlight="none"])');
    expect(highlighted.length).toBeGreaterThan(0);
  });
});

describe('Board in play mode', () => {
  beforeEach(() => {
    useGameStore.getState().setMode('play');
    useGameStore.getState().resetUserBoard();
  });

  it('renders userBoard cells in play mode', () => {
    const { container } = render(<Board />);
    expect(container.querySelectorAll('[data-cell-index]')).toHaveLength(81);
  });

  it('marks selected cell with data-selected', () => {
    useGameStore.getState().selectCell(2);
    const { container } = render(<Board />);
    const selectedEls = container.querySelectorAll('[data-selected="true"]');
    expect(selectedEls.length).toBeGreaterThanOrEqual(1);
  });

  it('clicking a non-given cell selects it', async () => {
    const user = userEvent.setup();
    const { container } = render(<Board />);
    const wrapper = container.querySelector('[data-cell-index="2"]');
    expect(wrapper).not.toBeNull();
    const target = wrapper!.firstChild as Element;
    await user.click(target);
    expect(useGameStore.getState().selectedCell).toBe(2);
  });

  it('flags conflict cells when duplicates exist', () => {
    useGameStore.getState().selectCell(2);
    useGameStore.getState().inputDigit(5);
    const { container } = render(<Board />);
    expect(container.querySelector('[data-conflict="true"]')).not.toBeNull();
  });
});
