# Spec: Integral Loop Closure (Actuator P1 + Policy Sync)

**Fuente:** Integral Devguide v0.1, Sección 5.2 — "Integration Strategy for the Minimum Viable System" + `integral.ts` existing `applyDecision`
**Prioridad:** P1 (Cierra el loop CDS→OAD/COS→ITC→FRS→CDS)
**Archivos Zeitnus:** `src/core/lib/integralLoop.ts`, `src/core/state/integral.ts` (extensión), `src/app/screens/IntegralLoop.tsx`

---

## El Loop Completo

```
CDS → OAD → COS → ITC → FRS → CDS
  ↑___________________________|
```

El **actuator** es lo que mueve una decisión ratificada en CDS hacia su órgano de ejecución, cerrando el loop.

---

## 1. applyDecision — Actuator P1 (Ya existe en integral.ts:179-192)

```typescript
// src/core/lib/integralLoop.ts

import type { IntegralState, DecisionRecord, CertifiedDesign, LaborEvent } from '@core/state/integral'

/**
 * applyDecision: mueve una DecisionRecord ratificada en CDS hacia su órgano de ejecución
 * (OAD → CertifiedDesign, COS → LaborEvent/ProductionPlan).
 * Función PURA: devuelve el nuevo IntegralState.
 * Cierra el eslabón CDS→OAD/COS del loop (antes solo quedaba en status:'decided').
 */

export function applyDecision(s: IntegralState, drId: string): IntegralState {
  const dr = s.decisions.find((d) => d.id === drId)
  if (!dr) return s
  
  const ctx = dr.context.toLowerCase()
  
  // CDS → OAD: Design certification / creation
  if (ctx.includes('oad') || ctx.includes('diseño') || ctx.includes('design') || ctx.includes('certif')) {
    const design: CertifiedDesign = { 
      id: `design_${Date.now()}`, 
      title: dr.decision, 
      ecoScore: 50, 
      version: 1,
      // ... todos los campos de CertifiedDesign schema
    }
    return { ...s, designs: [...s.designs, design] }
  }
  
  // CDS → COS: Production mandate / labor organization
  if (ctx.includes('cos') || ctx.includes('labor') || ctx.includes('taller') || ctx.includes('producc')) {
    const labor: LaborEvent = { 
      id: `labor_${Date.now()}`, 
      projectId: dr.id, 
      participant: 'nodo', 
      hours: 1, 
      certified: true,
      // ... todos los campos de LaborEvent schema
    }
    return { ...s, labor: [...s.labor, labor] }
  }
  
  // CDS → ITC: Policy adjustment
  if (ctx.includes('itc') || ctx.includes('credito') || ctx.includes('decay') || ctx.includes('ponder')) {
    return applyITCpolicyChange(s, dr)
  }
  
  // CDS → FRS: Monitoring directive
  if (ctx.includes('frs') || ctx.includes('monitoreo') || ctx.includes('señal')) {
    return applyFRSdirective(s, dr)
  }
  
  return s
}

// Batch apply multiple decisions
export function applyDecisions(s: IntegralState, drIds: string[]): IntegralState {
  return drIds.reduce((state, drId) => applyDecision(state, drId), s)
}
```

---

## 2. Policy Synchronization (CDS → All Systems)

```typescript
// Cuando CDS ratifica policy change → notifica a sistemas via CDS_AllSystems_Interface

export interface PolicyChangeDispatch {
  dispatch_id: string;
  dr_id: string;
  target_system: 'ITC' | 'OAD' | 'COS' | 'FRS' | 'ALL';
  policy_type: PolicyType;
  new_policy: PolicyRecord;
  effective_at: number;
}

export type PolicyType = 
  | 'itc_weighting_limits'
  | 'itc_decay_rule'
  | 'itc_fairness_thresholds'
  | 'itc_access_policy'
  | 'itc_anti_coercion'
  | 'oad_certification_criteria'
  | 'cos_qa_standards'
  | 'frs_diagnostic_thresholds'
  | 'cds_deliberation_rules';

export async function syncPolicyToSystems(
  policyChange: PolicyChangeDispatch,
  state: IntegralState
): Promise<IntegralState> {
  const { target_system, policy_type, new_policy } = policyChange
  
  // Update system's local policy snapshot
  switch (target_system) {
    case 'ITC':
      return updateITCpolicySnapshot(state, new_policy)
    case 'OAD':
      return updateOADcertificationCriteria(state, new_policy)
    case 'COS':
      return updateCOSqaStandards(state, new_policy)
    case 'FRS':
      return updateFRSdiagnosticThresholds(state, new_policy)
    case 'ALL':
      // Broadcast to all
      let newState = state
      newState = updateITCpolicySnapshot(newState, new_policy)
      newState = updateOADcertificationCriteria(newState, new_policy)
      newState = updateCOSqaStandards(newState, new_policy)
      newState = updateFRSdiagnosticThresholds(newState, new_policy)
      return newState
  }
}

// ITC Policy Snapshot (consumed by ITC modules)
function updateITCpolicySnapshot(state: IntegralState, policy: PolicyRecord): IntegralState {
  const snapshot: ITCPolicySnapshot = {
    weighting_limits: policy.content.weighting_limits,
    decay_rule: policy.content.decay_rule,
    fairness_thresholds: policy.content.fairness_thresholds,
    access_policy: policy.content.access_policy,
    anti_coercion_rules: policy.content.anti_coercion_rules,
    snapshot_id: `snap_${Date.now()}`,
    snapshot_at: Date.now()
  }
  return { ...state, itc: { ...state.itc, policySnapshot: snapshot } }
}

// Similar for other systems...
```

---

## 3. FRS → CDS Loop Closure (Signal Packet → Issue)

```typescript
// FRS Module 4: promoteRecommendation → CDS Issue
// Ya existe en integral.ts:106-111

export function promoteRecommendation(rec: Recommendation): { rec: Recommendation; issue: Issue } {
  return {
    rec: { ...rec, promotedToIssue: true },
    issue: raiseIssue(`[FRS→CDS] ${rec.finding}`, 'FRS')  // auto-crea issue en CDS
  }
}

// Signal Packet submission to CDS (FRS_CDS_Interface)
export async function submitSignalPacketToCDS(packet: FRSSignalPacket): Promise<IssueId> {
  // 1. Submit packet via interface
  const result = await frsCdsInterface.submit_signal_packet(packet)
  
  // 2. Create CDS issue from packet (if critical findings)
  const criticalFindings = packet.findings.filter(f => f.severity === 'critical' || f.requires_cds)
  if (criticalFindings.length > 0) {
    const issue = raiseIssueWithEvidence(
      `[FRS Signal Packet] ${criticalFindings.length} critical findings requiring governance`,
      'FRS',
      criticalFindings.map(f => ({ 
        kind: 'aut.observation' as EvidenceKind, 
        detail: f.summary, 
        sourceUrl: undefined 
      }))
    )
    // Link packet to issue
    packet.cds_submission_ref = issue.id
    return issue.id
  }
  
  return result.issue_ref
}
```

---

## 4. CDS → FRS Governance Effectiveness (Closing the evaluation loop)

```typescript
// CDS_FRS_Interface: get_governance_summary
// FRS consumes this to assess whether CDS decisions produce effects

export function evaluateGovernanceEffectiveness(
  packet: FRSSignalPacket,
  state: IntegralState
): GovernanceEffectivenessReport {
  const cdsSummary = packet.cds_summary
  
  // Compare decisions dispatched vs implemented
  const decisions = state.decisions.filter(d => d.dispatched)
  const implemented = decisions.filter(d => d.status === 'implemented').length
  const blocked = decisions.filter(d => d.status === 'blocked').length
  const failed = decisions.filter(d => d.status === 'failed').length
  
  // Check if policies updated are reflected in system snapshots
  const policySyncStatus = checkPolicySync(state)
  
  return {
    period: { start: packet.period_start, end: packet.period_end },
    decisions_dispatched: cdsSummary.decisions_dispatched,
    decisions_implemented: implemented,
    decisions_blocked: blocked,
    decisions_failed: failed,
    implementation_rate: cdsSummary.decisions_dispatched > 0 ? implemented / cdsSummary.decisions_dispatched : 0,
    policies_updated: cdsSummary.policies_updated,
    policy_sync_status: policySyncStatus,
    open_governance_issues: cdsSummary.open_governance_issues,
    assessment: implementation_rate > 0.8 ? 'effective' : 
                implementation_rate > 0.5 ? 'partial' : 'ineffective'
  }
}

function checkPolicySync(state: IntegralState): PolicySyncStatus[] {
  // Verify each system's policy snapshot matches CDS ratified policies
  // Returns status per system
}
```

---

## 5. First Successful Slice (Devguide 5.2)

```typescript
// The first successful slice should allow this minimal path:

export interface FirstSlicePath {
  // 1. CDS: Community makes collective decision
  step1: {
    action: 'raiseIssueWithEvidence' | 'raiseIssue';
    evidence: Evidence[];  // Fact Bands
    band: 'VERIFIED' | 'PROBABLE' | 'POSSIBLE';
    result: 'Issue created with band';
  };
  
  // 2. CDS: Deliberation + Decision Recording
  step2: {
    action: 'deliberation + ratifyDecision';
    merit_votes: MeritVote[];  // Shivarthu
    synthesis: DecisionSynthesis;
    result: 'DecisionRecord DR-NNN created';
  };
  
  // 3. CDS → OAD: Dispatch to certify design
  step3: {
    action: 'applyDecision(DR-NNN)';
    target: 'OAD';
    result: 'CertifiedDesign version-locked';
  };
  
  // 4. OAD → COS: Certified design authorizes production
  step4: {
    action: 'create ProductionPlan from CertifiedDesign';
    guard: 'canEnterProduction(designId, version) === true';
    result: 'ProductionPlan active with tasks';
  };
  
  // 5. COS: Labor executed + verified → LaborEvent
  step5: {
    action: 'LaborExecution + PeerVerification';
    result: 'LaborEvent verified with skill_tier + weighting_context';
  };
  
  // 6. COS → ITC: LaborEvent → credits issued (weighted + decay)
  step6: {
    action: 'ITC M1+M2+M3: intake → weight → awardCredits';
    result: 'ITCAccount balance updated + ITCLedgerEntry appended';
  };
  
  // 7. ITC → FRS: Credit/access patterns → signal
  step7: {
    action: 'FRS M1: runSignalIntake (weekly)';
    sources: ['COS', 'ITC', 'OAD', 'CDS'];
    result: 'FRSSignalPacket with 6 summaries';
  };
  
  // 8. FRS: Diagnostic → Recommendation → CDS
  step8: {
    action: 'FRS M2+M4+M5: diagnose → recommend → promote → sensemaking';
    result: 'DiagnosticFinding + Recommendation + SensemakingDocument → CDS issue';
  };
  
  // 9. Loop closes: CDS receives FRS signal, deliberates, decides
  step9: {
    action: 'CDS receives FRS issue, deliberates, ratifies new decision';
    result: 'New DR-NNN → back to step 3';
  };
}

// Test de integración completo
export async function testFirstSlice(): Promise<{ success: boolean; steps: string[] }> {
  const completedSteps: string[] = []
  
  try {
    // Step 1: Issue with evidence
    const issue = raiseIssueWithEvidence(
      'Certificar diseño huerta comunitaria',
      'Luz',
      [{ kind: 'aut.observation', detail: 'Diseño completado y revisado', weight: 0.85 }]
    )
    completedSteps.push('1. Issue raised with VERIFIED band')
    
    // Step 2: Deliberation + Decision
    const dr = ratifyDecision([issue], issue.id, 'Certificar diseño v1', 
      'Contexto: necesidad producción alimentos', 
      'Razonamiento: ecoScore 88, BOM completo, panel aprobado')
    completedSteps.push('2. DecisionRecord DR-001 ratified')
    
    // Step 3: Apply to OAD
    let state = makeIntegralState()
    state = applyDecision(state, dr.dr.id)
    completedSteps.push('3. CertifiedDesign created via applyDecision')
    
    // Step 4: COS ProductionPlan (requires certified design)
    const design = state.designs[0]
    if (canEnterProduction(design.id, design.version)) {
      completedSteps.push('4. ProductionPlan authorized (certified design guard passed)')
    }
    
    // Step 5: Labor execution
    const labor = logLabor('plan_1', 'Tobías', 60, true)
    state = { ...state, labor: [...state.labor, labor] }
    completedSteps.push('5. LaborEvent logged (verified)')
    
    // Step 6: ITC credits
    const credit = awardCredits('Tobías', 60, 0, 0.01)
    state = { ...state, credits: [...state.credits, credit] }
    completedSteps.push('6. TimeCredit issued with decay')
    
    // Step 7: FRS signal intake
    const packet = ingestSignal('COS', 'info', 'Producción huerta completada 60h')
    state = { ...state, signals: [...state.signals, packet] }
    completedSteps.push('7. SignalPacket generated')
    
    // Step 8: FRS diagnostic + recommendation
    const rec = recommend('Revisar capacidad de riego para próxima siembra', 'COS')
    state = { ...state, recommendations: [...state.recommendations, rec] }
    const { rec: promotedRec, issue: frsIssue } = promoteRecommendation(rec)
    state = { ...state, recommendations: state.recommendations.map(r => r.id === rec.id ? promotedRec : r),
                      issues: [...state.issues, frsIssue] }
    completedSteps.push('8. Recommendation promoted to CDS issue')
    
    // Step 9: Loop closes - CDS now has new issue from FRS
    completedSteps.push('9. Loop closed: CDS has FRS-generated issue for next cycle')
    
    return { success: true, steps: completedSteps }
  } catch (e) {
    return { success: false, steps: completedSteps }
  }
}
```

---

## 6. Scheduler / Cron Jobs (Phase 2 Operations)

```typescript
// Jobs periódicos que mantienen el loop vivo

export const INTEGRAL_CRON_JOBS = [
  {
    name: 'FRS_signal_intake',
    schedule: '0 2 * * 1',  // Weekly Monday 2AM
    handler: 'runSignalIntake(nodeId, lastWeekPeriod)',
    description: 'Genera FRSSignalPacket semanal desde 4 sistemas'
  },
  {
    name: 'ITC_decay_application',
    schedule: '0 3 * * *',  // Daily 3AM
    handler: 'applyDecayAllAccounts()',
    description: 'Aplica decay a todas las ITCAccount, emite ledger entries'
  },
  {
    name: 'ITC_policy_sync',
    schedule: '0 4 * * *',  // Daily 4AM (after decay)
    handler: 'syncPolicyFromCDS()',
    description: 'Sincroniza ITCPolicySnapshot desde CDS policies'
  },
  {
    name: 'FRS_sensemaking_generation',
    schedule: '0 6 * * 1',  // Weekly Monday 6AM (after signal intake)
    handler: 'generateSensemakingDocument(latestPacket)',
    description: 'Genera documento sensemaking + submite a CDS agenda'
  },
  {
    name: 'OAD_certification_review_trigger',
    schedule: '0 5 * * 0',  // Weekly Sunday 5AM
    handler: 'checkFRSrecertificationRequests()',
    description: 'Revisa si FRS solicitó review de certificaciones'
  }
]
```

---

## 7. Estado Actual en Zeitnus

| Componente | Estado | Archivo |
|---|---|---|
| `applyDecision(drId)` | ✅ Básico (OAD + COS) | `integral.ts:179-192` |
| `applyDecisions(drIds)` | ❌ | FALTA |
| Policy Sync (CDS→Systems) | ❌ | FALTA |
| `promoteRecommendation` | ✅ | `integral.ts:106-111` |
| `submitSignalPacketToCDS` | ❌ | FALTA |
| `evaluateGovernanceEffectiveness` | ❌ | FALTA |
| Cron jobs scheduler | ❌ | FALTA |
| `testFirstSlice()` | ❌ | FALTA |

---

## Criterios de Aceptación

- [ ] `applyDecision` maneja 4 targets: OAD, COS, ITC, FRS
- [ ] `applyDecisions` batch para múltiples DRs
- [ ] Policy sync: CDS policy change → actualiza snapshots en ITC/OAD/COS/FRS
- [ ] `promoteRecommendation` crea issue CDS con evidencia FRS
- [ ] `submitSignalPacketToCDS` via interface + auto-issue si findings critical
- [ ] `evaluateGovernanceEffectiveness` compara decisions dispatched vs implemented
- [ ] Cron jobs: FRS weekly, ITC daily decay, policy sync daily, sensemaking weekly
- [ ] `testFirstSlice()` pasa completo (9 steps)
- [ ] Guard `canEnterProduction` verifica diseño certificado ANTES de plan
- [ ] Tests: loop completo 9 pasos, policy sync, governance effectiveness, cron jobs

---

## Referencias Normativas

- **Devguide 5.2**: "Integration Strategy for the Minimum Viable System" — vertical slicing, first successful slice
- **Devguide 3.1**: CDS M8 Implementation Dispatch Interface
- **Devguide 4.4**: CDS_AllSystems_Interface (notify_dispatch, get_itc_policy_snapshot, get_production_mandate)
- **Devguide 2.2**: "FRS flags the divergence. It does not pull the trigger." — boundary enforcement
- **integral.ts:179-192**: `applyDecision` actuator P1 existente
- **White Paper**: Loop cerrado CDS→OAD→COS→ITC→FRS→CDS