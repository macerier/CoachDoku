import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import App from '@/App';
import { useGameStore } from '@/stores/gameStore';

describe('Play mode end-to-end', () => {
  beforeEach(() => {
    useGameStore.getState().setMode('coach');
    useGameStore.getState().reset();
    useGameStore.getState().resetUserBoard();
  });

  it('toggling to Play hides Controls and shows PlaySidebar', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /^play$/i }));
    expect(useGameStore.getState().mode).toBe('play');
    expect(screen.getByRole('button', { name: /value/i })).toBeInTheDocument();
    expect(screen.queryByText(/Solver notes/i)).toBeNull();
  });

  it('click cell + click digit places value in userBoard', async () => {
    const user = userEvent.setup();
    useGameStore.getState().setMode('play');
    const { container } = render(<App />);
    const wrapper = container.querySelector('[data-cell-index="2"]');
    const target = wrapper!.firstChild as Element;
    await user.click(target);
    await user.click(screen.getByRole('button', { name: '7' }));
    expect(useGameStore.getState().userBoard.cells[2].value).toBe(7);
  });

  it('keyboard ArrowRight from selected cell 0 then digit 5 places 5 in cell 2', () => {
    useGameStore.getState().setMode('play');
    useGameStore.getState().selectCell(0);
    render(<App />);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(useGameStore.getState().selectedCell).toBe(2);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '5' }));
    expect(useGameStore.getState().userBoard.cells[2].value).toBe(5);
  });

  it('placing a duplicate in row marks conflict', () => {
    useGameStore.getState().setMode('play');
    useGameStore.getState().selectCell(2);
    useGameStore.getState().inputDigit(5);
    const { container } = render(<App />);
    const conflictCells = container.querySelectorAll('[data-conflict="true"]');
    expect(conflictCells.length).toBeGreaterThanOrEqual(2);
  });

  it('Ctrl+Z undoes last edit', () => {
    useGameStore.getState().setMode('play');
    useGameStore.getState().selectCell(2);
    useGameStore.getState().inputDigit(4);
    render(<App />);
    expect(useGameStore.getState().userBoard.cells[2].value).toBe(4);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true }));
    expect(useGameStore.getState().userBoard.cells[2].value).toBe(0);
  });
});
