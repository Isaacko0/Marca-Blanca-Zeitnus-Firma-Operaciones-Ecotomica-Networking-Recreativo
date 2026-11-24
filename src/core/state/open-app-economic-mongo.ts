// src/core/state/open-app-economic-mongo.ts
// Estado del módulo open-app-economic-mongo — ALRAC/Zeitnus.

import type {
  PluginGraphQLEconomico,
  ColeccionMongo,
  MensajeSSB,
  ConexionSSBMongo,
  InstanciaPullAbortable,
} from '../lib/open-app-economic-mongo';

export interface OpenAppEconomicMongoState {
  pluginsGraphQL: PluginGraphQLEconomico[];
  colecciones: ColeccionMongo[];
  mensajesSSB: MensajeSSB[];
  conexiones: ConexionSSBMongo[];
  instanciasAbortables: InstanciaPullAbortable[];
}

export function makeOpenAppEconomicMongoState(): OpenAppEconomicMongoState {
  return {
    pluginsGraphQL: [],
    colecciones: [],
    mensajesSSB: [],
    conexiones: [],
    instanciasAbortables: [],
  };
}
