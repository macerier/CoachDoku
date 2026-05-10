import { useGameStore } from '@/stores/gameStore';

const ACTIVE =
  'h-11 font-ui text-sm font-semibold bg-[#c4571e]/15 border border-[#c4571e] text-[#1a1f2e] transition-colors';
const INACTIVE =
  'h-11 font-ui text-sm text-[#5a6478] border border-[#1a1f2e]/15 hover:text-[#1a1f2e] hover:border-[#1a1f2e]/40 transition-colors';

export default function EditModeToggle() {
  const editMode = useGameStore((s) => s.editMode);
  const setValue = () => useGameStore.setState({ editMode: 'value' });
  const setCandidate = () => useGameStore.setState({ editMode: 'candidate' });

  const subtitle =
    editMode === 'value'
      ? 'Click cells to place a digit.'
      : 'Click cells to toggle pencil marks.';

  return (
    <div className="flex flex-col gap-2 max-w-[220px]">
      <div className="grid grid-cols-2 gap-1.5">
        <button
          type="button"
          data-active={String(editMode === 'value')}
          onClick={setValue}
          className={editMode === 'value' ? ACTIVE : INACTIVE}
        >
          Value
        </button>
        <button
          type="button"
          data-active={String(editMode === 'candidate')}
          onClick={setCandidate}
          className={editMode === 'candidate' ? ACTIVE : INACTIVE}
        >
          Candidate
        </button>
      </div>
      <p className="text-xs text-[#5a6478]">{subtitle}</p>
    </div>
  );
}
