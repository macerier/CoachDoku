import { describe, it, expect } from 'vitest';
import { PEERS, getPeers, arePeers, sharedHouses } from '@/core/peers';

describe('peers', () => {
  it('PEERS has 81 entries', () => {
    expect(PEERS).toHaveLength(81);
  });

  it('every cell has exactly 20 peers', () => {
    for (let i = 0; i < 81; i++) {
      expect(PEERS[i]).toHaveLength(20);
    }
  });

  it('a cell is not its own peer', () => {
    for (let i = 0; i < 81; i++) {
      expect(PEERS[i]).not.toContain(i);
    }
  });

  it('peers of cell 0 are row 0 + col 0 + box 0 minus self', () => {
    const expected = new Set<number>([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 18, 27, 36, 45, 54, 63, 72, 10, 11, 19, 20,
    ]);
    expect(new Set(PEERS[0])).toEqual(expected);
  });

  it('arePeers true for cells in same row', () => {
    expect(arePeers(0, 1)).toBe(true);
    expect(arePeers(0, 8)).toBe(true);
  });

  it('arePeers true for cells in same col', () => {
    expect(arePeers(0, 9)).toBe(true);
    expect(arePeers(0, 72)).toBe(true);
  });

  it('arePeers true for cells in same box', () => {
    expect(arePeers(0, 10)).toBe(true);
    expect(arePeers(0, 20)).toBe(true);
  });

  it('arePeers false for unrelated cells', () => {
    expect(arePeers(0, 12)).toBe(false);
    expect(arePeers(0, 80)).toBe(false);
  });

  it('arePeers false for a cell and itself', () => {
    expect(arePeers(40, 40)).toBe(false);
  });

  it('getPeers returns the same as PEERS[c]', () => {
    for (let c = 0; c < 81; c++) {
      expect([...getPeers(c)]).toEqual([...PEERS[c]]);
    }
  });

  it('sharedHouses returns one element for two cells in same row only', () => {
    const houses = sharedHouses(0, 5);
    expect(houses).toHaveLength(1);
    expect(houses[0]).toBe(0);
  });

  it('sharedHouses returns two elements for cells in same row AND same box', () => {
    const houses = [...sharedHouses(0, 2)].sort((a, b) => a - b);
    expect(houses).toEqual([0, 18]);
  });

  it('sharedHouses returns empty for the same cell', () => {
    expect([...sharedHouses(40, 40)]).toEqual([]);
  });

  it('sharedHouses returns empty for unrelated cells', () => {
    expect([...sharedHouses(0, 80)]).toEqual([]);
  });
});
