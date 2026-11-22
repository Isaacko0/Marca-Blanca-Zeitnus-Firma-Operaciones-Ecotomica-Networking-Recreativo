// src/core/lib/non-transactional-value.ts
// Contabilidad de Valor No Transaccional (CVNT) — ALRAC/Zeitnus.
// Registra, verifica y protege condiciones que sostienen la vida sin requerir
// transacción económica. NO crea nueva moneda ni token. No remunera individualmente.
//
// Cinco componentes:
// 1. ContinuityRegistry — condiciones que sostienen la vida (4 dominios)
// 2. NonTransactionalEvent — observaciones sin transferencia económica
// 3. ExternalityAssessment — daños evitados, escenarios contrafactuales
// 4. CommonsStewardship — custodia de bienes comunes (no propiedad individual)
// 5. ContinuityDecisionEngine — evidencia → decisión de protección/asignación
//
// Seis categorías estrictas (no confundir):
// valor_observado | contribucion_atribuible | beneficio_colectivo | derecho_acceso | derecho_propiedad | recompensa_economica

export type ContinuityDomain =
  | 'biological'
  | 'social'
  | 'cognitive'
  | 'systemic';

export type ContinuityCategory =
  | 'valor_observado'
  | 'contribucion_atribuible'
  | 'beneficio_colectivo'
  | 'derecho_acceso'
  | 'derecho_propiedad'
  | 'recompensa_economica';

export interface ContinuityRecord {
  id: string;
  domain: ContinuityDomain;
  indicator: string;
  valueBefore: number;
  valueAfter: number;
  unit: string;
  location?: string;
  raoCredentialId: string;
  confidence: number;     // 0-1
  uncertainty: string;
  timestamp: number;
  isPublic: boolean;
}

export interface NonTransactionalEvent {
  id: string;
  type: 'observation' | 'claim' | 'fulfillment';
  resourceId: string;
  agentId?: string;       // opcional: no siempre hay agente reclamante
  description: string;
  avoidedHarm?: string;   // daño evitado (contrafactual)
  evidence: string[];     // IDs RAO
  timestamp: number;
  isPublic: boolean;
}

export interface ExternalityAssessment {
  id: string;
  eventId: string;
  counterfactualScenario: string;
  benefitType:
    | 'flood_avoided'
    | 'waste_reduced'
    | 'disease_prevented'
    | 'dependency_reduced'
    | 'tradition_preserved'
    | 'other';
  magnitude: number;      // 0-1
  confidence: number;     // 0-1
  uncertaintyNotes: string;
  timestamp: number;
}

export interface CommonsStewardship {
  id: string;
  commonsId: string;      // bien común (bosque, agua, semilla)
  stewardId: string;      // custodio temporal, NO propietario
  responsibility: string[];
  rights: string[];       // derecho de acceso, no propiedad
  revocable: boolean;     // siempre true
  timestamp: number;
}

export interface ContinuityDecision {
  id: string;
  evidenceIds: string[];
  decisionType: 'protect' | 'allocate' | 'maintain' | 'prevent';
  targetCommons: string;
  resourcesAllocated: number;   // TQ/kWh o ZNU, sin crear deuda
  rationale: string;
  approvedBy: string[];         // DIDs de gobernanza
  timestamp: number;
}

let cvntIdCounter = 0;
function nextCvntId(): string {
  cvntIdCounter += 1;
  return `cvnt-${Date.now()}-${cvntIdCounter}`;
}

const clamp01 = (v: number): number => Math.min(Math.max(v, 0), 1);

/**
 * Registra una condición de continuidad en uno de los 4 dominios.
 * Registro público por defecto (patrimonio colectivo).
 */
export function registerContinuity(
  record: Omit<ContinuityRecord, 'id'>,
): ContinuityRecord {
  if (record.confidence < 0 || record.confidence > 1) {
    throw new Error('non-transactional-value: confidence debe estar en [0,1]');
  }
  return {
    ...record,
    id: nextCvntId(),
    timestamp: Date.now(),
    isPublic: true,
  };
}

/**
 * Registra un evento no transaccional (observación sin contraprestación).
 * agentId es opcional: un evento puede no tener quien reclame recompensa.
 */
export function recordNonTransactionalEvent(
  event: Omit<NonTransactionalEvent, 'id'>,
): NonTransactionalEvent {
  return {
    ...event,
    id: nextCvntId(),
    timestamp: Date.now(),
    isPublic: true,
  };
}

/**
 * Evalúa una externalidad evitada: documento el escenario contrafactual,
 * magnitud y nivel de incertidumbre.
 */
export function assessExternalityAvoided(
  eventId: string,
  counterfactualScenario: string,
  benefitType: ExternalityAssessment['benefitType'],
  magnitude: number,
  confidence: number,
  uncertaintyNotes: string,
): ExternalityAssessment {
  if (magnitude < 0 || magnitude > 1) {
    throw new Error('non-transactional-value: magnitude debe estar en [0,1]');
  }
  if (confidence < 0 || confidence > 1) {
    throw new Error('non-transactional-value: confidence debe estar en [0,1]');
  }
  return {
    id: nextCvntId(),
    eventId,
    counterfactualScenario,
    benefitType,
    magnitude: clamp01(magnitude),
    confidence: clamp01(confidence),
    uncertaintyNotes,
    timestamp: Date.now(),
  };
}

/**
 * Asigna custodia temporal de un bien común.
 * Siempre revocable; los rights son de acceso, no propiedad.
 */
export function assignCommonsStewardship(
  commonsId: string,
  stewardId: string,
  responsibility: string[],
  rights: string[],
): CommonsStewardship {
  return {
    id: nextCvntId(),
    commonsId,
    stewardId,
    responsibility,
    rights,
    revocable: true,
    timestamp: Date.now(),
  };
}

/**
 * Traduce evidencia de continuidad en una decisión colectiva de protección
 * o asignación de recursos.
 * Regla fundamental: no genera deuda, crédito ni derecho de propiedad
 * individual para quien registró la evidencia.
 */
export function makeContinuityDecision(
  evidenceIds: string[],
  decisionType: ContinuityDecision['decisionType'],
  targetCommons: string,
  resourcesAllocated: number,
  rationale: string,
  approvedBy: string[],
): ContinuityDecision {
  if (resourcesAllocated < 0) {
    throw new Error('non-transactional-value: resourcesAllocated no puede ser negativo');
  }
  return {
    id: nextCvntId(),
    evidenceIds,
    decisionType,
    targetCommons,
    resourcesAllocated,
    rationale,
    approvedBy,
    timestamp: Date.now(),
  };
}

/**
 * Clasifica un valor en una de las 6 categorías estrictas.
 * Límite duro: rechaza confusión categórica.
 */
export function categorizeValue(
  hints: {
    isMeasurement?: boolean;
    isAttributableContribution?: boolean;
    isCollectiveBenefit?: boolean;
    isAccessRight?: boolean;
    isPropertyRight?: boolean;
    isEconomicReward?: boolean;
  },
): ContinuityCategory {
  const {
    isMeasurement = false,
    isAttributableContribution = false,
    isCollectiveBenefit = false,
    isAccessRight = false,
    isPropertyRight = false,
    isEconomicReward = false,
  } = hints;

  // Contar cuántas categorías se señalan simultáneamente
  let matches = 0;
  let result: ContinuityCategory = 'valor_observado';
  if (isMeasurement) { matches++; result = 'valor_observado'; }
  if (isAttributableContribution) { matches++; result = 'contribucion_atribuible'; }
  if (isCollectiveBenefit) { matches++; result = 'beneficio_colectivo'; }
  if (isAccessRight) { matches++; result = 'derecho_acceso'; }
  if (isPropertyRight) { matches++; result = 'derecho_propiedad'; }
  if (isEconomicReward) { matches++; result = 'recompensa_economica'; }

  if (matches === 0) {
    throw new Error(
      'non-transactional-value: debe señalarse al menos una categoría',
    );
  }
  if (matches > 1) {
    throw new Error(
      'non-transactional-value: confusión categórica — un valor no puede ser simultáneamente varias de las 6 categorías',
    );
  }
  return result;
}

/**
 * Rechaza explícitamente la creación de una nueva moneda CVNT.
 */
export function isCvntTokenAllowed(): boolean {
  return false;
}

/**
 * Rechaza la remuneración ligada a productividad individual como condición
 * de acceso a necesidades básicas.
 */
export function isRemunerationLinkedToBasicAccess(): boolean {
  return false;
}
