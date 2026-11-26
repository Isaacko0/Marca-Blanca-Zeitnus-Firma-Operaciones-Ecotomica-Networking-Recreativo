// src/core/state/trina-ax.ts
// Estado del módulo trina-ax — Self-hosted IA para equipos — ALRAC/Zeitnus.

import type {
  SkillEquipo,
  ServidorMCP,
  SesionIA,
  PermisoCarpeta,
  Documento,
  Despliegue,
  SesionCompartida,
} from '../lib/trina-ax';

export interface TrinaAxState {
  skillsEquipo: SkillEquipo[];
  servidoresMCP: ServidorMCP[];
  sesionesIA: SesionIA[];
  permisosCarpeta: PermisoCarpeta[];
  documentos: Documento[];
  despliegues: Despliegue[];
  sesionesCompartidas: SesionCompartida[];
}

export function makeTrinaAxState(): TrinaAxState {
  return {
    skillsEquipo: [],
    servidoresMCP: [],
    sesionesIA: [],
    permisosCarpeta: [],
    documentos: [],
    despliegues: [],
    sesionesCompartidas: [],
  };
}
