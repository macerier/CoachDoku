import { useGameStore } from '@/stores/gameStore';
import NumberPad from '@/components/NumberPad';
import EditModeToggle from '@/components/EditModeToggle';

const TOOL_BTN =
  'font-ui text-sm px-3 py-1.5 text-[#1a1f2e] underline-offset-4 hover:underline disabled:text-[#1a1f2e]/30 disabled:no-underline disabled:cursor-not-allowed transition-colors';

export default function PlaySidebar() {
  const history = useGameStore((s) => s.history);
  const historyIndex = useGameStore((s) => s.historyIndex);
  const undo = useGameStore((s) => s.undo);
  const redo = useGameStore((s) => s.redo);
  const autoFillCandidates = useGameStore((s) => s.autoFillCandidates);
  const clearAllCandidates = useGameStore((s) => s.clearAllCandidates);
  const resetUserBoard = useGameStore((s) => s.resetUserBoard);

  return (
    <div className="flex flex-col gap-6">
      <EditModeToggle />
      <NumberPad />

      <div className="flex flex-col gap-3 border-t border-[#1a1f2e]/15 pt-4">
        <div className="flex flex-wrap gap-1">
          <button type="button" className={TOOL_BTN} onClick={undo} disabled={historyIndex <= 0} aria-label="Undo">
            Undo
          </button>
          <button
            type="button"
            className={TOOL_BTN}
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            aria-label="Redo"
          >
            Redo
          </button>
        </div>
        <div className="flex flex-wrap gap-1">
          <button type="button" className={TOOL_BTN} onClick={autoFillCandidates} aria-label="Auto-fill candidates">
            Auto-fill candidates
          </button>
          <button type="button" className={TOOL_BTN} onClick={clearAllCandidates} aria-label="Clear marks">
            Clear marks
          </button>
        </div>
        <div>
          <button type="button" className={TOOL_BTN} onClick={resetUserBoard} aria-label="Reset board">
            Reset board
          </button>
        </div>
      </div>
    </div>
  );
}
