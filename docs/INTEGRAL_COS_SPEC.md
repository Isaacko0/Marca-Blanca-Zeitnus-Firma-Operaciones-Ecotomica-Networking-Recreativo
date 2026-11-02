# Spec: COS — Cooperative Organization System (Devguide Sección 3.3)

**Fuente:** Integral Devguide v0.1, Sección 3.3 — "ITC — Integral Time Credits (Proposed Core Modules)" — *Nota: el devguide numera 3.3 como ITC pero describe COS en 3.4. Aquí cubro COS según la arquitectura.*
**Prioridad:** P1 (Source of truth para ITC y FRS - "COS is the source of truth for ITC and FRS")
**Archivos Zeitnus:** `src/core/lib/cos.ts`, `src/core/state/cos.ts`, `src/app/screens/COS.tsx`

---

## Principio: COS Data Integrity Fundacional

> "The labor events, material consumption records, and production outcomes that COS generates are the raw inputs that ITC uses to compute contribution values and access costs, and that FRS uses to assess system health. If COS data is incomplete or unreliable, both ITC and FRS are compromised. This makes COS data integrity a foundational concern of the entire system."

---

## Módulos Mínimos Viables

### M1 — Production Plan (Included)

```typescript
// src/core/lib/cos.ts

export interface ProductionPlan {
  plan_id: string;
  design_id: DesignId;
  design_version: string;
  quantity: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  // Authorization
  cds_mandate_ref: string;              // DR-NNN authorizing this production
  authorized_at: number;
  authorized_by: ParticipantId[];
  
  // Planning
  created_at: number;
  created_by: ParticipantId;
  start_date: number | null;
  target_completion: number | null;
  actual_completion: number | null;
  
  // Status
  status: 'planned' | 'active' | 'paused' | 'completed' | 'cancelled';
  
  // Work breakdown (simplified Phase 2)
  tasks: Task[];
  
  // Resource allocation
  assigned_coops: CoopId[];
  material_requirements: MaterialRequirement[];
  
  // Federation
  node_id: string;
  federation_hash: string | null;       // [DEFERRED]
}

export interface MaterialRequirement {
  material_id: string;
  material_name: string;
  quantity_required: number;
  unit: string;
  ecological_flag: EcologicalFlag;
  source: 'internal' | 'external_dependency';
  external_source_ref: string | null;   // [DEFERRED]
}
```

### M2 — Task Decomposition (Included, Simplified)

```typescript
// Phase 2: tasks derived from CertifiedDesign production_steps
// COS translates design steps into executable tasks

export interface Task {
  task_id: string;
  plan_id: string;
  design_step_ref: string;              // reference to CertifiedDesign production_steps
  
  description: string;
  estimated_hours: number;
  required_skill_tier: SkillTier;
  ecological_flag: EcologicalFlag;
  
  // Assignment
  assigned_coop: CoopId;
  assigned_participants: ParticipantId[];  // who will do this task
  
  // Execution
  status: 'pending' | 'assigned' | 'in_progress' | 'awaiting_verification' | 'completed' | 'blocked';
  started_at: number | null;
  completed_at: number | null;
  actual_hours: number | null;
  
  // Dependencies
  dependencies: string[];               // other task_ids
  
  // Quality
  qa_required: boolean;
  qa_completed: boolean;
  qa_passed: boolean | null;
  
  // Federation
  node_id: string;
}
```

### M3 — Materials Management (Included)

```typescript
// Inventory tracking + consumption logging
// Generates MaterialConsumptionEvent for ITC/FRS

export interface MaterialInventory {
  material_id: string;
  material_name: string;
  current_quantity: number;
  unit: string;
  ecological_flag: EcologicalFlag;
  ecological_impact_index: number | null;  // [DEFERRED]
  location: string;                       // storage location
  min_threshold: number;                  // reorder/alert level
  source: 'internal' | 'external_dependency';
  external_supplier_ref: string | null;   // [DEFERRED]
  last_updated: number;
}

export interface MaterialConsumptionLog {
  log_id: string;
  task_id: string;
  plan_id: string;
  design_ref: string;                     // CertifiedDesign + version
  material_id: string;
  quantity_consumed: number;
  unit: string;
  quantity_remaining: number;
  consumed_at: number;
  consumed_by: ParticipantId;
  // Generates MaterialConsumptionEvent (see DATA_CONTRACTS_SPEC)
}
```

### M4 — Cooperative Workflow Execution (Included)

```typescript
// Labor execution + verification → LaborEvent for ITC/FRS

export interface LaborExecution {
  execution_id: string;
  task_id: string;
  plan_id: string;
  design_ref: string;                     // CertifiedDesign + version
  
  participant_id: ParticipantId;
  coop_id: CoopId;
  
  hours_worked: number;                   // as reported
  hours_verified: number;                 // confirmed by peer verification
  skill_tier: SkillTier;
  
  // Weighting context (from CDS/FRS signals)
  weighting_context: WeightingContext;
  
  // Verification
  verification_status: VerificationStatus;
  verified_by: ParticipantId[];
  verified_at: number | null;
  
  // Timestamps
  started_at: number;
  completed_at: number;
  
  // Outputs
  output_quality: 'pass' | 'fail' | 'partial';
  notes: string;
  
  // Generates LaborEvent (see DATA_CONTRACTS_SPEC)
}

export interface PeerVerification {
  verification_id: string;
  execution_id: string;
  verifier_id: ParticipantId;
  verified_hours: number;
  quality_assessment: 'pass' | 'fail' | 'partial';
  notes: string;
  verified_at: number;
}
```

### M5 — Quality Assurance (Included, Minimal)

```typescript
// QA events feed FRS diagnostic

export interface QAEvent {
  event_id: string;
  task_id: string;
  plan_id: string;
  design_id: DesignId;
  design_version: string;
  
  passed: boolean;
  failure_mode: string | null;
  failure_details: string | null;
  
  inspected_by: ParticipantId;
  inspected_at: number;
  
  // Remediation
  remediation_required: boolean;
  remediation_task_id: string | null;
}
```

### M6 — Distribution (Included, Minimal)

```typescript
// Access point for ITC redemption (extinguishment)

export interface DistributionEvent {
  event_id: string;
  item_id: string;                        // produced item
  design_id: DesignId;
  design_version: string;
  
  recipient_id: ParticipantId;
  access_type: 'permanent_acquisition' | 'shared_use';
  itc_extinguished: number;               // credits extinguished (if permanent)
  
  distributed_at: number;
  distributed_by: ParticipantId;
  location: string;                       // Access Center / Tool Library / Shared-Use Pool
}
```

---

## Interfaces COS (desde INTERFACES_SPEC)

```typescript
// COS → ITC: get_labor_events, get_material_events
// COS → FRS: get_operational_signal, get_qa_events
// CDS → COS: get_production_mandate, notify_dispatch
// ITC → COS: submit_valuation_signal
```

---

## Estado Actual en Zeitnus

| Función | Estado | Archivo |
|---|---|---|
| `logLabor(projectId, participant, hours)` | ⚠️ Básica | `integral.ts:77-79` |
| `LaborEvent` interface | ⚠️ Muy básica (id, projectId, participant, hours, certified) | `integral.ts:37-43` |
| ProductionPlan | ❌ | FALTA |
| Task decomposition | ❌ | FALTA |
| MaterialInventory/Consumption | ❌ | FALTA |
| PeerVerification | ❌ | FALTA |
| QAEvent | ❌ | FALTA |
| DistributionEvent | ❌ | FALTA |

---

## Criterios de Aceptación

- [ ] `ProductionPlan` vinculado a `CertifiedDesign` + CDS mandate
- [ ] `Task` descompuesto desde `CertifiedDesign.production_steps`
- [ ] `MaterialInventory` con ecological_flag + min_threshold alerts
- [ ] `LaborExecution` → `LaborEvent` completo (skill_tier, weighting_context, verification)
- [ ] `MaterialConsumptionLog` → `MaterialConsumptionEvent` para ITC/FRS
- [ ] `PeerVerification` multi-verificador + hours_verified
- [ ] `QAEvent` con failure_mode + design_id implicated
- [ ] `DistributionEvent` con access_type (permanent/shared) + itc_extinguished
- [ ] Interfaces COS→ITC, COS→FRS, CDS→COS, ITC→COS implementadas
- [ ] Guard: `canEnterProduction()` verifica diseño certificado ANTES de crear plan
- [ ] Tests: plan → tasks → labor → materials → QA → distribution loop completo

---

## Referencias Normativas

- **Devguide 2.2**: "COS is the source of truth for ITC and FRS... COS data integrity foundational"
- **Devguide 3.4**: COS Proposed Core Modules (M1-M6 all included minimal)
- **Devguide 4.2**: Data contracts COS→ITC (LaborEvent, MaterialConsumptionEvent), COS→FRS (OperationalSignal)
- **Devguide 4.3**: LaborEvent schema completo + MaterialConsumptionEvent NUEVO
- **Devguide 4.4**: 4 interfaces COS (2 outbound, 2 inbound)