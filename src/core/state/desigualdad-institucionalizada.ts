// src/core/state/desigualdad-institucionalizada.ts
// Estado del módulo Desigualdad Institucionalizada — ALRAC/Zeitnus.

import type { DesigualdadHereditaria } from '../lib/desigualdad-institucionalizada';

export interface DesigualdadInstitucionalizadaState {
  casos: Map<string, DesigualdadHereditaria>;
}

export function makeDesigualdadInstitucionalizadaState(): DesigualdadInstitucionalizadaState {
  return {
    casos: new Map(),
  };
}
