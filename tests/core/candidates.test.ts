import { describe, it, expect } from 'vitest';
import {
  ALL_DIGITS,
  NO_DIGITS,
  addDigit,
  removeDigit,
  hasDigit,
  countDigits,
  singleDigit,
  iterateDigits,
  toDigits,
  fromDigits,
} from '@/core/candidates';

describe('candidates', () => {
  it('ALL_DIGITS is 0b111111111 (511)', () => {
    expect(ALL_DIGITS).toBe(0b111111111);
    expect(ALL_DIGITS).toBe(511);
  });

  it('NO_DIGITS is 0', () => {
    expect(NO_DIGITS).toBe(0);
  });

  it('addDigit sets the correct bit', () => {
    expect(addDigit(NO_DIGITS, 1)).toBe(0b000000001);
    expect(addDigit(NO_DIGITS, 5)).toBe(0b000010000);
    expect(addDigit(NO_DIGITS, 9)).toBe(0b100000000);
  });

  it('addDigit is idempotent', () => {
    const c = addDigit(NO_DIGITS, 4);
    expect(addDigit(c, 4)).toBe(c);
  });

  it('removeDigit clears the correct bit', () => {
    expect(removeDigit(ALL_DIGITS, 1)).toBe(0b111111110);
    expect(removeDigit(ALL_DIGITS, 9)).toBe(0b011111111);
    expect(removeDigit(NO_DIGITS, 5)).toBe(NO_DIGITS);
  });

  it('hasDigit returns true when digit is present', () => {
    expect(hasDigit(ALL_DIGITS, 1)).toBe(true);
    expect(hasDigit(ALL_DIGITS, 9)).toBe(true);
    expect(hasDigit(addDigit(NO_DIGITS, 5), 5)).toBe(true);
  });

  it('hasDigit returns false when digit is absent', () => {
    expect(hasDigit(NO_DIGITS, 1)).toBe(false);
    expect(hasDigit(addDigit(NO_DIGITS, 5), 6)).toBe(false);
  });

  it('countDigits matches popcount', () => {
    expect(countDigits(NO_DIGITS)).toBe(0);
    expect(countDigits(ALL_DIGITS)).toBe(9);
    expect(countDigits(fromDigits([2, 4, 7]))).toBe(3);
  });

  it('singleDigit returns the digit when only one is present', () => {
    expect(singleDigit(addDigit(NO_DIGITS, 5))).toBe(5);
    expect(singleDigit(addDigit(NO_DIGITS, 1))).toBe(1);
    expect(singleDigit(addDigit(NO_DIGITS, 9))).toBe(9);
  });

  it('singleDigit returns null when zero or more than one digit', () => {
    expect(singleDigit(NO_DIGITS)).toBeNull();
    expect(singleDigit(ALL_DIGITS)).toBeNull();
    expect(singleDigit(fromDigits([2, 5]))).toBeNull();
  });

  it('iterateDigits yields digits in ascending order', () => {
    expect([...iterateDigits(fromDigits([5, 2, 7]))]).toEqual([2, 5, 7]);
    expect([...iterateDigits(ALL_DIGITS)]).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect([...iterateDigits(NO_DIGITS)]).toEqual([]);
  });

  it('toDigits returns an array of digits ascending', () => {
    expect(toDigits(ALL_DIGITS)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(toDigits(NO_DIGITS)).toEqual([]);
    expect(toDigits(fromDigits([3, 8, 1]))).toEqual([1, 3, 8]);
  });

  it('fromDigits builds the correct mask', () => {
    expect(fromDigits([])).toBe(NO_DIGITS);
    expect(fromDigits([1, 2, 3, 4, 5, 6, 7, 8, 9])).toBe(ALL_DIGITS);
    expect(fromDigits([1])).toBe(0b000000001);
    expect(fromDigits([9])).toBe(0b100000000);
  });

  it('fromDigits is order-independent', () => {
    expect(fromDigits([5, 2, 7])).toBe(fromDigits([7, 5, 2]));
  });
});
