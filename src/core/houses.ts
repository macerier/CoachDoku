import type { CellIndex, HouseIndex, HouseKind } from '@/types/board';
import {
  coordsToIndex,
  indexToBox,
  indexToCol,
  indexToRow,
  rowColToHouseIndex,
} from '@/core/coords';

function buildHouseCells(): ReadonlyArray<ReadonlyArray<CellIndex>> {
  const houses: CellIndex[][] = [];

  for (let r = 0; r < 9; r++) {
    const row: CellIndex[] = [];
    for (let c = 0; c < 9; c++) {
      row.push(coordsToIndex(r, c));
    }
    houses.push(row);
  }

  for (let c = 0; c < 9; c++) {
    const col: CellIndex[] = [];
    for (let r = 0; r < 9; r++) {
      col.push(coordsToIndex(r, c));
    }
    houses.push(col);
  }

  for (let b = 0; b < 9; b++) {
    const box: CellIndex[] = [];
    const startRow = Math.floor(b / 3) * 3;
    const startCol = (b % 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        box.push(coordsToIndex(r, c));
      }
    }
    houses.push(box);
  }

  return houses;
}

function buildCellHouses(): ReadonlyArray<ReadonlyArray<HouseIndex>> {
  const cellHouses: HouseIndex[][] = [];
  for (let i = 0; i < 81; i++) {
    cellHouses.push([
      rowColToHouseIndex('row', indexToRow(i)),
      rowColToHouseIndex('col', indexToCol(i)),
      rowColToHouseIndex('box', indexToBox(i)),
    ]);
  }
  return cellHouses;
}

export const HOUSE_CELLS: ReadonlyArray<ReadonlyArray<CellIndex>> = buildHouseCells();
export const CELL_HOUSES: ReadonlyArray<ReadonlyArray<HouseIndex>> = buildCellHouses();

export function getCellsInHouse(h: HouseIndex): ReadonlyArray<CellIndex> {
  return HOUSE_CELLS[h];
}

export function getHousesForCell(c: CellIndex): ReadonlyArray<HouseIndex> {
  return CELL_HOUSES[c];
}

export function getHouse(kind: HouseKind, n: number): ReadonlyArray<CellIndex> {
  return HOUSE_CELLS[rowColToHouseIndex(kind, n)];
}
