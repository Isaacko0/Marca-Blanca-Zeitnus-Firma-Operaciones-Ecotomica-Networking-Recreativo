// src/core/state/azize-aslan-economia-rojava.ts
// Estado del módulo Azize Aslan — Economía anticapitalista en Rojava — ALRAC/Zeitnus.

import type { AzizeConcepto, AzizeAnalisis } from '../lib/azize-aslan-economia-rojava';

export interface AzizeState {
  conceptos: Map<string, AzizeConcepto>;
  analisis: Map<string, AzizeAnalisis>;
}

export function makeAzizeState(): AzizeState {
  return {
    conceptos: new Map(),
    analisis: new Map(),
  };
}
