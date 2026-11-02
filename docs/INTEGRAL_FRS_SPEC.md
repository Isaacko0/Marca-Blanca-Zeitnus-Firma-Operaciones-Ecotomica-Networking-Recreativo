# Spec: FRS — Feedback & Review System (Devguide Sección 3.5)

**Fuente:** Integral Devguide v0.1, Sección 3.5 — "FRS — Feedback & Review System (Proposed Core Modules)"
**Prioridad:** P1 (Sistema nervioso adaptativo - "FRS is the system's adaptive nervous system")
**Archivos Zeitnus:** `src/core/lib/frs.ts`, `src/core/state/frs.ts`, `src/app/screens/FRS.tsx`

---

## Principio: FRS Advisory Only — No Shadow Governance

> "FRS does not make decisions or issue commands. It observes, diagnoses, models, recommends, and remembers. FRS findings and recommendations are advisory. A finding becomes actionable only when it is promoted to a CDS issue through the standard governance workflow... This boundary is structural, not procedural — it prevents FRS from becoming a form of algorithmic shadow governance, where the system's diagnostic authority quietly displaces the community's deliberative authority."

---

## Módulos Mínimos Viables

### M1 — Signal Intake & Semantic Integration (Included, Simplified)

```typescript
// src/core/lib/frs.ts

// Scheduled ingestion (weekly) — NOT manual compilation
// Automated aggregation scripts running scheduled queries against all 4 system databases

export interface SignalIntakeJob {
  job_id: string;
  node_id: string;
  period: TimePeriod;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at: number;
  completed_at: number | null;
  sources_queried: ('COS' | 'ITC' | 'OAD' | 'CDS')[];
  packet_generated: boolean;
  packet_id: string | null;
  error: string | null;
}

// Runs weekly via scheduler
export async function runSignalIntake(nodeId: NodeId, period: TimePeriod): Promise<FRSSignalPacket> {
  // 1. Query COS: labor events, material consumption, QA, throughput
  const cosData = await cosInterface.get_operational_signal(nodeId, period);
  const qaEvents = await cosInterface.get_qa_events(nodeId, period);
  
  // 2. Query ITC: credit summary, ledger entries, balance distribution
  const itcSummary = await itcInterface.get_credit_summary(nodeId, period);
  const ledgerEntries = await itcInterface.get_ledger_entries(nodeId, period);
  const balanceDist = await itcInterface.get_balance_distribution(nodeId);
  
  // 3. Query OAD: design events, ecological assessments, certification changes
  const designEvents = await oadInterface.get_design_events(nodeId, period);
  const ecoAssessments = await oadInterface.get_ecological_assessments(nodeId, period);
  const certChanges = await oadInterface.get_certification_changes(nodeId, period);
  
  // 4. Query CDS: governance summary
  const govSummary = await cdsInterface.get_governance_summary(nodeId, period);
  
  // 5. Build standardized packet (schema from DATA_CONTRACTS_SPEC)
  const packet: FRSSignalPacket = {
    packet_id: `pkt_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
    node_id: nodeId,
    period_start: period.start,
    period_end: period.end,
    generated_at: Date.now(),
    generated_by: 'FRS_M1_scheduler',
    prev_packet_ref: getLastPacketRef(nodeId),
    
    labor_summary: buildLaborSummary(cosData),
    materials_summary: buildMaterialsSummary(cosData),
    itc_summary: buildITCSummary(itcSummary, ledgerEntries, balanceDist),
    qa_summary: buildQASummary(qaEvents),
    oad_summary: buildOADSummary(designEvents, ecoAssessments, certChanges),
    cds_summary: buildCDSSummary(govSummary),
    findings: [],  // populated by M2
    recommendations: [],  // populated by M4
    cds_submission_ref: null
  };
  
  // 6. Store packet
  await storeSignalPacket(packet);
  
  return packet;
}

// Helper builders (transform raw data → standardized summaries)
function buildLaborSummary(cosData): FRSSignalPacket['labor_summary'] { ... }
function buildMaterialsSummary(cosData): FRSSignalPacket['materials_summary'] { ... }
function buildITCSummary(itcSummary, ledgerEntries, balanceDist): FRSSignalPacket['itc_summary'] { ... }
function buildQASummary(qaEvents): FRSSignalPacket['qa_summary'] { ... }
function buildOADSummary(designEvents, ecoAssessments, certChanges): FRSSignalPacket['oad_summary'] { ... }
function buildCDSSummary(govSummary): FRSSignalPacket['cds_summary'] { ... }
```

### M2 — Diagnostic Classification & Pathology Detection (Included, Human-Assisted)

```typescript
// Phase 2: human-assisted using structured template
// Designated FRS reviewer reads signal packet + produces DiagnosticFinding objects

export interface DiagnosticSession {
  session_id: string;
  packet_ref: string;           // FRSSignalPacket id
  reviewer_id: ParticipantId;
  started_at: number;
  completed_at: number | null;
  findings: DiagnosticFinding[];
  status: 'in_progress' | 'completed' | 'archived';
}

export interface FindingTemplate {
  finding_type: FindingType;    // canonical enum (ver DATA_CONTRACTS_SPEC)
  severity: FindingSeverity;    // info | low | moderate | high | critical
  scope: FindingScope;          // local | node | regional | federation (MUST NOT BE OMITTED)
  persistence: FindingPersistence;  // transient | emerging | persistent | structural
  confidence: FindingConfidence;
  summary: string;              // one-sentence plain language
  rationale: string;            // explanation of why this is a finding
  evidence_refs: string[];      // refs to supporting records (ledger entries, events, etc.)
  indicators: Record<string, number>;  // named metric values that triggered
  target_system: TargetSystem;  // CDS | OAD | COS | ITC | FED
  requires_cds: boolean;
}

// Common finding patterns (Phase 2 template library):
const FINDING_TEMPLATES: Partial<FindingTemplate>[] = [
  {
    finding_type: 'ecological_overshoot_risk',
    severity: 'high',
    scope: 'node',
    persistence: 'emerging',
    target_system: 'OAD',
    requires_cds: false
  },
  {
    finding_type: 'material_scarcity_trend',
    severity: 'moderate',
    scope: 'node',
    persistence: 'persistent',
    target_system: 'COS',
    requires_cds: false
  },
  {
    finding_type: 'labor_imbalance_or_burnout_risk',
    severity: 'high',
    scope: 'node',
    persistence: 'structural',
    target_system: 'CDS',
    requires_cds: true
  },
  {
    finding_type: 'throughput_bottleneck_persistent',
    severity: 'moderate',
    scope: 'local',
    persistence: 'persistent',
    target_system: 'COS',
    requires_cds: false
  },
  {
    finding_type: 'quality_reliability_drift',
    severity: 'high',
    scope: 'node',
    persistence: 'emerging',
    target_system: 'OAD',
    requires_cds: false
  },
  {
    finding_type: 'access_inequity_detected',
    severity: 'critical',
    scope: 'node',
    persistence: 'structural',
    target_system: 'CDS',
    requires_cds: true
  },
  {
    finding_type: 'proto_market_or_coercion_risk',
    severity: 'critical',
    scope: 'node',
    persistence: 'emerging',
    target_system: 'ITC',
    requires_cds: true
  }
];
```

### M3 — Constraint Modeling & Scenario Simulation (Deferred)

```typescript
// REQUIRES sufficient operational history (several months of data)
// Phase 3+ deliverable

export interface ConstraintModel {
  model_id: string;
  node_id: string;
  constraints: Constraint[];
  scenarios: Scenario[];
  calibrated_at: number;
  calibrated_by: ParticipantId[];
}

export interface Constraint {
  resource: string;           // e.g., 'water', 'energy', 'specialized_labor', 'material_X'
  current_usage: number;
  sustainable_limit: number;
  projected_exhaustion: number | null;  // timestamp
  severity: 'safe' | 'approaching' | 'critical' | 'exceeded';
}

export interface Scenario {
  scenario_id: string;
  name: string;
  description: string;
  assumptions: Record<string, unknown>;
  projected_outcomes: ProjectedOutcome[];
}

export interface ProjectedOutcome {
  metric: string;
  value: number;
  confidence: number;
  timeframe: TimePeriod;
}
```

### M4 — Recommendation Routing (Included, Simplified)

```typescript
// Human-authored using standard template
// Recommendations are NEVER commands — they are inputs to target systems

export function createRecommendation(
  finding: DiagnosticFinding,
  recommendation_type: RecommendationType,
  suggested_action: string,
  priority: 'low' | 'medium' | 'high' | 'critical'
): Recommendation {
  return {
    id: `rec_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
    finding: finding.finding_id,
    target: finding.target_system,
    promotedToIssue: false,
    recommendation_type,
    suggested_action,
    priority,
    evidence_refs: finding.evidence_refs,
    created_at: Date.now(),
    created_by: 'FRS_M4_reviewer'
  };
}

// Routing rules (automatic based on target_system + priority):
// - CDS-targeted: automatically becomes candidate agenda item for next governance cycle
// - OAD-targeted: routed to OAD certification panel / design teams
// - COS-targeted: routed to relevant cooperative workflow coordinators
// - ITC-targeted: routed to ITC policy sync / ethics review
// - FED-targeted: routed to federation coordination (Phase 4+)

// Boundary enforcement:
// Recommendation DOES NOT enter deliberation pipeline until formally accepted as governance issue
// Community retains full authority over whether and how to act on it
```

### M5 — Democratic Sensemaking Interface (Included, Primary FRS Output)

```typescript
// Weekly summary document published to all node participants + submitted to CDS

export interface SensemakingDocument {
  doc_id: string;
  packet_ref: string;
  node_id: string;
  period: TimePeriod;
  generated_at: number;
  generated_by: ParticipantId;
  
  // Plain language sections
  executive_summary: string;           // 2-3 paragraphs: what happened this period
  production_overview: string;         // what was produced, hours, materials
  contribution_overview: string;       // credits issued, decayed, access patterns
  resource_consumption: string;        // ecological flags, external dependencies
  concerns_detected: string;           // findings in plain language
  recommendations_made: string;        // recommendations in plain language
  governance_effectiveness: string;    // are CDS decisions producing effects?
  
  // Structured data for reference
  packet: FRSSignalPacket;
  
  // CDS submission
  cds_agenda_item: boolean;            // always true for sensemaking doc
  cds_issue_ref: string | null;
}

export function generateSensemakingDocument(packet: FRSSignalPacket): SensemakingDocument {
  // Transform packet findings/recommendations into plain language
  // Template-driven for consistency
  return {
    doc_id: `sense_${packet.packet_id}`,
    packet_ref: packet.packet_id,
    node_id: packet.node_id,
    period: { start: packet.period_start, end: packet.period_end },
    generated_at: Date.now(),
    generated_by: 'FRS_M5_generator',
    executive_summary: `During this period, ${packet.labor_summary.total_events} labor events were logged totaling ${packet.labor_summary.total_hours} hours...`,
    production_overview: formatProductionOverview(packet),
    contribution_overview: formatContributionOverview(packet),
    resource_consumption: formatResourceConsumption(packet),
    concerns_detected: formatFindings(packet.findings),
    recommendations_made: formatRecommendations(packet.recommendations),
    governance_effectiveness: formatGovernanceEffectiveness(packet.cds_summary),
    packet,
    cds_agenda_item: true,
    cds_issue_ref: null  // set when submitted to CDS
  };
}
```

### M6 — Longitudinal Memory (Deferred)

```typescript
// Accumulates from day one, becomes valuable after months of data
// Pattern learning, institutional recall, historical baselines

export interface LongitudinalMemory {
  node_id: string;
  patterns: LearnedPattern[];
  baselines: HistoricalBaseline[];
  institutional_recall: InstitutionalRecall[];
  updated_at: number;
}

export interface LearnedPattern {
  pattern_id: string;
  pattern_type: 'seasonal' | 'cyclical' | 'trend' | 'anomaly';
  description: string;
  confidence: number;
  first_detected: number;
  last_confirmed: number;
  occurrences: number;
}

export interface HistoricalBaseline {
  metric: string;
  baseline_value: number;
  baseline_period: TimePeriod;
  current_value: number;
  deviation: number;
  trend: 'improving' | 'stable' | 'degrading';
}
```

### M7 — Federated Intelligence (Deferred)

```typescript
// Federation-dependent — cannot implement before multiple nodes exist
// Inter-node learning, shared diagnostic models, cross-node pattern detection

export interface FederatedIntelligence {
  federation_id: string;
  participating_nodes: NodeId[];
  shared_models: SharedDiagnosticModel[];
  cross_node_findings: CrossNodeFinding[];
  last_sync: number;
}
```

---

## Interfaces FRS (desde INTERFACES_SPEC)

```typescript
// FRS → CDS: submit_signal_packet, get_recommendation_status
// CDS → FRS: get_governance_summary
// FRS → OAD: submit_coefficient_recalibration, submit_lifecycle_revision, submit_certification_review_request
// COS → FRS: get_operational_signal, get_qa_events
// ITC → FRS: get_credit_summary, get_ledger_entries, get_balance_distribution
// OAD → FRS: get_design_events, get_ecological_assessments, get_certification_changes
```

---

## Estado Actual en Zeitnus

| Función | Estado | Archivo |
|---|---|---|
| `ingestSignal(fromSystem, severity, finding)` | ✅ Básica | `integral.ts:89-91` |
| `SignalPacket` interface | ⚠️ Básica (solo id, fromSystem, severity, finding, ts) | `integral.ts:53-59` |
| `diagnose(signals)` | ⚠️ Solo sort por severity | `integral.ts:93-100` |
| `recommend(finding, target)` | ✅ Básica | `integral.ts:102-104` |
| `promoteRecommendation(rec)` | ✅ Crea issue CDS | `integral.ts:106-111` |
| `systemHealth(state)` | ✅ Score 0-100 | `integral.ts:114-125` |
| FRSSignalPacket completo | ❌ | FALTA |
| DiagnosticFinding | ❌ | FALTA |
| Recommendation con recommendation_type | ❌ | FALTA |
| Signal Intake automatizado (weekly job) | ❌ | FALTA |
| DiagnosticSession human-assisted | ❌ | FALTA |
| SensemakingDocument | ❌ | FALTA |

---

## Criterios de Aceptación

- [ ] `FRSSignalPacket` completo con 6 summaries + findings + recommendations
- [ ] `runSignalIntake()` job semanal automatizado (queries a 4 sistemas via interfaces)
- [ ] `DiagnosticFinding` con enums canónicos + `scope` obligatorio
- [ ] `DiagnosticSession` human-assisted con finding templates
- [ ] `createRecommendation()` con `recommendation_type` enum + routing rules
- [ ] `SensemakingDocument` weekly: plain language + structured data + CDS agenda item
- [ ] `submit_certification_review_request` NO detiene producción (test boundary)
- [ ] `get_governance_summary` consumido para governance effectiveness evaluation
- [ ] Interfaces FRS→CDS, CDS→FRS, FRS→OAD, COS→FRS, ITC→FRS, OAD→FRS
- [ ] Tests: signal intake job, finding classification, recommendation routing, sensemaking generation

---

## Referencias Normativas

- **Devguide 3.5**: FRS Proposed Core Modules (M1, M2, M4, M5 included; M3, M6, M7 deferred)
- **Devguide 2.2**: "FRS reads from COS, ITC, OAD, CDS... synthesizes into advisory diagnostic"
- **Devguide 2.2**: "FRS flags the divergence. It does not pull the trigger." — boundary crítico
- **Devguide 4.3**: FRSSignalPacket + DiagnosticFinding + Recommendation schemas completos
- **Devguide 4.4**: 6 interfaces FRS (3 outbound, 3 inbound)
- **White Paper FRS**: 7 módulos formales + bidirectional OAD↔FRS + CDS↔FRS