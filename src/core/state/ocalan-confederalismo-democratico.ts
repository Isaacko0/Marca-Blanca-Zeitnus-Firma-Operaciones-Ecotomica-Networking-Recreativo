// src/core/state/ocalan-confederalismo-democratico.ts
// Estado del módulo Öcalan — Confederalismo Democrático — ALRAC/Zeitnus.

import type { OcalanConcepto, OcalanAnalisis } from '../lib/ocalan-confederalismo-democratico';

export interface OcalanState {
  conceptos: Map<string, OcalanConcepto>;
  analisis: Map<string, OcalanAnalisis>;
}

export function makeOcalanState(): OcalanState {
  return {
    conceptos: new Map(),
    analisis: new Map(),
  };
}
