import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import App from '@/App';
import { useGameStore } from '@/stores/gameStore';

describe('UI playthrough', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  it('clicking Next advances the board state', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(useGameStore.getState().currentStepIndex).toBe(-1);
    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(useGameStore.getState().currentStepIndex).toBe(0);
  });

  it('clicking Play then advancing fake timers steps the board', async () => {
    const user = userEvent.setup();
    render(<App />);
    const playButtons = screen.getAllByRole('button', { name: /play/i });
    await user.click(playButtons[1]);
    expect(useGameStore.getState().isPlaying).toBe(true);
  });

  it('clicking Reset returns to initial', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.click(screen.getByRole('button', { name: /reset/i }));
    expect(useGameStore.getState().currentStepIndex).toBe(-1);
  });
});
