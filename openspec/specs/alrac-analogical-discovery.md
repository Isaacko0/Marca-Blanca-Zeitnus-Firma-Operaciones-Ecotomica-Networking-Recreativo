# OpenSpec: ALRAC — Analogical (Modern Ancients) — Descubrimiento Analógico
## Fase 2 — Especificación OpenSpec (TypeScript)

**Especificación:** `alrac-analogical-discovery`  
**Versión:** 1.0.0  
**Fuente:** http://analogical.modernancients.com/  
**Licencia:** MIT para specs propias; conceptos de Modern Ancients® atribuidos, sin copia de código bajo licencia cerrada  
**Capas ALRAC:** 0 (Procedencia), 4 (Intelecto colectivo / Verificación triaxial), 5 (Federación de conocimiento)

---

## 1. Interfaces TypeScript

```typescript
// ============================================================================
// ALRAC — Analogical: Geometría del Pensamiento y Descubrimiento Analógico
// Capas: 0 (Procedencia), 4 (Intelecto Colectivo / Verificación), 5 (Federación de conocimiento)
// ============================================================================

export type ObservationType = 'phenomenon' | 'question' | 'anomaly' | 'mechanism' | 'analogy' | 'evidence' | 'contradiction';
export type RelationshipType = 'analogy' | 'evidence' | 'contradiction' | 'inspiration' | 'mechanism' | 'inspiration';
export type DiscoveryPhase = 'discover' | 'understand' | 'hypothesize' | 'translate' | 'mobilize' | 'learn';
export type Discipline = 'biology' | 'physics' | 'chemistry' | 'medicine' | 'materialsScience' | 'ecology' | 'mathematics' | 'engineering' | 'computerScience' | 'earthScience';

export interface Observation {
  observationId: string;
  fact: string;
  context: string;
  source: string;
  discipline: Discipline;
  type: ObservationType;
  timestamp: string;
  provenanceHash: string; // RAO append-only reference
  confidence: number; // 0-100
}

export interface Relationship {
  relationshipId: string;
  observationA: string;
  observationB: string;
  type: RelationshipType;
  strength: number; // 0-100 (semantic distance inversa)
  validated: boolean;
  expertInterpretation?: string;
  createdAt: string;
}

export interface SemanticDistance {
  observationA: string;
  observationB: string;
  distance: number; // 0-100 (0 = idéntico, 100 = no relacionado)
  disciplineBridge: Discipline[]; // disciplinas que conectan ambos
}

export interface GapReport {
  domain: Discipline;
  coveredTopics: string[];
  uncoveredTopics: string[];
  gapScore: number; // 0-100 (cuánto falta por explorar)
  opportunities: string[];
}

export interface AnomalyDetection {
  observationId: string;
  patternId: string;
  anomalyScore: number; // 0-100 (cuánto rompe el patrón)
  description: string;
  potentialDisruption: boolean;
}

export interface EpistemicMapNode {
  nodeId: string;
  type: ObservationType | RelationshipType;
  content: string;
  discipline: Discipline;
  connections: string[]; // nodeIds conectados
  layer: number; // capa epistémica (1=observación, 2=hipótesis, 3=evidencia, 4=hallazgo validado)
}

export interface DiscoveryCycleResult {
  phase: DiscoveryPhase;
  input: any;
  output: any;
  nextPhase: DiscoveryPhase | null;
  evidenceCollected: string[];
  humanJudgmentRequired: boolean;
}

export interface InvestigationStory {
  storyId: string;
  title: string;
  hypothesis: string;
  disciplines: Discipline[];
  status: 'open' | 'investigating' | 'validated' | 'failed' | 'candidate';
  observations: string[];
  relationships: string[];
  provenanceChain: string[];
}

// ============================================================================
// Result types
// ============================================================================

export interface ConnectionResult {
  relationshipId: string;
  analogyValid: boolean;
  confidence: number;
  requiresHumanJudgment: boolean;
}

export interface GapAnalysisResult {
  gaps: GapReport[];
  priorityOpportunities: string[];
}

// ============================================================================
// ALRAC Interface — Analogical Discovery
// ============================================================================

export interface AlracAnalogicalDiscovery {
  // Capa 0 — Procedencia (RAO)
  addObservation: (fact: string, context: string, source: string, discipline: Discipline, type: ObservationType) => Promise<Observation>;
  recordProvenance: (observation: Observation) => Promise<string>; // hash RAO

  // Capa 4 — Intelecto Colectivo / Verificación
  connectObservations: (obsA: string, obsB: string, type: RelationshipType, strength: number) => Promise<ConnectionResult>;
  semanticDistance: (obsA: string, obsB: string) => Promise<SemanticDistance>;
  gapAnalysis: (domain: Discipline, coveredTopics: string[]) => Promise<GapAnalysisResult>;
  anomalyDetection: (observation: Observation, patternId: string) => Promise<AnomalyDetection>;
  buildEpistemicMap: (observations: Observation[], relationships: Relationship[]) => Promise<EpistemicMapNode[]>;
  discoveryCycle: (phase: DiscoveryPhase, input: any) => Promise<DiscoveryCycleResult>;

  // Verificación triaxial
  verifyAnalogyValidity: (sourceDomain: Discipline, targetDomain: Discipline, mapping: string) => Promise<{ valid: boolean; confidence: number; requiresHumanJudgment: boolean }>;
  verifyEvidenceSufficiency: (claim: string, evidence: Observation[]) => Promise<{ sufficient: boolean; missing: string[] }>;
  verifyHumanJudgment: (aiSuggestion: string, humanReview: string) => Promise<{ approved: boolean; finalDecision: string }>;

  // Capa 5 — Federación de conocimiento
  federateInvestigation: (story: InvestigationStory) => Promise<string>; // retorna ID de nodo federado
  shareDiscovery: (discoveryId: string, targetNodes: string[]) => Promise<boolean>;
}
```

---

## 2. Reglas de negocio (traducidas de Analogical)

| # | Regla | Capa | Implementación sugerida |
|---|-------|------|------------------------|
| AN-01 | Cada observación tiene procedencia y disciplina de origen | 0 | `addObservation` requiere `source` y `discipline` |
| AN-02 | Conexiones entre observaciones requieren tipo y fuerza | 4 | `connectObservations` devuelve `ConnectionResult` con `confidence` |
| AN-03 | Distancia semántica mide proximidad conceptual | 4 | `semanticDistance` devuelve 0-100 |
| AN-04 | Análisis de vacío identifica temas no cubiertos | 4 | `gapAnalysis` devuelve `gapScore` y `opportunities` |
| AN-05 | Detección de anomalías señala hallazgos disruptivos | 4 | `anomalyDetection` devuelve `anomalyScore` y `potentialDisruption` |
| AN-06 | Mapa epistémico: Question → Evidence → Validated finding | 4 | `buildEpistemicMap` con capas 1-4 |
| AN-07 | Ciclo de descubrimiento: 6 fases (Discover→Learn) | 4 | `discoveryCycle` avanza fase por fase |
| AN-08 | Juicio humano permanece; IA solo asiste | 0/4 | `verifyHumanJudgment` exige `humanReview` antes de acción |
| AN-09 | Analogías marcadas como candidatas hasta validación | 4 | `verifyAnalogyValidity` devuelve `requiresHumanJudgment` |
| AN-10 | Evidencia suficiente requerida para hallazgos validados | 4 | `verifyEvidenceSufficiency` lista evidencias faltantes |
| AN-11 | Descubrimientos federados entre nodos de conocimiento | 5 | `federateInvestigation` comparte entre nodos |

---

## 3. Mapeo a capas ALRAC (resumen)

```
Capa 0 (Procedencia / RAO):
  ├── addObservation (con source + discipline)
  ├── recordProvenance (hash RAO append-only)

Capa 4 (Intelecto Colectivo / Verificación):
  ├── connectObservations (tipo + fuerza)
  ├── semanticDistance (0-100)
  ├── gapAnalysis (gapScore + oportunidades)
  ├── anomalyDetection (anomalyScore + disrupción)
  ├── buildEpistemicMap (capas 1-4)
  ├── discoveryCycle (6 fases)
  ├── verifyAnalogyValidity (candidata → validada)
  ├── verifyEvidenceSufficiency (evidencias faltantes)
  └── verifyHumanJudgment (humano aprueba)

Capa 5 (Federación de conocimiento):
  ├── federateInvestigation (compartir entre nodos)
  └── shareDiscovery (difusión controlada)
```

---

## 4. Verificación (checklist)

- [ ] `addObservation` implementado con procedencia RAO
- [ ] `connectObservations` implementado con tipo y fuerza
- [ ] `semanticDistance` implementado (0-100)
- [ ] `gapAnalysis` implementado (gapScore + oportunidades)
- [ ] `anomalyDetection` implementado (anomalyScore)
- [ ] `buildEpistemicMap` implementado (capas 1-4)
- [ ] `discoveryCycle` implementado (6 fases)
- [ ] `verifyAnalogyValidity` implementado (candidata/validada)
- [ ] `verifyEvidenceSufficiency` implementado
- [ ] `verifyHumanJudgment` implementado (humano aprueba)
- [ ] `federateInvestigation` implementado (Capa 5)

---

### Notas de derechos de autor

Esta especificación es una reimplementación del modelo conceptual "geometría del pensamiento" de Analogical (Modern Ancients®). No copia código Next.js ni interfaz de usuario. Los conceptos se atribuyen a Modern Ancients®, LLC. La especificación OpenSpec se publica bajo MIT como parte del repo Zeitnus.