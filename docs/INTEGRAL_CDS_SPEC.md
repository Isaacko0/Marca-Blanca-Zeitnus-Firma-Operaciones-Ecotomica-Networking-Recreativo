# Spec: CDS — Collaborative Decision System (Devguide Sección 3.1)

**Fuente:** Integral Devguide v0.1, Sección 3.1 — "CDS — Collaborative Decision System (Proposed Core Modules)"
**Prioridad:** P0 (Sistema prioritario - "CDS is established as the initial development priority")
**Archivos Zeitnus:** `src/core/lib/cds.ts`, `src/core/state/cds.ts`, `src/app/screens/CDS.tsx`

---

## Principio: CDS First

> "IMPORTANT: Creating the CDS as a core initial focus, and giving it priority over other Integral systems development, allows it to be used for the development process itself as the developer community grows more complex."

El CDS no es solo un módulo más — es la **infraestructura de gobernanza** que usa el propio proyecto para tomar decisiones sobre su desarrollo.

---

## Módulos Mínimos Viables (Included)

### M1 — Issue Capture & Signal Intake (Included, Full Principle)

```typescript
// src/core/lib/cds.ts

export interface Issue {
  id: string;                           // unique identifier
  title: string;
  description: string;
  raised_by: ParticipantId;             // node-id:participant-id
  raised_at: number;
  
  // Source tracking
  source: 'human' | 'FRS' | 'ITC' | 'COS' | 'OAD';
  source_ref: string | null;            // signal_packet_id, ledger_entry_id, etc.
  
  // Evidence Model (CompAI CRM / Fact Bands)
  evidence: Evidence[];
  band?: 'VERIFIED' | 'PROBABLE' | 'POSSIBLE' | null;
  score?: number;
  
  // Status pipeline
  status: 'open' | 'deliberating' | 'decided' | 'dispatched' | 'implemented' | 'closed';
  
  // Trazabilidad
  deliberation_started_at: number | null;
  decided_at: number | null;
  dispatched_at: number | null;
  implemented_at: number | null;
  
  // Cross-ref
  decision_record_id: string | null;    // DR-NNN
  promoted_recommendations: RecommendationId[];
}

export interface Evidence {
  id: string;
  kind: EvidenceKind;
  text: string;
  source_url?: string;
  submitted_by: ParticipantId;
  submitted_at: number;
  weight: number;                       // pre-calculated from kind
}

// Evidence Kinds with base weights (Fact Bands - CompAI CRM)
export type EvidenceKind = 
  | 'cds.consensus'        // weight 0.80 - consensus previo documentado
  | 'aut.observation'      // weight 0.85 - observación automática verificada
  | 'crm.signature-block'  // weight 0.80 - bloque de firma CRM
  | 'web.cited-claim'      // weight 0.40 - cita web verificable
  | 'employer-only'        // weight 0.20 - solo declaración empleador
  | 'contradiction';       // weight 0.00 - contradicción detectada

export const EVIDENCE_WEIGHTS: Record<EvidenceKind, number> = {
  'cds.consensus': 0.80,
  'aut.observation': 0.85,
  'crm.signature-block': 0.80,
  'web.cited-claim': 0.40,
  'employer-only': 0.20,
  'contradiction': 0.00
};

export function scoreEvidence(evidence: Evidence[]): { band: Issue['band']; score: number } {
  if (evidence.length === 0) return { band: null, score: 0 };
  
  // Band calculation per CompAI CRM
  const maxWeight = Math.max(...evidence.map(e => e.weight));
  const avgWeight = evidence.reduce((sum, e) => sum + e.weight, 0) / evidence.length;
  const hasContradiction = evidence.some(e => e.kind === 'contradiction');
  
  if (hasContradiction) return { band: 'POSSIBLE', score: avgWeight };
  if (maxWeight >= 0.85 && avgWeight >= 0.75) return { band: 'VERIFIED', score: avgWeight };
  if (maxWeight >= 0.60 && avgWeight >= 0.40) return { band: 'PROBABLE', score: avgWeight };
  return { band: 'POSSIBLE', score: avgWeight };
}

// Auto-execution rule: VERIFIED issues can auto-execute if they have clear action
// PROBABLE/POSSIBLE require human ratification (deliberation)
```

### M2 — Participatory Deliberation Workspace (Included, Manually Assisted)

```typescript
// Fase 2: facilitación humana con tooling mecánico automatizado

export interface DeliberationWorkspace {
  issue_id: string;
  opened_at: number;
  closes_at: number;                    // auto-timer 48h default
  facilitator: ParticipantId | null;    // assigned facilitator
  
  // Submissions (structured, not free-form chat)
  submissions: DeliberationSubmission[];
  
  // Automated facilitation tools
  timer: DeliberationTimer;
  reminders: Reminder[];
  facilitator_checklist: FacilitatorChecklistItem[];
}

export interface DeliberationSubmission {
  id: string;
  participant_id: ParticipantId;
  submitted_at: number;
  position: 'strong_support' | 'support' | 'neutral' | 'concerns' | 'strong_objection';
  reasoning: string;
  conditions?: string[];                // if support/neutral with conditions
  blocking_objection: boolean;          // true if strong_objection with proposed resolution
  proposed_resolution?: string;         // required if blocking_objection
}

export interface DeliberationTimer {
  comment_period_ends: number;
  synthesis_period_ends: number | null;
  auto_close: boolean;
}

export interface Reminder {
  id: string;
  type: '48h_before_close' | '24h_before_close' | 'synthesis_due';
  sent_at: number | null;
  sent_by: 'bot';
}

export interface FacilitatorChecklistItem {
  id: string;
  description: string;
  completed: boolean;
  completed_at: number | null;
  // Items: format submissions, check required fields, timer management, 
  // blocking objection detection, synthesis drafting, decision recording
}

// Mechanical work automated (bot):
// - Formatting submissions to template
// - Opening/closing comment periods on timer
// - Sending reminders 48h/24h before close
// - Checking required fields on submission
// - Detecting blocking objections (strong_objection + proposed_resolution)

// Human judgment required:
// - Determining if blocking objection is substantive
// - Synthesizing genuine consensus from contested positions  
// - Writing decision record capturing reasoning honestly
```

### M6 — Weighted Consensus Mechanism (Manual Assisted → Shivarthu Merit Vote)

```typescript
// Devguide: "In the minimal version, consensus is recorded through a structured template...
// A human facilitator synthesizes these into a decision outcome using the same categories
// the full engine will eventually produce algorithmically."

// Zeitnus IMPLEMENTA: Voto por Mérito (Shivarthu) - peso = reputación × experiencia × externalidad

export interface MeritVote {
  issue_id: string;
  voter_id: ParticipantId;
  reputation: number;    // 0-100 (normalized 0-1)
  experience: number;    // 0-50 años/proyectos (normalized 0-1)  
  externality: number;   // 0-100 validación externalidad positiva (normalized 0-1)
  weight: number;        // rep × exp × ext (0-1, 3 decimales)
  position: DeliberationSubmission['position'];
  timestamp: number;
}

export function calculateMeritWeight(reputation: number, experience: number, externality: number): number {
  const rep = Math.max(0, Math.min(1, reputation / 100));
  const exp = Math.max(0, Math.min(1, experience / 50));
  const ext = Math.max(0, Math.min(1, externality / 100));
  return Number((rep * exp * ext).toFixed(3));
}

// Decision outcome categories (same as full engine will produce):
export type DecisionOutcome = 
  | 'full_approval'
  | 'conditional_approval' 
  | 'revision_request'
  | 'rejection'
  | 'deferred';

export interface DecisionSynthesis {
  issue_id: string;
  outcome: DecisionOutcome;
  facilitator_id: ParticipantId;
  synthesized_at: number;
  
  // Supporting data
  total_weight: number;                 // sum of merit weights
  support_weight: number;
  objection_weight: number;
  blocking_objections: MeritVote[];     // must be addressed
  conditions: string[];
  reasoning: string;                    // honest capture of deliberation logic
}
```

### M7 — Decision Recording, Versioning & Accountability (Included, Full Principle)

```typescript
// NON-NEGOTIABLE: append-only record from day one
// Schema anticipates cryptographic hash chaining upgrade

export interface DecisionRecord {
  id: string;                           // DR-NNN format
  issue_id: string;
  decision: string;                     // the actual decision text
  context: string;                      // what prompted this
  reasoning: string;                    // honest capture of WHY
  outcome: DecisionOutcome;
  conditions: string[];
  
  // Accountability
  facilitator_id: ParticipantId;
  synthesized_by: 'human' | 'algorithmic';  // 'human' in Phase 2
  ratified_at: number;
  ratified_by: ParticipantId[];         // participants who ratified
  
  // Versioning
  supersedes: string | null;            // previous DR id
  version: number;                      // 1, 2, 3...
  
  // Dispatch
  dispatched: boolean;
  dispatched_at: number | null;
  dispatch_packet_id: string | null;
  
  // Append-only ledger fields (prepared for hash chaining)
  prev_dr_hash: string | null;          // [DEFERRED] hash of previous DR
  hash: string | null;                  // [DEFERRED] this record's hash
}

export function createDecisionRecord(
  issue: Issue,
  synthesis: DecisionSynthesis,
  facilitatorId: ParticipantId
): DecisionRecord {
  return {
    id: `DR-${String(getNextDRSequence()).padStart(3, '0')}`,
    issue_id: issue.id,
    decision: synthesis.outcome === 'full_approval' ? `Approved: ${issue.title}` :
              synthesis.outcome === 'conditional_approval' ? `Approved with conditions: ${issue.title}` :
              synthesis.outcome === 'revision_request' ? `Revision requested: ${issue.title}` :
              synthesis.outcome === 'rejection' ? `Rejected: ${issue.title}` :
              `Deferred: ${issue.title}`,
    context: issue.description,
    reasoning: synthesis.reasoning,
    outcome: synthesis.outcome,
    conditions: synthesis.conditions,
    facilitator_id: facilitatorId,
    synthesized_by: 'human',
    ratified_at: Date.now(),
    ratified_by: [facilitatorId],  // in Phase 2, facilitator ratifies
    supersedes: null,
    version: 1,
    dispatched: false,
    dispatched_at: null,
    dispatch_packet_id: null,
    prev_dr_hash: null,
    hash: null
  };
}
```

### M8 — Implementation Dispatch Interface (Included, Simplified)

```typescript
// Dispatch Packet: contrato primario CDS → otros sistemas

export interface DispatchPacket {
  dispatch_id: string;                  // DISP-NNN
  dr_id: string;                        // DecisionRecord id
  target_system: 'OAD' | 'COS' | 'ITC' | 'FRS' | 'ALL';
  action: DispatchAction;
  parameters: Record<string, unknown>;
  success_indicators: SuccessIndicator[];
  dispatched_at: number;
  dispatched_by: ParticipantId;
  acknowledged_by: ParticipantId | null;
  acknowledged_at: number | null;
  status: 'pending' | 'acknowledged' | 'implemented' | 'failed' | 'blocked';
}

export type DispatchAction = 
  | 'create_design' 
  | 'certify_design' 
  | 'start_production' 
  | 'adjust_policy' 
  | 'review_certification'
  | 'recalibrate_coefficients'
  | 'revise_lifecycle';

export interface SuccessIndicator {
  indicator_id: string;
  description: string;
  metric: string;
  target_value: number;
  measurement_period: TimePeriod;
}

// En Phase 2: dispatch = structured document acted on manually
// Future: automated API consumption by target systems
```

---

## Módulos Diferidos (Explicitamente Fuera de Phase 2)

| Módulo | Razón | Preparación en Phase 2 |
|---|---|---|
| M3: Knowledge Integration & Context Engine | Require operational history | Data structures for prior decisions/design outcomes in Issue |
| M4: Facilitated Synthesis & Consensus Building | Syntegrity protocol complex | DeliberationSubmission captures positions for future Syntegrity |
| M5: Consensus Engine (Algorithmic) | Requires operational history | MeritVote + DecisionSynthesis use same categories |
| M9: Syntegrity Escalation | Constitutional last resort | Trigger conditions recorded in DecisionRecord |
| M10: Review, Revision & Override | Needs decision history | supersedes field + versioning in DecisionRecord |

---

## Integración con Sistema de Desarrollo (Dogfooding)

```typescript
// El CDS del proyecto Integral USA el CDS para gobernar su desarrollo

export interface CDSDevelopmentGovernance {
  // Repositorios gobernados
  repositories: {
    'integral/cds': { issues: IssueId[]; decisions: DecisionRecordId[] };
    'integral/oad': { issues: IssueId[]; decisions: DecisionRecordId[] };
    'integral/cos': { issues: IssueId[]; decisions: DecisionRecordId[] };
    'integral/itc': { issues: IssueId[]; decisions: DecisionRecordId[] };
    'integral/frs': { issues: IssueId[]; decisions: DecisionRecordId[] };
    'integral/specifications': { issues: IssueId[]; decisions: DecisionRecordId[] };
    'integral/devguide': { issues: IssueId[]; decisions: DecisionRecordId[] };
    'integral/whitepaper': { issues: IssueId[]; decisions: DecisionRecordId[] };
  };
  
  // Workflow: Discord → GitHub Issue → Deliberation → Proposal → Consensus → PR → DR
  // (Devguide Sección 6.5)
}
```

---

## Estado Actual en Zeitnus

| Función | Estado | Archivo |
|---|---|---|
| `raiseIssue` | ✅ | `integral.ts:15-17` |
| `raiseIssueWithEvidence` + Fact Bands | ✅ | `integral.ts:21-37` |
| `validateProposalScore` (Shivarthu) | ✅ | `integral.ts:42-52` |
| `ratifyDecision` → DR-NNN | ✅ | `integral.ts:54-69` |
| `applyDecision` (actuator) | ✅ | `integral.ts:179-192` |
| DeliberationWorkspace | ❌ | FALTA |
| MeritVote + DecisionSynthesis | ⚠️ Parcial (solo validateProposalScore) | FALTA |
| DispatchPacket | ⚠️ Parcial (applyDecision básico) | FALTA |
| DecisionRecord append-only + hash prep | ❌ | FALTA |

---

## Criterios de Aceptación (Definition of Done)

- [ ] `Issue` con Evidence Model completo + Fact Bands + auto-band scoring
- [ ] `DeliberationWorkspace` con timer automático (48h), reminders bot, facilitator checklist
- [ ] `MeritVote` calcula peso = rep×exp×ext normalizados 0-1 (Shivarthu)
- [ ] `DecisionSynthesis` con outcome categories + blocking objection handling
- [ ] `DecisionRecord` DR-NNN append-only + `prev_dr_hash` + `hash` fields (preparado chaining)
- [ ] `DispatchPacket` estandarizado con `success_indicators` para FRS monitoring
- [ ] Integración: `raiseIssueWithEvidence` VERIFIED → auto-ejecuta si action clara
- [ ] Integración: PROBABLE/POSSIBLE → deliberation workspace obligatorio
- [ ] Tests: evidence scoring, merit weight, decision synthesis, dispatch packet creation
- [ ] Dogfooding: CDS usa CDS para decisiones de desarrollo del proyecto

---

## Referencias Normativas

- **Devguide 3.1**: CDS Proposed Core Modules (M1, M2, M6, M7, M8 included)
- **Devguide 1.2**: "Architectural Faithfulness vs Functional Completeness" — M7 non-negotiable
- **Devguide 6.5**: Workflow and Consensus (Discord → GitHub → Deliberation → PR → DR)
- **White Paper CDS**: 10 módulos formales + Syntegrity escalation
- **CompAI CRM**: Evidence Model / Fact Bands (weights canonicos)
- **Shivarthu**: Merit Vote = reputation × experience × externality