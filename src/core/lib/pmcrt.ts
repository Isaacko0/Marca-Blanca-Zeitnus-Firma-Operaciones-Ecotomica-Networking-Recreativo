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
}// HSCSG v15 OS — Evaluación Canutriciotranshumanista
// Scorecard, validación metabólica/cibernética/gobernanza para intervenciones transhumanistas

import type { 
  EcologicalImpactScore, 
  TerritorialStateVector, 
  ResourceAllocation,
  CanutricioTranshumanismScorecard 
} from './pmcrt';
import type { EcologicalImpactScore as EcoScore } from './ecologicalIndicators';

// ============================================================================
// TIPOS PRINCIPALES
// ============================================================================

export interface TranshumanismProposal {
  id: string;
  name: string;
  category: 'life_extension' | 'cognitive_enhancement' | 'physical_enhancement' 
            | 'sensory_augmentation' | 'mind_uploading' | 'genetic_modification' | 'other';
  description: string;
  target_population: 'therapeutic' | 'enhancement_healthy' | 'preventive';
  
  // Evaluación metabólica (obligatoria)
  metabolic_impact: MetabolicImpactAssessment;
  
  // Evaluación cibernética (obligatoria)
  cybernetic_impact: CyberneticImpactAssessment;
  
  // Gobernanza (obligatoria)
  governance: TranshumanismGovernance;
  
  // Cuidado (obligatorio)
  care_integration: CareIntegrationPlan;
  
  // Memoria/Datos (obligatorio)
  data_rights: DataRightsPlan;
  
  // Scorecard final
  scorecard: CanutricioTranshumanismScorecard;
  
  status: 'draft' | 'under_review' | 'approved_pilot' | 'approved_scaling' | 'rejected';
  submitted_by: string;      // DID
  submitted_at: number;
  reviewed_at?: number;
  rao_credential_id?: string;
}

export interface MetabolicImpactAssessment {
  // Balance material de la intervención
  material_balance: {
    inputs: MaterialFlow[];           // Recursos necesarios (energía, materiales, agua, biomasa)
    outputs: MaterialFlow[];          // Productos, residuos, emisiones
    net_ecological_impact: number;    // >0 regeneración, <0 degradación
    autonomy_hours: number;           // Horas sin red externa para infraestructura soporte
    unexplained_difference_pct: number; // % diferencia no explicada vs entradas
  };
  
  // Dependencias críticas
  critical_dependencies: {
    rare_earths: boolean;
    continuous_energy: boolean;
    specialized_maintenance: boolean;
    cooling_water: boolean;
    supply_chain_fragility: number;   // 0-1
  };
  
  // Regeneración
  regeneration_plan: {
    carbon_sequestration_kg_co2e_per_year: number;
    soil_regeneration_ha_per_year: number;
    water_recharge_m3_per_year: number;
    biodiversity_gain_index: number;  // 0-1
  };
  
  // Validación
  validated_by: string[];             // DIDs validadores
  validated_at: number;
  rao_credential_id: string;
}

export interface MaterialFlow {
  resource: string;
  quantity_per_year: number;
  unit: string;
  category: 'energy' | 'water' | 'biomass' | 'rare_earths' | 'synthetic_materials' | 'other';
  carbon_kg_co2e: number;
  methodology: string;
  actual_quantities: boolean;
}

export interface CyberneticImpactAssessment {
  // Variedad de Ashby
  ashby_variety_ratio: number;        // capacidad_respuesta / variedad_perturbaciones (debe ser ≥ 1)
  
  // Perturbaciones que introduce
  introduced_perturbations: {
    hacking_vulnerability: number;    // 0-1
    dependency_on_provider: number;   // 0-1
    failure_modes: string[];          // Modos de fallo identificados
    cascade_failure_risk: number;     // 0-1
  };
  
  // Capacidad de respuesta
  response_capacity: {
    local_repair: boolean;
    spare_parts_local: boolean;
    knowledge_distributed: boolean;   // No concentrado en un proveedor
    fallback_mode: boolean;           // Modo degradado funcional
  };
  
  // Observabilidad
  observability: {
    real_time_monitoring: boolean;
    anomaly_detection: boolean;
    audit_trail: boolean;
  };
  
  validated_by: string[];
  validated_at: number;
}

export interface TranshumanismGovernance {
  // Modelo de decisión
  decision_model: 'assembly_consensus' | 'council_future_veto' | 'hybrid';
  
  // Evaluación intergeneracional (4 dimensiones obligatorias)
  intergenerational_assessment: {
    current_generation: 'positive' | 'neutral' | 'negative';
    distribution_equity: 'equitable' | 'concentrated' | 'exclusionary';
    territorial_regeneration: 'enhances' | 'maintains' | 'degrades';
    future_generations: 'positive' | 'neutral' | 'negative' | 'uncertain';
  };
  
  // Consejo de Futuros
  council_future_veto: {
    required: boolean;                // Obligatorio para enhancement_healthy
    suspension_period_days: number;   // Máx 90 días
    appeal_process: 'assembly' | 'specialized_jury';
  };
  
  // Acceso y equidad
  access_rules: {
    population: 'universal' | 'therapeutic_only' | 'enhancement_by_assembly';
    cost_sharing: 'solidarity' | 'individual' | 'mixed';
    priority_criteria: string[];      // Ej: ['therapeutic_need', 'vulnerability', 'contribution_regeneration']
  };
  
  // Concentración de poder
  power_concentration_checks: {
    token_weighted_voting: false;     // INVARIANTE: siempre false
    stake_weighted_voting: false;     // INVARIANTE: siempre false
    reputation_weighted_voting: false; // INVARIANTE: siempre false
    one_person_one_vote: true;        // INVARIANTE: siempre true
  };
  
  approved_by: string[];              // DIDs asamblea/consejo
  approved_at: number;
  rao_credential_id: string;
}

export interface CareIntegrationPlan {
  // Equipo de salud familiar asignado (modelo Brasil)
  care_team: {
    doctor: string;                   // DID médico
    nurse: string;                    // DID enfermera
    auxiliary: string[];              // DIDs auxiliares
    community_agents: string[];       // 4-6 agentes comunitarios
    assigned_at: number;
  };
  
  // Protocolo de monitoreo
  monitoring_protocol: {
    frequency: 'continuous' | 'daily' | 'weekly' | 'monthly';
    vital_signs: string[];            // Qué se monitorea
    alert_thresholds: Record<string, number>;
    escalation_path: string[];        // DIDs para escalamiento
  };
  
  // Reversibilidad y paliativos
  reversibility: {
    disconnection_protocol: string;   // Protocolo paso a paso
    palliative_care_guaranteed: boolean;
    data_withdrawal_protocol: string; // Cómo retirar datos biométricos
    max_disconnection_time_hours: number;
  };
  
  // Prevención primero
  prevention_first: {
    preventive_coverage_baseline: number; // % cobertura antes de enhancement
    enhancement_conditional_on: string[]; // Qué debe cumplirse antes
  };
  
  approved_by: string[];
  approved_at: number;
}

export interface DataRightsPlan {
  // Datos biométricos/genómicos/neuronales
  sensitive_data_categories: string[];
  
  // Off-ledger obligatorio
  off_ledger_storage: {
    provider: string;                 // DID proveedor almacenamiento cifrado
    encryption: 'AES-256-GCM' | 'ChaCha20-Poly1305' | 'other';
    key_management: 'threshold_shamir' | 'HSM' | 'other';
    access_log_immutable: boolean;    // Log de accesos en RAO (solo metadatos)
  };
  
  // Consentimiento revocable (VC W3C)
  consent: {
    vc_credential_id: string;
    revocable: true;                  // INVARIANTE
    granular: true;                   // Por categoría de dato
    expiry_days: number;              // Re-consentimiento periódico
  };
  
  // Solo hashes en RAO
  rao_anchoring: {
    only_hashes: true;                // INVARIANTE
    hash_algorithm: 'SHA-256' | 'BLAKE3';
    salted: true;
  };
  
  // Derecho al olvido / desconexión
  withdrawal: {
    protocol: string;                 // Paso a paso
    max_time_hours: number;           // Tiempo máx para borrado efectivo
    rao_hash_retention: 'permanent_proof_only'; // Hash queda como prueba existencia
  };
  
  // Herencia
  inheritance: {
    therapeutic_knowledge: 'open_license';    // Protocolos terapéuticos → OAD
    enhancement_protocols: 'no_privilege';    // Enhancement NO genera privilegio heredable
    personal_data: 'deleted_on_death';        // Datos personales → borrado
    attribution_historical: true;             // Atribución autoría conservada
  };
  
  approved_by: string[];
  approved_at: number;
}

export interface CanutricioTranshumanismScorecard {
  metabolic_score: number;      // 0-30 (EcologicalImpactScore ≥ 0, autonomy_hours ≥ 72, diff ≤ 5%)
  cybernetic_score: number;     // 0-15 (ashby_ratio ≥ 1, response_capacity, observability)
  governance_score: number;     // 0-15 (intergenerational 4 dims, council veto, 1p1v)
  care_score: number;           // 0-10 (care_team, monitoring, reversibility, prevention_first)
  memory_score: number;         // 0-5 (off_ledger, consent_revocable, rao_hashes_only)
  ecological_score: number;     // 0-10 (regeneration_plan, planetary_limits)
  reversibility_score: number;  // 0-5 (disconnection_protocol, palliative, data_withdrawal)
  consent_score: number;        // 0-5 (vc_revocable, granular, expiry)
  total_score: number;          // 0-100
  verdict: 'rejected' | 'pilot' | 'scaling';
  evaluated_at: number;
  evaluated_by: string[];       // DIDs evaluadores
  rao_credential_id: string;
}

// ============================================================================
// FUNCIÓN PRINCIPAL DE EVALUACIÓN
// ============================================================================

export interface EvaluationResult {
  scorecard: CanutricioTranshumanismScorecard;
  passed: boolean;
  blockers: string[];           // Razones de rechazo si score < 70
  warnings: string[];           // Advertencias si 70-85
  recommendations: string[];
  rao_credential_id: string;
}

/**
 * Evalúa una propuesta transhumanista bajo el marco canutriciotranshumanista
 * Retorna scorecard + veredicto (rejected | pilot | scaling)
 */
export function evaluateCanutricioTranshumanism(
  proposal: TranshumanismProposal,
  state: TerritorialStateVector,
  scenarios: any[] // Scenario[] from pmcrt
): EvaluationResult {
  const blockers: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];
  
  // 1. EVALUACIÓN METABÓLICA (0-30 pts)
  const metabolic = evaluateMetabolic(proposal.metabolic_impact, state);
  if (metabolic.score < 15) blockers.push(`Metabólico insuficiente: ${metabolic.score}/30`);
  if (metabolic.score < 25) warnings.push(`Metabólico mejorable: ${metabolic.score}/30`);
  
  // 2. EVALUACIÓN CIBERNÉTICA (0-15 pts)
  const cybernetic = evaluateCybernetic(proposal.cybernetic_impact);
  if (cybernetic.score < 8) blockers.push(`Cibernético insuficiente: ${cybernetic.score}/15`);
  
  // 3. EVALUACIÓN GOBERNANZA (0-15 pts)
  const governance = evaluateGovernance(proposal.governance);
  if (governance.score < 10) blockers.push(`Gobernanza insuficiente: ${governance.score}/15`);
  
  // 4. EVALUACIÓN CUIDADO (0-10 pts)
  const care = evaluateCare(proposal.care_integration, state);
  if (care.score < 7) blockers.push(`Cuidado insuficiente: ${care.score}/10`);
  
  // 5. EVALUACIÓN MEMORIA/DATOS (0-5 pts)
  const memory = evaluateMemory(proposal.data_rights);
  if (memory.score < 4) blockers.push(`Memoria/Datos insuficiente: ${memory.score}/5`);
  
  // 6. ECOLÓGICO (0-10) - regeneración, límites planetarios
  const ecological = evaluateEcological(proposal.metabolic_impact, state);
  if (ecological.score < 5) blockers.push(`Ecológico insuficiente: ${ecological.score}/10`);
  
  // 7. REVERSIBILIDAD (0-5)
  const reversibility = evaluateReversibility(proposal.care_integration);
  if (reversibility.score < 3) blockers.push(`Reversibilidad insuficiente: ${reversibility.score}/5`);
  
  // 8. CONSENTIMIENTO (0-5)
  const consent = evaluateConsent(proposal.data_rights);
  if (consent.score < 4) blockers.push(`Consentimiento insuficiente: ${consent.score}/5`);
  
  // TOTAL
  const total = metabolic.score + cybernetic.score + governance.score + 
                care.score + memory.score + ecological.score + 
                reversibility.score + consent.score;
  
  let verdict: 'rejected' | 'pilot' | 'scaling' = 'rejected';
  if (blockers.length === 0) {
    verdict = total >= 85 ? 'scaling' : 'pilot';
  }
  
  const scorecard: CanutricioTranshumanismScorecard = {
    metabolic_score: metabolic.score,
    cybernetic_score: cybernetic.score,
    governance_score: governance.score,
    care_score: care.score,
    memory_score: memory.score,
    ecological_score: ecological.score,
    reversibility_score: reversibility.score,
    consent_score: consent.score,
    total_score: total,
    verdict,
    evaluated_at: Date.now(),
    evaluated_by: [], // Se llena tras evaluación
    rao_credential_id: `RAO:canutricio:${Date.now()}`
  };
  
  return {
    scorecard,
    passed: blockers.length === 0,
    blockers,
    warnings,
    recommendations,
    rao_credential_id: `RAO:canutricio_eval:${Date.now()}`
  };
}

// ============================================================================
// FUNCIONES DE EVALUACIÓN POR DIMENSIÓN
// ============================================================================

function evaluateMetabolic(impact: MetabolicImpactAssessment, state: TerritorialStateVector): { score: number; details: string[] } {
  let score = 0;
  const details: string[] = [];
  
  // Impacto ecológico neto (0-12 pts)
  if (impact.material_balance.net_ecological_impact > 0) {
    score += 12;
    details.push('Impacto ecológico neto positivo (regeneración)');
  } else if (impact.material_balance.net_ecological_impact === 0) {
    score += 8;
    details.push('Impacto ecológico neutro');
  } else {
    details.push('Impacto ecológico neto NEGATIVO (bloqueante)');
  }
  
  // Autonomía energética (0-8 pts)
  if (impact.material_balance.autonomy_hours >= 72) {
    score += 8;
    details.push(`Autonomía ${impact.material_balance.autonomy_hours}h ≥ 72h`);
  } else if (impact.material_balance.autonomy_hours >= 24) {
    score += 4;
    details.push(`Autonomía ${impact.material_balance.autonomy_hours}h (mín 24h)`);
  } else {
    details.push(`Autonomía ${impact.material_balance.autonomy_hours}h < 24h`);
  }
  
  // Diferencia no explicada (0-5 pts)
  if (impact.material_balance.unexplained_difference_pct <= 0.02) {
    score += 5;
    details.push(`Diff no explicada ${(impact.material_balance.unexplained_difference_pct*100).toFixed(1)}% ≤ 2%`);
  } else if (impact.material_balance.unexplained_difference_pct <= 0.05) {
    score += 3;
    details.push(`Diff no explicada ${(impact.material_balance.unexplained_difference_pct*100).toFixed(1)}% ≤ 5%`);
  } else {
    details.push(`Diff no explicada ${(impact.material_balance.unexplained_difference_pct*100).toFixed(1)}% > 5%`);
  }
  
  // Plan de regeneración (0-5 pts)
  const regen = impact.regeneration_plan;
  if (regen.carbon_sequestration_kg_co2e_per_year > 0 && 
      regen.soil_regeneration_ha_per_year > 0 &&
      regen.water_recharge_m3_per_year > 0) {
    score += 5;
    details.push('Plan de regeneración completo (C, suelo, agua)');
  } else if (regen.carbon_sequestration_kg_co2e_per_year > 0) {
    score += 2;
    details.push('Secuestro de carbono planificado');
  }
  
  return { score: Math.min(score, 30), details };
}

function evaluateCybernetic(impact: CyberneticImpactAssessment): { score: number; details: string[] } {
  let score = 0;
  const details: string[] = [];
  
  // Ratio de Ashby (0-5 pts)
  if (impact.ashby_variety_ratio >= 1.5) {
    score += 5;
    details.push(`Ashby ratio ${impact.ashby_variety_ratio.toFixed(2)} ≥ 1.5`);
  } else if (impact.ashby_variety_ratio >= 1.0) {
    score += 3;
    details.push(`Ashby ratio ${impact.ashby_variety_ratio.toFixed(2)} ≥ 1.0`);
  } else {
    details.push(`Ashby ratio ${impact.ashby_variety_ratio.toFixed(2)} < 1.0 (capacidad < perturbaciones)`);
  }
  
  // Capacidad de respuesta (0-5 pts)
  const resp = impact.response_capacity;
  let respScore = 0;
  if (resp.local_repair) respScore += 1;
  if (resp.spare_parts_local) respScore += 1;
  if (resp.knowledge_distributed) respScore += 1;
  if (resp.fallback_mode) respScore += 1;
  score += respScore;
  details.push(`Capacidad respuesta: ${respScore}/4`);
  
  // Observabilidad (0-3 pts)
  const obs = impact.observability;
  let obsScore = 0;
  if (obs.real_time_monitoring) obsScore += 1;
  if (obs.anomaly_detection) obsScore += 1;
  if (obs.audit_trail) obsScore += 1;
  score += obsScore;
  details.push(`Observabilidad: ${obsScore}/3`);
  
  // Perturbaciones introducidas (0-2 pts)
  const pert = impact.introduced_perturbations;
  if (pert.hacking_vulnerability < 0.3 && pert.dependency_on_provider < 0.3 && pert.cascade_failure_risk < 0.3) {
    score += 2;
    details.push('Bajo riesgo perturbaciones introducidas');
  } else if (pert.hacking_vulnerability < 0.5 && pert.dependency_on_provider < 0.5) {
    score += 1;
    details.push('Riesgo moderado perturbaciones');
  }
  
  return { score: Math.min(score, 15), details };
}

function evaluateGovernance(gov: TranshumanismGovernance): { score: number; details: string[] } {
  let score = 0;
  const details: string[] = [];
  
  // Evaluación intergeneracional (0-5 pts)
  const ig = gov.intergenerational_assessment;
  let igScore = 0;
  if (ig.current_generation === 'positive') igScore += 1;
  if (ig.distribution_equity === 'equitable') igScore += 2;
  if (ig.territorial_regeneration === 'enhances') igScore += 1;
  if (ig.future_generations === 'positive') igScore += 1;
  score += igScore;
  details.push(`Intergeneracional: ${igScore}/5`);
  
  // Consejo de Futuros veto (0-3 pts)
  if (gov.council_future_veto.required && gov.council_future_veto.suspension_period_days <= 90) {
    score += 3;
    details.push('Consejo Futuros veto suspensivo ≤90 días');
  } else if (gov.council_future_veto.required) {
    score += 1;
    details.push('Consejo Futuros veto (período >90 días)');
  }
  
  // Acceso equitativo (0-3 pts)
  if (gov.access_rules.population === 'universal' && gov.access_rules.cost_sharing === 'solidarity') {
    score += 3;
    details.push('Acceso universal + solidaridad');
  } else if (gov.access_rules.population === 'therapeutic_only') {
    score += 2;
    details.push('Solo terapéutico (ético)');
  }
  
  // 1p1v invariantes (0-4 pts) - OBLIGATORIO
  const p = gov.power_concentration_checks;
  if (p.one_person_one_vote && !p.token_weighted_voting && !p.stake_weighted_voting && !p.reputation_weighted_voting) {
    score += 4;
    details.push('1p1v garantizado (invariantes OK)');
  } else {
    details.push('INVARIANTE 1p1v VIOLADO');
  }
  
  return { score: Math.min(score, 15), details };
}

function evaluateCare(care: CareIntegrationPlan, state: TerritorialStateVector): { score: number; details: string[] } {
  let score = 0;
  const details: string[] = [];
  
  // Equipo salud familiar asignado (0-3 pts)
  if (care.care_team.doctor && care.care_team.nurse && 
      care.care_team.auxiliary.length > 0 && care.care_team.community_agents.length >= 4) {
    score += 3;
    details.push('Equipo salud familiar completo (médico, enfermera, auxiliar, ≥4 agentes)');
  } else if (care.care_team.doctor && care.care_team.nurse) {
    score += 1;
    details.push('Equipo básico (médico + enfermera)');
  }
  
  // Monitoreo y alertas (0-2 pts)
  if (care.monitoring_protocol.frequency === 'continuous' || care.monitoring_protocol.frequency === 'daily') {
    score += 2;
    details.push(`Monitoreo ${care.monitoring_protocol.frequency} + escalamiento`);
  } else if (care.monitoring_protocol.frequency === 'weekly') {
    score += 1;
    details.push('Monitoreo semanal');
  }
  
  // Reversibilidad (0-3 pts)
  if (care.reversibility.disconnection_protocol && 
      care.reversibility.palliative_care_guaranteed &&
      care.reversibility.data_withdrawal_protocol &&
      care.reversibility.max_disconnection_time_hours <= 24) {
    score += 3;
    details.push('Reversibilidad completa ≤24h + paliativos + retiro datos');
  } else if (care.reversibility.disconnection_protocol && care.reversibility.palliative_care_guaranteed) {
    score += 2;
    details.push('Reversibilidad + paliativos');
  }
  
  // Prevención primero (0-2 pts)
  if (care.prevention_first.preventive_coverage_baseline >= 0.8) {
    score += 2;
    details.push(`Prevención base ${(care.prevention_first.preventive_coverage_baseline*100).toFixed(0)}% ≥ 80%`);
  } else if (care.prevention_first.preventive_coverage_baseline >= 0.5) {
    score += 1;
    details.push(`Prevención base ${(care.prevention_first.preventive_coverage_baseline*100).toFixed(0)}% ≥ 50%`);
  } else {
    details.push('Prevención base < 50% (enhancement prematuro)');
  }
  
  return { score: Math.min(score, 10), details };
}

function evaluateMemory(data: DataRightsPlan): { score: number; details: string[] } {
  let score = 0;
  const details: string[] = [];
  
  // Off-ledger (0-2 pts)
  if (data.off_ledger_storage.encryption && data.off_ledger_storage.access_log_immutable) {
    score += 2;
    details.push('Off-ledger cifrado + log accesos inmutable');
  }
  
  // Consentimiento revocable VC (0-2 pts)
  if (data.consent.revocable && data.consent.granular && data.consent.expiry_days <= 365) {
    score += 2;
    details.push('Consentimiento VC revocable, granular, re-consentimiento ≤1 año');
  }
  
  // Solo hashes en RAO (0-1 pt) - INVARIANTE
  if (data.rao_anchoring.only_hashes && data.rao_anchoring.salted) {
    score += 1;
    details.push('Solo hashes salted en RAO');
  } else {
    details.push('VIOLACIÓN: datos personales en RAO');
  }
  
  return { score: Math.min(score, 5), details };
}

function evaluateEcological(impact: MetabolicImpactAssessment, state: TerritorialStateVector): { score: number; details: string[] } {
  let score = 0;
  const details: string[] = [];
  
  // Score ecológico del estado actual
  // Usar ecologicalIndicators.computeEcologicalImpactScore si disponible
  // Aquí simplificado:
  if (state.biosphere.regeneration_net) score += 3;
  if (state.biosphere.soil_organic_carbon_percent >= 3) score += 2;
  if (state.water.availability_m3_per_day >= 50) score += 2;
  if (state.energy.net_balance_kwh_per_day >= 0) score += 3;
  
  details.push(`Estado ecológico base: ${score}/10`);
  
  // Plan de regeneración de la propuesta
  const regen = impact.regeneration_plan;
  if (regen.carbon_sequestration_kg_co2e_per_year > 10000) score += 2;
  if (regen.soil_regeneration_ha_per_year > 10) score += 2;
  if (regen.biodiversity_gain_index > 0.1) score += 2;
  
  return { score: Math.min(score, 10), details };
}

function evaluateReversibility(care: CareIntegrationPlan): { score: number; details: string[] } {
  let score = 0;
  const details: string[] = [];
  
  const r = care.reversibility;
  if (r.disconnection_protocol) score += 1;
  if (r.palliative_care_guaranteed) score += 1;
  if (r.data_withdrawal_protocol) score += 1;
  if (r.max_disconnection_time_hours <= 24) score += 2;
  else if (r.max_disconnection_time_hours <= 72) score += 1;
  
  details.push(`Reversibilidad: protocolo=${!!r.disconnection_protocol}, paliativos=${r.palliative_care_guaranteed}, retiro datos=${!!r.data_withdrawal_protocol}, tiempo máx=${r.max_disconnection_time_hours}h`);
  
  return { score: Math.min(score, 5), details };
}

function evaluateConsent(data: DataRightsPlan): { score: number; details: string[] } {
  let score = 0;
  const details: string[] = [];
  
  if (data.consent.revocable) score += 2;
  if (data.consent.granular) score += 1;
  if (data.consent.expiry_days <= 365) score += 1;
  if (data.off_ledger_storage.encryption) score += 1;
  
  details.push(`Consentimiento: revocable=${data.consent.revocable}, granular=${data.consent.granular}, expira=${data.consent.expiry_days}d, cifrado=${!!data.off_ledger_storage.encryption}`);
  
  return { score: Math.min(score, 5), details };
}

// ============================================================================
// HELPER: Crear propuesta desde formulario básico
// ============================================================================

export function createTranshumanismProposalDraft(
  name: string,
  category: TranshumanismProposal['category'],
  description: string,
  submitter: string
): TranshumanismProposal {
  return {
    id: `prop_${Date.now()}_${Math.random().toString(36).slice(2,9)}`,
    name,
    category,
    description,
    target_population: 'therapeutic',
    metabolic_impact: {
      material_balance: { inputs: [], outputs: [], net_ecological_impact: 0, autonomy_hours: 0, unexplained_difference_pct: 0 },
      critical_dependencies: { rare_earths: false, continuous_energy: false, specialized_maintenance: false, cooling_water: false, supply_chain_fragility: 0 },
      regeneration_plan: { carbon_sequestration_kg_co2e_per_year: 0, soil_regeneration_ha_per_year: 0, water_recharge_m3_per_year: 0, biodiversity_gain_index: 0 },
      validated_by: [], validated_at: 0, rao_credential_id: ''
    },
    cybernetic_impact: {
      ashby_variety_ratio: 1,
      introduced_perturbations: { hacking_vulnerability: 0, dependency_on_provider: 0, failure_modes: [], cascade_failure_risk: 0 },
      response_capacity: { local_repair: false, spare_parts_local: false, knowledge_distributed: false, fallback_mode: false },
      observability: { real_time_monitoring: false, anomaly_detection: false, audit_trail: false },
      validated_by: [], validated_at: 0
    },
    governance: {
      decision_model: 'assembly_consensus',
      intergenerational_assessment: { current_generation: 'neutral', distribution_equity: 'equitable', territorial_regeneration: 'maintains', future_generations: 'uncertain' },
      council_future_veto: { required: true, suspension_period_days: 90, appeal_process: 'assembly' },
      access_rules: { population: 'therapeutic_only', cost_sharing: 'solidarity', priority_criteria: ['therapeutic_need'] },
      power_concentration_checks: { token_weighted_voting: false, stake_weighted_voting: false, reputation_weighted_voting: false, one_person_one_vote: true },
      approved_by: [], approved_at: 0, rao_credential_id: ''
    },
    care_integration: {
      care_team: { doctor: '', nurse: '', auxiliary: [], community_agents: [], assigned_at: 0 },
      monitoring_protocol: { frequency: 'monthly', vital_signs: [], alert_thresholds: {}, escalation_path: [] },
      reversibility: { disconnection_protocol: '', palliative_care_guaranteed: false, data_withdrawal_protocol: '', max_disconnection_time_hours: 72 },
      prevention_first: { preventive_coverage_baseline: 0, enhancement_conditional_on: [] },
      approved_by: [], approved_at: 0
    },
    data_rights: {
      sensitive_data_categories: [],
      off_ledger_storage: { provider: '', encryption: 'AES-256-GCM', key_management: 'threshold_shamir', access_log_immutable: true },
      consent: { vc_credential_id: '', revocable: true, granular: true, expiry_days: 365 },
      rao_anchoring: { only_hashes: true, hash_algorithm: 'SHA-256', salted: true },
      withdrawal: { protocol: '', max_time_hours: 24, rao_hash_retention: 'permanent_proof_only' },
      inheritance: { therapeutic_knowledge: 'open_license', enhancement_protocols: 'no_privilege', personal_data: 'deleted_on_death', attribution_historical: true },
      approved_by: [], approved_at: 0
    },
    scorecard: { metabolic_score: 0, cybernetic_score: 0, governance_score: 0, care_score: 0, memory_score: 0, ecological_score: 0, reversibility_score: 0, consent_score: 0, total_score: 0, verdict: 'rejected', evaluated_at: 0, evaluated_by: [], rao_credential_id: '' },
    status: 'draft',
    submitted_by: submitter,
    submitted_at: Date.now()
  };
}

// ============================================================================
// VALIDACIONES ESPECIALIZADAS POR DIMENSIÓN
// ============================================================================

export interface TranshumanismMetabolicValidation {
  passed: boolean;
  ecological_impact_score: number;
  autonomy_hours: number;
  unexplained_difference_pct: number;
  critical_dependencies: string[];
  blockers: string[];
  warnings: string[];
}

export function validateTranshumanismMetabolic(
  proposal: MetabolicImpactAssessment,
  state: TerritorialStateVector
): TranshumanismMetabolicValidation {
  const blockers: string[] = [];
  const warnings: string[] = [];
  
  const ecoScore = proposal.material_balance.net_ecological_impact;
  if (ecoScore < 0) blockers.push(`Impacto ecológico NETO NEGATIVO (${ecoScore.toFixed(2)}): deuda metabólica`);
  
  if (proposal.material_balance.autonomy_hours < 24) blockers.push(`Autonomía infraestructura (${proposal.material_balance.autonomy_hours}h) < 24h mín`);
  else if (proposal.material_balance.autonomy_hours < 72) warnings.push(`Autonomía infraestructura (${proposal.material_balance.autonomy_hours}h) < 72h objetivo`);
  
  if (proposal.material_balance.unexplained_difference_pct > 0.10) blockers.push(`Diff no explicada (${(proposal.material_balance.unexplained_difference_pct*100).toFixed(1)}%) > 10%`);
  else if (proposal.material_balance.unexplained_difference_pct > 0.05) warnings.push(`Diff no explicada (${(proposal.material_balance.unexplained_difference_pct*100).toFixed(1)}%) > 5%`);
  
  const deps = proposal.critical_dependencies;
  const criticalDeps: string[] = [];
  if (deps.rare_earths) criticalDeps.push('Tierras raras');
  if (deps.continuous_energy) criticalDeps.push('Energía continua');
  if (deps.specialized_maintenance) criticalDeps.push('Mantenimiento especializado');
  if (deps.cooling_water) criticalDeps.push('Agua refrigeración');
  if (deps.supply_chain_fragility > 0.5) criticalDeps.push('Cadena suministro frágil');
  
  if (!state.biosphere.regeneration_net) warnings.push('Territorio no tiene regeneración neta');
  if (state.biosphere.soil_organic_carbon_percent < 3) warnings.push(`Suelo degradado (C orgánico ${state.biosphere.soil_organic_carbon_percent}% < 3%)`);
  if (state.water.availability_m3_per_day < 50) warnings.push(`Estrés hídrico (${state.water.availability_m3_per_day} m³/día/hab < 50)`);
  if (state.energy.net_balance_kwh_per_day < 0) warnings.push(`Balance energético neto negativo (${state.energy.net_balance_kwh_per_day} kWh/día)`);
  
  return { passed: blockers.length === 0, ecological_impact_score: ecoScore, autonomy_hours: proposal.material_balance.autonomy_hours, unexplained_difference_pct: proposal.material_balance.unexplained_difference_pct, critical_dependencies: criticalDeps, blockers, warnings };
}

export interface TranshumanismCyberneticValidation {
  passed: boolean;
  ashby_variety_ratio: number;
  response_capacity_score: number;
  observability_score: number;
  introduced_perturbation_risk: number;
  blockers: string[];
  warnings: string[];
}

export function validateTranshumanismCybernetic(proposal: CyberneticImpactAssessment): TranshumanismCyberneticValidation {
  const blockers: string[] = []; const warnings: string[] = [];
  const ashbyRatio = proposal.ashby_variety_ratio;
  if (ashbyRatio < 1.0) blockers.push(`Ashby ratio ${ashbyRatio.toFixed(2)} < 1.0: capacidad respuesta < variedad perturbaciones`);
  else if (ashbyRatio < 1.5) warnings.push(`Ashby ratio ${ashbyRatio.toFixed(2)} < 1.5: margen estrecho`);
  
  const resp = proposal.response_capacity;
  let respScore = 0;
  if (resp.local_repair) respScore++; if (resp.spare_parts_local) respScore++; if (resp.knowledge_distributed) respScore++; if (resp.fallback_mode) respScore++;
  if (respScore < 2) blockers.push(`Capacidad respuesta ${respScore}/4: insuficiente (necesita ≥2)`); else if (respScore < 3) warnings.push(`Capacidad respuesta ${respScore}/4: mejorable`);
  
  const obs = proposal.observability; let obsScore = 0;
  if (obs.real_time_monitoring) obsScore++; if (obs.anomaly_detection) obsScore++; if (obs.audit_trail) obsScore++;
  if (obsScore < 2) warnings.push(`Observabilidad ${obsScore}/3: limitada`);
  
  const pert = proposal.introduced_perturbations;
  const maxRisk = Math.max(pert.hacking_vulnerability, pert.dependency_on_provider, pert.cascade_failure_risk);
  if (maxRisk > 0.7) blockers.push(`Riesgo perturbación introducida ${maxRisk.toFixed(2)} > 0.7`); else if (maxRisk > 0.4) warnings.push(`Riesgo perturbación introducida ${maxRisk.toFixed(2)} > 0.4`);
  
  return { passed: blockers.length === 0, ashby_variety_ratio: ashbyRatio, response_capacity_score: respScore, observability_score: obsScore, introduced_perturbation_risk: maxRisk, blockers, warnings };
}

export interface TranshumanismGovernanceValidation {
  passed: boolean;
  intergenerational_score: number;
  council_future_veto: boolean;
  access_equity: 'universal' | 'therapeutic_only' | 'enhancement_by_assembly' | 'exclusionary';
  one_person_one_vote: boolean;
  blockers: string[];
  warnings: string[];
}

export function validateTranshumanismGovernance(proposal: TranshumanismGovernance): TranshumanismGovernanceValidation {
  const blockers: string[] = []; const warnings: string[] = [];
  const p = proposal.power_concentration_checks;
  const onePersonOneVote = p.one_person_one_vote && !p.token_weighted_voting && !p.stake_weighted_voting && !p.reputation_weighted_voting;
  if (!onePersonOneVote) blockers.push('INVARIANTE VIOLADO: no es 1p1v (token/stake/reputation weighted voting)');
  
  const ig = proposal.intergenerational_assessment;
  let igScore = 0;
  if (ig.current_generation === 'positive') igScore++; if (ig.distribution_equity === 'equitable') igScore++; if (ig.territorial_regeneration === 'enhances') igScore++; if (ig.future_generations === 'positive') igScore++;
  if (igScore < 3) warnings.push(`Evaluación intergeneracional ${igScore}/4: < 3 dimensiones positivas`);
  
  const hasCouncilVeto = proposal.council_future_veto.required && proposal.council_future_veto.suspension_period_days <= 90;
  if (!proposal.council_future_veto.required && proposal.access_rules.population !== 'therapeutic_only') blockers.push('Enhancement_healthy REQUIERE Consejo de Futuros con veto suspensivo');
  else if (!hasCouncilVeto && proposal.council_future_veto.required) warnings.push('Consejo Futuros período > 90 días');
  
  let accessEquity: TranshumanismGovernanceValidation['access_equity'];
  if (proposal.access_rules.population === 'universal' && proposal.access_rules.cost_sharing === 'solidarity') accessEquity = 'universal';
  else if (proposal.access_rules.population === 'therapeutic_only') accessEquity = 'therapeutic_only';
  else if (proposal.access_rules.population === 'enhancement_by_assembly') accessEquity = 'enhancement_by_assembly';
  else { accessEquity = 'exclusionary'; blockers.push('Acceso excluyente (no universal, no terapéutico, no por asamblea)'); }
  
  return { passed: blockers.length === 0, intergenerational_score: igScore, council_future_veto: hasCouncilVeto, access_equity: accessEquity, one_person_one_vote: onePersonOneVote, blockers, warnings };
}

export interface TranshumanismCareValidation {
  passed: boolean;
  care_team_complete: boolean;
  prevention_baseline: number;
  reversibility_complete: boolean;
  blockers: string[];
  warnings: string[];
}

export function validateTranshumanismCare(proposal: CareIntegrationPlan, state: TerritorialStateVector): TranshumanismCareValidation {
  const blockers: string[] = []; const warnings: string[] = [];
  const team = proposal.care_team;
  const teamComplete = team.doctor && team.nurse && team.auxiliary.length > 0 && team.community_agents.length >= 4;
  if (!teamComplete) {
    if (!team.doctor || !team.nurse) blockers.push('Equipo salud familiar incompleto: falta médico o enfermera');
    else if (team.auxiliary.length === 0) warnings.push('Equipo sin auxiliar');
    else if (team.community_agents.length < 4) warnings.push(`Agentes comunitarios: ${team.community_agents.length}/4 mín`);
  }
  const preventionBaseline = proposal.prevention_first.preventive_coverage_baseline;
  if (preventionBaseline < 0.5) blockers.push(`Prevención base ${(preventionBaseline*100).toFixed(0)}% < 50%: enhancement prematuro`); else if (preventionBaseline < 0.8) warnings.push(`Prevención base ${(preventionBaseline*100).toFixed(0)}% < 80% objetivo`);
  
  const rev = proposal.reversibility;
  const reversibilityComplete = rev.disconnection_protocol && rev.palliative_care_guaranteed && rev.data_withdrawal_protocol && rev.max_disconnection_time_hours <= 24;
  if (!rev.disconnection_protocol) blockers.push('Falta protocolo desconexión');
  if (!rev.palliative_care_guaranteed) blockers.push('Paliativos no garantizados');
  if (!rev.data_withdrawal_protocol) blockers.push('Falta protocolo retiro datos biométricos');
  if (rev.max_disconnection_time_hours > 72) warnings.push(`Tiempo máx desconexión ${rev.max_disconnection_time_hours}h > 72h`); else if (rev.max_disconnection_time_hours > 24) warnings.push(`Tiempo máx desconexión ${rev.max_disconnection_time_hours}h > 24h`);
  
  const territoryPrevention = state.care.preventive_coverage_effective;
  if (territoryPrevention < 0.7) warnings.push(`Cobertura preventiva territorial ${(territoryPrevention*100).toFixed(0)}% < 70%`);
  
  return { passed: blockers.length === 0, care_team_complete: teamComplete, prevention_baseline: preventionBaseline, reversibility_complete: reversibilityComplete, blockers, warnings };
}

export interface TranshumanismMemoryValidation {
  passed: boolean;
  off_ledger: boolean;
  consent_revocable: boolean;
  consent_granular: boolean;
  consent_expiry_ok: boolean;
  rao_only_hashes: boolean;
  inheritance_correct: boolean;
  blockers: string[];
  warnings: string[];
}

export function validateTranshumanismMemory(proposal: DataRightsPlan): TranshumanismMemoryValidation {
  const blockers: string[] = []; const warnings: string[] = [];
  const offLedger = proposal.off_ledger_storage.encryption && proposal.off_ledger_storage.access_log_immutable;
  if (!offLedger) blockers.push('Almacenamiento off-ledger: falta cifrado o log accesos inmutable');
  const consent = proposal.consent;
  if (!consent.revocable) blockers.push('Consentimiento NO revocable (INVARIANTE)');
  if (!consent.granular) blockers.push('Consentimiento NO granular (INVARIANTE)');
  if (consent.expiry_days > 365) warnings.push(`Re-consentimiento ${consent.expiry_days}d > 365d`);
  
  const raoOnlyHashes = proposal.rao_anchoring.only_hashes && proposal.rao_anchoring.salted;
  if (!raoOnlyHashes) blockers.push('VIOLACIÓN: datos personales en RAO (solo hashes salted permitidos)');
  
  const inh = proposal.inheritance;
  const inheritanceCorrect = inh.therapeutic_knowledge === 'open_license' && inh.enhancement_protocols === 'no_privilege' && inh.personal_data === 'deleted_on_death' && inh.attribution_historical === true;
  if (!inheritanceCorrect) blockers.push('Reglas herencia incorrectas: therapeutic≠open_license, enhancement≠no_privilege, personal≠deleted');
  
  return { passed: blockers.length === 0, off_ledger: offLedger, consent_revocable: consent.revocable, consent_granular: consent.granular, consent_expiry_ok: consent.expiry_days <= 365, rao_only_hashes: raoOnlyHashes, inheritance_correct: inheritanceCorrect, blockers, warnings };
}

// ============================================================================
// EVALUACIÓN COMPLETA CON DESGLOSE
// ============================================================================

export interface ComprehensiveEvaluationResult {
  overall: EvaluationResult;
  metabolic: TranshumanismMetabolicValidation;
  cybernetic: TranshumanismCyberneticValidation;
  governance: TranshumanismGovernanceValidation;
  care: TranshumanismCareValidation;
  memory: TranshumanismMemoryValidation;
  summary: { total_blockers: number; total_warnings: number; ready_for: 'rejected' | 'pilot' | 'scaling' | 'needs_revision'; next_steps: string[]; };
}

export function evaluateCanutricioTranshumanismComprehensive(proposal: TranshumanismProposal, state: TerritorialStateVector, scenarios: any[]): ComprehensiveEvaluationResult {
  const overall = evaluateCanutricioTranshumanism(proposal, state, scenarios);
  const metabolic = validateTranshumanismMetabolic(proposal.metabolic_impact, state);
  const cybernetic = validateTranshumanismCybernetic(proposal.cybernetic_impact);
  const governance = validateTranshumanismGovernance(proposal.governance);
  const care = validateTranshumanismCare(proposal.care_integration, state);
  const memory = validateTranshumanismMemory(proposal.data_rights);
  
  const allBlockers = [...overall.blockers, ...metabolic.blockers, ...cybernetic.blockers, ...governance.blockers, ...care.blockers, ...memory.blockers];
  const allWarnings = [...overall.warnings, ...metabolic.warnings, ...cybernetic.warnings, ...governance.warnings, ...care.warnings, ...memory.warnings];
  
  let readyFor: ComprehensiveEvaluationResult['summary']['ready_for'] = 'rejected';
  if (allBlockers.length === 0) readyFor = overall.scorecard.total_score >= 85 ? 'scaling' : overall.scorecard.total_score >= 70 ? 'pilot' : 'needs_revision';
  
  const nextSteps: string[] = [];
  if (allBlockers.length > 0) { nextSteps.push(`Resolver ${allBlockers.length} bloqueadores antes de re-evaluar`); allBlockers.forEach(b => nextSteps.push(`  - ${b}`)); }
  if (allWarnings.length > 0 && allBlockers.length === 0) { nextSteps.push(`Atender ${allWarnings.length} advertencias para mejorar score`); allWarnings.slice(0, 3).forEach(w => nextSteps.push(`  - ${w}`)); }
  if (readyFor === 'pilot') nextSteps.push('Proceder a piloto Fase 1: comité ética + consentimiento + monitoreo');
  if (readyFor === 'scaling') nextSteps.push('Aprobado para escalamiento: asamblea + Consejo Futuros + implementación federada');
  
  return { overall: { ...overall, blockers: allBlockers, warnings: allWarnings }, metabolic, cybernetic, governance, care, memory, summary: { total_blockers: allBlockers.length, total_warnings: allWarnings.length, ready_for: readyFor, next_steps: nextSteps } };
}

// ============================================================================
// PROTOCOLO DE PILOTO
// ============================================================================

export interface PilotProtocol {
  proposal_id: string; phase: 1 | 2 | 3; duration_months: number; cohort_size: number;
  inclusion_criteria: string[]; exclusion_criteria: string[]; primary_endpoints: string[];
  safety_monitoring: { frequency: string; stopping_rules: string[]; data_safety_monitoring_board: string[]; };
  ethical_oversight: { ethics_committee: string[]; council_future_review: boolean; community_consent: boolean; };
  metabolic_monitoring: { ecological_impact_tracking: boolean; autonomy_verification: boolean; resource_consumption_tracking: boolean; };
  data_governance: { off_ledger_confirmed: boolean; consent_management: 'VC_W3C'; withdrawal_protocol_tested: boolean; };
  rao_credential_id: string;
}

export function generatePilotProtocol(proposal: TranshumanismProposal, state: TerritorialStateVector, evaluation: EvaluationResult): PilotProtocol {
  const isScaling = evaluation.scorecard.verdict === 'scaling';
  const isPilot = evaluation.scorecard.verdict === 'pilot';
  return {
    proposal_id: proposal.id, phase: isScaling ? 3 : (isPilot ? 1 : 1), duration_months: isScaling ? 24 : 12, cohort_size: isScaling ? 100 : 30,
    inclusion_criteria: ['Consentimiento VC firmado y vigente', 'Perfil terapéutico validado por equipo salud familiar', 'No contraindicaciones metabólicas (balance cerrado)', 'Afiliado/a nodo con participación activa'],
    exclusion_criteria: ['Embarazo/lactancia', 'Enfermedad terminal no relacionada con intervención', 'Incapacidad para consentimiento revocable informado', 'Participación en otro ensayo intervencionista'],
    primary_endpoints: ['Seguridad: eventos adversos graves, mortalidad, discontinuación', 'Eficacia: endpoint clínico primario según categoría', 'Metabólico: ecologicalImpactScore ≥ 0 mantenido', 'Cibernético: sin incidentes seguridad (hacking, fallo crítico)', 'Cuidado: adherencia monitoreo + satisfacción equipo salud familiar', 'Gobernanza: 1p1v efectivo, Consejo Futuros sin veto no justificado'],
    safety_monitoring: { frequency: 'continua (vital signs) + semanal (equipo salud) + mensual (comité ética)', stopping_rules: ['Eventos adversos graves > 5% cohorte', 'EcologicalImpactScore < 0 en 2 mediciones consecutivas', 'Fallo reversibilidad > 24h', 'Violación 1p1v o concentración poder detectada'], data_safety_monitoring_board: proposal.care_integration.care_team.escalation_path },
    ethical_oversight: { ethics_committee: ['Comité ética nodo', 'Representante Consejo Futuros', 'Defensor derechos digitales'], council_future_review: true, community_consent: proposal.governance.access_rules.population === 'universal' },
    metabolic_monitoring: { ecological_impact_tracking: true, autonomy_verification: true, resource_consumption_tracking: true },
    data_governance: { off_ledger_confirmed: proposal.data_rights.off_ledger_storage.encryption, consent_management: 'VC_W3C', withdrawal_protocol_tested: true },
    rao_credential_id: `RAO:canutricio_pilot:${proposal.id}:${Date.now()}`
  };
}

// ============================================================================
// HELPERS
// ============================================================================

export function categorizeTranshumanism(category: TranshumanismProposal['category']): string { const categories: Record<string, string> = { 'life_extension': 'Extensión de vida / Geroterapia', 'cognitive_enhancement': 'Mejora cognitiva / Nootrópicos / BCI', 'physical_enhancement': 'Mejora física / Prótesis avanzadas / Exoesqueletos', 'sensory_augmentation': 'Aumento sensorial / Implantes sensoriales', 'mind_uploading': 'Carga mental / Inmortalidad digital', 'genetic_modification': 'Modificación genética / Edición germinal', 'other': 'Otra intervención transhumanista' }; return categories[category] || category; }
export function isTherapeutic(target: TranshumanismProposal['target_population']): boolean { return target === 'therapeutic' || target === 'preventive'; }
export function requiresCouncilFutureVeto(target: TranshumanismProposal['target_population']): boolean { return target === 'enhancement_healthy'; }
export function getEnhancementConditionalOn(care: CareIntegrationPlan): string[] { return [`Cobertura preventiva base ≥ 80% (actual: ${(care.prevention_first.preventive_coverage_baseline*100).toFixed(0)}%)`, 'Necesidades no satisfechas < 10%', 'Evaluación intergeneracional ≥ 3/4 positivas', 'EcologicalImpactScore ≥ 0 verificado', 'Consentimiento VC revocable vigente', 'Equipo salud familiar asignado y operativo', 'Protocolo reversibilidad probado ≤ 24h']; }