# Spec: Integral Inter-System Interfaces (Devguide Sección 4.4)

**Fuente:** Integral Devguide v0.1, Sección 4.4 — "API Boundaries and Inter-System Interfaces"
**Prioridad:** P0 (Bloqueante - seam points para federación futura)
**Archivos Zeitnus:** `src/core/lib/integralInterfaces.ts`, `src/core/state/integral.ts` (tipos)

---

## Principio: Designing for Seam Points

> "Incluso en una implementación monolítica inicial, cada acceso cross-sistema debe ir a través de una función de interfaz definida que podría convertirse en endpoint API real sin cambiar el código llamante. Esta disciplina se llama: designing for seam points. Las costuras son donde el sistema eventualmente se dividirá en servicios independientes al escalar. Construirlas limpiamente desde el principio significa que la transición de monolito single-node a arquitectura multi-servicio federada es un cambio de deployment, no un rewrite."

**Regla de versiones:** Cada función de interfaz lleva version identifier. Cambios breaking incrementan versión; versión previa disponible hasta migración total. Aplica desde la PRIMERA interfaz.

---

## Tipos Base Compartidos

```typescript
// src/core/lib/integralInterfaces.ts

export type NodeId = string;                    // formato: "node-{uuid}"
export type ParticipantId = string;             // formato: "node-{uuid}:participant-{uuid}"
export type DesignId = string;
export type TaskId = string;
export type ProductionPlanId = string;
export type CoopId = string;
export type EventId = string;
export type PacketId = string;
export type FindingId = string;
export type RecommendationId = string;
export type IssueId = string;
export type DecisionRecordId = string;          // DR-NNN
export type PolicyId = string;
export type MandateId = string;

// Períodos temporales
export interface TimePeriod {
  start: number;  // timestamp
  end: number;    // timestamp
}

// Resultado estándar
export interface InterfaceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  version: string;        // version de la interfaz
  timestamp: number;
}

// Paginación
export interface PaginationParams {
  limit?: number;
  offset?: number;
}
export interface PaginatedResult<T> extends InterfaceResult<T[]> {
  total: number;
  hasMore: boolean;
}
```

---

## 1. OAD → COS Interface

```typescript
// Contrato: CertifiedDesign Package — fuente autoritativa para COS ProductionPlan

export interface OAD_COS_Interface {
  // v1.0
  get_certified_design(designId: DesignId, version: string): InterfaceResult<CertifiedDesign>;
  list_certified_designs(filters: DesignFilters, pagination?: PaginationParams): PaginatedResult<CertifiedDesign>;
  
  // v1.1 (future)
  // get_design_lineage(designId: DesignId): InterfaceResult<CertifiedDesign[]>;
  // subscribe_design_changes(callback: (design: CertifiedDesign) => void): Subscription;
}

export interface DesignFilters {
  status?: CertifiedDesign['status'][];
  ecological_flag?: CertifiedDesign['ecological_flag'][];
  authored_by?: ParticipantId[];
  node_id?: NodeId;
  commons_visible?: boolean;
  created_after?: number;
  created_before?: number;
}
```

---

## 2. OAD → ITC Interface

```typescript
// Contrato: Design Intelligence Signal — OAD certified designs → ITC valuation inputs

export interface DesignIntelligence {
  design_id: DesignId;
  version: string;
  labor_step_decomposition: LaborStep[];
  skill_tier_requirements: Record<string, SkillTier>;  // step_id -> skill_tier
  material_intensity: MaterialIntensity[];
  ecological_coefficients: EcologicalCoefficients;
  lifecycle_assumptions: LifecycleAssumptions;
  itc_access_cost: number;
  itc_access_cost_method: string;
  certified_at: number;
  certified_by: ParticipantId[];
}

export interface LaborStep {
  step_id: string;
  description: string;
  estimated_hours: number;
  required_skill_tier: SkillTier;
  ecological_flag: EcologicalFlag;
  dependencies: string[];  // other step_ids
}

export interface MaterialIntensity {
  material_id: string;
  quantity_per_unit: number;
  unit: string;
  ecological_flag: EcologicalFlag;
  ecological_impact_index: number | null;
}

export interface EcologicalCoefficients {
  embodied_energy: number;
  carbon_intensity: number;
  toxicity: number;
  recyclability: number;
  water_use: number;
  land_use: number;
  repairability: number;
}

export interface LifecycleAssumptions {
  expected_lifetime_years: number;
  maintenance_interval_days: number;
  maintenance_labor_hours_per_interval: number;
  disassembly_hours: number;
  dominant_failure_modes: string[];
  lifecycle_burden_index: number;
}

export interface OAD_ITC_Interface {
  // v1.0
  get_design_intelligence(designId: DesignId): InterfaceResult<DesignIntelligence>;
  list_deployable_designs(nodeId: NodeId): InterfaceResult<DesignIntelligence[]>;
  
  // v1.1 (when design updated/recertified)
  // subscribe_intelligence_updates(callback: (intel: DesignIntelligence) => void): Subscription;
}
```

---

## 3. OAD → FRS Interface

```typescript
// Contrato: Design Event Signal — OAD events → FRS monitoring inputs

export interface DesignEvent {
  event_id: EventId;
  design_id: DesignId;
  version: string;
  event_type: 'submitted' | 'updated' | 'certified' | 'superseded' | 'revoked';
  timestamp: number;
  actor: ParticipantId;
  changes?: string[];  // what changed
}

export interface EcologicalAssessment {
  design_id: DesignId;
  version: string;
  ecological_flag: EcologicalFlag;
  ecological_notes: string;
  ecological_detail: EcologicalCoefficients | null;
  assessed_by: ParticipantId[];
  assessed_at: number;
}

export interface CertificationChangeEvent {
  design_id: DesignId;
  version: string;
  change_type: 'certified' | 'superseded' | 'revoked';
  reason: string;
  panel_members: ParticipantId[];
  frs_finding_ref: FindingId | null;  // if triggered by FRS
  timestamp: number;
}

export interface OAD_FRS_Interface {
  // v1.0 - scheduled queries (weekly)
  get_design_events(nodeId: NodeId, period: TimePeriod): InterfaceResult<DesignEvent[]>;
  get_ecological_assessments(nodeId: NodeId, period: TimePeriod): InterfaceResult<EcologicalAssessment[]>;
  get_certification_changes(nodeId: NodeId, period: TimePeriod): InterfaceResult<CertificationChangeEvent[]>;
  
  // v1.1 - real-time streaming
  // subscribe_design_events(callback: (event: DesignEvent) => void): Subscription;
}
```

---

## 4. FRS → OAD Interface

```typescript
// Contrato: Operational Recalibration — FRS evidence → OAD corrective signals
// CRÍTICO: NO detiene producción - solo flagga a OAD/CDS

export interface FRS_OAD_Interface {
  // v1.0 - submit corrective signals
  submit_coefficient_recalibration(
    evidence_ref: FindingId,
    design_id: DesignId,
    new_coefficients: Partial<EcologicalCoefficients>
  ): InterfaceResult<{ recalibration_id: string }>;
  
  submit_lifecycle_revision(
    evidence_ref: FindingId,
    design_id: DesignId,
    new_lifecycle: Partial<LifecycleAssumptions>
  ): InterfaceResult<{ revision_id: string }>;
  
  submit_certification_review_request(
    evidence_ref: FindingId,
    design_id: DesignId,
    reason: string
  ): InterfaceResult<{ review_request_id: string }>;
  
  // v1.1 - batch submissions
  // submit_batch_corrections(corrections: Correction[]): InterfaceResult<CorrectionResult[]>;
}

/*
BOUNDARY CRÍTICA (devguide):
submit_certification_review_request NO detiene producción.
Solo somete recomendación no-ejecutiva que rutea a OAD como preocupación flaggada.
Cualquier decisión de suspender, revocar, o superseder certificación debe pasar por:
1. OAD review
2. CDS deliberation (governance process estándar)
3. CDS ratifica decisión
FRS flagga la divergencia. NO aprieta el gatillo.
Producción continua a menos que CDS ratifique lo contrario.
Esta frontera previene que la autoridad diagnóstica de FRS se convierta en gobernanza algorítmica sombra.
*/
```

---

## 5. COS → ITC Interface

```typescript
// Contrato: Labor and Materials Record — COS production → ITC credit calculation

export interface COS_ITC_Interface {
  // v1.0 - scheduled queries
  get_labor_events(nodeId: NodeId, period: TimePeriod): InterfaceResult<LaborEvent[]>;
  get_material_events(nodeId: NodeId, period: TimePeriod): InterfaceResult<MaterialConsumptionEvent[]>;
  
  // v1.1 - streaming
  // subscribe_labor_events(callback: (event: LaborEvent) => void): Subscription;
}
```

---

## 6. COS → FRS Interface

```typescript
// Contrato: Operational Signal — COS production data → FRS diagnostic input

export interface OperationalSignalData {
  labor_events: LaborEvent[];
  material_events: MaterialConsumptionEvent[];
  throughput_rates: ThroughputRate[];
  bottlenecks: Bottleneck[];
  maintenance_cycles: MaintenanceCycle[];
  qa_outcomes: QAEvent[];
  deviations_from_plan: PlanDeviation[];
}

export interface ThroughputRate {
  task_id: TaskId;
  design_id: DesignId;
  planned_hours: number;
  actual_hours: number;
  rate: number;  // actual/planned
}

export interface Bottleneck {
  task_id: TaskId;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detected_at: number;
  estimated_resolution: number | null;
}

export interface MaintenanceCycle {
  equipment_id: string;
  last_maintenance: number;
  next_due: number;
  overdue: boolean;
}

export interface QAEvent {
  event_id: EventId;
  task_id: TaskId;
  design_id: DesignId;
  passed: boolean;
  failure_mode: string | null;
  failure_details: string | null;
  inspected_by: ParticipantId;
  timestamp: number;
}

export interface PlanDeviation {
  production_plan_id: ProductionPlanId;
  task_id: TaskId;
  deviation_type: 'hours_overrun' | 'material_shortage' | 'quality_failure' | 'delay';
  magnitude: number;
  description: string;
}

export interface COS_FRS_Interface {
  // v1.0
  get_operational_signal(nodeId: NodeId, period: TimePeriod): InterfaceResult<OperationalSignalData>;
  get_qa_events(nodeId: NodeId, period: TimePeriod): InterfaceResult<QAEvent[]>;
  
  // v1.1
  // subscribe_operational_signals(callback: (signal: OperationalSignalData) => void): Subscription;
}
```

---

## 7. ITC → FRS Interface

```typescript
// Contrato: Credit and Access Signal — ITC ledger → FRS equity/access monitoring

export interface ITCPeriodSummary {
  total_credits_issued: number;
  total_decay_applied: number;
  total_access_extinguished: number;
  active_participant_count: number;
  balance_distribution: BalanceDistribution;
  need_adjustments_active: number;
  // Per-account timestamps (authoritative source for FRS)
  accounts_timestamps: AccountTimestamps[];
}

export interface BalanceDistribution {
  mean: number;
  median: number;
  std_dev: number;
  min: number;
  max: number;
  percentiles: { p10: number; p25: number; p50: number; p75: number; p90: number; p99: number };
  gini_coefficient: number;
}

export interface AccountTimestamps {
  participant_id: ParticipantId;
  last_contribution_at: number;
  last_access_at: number;
  last_decay_applied_at: number;
}

export interface ITC_FRS_Interface {
  // v1.0
  get_credit_summary(nodeId: NodeId, period: TimePeriod): InterfaceResult<ITCPeriodSummary>;
  get_ledger_entries(nodeId: NodeId, period: TimePeriod): InterfaceResult<ITCLedgerEntry[]>;
  get_balance_distribution(nodeId: NodeId): InterfaceResult<BalanceDistribution>;
  
  // v1.1
  // subscribe_ledger_entries(callback: (entry: ITCLedgerEntry) => void): Subscription;
}
```

---

## 8. ITC → CDS / COS / OAD Direct Signals

```typescript
// Contrato: ITC Direct Signals — ITC → CDS/OAD/COS (no solo via FRS)

export interface ITC_CDS_Interface {
  // Adjustment requests (ITC Module 7 ethics detection)
  submit_adjustment_request(request: ITCAdjustmentRequest): InterfaceResult<{ request_id: string }>;
  
  // Capacity flags
  submit_capacity_flag(flag: ITCCapacityFlag): InterfaceResult<{ flag_id: string }>;
}

export interface ITCAdjustmentRequest {
  request_id: string;
  type: 'valuation_review' | 'decay_rule_change' | 'fairness_threshold' | 'access_policy' | 'anti_coercion';
  description: string;
  evidence_refs: FindingId[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  submitted_at: number;
}

export interface ITCCapacityFlag {
  flag_id: string;
  design_id: DesignId;
  issue: 'redesign_needed' | 'capacity_expansion' | 'skill_shortage';
  description: string;
  submitted_at: number;
}

export interface ITC_COS_Interface {
  // Valuation signals for production planning
  submit_valuation_signal(signal: ITCValuationSignal): InterfaceResult<{ signal_id: string }>;
}

export interface ITCValuationSignal {
  design_id: DesignId;
  access_cost_change: number;  // delta in ITC
  reason: string;
  submitted_at: number;
}
```

---

## 9. FRS → CDS Interface

```typescript
// Contrato: FRS Signal Packet → CDS Governance

export interface FRS_CDS_Interface {
  // v1.0
  submit_signal_packet(packet: FRSSignalPacket): InterfaceResult<{ issue_ref: IssueId }>;
  get_recommendation_status(recommendationId: RecommendationId): InterfaceResult<RecommendationStatus>;
}

export interface RecommendationStatus {
  recommendation_id: RecommendationId;
  status: 'pending' | 'accepted_as_issue' | 'rejected' | 'implemented' | 'superseded';
  issue_ref: IssueId | null;
  acted_upon_by: ParticipantId | null;
  acted_upon_at: number | null;
}
```

---

## 10. CDS → FRS Interface

```typescript
// Contrato: Governance Indicators → FRS (closes governance evaluation loop)

export interface GovernanceSummary {
  decisions_dispatched: number;
  policies_updated: number;
  open_governance_issues: number;
  decision_records_merged: number;
  // Per-decision detail for FRS evaluation
  decisions_detail: DecisionDetail[];
}

export interface DecisionDetail {
  dr_id: DecisionRecordId;
  decision: string;
  context: string;
  target_system: TargetSystem;
  dispatched_at: number;
  status: 'dispatched' | 'implemented' | 'blocked' | 'failed';
  implemented_at: number | null;
}

export interface CDS_FRS_Interface {
  // v1.0
  get_governance_summary(nodeId: NodeId, period: TimePeriod): InterfaceResult<GovernanceSummary>;
}
```

---

## 11. CDS → All Systems: Policy and Mandate Interface

```typescript
// Contrato: CDS Governance → Systems (Policy + Mandates)

export interface PolicyRecord {
  policy_id: PolicyId;
  system: TargetSystem;
  version: string;
  content: Record<string, unknown>;
  ratified_at: number;
  ratified_by: ParticipantId[];
  supersedes: PolicyId | null;
  active: boolean;
}

export interface ITCPolicySnapshot {
  // Current CDS-ratified parameters bounding ITC behavior
  weighting_limits: {
    max_skill_factor: number;
    max_scarcity_factor: number;
    max_ecological_factor: number;
    max_total_multiplier: number;
  };
  decay_rule: {
    rule_id: string;
    half_life_days: number;
    inactivity_grace_days: number;
    min_balance_protected: number;
    max_annual_fraction: number;
  };
  fairness_thresholds: {
    max_gini: number;
    max_balance_ratio: number;
    min_participation_rate: number;
  };
  access_policy: {
    equivalence_bands: EquivalenceBand[];
    need_adjustment_criteria: string;
  };
  anti_coercion_rules: {
    max_credit_concentration: number;
    role_cornering_threshold: number;
    preferential_treatment_detection: boolean;
  };
}

export interface EquivalenceBand {
  band_id: string;
  node_id: NodeId;
  min_multiplier: number;
  max_multiplier: number;
  calibrated_at: number;
  calibrated_by: ParticipantId[];
}

export interface ProductionMandate {
  mandate_id: MandateId;
  design_id: DesignId;
  design_version: string;
  quantity: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  authorized_by: DecisionRecordId;
  constraints: MandateConstraint[];
  issued_at: number;
  expires_at: number | null;
}

export interface MandateConstraint {
  type: 'material_substitution' | 'labor_allocation' | 'timeline' | 'ecological_bound' | 'quality_threshold';
  value: unknown;
}

export interface DispatchPacket {
  dispatch_id: string;
  dr_id: DecisionRecordId;
  target_system: TargetSystem;
  action: 'create_design' | 'certify_design' | 'start_production' | 'adjust_policy' | 'review_certification';
  parameters: Record<string, unknown>;
  success_indicators: SuccessIndicator[];
  dispatched_at: number;
  dispatched_by: ParticipantId;
}

export interface SuccessIndicator {
  indicator_id: string;
  description: string;
  metric: string;
  target_value: number;
  measurement_period: TimePeriod;
}

export interface CDS_AllSystems_Interface {
  // v1.0
  get_active_policies(system: TargetSystem, nodeId: NodeId): InterfaceResult<PolicyRecord[]>;
  get_itc_policy_snapshot(nodeId: NodeId): InterfaceResult<ITCPolicySnapshot>;
  get_production_mandate(mandateId: MandateId): InterfaceResult<ProductionMandate>;
  notify_dispatch(dispatchPacket: DispatchPacket): InterfaceResult<{ ack_id: string }>;
  
  // v1.1
  // subscribe_policy_changes(system: TargetSystem, callback: (policy: PolicyRecord) => void): Subscription;
  // subscribe_mandates(callback: (mandate: ProductionMandate) => void): Subscription;
}
```

---

## Implementación en Zeitnus (Monolito Phase 2)

```typescript
// src/core/lib/integralInterfaces.ts

// En Phase 2 monolitico: interfaces son funciones que acceden al store directamente
// PERO con firma explícita + versioning para futura extracción a servicios

export const integralInterfaces = {
  // OAD → COS
  'OAD_COS_v1.0': {
    get_certified_design: async (designId: DesignId, version: string) => {
      const design = useAppStore.getState().integral.designs.find(d => d.design_id === designId && d.version === version);
      return { success: !!design, data: design, version: '1.0', timestamp: Date.now() };
    },
    list_certified_designs: async (filters: DesignFilters, pagination?: PaginationParams) => {
      // ... filter logic
    }
  },
  
  // OAD → ITC
  'OAD_ITC_v1.0': {
    get_design_intelligence: async (designId: DesignId) => {
      const design = useAppStore.getState().integral.designs.find(d => d.design_id === designId);
      if (!design) return { success: false, error: 'Design not found', version: '1.0', timestamp: Date.now() };
      // Build DesignIntelligence from CertifiedDesign + OAD data
      return { success: true, data: buildDesignIntelligence(design), version: '1.0', timestamp: Date.now() };
    }
  },
  
  // ... etc for all 12 interfaces
  
  // Version registry
  versions: {
    'OAD_COS': '1.0',
    'OAD_ITC': '1.0',
    'OAD_FRS': '1.0',
    'FRS_OAD': '1.0',
    'COS_ITC': '1.0',
    'COS_FRS': '1.0',
    'ITC_FRS': '1.0',
    'ITC_CDS': '1.0',
    'ITC_COS': '1.0',
    'FRS_CDS': '1.0',
    'CDS_FRS': '1.0',
    'CDS_AllSystems': '1.0'
  }
};

// Helper para consumidores: usa interfaz versionada
export function useIntegralInterface<T>(name: string) {
  const version = integralInterfaces.versions[name as keyof typeof integralInterfaces.versions];
  return integralInterfaces[`${name}_v${version}`] as T;
}
```

---

## Criterios de Aceptación

- [ ] 12 interfaces definidas con firmas TypeScript completas
- [ ] Cada interfaz tiene `version` string + `timestamp` en response
- [ ] Version registry centralizado
- [ ] Implementación monolítica Phase 2 usa store directamente PERO via interfaces
- [ ] `submit_certification_review_request` NO detiene producción (test)
- [ ] `get_itc_policy_snapshot` retorna todos los parámetros CDS-ratificados
- [ ] `DispatchPacket` incluye `success_indicators` para FRS monitoring
- [ ] Tests: backward compatibility (v1.0 sigue funcionando si v1.1 existe)
- [ ] Tests: cross-system calls SOLO via interfaces (no store directo)

---

## Referencias Normativas

- **Devguide Sección 4.4**: "API Boundaries and Inter-System Interfaces" — 12 contratos primarios
- **Devguide**: "Building for seam points" — transición monolito → federado = deployment change
- **Devguide**: Version rule — "applies from the first interface ever written"
- **White Paper**: Especificaciones formales por sistema (módulos 1-10)