import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';

const PLAY_INTERVAL_MS = 500;
const BTN =
  'font-ui text-sm px-3 py-1.5 text-[#1a1f2e] underline-offset-4 hover:underline disabled:text-[#1a1f2e]/30 disabled:no-underline disabled:cursor-not-allowed transition-colors';

export default function Controls() {
  const currentStepIndex = useGameStore((s) => s.currentStepIndex);
  const steps = useGameStore((s) => s.steps);
  const isPlaying = useGameStore((s) => s.isPlaying);
  const reset = useGameStore((s) => s.reset);
  const prevStep = useGameStore((s) => s.prevStep);
  const nextStep = useGameStore((s) => s.nextStep);
  const jumpToEnd = useGameStore((s) => s.jumpToEnd);
  const togglePlay = useGameStore((s) => s.togglePlay);

  const atStart = currentStepIndex === -1;
  const atEnd = currentStepIndex === steps.length - 1;

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      const state = useGameStore.getState();
      if (state.currentStepIndex >= state.steps.length - 1) {
        state.togglePlay();
      } else {
        state.nextStep();
      }
    }, PLAY_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isPlaying]);

  const stepLabel = `Step ${currentStepIndex + 1} of ${steps.length}`;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-sm font-ui text-[#5a6478]">
        <span className="uppercase tracking-wider">{stepLabel}</span>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <button type="button" className={BTN} onClick={reset} disabled={atStart} aria-label="Reset to start">
          Reset
        </button>
        <button type="button" className={BTN} onClick={prevStep} disabled={atStart} aria-label="Previous step">
          Prev
        </button>
        <button
          type="button"
          className={`${BTN} font-semibold`}
          onClick={togglePlay}
          disabled={atEnd && !isPlaying}
          aria-label={isPlaying ? 'Pause autoplay' : 'Play autoplay'}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button type="button" className={BTN} onClick={nextStep} disabled={atEnd} aria-label="Next step">
          Next
        </button>
        <button type="button" className={BTN} onClick={jumpToEnd} disabled={atEnd} aria-label="Jump to end">
          To end
        </button>
      </div>
    </div>
  );
}
