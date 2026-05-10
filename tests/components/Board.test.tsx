import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
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
