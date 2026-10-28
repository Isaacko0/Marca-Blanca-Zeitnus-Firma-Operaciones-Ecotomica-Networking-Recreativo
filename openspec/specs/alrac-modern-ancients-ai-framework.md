# OpenSpec: ALRAC — Modern Ancients Marco de IA Responsable y Ética
## Fase 2 — Especificación OpenSpec (TipoScript)

**Especificación:** `alrac-modern-ancients-ai-framework`  
**Versión:** 1.0.0  
**Fuente:** Modern Ancients® Responsible & Ethical AI Manifesto (https://www.modernancients.com) + paste `pasted_content_2026-10-28_23-06-03-803_7807e7.txt`  
**Licencia:** MIT para specs propias; conceptos de Modern Ancients® atribuidos, sin copia de código bajo licencia cerrada  
**Capas ALRAC:** 0 (Procedencia/Conciencia), 1 (TQ/Economía regenerativa), 3 (ReFi/Planetary), 4 (Verificación triaxial/Intelecto colectivo), 5 (Federación)

---

## 1. Interfaces TypeScript

```typescript
// ============================================================================
// ALRAC — Modern Ancients: Marco de IA Responsable y Ética
// Capas: 0 (Procedencia), 1 (Economía Regenerativa), 3 (ReFi), 4 (Verificación), 5 (Federación)
// ============================================================================

export type StewardshipLevel = 'none' | 'declared' | 'active' | 'verified';
export type EthicalCrossroad = 'bias' | 'extraction' | 'manipulation' | 'decontextualization' | 'commodification';
export type TemporalLayer = 'past' | 'present' | 'future';
export type ROIDimension = 'ecological' | 'social' | 'spiritual' | 'profit';

export interface ProvenanceRecord {
  observationId: string;
  source: string;
  context: string;
  temporalLayer: TemporalLayer;
  consent: boolean;
  stewardshipLevel: StewardshipLevel;
  timestamp: string;
  hash: string; // RAO append-only reference
}

export interface KnowledgeSynthesisRequest {
  knowledgeId: string;
  sourceKnowledge: ProvenanceRecord[];
  targetContext: string;
  requiresConsent: boolean;
  requiresStewardship: boolean;
}

export interface KnowledgeSynthesisResult {
  synthesisId: string;
  decontextualizationRisk: 'low' | 'medium' | 'high';
  provenancePreserved: boolean;
  consentObtained: boolean;
  stewardshipAssigned: StewardshipLevel;
  warning?: string;
}

export interface EthicalCrossroadAssessment {
  crossroadType: EthicalCrossroad;
  detected: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendedPath: string;
  auditTrailId: string;
}

export interface DynamicGovernanceRule {
  ruleId: string;
  name: string;
  condition: string;
  action: string;
  adaptive: boolean; // se reconfigura con nuevos valores/tecnologías
  lastAudit: string;
  version: string;
}

export interface RegenerativeROI {
  capitalFlowId: string;
  ecological: number; // -100 a 100
  social: number;     // -100 a 100
  spiritual: number;  // -100 a 100
  profit: number;     // -100 a 100
  isRegenerative: boolean; // true si ecological + social + spiritual > 0 y profit no dominante
}

export interface UserSovereigntyRecord {
  userId: string;
  decisionId: string;
  aiSuggestion: string;
  humanDecision: string;
  aiOverruled: boolean; // debe ser false siempre
  finalAgency: 'user' | 'ai'; // debe ser 'user'
  timestamp: string;
}

export interface IntergenerationalTransmission {
  knowledgeId: string;
  sacredOrCultural: boolean;
  commodificationRisk: 'none' | 'low' | 'medium' | 'high';
  consentObtained: boolean;
  stewardshipAssigned: string;
  livingContinuum: boolean;
}

export interface PlanetaryAlignment {
  systemId: string;
  carbonConscious: boolean;
  energyEfficientByDefault: boolean;
  ecologicalAwareness: boolean;
  earthAsLivingSystem: boolean;
}

export interface MirrorOfConsciousness {
  systemId: string;
  transparency: number; // 0-100
  coherence: number;    // 0-100
  accountability: number; // 0-100
  manipulationDetected: boolean;
  deceptionDetected: boolean;
}

export interface SystemicArchitectRecord {
  organizationId: string;
  circularEconomy: boolean;
  adaptiveOrganization: boolean;
  trustBasedNetwork: boolean;
  coordinationAtScale: boolean;
  purpose: 'control' | 'coordination';
}

// ============================================================================
// Result types
// ============================================================================

export interface VerifyResult {
  passed: boolean;
  reason?: string;
  layer: '0' | '1' | '3' | '4' | '5';
  timestamp: string;
}

export interface BlockResult {
  blocked: boolean;
  reason: string;
  alternative?: string;
}

// ============================================================================
// ALRAC Interface — Modern Ancients IA Ética
// ============================================================================

export interface AlracModernAncientsEthics {
  // Capa 0 — Procedencia / Conciencia / RAO
  verifyKnowledgeLineage: (req: KnowledgeSynthesisRequest) => Promise<KnowledgeSynthesisResult>;
  verifyIntergenerationalTransmission: (req: IntergenerationalTransmission) => Promise<VerifyResult>;
  recordProvenance: (record: ProvenanceRecord) => Promise<string>; // retorna hash RAO

  // Capa 1 — Economía Regenerativa / TQ
  verifyRegenerativeROI: (roi: RegenerativeROI) => Promise<VerifyResult>;
  verifyNoExtractionWithoutConsciousness: (capitalFlowId: string) => Promise<BlockResult>;

  // Capa 3 — ReFi / Planetary / Nivel 3
  verifyPlanetaryAlignment: (pa: PlanetaryAlignment) => Promise<VerifyResult>;
  verifyCarbonConscious: (systemId: string) => Promise<VerifyResult>;

  // Capa 4 — Verificación Triaxial / Intelecto Colectivo
  verifyEthicalCrossroad: (assessment: EthicalCrossroadAssessment) => Promise<VerifyResult>;
  verifyUserSovereignty: (record: UserSovereigntyRecord) => Promise<VerifyResult>;
  verifyMirrorOfConsciousness: (mc: MirrorOfConsciousness) => Promise<VerifyResult>;
  verifyTriaxialRetina: (context: string) => Promise<VerifyResult>; // ética / ecológica / económica

  // Capa 5 — Federación / Arquitectura Sistémica
  verifySystemicArchitect: (sa: SystemicArchitectRecord) => Promise<VerifyResult>;
  verifyCircularEconomy: (orgId: string) => Promise<VerifyResult>;
  verifyTrustBasedNetwork: (networkId: string) => Promise<VerifyResult>;

  // Stewardship — principio rector
  verifyStewardshipIntegrity: (userId: string, systemId: string) => Promise<VerifyResult>;
  requireStewardshipBeforeDeploy: (systemId: string) => Promise<BlockResult>;

  // Auditoría continua (Living Ethical Governance)
  scheduleEthicsAudit: (ruleId: string, intervalDays: number) => Promise<string>;
  continuousGovernanceRule: (rule: DynamicGovernanceRule) => Promise<void>;
}
```

---

## 2. Reglas de negocio (traducidas del manifiesto)

| # | Regla | Capa | Implementación sugerida |
|---|-------|------|------------------------|
| MA-01 | IA nunca distorsiona ni descontextualiza conocimiento por velocidad o escala | 0 | `verifyKnowledgeLineage` rechaza si `decontextualizationRisk === 'high'` |
| MA-02 | IA mejora resiliencia, intuición y creatividad; no las sustituye | 2 | `verifyUserSovereignty` exige `humanDecision !== aiSuggestion` o justificación |
| MA-03 | Cada algoritmo auditable, explainable, refinado para mitigar sesgo | 4 | `verifyEthicalCrossroad` con `auditTrailId` obligatorio |
| MA-04 | IA descentraliza poder, levanta voces marginadas | 1 | TQ Ledger con límites ±500, prohibición de arbitraje |
| MA-05 | Capital alineado con ROI ecológico, social y espiritual | 3 | `verifyRegenerativeROI` requiere `ecological + social + spiritual > 0` |
| MA-06 | Usuario retiene agencia, autoría y responsabilidad moral final | 4 | `humanDecision` siempre prevalece sobre `aiSuggestion` |
| MA-07 | Conocimiento sagrado/cultural protegido de mercantilización | 5 | `verifyIntergenerationalTransmission` requiere `consentObtained` |
| MA-08 | IA aliada de la Tierra, computación sostenible por defecto | 3 | `verifyPlanetaryAlignment` exige `carbonConscious && energyEfficientByDefault` |
| MA-09 | IA nunca manipula ni engaña; poder en transparencia y accountability | 4 | `verifyMirrorOfConsciousness` exige `transparency >= 80` |
| MA-10 | Propósito: coordinación a escala, no control privado | 5 | `SystemicArchitectRecord.purpose === 'coordination'` |
| MA-11 | No construir lo que no se esté dispuesto a administrar con integridad | 0/5 | `requireStewardshipBeforeDeploy` bloquea si no hay steward |

---

## 3. Mapeo a capas ALRAC (resumen)

```
Capa 0 (Conciencia / Procedencia / RAO):
  ├── verifyKnowledgeLineage
  ├── verifyIntergenerationalTransmission
  ├── recordProvenance (RAO append-only)
  └── requireStewardshipBeforeDeploy

Capa 1 (Economía / TQ / Equidad):
  ├── verifyRegenerativeROI
  ├── verifyNoExtractionWithoutConsciousness
  └── verifyArbitrageProhibition (heredado de ALRAC base)

Capa 3 (ReFi / Planetary / Nivel 3):
  ├── verifyPlanetaryAlignment
  ├── verifyCarbonConscious
  └── priceParity Oracle (ZNU)

Capa 4 (Verificación / Intelecto Colectivo):
  ├── verifyEthicalCrossroad
  ├── verifyUserSovereignty
  ├── verifyMirrorOfConsciousness
  └── verifyTriaxialRetina

Capa 5 (Federación / Arquitectura Sistémica):
  ├── verifySystemicArchitect
  ├── verifyCircularEconomy
  └── verifyTrustBasedNetwork
```

---

## 4. Verificación (checklist)

- [ ] `verifyKnowledgeLineage` implementado y probado
- [ ] `verifyRegenerativeROI` implementado y probado
- [ ] `verifyUserSovereignty` implementado y probado
- [ ] `verifyPlanetaryAlignment` implementado y probado
- [ ] `verifyMirrorOfConsciousness` implementado y probado
- [ ] `verifySystemicArchitect` implementado y probado
- [ ] `requireStewardshipBeforeDeploy` implementado y probado
- [ ] Auditoría continua programada (`scheduleEthicsAudit`)
- [ ] Reglas de gobernanza dinámica (`DynamicGovernanceRule`) versionadas

---

### Notas de derechos de autor

Esta especificación es una reimplementación de conceptos éticos y de gobernanza del manifiesto de Modern Ancients®. No copia código fuente ni texto literal bajo licencia cerrada. Los conceptos se atribuyen a MODERN ANCIENTS®, LLC. © 2019-2025. La especificación OpenSpec se publica bajo MIT como parte del repo Zeitnus.