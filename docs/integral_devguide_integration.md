# Integral (Devguide v0.1 + White Paper V0.1) — Integración Zeitnus (HSCSG v15 OS)

**Fuentes:**
- `Downloads/documentos HSCSG/TQ/integral_devguide_v01 (1).pdf` (54 páginas) — Guía de desarrollo práctica
- `Downloads/documentos HSCSG/INTEGRAL-Paper-V0.1.pdf` (33MB, ~200+ páginas) — White Paper técnico completo
**Colectivo:** Integral Collective (9 repos federados)
**Fecha asimilación:** Octubre 2026

---

## Resumen Ejecutivo

**Integral** es una arquitectura de **cooperación económica post-monetaria** compuesta por **5 sistemas interdependientes** en loop cerrado:

```
CDS → OAD → COS → ITC → FRS → CDS
```

Donde:
- **CDS** (Collaborative Decision System) = Gobernanza democrática estructurada
- **OAD** (Open Access Design) = Comunes de diseño abierto, certificación ecológica
- **COS** (Cooperative Organization System) = Producción cooperativa, datos operacionales
- **ITC** (Integral Time Credits) = Contabilidad de contribución (no-dinero, decay, no-transferible)
- **FRS** (Feedback & Review System) = Sistema nervioso adaptativo, diagnóstico + recomendaciones

**Relación con repos existentes:**
- `integral/whitepaper` + `integral/devguide` = Especificación canónica (fuente de verdad)
- `integral/cds`, `integral/oad`, `integral/cos`, `integral/itc`, `integral/frs` = 5 repos de implementación (TypeScript/Go/Rust)
- `Zeitnus-Firma-Operaciones-Ecotomica` = **Adaptación React/TypeScript/Zustand (HSCSG v15 OS) — ESTE REPO**
- `integral/specifications` = Contratos de interfaz y esquemas de datos
- `integral/decisions` = Registro de gobernanza append-only (DR-001+)

**Estado actual en Zeitnus:** ✅ **Parcialmente implementado** — `src/core/state/integral.ts` + `src/core/lib/integral.ts` + `src/app/screens/Integral.tsx` cubren el **loop mínimo viable** (CDS→OAD→COS→ITC→FRS→CDS) con:
- Issue capture + Evidence Model (Fact Bands) + Voto por Mérito (Shivarthu)
- Certified Design + ecoScore
- LaborEvent + TimeCredit (con decay)
- SignalPacket + Recommendation + promoteRecommendation
- applyDecision (actuator P1: cierra CDS→OAD/COS)
- Modo Lucidez 2.0 (transparencia radical + provenance)

---

## Mapeo Sistema/Modulo Devguide → Código Zeitnus

| Sistema | Módulo Devguide (Mínimo Viable) | Zeitnus Estado | Archivos |
|---|---|---|---|
| **CDS** | M1: Issue Capture & Signal Intake | ✅ Completo | `integral.ts` (raiseIssue, raiseIssueWithEvidence) |
| | M2: Participatory Deliberation Workspace | ⚠️ Parcial (manual) | `Integral.tsx` (UI issues) |
| | M6: Weighted Consensus (manual) | ✅ Voto por Mérito (Shivarthu) | `integral.ts` (validateProposalScore) |
| | M7: Decision Recording | ✅ DecisionRecord DR-NNN | `integral.ts` (ratifyDecision) |
| | M8: Implementation Dispatch | ✅ applyDecision (actuator) | `integral.ts` (applyDecision) |
| | M3,4,5,9,10: Diferidos | ❌ Falta | — |
| **OAD** | M1: Design Submission | ⚠️ Parcial (CertifiedDesign básico) | `integral.ts` (certifyDesign) |
| | M2: Collaborative Workspace | ❌ Falta | — |
| | M3: Material & Ecological Coeff | ⚠️ Parcial (ecoScore 0-100) | `integral.ts` (ecoScore) |
| | M4: Certification Gate | ✅ Certificación estructurada | `integral.ts` (certifyDesign + applyDecision) |
| | M10: Knowledge Commons | ⚠️ Parcial (lista diseños) | `Integral.tsx` (lista diseños) |
| | M5-9: Diferidos | ❌ Falta | — |
| **COS** | M1: Production Plan | ⚠️ Parcial (LaborEvent) | `integral.ts` (logLabor) |
| | M2: Task Decomposition | ❌ Falta | — |
| | M3: Materials Management | ❌ Falta | — |
| | M4: Cooperative Workflow | ⚠️ Parcial (LaborEvent básico) | `integral.ts` (logLabor) |
| | M5: Quality Assurance | ❌ Falta | — |
| | M6: Distribution | ❌ Falta | — |
| **ITC** | M1: Labor Intake & Verification | ✅ LaborEvent certificado | `integral.ts` (logLabor certified) |
| | M2: Contribution Weighting | ✅ awardCredits (skill tier implícito) | `integral.ts` (awardCredits) |
| | M3: Time-Decay Engine | ✅ Decay exponencial | `integral.ts` (awardCredits decayPerDay) |
| | M4: Access Valuation | ❌ Falta (itc_access_cost en schema) | — |
| | M5: Access Redemption | ❌ Falta | — |
| | M6: Equity Monitoring | ❌ Falta | — |
| | M7: Ethics & Coercion Detection | ❌ Falta | — |
| | M8: Policy Synchronization | ❌ Falta | — |
| | M9: Ledger & Transparency | ✅ TimeCredit append-only | `integral.ts` (credits array) |
| **FRS** | M1: Signal Intake | ✅ ingestSignal | `integral.ts` (ingestSignal) |
| | M2: Diagnostic Classification | ⚠️ Parcial (diagnose sort) | `integral.ts` (diagnose) |
| | M3: Constraint Modeling | ❌ Diferido | — |
| | M4: Recommendation Routing | ✅ recommend + promote | `integral.ts` (recommend, promoteRecommendation) |
| | M5: Democratic Sensemaking | ✅ systemHealth + UI | `integral.ts` (systemHealth), `Integral.tsx` |
| | M6: Longitudinal Memory | ❌ Diferido | — |
| | M7: Federated Intelligence | ❌ Diferido | — |

---

## Contratos de Datos Críticos (Devguide Sección 4) → Zeitnus

### 1. CertifiedDesign (OAD → COS, ITC, FRS)
```typescript
// EXISTE en integral.ts:30-35 - PERO FALTAN CAMPOS CRÍTICOS (Sección 4.3)
interface CertifiedDesign {
  id: string;
  title: string;
  ecoScore: number;           // ✅ EXISTE
  version: number;            // ✅ EXISTE
  
  // ❌ FALTANTES (deben existir desde día 1, incluso vacíos):
  design_id: string;           // alias id
  label: string;               // "v0.3-bamboo-frame"
  description: string;
  authored_by: string[];       // node-id:participant-id
  created_at: number;
  certified_at: number;
  certified_by: string[];      // LISTA panel completo (audit trail)
  cds_mandate_ref: string;     // ref CDS decision
  status: 'draft'|'under_review'|'optimized'|'ready_for_certification'|'certified'|'superseded'|'revoked';
  skill_tier: 'low'|'medium'|'high'|'expert';
  ecological_flag: 'low'|'medium'|'high';
  ecological_notes: string;
  ecological_detail: EcoAssessment;        // [DEFERRED]
  lifecycle_detail: LifecycleModel;        // [DEFERRED]
  itc_access_cost: number;
  itc_access_cost_method: 'simple_embodied';
  superseded_by: string;
  design_lineage: string;
  node_id: string;
  federation_hash: string;                 // [DEFERRED]
  commons_visible: boolean;
}
```

### 2. LaborEvent (COS → ITC, FRS)
```typescript
// EXISTE en integral.ts:37-43 - PERO ESQUEMA INCOMPLETO
interface LaborEvent {
  event_id: string;
  timestamp: number;
  participant_id: string;      // node-id:participant-id (GLOBAL)
  coop_id: string;
  task_ref: string;
  production_plan_ref: string;
  design_ref: string;          // OAD CertifiedDesign + version
  hours: number;
  hours_verified: number;      // [devguide extension]
  skill_tier: 'low'|'medium'|'high'|'expert'; // CANONICAL ENUM
  context: WeightingContext;   // urge, scarcity, ecological_sensitivity
  verification_status: 'pending'|'verified'|'disputed';
  verified_by: string[];
  verified_at: number;
  // Weighting outputs (ITC Module 2) - CONSOLIDADOS aquí Phase 2:
  itc_weight_multiplier: number;
  itc_weight_breakdown: { skill_factor, scarcity_factor, ... };
  itc_weighted_hours: number;
  itc_credits_issued: number;
  ecological_flag: 'low'|'medium'|'high';
  ecological_detail: object;   // [DEFERRED]
  node_id: string;
  federation_hash: string;     // [DEFERRED]
}
```

### 3. MaterialConsumptionEvent (COS → ITC, FRS)
```typescript
// ❌ NO EXISTE EN ZEITNUS - CRÍTICO para contabilidad ecológica
interface MaterialConsumptionEvent {
  event_id: string;
  timestamp: number;
  task_ref: string;
  production_plan_ref: string;
  design_ref: string;
  material_id: string;
  material_name: string;
  quantity_consumed: number;
  unit: string;
  quantity_remaining: number;
  ecological_flag: 'low'|'medium'|'high';
  ecological_impact_index: number;  // [DEFERRED] EII
  source: 'internal'|'external_dependency';
  external_source_ref: string;      // [DEFERRED]
  node_id: string;
  federation_hash: string;          // [DEFERRED]
}
```

### 4. ITCAccount (ITC → FRS)
```typescript
// ❌ NO EXISTE - TimeCredit array NO ES account record
interface ITCAccount {
  account_id: string;
  participant_id: string;      // node-id:participant-id
  node_id: string;
  balance: number;
  total_earned: number;
  total_redeemed: number;
  total_decayed: number;
  active_decay_rule_id: string;     // ref CDS DecayRule
  last_decay_applied_at: number;
  last_contribution_at: number;     // REQUIRED for grace window
  last_access_at: number;           // REQUIRED for FRS monitoring
  decay_half_life_days: number;
  decay_inactivity_grace_days: number;
  decay_min_balance_protected: number;
  decay_max_annual_fraction: number;
  need_adjustment_active: boolean;
  need_adjustment_ref: string;
  transferable: false;              // ARQUITECTÓNICO - never policy
  federation_scope: 'local'|'cross-node';
  last_updated_at: number;
}
```

### 5. ITCLedgerEntry (ITC → FRS)
```typescript
// ❌ NO EXISTE - TimeCredit NO separa raw_hours/weighted_credits
interface ITCLedgerEntry {
  entry_id: string;
  timestamp: number;
  participant_id: string;
  node_id: string;
  entry_type: 'labor_event_recorded'|'labor_weight_applied'|'itc_credited'|'itc_decayed'|'access_value_quoted'|'access_redeemed'|'equivalence_band_applied'|'ethics_flag_created'|'ethics_flag_resolved'|'policy_updated';
  amount: number;                // net credit change
  raw_hours: number;             // solo labor entries
  weighted_credits: number;      // solo labor entries
  balance_after: number;
  related_ids: object;
  details: object;
  authorized_by: string;
  notes: string;
}
```

### 6. FRSSignalPacket (FRS → CDS)
```typescript
// EXISTE SignalPacket básico - PERO FALTA ESTRUCTURA COMPLETA
interface FRSSignalPacket {
  packet_id: string;
  node_id: string;
  period_start: number;
  period_end: number;
  generated_at: number;
  generated_by: string;
  prev_packet_ref: string;
  labor_summary: { total_events, total_hours, total_weighted_credits, total_hours_verified, verification_rate, events_by_skill_tier, overrun_tasks };
  materials_summary: { total_consumption_events, consumption_by_material, ecological_flag_counts, external_dependency_count, low_inventory_flags };
  itc_summary: { total_credits_issued, total_decay_applied, total_access_extinguished, active_participant_count, balance_distribution, need_adjustments_active };
  qa_summary: { total_qa_events, failures, failure_rate, failures_by_design };
  oad_summary: { new_certifications, design_version_updates, ecological_assessment_changes, certification_revocations, coefficient_recalibrations_pending };
  cds_summary: { decisions_dispatched, policies_updated, open_governance_issues, decision_records_merged };
  findings: DiagnosticFinding[];
  recommendations: Recommendation[];
  cds_submission_ref: string;
}
```

### 7. DiagnosticFinding (FRS)
```typescript
// ❌ NO EXISTE
interface DiagnosticFinding {
  finding_id: string;
  packet_ref: string;
  node_id: string;
  detected_at: number;
  finding_type: 'ecological_overshoot_risk'|'material_scarcity_trend'|'labor_imbalance_or_burnout_risk'|'throughput_bottleneck_persistent'|'quality_reliability_drift'|'dependency_fragility_increase'|'access_inequity_detected'|'proto_market_or_coercion_risk'|'governance_overload_or_capture_risk'|'data_integrity_anomaly'|'other';
  severity: 'info'|'low'|'moderate'|'high'|'critical';
  scope: 'local'|'node'|'regional'|'federation';
  persistence: 'transient'|'emerging'|'persistent'|'structural';
  confidence: 'low'|'medium'|'high';
  summary: string;
  rationale: string;
  evidence_refs: string[];
  indicators: object;
  target_system: 'CDS'|'OAD'|'COS'|'ITC'|'FED';
  requires_cds: boolean;
}
```

### 8. Recommendation (FRS)
```typescript
// EXISTE BÁSICO - FALTA recommendation_type
interface Recommendation {
  id: string;
  finding: string;
  target: IntegralSystem;
  promotedToIssue: boolean;
  // ❌ FALTANTE:
  recommendation_type: 'design_review_request'|'workflow_stress_alert'|'valuation_drift_flag'|'training_priority_signal'|'material_substitution_signal'|'certification_review_request'|'coefficient_recalibration'|'lifecycle_revision'|'capacity_adjustment'|'policy_review';
}
```

---

## Interfases Sistema (Devguide Sección 4.4) → Zeitnus

```typescript
// ❌ NO EXISTEN INTERFACES EXPLÍCITAS - ACOPLAMIENTO DIRECTO EN STORE
// DEBEN EXISTIR COMO FUNCIONES DE INTERFAZ (seam points)

interface OAD_COS_Interface {
  get_certified_design(design_id, version): CertifiedDesign | NotFound;
  list_certified_designs(filters): CertifiedDesign[];
}

interface OAD_ITC_Interface {
  get_design_intelligence(design_id): DesignIntelligence;  // labor steps, skill tiers, material intensity, eco coeffs
}

interface OAD_FRS_Interface {
  get_design_events(period): DesignEvent[];
  get_ecological_assessments(period): EcologicalAssessment[];
  get_certification_changes(period): CertificationChangeEvent[];
}

interface FRS_OAD_Interface {
  submit_coefficient_recalibration(evidence_ref, design_id, new_coefficients): void;
  submit_lifecycle_revision(evidence_ref, design_id, new_lifecycle): void;
  submit_certification_review_request(evidence_ref, design_id, reason): void;
  // CRÍTICO: NO detiene producción - solo flagga a OAD/CDS
}

interface COS_ITC_Interface {
  get_labor_events(node_id, period): LaborEvent[];
  get_material_events(node_id, period): MaterialConsumptionEvent[];
}

interface COS_FRS_Interface {
  get_operational_signal(node_id, period): OperationalSignalData;
  get_qa_events(node_id, period): QAEvent[];
}

interface ITC_FRS_Interface {
  get_credit_summary(node_id, period): ITCPeriodSummary;
  get_ledger_entries(node_id, period): ITCLedgerEntry[];
  get_balance_distribution(node_id): BalanceDistribution;
}

interface FRS_CDS_Interface {
  submit_signal_packet(packet): IssueReference;
  get_recommendation_status(rec_id): RecommendationStatus;
}

interface CDS_FRS_Interface {
  get_governance_summary(node_id, period): GovernanceSummary;
}

interface CDS_AllSystems_Interface {
  get_active_policies(system, node_id): PolicyRecord[];
  get_itc_policy_snapshot(node_id): ITCPolicySnapshot;  // weighting limits, decay rule, fairness thresholds, access bounds, anti-coercion
  get_production_mandate(mandate_id): ProductionMandate;
  notify_dispatch(dispatch_packet): Ack;
}
```

**Regla de versiones:** Cada interfaz lleva version identifier. Cambios breaking incrementan versión; versión previa disponible hasta migración total. Aplica desde PRIMERA interfaz.

---

## Gaps Críticos (Prioridad P0-P1)

### P0: Esquemas de Datos Completos (Sección 4.3)
- [ ] `CertifiedDesign` completo con todos campos [DEFERRED] en schema
- [ ] `LaborEvent` con skill_tier canónico + weighting outputs consolidados
- [ ] `MaterialConsumptionEvent` **NUEVO** (crítico para ITC/FRS)
- [ ] `ITCAccount` record por participante (no solo array TimeCredit)
- [ ] `ITCLedgerEntry` append-only con raw_hours + weighted_credits
- [ ] `FRSSignalPacket` completo con todos summaries + findings
- [ ] `DiagnosticFinding` + `Recommendation` con recommendation_type

### P0: Interfaces Explícitas (Seam Points)
- [ ] Definir 12 interfaces en `src/core/lib/integralInterfaces.ts`
- [ ] Refactorizar store.ts para usar interfaces (no acceso directo cross-sistema)
- [ ] Versionar interfaces desde v1

### P0: CDS - Módulos Faltantes Mínimos
- [ ] M1: Signal Intake automatizado (FRS/ITC/COS → CDS automático, no manual)
- [ ] M7: Decision Recording append-only con hash chaining (preparado)
- [ ] M8: Dispatch Packet estandarizado (ya en applyDecision, formalizar)

### P1: OAD - Certificación Ecológica Real
- [ ] M3: Ecological Coefficient Engine (checklist → structured EcoAssessment)
- [ ] M4: Certification Panel (multi-firma, recorded in ledger)
- [ ] M10: Knowledge Commons con search + version history

### P1: COS - Production Data Real
- [ ] M1: ProductionPlan linked to CertifiedDesign
- [ ] M4: Task decomposition + labor tracking por task
- [ ] M5: QAEvent records

### P1: ITC - Contabilidad Completa
- [ ] M2: Weighting formal (skill × scarcity × ecological_sensitivity)
- [ ] M3: DecayRule CDS-ratificada (half-life, grace window, max annual fraction)
- [ ] M4: Access Valuation (itc_access_cost en CertifiedDesign)
- [ ] M5: Access Redemption (extinguishment, no transfer)
- [ ] M7: Ethics Detection (coercion, preferential treatment, role cornering)
- [ ] M8: Policy Sync (get_itc_policy_snapshot)

### P1: FRS - Diagnostic Real
- [ ] M1: Signal Intake automatizado (scheduled queries, no manual)
- [ ] M2: DiagnosticFinding classification (human-assisted template)
- [ ] M4: Recommendation routing con recommendation_type
- [ ] M5: Sensemaking document (weekly summary → CDS agenda)

### P1: Loop Closure (P1 Actuator - Ya en applyDecision)
- [ ] CDS→OAD: DecisionRecord con context "design" → CertifiedDesign
- [ ] CDS→COS: DecisionRecord con context "labor/taller" → LaborEvent
- [ ] CDS→ITC: PolicySignal → ITCPolicySnapshot sync
- [ ] FRS→CDS: SignalPacket → Issue auto-creation (promoteRecommendation)

---

## Plan de Integración (Orden Devguide Phase 2)

| Fase | Tarea | Archivos Zeitnus | Esfuerzo | Valor |
|---|---|---|---|---|
| **P0** | Esquemas datos completos (Sección 4.3) | `integral.ts` (types), `integralInterfaces.ts` | 3 | 95 |
| **P0** | Interfaces explícitas 12 contratos | `integralInterfaces.ts`, `store.ts` refactor | 2 | 95 |
| **P0** | CDS M1 Signal Intake automático | `integral.ts` (ingestSignal → raiseIssue auto) | 2 | 90 |
| **P0** | ITCAccount + ITCLedgerEntry | `integral.ts`, `store.ts` | 3 | 95 |
| **P1** | MaterialConsumptionEvent + COS integration | `integral.ts`, `cos.ts` (nuevo) | 3 | 90 |
| **P1** | OAD EcoAssessment estructurado | `integral.ts`, `oad.ts` (nuevo) | 2 | 90 |
| **P1** | ITC Weighting + DecayRule CDS | `integral.ts`, `itc.ts` (nuevo) | 3 | 90 |
| **P1** | FRS DiagnosticFinding + M1 automático | `integral.ts`, `frs.ts` (nuevo) | 3 | 85 |
| **P1** | Access Valuation + Redemption (extinguishment) | `integral.ts`, `itc.ts` | 2 | 85 |
| **P2** | Ethics Detection (ITC M7) | `integral.ts` | 2 | 80 |
| **P2** | Federated Intelligence (FRS M7) | `frs.ts`, `crossNode.ts` | 3 | 75 |
| **P2** | Longitudinal Memory (FRS M6) | `frs.ts` | 2 | 75 |

---

## Archivos de Spec a Crear

1. `docs/INTEGRAL_DATA_CONTRACTS_SPEC.md` — 8 estructuras de datos (Sección 4.3)
2. `docs/INTEGRAL_INTERFACES_SPEC.md` — 12 interfaces sistema (Sección 4.4)
3. `docs/INTEGRAL_CDS_SPEC.md` — Módulos CDS mínimos + Evidence Model + Shivarthu
4. `docs/INTEGRAL_OAD_SPEC.md` — Certificación ecológica + Knowledge Commons
5. `docs/INTEGRAL_COS_SPEC.md` — ProductionPlan + LaborEvent + MaterialConsumption
6. `docs/INTEGRAL_ITC_SPEC.md` — Weighting, Decay, Access, Ethics, Ledger
7. `docs/INTEGRAL_FRS_SPEC.md` — SignalPacket, DiagnosticFinding, Recommendation, Sensemaking
8. `docs/INTEGRAL_LOOP_CLOSURE_SPEC.md` — applyDecision + PolicySync + Dispatch

---

## Próximos Pasos Inmediatos

1. **Crear specs** (8 documentos arriba) en `docs/`
2. **Implementar P0 data contracts** en `src/core/state/integral.ts` (tipos completos)
3. **Crear `src/core/lib/integralInterfaces.ts`** con 12 interfaces versionadas
4. **Refactorizar `store.ts`** para usar interfaces (no acceso directo cross-sistema)
5. **Implementar ITCAccount + ITCLedgerEntry** (reemplazar TimeCredit array)
6. **Implementar MaterialConsumptionEvent** + integrar en COS
7. **Automatizar FRS→CDS signal intake** (scheduled, no manual)
8. **Crear screens especializados**: `CDS.tsx`, `OAD.tsx`, `COS.tsx`, `ITC.tsx`, `FRS.tsx` (desglosar Integral.tsx)
9. **Verificar**: `npx tsc --noEmit` + `npm run build`
10. **Commit + push** referenciando devguide v0.1 + white paper v0.1

---

## Nota Final

> **El devguide no es documentación de apoyo. ES LA GUÍA DE IMPLEMENTACIÓN OFICIAL.**
> 
> Cada módulo marcado "Included" = código obligatorio en Phase 2. Cada campo `[DEFERRED]` = debe existir en schema día 1. Cada "simplificación aceptable" = principio preservado, mecanismo simplificado. Cada "violación" = principio roto = no aceptable.
> 
> **La fidelidad arquitectónica no es opcional. Es lo que hace a Integral ser Integral.**
> 
> > *"Minimalistic is a discipline, not a compromise."*
> > — Integral Devguide v0.1, Sección 1.2

---

*Integración creada: Octubre 2026*  
*Fuentes: Integral Devguide v0.1 (54 págs) + Integral White Paper V0.1*  
*Repo destino: Zeitnus-Firma-Operaciones-Ecotomica (HSCSG v15 OS)*  
*Repos canónicos: integral/whitepaper, integral/devguide, integral/cds, integral/oad, integral/cos, integral/itc, integral/frs, integral/specifications, integral/decisions*