import type { Candidates, Digit } from '@/types/board';

export const NO_DIGITS: Candidates = 0;
export const ALL_DIGITS: Candidates = 0b111111111;

function bit(d: Digit): number {
  return 1 << (d - 1);
}

export function addDigit(c: Candidates, d: Digit): Candidates {
  return c | bit(d);
}

export function removeDigit(c: Candidates, d: Digit): Candidates {
  return c & ~bit(d);
}

export function hasDigit(c: Candidates, d: Digit): boolean {
  return (c & bit(d)) !== 0;
}

export function countDigits(c: Candidates): number {
  let count = 0;
  let n = c;
  while (n !== 0) {
    n &= n - 1;
    count++;
  }
  return count;
}

export function singleDigit(c: Candidates): Digit | null {
  if (c === 0 || (c & (c - 1)) !== 0) {
    return null;
  }
  return Math.log2(c) + 1;
}

export function* iterateDigits(c: Candidates): Iterable<Digit> {
  for (let d = 1; d <= 9; d++) {
    if (hasDigit(c, d)) {
      yield d;
    }
  }
}

export function toDigits(c: Candidates): Digit[] {
  return [...iterateDigits(c)];
}

export function fromDigits(digits: Iterable<Digit>): Candidates {
  let c: Candidates = NO_DIGITS;
  for (const d of digits) {
    c = addDigit(c, d);
  }
  return c;
}
