import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import Controls from '@/components/Controls';
import { useGameStore } from '@/stores/gameStore';

describe('Controls', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  it('Reset and Prev buttons are disabled at initial state', () => {
    render(<Controls />);
    expect(screen.getByRole('button', { name: /reset/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled();
  });

  it('Next button advances index when clicked', async () => {
    const user = userEvent.setup();
    render(<Controls />);
    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(useGameStore.getState().currentStepIndex).toBe(0);
  });

  it('Play button toggles to Pause label', async () => {
    const user = userEvent.setup();
    render(<Controls />);
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /play/i }));
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
  });

  it('Next button is disabled at last step', () => {
    useGameStore.getState().jumpToEnd();
    render(<Controls />);
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  it('shows step counter', () => {
    render(<Controls />);
    expect(screen.getByText(/Step/)).toBeInTheDocument();
  });

  it('autoplay advances step over time', () => {
    vi.useFakeTimers();
    render(<Controls />);
    act(() => {
      useGameStore.getState().togglePlay();
    });
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(useGameStore.getState().currentStepIndex).toBeGreaterThan(-1);
    vi.useRealTimers();
  });
});
