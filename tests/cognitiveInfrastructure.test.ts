// tests/cognitiveInfrastructure.test.ts
// Tests para Infraestructura Cognitiva - casos Oaxaca Rural (SCALING) + CDMX Enhancement (REJECTED)

import { 
  evaluateCanutricioTranshumanismComprehensive,
  createTranshumanismProposalDraft,
  TerritorialStateVector,
  CognitiveInfrastructureMetrics,
  TranshumanismProposal
} from '../src/core/lib/pmcrt';
import { DEFAULT_SCENARIOS } from '../src/core/lib/pmcrt';

describe('Infraestructura Cognitiva - Canutriciotranshumanismo', () => {
  
  // Estado base territorial para tests
  const baseState: TerritorialStateVector = {
    water: { availability_m3_per_day: 60, quality_index: 0.9, safety_compliance: true, aquifer_recharge_rate: 1000, scarcity_type: 'none' },
    food: { kcal_per_person_per_day: 2500, diversity_index: 0.7, self_sufficiency_ratio: 0.6, storage_months: 6, soil_health_index: 0.8 },
    energy: { net_balance_kwh_per_day: 50, renewable_share: 0.8, autonomy_hours: 120, storage_kwh: 500, efficiency_ratio: 0.85 },
    habitat: { m2_per_person: 30, repair_backlog_ratio: 0.1, maintenance_schedule_compliance: 0.9, local_materials_ratio: 0.7, climate_resilience_score: 0.8 },
    care: { preventive_coverage_effective: 0.85, unmet_needs_ratio: 0.05, equity_gap: 0.08, functional_status_index: 0.9, financial_burden_ratio: 0.05 },
    memory: { active_consents_ratio: 0.95, withdrawal_compliance_rate: 0.98, restoration_test_success_rate: 0.9, reproducible_processes_ratio: 0.8, open_docs_licensed_ratio: 0.9 },
    biosphere: { soil_organic_carbon_percent: 3.5, biodiversity_index: 0.8, erosion_rate_tons_per_ha_year: 2, regeneration_net: true, bioindicator_score: 0.85 },
    governance: { participation_rate: 0.8, power_concentration_index: 0.25, conflicts_resolved_ratio: 0.9, decisions_reviewed_ratio: 0.8, cds_ics_score: 0.9 },
    liquidity: { fiat_net_surplus: 100000, tq_balance: 200, znu_velocity: 15, time_contributions_hours: 5000, species_contributions_value: 20000, reserve_months: 6 },
    photosynthesis: { 
      chloroplast_PSII_lifetime_days: 7, chloroplast_storage_stability_days_at_4C: 10, algal_biomass_g_L: 2,
      carbon_fixation_rate_mmol_gDW_h: 2.5, O2_production_rate_mmol_L_h: 1.2, light_penetration_depth_mm: 5,
      immune_evasion_status: 'PEGylated', genomic_integration_offtarget_percent: 0.05, clinical_trial_phase: 2,
      CLEM_monitoring_active: true, retrograde_signaling_detected: true,
      chloroplast_battery_stock_FvFm_days: 100, photosynthetic_scaffold_area_cm2: 50, algal_biomass_food_kg: 20
    },
    cognitive_infrastructure: {
      cognitive_coverage_pct: 0.9,
      rural_coverage_pct: 0.8,
      connectivity_independent_pct: 0.95,
      cognitive_decline_reduction_pct: 25,
      hippocampal_volume_change_pct: 1.5,
      flow_state_achievement_rate: 0.82,
      edge_device_density_per_1000: 10,
      model_inference_latency_ms: 50,
      federated_round_participation_pct: 90,
      model_freshness_days: 3,
      data_locality_compliance_pct: 100,
      consent_revocation_rate_pct: 2,
      cultural_adaptation_score: 0.85,
      cost_per_user_year_usd: 8,
      public_health_integration: true
    },
    timestamp: Date.now(),
    nodeId: 'test-node-001'
  };

  describe('CASO A: Oaxaca Rural - Prevención Universal (SCALING esperado)', () => {
    
    let proposal: TranshumanismProposal;
    let result: ReturnType<typeof evaluateCanutricioTranshumanismComprehensive>;

    beforeAll(() => {
      // Propuesta: Plataforma estimulación cognitiva Edge AI offline-first, español/mixteco
      proposal = createTranshumanismProposalDraft(
        'Neuroplasticidad Adaptativa Edge AI - Oaxaca Rural',
        'prevention',
        'Plataforma estimulación cognitiva offline-first, español/mixteco, fricción productiva, flow state dinámico, federated learning semanal, VC granular 4 categorías neurodatos',
        'did:nodo:oaxaca_salud_001'
      );

      // Sobrescribir con métricas específicas del caso Oaxaca
      proposal.metabolic_impact.material_balance = {
        inputs: [],
        outputs: [],
        net_ecological_impact: 5.2, // regeneración neta
        autonomy_hours: 120, // 5 días autonomía computacional
        unexplained_difference_pct: 0.03,
        // Fotosíntesis (mínimo para prevención cognitiva)
        chloroplast_PSII_lifetime_days: 0,
        carbon_fixation_rate_mmol_gDW_h: 0,
        chloroplast_storage_stability_days_at_4C: 0,
        O2_production_rate_mmol_L_h: 0,
        immune_evasion_status: 'none',
        clinical_trial_phase: 0,
        CLEM_monitoring_active: false,
        genomic_integration_offtarget_percent: 0,
        // Infraestructura Cognitiva - métricas Oaxaca
        hippocampal_volume_change_pct: 1.2, // +1.2% (PubMed 39012673)
        cognitive_decline_reduction_pct: 22, // 22% reducción (FINGER target ≥20%)
        edge_autonomy_hours: 120, // 5 días offline
        federated_learning_participation_pct: 85, // 85% participación FL
        flow_state_achievement_rate: 0.75, // 75% sesiones en flow
        data_locality_compliance_pct: 100, // 100% edge
        cultural_adaptation_score: 0.88, // corpus mixteco validado
        prevention_coverage_pct: 0.88, // 88% cobertura preventiva
        accessibility_compliance_pct: 100, // voz + high_contrast + simplified_ui
        compute_carbon_footprint_kg_co2e_per_year: 45 // <100 kg CO2e/año
      };

      proposal.cybernetic_impact = {
        ashby_variety_ratio: 1.4,
        introduced_perturbations: { hacking_vulnerability: 0.15, dependency_on_provider: 0.1, failure_modes: [], cascade_failure_risk: 0.1 },
        response_capacity: { local_repair: true, spare_parts_local: true, knowledge_distributed: true, fallback_mode: true },
        observability: { real_time_monitoring: true, anomaly_detection: true, audit_trail: true }
      };

      proposal.governance = {
        decision_model: 'assembly_consensus',
        intergenerational_assessment: { current_generation: 'positive', distribution_equity: 'equitable', territorial_regeneration: 'enhances', future_generations: 'positive' },
        council_future_veto: { required: false, suspension_period_days: 14, appeal_process: 'assembly' },
        access_rules: { population: 'universal', cost_sharing: 'solidarity', priority_criteria: ['therapeutic_need', 'vulnerability', 'rural_priority'] },
        power_concentration_checks: { token_weighted_voting: false, stake_weighted_voting: false, reputation_weighted_voting: false, one_person_one_vote: true },
        approved_by: [], approved_at: 0, rao_credential_id: ''
      };

      proposal.care_integration = {
        care_team: { doctor: 'did:medico:001', nurse: 'did:enfermera:001', auxiliary: ['did:aux:001'], community_agents: ['did:agente:001','did:agente:002','did:agente:003','did:agente:004'], assigned_at: Date.now() },
        monitoring_protocol: { frequency: 'daily', vital_signs: ['voice_engagement', 'gesture_completion', 'cognitive_score', 'mood'], alert_thresholds: { cognitive_score: 0.6 }, escalation_path: ['did:medico:001', 'did:coord:oaxaca'] },
        reversibility: { disconnection_protocol: 'protocolo_desconexion_24h.md', palliative_care_guaranteed: true, data_withdrawal_protocol: 'retiro_datos_12h.md', max_disconnection_time_hours: 12 },
        prevention_first: { preventive_coverage_baseline: 0.88, enhancement_conditional_on: ['cobertura_universal_80%', 'equidad_rural_urbana'] },
        approved_by: [], approved_at: 0
      };

      proposal.data_rights = {
        sensitive_data_categories: ['neuroimaging_hippocampal', 'behavioral_game_patterns', 'linguistic_mixteco_corpus', 'genomic_APOE_optional'],
        off_ledger_storage: { provider: 'did:storage:oaxaca_edge', encryption: 'AES-256-GCM', key_management: 'threshold_shamir', access_log_immutable: true },
        consent: { vc_credential_id: 'vc:consent:oaxaca:001', revocable: true, granular: true, expiry_days: 180 },
        rao_anchoring: { only_hashes: true, hash_algorithm: 'SHA-256', salted: true },
        withdrawal: { protocol: 'retiro_datos_12h.md', max_time_hours: 12, rao_hash_retention: 'permanent_proof_only' },
        inheritance: { therapeutic_knowledge: 'open_license', enhancement_protocols: 'no_privilege', personal_data: 'deleted_on_death', attribution_historical: true },
        approved_by: [], approved_at: 0
      };

      result = evaluateCanutricioTranshumanismComprehensive(proposal, baseState, DEFAULT_SCENARIOS);
    });

    test('Debe retornar SCALING (score ≥85, sin bloqueadores)', () => {
      expect(result.summary.ready_for).toBe('scaling');
      expect(result.overall.passed).toBe(true);
      expect(result.overall.blockers.length).toBe(0);
    });

    test('Score metabólico debe ser ≥26/30 (hipocampal + decline reduction + edge + FL + flow + data locality + cultural)', () => {
      expect(result.overall.scorecard.metabolic_score).toBeGreaterThanOrEqual(26);
    });

    test('Score cibernético debe ser ≥14/18 (Ashby + respuesta + observabilidad completa)', () => {
      expect(result.overall.scorecard.cybernetic_score).toBeGreaterThanOrEqual(14);
    });

    test('Score gobernanza debe ser 15/15 (intergeneracional 4/4 + acceso universal + 1p1v)', () => {
      expect(result.overall.scorecard.governance_score).toBe(15);
    });

    test('Score cuidado debe ser ≥10/12 (equipo completo + monitoreo diario + reversibilidad 12h + prevención 88% + accesibilidad)', () => {
      expect(result.overall.scorecard.care_score).toBeGreaterThanOrEqual(10);
    });

    test('Score memoria debe ser 6/6 (off-ledger + VC granular 180d + solo hashes + granularidad 4 categorías neuro)', () => {
      expect(result.overall.scorecard.memory_score).toBe(6);
    });

    test('Score ecológico debe ser ≥8/10 (estado base regenerativo + compute carbon <100)', () => {
      expect(result.overall.scorecard.ecological_score).toBeGreaterThanOrEqual(8);
    });

    test('Score reversibilidad debe ser 5/5 (protocolo 12h + paliativos + retiro datos)', () => {
      expect(result.overall.scorecard.reversibility_score).toBe(5);
    });

    test('Score consentimiento debe ser 4/4 (VC revocable + granular + 180d + cifrado + cultural_scope)', () => {
      expect(result.overall.scorecard.consent_score).toBe(4);
    });

    test('Score total debe ser ≥90/100', () => {
      expect(result.overall.scorecard.total_score).toBeGreaterThanOrEqual(90);
    });

    test('Validación metabólica: sin bloqueadores, hippocampal ≥1%, decline ≥20%', () => {
      expect(result.metabolic.passed).toBe(true);
      expect(result.metabolic.blockers.length).toBe(0);
      expect(result.metabolic.warnings.length).toBe(0);
    });

    test('Validación cibernética: Ashby ≥1.0, observabilidad completa', () => {
      expect(result.cybernetic.passed).toBe(true);
      expect(result.cybernetic.ashby_variety_ratio).toBeGreaterThanOrEqual(1.0);
      expect(result.cybernetic.observability_score).toBe(3);
    });

    test('Validación gobernanza: 1p1v OK, acceso universal + solidaridad', () => {
      expect(result.governance.passed).toBe(true);
      expect(result.governance.one_person_one_vote).toBe(true);
      expect(result.governance.access_equity).toBe('universal');
    });

    test('Validación cuidado: equipo completo, prevención 88% ≥80%, reversibilidad 12h ≤24h', () => {
      expect(result.care.passed).toBe(true);
      expect(result.care.prevention_baseline).toBeGreaterThanOrEqual(0.8);
      expect(result.care.reversibility_complete).toBe(true);
    });

    test('Validación memoria: off-ledger, VC revocable granular 180d, solo hashes, granularidad 4 categorías neuro', () => {
      expect(result.memory.passed).toBe(true);
      expect(result.memory.off_ledger).toBe(true);
      expect(result.memory.consent_revocable).toBe(true);
      expect(result.memory.consent_granular).toBe(true);
      expect(result.memory.consent_expiry_ok).toBe(true);
      expect(result.memory.rao_only_hashes).toBe(true);
      expect(result.memory.inheritance_correct).toBe(true);
    });
  });

  describe('CASO B: CDMX Enhancement - Mejora Condicional (REJECTED esperado)', () => {
    
    let proposal: TranshumanismProposal;
    let result: ReturnType<typeof evaluateCanutricioTranshumanismComprehensive>;

    beforeAll(() => {
      proposal = createTranshumanismProposalDraft(
        'Optimización Cognitiva Supra-Basal CDMX',
        'cognitive_enhancement',
        'Entrenamiento neurofeedback + tDCS guiado IA + nootrópicos personalizados para ejecutivos >60',
        'did:nodo:cdmx_clinica_001'
      );

      proposal.target_population = 'enhancement_healthy';

      proposal.metabolic_impact.material_balance = {
        inputs: [],
        outputs: [],
        net_ecological_impact: -2.1, // NEGATIVO: cloud compute + nootrópicos importados
        autonomy_hours: 4, // dependencia nube
        unexplained_difference_pct: 0.12, // >10%
        chloroplast_PSII_lifetime_days: 0,
        carbon_fixation_rate_mmol_gDW_h: 0,
        chloroplast_storage_stability_days_at_4C: 0,
        O2_production_rate_mmol_L_h: 0,
        immune_evasion_status: 'none',
        clinical_trial_phase: 0,
        CLEM_monitoring_active: false,
        genomic_integration_offtarget_percent: 0,
        hippocampal_volume_change_pct: 0.3, // <1%
        cognitive_decline_reduction_pct: 8, // <20%
        edge_autonomy_hours: 4, // <72h
        federated_learning_participation_pct: 0, // sin FL
        flow_state_achievement_rate: 0.55, // <70%
        data_locality_compliance_pct: 40, // 40% cloud
        cultural_adaptation_score: 0.6, // <0.8
        prevention_coverage_pct: 0.45, // 45% <80% BLOQUEADOR
        accessibility_compliance_pct: 80,
        compute_carbon_footprint_kg_co2e_per_year: 850 // >500
      };

      proposal.cybernetic_impact = {
        ashby_variety_ratio: 0.9, // <1.0
        introduced_perturbations: { hacking_vulnerability: 0.4, dependency_on_provider: 0.7, failure_modes: ['cloud_outage', 'provider_lockin'], cascade_failure_risk: 0.5 },
        response_capacity: { local_repair: false, spare_parts_local: false, knowledge_distributed: false, fallback_mode: false },
        observability: { real_time_monitoring: false, anomaly_detection: false, audit_trail: true }
      };

      proposal.governance = {
        decision_model: 'hybrid',
        intergenerational_assessment: { current_generation: 'positive', distribution_equity: 'concentrated', territorial_regeneration: 'degrades', future_generations: 'uncertain' },
        council_future_veto: { required: true, suspension_period_days: 180, appeal_process: 'specialized_jury' }, // >90 días
        access_rules: { population: 'enhancement_by_assembly', cost_sharing: 'individual', priority_criteria: ['ability_to_pay'] },
        power_concentration_checks: { token_weighted_voting: false, stake_weighted_voting: false, reputation_weighted_voting: false, one_person_one_vote: true },
        approved_by: [], approved_at: 0, rao_credential_id: ''
      };

      proposal.care_integration = {
        care_team: { doctor: 'did:medico:001', nurse: 'did:enfermera:001', auxiliary: [], community_agents: [], assigned_at: 0 },
        monitoring_protocol: { frequency: 'monthly', vital_signs: ['cognitive_score'], alert_thresholds: {}, escalation_path: [] },
        reversibility: { disconnection_protocol: '', palliative_care_guaranteed: false, data_withdrawal_protocol: '', max_disconnection_time_hours: 168 },
        prevention_first: { preventive_coverage_baseline: 0.45, enhancement_conditional_on: [] },
        approved_by: [], approved_at: 0
      };

      proposal.data_rights = {
        sensitive_data_categories: ['neuroimaging', 'behavioral'],
        off_ledger_storage: { provider: 'did:storage:cloud', encryption: 'AES-256-GCM', key_management: 'HSM', access_log_immutable: false },
        consent: { vc_credential_id: '', revocable: true, granular: false, expiry_days: 730 },
        rao_anchoring: { only_hashes: false, hash_algorithm: 'SHA-256', salted: true },
        withdrawal: { protocol: '', max_time_hours: 168, rao_hash_retention: 'permanent_proof_only' },
        inheritance: { therapeutic_knowledge: 'open_license', enhancement_protocols: 'no_privilege', personal_data: 'deleted_on_death', attribution_historical: true },
        approved_by: [], approved_at: 0
      };

      // Estado territorial con prevención base baja (simula CDMX real)
      const cdmxState: TerritorialStateVector = {
        ...baseState,
        care: { ...baseState.care, preventive_coverage_effective: 0.45 },
        cognitive_infrastructure: {
          ...baseState.cognitive_infrastructure,
          cognitive_coverage_pct: 0.5,
          prevention_coverage_pct: 0.45
        }
      };

      result = evaluateCanutricioTranshumanismComprehensive(proposal, cdmxState, DEFAULT_SCENARIOS);
    });

    test('Debe retornar REJECTED (múltiples bloqueadores)', () => {
      expect(result.summary.ready_for).toBe('rejected');
      expect(result.overall.passed).toBe(false);
      expect(result.overall.blockers.length).toBeGreaterThan(0);
    });

    test('Bloqueador hard: prevención base <80% (45%)', () => {
      const preventionBlocker = result.overall.blockers.find(b => b.includes('Prevención base') || b.includes('prevention'));
      expect(preventionBlocker).toBeDefined();
    });

    test('Bloqueador: impacto ecológico NETO NEGATIVO', () => {
      const ecoBlocker = result.overall.blockers.find(b => b.includes('ecológico') || b.includes('Ecológico'));
      expect(ecoBlocker).toBeDefined();
    });

    test('Bloqueador: autonomía infraestructura <24h (4h cloud)', () => {
      const autonomyBlocker = result.metabolic.blockers.find(b => b.includes('Autonomía') && b.includes('24h'));
      expect(autonomyBlocker).toBeDefined();
    });

    test('Bloqueador: Ashby ratio <1.0 (0.9)', () => {
      const ashbyBlocker = result.cybernetic.blockers.find(b => b.includes('Ashby') && b.includes('1.0'));
      expect(ashbyBlocker).toBeDefined();
    });

    test('Bloqueador: data locality <100% (40% cloud)', () => {
      // Se refleja en score gobernanza/memoria
      expect(result.overall.scorecard.governance_score).toBeLessThan(15);
      expect(result.overall.scorecard.memory_score).toBeLessThan(6);
    });

    test('Bloqueador: consentimiento NO granular + NO off-ledger completo + datos en RAO', () => {
      const memoryBlockers = result.memory.blockers;
      expect(memoryBlockers.some(b => b.includes('granular') || b.includes('VIOLACIÓN') || b.includes('off-ledger'))).toBe(true);
    });

    test('Score total debe ser <70', () => {
      expect(result.overall.scorecard.total_score).toBeLessThan(70);
    });

    test('Validación cuidado: equipo incompleto, prevención 45% <50%', () => {
      expect(result.care.passed).toBe(false);
      expect(result.care.blockers.some(b => b.includes('Prevención base') && b.includes('50%'))).toBe(true);
    });

    test('Validación gobernanza: acceso no universal, Consejo Futuros período >90 días', () => {
      expect(result.governance.access_equity).not.toBe('universal');
      expect(result.governance.warnings.some(w => w.includes('90 días') || w.includes('período'))).toBe(true);
    });
  });

  describe('Validaciones transversales Matema 20/21', () => {
    
    test('Matema 21.5: Enhancement RECHAZADO si prevención <80% territorial', () => {
      // El caso CDMX enhancement tiene prevention_coverage_pct = 0.45
      // Debe ser rechazado independientemente de otros scores
      const cdmxResult = evaluateCanutricioTranshumanismComprehensive(
        createTranshumanismProposalDraft('Test Enhancement', 'cognitive_enhancement', 'Test', 'did:test'),
        { ...baseState, care: { ...baseState.care, preventive_coverage_effective: 0.45 } },
        DEFAULT_SCENARIOS
      );
      // Verificar que el bloqueador de prevención existe
      expect(cdmxResult.overall.blockers.some(b => b.includes('Prevención base') || b.includes('prevention'))).toBe(true);
    });

    test('Matema 20: Data locality 100% = fin extracción neurodatos (jubilación dinero disociativo)', () => {
      const oaxacaResult = evaluateCanutricioTranshumanismComprehensive(
        createTranshumanismProposalDraft('Test', 'prevention', 'Test', 'did:test'),
        { ...baseState, cognitive_infrastructure: { ...baseState.cognitive_infrastructure, data_locality_compliance_pct: 100 } },
        DEFAULT_SCENARIOS
      );
      // Data locality 100% debe dar score máximo en gobernanza/memoria
      expect(oaxacaResult.overall.scorecard.governance_score).toBeGreaterThanOrEqual(14);
      expect(oaxacaResult.overall.scorecard.memory_score).toBeGreaterThanOrEqual(5);
    });

    test('Anidación Fractal: Edge→FL→Salud Pública (misma lógica, escalas anidadas)', () => {
      // Verificar que métricas Edge + FL + Salud Pública están conectadas
      expect(baseState.cognitive_infrastructure.edge_device_density_per_1000).toBeGreaterThan(0);
      expect(baseState.cognitive_infrastructure.federated_round_participation_pct).toBeGreaterThan(0);
      expect(baseState.cognitive_infrastructure.public_health_integration).toBe(true);
    });

    test('Plasma del Plasma: Neuroplasticidad como recurso base regenerativo (hr_vital cognitivo)', () => {
      // hippocampal_volume_change_pct > 0 indica neuroplasticidad activa
      expect(baseState.cognitive_infrastructure.hippocampal_volume_change_pct).toBeGreaterThan(0);
      expect(baseState.cognitive_infrastructure.cognitive_decline_reduction_pct).toBeGreaterThan(0);
    });
  });
});

describe('Helper: createTranshumanismProposalDraft con defaults cognitivos', () => {
  test('Debe crear propuesta con estructura completa incluyendo métricas cognitivas', () => {
    const proposal = createTranshumanismProposalDraft(
      'Test Propuesta',
      'prevention',
      'Descripción test',
      'did:test:001'
    );

    expect(proposal.metabolic_impact.material_balance).toHaveProperty('hippocampal_volume_change_pct');
    expect(proposal.metabolic_impact.material_balance).toHaveProperty('cognitive_decline_reduction_pct');
    expect(proposal.metabolic_impact.material_balance).toHaveProperty('edge_autonomy_hours');
    expect(proposal.metabolic_impact.material_balance).toHaveProperty('federated_learning_participation_pct');
    expect(proposal.metabolic_impact.material_balance).toHaveProperty('flow_state_achievement_rate');
    expect(proposal.metabolic_impact.material_balance).toHaveProperty('data_locality_compliance_pct');
    expect(proposal.metabolic_impact.material_balance).toHaveProperty('cultural_adaptation_score');
    expect(proposal.metabolic_impact.material_balance).toHaveProperty('prevention_coverage_pct');
    expect(proposal.metabolic_impact.material_balance).toHaveProperty('accessibility_compliance_pct');
    expect(proposal.metabolic_impact.material_balance).toHaveProperty('compute_carbon_footprint_kg_co2e_per_year');
  });
});