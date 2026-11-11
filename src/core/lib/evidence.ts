// HSCSG v15 OS — Evidence Model (asimilado de CompAI CRM + Shivarthu)
// Principio (CompAI CRM): "No tool accepts a confidence score, because a model
// asked to grade its own certainty will, and it will be wrong in the direction
// that makes it look useful." Las herramientas reportan OBSERVACIONES pesadas
// por un ledger; el nodo NUNCA gradea su propia certeza.
//
// Score Schelling (Shivarthu): agregación de juicios con outlier removal
// (mean ± 1 SD) para consenso estadísticamente honesto.

export type EvidenceKind =
  | 'profile.email-match'
  | 'linkedin.employer-and-name'
  | 'crm.thread-reply'
  | 'crm.signature-block'
  | 'github.account-identity'
  | 'crm.meeting-attendance'
  | 'web.cited-claim'
  | 'handle.name-form'
  | 'search.cites-profile'
  | 'employer-only'
  | 'aut.observation' // observación directa del nodo (sensor, RAO)
  | 'cds.consensus' // consenso de pares del nodo
  | 'contradiction'

type Weighting = { weight: number; primary: boolean; label: string }

// Pesos portados de CompAI CRM (lib/evidence.ts), extendidos con fuentes HSCSG.
export const WEIGHTS: Record<EvidenceKind, Weighting> = {
  'profile.email-match': { weight: 0.95, primary: true, label: 'el email está en el perfil' },
  'linkedin.employer-and-name': { weight: 0.85, primary: true, label: 'LinkedIn: empleador y nombre coinciden' },
  'crm.thread-reply': { weight: 0.85, primary: true, label: 'respondió en un hilo del nodo' },
  'crm.signature-block': { weight: 0.8, primary: true, label: 'su firma propia lo dice' },
  'github.account-identity': { weight: 0.8, primary: true, label: 'la cuenta GitHub nombra su empleador' },
  'crm.meeting-attendance': { weight: 0.7, primary: true, label: 'asistió a una reunión del nodo' },
  'aut.observation': { weight: 0.85, primary: true, label: 'observación directa del nodo (sensor/RAO)' },
  'cds.consensus': { weight: 0.8, primary: true, label: 'consenso de pares del nodo' },
  'web.cited-claim': { weight: 0.4, primary: false, label: 'una fuente web citada lo afirma' },
  'handle.name-form': { weight: 0.35, primary: false, label: 'el handle es forma de su nombre' },
  'search.cites-profile': { weight: 0.35, primary: false, label: 'una búsqueda cita este perfil' },
  'employer-only': { weight: 0.2, primary: false, label: 'el empleador coincide, el nombre no' },
  contradiction: { weight: 0, primary: false, label: 'otra fuente discrepa' },
}

export type FactBand = 'VERIFIED' | 'PROBABLE' | 'POSSIBLE' | null

export type Evidence = {
  kind: EvidenceKind
  detail: string
  sourceUrl?: string
}

export type Scored = {
  score: number
  band: FactBand
  hasPrimary: boolean
  rationale: string
}

const CEILING = 0.99
const CONTRADICTED = 0.45
export const BAND_FLOOR = { VERIFIED: 0.85, PROBABLE: 0.55, POSSIBLE: 0.3 }

// ---- Evidence Model (CompAI CRM) ----
export function scoreEvidence(evidence: Evidence[]): Scored {
  if (evidence.length === 0) {
    return { score: 0, band: null, hasPrimary: false, rationale: 'Sin evidencia.' }
  }
  const contradicted = evidence.some((i) => i.kind === 'contradiction')
  const hasPrimary = evidence.some((i) => WEIGHTS[i.kind].primary)

  // Combinación multiplicativa: cada evidencia reduce la incertidumbre.
  const combined = evidence.reduce(
    (remaining, item) => remaining * (1 - WEIGHTS[item.kind].weight),
    1,
  )
  let score = Math.min(CEILING, 1 - combined)
  if (contradicted) score = Math.min(score, CONTRADICTED)

  return {
    score,
    band: bandFor(score, hasPrimary),
    hasPrimary,
    rationale: rationaleFor(evidence, contradicted, hasPrimary),
  }
}

export function bandFor(score: number, hasPrimary: boolean): FactBand {
  if (score >= BAND_FLOOR.VERIFIED && hasPrimary) return 'VERIFIED'
  if (score >= BAND_FLOOR.PROBABLE) return 'PROBABLE'
  if (score >= BAND_FLOOR.POSSIBLE) return 'POSSIBLE'
  return null
}

function rationaleFor(
  evidence: Evidence[],
  contradicted: boolean,
  hasPrimary: boolean,
): string {
  const reasons = evidence
    .filter((i) => i.kind !== 'contradiction')
    .map((i) => WEIGHTS[i.kind].label)
  if (contradicted) {
    const clash = evidence.find((i) => i.kind === 'contradiction')
    return `Sostenido: ${clash?.detail ?? 'las fuentes discrepan'}.`
  }
  if (reasons.length === 0) return 'Sin evidencia de soporte.'
  const list = joinWords(reasons)
  return hasPrimary
    ? capitalise(list)
    : `${capitalise(list)} — pero nada identifica directamente.`
}

function joinWords(words: string[]): string {
  if (words.length === 1) return words[0]
  return `${words.slice(0, -1).join(', ')} y ${words[words.length - 1]}`
}
function capitalise(v: string): string {
  return v.charAt(0).toUpperCase() + v.slice(1)
}

// ---- Score Schelling (Shivarthu) — agregación de juicios con outlier removal ----
// Entrada: array de valores (ej. estimaciones de jurados). Devuelve mean, SD,
// y la nueva mean tras descartar valores >1 SD (68.27% del dataset restante).
export function meanInteger(data: number[]): number | null {
  if (data.length === 0) return null
  return data.reduce((a, b) => a + b, 0) / data.length
}

export function stdDeviationInteger(data: number[]): { variance: number; mean: number } | null {
  const mean = meanInteger(data)
  if (mean === null || data.length === 0) return null
  const variance = data.reduce((a, v) => a + (mean - v) ** 2, 0) / data.length
  return { variance, mean }
}

export function calculateNewMean(
  data: number[],
  sdAndMean: { variance: number; mean: number },
): { newMean: number; kept: number[]; removed: number[] } {
  const { variance, mean } = sdAndMean
  const sd = Math.sqrt(variance)
  const kept: number[] = []
  const removed: number[] = []
  for (const x of data) {
    if (x >= mean - sd && x <= mean + sd) kept.push(x)
    else removed.push(x)
  }
  const newMean = meanInteger(kept) ?? mean
  return { newMean, kept, removed }
}

export type SchellingResult = {
  mean: number
  sd: number
  newMean: number
  kept: number[]
  removed: number[]
  winners: number[]
}

// values: estimaciones de jurados. range: tolerancia para "ganador" (usado en Shivarthu)
export function scoreSchelling(values: number[], tolerancePct = 10): SchellingResult {
  const d = values.map((v) => Math.round(v * 1000))
  const sa = stdDeviationInteger(d)
  if (!sa) return { mean: 0, sd: 0, newMean: 0, kept: [], removed: [], winners: [] }
  const { newMean, kept, removed } = calculateNewMean(d, sa)
  const winners: number[] = []
  for (let i = 0; i < d.length; i++) {
    const dev = newMean === 0 ? 0 : (Math.abs(d[i] - newMean) / newMean) * 100
    if (dev <= tolerancePct) winners.push(i)
  }
  return {
    mean: sa.mean / 1000,
    sd: Math.sqrt(sa.variance) / 1000,
    newMean: newMean / 1000,
    kept,
    removed,
    winners,
  }
}


// ============================================
// MATRIOSKA FACT BAND EXTENSION (ESP-D8, ESP-D11)
// Costos externalizados, fallos hardware, anti-fragilidad
// Basado en Matrioska System: externalized_cost, verified, escalated
// ============================================

/** Bandas de hechos estilo Matrioska (nested verification) */
export type MatrioskaFactBand = 
  | 'VERIFIED'           // Verificado por múltiples fuentes independientes + RAO
  | 'PROBABLE'           // Evidencia fuerte pero single-source
  | 'POSSIBLE'           // Evidencia débil o indirecta
  | 'EXTERNALIZED_COST'  // FALLO REAL: costo externalizado al entorno (hardware roto, bacteria muerta, sensor falla)
  | 'ESCALATED'          // Escalado a gobernanza humana (CDS_Jurados)
  | 'SUPERSEDED'         // Superado por nueva evidencia
  | 'CONTRADICTED'       // Contradicción activa
  | null;                // Sin evidencia

/** Tipo de evidencia para Matrioska */
export type MatrioskaEvidenceKind = 
  | 'sensor.reading'           // Lectura sensor SVD v2
  | 'actuator.execution'       // Ejecución actuador (bomba, motor, LED)
  | 'hardware.failure'         // FALLO HARDWARE: sensor roto, bomba quemada, fuga MFC
  | 'biology.failure'          // FALLO BIOLÓGICO: bacteria muere, contaminación Spirulina, MFC se seca
  | 'protocol.deviation'       // Desviación protocolo (no alimentó a tiempo, temperatura fuera rango)
  | 'human.observation'        // Observación humana (hoja 3 columnas, verbalización)
  | 'rao.entry'                // Entry RAO (origen, permiso, estado, revocación)
  | 'cds.consensus'            // Consenso CDS_Jurados
  | 'automaton.decision'       // Decisión Autómata E²R (EXPLORE->MJ Gate->EXECUTE->REVIEW)
  | 'external.audit'           // Auditoría externa independiente
  | 'cost.externalized';       // COSTO EXTERNALIZADO: fallo que el entorno absorbe

/** Evidencia Matrioska con trazabilidad completa */
export interface MatrioskaEvidence {
  id: string;
  kind: MatrioskaEvidenceKind;
  source: string;                    // Device ID, agent ID, "human_observer_1", "cds_jurados"
  timestamp: number;
  data: Record<string, unknown>;
  // Trazabilidad
  hash: string;                      // Hash datos para inmutabilidad
  signatures: string[];              // Firmas criptográficas (opcional)
  raoRef?: string;                   // Referencia RAO entry
  // Matrioska nesting
  parentEvidenceId?: string;         // Evidencia padre (si nested)
  childEvidenceIds: string[];        // Evidencias hijas
  // Verificación
  verifiedBy?: string;               // Quién verificó
  verifiedAt?: number;
  verificationMethod?: 'automated' | 'human' | 'cross_reference' | 'statistical';
}

/** Hecho con banda Matrioska */
export interface MatrioskaFact {
  id: string;
  claim: string;                     // Afirmación: "MFC_1 voltaje > 0.3V sostenido 24h"
  domain: 'hardware' | 'biology' | 'protocol' | 'governance' | 'economics' | 'social';
  band: MatrioskaFactBand;
  confidence: number;                // 0-1
  evidence: MatrioskaEvidence[];     // Evidencias soportando
  // Matrioska nesting
  parentFactId?: string;             // Hecho padre
  childFactIds: string[];            // Hechos hijos (desglose)
  // Lifecycle
  createdAt: number;
  updatedAt: number;
  supersededAt?: number;
  supersededBy?: string;
  // Contexto
  context: {
    experimentId?: string;           // "kit72h_run_001"
    nodeId?: string;                 // "kit72h_node_1"
    automatonCycle?: number;         // Ciclo E²R
    relatedMetrics?: string[];       // ["xi", "CAC", "FSI"]
  };
}

/** Externalized Cost Record - Registro de costo externalizado (fallo real) */
export interface ExternalizedCostRecord {
  id: string;
  factId: string;                    // Hecho que externalizó costo
  type: 'hardware_failure' | 'biology_failure' | 'sensor_drift' | 'actuator_failure' | 'protocol_deviation' | 'contamination' | 'power_loss' | 'communication_loss';
  description: string;               // "Bomba peristáltica MFC quemada tras 48h operación continua"
  // Impacto
  severity: 'low' | 'medium' | 'high' | 'critical';
  costEstimate: {
    monetary_EUR?: number;           // Costo reparación/reemplazo (€)
    timeHours?: number;              // Tiempo reparación (horas)
    autonomyImpact?: number;         // Impacto AUT (0-1)
    regenerationImpact?: number;     // Impacto regeneración (0-1)
    dataLoss?: boolean;              // Pérdida datos
  };
  // Quién absorbe el costo
  absorbedBy: 'environment' | 'node_resources' | 'federation_pool' | 'insurance' | 'community_labor' | 'unknown';
  // Mitigación
  mitigation: {
    immediate: string;               // Acción inmediata: "Switch to backup pump"
    shortTerm: string;               // Corto plazo: "Replace pump within 24h"
    longTerm: string;                // Largo plazo: "Redesign pump driver circuit"
    prevention: string;              // Prevención: "Add current monitoring + thermal cutoff"
  };
  // Trazabilidad
  detectedAt: number;
  detectedBy: 'sensor' | 'automaton' | 'human' | 'external_audit';
  resolvedAt?: number;
  resolvedBy?: string;
  // Matrioska
  parentCostId?: string;
  childCostIds: string[];
  // Aprendizaje
  lessonsLearned: string[];
  patternTag?: string;               // Tag para pattern matching: "pump_overheating", "membrane_fouling"
}

/** Matrioska Fact Ledger - Libro de hechos anidados */
export class MatrioskaFactLedger {
  private facts: Map<string, MatrioskaFact> = new Map();
  private evidence: Map<string, MatrioskaEvidence> = new Map();
  private externalizedCosts: Map<string, ExternalizedCostRecord> = new Map();
  private indexes: {
    byBand: Map<MatrioskaFactBand, Set<string>>;
    byDomain: Map<string, Set<string>>;
    byPatternTag: Map<string, Set<string>>;
    byNode: Map<string, Set<string>>;
  };

  constructor() {
    this.indexes = {
      byBand: new Map(),
      byDomain: new Map(),
      byPatternTag: new Map(),
      byNode: new Map()
    };
    // Inicializar bandas
    const bands: MatrioskaFactBand[] = ['VERIFIED', 'PROBABLE', 'POSSIBLE', 'EXTERNALIZED_COST', 'ESCALATED', 'SUPERSEDED', 'CONTRADICTED', null];
    for (const band of bands) {
      this.indexes.byBand.set(band, new Set());
    }
  }

  /** Añade hecho */
  addFact(fact: MatrioskaFact): void {
    this.facts.set(fact.id, fact);
    this.updateIndexes(fact);
  }

  /** Añade evidencia */
  addEvidence(evidence: MatrioskaEvidence): void {
    this.evidence.set(evidence.id, evidence);
  }

  /** Registra costo externalizado (FALLO REAL) */
  externalizeCost(record: ExternalizedCostRecord): void {
    this.externalizedCosts.set(record.id, record);
    
    // Crear/actualizar hecho EXTERNALIZED_COST
    const factId = `fact_ec_${record.id}`;
    let fact = this.facts.get(factId);
    
    if (!fact) {
      fact = {
        id: factId,
        claim: `Externalized cost: ${record.description}`,
        domain: this.inferDomain(record.type),
        band: 'EXTERNALIZED_COST',
        confidence: 0.9, // Fallo real = alta confianza que ocurrió
        evidence: [],
        childFactIds: [],
        createdAt: record.detectedAt,
        updatedAt: record.detectedAt,
        context: { nodeId: record.mitigation.immediate }
      };
      this.facts.set(factId, fact);
    }
    
    fact.band = 'EXTERNALIZED_COST';
    fact.updatedAt = Date.now();
    fact.context.relatedMetrics = ['autonomyImpact', 'regenerationImpact'];
    this.updateIndexes(fact);
    
    // Indexar por pattern tag
    if (record.patternTag) {
      const set = this.indexes.byPatternTag.get(record.patternTag) || new Set();
      set.add(record.id);
      this.indexes.byPatternTag.set(record.patternTag, set);
    }
    
    // Emitir evento para retroalimentar autómata
    this.emitExternalizedCost(record);
  }

  private inferDomain(type: ExternalizedCostRecord['type']): MatrioskaFact['domain'] {
    if (type.includes('hardware') || type.includes('sensor') || type.includes('actuator') || type.includes('power') || type.includes('communication')) return 'hardware';
    if (type.includes('biology') || type.includes('contamination')) return 'biology';
    if (type.includes('protocol')) return 'protocol';
    return 'hardware';
  }

  private updateIndexes(fact: MatrioskaFact): void {
    // By band
    const bandSet = this.indexes.byBand.get(fact.band) || new Set();
    bandSet.add(fact.id);
    this.indexes.byBand.set(fact.band, bandSet);
    
    // By domain
    const domainSet = this.indexes.byDomain.get(fact.domain) || new Set();
    domainSet.add(fact.id);
    this.indexes.byDomain.set(fact.domain, domainSet);
    
    // By node
    if (fact.context.nodeId) {
      const nodeSet = this.indexes.byNode.get(fact.context.nodeId) || new Set();
      nodeSet.add(fact.id);
      this.indexes.byNode.set(fact.context.nodeId, nodeSet);
    }
  }

  private emitExternalizedCost(record: ExternalizedCostRecord): void {
    // En producción: emitir evento para automaton.ts retroalimentar
    // this.emit('externalized_cost', record);
  }

  /** Obtiene hechos por banda */
  getFactsByBand(band: MatrioskaFactBand): MatrioskaFact[] {
    const ids = this.indexes.byBand.get(band) || new Set();
    return Array.from(ids).map(id => this.facts.get(id)!).filter(Boolean);
  }

  /** Obtiene hechos por dominio */
  getFactsByDomain(domain: MatrioskaFact['domain']): MatrioskaFact[] {
    const ids = this.indexes.byDomain.get(domain) || new Set();
    return Array.from(ids).map(id => this.facts.get(id)!).filter(Boolean);
  }

  /** Obtiene costos externalizados por pattern tag */
  getExternalizedCostsByPattern(patternTag: string): ExternalizedCostRecord[] {
    const ids = this.indexes.byPatternTag.get(patternTag) || new Set();
    return Array.from(ids).map(id => this.externalizedCosts.get(id)!).filter(Boolean);
  }

  /** Obtiene costos externalizados por nodo */
  getExternalizedCostsByNode(nodeId: string): ExternalizedCostRecord[] {
    const factIds = this.indexes.byNode.get(nodeId) || new Set();
    const costs: ExternalizedCostRecord[] = [];
    for (const factId of factIds) {
      const fact = this.facts.get(factId);
      if (fact && fact.band === 'EXTERNALIZED_COST') {
        // Buscar costo correspondiente
        for (const cost of this.externalizedCosts.values()) {
          if (cost.id.includes(factId.replace('fact_ec_', ''))) {
            costs.push(cost);
          }
        }
      }
    }
    return costs;
  }

  /** Estadísticas de anti-fragilidad */
  getAntifragilityStats(nodeId?: string): {
    totalFacts: number;
    byBand: Record<MatrioskaFactBand, number>;
    externalizedCosts: number;
    totalExternalizedCost_EUR: number;
    avgTimeToResolve_hours: number;
    patternFrequency: Record<string, number>;
    mostCommonFailureType: string;
    antifragilityIndex: number; // 0-1: qué tan bien el sistema aprende de fallos
  } {
    let facts = Array.from(this.facts.values());
    if (nodeId) {
      facts = facts.filter(f => f.context.nodeId === nodeId);
    }
    
    const costs = nodeId 
      ? this.getExternalizedCostsByNode(nodeId)
      : Array.from(this.externalizedCosts.values());
    
    const byBand: Record<MatrioskaFactBand, number> = {
      VERIFIED: 0, PROBABLE: 0, POSSIBLE: 0, EXTERNALIZED_COST: 0, ESCALATED: 0, SUPERSEDED: 0, CONTRADICTED: 0, null: 0
    };
    
    for (const fact of facts) {
      byBand[fact.band]++;
    }
    
    const patternFreq: Record<string, number> = {};
    let totalCost = 0;
    let totalResolveTime = 0;
    let resolvedCount = 0;
    const typeFreq: Record<string, number> = {};
    
    for (const cost of costs) {
      totalCost += cost.costEstimate.monetary_EUR || 0;
      if (cost.resolvedAt && cost.detectedAt) {
        totalResolveTime += (cost.resolvedAt - cost.detectedAt) / 3600000;
        resolvedCount++;
      }
      if (cost.patternTag) {
        patternFreq[cost.patternTag] = (patternFreq[cost.patternTag] || 0) + 1;
      }
      typeFreq[cost.type] = (typeFreq[cost.type] || 0) + 1;
    }
    
    // Antifragility index: ratio de fallos con mitigación documentada / total fallos
    const mitigatedCosts = costs.filter(c => c.mitigation.prevention.length > 20).length;
    const antifragilityIndex = costs.length > 0 ? mitigatedCosts / costs.length : 1;
    
    const mostCommonType = Object.entries(typeFreq).sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';
    
    return {
      totalFacts: facts.length,
      byBand,
      externalizedCosts: costs.length,
      totalExternalizedCost_EUR: totalCost,
      avgTimeToResolve_hours: resolvedCount > 0 ? totalResolveTime / resolvedCount : 0,
      patternFrequency: patternFreq,
      mostCommonFailureType: mostCommonType,
      antifragilityIndex
    };
  }

  /** Genera reporte para Entropic Auditor (ξ) */
  generateAuditorReport(nodeId?: string): {
    nodeId?: string;
    timestamp: number;
    antifragilityStats: any;
    recentExternalizedCosts: ExternalizedCostRecord[];
    recommendations: string[];
  } {
    const stats = this.getAntifragilityStats(nodeId);
    const recentCosts = (nodeId 
      ? this.getExternalizedCostsByNode(nodeId)
      : Array.from(this.externalizedCosts.values())
    ).sort((a, b) => b.detectedAt - a.detectedAt).slice(0, 10);
    
    const recommendations: string[] = [];
    
    if (stats.antifragilityIndex < 0.5) {
      recommendations.push("BAJA ANTIFRAGILIDAD: Menos del 50% de fallos tienen prevención documentada. Priorizar post-mortems.");
    }
    
    if (stats.mostCommonFailureType !== 'none') {
      recommendations.push(`PATRÓN DOMINANTE: ${stats.mostCommonFailureType}. Implementar mitigación sistémica.`);
    }
    
    if (stats.totalExternalizedCost_EUR > 100) {
      recommendations.push(`COSTO EXTERNALIZADO ALTO: €${stats.totalExternalizedCost_EUR.toFixed(2)}. Revisar diseño hardware.`);
    }
    
    if (stats.avgTimeToResolve_hours > 24) {
      recommendations.push(`TIEMPO RESOLUCIÓN LENTO: ${stats.avgTimeToResolve_hours.toFixed(1)}h promedio. Mejorar repuestos/procedimientos.`);
    }
    
    return {
      nodeId,
      timestamp: Date.now(),
      antifragilityStats: stats,
      recentExternalizedCosts: recentCosts,
      recommendations
    };
  }

  /** Serializa para persistencia */
  toJSON(): string {
    return JSON.stringify({
      facts: Array.from(this.facts.entries()),
      evidence: Array.from(this.evidence.entries()),
      externalizedCosts: Array.from(this.externalizedCosts.entries()),
      indexes: {
        byBand: Array.from(this.indexes.byBand.entries()).map(([k, v]) => [k, Array.from(v)]),
        byDomain: Array.from(this.indexes.byDomain.entries()).map(([k, v]) => [k, Array.from(v)]),
        byPatternTag: Array.from(this.indexes.byPatternTag.entries()).map(([k, v]) => [k, Array.from(v)]),
        byNode: Array.from(this.indexes.byNode.entries()).map(([k, v]) => [k, Array.from(v)])
      }
    }, null, 2);
  }

  /** Carga desde JSON */
  static fromJSON(json: string): MatrioskaFactLedger {
    const data = JSON.parse(json);
    const ledger = new MatrioskaFactLedger();
    ledger.facts = new Map(data.facts);
    ledger.evidence = new Map(data.evidence);
    ledger.externalizedCosts = new Map(data.externalizedCosts);
    ledger.indexes.byBand = new Map(data.indexes.byBand.map(([k, v]: [any, any[]]) => [k, new Set(v)]));
    ledger.indexes.byDomain = new Map(data.indexes.byDomain.map(([k, v]: [any, any[]]) => [k, new Set(v)]));
    ledger.indexes.byPatternTag = new Map(data.indexes.byPatternTag.map(([k, v]: [any, any[]]) => [k, new Set(v)]));
    ledger.indexes.byNode = new Map(data.indexes.byNode.map(([k, v]: [any, any[]]) => [k, new Set(v)]));
    return ledger;
  }
}

/** Instancia singleton global */
let globalMatrioskaLedger: MatrioskaFactLedger | null = null;

export function getMatrioskaLedger(): MatrioskaFactLedger {
  if (!globalMatrioskaLedger) {
    globalMatrioskaLedger = new MatrioskaFactLedger();
  }
  return globalMatrioskaLedger;
}

export function setMatrioskaLedger(ledger: MatrioskaFactLedger): void {
  globalMatrioskaLedger = ledger;
}
