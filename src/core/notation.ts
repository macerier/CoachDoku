import type { CellIndex, HouseIndex } from '@/types/board';
import { indexToCol, indexToRow, houseIndexToKind, houseIndexToNumber } from '@/core/coords';

export function cellName(c: CellIndex): string {
  return `R${indexToRow(c) + 1}C${indexToCol(c) + 1}`;
}

export function houseName(h: HouseIndex): string {
  const kind = houseIndexToKind(h);
  const n = houseIndexToNumber(h) + 1;
  if (kind === 'row') return `row ${n}`;
  if (kind === 'col') return `column ${n}`;
  return `box ${n}`;
}
