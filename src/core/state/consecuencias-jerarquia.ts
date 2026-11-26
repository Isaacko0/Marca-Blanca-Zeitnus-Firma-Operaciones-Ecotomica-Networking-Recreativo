// src/core/state/consecuencias-jerarquia.ts
// Estado del módulo Consecuencias de la Jerarquía — ALRAC/Zeitnus.

import type {
  ImpactoSalud,
  DesvinculacionMeritoRecompensa,
  PsicologiaSocial,
} from '../lib/consecuencias-jerarquia';

export interface ConsecuenciasJerarquiaState {
  impactosSalud: Map<string, ImpactoSalud>;
  desvinculaciones: Map<string, DesvinculacionMeritoRecompensa>;
  psicologias: Map<string, PsicologiaSocial>;
}

export function makeConsecuenciasJerarquiaState(): ConsecuenciasJerarquiaState {
  return {
    impactosSalud: new Map(),
    desvinculaciones: new Map(),
    psicologias: new Map(),
  };
}
