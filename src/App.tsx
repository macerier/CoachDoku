import Board from '@/components/Board';
import Controls from '@/components/Controls';
import StepList from '@/components/StepList';
import ModeToggle from '@/components/ModeToggle';
import PlaySidebar from '@/components/PlaySidebar';
import KeyboardHandler from '@/components/KeyboardHandler';
import { useGameStore } from '@/stores/gameStore';

export default function App() {
  const mode = useGameStore((s) => s.mode);

  return (
    <main className="min-h-screen bg-[#fdfaf3] text-[#1a1f2e] font-ui">
      <KeyboardHandler />
      <header className="flex items-start justify-between gap-4 px-5 py-6 md:px-12 md:py-10 border-b border-[#1a1f2e]/15">
        <div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
            CoachDoku
          </h1>
          <p className="mt-2 text-sm md:text-base text-[#5a6478]">
            The Sudoku coach that explains the why.
          </p>
        </div>
        <ModeToggle />
      </header>

      <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-12 px-5 py-8 md:px-12 md:py-10">
        <div className="flex-1 max-w-lg md:max-w-xl">
          <Board />
        </div>
        <div className="flex flex-col gap-6 md:flex-1 md:max-h-[80vh]">
          {mode === 'coach' ? (
            <>
              <Controls />
              <StepList />
            </>
          ) : (
            <PlaySidebar />
          )}
        </div>
      </div>
    </main>
  );
}
