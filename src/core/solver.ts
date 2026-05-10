import { applyMove, isSolved } from '@/core/board';
import { TECHNIQUE_REGISTRY } from '@/core/techniques';
import type { Board } from '@/types/board';
import type { SolveOptions, SolveResult, SolveStep, SolveStatus } from '@/types/solver';

function isInvalid(board: Board): boolean {
  return board.cells.some((cell) => cell.value === 0 && cell.candidates === 0);
}

export function solve(board: Board, options: SolveOptions = {}): SolveResult {
  const techniques = options.techniques ?? TECHNIQUE_REGISTRY;
  const level = options.explanationLevel ?? 'standard';
  const maxSteps = options.maxSteps ?? 1000;

  const orderedTechniques = [...techniques].sort((a, b) => a.difficulty - b.difficulty);
  const steps: SolveStep[] = [];
  let current = board;

  if (isInvalid(current)) {
    return { initialBoard: board, finalBoard: current, steps, status: 'invalid' };
  }
  if (isSolved(current)) {
    return { initialBoard: board, finalBoard: current, steps, status: 'solved' };
  }

  let status: SolveStatus = 'stuck';

  while (true) {
    if (steps.length >= maxSteps) {
      throw new Error(`solve: maxSteps exceeded (${maxSteps})`);
    }

    let progressed = false;
    for (const technique of orderedTechniques) {
      const moves = technique.detect(current);
      if (moves.length === 0) continue;

      const move = moves[0];
      current = applyMove(current, move);
      const explanation = technique.explain(move, level);
      steps.push({ technique: technique.id, move, explanation });
      progressed = true;
      break;
    }

    if (!progressed) {
      status = 'stuck';
      break;
    }

    if (isInvalid(current)) {
      status = 'invalid';
      break;
    }

    if (isSolved(current)) {
      status = 'solved';
      break;
    }
  }

  return { initialBoard: board, finalBoard: current, steps, status };
}
