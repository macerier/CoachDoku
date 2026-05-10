import type { Board } from '@/types/board';
import type { Explanation, ExplanationLevel, Move, Technique, TechniqueId } from '@/types/move';

export type SolveStatus = 'solved' | 'stuck' | 'invalid';

export interface SolveStep {
  readonly technique: TechniqueId;
  readonly move: Move;
  readonly explanation: Explanation;
}

export interface SolveResult {
  readonly initialBoard: Board;
  readonly finalBoard: Board;
  readonly steps: ReadonlyArray<SolveStep>;
  readonly status: SolveStatus;
}

export interface SolveOptions {
  readonly techniques?: ReadonlyArray<Technique>;
  readonly maxSteps?: number;
  readonly explanationLevel?: ExplanationLevel;
}
