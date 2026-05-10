import { describe, it, expect } from 'vitest';
import {
  indexToRow,
  indexToCol,
  indexToBox,
  coordsToIndex,
  rowColToHouseIndex,
  houseIndexToKind,
  houseIndexToNumber,
} from '@/core/coords';

describe('coords', () => {
  it('indexToRow maps cell index to 0-8 row', () => {
    expect(indexToRow(0)).toBe(0);
    expect(indexToRow(8)).toBe(0);
    expect(indexToRow(9)).toBe(1);
    expect(indexToRow(40)).toBe(4);
    expect(indexToRow(80)).toBe(8);
  });

  it('indexToCol maps cell index to 0-8 col', () => {
    expect(indexToCol(0)).toBe(0);
    expect(indexToCol(8)).toBe(8);
    expect(indexToCol(9)).toBe(0);
    expect(indexToCol(40)).toBe(4);
    expect(indexToCol(80)).toBe(8);
  });

  it('indexToBox maps cell index to 0-8 box', () => {
    expect(indexToBox(0)).toBe(0);
    expect(indexToBox(2)).toBe(0);
    expect(indexToBox(20)).toBe(0);
    expect(indexToBox(21)).toBe(1);
    expect(indexToBox(40)).toBe(4);
    expect(indexToBox(80)).toBe(8);
  });

  it('coordsToIndex matches row * 9 + col', () => {
    expect(coordsToIndex(0, 0)).toBe(0);
    expect(coordsToIndex(4, 4)).toBe(40);
    expect(coordsToIndex(8, 8)).toBe(80);
  });

  it('roundtrip: coordsToIndex(indexToRow(i), indexToCol(i)) === i for all 81 indices', () => {
    for (let i = 0; i < 81; i++) {
      expect(coordsToIndex(indexToRow(i), indexToCol(i))).toBe(i);
    }
  });

  it('rowColToHouseIndex returns 0-8 for row, 9-17 for col, 18-26 for box', () => {
    expect(rowColToHouseIndex('row', 0)).toBe(0);
    expect(rowColToHouseIndex('row', 8)).toBe(8);
    expect(rowColToHouseIndex('col', 0)).toBe(9);
    expect(rowColToHouseIndex('col', 8)).toBe(17);
    expect(rowColToHouseIndex('box', 0)).toBe(18);
    expect(rowColToHouseIndex('box', 8)).toBe(26);
  });

  it('houseIndexToKind classifies the house', () => {
    expect(houseIndexToKind(0)).toBe('row');
    expect(houseIndexToKind(8)).toBe('row');
    expect(houseIndexToKind(9)).toBe('col');
    expect(houseIndexToKind(17)).toBe('col');
    expect(houseIndexToKind(18)).toBe('box');
    expect(houseIndexToKind(26)).toBe('box');
  });

  it('houseIndexToNumber returns 0-8 within the kind', () => {
    expect(houseIndexToNumber(0)).toBe(0);
    expect(houseIndexToNumber(8)).toBe(8);
    expect(houseIndexToNumber(9)).toBe(0);
    expect(houseIndexToNumber(17)).toBe(8);
    expect(houseIndexToNumber(18)).toBe(0);
    expect(houseIndexToNumber(26)).toBe(8);
  });
});
