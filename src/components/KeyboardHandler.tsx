import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import type { Digit } from '@/types/board';

export default function KeyboardHandler() {
  const mode = useGameStore((s) => s.mode);

  useEffect(() => {
    if (mode !== 'play') return;
    const handler = (e: KeyboardEvent) => {
      const ctrlOrCmd = e.ctrlKey || e.metaKey;
      const state = useGameStore.getState();

      if (ctrlOrCmd && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
        e.preventDefault();
        state.undo();
        return;
      }
      if (
        (ctrlOrCmd && (e.key === 'y' || e.key === 'Y')) ||
        (ctrlOrCmd && e.shiftKey && (e.key === 'z' || e.key === 'Z'))
      ) {
        e.preventDefault();
        state.redo();
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          state.moveSelection(-1, 0);
          break;
        case 'ArrowDown':
          e.preventDefault();
          state.moveSelection(1, 0);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          state.moveSelection(0, -1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          state.moveSelection(0, 1);
          break;
        case ' ':
          e.preventDefault();
          state.toggleEditMode();
          break;
        case 'Backspace':
        case 'Delete':
        case '0':
          e.preventDefault();
          state.clearCell();
          break;
        case 'Escape':
          e.preventDefault();
          state.selectCell(null);
          break;
        default:
          if (e.key >= '1' && e.key <= '9') {
            e.preventDefault();
            state.inputDigit(Number(e.key) as Digit);
          }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [mode]);

  return null;
}
