import type { Technique } from '@/types/move';
import { nakedSingle } from '@/core/techniques/nakedSingle';
import { hiddenSingle } from '@/core/techniques/hiddenSingle';

export const TECHNIQUE_REGISTRY: ReadonlyArray<Technique> = [nakedSingle, hiddenSingle];
