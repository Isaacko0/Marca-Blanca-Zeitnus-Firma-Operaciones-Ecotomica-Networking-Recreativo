# Spec: OAD — Open Access Design (Devguide Sección 3.2)

**Fuente:** Integral Devguide v0.1, Sección 3.2 — "OAD — Open Access Design (Proposed Core Modules)"
**Prioridad:** P1 (Prerequisite para COS - "OAD is the prerequisite for COS... Nothing enters production without a certified design")
**Archivos Zeitnus:** `src/core/lib/oad.ts`, `src/core/state/oad.ts`, `src/app/screens/OAD.tsx`

---

## Principio: Certification Gate Arquitectónico

> "Certification is the gate between design and production, and it must exist in the minimal build. A design is certified when it has passed ecological assessment, has a complete and coherent bill of materials, and has been reviewed and approved by the certification panel. Certified designs are marked with a version-locked status that COS can verify before beginning production. Uncertified designs cannot enter production. This constraint is enforced architecturally."

---

## Módulos Mínimos Viables

### M1 — Design Submission & Structured Specification (Included, Simplified)

```typescript
// src/core/lib/oad.ts

export interface DesignSubmission {
  id: string;                           // design_id (generated at first submission)
  version: string;                      // semantic version "1.0.0"
  label: string;                        // "v0.3-bamboo-frame"
  title: string;
  description: string;
  
  // Bill of Materials (structured)
  bill_of_materials: BOMItem[];
  
  // Production steps (intended)
  production_steps: ProductionStep[];
  
  // Ecological impact flag (initial, human)
  ecological_flag: 'low' | 'medium' | 'high';
  
  // Authorship
  authored_by: ParticipantId[];         // node-id:participant-id
  created_at: number;
  
  // Version control (NON-NEGOTIABLE from day 1)
  design_lineage: string | null;        // prior version design_id
  superseded_by: string | null;         // superseding design_id
  
  // Status pipeline
  status: 'draft' | 'under_review' | 'optimized' | 'ready_for_certification' | 
          'certified' | 'superseded' | 'revoked';
  
  // Traceability
  cds_mandate_ref: string | null;       // CDS decision authorizing this work
  node_id: string;
  federation_hash: string | null;       // [DEFERRED]
  commons_visible: boolean;             // published to commons
}

export interface BOMItem {
  material_id: string;
  material_name: string;
  quantity: number;
  unit: string;
  ecological_flag: 'low' | 'medium' | 'high';
  source: 'internal' | 'external_dependency';
  external_source_ref: string | null;   // [DEFERRED]
  // [DEFERRED] ecological_impact_index
}

export interface ProductionStep {
  step_id: string;
  description: string;
  estimated_hours: number;
  required_skill_tier: SkillTier;
  ecological_flag: 'low' | 'medium' | 'high';
  dependencies: string[];               // other step_ids
  // [DEFERRED] detailed labor profile, tool requirements
}

// Phase 2: individual/small-group authorship via structured form
// Real-time collaborative editing DEFERRED
// Version control: every submission creates new version, never overwrites
```

### M2 — Collaborative Design Workspace (Partially Included)

```typescript
// Phase 2: structured submission form (M1) serves as partial workspace
// Real-time multi-user co-authoring DEFERRED
// Data structures from M1 support future collaborative workspace without schema changes

export interface CollaborativeWorkspace {
  design_id: string;
  active_editors: ParticipantId[];
  last_saved: number;
  // Future: operational transformation / CRDT for real-time sync
}
```

### M3 — Material & Ecological Coefficient Engine (Included, Minimally)

```typescript
// PRINCIPIO FUNDACIONAL: "ecological impact is assessed before production, not after"
// Phase 2: human-completed checklist attached to every design submission

export interface EcoAssessmentChecklist {
  design_id: string;
  version: string;
  assessed_by: ParticipantId[];
  assessed_at: number;
  
  // Checklist questions (human-completed)
  materials_required: string;           // what materials are required
  ecologically_sensitive_materials: string;  // any flagged as sensitive
  estimated_end_of_life_pathway: string;     // recycling, composting, reuse, landfill
  overall_impact_rating: 'low' | 'medium' | 'high';
  
  // Structured coefficients (populated from checklist + reference data)
  // [DEFERRED] full EcoAssessment data:
  ecological_detail: {
    embodied_energy: number | null;      // MJ/kg
    carbon_intensity: number | null;     // kg CO2e/kg
    toxicity: number | null;             // 0-10 scale
    recyclability: number | null;        // 0-1
    water_use: number | null;            // liters/kg
    land_use: number | null;             // m2/kg
    repairability: number | null;        // 0-1
  };
  
  // Lifecycle assumptions
  lifecycle_detail: {
    expected_lifetime_years: number | null;
    maintenance_interval_days: number | null;
    maintenance_labor_hours_per_interval: number | null;
    disassembly_hours: number | null;
    dominant_failure_modes: string[] | null;
    lifecycle_burden_index: number | null;
  };
  
  // ITC Access Cost (computed at certification)
  itc_access_cost: number;
  itc_access_cost_method: 'simple_embodied' | string;
}

// Reference data sources (Phase 2: human lookup; Future: automated integration)
// - ICE Database (Inventory of Carbon & Energy)
// - Ecoinvent
// - Agribalyse
// - Local material databases
```

### M4 — Certification Gate (Included, Full Principle)

```typescript
// ARQUITECTÓNICO: Uncertified designs CANNOT enter production
// Certification = structured review by designated panel (not single authority)

export interface CertificationPanel {
  panel_id: string;
  design_id: string;
  version: string;
  members: ParticipantId[];             // small, accountable group
  chair: ParticipantId;
  convened_at: number;
  completed_at: number | null;
  
  // Review criteria (all must pass)
  criteria: {
    ecological_assessment_complete: boolean;
    bill_of_materials_complete: boolean;
    bill_of_materials_coherent: boolean;
    production_steps_defined: boolean;
    skill_requirements_realistic: boolean;
  };
  
  // Decision
  certified: boolean;
  certified_at: number | null;
  certified_by: ParticipantId[];        // ALL panel members who approved
  conditions: string[];                 // if conditional approval
  notes: string;
  
  // Ledger entry (append-only)
  ledger_entry_id: string | null;
}

export function certifyDesign(design: DesignSubmission, panel: CertificationPanel): CertifiedDesign {
  // Returns CertifiedDesign with version-locked status
  // COS verifies certified_at + certified_by before production
  return {
    ...design,
    status: 'certified',
    certified_at: panel.certified_at!,
    certified_by: panel.certified_by,
    ecoScore: calculateEcoScore(design.ecological_flag, design.ecological_detail),
    // ... all CertifiedDesign fields from DATA_CONTRACTS_SPEC
  };
}

// COS Production Guard (enforced architecturally):
export function canEnterProduction(designId: string, version: string): boolean {
  const design = getCertifiedDesign(designId, version);
  return design !== null && design.status === 'certified';
}
```

### M10 — Knowledge Commons & Reuse Repository (Included, Primary Interface)

```typescript
// The entire minimal OAD IS a knowledge commons
// Structured database with search + version history

export interface KnowledgeCommons {
  designs: CertifiedDesign[];
  search(query: SearchQuery): CertifiedDesign[];
  get_lineage(design_id: string): CertifiedDesign[];  // full version history
  get_dependents(design_id: string): CertifiedDesign[];  // designs that depend on this
  // [DEFERRED] cross-node commons federation
}

export interface SearchQuery {
  text?: string;
  ecological_flag?: ('low' | 'medium' | 'high')[];
  skill_tier?: SkillTier[];
  status?: CertifiedDesign['status'][];
  authored_by?: ParticipantId[];
  node_id?: string;
  date_range?: TimePeriod;
}
```

---

## Módulos Diferidos (Explicitamente Fuera de Phase 2)

| Módulo | Razón | Preparación |
|---|---|---|
| M5: Feasibility Simulation | Requires operational history | EcoAssessment data structures ready |
| M6: Labor Decomposition | Depends on COS task structure | ProductionStep in DesignSubmission |
| M7: Systems Integration | Cross-design dependencies | design_lineage + dependents tracking |
| M8: Optimization Engine | Advanced analytics | EcoAssessment + Lifecycle data structures |
| M9: Validation & Benchmarking | Quality framework | CertificationPanel + QAEvent from COS |

---

## Interfaces OAD (desde INTERFACES_SPEC)

```typescript
// OAD → COS: get_certified_design, list_certified_designs
// OAD → ITC: get_design_intelligence (labor steps, skill tiers, material intensity, eco coeffs)
// OAD → FRS: get_design_events, get_ecological_assessments, get_certification_changes
// FRS → OAD: submit_coefficient_recalibration, submit_lifecycle_revision, submit_certification_review_request
```

---

## Estado Actual en Zeitnus

| Función | Estado | Archivo |
|---|---|---|
| `certifyDesign(title, ecoScore)` | ⚠️ Básica | `integral.ts:72-74` |
| `CertifiedDesign` interface | ⚠️ Incompleta (solo id, title, ecoScore, version) | `integral.ts:30-35` |
| DesignSubmission | ❌ | FALTA |
| EcoAssessmentChecklist | ❌ | FALTA |
| CertificationPanel | ❌ | FALTA |
| KnowledgeCommons search | ⚠️ Lista básica en Integral.tsx | FALTA |

---

## Criterios de Aceptación

- [ ] `DesignSubmission` con BOM estructurado + production_steps + ecological_flag
- [ ] Version control: nuevo diseño = nueva versión (nunca overwrite)
- [ ] `EcoAssessmentChecklist` human-completed adjunto a cada submission
- [ ] `CertificationPanel` multi-firma + criteria checklist + ledger entry
- [ ] `certifyDesign()` retorna `CertifiedDesign` version-locked (status='certified')
- [ ] `canEnterProduction()` guard arquitectónico: SOLO diseños certificados
- [ ] `KnowledgeCommons` con search + lineage + dependents
- [ ] `ecological_detail` + `lifecycle_detail` campos [DEFERRED] = null en schema
- [ ] `itc_access_cost` computado en certificación (simple_embodied method)
- [ ] Interfaces OAD→COS, OAD→ITC, OAD→FRS, FRS→OAD implementadas
- [ ] Tests: submission → assessment → panel → certification → production guard

---

## Referencias Normativas

- **Devguide 3.2**: OAD Proposed Core Modules (M1, M2 partial, M3 minimal, M4 full, M10 primary)
- **Devguide 2.2**: "OAD is the prerequisite for COS... dependency is architectural, not procedural"
- **Devguide 4.3**: CertifiedDesign schema completo con todos campos [DEFERRED]
- **Devguide 4.4**: 4 interfaces OAD (3 outbound, 1 inbound from FRS)
- **White Paper OAD**: 10 módulos formales + certification logic