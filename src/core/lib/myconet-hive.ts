// src/core/lib/myconet-hive.ts
// Myconet — Módulo 11: Hive.
// Capa inter-comunidad: compartir recursos, conocimiento, excedentes, personas entre barrios.
// Lógica pura en TypeScript. No copia código de RegenTribe.

export interface SharedResource {
  id: string;
  type: 'knowledge' | 'surplus' | 'person' | 'tool' | 'space';
  title: string;
  description: string;
  sourceNeighborhoodId: string;
  availableFrom: number;
  availableUntil?: number;
  conditions: string[];
  sharedWith: string[];     // IDs de barrios destino
  timestamp: number;
}

export interface HiveShareResult {
  resourceId: string;
  shared: string[];         // IDs de barrios que recibieron el recurso
  rejected: string[];       // IDs de barrios que rechazaron
  timestamp: number;
}

let resourceIdCounter = 0;
function nextResourceId(): string {
  resourceIdCounter += 1;
  return `hive-res-${Date.now()}-${resourceIdCounter}`;
}

/**
 * Publica un recurso en la red Hive para compartir entre barrios.
 */
export function publishToHive(
  resource: Omit<SharedResource, 'id' | 'sharedWith' | 'timestamp'>,
): SharedResource {
  if (!resource.sourceNeighborhoodId) {
    throw new Error('myconet-hive: sourceNeighborhoodId requerido');
  }
  return {
    ...resource,
    id: nextResourceId(),
    sharedWith: [],
    timestamp: Date.now(),
  };
}

/**
 * Comparte un recurso publicado con barrios destino.
 * Los barrios pueden aceptar o rechazar según sus condiciones.
 */
export function shareAcrossHive(
  resource: SharedResource,
  targetNeighborhoods: string[],
  acceptorCallback: (neighborhoodId: string, resource: SharedResource) => boolean,
): HiveShareResult {
  const shared: string[] = [];
  const rejected: string[] = [];

  for (const nId of targetNeighborhoods) {
    const accepted = acceptorCallback(nId, resource);
    if (accepted) {
      shared.push(nId);
    } else {
      rejected.push(nId);
    }
  }

  const updated: SharedResource = {
    ...resource,
    sharedWith: [...resource.sharedWith, ...shared],
  };

  return {
    resourceId: resource.id,
    shared,
    rejected,
    timestamp: Date.now(),
  };
}

/**
 * Calcula el flujo neto de recursos entre barrios (balance de la red Hive).
 */
export function calculateHiveFlow(
  shares: Array<{ sourceNeighborhoodId: string; sharedWith: string[]; type: string }>,
): Record<string, { out: number; in: number; balance: number }> {
  const flow: Record<string, { out: number; in: number }> = {};

  for (const share of shares) {
    if (!flow[share.sourceNeighborhoodId]) {
      flow[share.sourceNeighborhoodId] = { out: 0, in: 0 };
    }
    flow[share.sourceNeighborhoodId].out += share.sharedWith.length;

    for (const target of share.sharedWith) {
      if (!flow[target]) {
        flow[target] = { out: 0, in: 0 };
      }
      flow[target].in += 1;
    }
  }

  const result: Record<string, { out: number; in: number; balance: number }> = {};
  for (const [nid, f] of Object.entries(flow)) {
    result[nid] = { out: f.out, in: f.in, balance: f.in - f.out };
  }

  return result;
}
