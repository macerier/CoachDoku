export type CellIndex = number;
export type Digit = number;
export type Candidates = number;
export type HouseIndex = number;
export type HouseKind = 'row' | 'col' | 'box';

export interface Cell {
  readonly index: CellIndex;
  readonly value: Digit | 0;
  readonly candidates: Candidates;
  readonly given: boolean;
}

export interface Board {
  readonly cells: ReadonlyArray<Cell>;
}
