import { describe, it, expect } from 'vitest';
import {
  HOUSE_CELLS,
  CELL_HOUSES,
  getCellsInHouse,
  getHousesForCell,
  getHouse,
} from '@/core/houses';

describe('houses', () => {
  it('HOUSE_CELLS has 27 houses of 9 cells each', () => {
    expect(HOUSE_CELLS).toHaveLength(27);
    for (const house of HOUSE_CELLS) {
      expect(house).toHaveLength(9);
    }
  });

  it('row 0 contains cells 0..8 in order', () => {
    expect([...HOUSE_CELLS[0]]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('row 8 contains cells 72..80', () => {
    expect([...HOUSE_CELLS[8]]).toEqual([72, 73, 74, 75, 76, 77, 78, 79, 80]);
  });

  it('col 0 contains cells 0, 9, 18, ..., 72', () => {
    expect([...HOUSE_CELLS[9]]).toEqual([0, 9, 18, 27, 36, 45, 54, 63, 72]);
  });

  it('col 8 contains cells 8, 17, ..., 80', () => {
    expect([...HOUSE_CELLS[17]]).toEqual([8, 17, 26, 35, 44, 53, 62, 71, 80]);
  });

  it('box 0 contains the top-left 3x3 cells', () => {
    expect([...HOUSE_CELLS[18]].sort((a, b) => a - b)).toEqual([0, 1, 2, 9, 10, 11, 18, 19, 20]);
  });

  it('box 4 contains the center 3x3 cells', () => {
    expect([...HOUSE_CELLS[22]].sort((a, b) => a - b)).toEqual([30, 31, 32, 39, 40, 41, 48, 49, 50]);
  });

  it('box 8 contains the bottom-right 3x3 cells', () => {
    expect([...HOUSE_CELLS[26]].sort((a, b) => a - b)).toEqual([60, 61, 62, 69, 70, 71, 78, 79, 80]);
  });

  it('CELL_HOUSES has 81 entries each of length 3', () => {
    expect(CELL_HOUSES).toHaveLength(81);
    for (const houses of CELL_HOUSES) {
      expect(houses).toHaveLength(3);
    }
  });

  it('cell 0 belongs to row 0, col 0, box 0', () => {
    const houses = [...CELL_HOUSES[0]].sort((a, b) => a - b);
    expect(houses).toEqual([0, 9, 18]);
  });

  it('cell 40 (center) belongs to row 4, col 4, box 4', () => {
    const houses = [...CELL_HOUSES[40]].sort((a, b) => a - b);
    expect(houses).toEqual([4, 13, 22]);
  });

  it('getCellsInHouse returns the same content as HOUSE_CELLS[h]', () => {
    for (let h = 0; h < 27; h++) {
      expect([...getCellsInHouse(h)]).toEqual([...HOUSE_CELLS[h]]);
    }
  });

  it('getHousesForCell returns the same content as CELL_HOUSES[c]', () => {
    for (let c = 0; c < 81; c++) {
      expect([...getHousesForCell(c)]).toEqual([...CELL_HOUSES[c]]);
    }
  });

  it('getHouse(kind, n) maps to correct entry', () => {
    expect([...getHouse('row', 0)]).toEqual([...HOUSE_CELLS[0]]);
    expect([...getHouse('col', 0)]).toEqual([...HOUSE_CELLS[9]]);
    expect([...getHouse('box', 4)]).toEqual([...HOUSE_CELLS[22]]);
  });
});
