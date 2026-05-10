import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import Cell from '@/components/Cell';
import type { Cell as CellType } from '@/types/board';
import { ALL_DIGITS, fromDigits } from '@/core/candidates';

function makeCell(over: Partial<CellType>): CellType {
  return {
    index: 0,
    value: 0,
    candidates: ALL_DIGITS,
    given: false,
    ...over,
  };
}

describe('Cell', () => {
  it('renders the digit when value is set, as a given', () => {
    render(<Cell cell={makeCell({ value: 5, given: true, candidates: 0 })} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('marks given cells with distinct class', () => {
    const { container } = render(
      <Cell cell={makeCell({ value: 5, given: true, candidates: 0 })} />,
    );
    expect(container.firstChild).toHaveAttribute('data-given', 'true');
  });

  it('marks solver-placed cells with data-given=false', () => {
    const { container } = render(
      <Cell cell={makeCell({ value: 5, given: false, candidates: 0 })} />,
    );
    expect(container.firstChild).toHaveAttribute('data-given', 'false');
  });

  it('renders candidates micro-grid when value is 0', () => {
    render(<Cell cell={makeCell({ value: 0, candidates: fromDigits([1, 5, 9]) })} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
  });

  it('applies positive highlight class when highlight kind is positive', () => {
    const { container } = render(
      <Cell
        cell={makeCell({ value: 0 })}
        highlight={{ cell: 0, kind: 'positive' }}
      />,
    );
    expect(container.firstChild).toHaveAttribute('data-highlight', 'positive');
  });

  it('applies context highlight', () => {
    const { container } = render(
      <Cell
        cell={makeCell({ value: 0 })}
        highlight={{ cell: 0, kind: 'context' }}
      />,
    );
    expect(container.firstChild).toHaveAttribute('data-highlight', 'context');
  });
});

describe('Cell interactivity', () => {
  it('calls onClick when interactive and clicked', async () => {
    const onClick = vi.fn();
    const { container } = render(
      <Cell cell={makeCell({ value: 0, index: 1 })} interactive onClick={onClick} />,
    );
    const user = userEvent.setup();
    await user.click(container.firstChild as Element);
    expect(onClick).toHaveBeenCalled();
  });

  it('marks data-selected when selected prop is true', () => {
    const { container } = render(
      <Cell cell={makeCell({ value: 0 })} selected={true} />,
    );
    expect(container.firstChild).toHaveAttribute('data-selected', 'true');
  });

  it('marks data-conflict when conflict prop is true', () => {
    const { container } = render(
      <Cell cell={makeCell({ value: 5, given: false, candidates: 0 })} conflict={true} />,
    );
    expect(container.firstChild).toHaveAttribute('data-conflict', 'true');
  });
});
