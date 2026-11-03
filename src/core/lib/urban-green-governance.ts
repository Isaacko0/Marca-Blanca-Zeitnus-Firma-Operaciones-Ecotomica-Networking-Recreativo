// urban-green-governance.ts — Lógica pura SBN + Gobernanza del Suelo Urbano
// Principio Anfibio: postmonetario (ZNU/CaaS) ↔ conectado (USD/USDC vía priceParity)

import type {
  SBNProject,
  EcosystemServices,
  GreenROI,
  UrbanMicroclimate,
  MicroclimateScenario,
  ProjectGovernance,
  GovernanceActor,
  ProjectFinancing,
  FundingSource,
  LandValueCaptureConfig,
  GreenBondConfig,
  CaasStreamConfig,
  LandValueCapture,
  GovernanceInstrument,
  GovernanceCoordination,
  Contradiction,
  SharedStrategy,
  ImplementationStep,
  MonitoringIndicator,
  GovernanceActor,
  UrbanGreenState,
} from '@core/lib/urban-green-governance-types';

// ============================================================================
// CONSTANTES Y REFERENCIAS (Smith & Harvey-Brown 2018, UN DESA 2018)
// ============================================================================

// Factores de conversión basados en Smith & Harvey-Brown 2018
const ECOSYSTEM_SERVICE_FACTORS = {
  // Por hectárea al año (valores promedio globales, ajustar por contexto)
  co2Sequestration_tonnes_per_ha_year: 2.5,           // toneladas CO₂/ha/año
  waterRetention_m3_per_ha_year: 1500,                // m³ agua/ha/año
  pollutionRemoval_kg_per_ha_year: 50,                // kg contaminación/ha/año
  energySavings_kwh_per_ha_year: 2000,                // kWh ahorro/ha/año
  // Valor económico por unidad (USD)
  co2Value_usd_per_tonne: 50,                         // $/tonelada CO₂ (precio carbono social)
  waterValue_usd_per_m3: 0.50,                        // $/m³ agua
  pollutionValue_usd_per_kg: 100,                     // $/kg contaminación
  energyValue_usd_per_kwh: 0.10,                      // $/kWh
};

// Tipos de SBN y multiplicadores de efectividad
const SBN_TYPE_MULTIPLIERS: Record<string, { co2: number; water: number; pollution: number; energy: number }> = {
  urban_park: { co2: 1.0, water: 1.2, pollution: 1.0, energy: 1.1 },
  botanical_garden: { co2: 1.3, water: 1.0, pollution: 1.2, energy: 0.9 },
  street_trees: { co2: 0.8, water: 0.7, pollution: 1.3, energy: 1.5 },
  green_roof: { co2: 0.5, water: 1.5, pollution: 0.8, energy: 1.3 },
  rain_garden: { co2: 0.3, water: 2.0, pollution: 1.0, energy: 0.5 },
  wetland: { co2: 2.0, water: 3.0, pollution: 1.5, energy: 0.3 },
  urban_forest: { co2: 1.5, water: 1.3, pollution: 1.2, energy: 1.0 },
  green_corridor: { co2: 1.1, water: 1.1, pollution: 1.1, energy: 1.0 },
  industrial_green_buffer: { co2: 0.9, water: 1.0, pollution: 1.5, energy: 0.8 },
  community_garden: { co2: 0.6, water: 0.8, pollution: 0.7, energy: 0.6 },
};

// ============================================================================
// DV-SBN-01: calculateEcosystemServices
// ============================================================================

export function calculateEcosystemServices(
  project: Pick<SBNProject, 'type' | 'location'> & { area_hectares: number }
): EcosystemServices {
  const multipliers = SBN_TYPE_MULTIPLIERS[project.type] || SBN_TYPE_MULTIPLIERS.urban_park;
  const area = project.area_hectares;

  const co2 = ECOSYSTEM_SERVICE_FACTORS.co2Sequestration_tonnes_per_ha_year * area * multipliers.co2;
  const water = ECOSYSTEM_SERVICE_FACTORS.waterRetention_m3_per_ha_year * area * multipliers.water;
  const pollution = ECOSYSTEM_SERVICE_FACTORS.pollutionRemoval_kg_per_ha_year * area * multipliers.pollution;
  const energy = ECOSYSTEM_SERVICE_FACTORS.energySavings_kwh_per_ha_year * area * multipliers.energy;

  // Valor económico
  const co2Value = co2 * ECOSYSTEM_SERVICE_FACTORS.co2Value_usd_per_tonne;
  const waterValue = water * ECOSYSTEM_SERVICE_FACTORS.waterValue_usd_per_m3;
  const pollutionValue = pollution * ECOSYSTEM_SERVICE_FACTORS.pollutionValue_usd_per_kg;
  const energyValue = energy * ECOSYSTEM_SERVICE_FACTORS.energyValue_usd_per_kwh;
  const economicValue = co2Value + waterValue + pollutionValue + energyValue;

  // Índices derivados (0-100)
  const biodiversityIndex = Math.min(100, 20 + project.area_hectares * 5);
  const airQualityImprovement = Math.min(100, pollution * 0.5);
  const noiseReduction_db = Math.min(10, project.area_hectares * 0.5);

  return {
    co2Sequestration_tonnes_per_year: Math.round(co2 * 100) / 100,
    waterRetention_m3_per_year: Math.round(water),
    pollutionRemoval_kg_per_year: Math.round(pollution),
    energySavings_kwh_per_year: Math.round(energy),
    biodiversityIndex: Math.round(biodiversityIndex),
    airQualityImprovement: Math.round(airQualityImprovement),
    noiseReduction_db: Math.round(noiseReduction_db * 10) / 10,
    economicValue_usd_per_year: Math.round(economicValue),
  };
}

// ============================================================================
// DV-SBN-02: simulateGreenROI
// ============================================================================

export function simulateGreenROI(params: {
  project: Pick<SBNProject, 'type' | 'location'> & { area_hectares: number };
  initialInvestment_usd: number;
  discountRate?: number;           // Tasa descuento anual (default 5%)
  projectLifetime_years?: number;  // Vida útil proyecto (default 30)
  monetaryMode: 'postmonetario' | 'conectado';
  priceParity_usd_per_znu?: number; // Solo modo conectado
}): GreenROI {
  const { project, initialInvestment_usd, discountRate = 0.05, projectLifetime_years = 30, monetaryMode, priceParity_usd_per_znu } = params;

  const services = calculateEcosystemServices(project);
  const annualReturns = services.economicValue_usd_per_year;

  // VPN
  let npv = -initialInvestment_usd;
  for (let year = 1; year <= projectLifetime_years; year++) {
    npv += annualReturns / Math.pow(1 + discountRate, year);
  }

  // TIR (aproximación)
  let irr = 0;
  for (let i = 0; i < 20; i++) {
    let npvTest = -initialInvestment_usd;
    for (let year = 1; year <= projectLifetime_years; year++) {
      npvTest += annualReturns / Math.pow(1 + irr, year);
    }
    if (npvTest > 0) irr += 0.01;
    else break;
  }

  const paybackPeriod = initialInvestment_usd / annualReturns;
  const bcr = (annualReturns * projectLifetime_years) / initialInvestment_usd;

  // Desglose retornos (Smith & Harvey-Brown 2018)
  const co2Value = services.co2Sequestration_tonnes_per_year * ECOSYSTEM_SERVICE_FACTORS.co2Value_usd_per_tonne;
  const waterValue = services.waterRetention_m3_per_year * ECOSYSTEM_SERVICE_FACTORS.waterValue_usd_per_m3;
  const pollutionValue = services.pollutionRemoval_kg_per_year * ECOSYSTEM_SERVICE_FACTORS.pollutionValue_usd_per_kg;
  const energyValue = services.energySavings_kwh_per_year * ECOSYSTEM_SERVICE_FACTORS.energyValue_usd_per_kwh;

  const totalValue = co2Value + waterValue + pollutionValue + energyValue;
  const co2Pct = totalValue > 0 ? co2Value / totalValue : 0;
  const waterPct = totalValue > 0 ? waterValue / totalValue : 0;
  const pollutionPct = totalValue > 0 ? pollutionValue / totalValue : 0;
  const energyPct = totalValue > 0 ? energyValue / totalValue : 0;

  return {
    initialInvestment_usd,
    annualReturns_usd: Math.round(annualReturns),
    paybackPeriod_years: Math.round(paybackPeriod * 10) / 10,
    netPresentValue_usd: Math.round(npv),
    internalRateOfReturn: Math.round(irr * 10000) / 100,
    benefitCostRatio: Math.round(bcr * 100) / 100,
    returnsBreakdown: {
      co2: Math.round(co2Pct * annualReturns),
      water: Math.round(waterPct * annualReturns),
      pollution: Math.round(pollutionPct * annualReturns),
      energy: Math.round(energyPct * annualReturns),
      other: Math.round((1 - co2Pct - waterPct - pollutionPct - energyPct) * annualReturns),
    },
    monetaryMode,
    priceParity_usd_per_znu,
  };
}

// ============================================================================
// DV-SBN-03: modelUrbanMicroclimate
// ============================================================================

export function modelUrbanMicroclimate(params: {
  project: Pick<SBNProject, 'type' | 'location'> & { area_hectares: number };
  urbanContext: {
    currentGreenCover_pct: number;     // % cobertura verde actual ciudad
    populationDensity: number;         // hab/km²
    avgTemperature_celsius: number;    // Temp media actual
    heatIslandIntensity_celsius: number; // Intensidad isla calor
    annualRainfall_mm: number;         // Precipitación anual
    floodProneArea_pct: number;        // % área propensa inundaciones
  };
  scenarios?: Partial<MicroclimateScenario>[];
}): UrbanMicroclimate {
  const { project, urbanContext, scenarios } = params;
  const services = calculateEcosystemServices(project);
  const greenCoverIncrease = (project.area_hectares * 10000) / (urbanContext.populationDensity > 0 ? 100 : 1); // m² verde añadido

  // Reducción temperatura (modelo simplificado basado en literatura)
  const tempReduction = Math.min(3.0, project.area_hectares * 0.15 * (1 - urbanContext.currentGreenCover_pct / 100));
  const heatIslandMitigation = Math.min(100, (tempReduction / Math.max(urbanContext.heatIslandIntensity_celsius, 0.1)) * 100);

  // Reducción riesgo inundación
  const waterRetentionPerHa = services.waterRetention_m3_per_year / project.area_hectares;
  const floodRiskReduction = Math.min(100, (waterRetentionPerHa / 2000) * 100 * (urbanContext.floodProneArea_pct / 100));

  // Humedad y viento
  const humidityRegulation = Math.min(100, project.area_hectares * 2);
  const windSpeedModification = Math.min(50, project.area_hectares * 1);

  // Confort térmico (UTCI simplificado)
  const thermalComfortIndex = Math.max(0, 100 - (urbanContext.avgTemperature_celsius - tempReduction - 22) * 5);

  // Escenarios por defecto
  const defaultScenarios: MicroclimateScenario[] = [
    { id: 'conservative', name: 'Conservador', greenCoverPercentage: urbanContext.currentGreenCover_pct + 2, projectedTempReduction: tempReduction * 0.7, projectedFloodReduction: floodRiskReduction * 0.7, projectedEnergySavings: services.energySavings_kwh_per_year * 0.7, probability: 0.8 },
    { id: 'moderate', name: 'Moderado', greenCoverPercentage: urbanContext.currentGreenCover_pct + 5, projectedTempReduction: tempReduction, projectedFloodReduction: floodRiskReduction, projectedEnergySavings: services.energySavings_kwh_per_year, probability: 0.5 },
    { id: 'ambitious', name: 'Ambicioso', greenCoverPercentage: urbanContext.currentGreenCover_pct + 10, projectedTempReduction: tempReduction * 1.3, projectedFloodReduction: floodRiskReduction * 1.3, projectedEnergySavings: services.energySavings_kwh_per_year * 1.3, probability: 0.2 },
  ];

  return {
    temperatureReduction_celsius: Math.round(tempReduction * 100) / 100,
    heatIslandMitigation: Math.round(heatIslandMitigation),
    floodRiskReduction: Math.round(floodRiskReduction),
    humidityRegulation: Math.round(humidityRegulation),
    windSpeedModification: Math.round(windSpeedModification),
    thermalComfortIndex: Math.round(thermalComfortIndex),
    scenarios: scenarios ? [...defaultScenarios, ...scenarios] : defaultScenarios,
  };
}

// ============================================================================
// DV-GS-01: assessGovernanceCoordination
// ============================================================================

export function assessGovernanceCoordination(actors: GovernanceActor[]): GovernanceCoordination {
  const scenarioId = `coord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const now = Date.now();

  // Detectar contradicciones
  const contradictions: Contradiction[] = [];

  // 1. Conflictos de uso de suelo
  const landUseActors = actors.filter(a => a.role.includes('implementer') || a.role.includes('lead'));
  if (landUseActors.length > 1) {
    const powers = landUseActors.map(a => a.decisionPower);
    const maxPower = Math.max(...powers);
    const minPower = Math.min(...powers);
    if (maxPower - minPower > 50) {
      contradictions.push({
        id: `contr_${Date.now()}_landuse`,
        description: 'Desbalance de poder decisión en uso de suelo entre actores implementadores',
        involvedActors: landUseActors.map(a => a.id),
        severity: 'high',
        domain: 'land_use',
        proposedResolution: 'Establecer mesa de coordinación con poder decisión equitativo',
      });
    }
  }

  // 2. Conflictos infraestructura/servicios
  const infraActors = actors.filter(a => a.type === 'service_operator' || a.type === 'municipality');
  const investorActors = actors.filter(a => a.type === 'investor' || a.type === 'private_company');
  if (infraActors.length > 0 && investorActors.length > 0) {
    contradictions.push({
      id: `contr_${Date.now()}_infra`,
      description: 'Posible conflicto entre provisión servicios públicos y rentabilidad privada',
      involvedActors: [...infraActors, ...investorActors].map(a => a.id),
      severity: 'medium',
      domain: 'infrastructure',
      proposedResolution: 'Contratos de concesión con cláusulas servicio universal y tarifas reguladas',
    });
  }

  // 3. Conflictos presupuesto
  const funders = actors.filter(a => a.role === 'funder');
  if (funders.length > 1) {
    const totalCommitted = funders.reduce((sum, f) => sum + f.resourcesCommitted, 0);
    const maxCommit = Math.max(...funders.map(f => f.resourcesCommitted));
    if (maxCommit / totalCommitted > 0.7) {
      contradictions.push({
        id: `contr_${Date.now()}_budget`,
        description: 'Concentración excesiva de financiamiento en un solo actor',
        involvedActors: funders.map(f => f.id),
        severity: 'medium',
        domain: 'budget',
        proposedResolution: 'Diversificar fuentes financiamiento; establecer límites concentración',
      });
    }
  }

  // 4. Conflictos ambientales
  const envActors = actors.filter(a => a.type === 'ngo' || a.type === 'academic' || a.type === 'community_org');
  const devActors = actors.filter(a => a.type === 'private_company' || a.type === 'investor');
  if (envActors.length > 0 && devActors.length > 0) {
    contradictions.push({
      id: `contr_${Date.now()}_env`,
      description: 'Tensión entre protección ambiental y desarrollo inmobiliario/industrial',
      involvedActors: [...envActors, ...devActors].map(a => a.id),
      severity: 'high',
      domain: 'environmental',
      proposedResolution: 'Evaluación impacto ambiental vinculante; compensaciones ecológicas obligatorias',
    });
  }

  // 5. Conflictos sociales/desplazamiento
  const communityActors = actors.filter(a => a.type === 'community_org' || a.role === 'beneficiary' || a.role === 'affected');
  const devActors2 = actors.filter(a => a.type === 'private_company' || a.type === 'investor' || a.type === 'property_owner');
  if (communityActors.length > 0 && devActors2.length > 0) {
    contradictions.push({
      id: `contr_${Date.now()}_social`,
      description: 'Riesgo de desplazamiento comunidades por valorización suelo',
      involvedActors: [...communityActors, ...devActors2].map(a => a.id),
      severity: 'critical',
      domain: 'social',
      proposedResolution: 'Fondo anti-desplazamiento obligatorio; vivienda asequible vinculante; participación vinculante comunidades',
    });
  }

  // Score coordinación (inverso a contradicciones)
  const severityWeights = { low: 5, medium: 15, high: 30, critical: 50 };
  const totalSeverity = contradictions.reduce((sum, c) => sum + severityWeights[c.severity], 0);
  const coordinationScore = Math.max(0, 100 - totalSeverity);

  // ¿Hay estrategia compartida?
  const leadActors = actors.filter(a => a.role === 'lead');
  const hasSharedStrategy = leadActors.length === 1 && actors.filter(a => a.decisionPower > 30).length > 1;

  return {
    scenarioId: `coord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    actors,
    coordinationScore,
    contradictions,
    sharedStrategy: hasSharedStrategy,
    strategyDescription: hasSharedStrategy ? 'Estrategia coordinada bajo liderazgo único con poder distribuido' : 'Decisiones fragmentadas; riesgo ciudad contradictoria',
    coordinationMechanisms: ['mesa_coordinacion', 'comite_seguimiento', 'protocolo_comunicacion', 'sistema_monitoreo_compartido'],
    lastAssessment: Date.now(),
  };
}

// ============================================================================
// DV-GS-02: calculateLandValueCapture
// ============================================================================

export function calculateLandValueCapture(params: {
  projectId: string;
  projectName: string;
  location: string;
  area_hectares: number;
  preProjectLandValue_usd_per_m2: number;
  postProjectLandValue_usd_per_m2: number;
  captureRate: number;                    // % capturado (0-1)
  config: LandValueCaptureConfig;
  displacementRisk: 'low' | 'medium' | 'high' | 'critical';
  antiDisplacementMeasures: string[];
  transparencyIndex: number;              // 0-100
  communityParticipationIndex: number;    // 0-100
}): LandValueCapture {
  const { projectId, projectName, location, area_hectares, preProjectLandValue_usd_per_m2, postProjectLandValue_usd_per_m2, captureRate, config, displacementRisk, antiDisplacementMeasures, transparencyIndex, communityParticipationIndex } = params;

  const valueIncrement = postProjectLandValue_usd_per_m2 - preProjectLandValue_usd_per_m2;
  const totalIncrement = valueIncrement * area_hectares * 10000; // ha → m²
  const totalCapturedValue = totalIncrement * captureRate;

  // Distribución según config
  const dist = config.allocation;
  const distribution = {
    greenInfrastructure_usd: Math.round(totalCapturedValue * dist.infrastructure_pct / 100),
    affordableHousing_usd: Math.round(totalCapturedValue * dist.affordable_housing_pct / 100),
    publicSpace_usd: Math.round(totalCapturedValue * dist.public_space_pct / 100),
    communityFund_usd: Math.round(totalCapturedValue * dist.community_fund_pct / 100),
    antiDisplacementFund_usd: Math.round(totalCapturedValue * dist.anti_displacement_pct / 100),
  };

  // Estimar hogares desplazados (modelo simplificado)
  const displacedHouseholds = displacementRisk === 'critical' ? Math.round(area_hectares * 50) :
    displacementRisk === 'high' ? Math.round(area_hectares * 20) :
    displacementRisk === 'medium' ? Math.round(area_hectares * 5) : 0;

  return {
    projectId,
    projectName,
    location,
    preProjectLandValue_usd_per_m2,
    postProjectLandValue_usd_per_m2,
    valueIncrement_usd_per_m2: valueIncrement,
    totalCapturedValue_usd: Math.round(totalCapturedValue),
    captureRate,
    capturedValue_usd: Math.round(totalCapturedValue),
    distribution,
    displacementRisk,
    antiDisplacementMeasures,
    displacedHouseholds,
    transparencyIndex,
    communityParticipationIndex,
    capturedAt: Date.now(),
  };
}

// ============================================================================
// DV-GS-03: designGovernanceInstruments
// ============================================================================

export function designGovernanceInstruments(params: {
  hasUpdatedInfo: boolean;
  hasProjects: boolean;
  hasBudget: boolean;
  hasInstitutionalCapacity: boolean;
  context: 'municipal' | 'regional' | 'national';
}): GovernanceInstrument[] {
  const instruments: GovernanceInstrument[] = [];
  const baseId = `inst_${Date.now()}`;

  // 1. Instrumento regulatorio: Plan de Ordenamiento Verde
  instruments.push({
    id: `${baseId}_plan_verde`,
    name: 'Plan de Ordenamiento Territorial Verde',
    type: 'regulatory',
    description: 'Define áreas de protección verde, corredores ecológicos, densidades máximas, usos permitidos integrando SBN',
    connectedTo: {
      updatedInfo: true,
      projects: true,
      budget: false,
      institutionalCapacity: true,
    },
    applicableActors: ['municipality', 'regional_gov', 'property_owner', 'developer'],
    enforcementMechanism: 'Licencias condicionadas a cumplimiento SBN; sanciones por incumplimiento',
    monitoringIndicators: ['% área verde protegida', 'km corredores ecológicos', 'ha SBN implementadas'],
    status: 'proposed',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  // 2. Instrumento económico: Tasa de Mejoramiento Verde
  instruments.push({
    id: `${baseId}_tasa_verde`,
    name: 'Tasa de Mejoramiento por Valorización Verde',
    type: 'economic',
    description: 'Captura porcentaje plusvalía generada por nuevos espacios verdes/SBN para financiar su mantenimiento y expansión',
    connectedTo: {
      updatedInfo: true,
      projects: true,
      budget: true,
      institutionalCapacity: true,
    },
    applicableActors: ['property_owner', 'developer', 'municipality'],
    enforcementMechanism: 'Cobro anual con factura predial; exenciones para vivienda social',
    monitoringIndicators: ['USD captados/año', 'ha SBN financiadas', 'mantenimiento cubierto'],
    status: 'proposed',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  // 3. Instrumento informacional: Observatorio Verde Urbano
  instruments.push({
    id: `${baseId}_observatorio`,
    name: 'Observatorio de Infraestructura Verde Urbana',
    type: 'informational',
    description: 'Plataforma abierta con datos tiempo real: cobertura verde, servicios ecosistémicos, calidad aire, temperatura, plusvalía capturada',
    connectedTo: {
      updatedInfo: true,
      projects: true,
      budget: false,
      institutionalCapacity: true,
    },
    applicableActors: ['municipality', 'academic', 'community_org', 'citizen'],
    enforcementMechanism: 'Decreto transparencia activa; actualización trimestral obligatoria',
    monitoringIndicators: ['Datasets publicados', 'Usuarios activos', 'Decisiones basadas en datos'],
    status: 'proposed',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  // 4. Instrumento participatorio: Mesa de Gobernanza Verde
  instruments.push({
    id: `${baseId}_mesa_gobernanza`,
    name: 'Mesa de Gobernanza Verde Multiactor',
    type: 'participatory',
    description: 'Espacio decisión compartida: municipalidad, comunidades, propietarios, operadores, inversionistas, academia',
    connectedTo: {
      updatedInfo: true,
      projects: true,
      budget: true,
      institutionalCapacity: true,
    },
    applicableActors: ['municipality', 'regional_gov', 'community_org', 'property_owner', 'service_operator', 'investor', 'academic'],
    enforcementMechanism: 'Acuerdos vinculantes; actas públicas; revisión semestral',
    monitoringIndicators: ['Sesiones/año', 'Acuerdos vinculantes', 'Conflictos resueltos', 'Participación comunidades'],
    status: 'proposed',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  // 5. Instrumento basado en suelo: Banco de Tierras Verdes
  instruments.push({
    id: `${baseId}_banco_tierras`,
    name: 'Banco de Tierras para Infraestructura Verde',
    type: 'land_based',
    description: 'Adquisición preventiva suelo estratégico para corredores verdes, parques, SBN; previene especulación',
    connectedTo: {
      updatedInfo: true,
      projects: true,
      budget: true,
      institutionalCapacity: true,
    },
    applicableActors: ['municipality', 'regional_gov', 'property_owner'],
    enforcementMechanism: 'Derecho tanteo/retracto; expropiación por utilidad pública verde; trueque tierras',
    monitoringIndicators: ['ha en banco', 'ha destinadas SBN', 'Plusvalía capturada preventivamente'],
    status: 'proposed',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  // Filtrar según requisitos disponibles
  return instruments.filter(inst => {
    const req = inst.connectedTo;
    return (!req.updatedInfo || params.hasUpdatedInfo) &&
           (!req.projects || params.hasProjects) &&
           (!req.budget || params.hasBudget) &&
           (!req.institutionalCapacity || params.hasInstitutionalCapacity);
  });
}

// ============================================================================
// DV-GS-04: simulateSharedStrategy
// ============================================================================

export function simulateSharedStrategy(actors: GovernanceActor[]): SharedStrategy {
  const coord = assessGovernanceCoordination(actors);
  const now = Date.now();

  const commonGoals = [
    'Ciudad resiliente al clima',
    'Habitabilidad universal',
    'Gobernanza transparente y participativa',
    'Financiamiento sostenible SBN',
    'Cero desplazamiento involuntario',
  ];

  const implementationPlan: ImplementationStep[] = [
    { id: 'step1', description: 'Constituir Mesa de Gobernanza Verde', responsibleActors: actors.filter(a => a.decisionPower > 30).map(a => a.id), timeline: { start: Date.now(), end: Date.now() + 90*24*60*60*1000 }, budget_usd: 50000, status: 'pending', dependencies: [] },
    { id: 'step2', description: 'Aprobar Plan Ordenamiento Verde', responsibleActors: actors.filter(a => a.type === 'municipality' || a.type === 'regional_gov').map(a => a.id), timeline: { start: Date.now() + 90*24*60*60*1000, end: Date.now() + 270*24*60*60*1000 }, budget_usd: 200000, status: 'pending', dependencies: ['step1'] },
    { id: 'step3', description: 'Implementar Tasa Mejoramiento Verde', responsibleActors: actors.filter(a => a.type === 'municipality').map(a => a.id), timeline: { start: Date.now() + 270*24*60*60*1000, end: Date.now() + 450*24*60*60*1000 }, budget_usd: 100000, status: 'pending', dependencies: ['step2'] },
    { id: 'step4', description: 'Lanzar Observatorio Verde', responsibleActors: actors.filter(a => a.type === 'academic' || a.type === 'municipality').map(a => a.id), timeline: { start: Date.now() + 180*24*60*60*1000, end: Date.now() + 360*24*60*60*1000 }, budget_usd: 75000, status: 'pending', dependencies: ['step1'] },
    { id: 'step5', description: 'Capitalizar Banco Tierras Verdes', responsibleActors: actors.filter(a => a.type === 'municipality' || a.role === 'funder').map(a => a.id), timeline: { start: Date.now() + 360*24*60*60*1000, end: Date.now() + 720*24*60*60*1000 }, budget_usd: 5000000, status: 'pending', dependencies: ['step2', 'step3'] },
  ];

  const monitoringFramework: MonitoringIndicator[] = [
    { id: 'ind1', name: 'Cobertura verde urbana %', type: 'outcome', target: 30, current: 15, frequency: 'annual', responsibleActor: 'municipality' },
    { id: 'ind2', name: 'Plusvalía capturada USD/año', type: 'output', target: 10000000, current: 0, frequency: 'annual', responsibleActor: 'municipality' },
    { id: 'ind3', name: 'Viviendas asequibles creadas', type: 'outcome', target: 5000, current: 0, frequency: 'annual', responsibleActor: 'municipality' },
    { id: 'ind4', name: 'Hogares desplazados', type: 'outcome', target: 0, current: 0, frequency: 'continuous', responsibleActor: 'community_org' },
    { id: 'ind5', name: 'Índice transparencia', type: 'process', target: 90, current: 40, frequency: 'quarterly', responsibleActor: 'mesa_gobernanza' },
    { id: 'ind6', name: 'Participación comunitaria %', type: 'process', target: 70, current: 20, frequency: 'annual', responsibleActor: 'mesa_gobernanza' },
  ];

  return {
    hasSharedStrategy: coord.sharedStrategy,
    strategyDocument: coord.strategyDescription,
    participatingActors: actors.map(a => a.id),
    commonGoals,
    contradictionsResolved: 0,
    contradictionsRemaining: coord.contradictions.length,
    implementationPlan,
    monitoringFramework,
  };
}

// ============================================================================
// FUNCIONES AUXILIARES Y ESTADO INICIAL
// ============================================================================

export function createInitialUrbanGreenState(): UrbanGreenState {
  const now = Date.now();
  return {
    sbnProjects: {},
    ecosystemServices: {},
    greenROI: {},
    urbanMicroclimate: {},
    governanceCoordination: {},
    landValueCapture: {},
    governanceInstruments: {},
    sharedStrategies: {},
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

// Re-export types
export type {
  SBNProject,
  EcosystemServices,
  GreenROI,
  UrbanMicroclimate,
  MicroclimateScenario,
  ProjectGovernance,
  GovernanceActor,
  ProjectFinancing,
  FundingSource,
  LandValueCaptureConfig,
  GreenBondConfig,
  CaasStreamConfig,
  LandValueCapture,
  GovernanceInstrument,
  GovernanceCoordination,
  Contradiction,
  SharedStrategy,
  ImplementationStep,
  MonitoringIndicator,
  UrbanGreenState,
} from '@core/lib/urban-green-governance-types';