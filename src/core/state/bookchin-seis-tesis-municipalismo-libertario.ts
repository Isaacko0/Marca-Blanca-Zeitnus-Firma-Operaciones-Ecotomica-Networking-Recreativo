// src/core/state/bookchin-seis-tesis-municipalismo-libertario.ts
// Estado del módulo Bookchin — Seis tesis sobre municipalismo libertario — ALRAC/Zeitnus.

import type { BookchinTesis, BookchinAnalisis } from '../lib/bookchin-seis-tesis-municipalismo-libertario';

export interface BookchinState {
  tesis: Map<string, BookchinTesis>;
  analisis: Map<string, BookchinAnalisis>;
}

export function makeBookchinState(): BookchinState {
  return {
    tesis: new Map(),
    analisis: new Map(),
  };
}
