import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import NumberPad from '@/components/NumberPad';
import { useGameStore } from '@/stores/gameStore';

describe('NumberPad', () => {
  beforeEach(() => {
    useGameStore.getState().resetUserBoard();
    useGameStore.getState().selectCell(null);
  });

  it('renders 9 digit buttons and Clear', () => {
    render(<NumberPad />);
    for (let d = 1; d <= 9; d++) {
      expect(screen.getByRole('button', { name: String(d) })).toBeInTheDocument();
    }
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('all digit buttons disabled when no cell selected', () => {
    render(<NumberPad />);
    for (let d = 1; d <= 9; d++) {
      expect(screen.getByRole('button', { name: String(d) })).toBeDisabled();
    }
    expect(screen.getByRole('button', { name: /clear/i })).toBeDisabled();
  });

  it('click on a digit places it in the selected cell', async () => {
    const user = userEvent.setup();
    useGameStore.getState().selectCell(2);
    render(<NumberPad />);
    await user.click(screen.getByRole('button', { name: '5' }));
    expect(useGameStore.getState().userBoard.cells[2].value).toBe(5);
  });

  it('Clear button zeros the selected cell', async () => {
    const user = userEvent.setup();
    useGameStore.getState().selectCell(2);
    useGameStore.getState().inputDigit(5);
    render(<NumberPad />);
    await user.click(screen.getByRole('button', { name: /clear/i }));
    expect(useGameStore.getState().userBoard.cells[2].value).toBe(0);
  });
});
