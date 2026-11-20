// src/core/lib/mythogen-ame.ts
// Mythogen AME — Affinity Mapping Engine & Field of Trust.
// Tri-Layered System (BODY / FIELD / SEED), Living Seed Patterns, Fields of Trust.
// Lógica pura en TypeScript. No copia código de RegenTribe.

export type TrustLayer = 'BODY' | 'FIELD' | 'SEED';

export interface TrustField {
  id: string;
  name: string;
  members: string[];
  trustLevel: number;          // 0-1
  layer: TrustLayer;
  properties: Record<string, unknown>;
  timestamp: number;
}

export interface LivingSeedPattern {
  id: string;
  name: string;
  description: string;
  layer: TrustLayer;
  activationConditions: string[];
  potential: number;           // 0-1
  timestamp: number;
}

export interface AffinityResult {
  personA: string;
  personB: string;
  affinityScore: number;       // 0-1
  trustField?: TrustField;
  timestamp: number;
}

export interface TriLayeredAnalysis {
  communityId: string;
  body: TrustField[];
  field: TrustField[];
  seed: TrustField[];
  seedPatterns: LivingSeedPattern[];
  timestamp: number;
}

let ameIdCounter = 0;
function nextAmeId(): string {
  ameIdCounter += 1;
  return `ame-${Date.now()}-${ameIdCounter}`;
}

/**
 * Crea un campo de confianza para un grupo en una capa dada.
 */
export function detectTrustField(
  name: string,
  members: string[],
  layer: TrustLayer,
  properties: Record<string, unknown> = {},
): TrustField {
  if (members.length === 0) {
    throw new Error('mythogen-ame: un campo de confianza necesita al menos un miembro');
  }
  const trustLevel = Math.min(1, members.length / 10); // heurística simple
  return {
    id: nextAmeId(),
    name,
    members: [...members],
    trustLevel,
    layer,
    properties,
    timestamp: Date.now(),
  };
}

/**
 * Calcula afinidad entre dos personas basado en contexto compartido.
 */
export function mapAffinity(
  personA: string,
  personB: string,
  context: { sharedProjects?: number; hoursTogether?: number; mutualConnections?: number; commonNeighborhoods?: string[] },
): AffinityResult {
  const { sharedProjects = 0, hoursTogether = 0, mutualConnections = 0, commonNeighborhoods = [] } = context;

  // Score heurístico basado en contexto compartido
  let score = 0;
  score += Math.min(sharedProjects / 5, 1) * 0.3;
  score += Math.min(hoursTogether / 100, 1) * 0.3;
  score += Math.min(mutualConnections / 10, 1) * 0.2;
  score += Math.min(commonNeighborhoods.length / 3, 1) * 0.2;
  score = Math.min(Math.max(score, 0), 1);

  // Determinar capa dominante según el score
  let layer: TrustLayer = 'SEED';
  if (score > 0.7) layer = 'BODY';
  else if (score > 0.4) layer = 'FIELD';

  const trustField = detectTrustField(
    `affinity-${personA}-${personB}`,
    [personA, personB],
    layer,
    { affinityScore: score },
  );

  return {
    personA,
    personB,
    affinityScore: score,
    trustField,
    timestamp: Date.now(),
  };
}

/**
 * Identifica patrones de semilla viva en un contexto dado.
 */
export function identifySeedPatterns(
  context: { communitySize?: number; activeProjects?: number; trustFields?: TrustField[]; resources?: string[] },
): LivingSeedPattern[] {
  const { communitySize = 0, activeProjects = 0, trustFields = [], resources = [] } = context;
  const patterns: LivingSeedPattern[] = [];

  if (communitySize > 20) {
    patterns.push({
      id: nextAmeId(),
      name: 'Núcleo de fundadores comprometidos',
      description: 'Grupo estable de miembros con alta participación',
      layer: 'SEED',
      activationConditions: ['comunidad > 20 miembros', 'tres proyectos activos'],
      potential: 0.8,
      timestamp: Date.now(),
    });
  }

  if (activeProjects > 0 && trustFields.length > 0) {
    patterns.push({
      id: nextAmeId(),
      name: 'Campo de confianza activo',
      description: 'Campos de confianza existentes potencian nuevos proyectos',
      layer: 'FIELD',
      activationConditions: ['proyectos activos', 'campos de confianza mapeados'],
      potential: 0.6,
      timestamp: Date.now(),
    });
  }

  if (resources.length > 5) {
    patterns.push({
      id: nextAmeId(),
      name: 'Diversidad de recursos',
      description: 'Múltiples tipos de recursos disponibles para activación',
      layer: 'BODY',
      activationConditions: ['más de 5 tipos de recursos'],
      potential: 0.5,
      timestamp: Date.now(),
    });
  }

  return patterns;
}

/**
 * Análisis tri-capa completo para una comunidad.
 */
export function triLayeredAnalysis(
  communityId: string,
  bodyFields: TrustField[],
  fieldFields: TrustField[],
  seedFields: TrustField[],
  seedPatterns: LivingSeedPattern[] = [],
): TriLayeredAnalysis {
  return {
    communityId,
    body: bodyFields,
    field: fieldFields,
    seed: seedFields,
    seedPatterns,
    timestamp: Date.now(),
  };
}
