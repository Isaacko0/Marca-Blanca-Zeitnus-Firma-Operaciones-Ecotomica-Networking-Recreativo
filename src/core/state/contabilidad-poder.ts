// src/core/state/contabilidad-poder.ts
// Estado del módulo Contabilidad de Poder — ALRAC/Zeitnus.

import type { DeudaTemploPalacio, RegistroQuienDebeAQuien } from '../lib/contabilidad-poder';

export interface ContabilidadPoderState {
  deudas: Map<string, DeudaTemploPalacio>;
  registros: Map<string, RegistroQuienDebeAQuien>;
}

export function makeContabilidadPoderState(): ContabilidadPoderState {
  return {
    deudas: new Map(),
    registros: new Map(),
  };
}
