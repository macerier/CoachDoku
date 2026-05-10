import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import ModeToggle from '@/components/ModeToggle';
import { useGameStore } from '@/stores/gameStore';

describe('ModeToggle', () => {
  beforeEach(() => {
    useGameStore.getState().setMode('coach');
  });

  it('renders both labels', () => {
    render(<ModeToggle />);
    expect(screen.getByRole('button', { name: /coach/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
  });

  it('clicking Play sets mode to play', async () => {
    const user = userEvent.setup();
    render(<ModeToggle />);
    await user.click(screen.getByRole('button', { name: /play/i }));
    expect(useGameStore.getState().mode).toBe('play');
  });

  it('active mode has data-active="true"', () => {
    render(<ModeToggle />);
    expect(screen.getByRole('button', { name: /coach/i })).toHaveAttribute('data-active', 'true');
    expect(screen.getByRole('button', { name: /play/i })).toHaveAttribute('data-active', 'false');
  });
});
