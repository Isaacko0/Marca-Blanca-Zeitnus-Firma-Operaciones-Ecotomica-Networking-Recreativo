// src/core/state/narrativa-poder.ts
// Estado del módulo Narrativa de Poder — ALRAC/Zeitnus.

import type { NarrativaIdeologica } from '../lib/narrativa-poder';

export interface NarrativaPoderState {
  narrativas: Map<string, NarrativaIdeologica>;
}

export function makeNarrativaPoderState(): NarrativaPoderState {
  return {
    narrativas: new Map(),
  };
}
