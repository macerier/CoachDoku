import type { CellIndex, HouseIndex } from '@/types/board';
import { CELL_HOUSES, HOUSE_CELLS } from '@/core/houses';

function buildPeers(): ReadonlyArray<ReadonlyArray<CellIndex>> {
  const peers: CellIndex[][] = [];
  for (let c = 0; c < 81; c++) {
    const peerSet = new Set<CellIndex>();
    for (const h of CELL_HOUSES[c]) {
      for (const other of HOUSE_CELLS[h]) {
        if (other !== c) {
          peerSet.add(other);
        }
      }
    }
    peers.push([...peerSet]);
  }
  return peers;
}

export const PEERS: ReadonlyArray<ReadonlyArray<CellIndex>> = buildPeers();

const PEER_SETS: ReadonlyArray<ReadonlySet<CellIndex>> = PEERS.map((arr) => new Set(arr));

export function getPeers(c: CellIndex): ReadonlyArray<CellIndex> {
  return PEERS[c];
}

export function arePeers(a: CellIndex, b: CellIndex): boolean {
  if (a === b) return false;
  return PEER_SETS[a].has(b);
}

export function sharedHouses(a: CellIndex, b: CellIndex): ReadonlyArray<HouseIndex> {
  if (a === b) return [];
  const aHouses = new Set(CELL_HOUSES[a]);
  const result: HouseIndex[] = [];
  for (const h of CELL_HOUSES[b]) {
    if (aHouses.has(h)) {
      result.push(h);
    }
  }
  return result;
}
