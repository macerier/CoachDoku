import { useGameStore } from '@/stores/gameStore';
import { indexToCol, indexToRow } from '@/core/coords';
import type { CellIndex } from '@/types/board';
import type { Highlight } from '@/types/move';
import Cell from '@/components/Cell';

function buildHighlightMap(highlights: ReadonlyArray<Highlight>): Map<CellIndex, Highlight> {
  const map = new Map<CellIndex, Highlight>();
  for (const h of highlights) {
    const existing = map.get(h.cell);
    if (!existing || (existing.kind !== 'positive' && h.kind === 'positive')) {
      map.set(h.cell, h);
    }
  }
  return map;
}

export default function Board() {
  const currentBoard = useGameStore((s) => s.currentBoard);
  const steps = useGameStore((s) => s.steps);
  const currentStepIndex = useGameStore((s) => s.currentStepIndex);

  const highlights =
    currentStepIndex >= 0 && currentStepIndex < steps.length
      ? steps[currentStepIndex].move.evidence.highlights
      : [];
  const highlightMap = buildHighlightMap(highlights);

  return (
    <div className="aspect-square w-full max-w-lg md:max-w-xl mx-auto border-2 border-[#1a1f2e]">
      <div className="grid grid-cols-9 grid-rows-9 w-full h-full">
        {currentBoard.cells.map((cell) => {
          const row = indexToRow(cell.index);
          const col = indexToCol(cell.index);
          const borderRight = col === 2 || col === 5 ? 'border-r-2 border-r-[#1a1f2e]' : 'border-r border-r-[#1a1f2e]/15';
          const borderBottom = row === 2 || row === 5 ? 'border-b-2 border-b-[#1a1f2e]' : 'border-b border-b-[#1a1f2e]/15';
          const noRight = col === 8 ? 'border-r-0' : '';
          const noBottom = row === 8 ? 'border-b-0' : '';

          return (
            <div
              key={cell.index}
              data-cell-index={cell.index}
              className={`${borderRight} ${borderBottom} ${noRight} ${noBottom}`}
            >
              <Cell cell={cell} highlight={highlightMap.get(cell.index)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
