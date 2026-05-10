import type { Board, CellIndex, Digit } from '@/types/board';

export type TechniqueId = string;

export type TechniqueCategory =
  | 'single'
  | 'subset'
  | 'intersection'
  | 'fish'
  | 'wing'
  | 'coloring'
  | 'chain'
  | 'als'
  | 'uniqueness';

export type ExplanationLevel = 'hint' | 'standard' | 'deepDive';

export interface Placement {
  readonly cell: CellIndex;
  readonly digit: Digit;
}

export interface Elimination {
  readonly cell: CellIndex;
  readonly digit: Digit;
}

export interface Highlight {
  readonly cell: CellIndex;
  readonly digit?: Digit;
  readonly kind: 'positive' | 'negative' | 'context';
}

export interface Evidence {
  readonly cells: ReadonlyArray<CellIndex>;
  readonly highlights: ReadonlyArray<Highlight>;
}

export interface Move {
  readonly techniqueId: TechniqueId;
  readonly placements: ReadonlyArray<Placement>;
  readonly eliminations: ReadonlyArray<Elimination>;
  readonly evidence: Evidence;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface Explanation {
  readonly text: string;
  readonly level: ExplanationLevel;
}

export interface Technique {
  readonly id: TechniqueId;
  readonly name: string;
  readonly difficulty: number;
  readonly category: TechniqueCategory;
  detect(board: Board): Move[];
  explain(move: Move, level: ExplanationLevel): Explanation;
}
