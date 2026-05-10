import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import PlaySidebar from '@/components/PlaySidebar';
import { useGameStore } from '@/stores/gameStore';

describe('PlaySidebar', () => {
  beforeEach(() => {
    useGameStore.getState().resetUserBoard();
  });

  it('renders edit mode toggle, number pad, and tool buttons', () => {
    render(<PlaySidebar />);
    expect(screen.getByRole('button', { name: /^value$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^candidate$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /clear/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /undo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /redo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /auto-fill/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear marks/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset board/i })).toBeInTheDocument();
  });

  it('Undo is disabled when historyIndex is 0', () => {
    render(<PlaySidebar />);
    expect(screen.getByRole('button', { name: /undo/i })).toBeDisabled();
  });

  it('Redo is disabled when no future history', () => {
    render(<PlaySidebar />);
    expect(screen.getByRole('button', { name: /redo/i })).toBeDisabled();
  });

  it('Auto-fill candidates populates pencil marks', async () => {
    const user = userEvent.setup();
    render(<PlaySidebar />);
    await user.click(screen.getByRole('button', { name: /auto-fill/i }));
    const someEmpty = useGameStore.getState().userBoard.cells.find((c) => !c.given && c.value === 0);
    expect(someEmpty?.candidates).not.toBe(0);
  });
});
