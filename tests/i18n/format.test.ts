import { describe, it, expect } from 'vitest';
import { formatTemplate } from '@/i18n/format';

describe('formatTemplate', () => {
  it('substitutes a single placeholder', () => {
    expect(formatTemplate('Cell {cell}', { cell: 'R1C1' })).toBe('Cell R1C1');
  });

  it('substitutes multiple placeholders', () => {
    expect(formatTemplate('{a} and {b}', { a: 1, b: 2 })).toBe('1 and 2');
  });

  it('leaves missing placeholders intact', () => {
    expect(formatTemplate('Cell {cell}', {})).toBe('Cell {cell}');
  });

  it('coerces numbers to strings', () => {
    expect(formatTemplate('digit {d}', { d: 5 })).toBe('digit 5');
  });

  it('repeats the same placeholder', () => {
    expect(formatTemplate('{x}-{x}', { x: 7 })).toBe('7-7');
  });
});
