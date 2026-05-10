import { HOUSE_CELLS } from '@/core/houses';
import type { Board, CellIndex, Digit } from '@/types/board';

export function findConflicts(board: Board): ReadonlySet<CellIndex> {
  const set = new Set<CellIndex>();
  for (let h = 0; h < 27; h++) {
    const cells = HOUSE_CELLS[h];
    const byDigit = new Map<Digit, CellIndex[]>();
    for (const c of cells) {
      const v = board.cells[c].value;
      if (v === 0) continue;
      const list = byDigit.get(v) ?? [];
      list.push(c);
      byDigit.set(v, list);
    }
    for (const list of byDigit.values()) {
      if (list.length > 1) {
        for (const c of list) set.add(c);
      }
    }
  }
  return set;
}
