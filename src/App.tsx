import Board from '@/components/Board';
import Controls from '@/components/Controls';
import StepList from '@/components/StepList';

export default function App() {
  return (
    <main className="min-h-screen bg-[#fdfaf3] text-[#1a1f2e] font-ui">
      <header className="px-5 py-6 md:px-12 md:py-10 border-b border-[#1a1f2e]/15">
        <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
          CoachDoku
        </h1>
        <p className="mt-2 text-sm md:text-base text-[#5a6478]">
          The Sudoku coach that explains the why.
        </p>
      </header>

      <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-12 px-5 py-8 md:px-12 md:py-10">
        <div className="flex-1 max-w-lg md:max-w-xl">
          <Board />
        </div>
        <div className="flex flex-col gap-6 md:flex-1 md:max-h-[80vh]">
          <Controls />
          <StepList />
        </div>
      </div>
    </main>
  );
}
