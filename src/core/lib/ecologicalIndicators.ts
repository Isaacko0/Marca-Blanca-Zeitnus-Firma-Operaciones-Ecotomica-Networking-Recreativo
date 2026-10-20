// HSCSG v15 OS — Indicadores Ecológicos y Convención de Signo Unificada
// Resuelve inconsistencia entre computeStackMetrics() y validateTourismCoherence()

// ============================================================================
// CONVENCIÓN DE SIGNO ECOLÓGICO
// ============================================================================

/**
 * Convención adoptada: REGENERACIÓN NETA = POSITIVO (más intuitivo)
 * - ecologicalImpactScore > 0  → regeneración neta (el sistema mejora su base ecológica)
 * - ecologicalImpactScore < 0  → degradación neta (el sistema pierde base ecológica)
 * - ecologicalImpactScore = 0  → neutro (steady state)
 * 
 * Esta convención es consistente con:
 * - Matema 21: "La abundancia que regenera sus condiciones de existencia es una herencia"
 * - Planetary boundaries: transgresión = negativo, espacio seguro = positivo
 * - Regeneration ratio > 1 = regeneración (positivo)
 */

export type EcologicalImpactConvention = 'negative_is_regeneration' | 'positive_is_regeneration';

export const ECOLOGICAL_CONVENTION: EcologicalImpactConvention = 'positive_is_regeneration';

export interface EcologicalImpactScore {
  score: number;                    // >0 regeneración, <0 degradación, =0 neutro
  convention: EcologicalImpactConvention;
  breakdown: EcologicalBreakdown;
  measured_at: number;
  methodology: string;
}

export interface EcologicalBreakdown {
  energy_ratio: number;             // generación / consumo (>1 = regeneración energética)
  water_ratio: number;              // recarga / consumo (>1 = regeneración hídrica)
  biomass_ratio: number;            // producción / consumo (>1 = regeneración biomasa)
  carbon_ratio: number;             // remociones / emisiones (>1 = remoción neta)
  soil_regeneration_index: number;  // 0-1 (1 = regeneración máxima)
  biodiversity_index: number;       // 0-1
  composite_score: number;          // promedio ponderado
}

/**
 * Normaliza un score ecológico a la convención canónica (positivo = regeneración)
 */
export function normalizeEcologicalImpact(
  rawScore: number, 
  fromConvention: EcologicalImpactConvention
): number {
  if (fromConvention === 'negative_is_regeneration') {
    return -rawScore; // Invertir: -(-regeneration) = +regeneration
  }
  return rawScore; // Ya en convención positiva
}

/**
 * Calcula el score ecológico compuesto desde cuentas separadas
 * Convención: >0 = regeneración neta, <0 = degradación neta
 */
export function computeEcologicalImpactScore(accounts: {
  energy: { net_balance_kwh: number; renewable_share: number; };
  water: { recharge_m3: number; consumption_m3: number; };
  biomass: { production_kg: number; consumption_kg: number; diversity_index: number; };
  carbon: { net_kg_co2e: number; };  // positivo = remoción neta
  soil: { organic_carbon_percent: number; biodiversity_index: number; regeneration_net: boolean; };
}): EcologicalImpactScore {
  const breakdown: EcologicalBreakdown = {
    energy_ratio: accounts.energy.consumption_kwh > 0 
      ? accounts.energy.generation_kwh / accounts.energy.consumption_kwh 
      : accounts.energy.generation_kwh > 0 ? Infinity : 0,
    water_ratio: accounts.water.consumption_m3 > 0
      ? accounts.water.recharge_m3 / accounts.water.consumption_m3
      : accounts.water.recharge_m3 > 0 ? Infinity : 0,
    biomass_ratio: accounts.biomass.consumption_kg > 0
      ? accounts.biomass.production_kg / accounts.biomass.consumption_kg
      : accounts.biomass.production_kg > 0 ? Infinity : 0,
    carbon_ratio: accounts.carbon.emissions_kg_co2e > 0
      ? accounts.carbon.removals_kg_co2e / accounts.carbon.emissions_kg_co2e
      : accounts.carbon.removals_kg_co2e > 0 ? Infinity : 0,
    soil_regeneration_index: Math.min(1, Math.max(0, 
      (accounts.soil.organic_carbon_percent - 1) / 4 // 1-5% → 0-1
    )),
    biodiversity_index: accounts.soil.biodiversity_index,
    composite_score: 0 // se calcula abajo
  };
  
  // Score compuesto: promedio ponderado de ratios >1
  const ratios = [
    breakdown.energy_ratio,
    breakdown.water_ratio,
    breakdown.biomass_ratio,
    breakdown.carbon_ratio,
    breakdown.soil_regeneration_index,
    breakdown.biodiversity_index
  ];
  
  // Convertir ratios a score: ratio > 1 → positivo, ratio < 1 → negativo
  const ratioScores = ratios.map(r => {
    if (r === Infinity) return 1;      // máximo regeneración
    if (r >= 1) return (r - 1) / r;    // 1→0, 2→0.5, 10→0.9
    if (r > 0) return -(1 - r);        // 0.5→-0.5, 0.1→-0.9
    return -1;                          // 0 → degradación total
  });
  
  // Pesos: energía 0.25, agua 0.2, biomasa 0.2, carbono 0.15, suelo 0.1, biodiversidad 0.1
  const weights = [0.25, 0.2, 0.2, 0.15, 0.1, 0.1];
  breakdown.composite_score = ratioScores.reduce((sum, score, i) => sum + score * weights[i], 0);
  
  // Score final: -1 a +1
  const score = Math.max(-1, Math.min(1, breakdown.composite_score));
  
  return {
    score,
    convention: 'positive_is_regeneration',
    breakdown,
    measured_at: Date.now(),
    methodology: 'weighted_ratio_scores_v1'
  };
}

/**
 * Convierte regenerationRatio (computeStackMetrics) a ecologicalImpactScore
 * regenerationRatio = produced / consumed (TQ/kWh)
 * En computeStackMetrics: ecologicalImpactScore = regenerationRatio * 100
 * 
 * Problema: regenerationRatio > 1 → score > 100 (positivo = bueno)
 * Pero validateTourismCoherence espera ecologicalImpactScore < 0 para regeneración
 * 
 * Solución: normalizeEcologicalImpact une ambas convenciones
 */
export function regenerationRatioToImpactScore(
  regenerationRatio: number,
  fromConvention: EcologicalImpactConvention = 'negative_is_regeneration'
): number {
  // computeStackMetrics usa: ecologicalImpactScore = regenerationRatio * 100
  // Si regenerationRatio > 1 → score > 100 (positivo = regeneración en ESA convención)
  // Pero validateTourismCoherence espera < 0 para regeneración
  
  // Asumimos que computeStackMetrics usa 'positive_is_regeneration' implícitamente
  // porque regenerationRatio > 1 = bueno = positivo
  // El bug está en validateTourismCoherence que espera lo contrario
  
  // Unificamos: devolvemos score normalizado -1 a +1
  if (regenerationRatio >= 1) {
    return (regenerationRatio - 1) / regenerationRatio; // 1→0, 2→0.5, ∞→1
  } else if (regenerationRatio > 0) {
    return -(1 - regenerationRatio); // 0.5→-0.5, 0.1→-0.9
  }
  return -1; // 0 = degradación total
}

/**
 * Valida coherencia entre módulos usando convención unificada
 */
export function validateEcologicalCoherence(
  computeStackMetrics_result: { ecologicalImpactScore: number; regenerationRatio: number },
  tourismCoherence_result: { ecologicalImpactScore: number }
): { coherent: boolean; unified_score: number; issues: string[] } {
  const issues: string[] = [];
  
  // Convertir ambos a convención canónica (-1 a +1)
  const stack_score = regenerationRatioToImpactScore(computeStackMetrics_result.regenerationRatio);
  const tourism_score = normalizeEcologicalImpact(
    tourismCoherence_result.ecologicalImpactScore, 
    'negative_is_regeneration' // validateTourismCoherence espera <0 para regeneración
  );
  
  const diff = Math.abs(stack_score - tourism_score);
  
  if (diff > 0.1) {
    issues.push(`Discrepancia score ecológico: stack=${stack_score.toFixed(3)} vs tourism=${tourism_score.toFixed(3)} (diff=${diff.toFixed(3)})`);
  }
  
  // Score unificado: promedio
  const unified_score = (stack_score + tourism_score) / 2;
  
  return {
    coherent: diff <= 0.1,
    unified_score,
    issues
  };
}

/**
 * Para uso en validateTourismCoherence() - CORREGIDO
 * Convención: ecologicalImpactScore < 0 = degradación, > 0 = regeneración
 */
export function validateTourismCoherenceFixed(design: {
  carryingCapacity: { maxVisitorsPerDay: number; recoveryDaysBetweenGroups: number; };
  safetyAndCoherence: { guideRatio: number; trails: any[]; emergencyPlan: { evacuationRoutes: string[] } };
  experiences: Array<{ priceZNU: number; tqGenerated: number; ecologicalImpact: number; }>;
  metrics: { ecologicalImpactScore: number; visitorSatisfaction: number; };
}): boolean {
  const { carryingCapacity, safetyAndCoherence, experiences, metrics } = design;
  
  // Validar capacidad de carga
  if (carryingCapacity.maxVisitorsPerDay <= 0) return false;
  if (carryingCapacity.recoveryDaysBetweenGroups < 1) return false;
  
  // Validar seguridad
  if (safetyAndCoherence.guideRatio <= 0) return false;
  if (safetyAndCoherence.trails.length === 0) return false;
  if (safetyAndCoherence.emergencyPlan.evacuationRoutes.length === 0) return false;
  
  // Validar experiencias
  if (experiences.length === 0) return false;
  for (const exp of experiences) {
    if (exp.priceZNU <= 0) return false;
    if (exp.tqGenerated < 0) return false;
    // ecologicalImpact: >0 = regeneración (convención unificada)
    if (exp.ecologicalImpact <= 0) return false; // Debe ser regeneración neta
  }
  
  // Validar métricas con convención unificada
  // metrics.ecologicalImpactScore > 0 = regeneración neta
  if (metrics.ecologicalImpactScore <= 0) return false;
  if (metrics.visitorSatisfaction < 0 || metrics.visitorSatisfaction > 100) return false;
  
  return true;
}

/**
 * Para uso en computeStackMetrics() - CORREGIDO
 * Retorna ecologicalImpactScore en convención unificada (-1 a +1)
 */
export function computeStackMetricsFixed(stack: {
  marketGarden: { tqProductionPerM2: number; hectares: number; biowasteToCompost: number; };
  pasturedPoultry: { tqPerBirdPerMonth: number; birdCount: number; manureKwhPerMonth: number; };
  perennialPolyculture: { tqPerHectarePerYear: number; hectares: number; avoidedFertilizerKwh: number; carbonSequestrationKwh: number; };
  agroforestry: { tqPerHectarePerYear: number; hectares: number; carbonSequestrationKwh: number; };
  regenerativeTourism: { tqPerVisitor: number; visitorsPerMonth: number; opexReduction: number; };
  totalArea: number;
}): {
  ecologicalImpactScore: number;  // -1 a +1 (convención unificada)
  regenerationRatio: number;      // produced/consumed
  // ... otras métricas
} {
  const produced = 
    stack.marketGarden.tqProductionPerM2 * stack.marketGarden.hectares * 10000 +
    stack.pasturedPoultry.tqPerBirdPerMonth * stack.pasturedPoultry.birdCount +
    stack.perennialPolyculture.tqPerHectarePerYear * stack.perennialPolyculture.hectares / 12 +
    stack.agroforestry.tqPerHectarePerYear * stack.agroforestry.hectares / 12 +
    stack.regenerativeTourism.tqPerVisitor * stack.regenerativeTourism.visitorsPerMonth;
  
  const consumed = stack.totalArea * 10; // kWh/m² target
  const regenerationRatio = consumed > 0 ? produced / consumed : 0;
  
  // Score en convención unificada (-1 a +1)
  const ecologicalImpactScore = regenerationRatioToImpactScore(regenerationRatio);
  
  return {
    ecologicalImpactScore,
    regenerationRatio,
    opexAvoided: stack.marketGarden.biowasteToCompost + stack.pasturedPoultry.manureKwhPerMonth + 
                 stack.perennialPolyculture.avoidedFertilizerKwh + stack.agroforestry.carbonSequestrationKwh + 
                 stack.regenerativeTourism.opexReduction,
    tqGenerated: produced,
    // ... otras métricas
  };
}