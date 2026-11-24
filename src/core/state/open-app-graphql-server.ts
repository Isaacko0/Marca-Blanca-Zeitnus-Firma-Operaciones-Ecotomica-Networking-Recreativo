// src/core/state/open-app-graphql-server.ts
// Estado del módulo open-app-graphql-server — ALRAC/Zeitnus.

import type {
  Plugin,
  SchemaGraphQL,
  Blob,
  Capacidad,
  EstadoServidor,
} from '../lib/open-app-graphql-server';

export interface OpenAppGraphQLServerState {
  servidor: EstadoServidor | null;
  pluginsRegistrados: Plugin[];
  schemasRegistrados: SchemaGraphQL[];
  blobsRegistrados: Blob[];
  capacidadesRegistradas: Capacidad[];
}

export function makeOpenAppGraphQLServerState(): OpenAppGraphQLServerState {
  return {
    servidor: null,
    pluginsRegistrados: [],
    schemasRegistrados: [],
    blobsRegistrados: [],
    capacidadesRegistradas: [],
  };
}
