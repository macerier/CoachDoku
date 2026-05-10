import { useGameStore } from '@/stores/gameStore';

const ACTIVE = 'font-ui text-sm font-semibold text-[#c4571e] underline underline-offset-4 decoration-2';
const INACTIVE = 'font-ui text-sm text-[#5a6478] hover:text-[#1a1f2e] transition-colors';

export default function ModeToggle() {
  const mode = useGameStore((s) => s.mode);
  const setMode = useGameStore((s) => s.setMode);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        data-active={String(mode === 'coach')}
        onClick={() => setMode('coach')}
        className={mode === 'coach' ? ACTIVE : INACTIVE}
      >
        Coach
      </button>
      <span aria-hidden className="text-[#1a1f2e]/25">|</span>
      <button
        type="button"
        data-active={String(mode === 'play')}
        onClick={() => setMode('play')}
        className={mode === 'play' ? ACTIVE : INACTIVE}
      >
        Play
      </button>
    </div>
  );
}
