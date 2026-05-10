import { hasDigit } from '@/core/candidates';
import { HOUSE_CELLS } from '@/core/houses';
import { cellName, houseName } from '@/core/notation';
import { formatTemplate } from '@/i18n/format';
import { EN } from '@/i18n/en';
import type { Board, Digit, HouseIndex } from '@/types/board';
import type { Explanation, ExplanationLevel, Highlight, Move, Technique } from '@/types/move';

function detect(board: Board): Move[] {
  const moves: Move[] = [];

  for (let h: HouseIndex = 0; h < 27; h++) {
    const cells = HOUSE_CELLS[h];
    for (let d: Digit = 1; d <= 9; d++) {
      const candidatesInHouse: number[] = [];
      for (const c of cells) {
        const cell = board.cells[c];
        if (cell.value === 0 && hasDigit(cell.candidates, d)) {
          candidatesInHouse.push(c);
        }
      }
      if (candidatesInHouse.length === 1) {
        const targetCell = candidatesInHouse[0];
        const highlights: Highlight[] = cells.map((c) => ({
          cell: c,
          digit: d,
          kind: c === targetCell ? 'positive' : 'context',
        }));
        moves.push({
          techniqueId: 'hidden-single',
          placements: [{ cell: targetCell, digit: d }],
          eliminations: [],
          evidence: { cells: [targetCell], highlights },
          metadata: { houseIndex: h },
        });
      }
    }
  }

  return moves;
}

function explain(move: Move, level: ExplanationLevel): Explanation {
  const placement = move.placements[0];
  const houseIndex = move.metadata?.['houseIndex'] as HouseIndex;
  const template = EN.techniques['hidden-single'][level];
  const text = formatTemplate(template, {
    cell: cellName(placement.cell),
    digit: placement.digit,
    house: houseName(houseIndex),
  });
  return { text, level };
}

export const hiddenSingle: Technique = {
  id: 'hidden-single',
  name: 'Hidden Single',
  difficulty: 14,
  category: 'single',
  detect,
  explain,
};
