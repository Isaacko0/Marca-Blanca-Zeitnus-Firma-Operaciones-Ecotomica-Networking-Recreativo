// src/core/state/culture-hack-method.ts
// Estado del módulo The Culture Hack Method — ALRAC/Zeitnus.

import type {
  CultureHackMethod,
  PuntoDeVista,
  ModeloEscucha,
  ComunidadNarrativa,
  AnalisisANP,
  EjeJusticiaOntologia,
  WindowDiscurso,
  EstrategiaNarrativa,
  HackingTree,
  PasoMetodo,
} from '../lib/culture-hack-method';

export interface CultureHackMethodState {
  metodo: CultureHackMethod | null;
  puntosDeVista: Map<string, PuntoDeVista>;
  modelosEscucha: Map<string, ModeloEscucha>;
  comunidades: Map<string, ComunidadNarrativa>;
  analizasANP: Map<string, AnalisisANP>;
  ejesJusticiaOntologia: Map<string, EjeJusticiaOntologia>;
  windowsDiscurso: Map<string, WindowDiscurso>;
  estrategiasNarrativas: Map<string, EstrategiaNarrativa>;
  hackingTrees: Map<string, HackingTree>;
  pasos: Map<string, PasoMetodo[]>;
}

export function makeCultureHackMethodState(): CultureHackMethodState {
  return {
    metodo: null,
    puntosDeVista: new Map(),
    modelosEscucha: new Map(),
    comunidades: new Map(),
    analizasANP: new Map(),
    ejesJusticiaOntologia: new Map(),
    windowsDiscurso: new Map(),
    estrategiasNarrativas: new Map(),
    hackingTrees: new Map(),
    pasos: new Map(),
  };
}
