import { useGameStore } from '@/stores/gameStore';
import { cellName } from '@/core/notation';

export default function StepList() {
  const steps = useGameStore((s) => s.steps);
  const currentStepIndex = useGameStore((s) => s.currentStepIndex);

  const visible = currentStepIndex >= 0 ? steps.slice(0, currentStepIndex + 1) : [];

  return (
    <div className="font-ui md:max-h-[60vh] md:overflow-y-auto">
      <h2 className="font-display text-xl font-semibold text-[#1a1f2e] mb-3">Solver notes</h2>
      {visible.length === 0 ? (
        <p className="text-sm text-[#5a6478] italic">Press Next or Play to begin.</p>
      ) : (
        <ol className="flex flex-col gap-2">
          {visible.map((step, i) => {
            const active = i === currentStepIndex;
            const placement = step.move.placements[0];
            return (
              <li
                key={i}
                data-step-index={i}
                data-active={String(active)}
                className={`pl-3 py-1 border-l-2 ${active ? 'border-[#c4571e]' : 'border-[#1a1f2e]/15'}`}
              >
                <div className="text-sm text-[#1a1f2e]">
                  <span className="font-semibold tabular-nums">{i + 1}.</span>{' '}
                  <span className="capitalize">{step.technique.replace('-', ' ')}</span>
                  {placement ? (
                    <>
                      {' '}- {cellName(placement.cell)} = <span className="text-[#c4571e] font-semibold">{placement.digit}</span>
                    </>
                  ) : null}
                </div>
                <div className="text-xs text-[#5a6478] mt-0.5 leading-snug">{step.explanation.text}</div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
