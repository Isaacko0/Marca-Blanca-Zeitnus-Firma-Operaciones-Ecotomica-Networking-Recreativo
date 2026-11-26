// src/core/state/gobierno-china-sasac.ts
// Estado del módulo SASAC (Consejo de Estado de China) — ALRAC/Zeitnus.

import type { SasacDocumento, SupervisionActivosStatales, OficinaGeneralConsejoEstado } from '../lib/gobierno-china-sasac';

export interface GobiernoChinaSasacState {
  documentos: Map<string, SasacDocumento>;
  supervisiones: Map<string, SupervisionActivosStatales>;
  oficinas: Map<string, OficinaGeneralConsejoEstado>;
}

export function makeGobiernoChinaSasacState(): GobiernoChinaSasacState {
  return {
    documentos: new Map(),
    supervisiones: new Map(),
    oficinas: new Map(),
  };
}
