import { useGameStore } from '@/stores/gameStore';
import type { Digit } from '@/types/board';

const DIGIT_BTN =
  'aspect-square min-w-[44px] font-display text-2xl border border-[#1a1f2e]/30 text-[#1a1f2e] hover:bg-[#c4571e]/10 hover:border-[#c4571e] disabled:text-[#1a1f2e]/30 disabled:bg-transparent disabled:border-[#1a1f2e]/15 disabled:cursor-not-allowed transition-colors';

const CLEAR_BTN =
  'col-span-3 py-2 font-ui text-sm text-[#1a1f2e] border border-[#1a1f2e]/30 hover:bg-[#c4571e]/10 hover:border-[#c4571e] disabled:text-[#1a1f2e]/30 disabled:cursor-not-allowed transition-colors';

export default function NumberPad() {
  const selectedCell = useGameStore((s) => s.selectedCell);
  const inputDigit = useGameStore((s) => s.inputDigit);
  const clearCell = useGameStore((s) => s.clearCell);
  const disabled = selectedCell === null;

  return (
    <div className="grid grid-cols-3 gap-2">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
        <button
          key={d}
          type="button"
          className={DIGIT_BTN}
          disabled={disabled}
          onClick={() => inputDigit(d as Digit)}
        >
          {d}
        </button>
      ))}
      <button type="button" className={CLEAR_BTN} disabled={disabled} onClick={clearCell}>
        Clear
      </button>
    </div>
  );
}
