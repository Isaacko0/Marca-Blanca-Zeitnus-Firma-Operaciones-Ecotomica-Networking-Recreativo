# Spec: Integral Data Contracts (Devguide Sección 4.3)

**Fuente:** Integral Devguide v0.1, Sección 4.3 — "Fields That Must Exist from Day One (Even If Empty)"
**Prioridad:** P0 (Bloqueante - esquemas base para todos los 5 sistemas)
**Archivos Zeitnus:** `src/core/state/integral.ts` (extensión), `src/core/lib/integralDataContracts.ts`

---

## Principio Arquitectónico

> "En Integral, la arquitectura de datos no es detalle de implementación. Los 5 sistemas están profundamente acoplados; cada uno consume datos producidos por otros. Si COS produce LaborEvent en formato que ITC no puede consumir, la contabilidad de contribución se rompe. Estos no son bugs parcheables — son incompatibilidades estructurales que requieren migraciones de schema, backfilling, y potencialmente invalidación de registros históricos."

**Regla:** Cada campo marcado `[DEFERRED]` debe existir en el schema desde día 1 (puede ser `null`). La forma del registro debe anticipar el sistema completo incluso cuando el sistema completo no existe aún.

---

## 1. CertifiedDesign (Owned by OAD)

```typescript
// src/core/state/integral.ts - REEMPLAZAR interface existente

export interface CertifiedDesign {
  // Identidad y versión (NON-NEGOTIABLE: version control desde día 1)
  design_id: string;                    // unique identifier, generated at first submission
  version: string;                      // semantic version string, e.g. "1.0.0"
  label: string;                        // short version label, e.g. "v0.3-bamboo-frame"
  
  // Metadatos básicos
  title: string;                        // human-readable name
  description: string;                  // plain-language description
  authored_by: string[];                // list of node-id:participant-id references
  created_at: number;                   // timestamp of first submission
  certified_at: number;                 // timestamp of certification decision
  certified_by: string[];               // LIST[str] — participant IDs of ALL panel members
                                        // Must be list, not single reference, to preserve
                                        // accountable audit trail of full certification panel
                                        // Matches white paper CertificationRecord schema
  
  // Trazabilidad gobernanza
  cds_mandate_ref: string | null;       // reference to CDS decision that authorized design work
                                        // [devguide extension — not in white paper, added for traceability]
  
  // Estado de certificación
  status: 'draft' | 'under_review' | 'optimized' | 'ready_for_certification' | 
          'certified' | 'superseded' | 'revoked';
  
  // Clasificación ecológica (OAD Module 3 - human checklist Phase 2)
  skill_tier: 'low' | 'medium' | 'high' | 'expert';  // [canonical enum]
  ecological_flag: 'low' | 'medium' | 'high';        // set during OAD Module 3 assessment
  ecological_notes: string;             // human-authored narrative from ecological checklist
  
  // [DEFERRED] Structured ecological assessment data
  ecological_detail: {
    embodied_energy: number | null;
    carbon_intensity: number | null;
    toxicity: number | null;
    recyclability: number | null;
    water_use: number | null;
    land_use: number | null;
    repairability: number | null;
  } | null;
  
  // [DEFERRED] Lifecycle model data
  lifecycle_detail: {
    expected_lifetime_years: number | null;
    maintenance_interval_days: number | null;
    maintenance_labor_hours_per_interval: number | null;
    disassembly_hours: number | null;
    dominant_failure_modes: string[] | null;
    lifecycle_burden_index: number | null;
  } | null;
  
  // ITC Access Valuation (OAD Module 4 output → ITC Module 4 input)
  itc_access_cost: number;              // computed access cost in time credits
  itc_access_cost_method: 'simple_embodied' | string;  // future methods
  
  // Lineaje de diseño
  superseded_by: string | null;         // reference to superseding design_id
  design_lineage: string | null;        // reference to prior version design_id
  
  // Federación
  node_id: string;                      // originating node — federation-aware from day one
  federation_hash: string | null;       // [DEFERRED] cryptographic hash for cross-node verification
  
  // Commons
  commons_visible: boolean;             // whether published to the commons
  
  // Legacy compatibility (existing Zeitnus)
  ecoScore: number;                     // 0-100 (maps from ecological_flag + detail)
  id: string;                           // alias for design_id
}
```

---

## 2. LaborEvent (Owned by COS, Consumed by ITC and FRS)

```typescript
// src/core/state/integral.ts - REEMPLAZAR interface existente

// Canonical skill tier enum — USE CONSISTENTLY ACROSS ALL SCHEMAS
export type SkillTier = 'low' | 'medium' | 'high' | 'expert';
export type VerificationStatus = 'pending' | 'verified' | 'disputed';
export type EcologicalFlag = 'low' | 'medium' | 'high';

export interface WeightingContext {
  urge: number;                         // 0-1: urgency signal from CDS/FRS
  scarcity_factor: number;              // 0-1: skill scarcity in node
  ecological_sensitivity: number;       // 0-1: ecological sensitivity of task
}

export interface WeightingBreakdown {
  skill_factor: number;
  scarcity_factor: number;
  ecological_factor: number;
  // future factors added here
}

export interface LaborEvent {
  // Identidad
  event_id: string;                     // unique identifier
  timestamp: number;                    // when labor was completed
  
  // Participante (globally unique)
  participant_id: string;               // node-id:participant-id
  
  // Contexto organizacional
  coop_id: string;                      // which cooperative this labor occurred within
  task_ref: string;                     // reference to COS Task object
  production_plan_ref: string;          // reference to COS ProductionPlan
  design_ref: string;                   // reference to OAD CertifiedDesign and version
  
  // Horas
  hours: number;                        // actual hours worked, as reported
  hours_verified: number;               // hours confirmed by peer verification
                                        // [devguide extension for Phase 2 convenience]
  
  // Skill tier (CANONICAL ENUM)
  skill_tier: SkillTier;
  
  // Contexto de ponderación
  context: WeightingContext;
  
  // Verificación
  verification_status: VerificationStatus;
  verified_by: string[];                // list of node-id:participant-id of verifiers
  verified_at: number | null;           // timestamp of verification
  
  // Weighting outputs — populated by ITC Module 2
  // [white paper: these belong to WeightedLaborRecord, consolidated here for Phase 2]
  itc_weight_multiplier: number;        // final bounded weight multiplier applied
  itc_weight_breakdown: WeightingBreakdown;  // dict of factors
  itc_weighted_hours: number;           // hours * weight_multiplier
  itc_credits_issued: number;           // credits generated — computed by ITC
  
  // Ecología (heredada del design step)
  ecological_flag: EcologicalFlag;
  ecological_detail: object | null;     // [DEFERRED] detailed ecological attribution
  
  // Federación
  node_id: string;                      // which node this event occurred at
  federation_hash: string | null;       // [DEFERRED] cryptographic hash for federation integrity
}
```

---

## 3. MaterialConsumptionEvent (Owned by COS, Consumed by ITC and FRS)

```typescript
// src/core/state/integral.ts - NUEVO (CRÍTICO - no existe en Zeitnus)

export interface MaterialConsumptionEvent {
  event_id: string;                     // unique identifier
  timestamp: number;                    // when consumption occurred
  task_ref: string;                     // reference to COS Task
  production_plan_ref: string;          // reference to COS ProductionPlan
  design_ref: string;                   // reference to OAD CertifiedDesign and version
  material_id: string;                  // what was consumed
  material_name: string;                // human-readable name
  quantity_consumed: number;            // numeric quantity
  unit: string;                         // unit of measurement
  quantity_remaining: number;           // inventory level after consumption
  ecological_flag: EcologicalFlag;      // low | medium | high — from OAD design
  ecological_impact_index: number | null;  // [DEFERRED] numeric EII from coefficient engine
  source: 'internal' | 'external_dependency';
  external_source_ref: string | null;   // [DEFERRED] if external, reference to supplier/node
  node_id: string;                      // which node this occurred at
  federation_hash: string | null;       // [DEFERRED] cryptographic hash
}
```

---

## 4. ITCAccount (Owned by ITC, Consumed by FRS)

```typescript
// src/core/state/integral.ts - NUEVO (reemplaza TimeCredit array)

export interface ITCAccount {
  account_id: string;                   // unique identifier
  participant_id: string;               // node-id:participant-id — globally unique
  node_id: string;                      // which node issued these credits
  
  // Balances
  balance: number;                      // current credit balance, numeric
  total_earned: number;                 // total credits ever issued
  total_redeemed: number;               // total credits extinguished through access
  total_decayed: number;                // total credits lost to decay
  
  // Decay configuration (CDS-ratified)
  active_decay_rule_id: string;         // reference to CDS-ratified DecayRule in effect
  last_decay_applied_at: number;        // timestamp of most recent decay calculation
  last_contribution_at: number;         // timestamp of most recent verified labor event
                                        // [required for decay grace window logic — avoids full
                                        //  ledger scan to determine whether grace period applies.
                                        //  updated by ITC Module 1 on each verified LaborEvent]
  last_access_at: number;               // timestamp of most recent ITC redemption or access event
                                        // [required for FRS access pattern monitoring.
                                        //  updated by ITC Module 5 on each redemption]
  
  // DecayRule (inline summary — full record lives in CDS policy store)
  decay_half_life_days: number;         // exponential half-life beyond grace window
  decay_inactivity_grace_days: number;  // no decay within this window
  decay_min_balance_protected: number;  // small protected floor, if any
  decay_max_annual_fraction: number;    // CDS-set safety bound on annual decay
  
  // Need-based adjustments (CDS policy)
  need_adjustment_active: boolean;      // whether a need-based override is active
  need_adjustment_ref: string | null;   // reference to CDS policy record authorizing adjustment
  
  // ARCHITECTURAL CONSTRAINT — never policy, never configurable
  transferable: false;                  // always false — enforced architecturally
                                        // [this field exists as a named constraint, not a toggle.
                                        //  any attempt to implement transfer requires intentionally
                                        //  changing a named architectural boundary]
  
  // Federación
  federation_scope: 'local' | 'cross-node-recognition';  // [DEFERRED: cross-node scope]
  
  last_updated_at: number;              // timestamp of most recent change to any field
}
```

---

## 5. ITCLedgerEntry (Owned by ITC, Consumed by FRS)

```typescript
// src/core/state/integral.ts - NUEVO (append-only ledger)

export type LedgerEntryType = 
  | 'labor_event_recorded'
  | 'labor_weight_applied'
  | 'itc_credited'
  | 'itc_decayed'
  | 'access_value_quoted'
  | 'access_redeemed'
  | 'equivalence_band_applied'
  | 'ethics_flag_created'
  | 'ethics_flag_resolved'
  | 'policy_updated';

export interface ITCLedgerEntry {
  entry_id: string;                     // unique identifier
  timestamp: number;                    // when this entry was created
  participant_id: string;               // node-id:participant-id — globally unique
  node_id: string;                      // which node
  
  entry_type: LedgerEntryType;          // [white paper canonical enum — use exactly]
  
  amount: number;                       // numeric — net credit change for this entry
                                        // positive for credits issued or restored,
                                        // negative for deductions
                                        // for labor entries this equals weighted_credits
  
  raw_hours: number | null;             // nominal hours worked, unweighted
                                        // populated for labor entry types only,
                                        // null for decay/redemption/policy entries
                                        // [white paper separates LaborEvent from WeightedLaborRecord;
                                        //  storing both here enables FRS audit of weighting inflation
                                        //  over time without reconstructing from two separate records]
  
  weighted_credits: number | null;      // credits after skill/context weighting
                                        // equals amount for labor entries;
                                        // null for non-labor entry types
                                        // [FRS uses the ratio of weighted_credits to raw_hours
                                        //  across the ledger to detect systematic weighting drift]
  
  balance_after: number;                // balance snapshot after this entry
  
  related_ids: {                        // dict of references to related objects
    event_id?: string;
    item_id?: string;
    coop_id?: string;
    design_id?: string;
    [key: string]: string | undefined;
  };
  
  details: Record<string, unknown>;     // JSON-compatible payload with entry-specific data
  authorized_by: string;                // participant or system that authorized this entry
  notes: string | null;                 // optional human-authored explanation
}
```

---

## 6. FRSSignalPacket (Owned by FRS, Consumed by CDS)

```typescript
// src/core/state/integral.ts - REEMPLAZAR SignalPacket básico

export interface FRSSignalPacket {
  packet_id: string;                    // unique identifier
  node_id: string;                      // which node this covers
  period_start: number;                 // start of period covered
  period_end: number;                   // end of period covered
  generated_at: number;                 // when this packet was produced
  generated_by: string;                 // participant or system that produced it
  prev_packet_ref: string | null;       // reference to prior packet
  
  // Labor Summary
  labor_summary: {
    total_events: number;
    total_hours: number;
    total_weighted_credits: number;
    total_hours_verified: number;
    verification_rate: number;
    events_by_skill_tier: Record<SkillTier, number>;
    overrun_tasks: number;              // tasks where actual significantly exceeded estimate
  };
  
  // Materials Summary
  materials_summary: {
    total_consumption_events: number;
    consumption_by_material: Record<string, number>;
    ecological_flag_counts: Record<EcologicalFlag, number>;
    external_dependency_count: number;
    low_inventory_flags: number;
  };
  
  // ITC Summary
  itc_summary: {
    total_credits_issued: number;
    total_decay_applied: number;
    total_access_extinguished: number;
    active_participant_count: number;
    balance_distribution: object | null;  // [DEFERRED] statistical distribution
    need_adjustments_active: number;
  };
  
  // QA Summary
  qa_summary: {
    total_qa_events: number;
    failures: number;
    failure_rate: number;
    failures_by_design: Record<string, number>;  // which OAD design_id/version implicated
  };
  
  // OAD Summary
  oad_summary: {
    new_certifications: number;
    design_version_updates: number;
    ecological_assessment_changes: number;
    certification_revocations: number;
    coefficient_recalibrations_pending: number;
  };
  
  // CDS Summary — enables FRS to assess whether governance decisions 
  // are producing their intended effects (closing governance evaluation loop)
  cds_summary: {
    decisions_dispatched: number;
    policies_updated: number;
    open_governance_issues: number;
    decision_records_merged: number;
  };
  
  // Findings & Recommendations
  findings: DiagnosticFinding[];
  recommendations: Recommendation[];
  
  // Link to CDS issue created from this packet
  cds_submission_ref: string | null;
}
```

---

## 7. DiagnosticFinding (Owned by FRS)

```typescript
// src/core/state/integral.ts - NUEVO

export type FindingType = 
  | 'ecological_overshoot_risk'
  | 'material_scarcity_trend'
  | 'labor_imbalance_or_burnout_risk'
  | 'throughput_bottleneck_persistent'
  | 'quality_reliability_drift'
  | 'dependency_fragility_increase'
  | 'access_inequity_detected'
  | 'proto_market_or_coercion_risk'
  | 'governance_overload_or_capture_risk'
  | 'data_integrity_anomaly'
  | 'other';

export type FindingSeverity = 'info' | 'low' | 'moderate' | 'high' | 'critical';
export type FindingScope = 'local' | 'node' | 'regional' | 'federation';
export type FindingPersistence = 'transient' | 'emerging' | 'persistent' | 'structural';
export type FindingConfidence = 'low' | 'medium' | 'high';
export type TargetSystem = 'CDS' | 'OAD' | 'COS' | 'ITC' | 'FED';

export interface DiagnosticFinding {
  finding_id: string;                   // unique identifier
  packet_ref: string;                   // reference to FRSSignalPacket
  node_id: string;                      // which node
  detected_at: number;                  // timestamp
  
  finding_type: FindingType;            // [white paper canonical enum]
  severity: FindingSeverity;
  scope: FindingScope;                  // [determines routing and escalation path, must not be omitted]
  persistence: FindingPersistence;      // [white paper includes structural as fourth state]
  confidence: FindingConfidence;
  
  summary: string;                      // one-sentence plain-language description
  rationale: string;                    // explanation of why this is a finding
  evidence_refs: string[];              // list of references to supporting records
  indicators: Record<string, number>;   // dict of named metric values that triggered this finding
  
  target_system: TargetSystem;          // CDS | OAD | COS | ITC | FED
  requires_cds: boolean;                // whether this finding requires CDS deliberation
}
```

---

## 8. Recommendation (Owned by FRS)

```typescript
// src/core/state/integral.ts - EXTENDER interface existente

export type RecommendationType = 
  | 'design_review_request'
  | 'workflow_stress_alert'
  | 'valuation_drift_flag'
  | 'training_priority_signal'
  | 'material_substitution_signal'
  | 'certification_review_request'
  | 'coefficient_recalibration'
  | 'lifecycle_revision'
  | 'capacity_adjustment'
  | 'policy_review';

export interface Recommendation {
  id: string;                           // unique identifier
  finding: string;                      // reference or description
  target: TargetSystem;                 // CDS | OAD | COS | ITC | FED
  promotedToIssue: boolean;
  
  // [REQUIRED per devguide Section 4.3]
  recommendation_type: RecommendationType;
  
  // Optional context
  suggested_action: string | null;
  priority: 'low' | 'medium' | 'high' | 'critical';
  evidence_refs: string[];
}
```

---

## Integración con Estado Existente

```typescript
// src/core/state/integral.ts - ACTUALIZAR IntegralState

export interface IntegralState {
  // CDS
  issues: Issue[];
  decisions: DecisionRecord[];
  
  // OAD
  designs: CertifiedDesign[];           // ESQUEMA COMPLETO arriba
  
  // COS
  labor: LaborEvent[];                  // ESQUEMA COMPLETO arriba
  materials: MaterialConsumptionEvent[]; // NUEVO - CRÍTICO
  
  // ITC
  accounts: Map<string, ITCAccount>;    // NUEVO - por participant_id
  ledger: ITCLedgerEntry[];             // NUEVO - append-only
  
  // FRS
  signals: FRSSignalPacket[];           // ESQUEMA COMPLETO arriba
  recommendations: Recommendation[];    // EXTENDIDO con recommendation_type
  
  // Compatibilidad legacy (migrar gradualmente)
  credits: TimeCredit[];                // DEPRECATED - migrar a accounts + ledger
}
```

---

## Criterios de Aceptación

- [ ] `CertifiedDesign` tiene TODOS los campos (incluyendo `[DEFERRED]` como `null`)
- [ ] `LaborEvent` usa `SkillTier` canónico + `WeightingContext` + weighting outputs
- [ ] `MaterialConsumptionEvent` **NUEVO** implementado y consumido por ITC/FRS
- [ ] `ITCAccount` por participante con decay config inline + `transferable: false` arquitectónico
- [ ] `ITCLedgerEntry` append-only con `raw_hours` + `weighted_credits` en labor entries
- [ ] `FRSSignalPacket` completo con 6 summaries + findings + recommendations
- [ ] `DiagnosticFinding` con enums canónicos + `scope` obligatorio
- [ ] `Recommendation` con `recommendation_type` enum
- [ ] `IntegralState` actualizado con nuevos tipos + migración legacy
- [ ] Tests: serialización/deserialización, validación campos requeridos, `[DEFERRED]` nullables

---

## Referencias Normativas

- **Devguide Sección 4.1**: "Why Data Architecture Comes First" — acoplamiento profundo 5 sistemas
- **Devguide Sección 4.2**: "The Core Data Contracts Between Systems" — 12 contratos primarios
- **Devguide Sección 4.3**: "Fields That Must Exist from Day One" — esquemas consolidados Phase 2
- **Devguide Sección 4.4**: "API Boundaries and Inter-System Interfaces" — seam points versionados
- **White Paper**: Especificaciones formales completas por sistema (módulos 1-10 cada uno)