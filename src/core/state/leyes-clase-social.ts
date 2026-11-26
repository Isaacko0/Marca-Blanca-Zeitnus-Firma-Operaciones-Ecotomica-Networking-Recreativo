// src/core/state/leyes-clase-social.ts
// Estado del módulo Leyes de Clase Social — ALRAC/Zeitnus.

import type { LeyClase } from '../lib/leyes-clase-social';

export interface LeyesClaseSocialState {
  leyes: Map<string, LeyClase>;
}

export function makeLeyesClaseSocialState(): LeyesClaseSocialState {
  return {
    leyes: new Map(),
  };
}
