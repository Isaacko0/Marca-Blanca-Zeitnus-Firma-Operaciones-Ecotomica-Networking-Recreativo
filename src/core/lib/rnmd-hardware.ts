// src/core/lib/rnmd-hardware.ts
// Marco modular RNMD — capa hardware.
// Infraestructura física de barrio regenerativo: vivienda wellness y sistemas
// de recursos resilientes (agua, comida, energía, aire, residuos).
// Lógica pura en TypeScript. No copia código ni assets de RegenTribe.

export type ResourceType = 'water' | 'food' | 'energy' | 'air' | 'waste';

export interface ResourceSystem {
  type: ResourceType;
  resilient: boolean;
  capacity: number;        // capacidad instalada (unidades según tipo)
  currentProduction: number; // producción actual
  lastMeasured: number;    // timestamp
}

export interface HardwareModule {
  id: string;
  name: string;
  location?: string;
  resourceSystems: ResourceSystem[];
  raoCredentialId: string;
  isPublic: boolean;
  createdAt: number;
}

/**
 * Registra un módulo de hardware con validación de RAO.
 */
export function registerHardwareModule(
  module: Omit<HardwareModule, 'id' | 'createdAt'>,
): HardwareModule {
  if (!module.raoCredentialId) {
    throw new Error('rnmd-hardware: raoCredentialId requerido');
  }
  return {
    ...module,
    id: `hw-${Date.now()}`,
    createdAt: Date.now(),
    isPublic: true,
  };
}

/**
 * Verifica resiliencia de un sistema de recurso individual.
 * Un sistema es resiliente si tiene capacidad > 0 y producción actual > 0.
 */
export function verifyResourceResilience(system: ResourceSystem): boolean {
  return system.capacity > 0 && system.currentProduction > 0;
}

/**
 * Verifica que todos los 5 tipos de recurso estén cubiertos y resilientes.
 * Retorna los tipos faltantes o no resilientes.
 */
export function verifyFullResourceCoverage(
  systems: ResourceSystem[],
): { complete: boolean; missing: ResourceType[] } {
  const allTypes: ResourceType[] = ['water', 'food', 'energy', 'air', 'waste'];
  const present = new Set(systems.map((s) => s.type));
  const missing = allTypes.filter(
    (t) => !present.has(t) || !systems.find((s) => s.type === t)?.resilient,
  );
  return {
    complete: missing.length === 0,
    missing,
  };
}

/**
 * Calcula el porcentaje de cobertura de recursos resilientes (0-100).
 */
export function resourceCoveragePct(systems: ResourceSystem[]): number {
  const resilientCount = systems.filter((s) => s.resilient).length;
  return (resilientCount / 5) * 100;
}
