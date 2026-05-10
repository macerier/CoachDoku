import type { Cell as CellType } from '@/types/board';
import type { Highlight } from '@/types/move';
import { hasDigit } from '@/core/candidates';

interface CellProps {
  cell: CellType;
  highlight?: Highlight;
}

const HIGHLIGHT_BG: Record<'positive' | 'context' | 'negative', string> = {
  positive: 'bg-[#c4571e]/15',
  context: 'bg-[#1a1f2e]/5',
  negative: 'bg-[#8a1f1f]/10',
};

const DIGIT_TEXT_GIVEN = 'text-[#1a1f2e] font-semibold';
const DIGIT_TEXT_PLACED = 'text-[#c4571e] font-bold';

export default function Cell({ cell, highlight }: CellProps) {
  const bg = highlight ? HIGHLIGHT_BG[highlight.kind] : '';

  if (cell.value !== 0) {
    return (
      <div
        data-given={String(cell.given)}
        data-highlight={highlight?.kind ?? 'none'}
        className={`relative flex items-center justify-center aspect-square transition-colors duration-200 ${bg}`}
      >
        <span
          className={`font-display text-2xl md:text-3xl ${cell.given ? DIGIT_TEXT_GIVEN : DIGIT_TEXT_PLACED}`}
        >
          {cell.value}
        </span>
      </div>
    );
  }

  return (
    <div
      data-given="false"
      data-highlight={highlight?.kind ?? 'none'}
      className={`relative grid grid-cols-3 grid-rows-3 aspect-square p-0.5 transition-colors duration-200 ${bg}`}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
        <span
          key={d}
          className={`flex items-center justify-center text-[9px] md:text-[10px] font-ui font-medium text-[#5a6478] ${
            hasDigit(cell.candidates, d) ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {d}
        </span>
      ))}
    </div>
  );
}
