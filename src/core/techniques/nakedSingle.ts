import { singleDigit } from '@/core/candidates';
import { cellName } from '@/core/notation';
import { formatTemplate } from '@/i18n/format';
import { EN } from '@/i18n/en';
import type { Board } from '@/types/board';
import type { Explanation, ExplanationLevel, Move, Technique } from '@/types/move';

function detect(board: Board): Move[] {
  const moves: Move[] = [];
  for (const cell of board.cells) {
    if (cell.value !== 0) continue;
    const digit = singleDigit(cell.candidates);
    if (digit === null) continue;

    moves.push({
      techniqueId: 'naked-single',
      placements: [{ cell: cell.index, digit }],
      eliminations: [],
      evidence: {
        cells: [cell.index],
        highlights: [{ cell: cell.index, digit, kind: 'positive' }],
      },
    });
  }
  return moves;
}

function explain(move: Move, level: ExplanationLevel): Explanation {
  const placement = move.placements[0];
  const template = EN.techniques['naked-single'][level];
  const text = formatTemplate(template, {
    cell: cellName(placement.cell),
    digit: placement.digit,
  });
  return { text, level };
}

export const nakedSingle: Technique = {
  id: 'naked-single',
  name: 'Naked Single',
  difficulty: 4,
  category: 'single',
  detect,
  explain,
};
