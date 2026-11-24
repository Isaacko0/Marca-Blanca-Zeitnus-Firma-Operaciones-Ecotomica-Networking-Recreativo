// src/core/state/collectiveone-webapp.ts
// Estado del módulo CollectiveOneWebapp — ALRAC/Zeitnus.

import type {
  CapaApp,
  Commit,
  Branch,
  Contributor,
  LicenciaInfo,
  EstadoAppWeb,
} from '../lib/collectiveone-webapp';

export interface CollectiveoneWebappState {
  capas: CapaApp[];
  commits: Commit[];
  branches: Branch[];
  contributors: Contributor[];
  licencia: LicenciaInfo | null;
  esCodigoAbandonado: boolean;
  fechaUltimoCommit: number;
}

export function makeCollectiveoneWebappState(): CollectiveoneWebappState {
  return {
    capas: [],
    commits: [],
    branches: [],
    contributors: [],
    licencia: null,
    esCodigoAbandonado: false,
    fechaUltimoCommit: 0,
  };
}
