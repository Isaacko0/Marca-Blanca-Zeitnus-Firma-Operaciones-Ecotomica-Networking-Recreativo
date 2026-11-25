// src/core/state/simbiodisc.ts
// Estado del módulo Simbiodisc — ALRAC/Zeitnus.

import type {
  PanelSimbiodisc,
  MedicionSDT,
  MedicionSDN,
  MedicionSDL,
  ItemCuidadoSDF,
  CicloRetroalimentacion,
} from '../lib/simbiodisc';

export interface SimbiodiscState {
  paneles: Map<string, PanelSimbiodisc>;
  panelActivoId: string | null;
}

export function makeSimbiodiscState(): SimbiodiscState {
  return {
    paneles: new Map(),
    panelActivoId: null,
  };
}
