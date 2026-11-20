// src/core/lib/monitoring-mrv.ts
// Monitoreo, Reporte y Verificación (MRV) del Común Regenerativo.
// Reimplementa la lógica pura del manifiesto OASA (eDNA, sensores, satélites,
// Open Forest Protocol, Guardians of Nature) en TypeScript puro.
// No copia código de ningún repo externo.

const PRECISION_SCALE = 1e18;

export interface EDNASample {
  id: string;
  projectId: string;
  sampleType: 'soil' | 'water';
  speciesDetected: string[];
  location?: { lat: number; lng: number };
  timestamp: number;
  raoCredentialId: string;
}

export interface SensorReading {
  id: string;
  projectId: string;
  sensorType:
    | 'soil_moisture'
    | 'water_level'
    | 'temperature'
    | 'nutrients'
    | 'weather';
  values: Record<string, number>;
  location?: { lat: number; lng: number };
  timestamp: number;
  raoCredentialId: string;
}

export interface MRVRecord {
  id: string;
  projectId: string;
  type: 'edna' | 'sensor' | 'satellite' | 'ofp' | 'guardian';
  timestamp: number;
  location?: { lat: number; lng: number };
  data: Record<string, unknown>;
  raoCredentialId: string;
  isPublic: boolean;
}

export interface RegenerationAssessment {
  projectId: string;
  index: number; // 0-1
  components: {
    vegetationCover: number;
    biodiversity: number;
    soilMoisture: number;
    carbonSequestration: number;
  };
  timestamp: number;
}

export interface GuardianVetoResult {
  veto: boolean;
  reason?: string;
  principleViolated?: string;
}

export interface SevenGenerationsResult {
  compliant: boolean;
  impact: 'positive' | 'neutral' | 'negative';
  horizonYears: number;
  rationale: string;
}

// Contador simple de IDs (en producción usar UUID/RAO)
let mrvIdCounter = 0;
function nextId(): string {
  mrvIdCounter += 1;
  return `mrv-${Date.now()}-${mrvIdCounter}`;
}

/**
 * Registra una muestra de eDNA de suelo o agua.
 * El dato es público por defecto (digitized commons).
 */
export function recordEDNASample(
  projectId: string,
  sample: Omit<EDNASample, 'id'>,
): MRVRecord {
  const record: MRVRecord = {
    id: nextId(),
    projectId,
    type: 'edna',
    timestamp: sample.timestamp,
    location: sample.location,
    data: {
      sampleType: sample.sampleType,
      speciesDetected: sample.speciesDetected,
    },
    raoCredentialId: sample.raoCredentialId,
    isPublic: true,
  };
  return record;
}

/**
 * Registra una lectura de sensor IoT (suelo, agua, clima).
 */
export function recordSensorReading(
  projectId: string,
  reading: Omit<SensorReading, 'id'>,
): MRVRecord {
  const record: MRVRecord = {
    id: nextId(),
    projectId,
    type: 'sensor',
    timestamp: reading.timestamp,
    location: reading.location,
    data: {
      sensorType: reading.sensorType,
      values: reading.values,
    },
    raoCredentialId: reading.raoCredentialId,
    isPublic: true,
  };
  return record;
}

/**
 * Calcula el índice de regeneración de un proyecto (0-1).
 * Agrega cobertura vegetal, biodiversidad, humedad del suelo, secuestro de carbono.
 */
export function calculateRegenerationIndex(
  components: RegenerationAssessment['components'],
): RegenerationAssessment['index'] {
  const weights = {
    vegetationCover: 0.3,
    biodiversity: 0.3,
    soilMoisture: 0.2,
    carbonSequestration: 0.2,
  };
  let index = 0;
  for (const [key, weight] of Object.entries(weights)) {
    const value = Number(components[key as keyof typeof components]);
    const clamped = Math.min(Math.max(value, 0), 1);
    index += clamped * weight;
  }
  return Math.min(Math.max(index, 0), 1);
}

/**
 * Evalúa si un Guardián de la Naturaleza vetaría una propuesta.
 * Ejemplos: expansión agrícola sobre área rewilded (≥50%), declive de suelo/pájaros.
 */
export function evaluateGuardianVeto(
  proposal: { expandAgricultureInto?: string; reduceWildArea?: boolean },
  mrvContext: { rewildedPct: number; soilHealthTrend?: 'improving' | 'declining' },
): GuardianVetoResult {
  // Límite duro: no reducir área rewilded por debajo del 50%
  if (proposal.reduceWildArea && mrvContext.rewildedPct <= 50) {
    return {
      veto: true,
      reason: 'Violates rewilding floor (50% minimum)',
      principleViolated: 'rewilding_biodiversity',
    };
  }
  // Si se expande agricultura sobre área salvaje y el suelo está declinando
  if (
    proposal.expandAgricultureInto === 'wild_area' &&
    mrvContext.soilHealthTrend === 'declining'
  ) {
    return {
      veto: true,
      reason: 'Soil health declining; cannot expand into wild areas',
      principleViolated: 'soil_regeneration',
    };
  }
  return { veto: false };
}

/**
 * Evalúa el impacto de una decisión a 7 generaciones (~175-300 años).
 * Rechaza si compromete la capacidad futura de comunidades humanas o más-than-humanas.
 */
export function evaluateSevenGenerations(
  decision: { description: string; affectsFutureGenerations: boolean },
  horizonYears: number = 175,
): SevenGenerationsResult {
  if (decision.affectsFutureGenerations) {
    return {
      compliant: false,
      impact: 'negative',
      horizonYears,
      rationale:
        'Decision compromises ability of future generations (human or more-than-human) to thrive',
    };
  }
  return {
    compliant: true,
    impact: 'neutral',
    horizonYears,
    rationale: 'No intergenerational compromise detected',
  };
}

/**
 * Verifica que un área cumpla el piso de rewilding del 50%.
 */
export function verifyRewildingFloor(
  totalAreaHectares: number,
  rewildedAreaHectares: number,
): { compliant: boolean; rewildedPct: number } {
  const rewildedPct = (rewildedAreaHectares / totalAreaHectares) * 100;
  return {
    compliant: rewildedPct >= 50,
    rewildedPct,
  };
}

/**
 * Verifica densidad de agroforestería: 5+ especies por 10m², 20 por hectárea.
 */
export function verifyAgroforestryDensity(
  speciesPer10m2: number,
  speciesPerHectare: number,
): { compliant: boolean } {
  return {
    compliant: speciesPer10m2 >= 5 && speciesPerHectare >= 20,
  };
}
