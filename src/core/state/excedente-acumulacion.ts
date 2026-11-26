// src/core/state/excedente-acumulacion.ts
// Estado del módulo Excedente y Acumulación sin Trabajo — ALRAC/Zeitnus.

import type { Excedente, AcumulacionSinTrabajo } from '../lib/excedente-acumulacion';

export interface ExcedenteAcumulacionState {
  excedentes: Map<string, Excedente>;
  acumulacionesSinTrabajo: Map<string, AcumulacionSinTrabajo>;
}

export function makeExcedenteAcumulacionState(): ExcedenteAcumulacionState {
  return {
    excedentes: new Map(),
    acumulacionesSinTrabajo: new Map(),
  };
}
