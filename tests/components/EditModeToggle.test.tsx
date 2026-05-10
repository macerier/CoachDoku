import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import EditModeToggle from '@/components/EditModeToggle';
import { useGameStore } from '@/stores/gameStore';

describe('EditModeToggle', () => {
  beforeEach(() => {
    useGameStore.setState({ editMode: 'value' });
  });

  it('renders both Value and Candidate buttons', () => {
    render(<EditModeToggle />);
    expect(screen.getByRole('button', { name: /value/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /candidate/i })).toBeInTheDocument();
  });

  it('clicking Candidate sets editMode to candidate', async () => {
    const user = userEvent.setup();
    render(<EditModeToggle />);
    await user.click(screen.getByRole('button', { name: /candidate/i }));
    expect(useGameStore.getState().editMode).toBe('candidate');
  });

  it('active mode has data-active="true"', () => {
    render(<EditModeToggle />);
    expect(screen.getByRole('button', { name: /value/i })).toHaveAttribute('data-active', 'true');
    expect(screen.getByRole('button', { name: /candidate/i })).toHaveAttribute('data-active', 'false');
  });
});
