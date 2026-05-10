import { describe, it, expect } from 'vitest';
import { cellName, houseName } from '@/core/notation';

describe('notation', () => {
  it('cellName uses 1-indexed RxCx format', () => {
    expect(cellName(0)).toBe('R1C1');
    expect(cellName(8)).toBe('R1C9');
    expect(cellName(9)).toBe('R2C1');
    expect(cellName(40)).toBe('R5C5');
    expect(cellName(80)).toBe('R9C9');
  });

  it('houseName labels rows', () => {
    expect(houseName(0)).toBe('row 1');
    expect(houseName(8)).toBe('row 9');
  });

  it('houseName labels columns', () => {
    expect(houseName(9)).toBe('column 1');
    expect(houseName(17)).toBe('column 9');
  });

  it('houseName labels boxes', () => {
    expect(houseName(18)).toBe('box 1');
    expect(houseName(22)).toBe('box 5');
    expect(houseName(26)).toBe('box 9');
  });
});
