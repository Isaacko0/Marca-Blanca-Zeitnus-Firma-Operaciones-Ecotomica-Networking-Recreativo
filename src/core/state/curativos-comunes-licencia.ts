// src/core/state/curativos-comunes-licencia.ts
// Estado del módulo Licencia Curativos Comunes 1.0 — ALRAC/Zeitnus.

import type {
  LicenciaCurativosComunes,
  Derivado,
  ViolacionAcuerdo,
  Reparacion,
} from '../lib/curativos-comunes-licencia';

export interface CurativosComunesLicenciaState {
  licencias: Map<string, LicenciaCurativosComunes>;
  derivados: Map<string, Derivado>;
  violaciones: Map<string, ViolacionAcuerdo>;
  reparaciones: Map<string, Reparacion>;
}

export function makeCurativosComunesLicenciaState(): CurativosComunesLicenciaState {
  return {
    licencias: new Map(),
    derivados: new Map(),
    violaciones: new Map(),
    reparaciones: new Map(),
  };
}
