import type { CellIndex, HouseIndex, HouseKind } from '@/types/board';

export function indexToRow(index: CellIndex): number {
  return Math.floor(index / 9);
}

export function indexToCol(index: CellIndex): number {
  return index % 9;
}

export function indexToBox(index: CellIndex): number {
  const row = indexToRow(index);
  const col = indexToCol(index);
  return Math.floor(row / 3) * 3 + Math.floor(col / 3);
}

export function coordsToIndex(row: number, col: number): CellIndex {
  return row * 9 + col;
}

export function rowColToHouseIndex(kind: HouseKind, n: number): HouseIndex {
  if (kind === 'row') return n;
  if (kind === 'col') return 9 + n;
  return 18 + n;
}

export function houseIndexToKind(h: HouseIndex): HouseKind {
  if (h < 9) return 'row';
  if (h < 18) return 'col';
  return 'box';
}

export function houseIndexToNumber(h: HouseIndex): number {
  if (h < 9) return h;
  if (h < 18) return h - 9;
  return h - 18;
}
