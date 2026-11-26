// src/core/state/gobernanza-egalitaria.ts
// Estado del módulo Gobernanza Egalitaria — ALRAC/Zeitnus.

import type { MecanismoSupresion, DecisionColectiva } from '../lib/gobernanza-egalitaria';

export interface GobernanzaEgalitariaState {
  mecanismosSupresion: Map<string, MecanismoSupresion>;
  decisionesColectivas: Map<string, DecisionColectiva>;
}

export function makeGobernanzaEgalitariaState(): GobernanzaEgalitariaState {
  return {
    mecanismosSupresion: new Map(),
    decisionesColectivas: new Map(),
  };
}
