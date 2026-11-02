// HSCSG v15 OS — Interfaces Inter-Sistema Integral (Devguide Sección 4.4)
// "Designing for seam points" — cada acceso cross-sistema via función de interfaz versionada
// Transición monolito → federado = deployment change, not rewrite

import type {
  // Base types
  NodeId, ParticipantId, DesignId, TaskId, ProductionPlanId, CoopId, EventId, PacketId, FindingId, RecommendationId, IssueId, DecisionRecordId, PolicyId, MandateId,
  TimePeriod, PaginationParams, InterfaceResult, PaginatedResult,
  // OAD types
  CertifiedDesign, DesignFilters, DesignIntelligence, DesignEvent, EcologicalAssessment, CertificationChangeEvent,
  // COS types
  LaborEvent, MaterialConsumptionEvent, OperationalSignalData, QAEvent,
  // ITC types
  ITCPeriodSummary, BalanceDistribution, AccountTimestamps, ITCLedgerEntry, ITCAdjustmentRequest, ITCCapacityFlag, ITCValuationSignal,
  // FRS types
  FRSSignalPacket, RecommendationStatus,
  // CDS types
  GovernanceSummary, DecisionDetail, PolicyRecord, ITCPolicySnapshot, EquivalenceBand, ProductionMandate, MandateConstraint, DispatchPacket, SuccessIndicator,
  // Common types
  SkillTier, EcologicalFlag, TargetSystem
} from '@core/state/integral'

// ============================================================================
// VERSION REGISTRY
// ============================================================================

export const INTERFACE_VERSIONS = {
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
} as const

export type InterfaceName = keyof typeof INTERFACE_VERSIONS

// ============================================================================
// BASE INTERFACE STRUCTURE
// ============================================================================

export interface VersionedInterface<T> {
  (): T
  version: string
}

// Helper para crear interfaz versionada
function v<T>(name: InterfaceName, impl: T): VersionedInterface<T> {
  const fn = () => impl
  fn.version = INTERFACE_VERSIONS[name]
  return fn
}

// ============================================================================
// 1. OAD → COS Interface
// ============================================================================

export const OAD_COS_v1_0 = v('OAD_COS', {
  async get_certified_design(designId: DesignId, version: string): Promise<InterfaceResult<CertifiedDesign>> {
    const { integral } = await import('@core/state/store').then(m => m.useAppStore.getState())
    const design = integral.designs.find(d => d.design_id === designId && d.version === version)
    return { success: !!design, data: design!, version: '1.0', timestamp: Date.now() }
  },

  async list_certified_designs(filters: DesignFilters, pagination?: PaginationParams): Promise<PaginatedResult<CertifiedDesign>> {
    const { integral } = await import('@core/state/store').then(m => m.useAppStore.getState())
    let results = integral.designs.filter(d => d.status === 'certified')
    
    if (filters.ecological_flag) results = results.filter(d => filters.ecological_flag!.includes(d.ecological_flag))
    if (filters.authored_by) results = results.filter(d => filters.authored_by!.some(a => d.authored_by.includes(a)))
    if (filters.node_id) results = results.filter(d => d.node_id === filters.node_id)
    if (filters.commons_visible !== undefined) results = results.filter(d => d.commons_visible === filters.commons_visible)
    if (filters.created_after) results = results.filter(d => d.created_at >= filters.created_after!)
    if (filters.created_before) results = results.filter(d => d.created_at <= filters.created_before!)
    
    const total = results.length
    const offset = pagination?.offset || 0
    const limit = pagination?.limit || 50
    const paginated = results.slice(offset, offset + limit)
    
    return { success: true, data: paginated, version: '1.0', timestamp: Date.now(), total, hasMore: offset + limit < total }
  }
})

// ============================================================================
// 2. OAD → ITC Interface
// ============================================================================

export const OAD_ITC_v1_0 = v('OAD_ITC', {
  async get_design_intelligence(designId: DesignId): Promise<InterfaceResult<DesignIntelligence>> {
    const { integral } = await import('@core/state/store').then(m => m.useAppStore.getState())
    const design = integral.designs.find(d => d.design_id === designId)
    if (!design) return { success: false, error: 'Design not found', version: '1.0', timestamp: Date.now() }
    
    const intelligence: DesignIntelligence = {
      design_id: design.design_id,
      version: design.version,
      labor_step_decomposition: design.production_steps.map(s => ({
        step_id: s.step_id,
        description: s.description,
        estimated_hours: s.estimated_hours,
        required_skill_tier: s.required_skill_tier,
        ecological_flag: s.ecological_flag,
        dependencies: s.dependencies
      })),
      skill_tier_requirements: Object.fromEntries(design.production_steps.map(s => [s.step_id, s.required_skill_tier])),
      material_intensity: design.bill_of_materials.map(m => ({
        material_id: m.material_id,
        quantity_per_unit: m.quantity,
        unit: m.unit,
        ecological_flag: m.ecological_flag,
        ecological_impact_index: m.ecological_impact_index
      })),
      ecological_coefficients: design.ecological_detail || {
        embodied_energy: 0, carbon_intensity: 0, toxicity: 0, recyclability: 0, water_use: 0, land_use: 0, repairability: 0
      },
      lifecycle_assumptions: design.lifecycle_detail || {
        expected_lifetime_years: 0, maintenance_interval_days: 0, maintenance_labor_hours_per_interval: 0,
        disassembly_hours: 0, dominant_failure_modes: [], lifecycle_burden_index: 0
      },
      itc_access_cost: design.itc_access_cost,
      itc_access_cost_method: design.itc_access_cost_method,
      certified_at: design.certified_at,
      certified_by: design.certified_by
    }
    return { success: true, data: intelligence, version: '1.0', timestamp: Date.now() }
  },

  async list_deployable_designs(nodeId: NodeId): Promise<InterfaceResult<DesignIntelligence[]>> {
    const { integral } = await import('@core/state/store').then(m => m.useAppStore.getState())
    const designs = integral.designs.filter(d => d.node_id === nodeId && d.status === 'certified')
    const intelligence = designs.map(d => {
      // reuse get_design_intelligence logic
      return {
        design_id: d.design_id, version: d.version,
        labor_step_decomposition: d.production_steps.map(s => ({
          step_id: s.step_id, description: s.description, estimated_hours: s.estimated_hours,
          required_skill_tier: s.required_skill_tier, ecological_flag: s.ecological_flag, dependencies: s.dependencies
        })),
        skill_tier_requirements: Object.fromEntries(d.production_steps.map(s => [s.step_id, s.required_skill_tier])),
        material_intensity: d.bill_of_materials.map(m => ({
          material_id: m.material_id, quantity_per_unit: m.quantity, unit: m.unit,
          ecological_flag: m.ecological_flag, ecological_impact_index: m.ecological_impact_index
        })),
        ecological_coefficients: d.ecological_detail || { embodied_energy: 0, carbon_intensity: 0, toxicity: 0, recyclability: 0, water_use: 0, land_use: 0, repairability: 0 },
        lifecycle_assumptions: d.lifecycle_detail || { expected_lifetime_years: 0, maintenance_interval_days: 0, maintenance_labor_hours_per_interval: 0, disassembly_hours: 0, dominant_failure_modes: [], lifecycle_burden_index: 0 },
        itc_access_cost: d.itc_access_cost, itc_access_cost_method: d.itc_access_cost_method,
        certified_at: d.certified_at, certified_by: d.certified_by
      }
    })
    return { success: true, data: intelligence, version: '1.0', timestamp: Date.now() }
  }
})

// ============================================================================
// 3. OAD → FRS Interface
// ============================================================================

export const OAD_FRS_v1_0 = v('OAD_FRS', {
  async get_design_events(nodeId: NodeId, period: TimePeriod): Promise<InterfaceResult<DesignEvent[]>> {
    const { integral } = await import('@core/state/store').then(m => m.useAppStore.getState())
    const events: DesignEvent[] = []
    
    for (const design of integral.designs.filter(d => d.node_id === nodeId)) {
      if (design.created_at >= period.start && design.created_at <= period.end) {
        events.push({ event_id: `evt_${design.design_id}_submitted`, design_id: design.design_id, version: design.version, event_type: 'submitted', timestamp: design.created_at, actor: design.authored_by[0] })
      }
      if (design.certified_at && design.certified_at >= period.start && design.certified_at <= period.end) {
        events.push({ event_id: `evt_${design.design_id}_certified`, design_id: design.design_id, version: design.version, event_type: 'certified', timestamp: design.certified_at, actor: design.certified_by[0] })
      }
      if (design.superseded_by) {
        events.push({ event_id: `evt_${design.design_id}_superseded`, design_id: design.design_id, version: design.version, event_type: 'superseded', timestamp: Date.now(), actor: 'system' })
      }
    }
    return { success: true, data: events, version: '1.0', timestamp: Date.now() }
  },

  async get_ecological_assessments(nodeId: NodeId, period: TimePeriod): Promise<InterfaceResult<EcologicalAssessment[]>> {
    const { integral } = await import('@core/state/store').then(m => m.useAppStore.getState())
    const assessments = integral.eco_assessments.filter(a => a.assessed_at >= period.start && a.assessed_at <= period.end)
    return { success: true, data: assessments.map(a => ({
      design_id: a.design_id, version: a.version, ecological_flag: a.overall_impact_rating,
      ecological_notes: `${a.materials_required} | ${a.ecologically_sensitive_materials} | ${a.estimated_end_of_life_pathway}`,
      ecological_detail: a.ecological_detail, assessed_by: a.assessed_by, assessed_at: a.assessed_at
    })), version: '1.0', timestamp: Date.now() }
  },

  async get_certification_changes(nodeId: NodeId, period: TimePeriod): Promise<InterfaceResult<CertificationChangeEvent[]>> {
    const { integral } = await import('@core/state/store').then(m => m.useAppStore.getState())
    const changes = integral.certification_panels.filter(p => p.completed_at && p.completed_at >= period.start && p.completed_at <= period.end)
    return { success: true, data: changes.map(p => ({
      design_id: p.design_id, version: p.version, change_type: p.certified ? 'certified' : 'revoked',
      reason: p.notes, panel_members: p.members, frs_finding_ref: null, timestamp: p.completed_at!
    })), version: '1.0', timestamp: Date.now() }
  }
})

// ============================================================================
// 4. FRS → OAD Interface (CRITICAL BOUNDARY: does NOT halt production)
// ============================================================================

export const FRS_OAD_v1_0 = v('FRS_OAD', {
  async submit_coefficient_recalibration(evidence_ref: FindingId, design_id: DesignId, new_coefficients: Partial<any>): Promise<InterfaceResult<{ recalibration_id: string }>> {
    const { integral } = await import('@core/state/store').then(m => m.useAppStore.getState())
    const design = integral.designs.find(d => d.design_id === design_id)
    if (!design) return { success: false, error: 'Design not found', version: '1.0', timestamp: Date.now() }
    
    // Update ecological_detail with new coefficients (non-destructive merge)
    const updatedDetail = { ...design.ecological_detail, ...new_coefficients }
    // In real impl: emit event to OAD for review, NOT auto-apply
    const recalibration_id = `recal_${Date.now()}`
    return { success: true, data: { recalibration_id }, version: '1.0', timestamp: Date.now() }
  },

  async submit_lifecycle_revision(evidence_ref: FindingId, design_id: DesignId, new_lifecycle: Partial<any>): Promise<InterfaceResult<{ revision_id: string }>> {
    const revision_id = `rev_${Date.now()}`
    return { success: true, data: { revision_id }, version: '1.0', timestamp: Date.now() }
  },

  async submit_certification_review_request(evidence_ref: FindingId, design_id: DesignId, reason: string): Promise<InterfaceResult<{ review_request_id: string }>> {
    // CRITICAL: Does NOT halt production - only flags to OAD/CDS
    const review_request_id = `review_${Date.now()}`
    // In real impl: create CDS issue + notify OAD panel
    return { success: true, data: { review_request_id }, version: '1.0', timestamp: Date.now() }
  }
})

// ============================================================================
// 5. COS → ITC Interface
// ============================================================================

export const COS_ITC_v1_0 = v('COS_ITC', {
  async get_labor_events(nodeId: NodeId, period: TimePeriod): Promise<InterfaceResult<LaborEvent[]>> {
    const { integral } = await import('@core/state/store').then(m => m.useAppStore.getState())
    const events = integral.labor_events.filter(e => e.node_id === nodeId && e.timestamp >= period.start && e.timestamp <= period.end)
    return { success: true, data: events, version: '1.0', timestamp: Date.now() }
  },

  async get_material_events(nodeId: NodeId, period: TimePeriod): Promise<InterfaceResult<MaterialConsumptionEvent[]>> {
    const { integral } = await import('@core/state/store').then(m => m.useAppStore.getState())
    const events = integral.material_consumption.filter(e => e.node_id === nodeId && e.timestamp >= period.start && e.timestamp <= period.end)
    return { success: true, data: events, version: '1.0', timestamp: Date.now() }
  }
})

// ============================================================================
// 6. COS → FRS Interface
// ============================================================================

export const COS_FRS_v1_0 = v('COS_FRS', {
  async get_operational_signal(nodeId: NodeId, period: TimePeriod): Promise<InterfaceResult<OperationalSignalData>> {
    const { integral } = await import('@core/state/store').then(m => m.useAppStore.getState())
    const labor = integral.labor_events.filter(e => e.node_id === nodeId && e.timestamp >= period.start && e.timestamp <= period.end)
    const materials = integral.material_consumption.filter(e => e.node_id === nodeId && e.timestamp >= period.start && e.timestamp <= period.end)
    const qa = integral.qa_events.filter(e => e.inspected_at >= period.start && e.inspected_at <= period.end)
    const tasks = integral.tasks.filter(t => t.node_id === nodeId)
    
    return {
      success: true,
      data: {
        labor_events: labor,
        material_events: materials,
        throughput_rates: tasks.map(t => ({
          task_id: t.task_id, design_id: t.design_step_ref, planned_hours: t.estimated_hours,
          actual_hours: t.actual_hours || 0, rate: t.actual_hours ? t.actual_hours / t.estimated_hours : 0
        })),
        bottlenecks: tasks.filter(t => t.status === 'blocked').map(t => ({
          task_id: t.task_id, description: `Task ${t.task_id} blocked`, severity: 'high', detected_at: Date.now(), estimated_resolution: null
        })),
        maintenance_cycles: [], // TODO
        qa_outcomes: qa,
        deviations_from_plan: tasks.filter(t => t.actual_hours && t.actual_hours > t.estimated_hours * 1.2).map(t => ({
          production_plan_id: t.plan_id, task_id: t.task_id, deviation_type: 'hours_overrun',
          magnitude: (t.actual_hours! / t.estimated_hours) - 1, description: `Overrun ${t.actual_hours}h vs ${t.estimated_hours}h`
        }))
      },
      version: '1.0', timestamp: Date.now()
    }
  },

  async get_qa_events(nodeId: NodeId, period: TimePeriod): Promise<InterfaceResult<QAEvent[]>> {
    const { integral } = await import('@core/state/store').then(m => m.useAppStore.getState())
    const events = integral.qa_events.filter(e => e.inspected_at >= period.start && e.inspected_at <= period.end)
    return { success: true, data: events, version: '1.0', timestamp: Date.now() }
  }
})

// ============================================================================
// 7. ITC → FRS Interface
// ============================================================================

export const ITC_FRS_v1_0 = v('ITC_FRS', {
  async get_credit_summary(nodeId: NodeId, period: TimePeriod): Promise<InterfaceResult<ITCPeriodSummary>> {
    const { integral } = await import('@core/state/store').then(m => m.useAppStore.getState())
    const accounts = Array.from(integral.accounts.values()).filter(a => a.node_id === nodeId)
    const ledgerEntries = integral.ledger.filter(e => e.node_id === nodeId && e.timestamp >= period.start && e.timestamp <= period.end)
    
    return {
      success: true,
      data: {
        total_credits_issued: ledgerEntries.filter(e => e.entry_type === 'itc_credited').reduce((s, e) => s + e.amount, 0),
        total_decay_applied: ledgerEntries.filter(e => e.entry_type === 'itc_decayed').reduce((s, e) => s + Math.abs(e.amount), 0),
        total_access_extinguished: ledgerEntries.filter(e => e.entry_type === 'access_redeemed').reduce((s, e) => s + Math.abs(e.amount), 0),
        active_participant_count: accounts.filter(a => a.balance > 0).length,
        balance_distribution: calculateBalanceDistribution(accounts),
        need_adjustments_active: accounts.filter(a => a.need_adjustment_active).length,
        accounts_timestamps: accounts.map(a => ({
          participant_id: a.participant_id,
          last_contribution_at: a.last_contribution_at,
          last_access_at: a.last_access_at,
          last_decay_applied_at: a.last_decay_applied_at
        }))
      },
      version: '1.0', timestamp: Date.now()
    }
  },

  async get_ledger_entries(nodeId: NodeId, period: TimePeriod): Promise<InterfaceResult<ITCLedgerEntry[]>> {
    const { integral } = await import('@core/state/store').then(m => m.useAppStore.getState())
    const entries = integral.ledger.filter(e => e.node_id === nodeId && e.timestamp >= period.start && e.timestamp <= period.end)
    return { success: true, data: entries, version: '1.0', timestamp: Date.now() }
  },

  async get_balance_distribution(nodeId: NodeId): Promise<InterfaceResult<BalanceDistribution>> {
    const { integral } = await import('@core/state/store').then(m => m.useAppStore.getState())
    const accounts = Array.from(integral.accounts.values()).filter(a => a.node_id === nodeId)
    return { success: true, data: calculateBalanceDistribution(accounts), version: '1.0', timestamp: Date.now() }
  }
})

function calculateBalanceDistribution(accounts: any[]): BalanceDistribution {
  const balances = accounts.map(a => a.balance).sort((a, b) => a - b)
  if (balances.length === 0) return { mean: 0, median: 0, std_dev: 0, min: 0, max: 0, percentiles: { p10: 0, p25: 0, p50: 0, p75: 0, p90: 0, p99: 0 }, gini_coefficient: 0 }
  const mean = balances.reduce((a, b) => a + b, 0) / balances.length
  const median = balances[Math.floor(balances.length / 2)]
  const variance = balances.reduce((s, b) => s + Math.pow(b - mean, 2), 0) / balances.length
  const min = balances[0], max = balances[balances.length - 1]
  const p = (pct: number) => balances[Math.floor(balances.length * pct / 100)]
  const gini = balances.reduce((s, b, i) => s + (2 * i - balances.length + 1) * b, 0) / (balances.length * mean) || 0
  return { mean, median, std_dev: Math.sqrt(variance), min, max, percentiles: { p10: p(10), p25: p(25), p50: p(50), p75: p(75), p90: p(90), p99: p(99) }, gini_coefficient: gini }
}

// ============================================================================
// 8. ITC → CDS Interface
// ============================================================================

export const ITC_CDS_v1_0 = v('ITC_CDS', {
  async submit_adjustment_request(request: ITCAdjustmentRequest): Promise<InterfaceResult<{ request_id: string }>> {
    return { success: true, data: { request_id: request.request_id }, version: '1.0', timestamp: Date.now() }
  },
  async submit_capacity_flag(flag: ITCCapacityFlag): Promise<InterfaceResult<{ flag_id: string }>> {
    return { success: true, data: { flag_id: flag.flag_id }, version: '1.0', timestamp: Date.now() }
  }
})

// ============================================================================
// 9. ITC → COS Interface
// ============================================================================

export const ITC_COS_v1_0 = v('ITC_COS', {
  async submit_valuation_signal(signal: ITCValuationSignal): Promise<InterfaceResult<{ signal_id: string }>> {
    return { success: true, data: { signal_id: `val_${Date.now()}` }, version: '1.0', timestamp: Date.now() }
  }
})

// ============================================================================
// 10. FRS → CDS Interface
// ============================================================================

export const FRS_CDS_v1_0 = v('FRS_CDS', {
  async submit_signal_packet(packet: FRSSignalPacket): Promise<InterfaceResult<{ issue_ref: IssueId }>> {
    const { integral, raiseIntegralIssueWithEvidence } = await import('@core/state/store').then(m => m.useAppStore.getState())
    
    // Auto-create issue for critical findings
    const criticalFindings = packet.findings.filter(f => f.severity === 'critical' || f.requires_cds)
    let issueRef: IssueId | null = null
    
    if (criticalFindings.length > 0) {
      const issue = raiseIntegralIssueWithEvidence(
        `[FRS Signal Packet] ${criticalFindings.length} critical findings requiring governance`,
        'FRS',
        criticalFindings.map(f => ({ kind: 'aut.observation' as any, detail: f.summary, sourceUrl: undefined }))
      )
      issueRef = issue.id
      packet.cds_submission_ref = issueRef
    }
    
    return { success: true, data: { issue_ref: issueRef! }, version: '1.0', timestamp: Date.now() }
  },

  async get_recommendation_status(recommendationId: RecommendationId): Promise<InterfaceResult<RecommendationStatus>> {
    const { integral } = await import('@core/state/store').then(m => m.useAppStore.getState())
    const rec = integral.recommendations.find(r => r.id === recommendationId)
    return { success: !!rec, data: rec ? { recommendation_id: rec.id, status: rec.promotedToIssue ? 'accepted_as_issue' : 'pending', issue_ref: rec.promotedToIssue ? 'TBD' : null, acted_upon_by: null, acted_upon_at: null } : undefined, version: '1.0', timestamp: Date.now() }
  }
})

// ============================================================================
// 11. CDS → FRS Interface
// ============================================================================

export const CDS_FRS_v1_0 = v('CDS_FRS', {
  async get_governance_summary(nodeId: NodeId, period: TimePeriod): Promise<InterfaceResult<GovernanceSummary>> {
    const { integral } = await import('@core/state/store').then(m => m.useAppStore.getState())
    const decisions = integral.decisions.filter(d => d.ratified_at >= period.start && d.ratified_at <= period.end)
    const dispatched = decisions.filter(d => d.dispatched)
    
    return {
      success: true,
      data: {
        decisions_dispatched: dispatched.length,
        policies_updated: decisions.filter(d => d.context.toLowerCase().includes('policy')).length,
        open_governance_issues: integral.issues.filter(i => i.status === 'open' || i.status === 'deliberating').length,
        decision_records_merged: decisions.length,
        decisions_detail: dispatched.map(d => ({
          dr_id: d.id, decision: d.decision, context: d.context, target_system: inferTargetSystem(d.context),
          dispatched_at: d.dispatched_at!, status: d.status, implemented_at: d.implemented_at
        }))
      },
      version: '1.0', timestamp: Date.now()
    }
  }
})

function inferTargetSystem(context: string): TargetSystem {
  const ctx = context.toLowerCase()
  if (ctx.includes('oad') || ctx.includes('design')) return 'OAD'
  if (ctx.includes('cos') || ctx.includes('labor') || ctx.includes('production')) return 'COS'
  if (ctx.includes('itc') || ctx.includes('credit')) return 'ITC'
  if (ctx.includes('frs') || ctx.includes('monitor')) return 'FRS'
  return 'CDS'
}

// ============================================================================
// 12. CDS → All Systems: Policy and Mandate Interface
// ============================================================================

export const CDS_AllSystems_v1_0 = v('CDS_AllSystems', {
  async get_active_policies(system: TargetSystem, nodeId: NodeId): Promise<InterfaceResult<PolicyRecord[]>> {
    const { integral } = await import('@core/state/store').then(m => m.useAppStore.getState())
    // In real impl: fetch from CDS policy store
    return { success: true, data: [], version: '1.0', timestamp: Date.now() }
  },

  async get_itc_policy_snapshot(nodeId: NodeId): Promise<InterfaceResult<ITCPolicySnapshot>> {
    const { integral } = await import('@core/state/store').then(m => m.useAppStore.getState())
    return { success: true, data: integral.policy_snapshot!, version: '1.0', timestamp: Date.now() }
  },

  async get_production_mandate(mandateId: MandateId): Promise<InterfaceResult<ProductionMandate>> {
    const { integral } = await import('@core/state/store').then(m => m.useAppStore.getState())
    const dr = integral.decisions.find(d => d.id === mandateId)
    if (!dr) return { success: false, error: 'Mandate not found', version: '1.0', timestamp: Date.now() }
    
    const mandate: ProductionMandate = {
      mandate_id: dr.id, design_id: '', design_version: '', quantity: 1, priority: 'medium',
      authorized_by: dr.id, constraints: [], issued_at: dr.ratified_at, expires_at: null
    }
    return { success: true, data: mandate, version: '1.0', timestamp: Date.now() }
  },

  async notify_dispatch(dispatchPacket: DispatchPacket): Promise<InterfaceResult<{ ack_id: string }>> {
    const { integral, raiseIntegralIssueWithEvidence } = await import('@core/state/store').then(m => m.useAppStore.getState())
    // Store dispatch packet
    return { success: true, data: { ack_id: `ack_${dispatchPacket.dispatch_id}` }, version: '1.0', timestamp: Date.now() }
  }
})

// ============================================================================
// REGISTRY & ACCESS HELPER
// ============================================================================

export const integralInterfaces = {
  'OAD_COS_v1.0': OAD_COS_v1_0,
  'OAD_ITC_v1.0': OAD_ITC_v1_0,
  'OAD_FRS_v1.0': OAD_FRS_v1_0,
  'FRS_OAD_v1.0': FRS_OAD_v1_0,
  'COS_ITC_v1.0': COS_ITC_v1_0,
  'COS_FRS_v1.0': COS_FRS_v1_0,
  'ITC_FRS_v1.0': ITC_FRS_v1_0,
  'ITC_CDS_v1.0': ITC_CDS_v1_0,
  'ITC_COS_v1.0': ITC_COS_v1_0,
  'FRS_CDS_v1.0': FRS_CDS_v1_0,
  'CDS_FRS_v1.0': CDS_FRS_v1_0,
  'CDS_AllSystems_v1.0': CDS_AllSystems_v1_0
}

export function getInterface<T>(name: InterfaceName): VersionedInterface<T> {
  const key = `${name}_v${INTERFACE_VERSIONS[name]}` as keyof typeof integralInterfaces
  return integralInterfaces[key] as VersionedInterface<T>
}

// Version check helper
export function checkInterfaceVersion(name: InterfaceName, requiredVersion: string): boolean {
  return INTERFACE_VERSIONS[name] === requiredVersion
}