import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import StepList from '@/components/StepList';
import { useGameStore } from '@/stores/gameStore';

describe('StepList', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  it('renders no step rows when currentStepIndex is -1', () => {
    const { container } = render(<StepList />);
    expect(container.querySelectorAll('[data-step-index]')).toHaveLength(0);
  });

  it('renders 3 rows after advancing 3 steps', () => {
    useGameStore.getState().nextStep();
    useGameStore.getState().nextStep();
    useGameStore.getState().nextStep();
    const { container } = render(<StepList />);
    expect(container.querySelectorAll('[data-step-index]')).toHaveLength(3);
  });

  it('marks the current step as active', () => {
    useGameStore.getState().nextStep();
    useGameStore.getState().nextStep();
    const { container } = render(<StepList />);
    const active = container.querySelector('[data-active="true"]');
    expect(active).not.toBeNull();
    expect(active).toHaveAttribute('data-step-index', '1');
  });

  it('shows explanation text', () => {
    useGameStore.getState().nextStep();
    render(<StepList />);
    expect(screen.getByText(/can only be/)).toBeInTheDocument();
  });
});
