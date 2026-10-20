// HSCSG v15 OS — Prospectiva Metabolicocibernética Recípranárquica Transgeneracional (PMCRT)
// Tipos, vector estado, ciclo operativo, diagnóstico metabólico

import type { Trace } from './bt213KernelLimits';

// ============================================================================
// VECTOR DE ESTADO TERRITORIAL (9 dimensiones)
// ============================================================================

export interface TerritorialStateVector {
  // W - Agua
  water: WaterMetrics;
  // F - Alimento
  food: FoodMetrics;
  // E - Energía
  energy: EnergyMetrics;
  // H - Hábitat/Vivienda
  habitat: HabitatMetrics;
  // C - Cuidado/Salud
  care: CareMetrics;
  // M - Memoria/Conocimiento
  memory: MemoryMetrics;
  // B - Suelo/Biodiversidad/Regeneración
  biosphere: BiosphereMetrics;
  // G - Gobernanza/Autonomía
  governance: GovernanceMetrics;
  // L - Liquidez/Recursos financieros
  liquidity: LiquidityMetrics;
  
  timestamp: number;
  nodeId: string;
}

export interface WaterMetrics {
  availability_m3_per_day: number;
  quality_index: number;           // 0-1 (1 = potable sin tratamiento)
  safety_compliance: boolean;      // Cumple norma mexicana NOM-127-SSA1
  aquifer_recharge_rate: number;   // m³/año
  scarcity_type: 'physical' | 'seasonal' | 'distributive' | 'logistic' | 'regulatory' | 'none';
}

export interface FoodMetrics {
  kcal_per_person_per_day: number;
  diversity_index: number;         // 0-1 (Shannon o similar)
  self_sufficiency_ratio: number;  // 0-1 (producción local / consumo)
  storage_months: number;          // Meses de reserva
  soil_health_index: number;       // 0-1 (carbono orgánico, biodiversidad, estructura)
}

export interface EnergyMetrics {
  net_balance_kwh_per_day: number;     // Generación - consumo
  renewable_share: number;             // 0-1
  autonomy_hours: number;              // Horas sin red externa
  storage_kwh: number;
  efficiency_ratio: number;            // Útil / total generada
}

export interface HabitatMetrics {
  m2_per_person: number;
  repair_backlog_ratio: number;        // 0-1 (reparaciones pendientes / total)
  maintenance_schedule_compliance: number; // 0-1
  local_materials_ratio: number;       // 0-1
  climate_resilience_score: number;    // 0-1
}

export interface CareMetrics {
  preventive_coverage_effective: number;   // % miembros con prevención real recibida
  unmet_needs_ratio: number;               // 0-1
  equity_gap: number;                      // Diferencia resultados entre grupos
  functional_status_index: number;         // 0-1 (funcionalidad poblacional)
  financial_burden_ratio: number;          // Gasto salud / ingreso hogar
}

export interface MemoryMetrics {
  active_consents_ratio: number;       // % archivos con consentimiento vigente
  withdrawal_compliance_rate: number;  // % retiros atendidos en plazo
  restoration_test_success_rate: number; // % restauraciones probadas exitosas
  reproducible_processes_ratio: number;  // % procesos críticos reproducibles por otros
  open_docs_licensed_ratio: number;      // % docs públicos con licencia explícita
}

export interface BiosphereMetrics {
  soil_organic_carbon_percent: number;
  biodiversity_index: number;          // 0-1 (Shannon/indicadores locales)
  erosion_rate_tons_per_ha_year: number;
  regeneration_net: boolean;           // true = regeneración neta
  bioindicator_score: number;          // 0-1
}

export interface GovernanceMetrics {
  participation_rate: number;          // % miembros activos en decisiones
  power_concentration_index: number;   // Gini de poder de decisión (0-1)
  conflicts_resolved_ratio: number;    // % conflictos resueltos / totales
  decisions_reviewed_ratio: number;    // % decisiones con revisión post-ejecución
  cds_ics_score: number;               // Capacidad Soberanía Distribuida / Coeficiente Simbiótico
}

export interface LiquidityMetrics {
  fiat_net_surplus: number;            // USD/MXN - excedente financiero neto auditado
  tq_balance: number;                  // TQ (límites ±500)
  znu_velocity: number;                // ZNU transacciones/año
  time_contributions_hours: number;    // Horas aportadas
  species_contributions_value: number; // Valor aportaciones en especie (USD equiv)
  reserve_months: number;              // Meses de reserva operativa
}

// ============================================================================
// PERTURBACIONES (w_t)
// ============================================================================

export type PerturbationType = 
  | 'drought' 
  | 'flood'
  | 'epidemic'
  | 'energy_outage'
  | 'supply_chain_break'
  | 'internal_conflict'
  | 'external_shock'
  | 'climate_extreme'
  | 'financial_crisis'
  | 'governance_failure';

export interface Perturbation {
  id: string;
  type: PerturbationType;
  severity: number;           // 0-1
  affected_dimensions: (keyof TerritorialStateVector)[];
  started_at: number;
  estimated_duration: number; // ms
  mitigation_actions: string[];
  status: 'active' | 'mitigating' | 'resolved' | 'chronic';
}

// ============================================================================
// DECISIONES Y ASIGNACIONES (u_t)
// ============================================================================

export interface ResourceAllocation {
  id: string;
  fund: 'memory' | 'care' | 'autotrophy';
  purpose: string;
  amount: number;
  unit: 'fiat_usd' | 'fiat_mxn' | 'znu' | 'tq' | 'hours' | 'species_kg' | 'species_m3';
  source: 'fiat_surplus' | 'tq_beta_crit' | 'donation' | 'grant' | 'species_contribution' | 'time_contribution';
  recipient_node: string;
  responsible: string;           // DID
  milestones: Milestone[];
  rao_credential_id: string;
  status: 'proposed' | 'approved' | 'executing' | 'completed' | 'audited' | 'cancelled';
  created_at: number;
  approved_at?: number;
  completed_at?: number;
}

export interface Milestone {
  id: string;
  description: string;
  target_date: number;
  verification_method: 'physical_measurement' | 'document_review' | 'community_attestation' | 'lab_analysis' | 'rao_audit';
  status: 'pending' | 'in_progress' | 'verified' | 'failed';
  evidence?: string;             // Hash o referencia a evidencia
}

// ============================================================================
// CICLO OPERATIVO PMCRT (5 Fases)
// ============================================================================

export type PMCRTPhase = 
  | 'observation' 
  | 'diagnosis' 
  | 'deliberation' 
  | 'execution' 
  | 'feedback';

export interface PMCRTCycle {
  node_id: string;
  cycle_number: number;
  phase: PMCRTPhase;
  state_vector: TerritorialStateVector;
  perturbations: Perturbation[];
  allocations: ResourceAllocation[];
  diagnosis_report?: DiagnosisReport;
  deliberation_record?: DeliberationRecord;
  execution_log?: ExecutionLog;
  feedback_report?: FeedbackReport;
  started_at: number;
  completed_at?: number;
}

export interface DiagnosisReport {
  metabolic_balance: MetabolicBalance;
  cybernetic_alerts: CyberneticAlert[];
  critical_dependencies: CriticalDependency[];
  vulnerability_index: number;      // 0-1
  ashby_variety_ratio: number;      // capacidad_respuesta / variedad_perturbaciones
  recommendations: string[];
}

export interface MetabolicBalance {
  by_resource: Record<string, ResourceBalance>;
  overall_regenerative: boolean;
  unexplained_difference: number;
  tolerance_exceeded: boolean;
}

export interface ResourceBalance {
  resource: string;
  inputs: number;
  useful_outputs: number;
  waste: number;
  emissions: number;
  stock_change: number;
  unexplained: number;
  unit: string;
  tolerance: number;
}

export interface CyberneticAlert {
  dimension: keyof TerritorialStateVector;
  type: 'threshold_breach' | 'trend_deviation' | 'regeneration_failure' | 'inequity_spike';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  suggested_actions: string[];
  deadline?: number;
}

export interface CriticalDependency {
  resource: string;
  dependency_type: 'single_source' | 'external_market' | 'degrading_infrastructure' | 'skill_gap';
  risk_level: number; // 0-1
  mitigation_options: string[];
}

export interface DeliberationRecord {
  proposals: Proposal[];
  votes: Vote[];
  council_future_veto?: CouncilVeto;
  consensus_reached: boolean;
  dissenting_opinions: string[];
}

export interface Proposal {
  id: string;
  author: string;        // DID
  fund: 'memory' | 'care' | 'autotrophy';
  description: string;
  allocation: ResourceAllocation;
  intergenerational_assessment: IntergenerationalAssessment;
  submitted_at: number;
}

export interface IntergenerationalAssessment {
  current_generation_impact: 'positive' | 'neutral' | 'negative';
  benefit_distribution: 'equitable' | 'concentrated' | 'exclusionary';
  territorial_regeneration: 'enhances' | 'maintains' | 'degrades';
  future_generations_impact: 'positive' | 'neutral' | 'negative' | 'uncertain';
  assumptions: string[];
  uncertainties: string[];
}

export interface Vote {
  proposal_id: string;
  voter: string;         // DID
  weight: number;        // Siempre 1 (una persona, un voto)
  choice: 'yes' | 'no' | 'abstain';
  timestamp: number;
}

export interface CouncilVeto {
  proposal_id: string;
  reason: string;
  justification_published: boolean;
  deadline_for_appeal: number;
  appeal_filed: boolean;
  resolved: boolean;
}

export interface ExecutionLog {
  allocation_id: string;
  disbursements: Disbursement[];
  milestones_completed: string[];
  milestones_failed: string[];
  actual_costs: ActualCost[];
  rao_audit_trail: string[];
}

export interface Disbursement {
  id: string;
  amount: number;
  unit: string;
  recipient: string;
  timestamp: number;
  rao_credential_id: string;
}

export interface ActualCost {
  category: string;
  planned: number;
  actual: number;
  variance_explanation: string;
}

export interface FeedbackReport {
  cycle_number: number;
  objectives_vs_results: ObjectiveResult[];
  policy_corrections: PolicyCorrection[];
  lessons_learned: LessonLearned[];
  scenario_updates: ScenarioUpdate[];
}

export interface ObjectiveResult {
  objective: string;
  target: number;
  actual: number;
  unit: string;
  variance_explanation: string;
}

export interface PolicyCorrection {
  policy: string;
  reason: string;
  new_rule: string;
  effective_date: number;
}

export interface LessonLearned {
  context: string;
  error: string;
  correction: string;
  prevention: string;
  public_documentation: boolean;
}

export interface ScenarioUpdate {
  scenario_id: string;
  probability_change: number;
  impact_assessment_change: string;
  new_mitigation?: string;
}

// ============================================================================
// FUNCIONES DE DIAGNÓSTICO METABÓLICO
// ============================================================================

export function computeMetabolicBalance(
  state: TerritorialStateVector,
  processes: ProductionProcess[]
): MetabolicBalance {
  const by_resource: Record<string, ResourceBalance> = {};
  
  // Agregar balance por recurso desde procesos productivos
  for (const process of processes) {
    for (const input of process.inputs) {
      if (!by_resource[input.resource]) {
        by_resource[input.resource] = {
          resource: input.resource,
          inputs: 0,
          useful_outputs: 0,
          waste: 0,
          emissions: 0,
          stock_change: 0,
          unexplained: 0,
          unit: input.unit,
          tolerance: input.tolerance || 0.05
        };
      }
      by_resource[input.resource].inputs += input.quantity;
    }
    
    for (const output of process.outputs) {
      if (!by_resource[output.resource]) {
        by_resource[output.resource] = {
          resource: output.resource,
          inputs: 0,
          useful_outputs: 0,
          waste: 0,
          emissions: 0,
          stock_change: 0,
          unexplained: 0,
          unit: output.unit,
          tolerance: output.tolerance || 0.05
        };
      }
      if (output.type === 'product') {
        by_resource[output.resource].useful_outputs += output.quantity;
      } else if (output.type === 'waste') {
        by_resource[output.resource].waste += output.quantity;
      } else if (output.type === 'emission') {
        by_resource[output.resource].emissions += output.quantity;
      }
    }
  }
  
  // Calcular diferencia no explicada por recurso
  let total_unexplained = 0;
  let tolerance_exceeded = false;
  
  for (const balance of Object.values(by_resource)) {
    balance.unexplained = balance.inputs - (
      balance.useful_outputs + balance.waste + balance.emissions + balance.stock_change
    );
    total_unexplained += Math.abs(balance.unexplained);
    
    if (Math.abs(balance.unexplained) > balance.tolerance * balance.inputs) {
      tolerance_exceeded = true;
    }
  }
  
  return {
    by_resource,
    overall_regenerative: Object.values(by_resource).every(b => b.unexplained <= b.tolerance * b.inputs),
    unexplained_difference: total_unexplained,
    tolerance_exceeded
  };
}

export function detectCyberneticAlerts(
  state: TerritorialStateVector,
  previous_state: TerritorialStateVector | null,
  limits: PlanetaryLimits
): CyberneticAlert[] {
  const alerts: CyberneticAlert[] = [];
  
  // Umbrales críticos por dimensión
  const thresholds = {
    water: { availability: 50, quality: 0.6 },           // m³/día/hab, índice
    food: { kcal: 2000, self_sufficiency: 0.3 },         // kcal/hab/día
    energy: { net_balance: 0, autonomy_hours: 24 },      // kWh, horas
    habitat: { repair_backlog: 0.3 },                    // ratio
    care: { preventive_coverage: 0.7, equity_gap: 0.2 }, // ratios
    memory: { active_consents: 0.8, restoration: 0.9 },  // ratios
    biosphere: { soil_carbon: 1.5, erosion: 10 },        // %, ton/ha/año
    governance: { participation: 0.5, power_concentration: 0.4 }, // ratios
    liquidity: { reserve_months: 3, fiat_surplus: 0 }    // meses, USD
  };
  
  // Verificar umbrales
  if (state.water.availability_m3_per_day < thresholds.water.availability) {
    alerts.push({
      dimension: 'water',
      type: 'threshold_breach',
      severity: 'critical',
      message: `Disponibilidad de agua (${state.water.availability_m3_per_day} m³/día/hab) bajo umbral crítico (${thresholds.water.availability})`,
      suggested_actions: ['Activar protocolo ahorro', 'Priorizar usos vitales', 'Buscar fuentes alternativas', 'Revisar asignación fondo autotrofia'],
      deadline: Date.now() + 86400000 // 24h
    });
  }
  
  if (state.food.self_sufficiency_ratio < thresholds.food.self_sufficiency) {
    alerts.push({
      dimension: 'food',
      type: 'threshold_breach',
      severity: 'warning',
      message: `Autosuficiencia alimentaria (${(state.food.self_sufficiency_ratio*100).toFixed(0)}%) bajo umbral (${(thresholds.food.self_sufficiency*100).toFixed(0)}%)`,
      suggested_actions: ['Diversificar cultivos', 'Federar intercambio alimentario', 'Activar fondo autotrofia semillas/insumos'],
    });
  }
  
  if (state.energy.net_balance_kwh_per_day < thresholds.energy.net_balance) {
    alerts.push({
      dimension: 'energy',
      type: 'threshold_breach',
      severity: 'critical',
      message: `Balance energético neto negativo (${state.energy.net_balance_kwh_per_day} kWh/día)`,
      suggested_actions: ['Reducir consumo no esencial', 'Activar respaldos', 'Revisar fugas', 'Priorizar cargas críticas'],
      deadline: Date.now() + 43200000 // 12h
    });
  }
  
  if (state.care.preventive_coverage_effective < thresholds.care.preventive_coverage) {
    alerts.push({
      dimension: 'care',
      type: 'threshold_breach',
      severity: 'warning',
      message: `Cobertura preventiva efectiva (${(state.care.preventive_coverage_effective*100).toFixed(0)}%) bajo objetivo (${(thresholds.care.preventive_coverage*100).toFixed(0)}%)`,
      suggested_actions: ['Expandir equipos salud familiar', 'Campaña prevención comunitaria', 'Revisar barreras acceso'],
    });
  }
  
  if (state.care.equity_gap > thresholds.care.equity_gap) {
    alerts.push({
      dimension: 'care',
      type: 'inequity_spike',
      severity: 'critical',
      message: `Brecha equidad cuidado (${(state.care.equity_gap*100).toFixed(0)}%) excede tolerancia`,
      suggested_actions: ['Auditar acceso por grupos', 'Eliminar barreras condicionadas', 'Priorizar grupos rezagados'],
    });
  }
  
  if (state.biosphere.soil_organic_carbon_percent < thresholds.biosphere.soil_carbon) {
    alerts.push({
      dimension: 'biosphere',
      type: 'regeneration_failure',
      severity: 'warning',
      message: `Carbono orgánico suelo (${state.biosphere.soil_organic_carbon_percent}%) bajo umbral regenerativo (${thresholds.biosphere.soil_carbon}%)`,
      suggested_actions: ['Aplicar compost/biomasa', 'Rotación cultivos', 'Cubierta vegetal', 'Reducir labranza'],
    });
  }
  
  if (state.governance.power_concentration_index > thresholds.governance.power_concentration) {
    alerts.push({
      dimension: 'governance',
      type: 'threshold_breach',
      severity: 'warning',
      message: `Concentración poder decisión (Gini ${state.governance.power_concentration_index.toFixed(2)}) excede tolerancia (${thresholds.governance.power_concentration})`,
      suggested_actions: ['Revisar reglas voto', 'Rotar roles', 'Auditar concentración tokens/reputación', 'Activar CDS'],
    });
  }
  
  if (state.liquidity.reserve_months < thresholds.liquidity.reserve_months) {
    alerts.push({
      dimension: 'liquidity',
      type: 'threshold_breach',
      severity: 'warning',
      message: `Reserva operativa (${state.liquidity.reserve_months} meses) bajo mínimo (${thresholds.liquidity.reserve_months} meses)`,
      suggested_actions: ['Reducir gastos no esenciales', 'Acelerar cobranzas', 'Buscar subvenciones puente', 'Activar cláusula arranque'],
    });
  }
  
  // Tendencias (si hay estado previo)
  if (previous_state) {
    const trend_alerts = detectTrendDeviations(state, previous_state);
    alerts.push(...trend_alerts);
  }
  
  return alerts;
}

function detectTrendDeviations(current: TerritorialStateVector, previous: TerritorialStateVector): CyberneticAlert[] {
  const alerts: CyberneticAlert[] = [];
  const threshold = 0.15; // 15% cambio en una dimensión clave
  
  // Simplificado: comparar dimensiones clave
  const dims: Array<{key: keyof TerritorialStateVector; getter: (s: TerritorialStateVector) => number}> = [
    { key: 'water', getter: s => s.water.availability_m3_per_day },
    { key: 'food', getter: s => s.food.self_sufficiency_ratio },
    { key: 'energy', getter: s => s.energy.net_balance_kwh_per_day },
    { key: 'care', getter: s => s.care.preventive_coverage_effective },
    { key: 'biosphere', getter: s => s.biosphere.soil_organic_carbon_percent },
  ];
  
  for (const dim of dims) {
    const prev = dim.getter(previous);
    const curr = dim.getter(current);
    if (prev > 0) {
      const change = (curr - prev) / prev;
      if (Math.abs(change) > threshold) {
        alerts.push({
          dimension: dim.key,
          type: 'trend_deviation',
          severity: change < 0 ? 'warning' : 'info',
          message: `${dim.key} cambió ${(change*100).toFixed(1)}% en período`,
          suggested_actions: change < 0 ? ['Investigar causa', 'Activar mitigación'] : ['Documentar mejora', 'Replicar práctica'],
        });
      }
    }
  }
  
  return alerts;
}

export interface PlanetaryLimits {
  climate_change: number;           // ppm CO2
  biosphere_integrity: number;      // % especies amenazadas
  freshwater: number;               // km³/año
  biogeochemical_flows: { n: number; p: number }; // millones ton
  novel_entities: number;           // índice
  ocean_acidification: number;      // pH
  land_use: number;                 // % boscoso
  atmospheric_aerosols: number;     // índice
  ozone: number;                    // DU
}

// Límites planetarios 2026 (Potsdam Institute)
export const PLANETARY_LIMITS_2026: PlanetaryLimits = {
  climate_change: 450,
  biosphere_integrity: 10,
  freshwater: 4000,
  biogeochemical_flows: { n: 62, p: 6.2 },
  novel_entities: 0, // sin umbral seguro
  ocean_acidification: 8.05,
  land_use: 75,
  atmospheric_aerosols: 0,
  ozone: 275
};

export function computeAshbyVarietyRatio(
  response_capacity: number,  // número de respuestas distintivas que el sistema puede generar
  perturbation_variety: number // número de perturbaciones distintas relevantes
): number {
  if (perturbation_variety === 0) return Infinity;
  return response_capacity / perturbation_variety;
}

// ============================================================================
// ESCENARIOS TRANSGENERACIONALES
// ============================================================================

export type TimeHorizon = 'operational' | 'strategic' | 'transgenerational';

export interface Scenario {
  id: string;
  name: string;
  horizon: TimeHorizon;
  probability: number;           // 0-1
  assumptions: string[];
  state_projection: Partial<TerritorialStateVector>;
  key_risks: string[];
  mitigation_options: string[];
  intergenerational_impact: 'positive' | 'neutral' | 'negative' | 'uncertain';
}

export const DEFAULT_SCENARIOS: Scenario[] = [
  {
    id: 'stability',
    name: 'Estabilidad relativa',
    horizon: 'operational',
    probability: 0.5,
    assumptions: ['Clima estable', 'Mercados funcionando', 'Gobernanza efectiva', 'Sin shocks mayores'],
    state_projection: {},
    key_risks: ['Complacencia', 'Subinversión en mantenimiento'],
    mitigation_options: ['Mantenimiento preventivo programado', 'Diversificación gradual'],
    intergenerational_impact: 'neutral'
  },
  {
    id: 'stress',
    name: 'Estrés múltiple',
    horizon: 'strategic',
    probability: 0.3,
    assumptions: ['Sequías recurrentes', 'Volatilidad precios', 'Migración', 'Presión fiscal'],
    state_projection: {
      water: { availability_m3_per_day: 40, scarcity_type: 'physical' },
      food: { self_sufficiency_ratio: 0.4 },
      energy: { net_balance_kwh_per_day: -50 },
      liquidity: { reserve_months: 2 }
    },
    key_risks: ['Fallas cascada', 'Conflictos por agua', 'Éxodo poblacional'],
    mitigation_options: ['Federación regional agua', 'Reservas estratégicas', 'Autotrofia acelerada', 'Fondos emergencia'],
    intergenerational_impact: 'negative'
  },
  {
    id: 'severe_disruption',
    name: 'Perturbación severa',
    horizon: 'transgenerational',
    probability: 0.1,
    assumptions: ['Colapso sistémico regional', 'Pérdida capacidad estatal', 'Degradación ecológica irreversible', 'Fragmentación social'],
    state_projection: {
      water: { availability_m3_per_day: 15, scarcity_type: 'physical' },
      food: { self_sufficiency_ratio: 0.8, diversity_index: 0.3 },
      energy: { renewable_share: 0.9, autonomy_hours: 720 },
      biosphere: { regeneration_net: true, soil_organic_carbon_percent: 3.0 },
      governance: { participation_rate: 0.8, cds_ics_score: 0.9 }
    },
    key_risks: ['Pérdida conocimiento crítico', 'Conflictos violentos', 'Extinción local especies'],
    mitigation_options: ['Archivos distribuidos offline', 'Semillas/genética resguardada', 'Protocolos supervivencia', 'Alianzas bioregionales'],
    intergenerational_impact: 'uncertain'
  }
];

export function evaluateIntergenerationalImpact(
  allocation: ResourceAllocation,
  scenarios: Scenario[]
): IntergenerationalAssessment {
  // Evaluación simplificada: ponderar por probabilidad de escenarios
  let positive_weight = 0;
  let negative_weight = 0;
  let uncertain_weight = 0;
  
  for (const scenario of scenarios) {
    const impact = scenario.intergenerational_impact;
    if (impact === 'positive') positive_weight += scenario.probability;
    else if (impact === 'negative') negative_weight += scenario.probability;
    else uncertain_weight += scenario.probability;
  }
  
  let future_impact: IntergenerationalAssessment['future_generations_impact'] = 'uncertain';
  if (positive_weight > negative_weight + uncertain_weight) future_impact = 'positive';
  else if (negative_weight > positive_weight + uncertain_weight) future_impact = 'negative';
  else if (uncertain_weight > 0.5) future_impact = 'uncertain';
  
  return {
    current_generation_impact: allocation.fund === 'care' ? 'positive' : 'neutral',
    benefit_distribution: 'equitable', // Requiere análisis de distribución real
    territorial_regeneration: allocation.fund === 'autotrophy' ? 'enhances' : 'maintains',
    future_generations_impact,
    assumptions: scenarios.flatMap(s => s.assumptions),
    uncertainties: scenarios.flatMap(s => s.key_risks)
  };
}