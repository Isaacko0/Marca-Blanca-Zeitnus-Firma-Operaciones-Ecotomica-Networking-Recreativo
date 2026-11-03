// urban-green-governance-types.ts — Tipos para SBN + Gobernanza del Suelo Urbano
// Principio Anfibio: postmonetario (ZNU/CaaS) ↔ conectado (USD/USDC vía priceParity)

export type SBNProject = {
  id: string;
  name: string;
  type: 'urban_park' | 'botanical_garden' | 'street_trees' | 'green_roof' | 'rain_garden' | 'wetland' | 'urban_forest' | 'green_corridor' | 'industrial_green_buffer' | 'community_garden';
  location: {
    city: string;
    coordinates: [number, number]; // [lat, lng]
    area_hectares: number;
  };
  status: 'planning' | 'implementation' | 'maintenance' | 'completed' | 'monitoring';
  // Servicios ecosistémicos (Smith & Harvey-Brown 2018)
  ecosystemServices: EcosystemServices;
  // ROI Ambiental
  roi: GreenROI;
  // Microclima
  microclimateImpact: UrbanMicroclimate;
  // Gobernanza
  governance: ProjectGovernance;
  // Financiamiento
  financing: ProjectFinancing;
  // Metadatos
  createdAt: number;
  updatedAt: number;
  version: number;
};

export type EcosystemServices = {
  // Smith & Harvey-Brown 2018 metrics
  co2Sequestration_tonnes_per_year: number;      // Absorción CO₂
  waterRetention_m3_per_year: number;            // Retención agua pluvial
  pollutionRemoval_kg_per_year: number;          // Control contaminación (PM2.5, NOx, SO2, O3)
  energySavings_kwh_per_year: number;            // Ahorro energético (sombra, enfriamiento)
  biodiversityIndex: number;                     // 0-100: índice biodiversidad
  airQualityImprovement: number;                 // 0-100: mejora calidad aire
  noiseReduction_db: number;                     // Reducción ruido
  // Valor económico equivalente
  economicValue_usd_per_year: number;            // Valor económico total servicios
};

export type GreenROI = {
  // Retorno de inversión ambiental
  initialInvestment_usd: number;
  annualReturns_usd: number;                     // Retornos anuales servicios ambientales
  paybackPeriod_years: number;                   // Período recuperación
  netPresentValue_usd: number;                   // VPN a tasa descuento
  internalRateOfReturn: number;                  // TIR %
  benefitCostRatio: number;                      // Relación beneficio/costo
  // Desglose por servicio (Smith & Harvey-Brown 2018)
  returnsBreakdown: {
    co2: number;
    water: number;
    pollution: number;
    energy: number;
    other: number;
  };
  // Modo anfibio
  monetaryMode: 'postmonetario' | 'conectado';
  priceParity_usd_per_znu?: number;              // Solo modo conectado
};

export type UrbanMicroclimate = {
  // Impacto en microclima urbano
  temperatureReduction_celsius: number;          // Reducción temperatura (°C)
  heatIslandMitigation: number;                  // 0-100: mitigación isla calor
  floodRiskReduction: number;                    // 0-100: reducción riesgo inundación
  humidityRegulation: number;                    // 0-100: regulación humedad
  windSpeedModification: number;                 // Modificación velocidad viento
  thermalComfortIndex: number;                   // Índice confort térmico (UTCI/PET)
  // Escenarios
  scenarios: MicroclimateScenario[];
};

export type MicroclimateScenario = {
  id: string;
  name: string;
  greenCoverPercentage: number;                  // % cobertura verde
  projectedTempReduction: number;
  projectedFloodReduction: number;
  projectedEnergySavings: number;
  probability: number;                           // 0-1
};

export type ProjectGovernance = {
  // Gobernanza del proyecto SBN
  leadEntity: string;                            // Entidad líder
  participatingActors: GovernanceActor[];        // Actores participantes
  coordinationMechanism: 'municipal' | 'intermunicipal' | 'public_private' | 'community' | 'mixed';
  decisionMakingProcess: 'top_down' | 'participatory' | 'co_design' | 'consensus';
  transparencyMechanisms: string[];              // Mecanismos transparencia
  accountabilityMeasures: string[];              // Medidas rendición cuentas
  communityParticipationLevel: 'inform' | 'consult' | 'involve' | 'collaborate' | 'empower';
  conflictResolutionMechanism: string;
};

export type GovernanceActor = {
  id: string;
  name: string;
  type: 'municipality' | 'regional_gov' | 'national_gov' | 'property_owner' | 'service_operator' | 'investor' | 'community_org' | 'ngo' | 'academic' | 'private_company';
  role: 'lead' | 'partner' | 'funder' | 'implementer' | 'monitor' | 'beneficiary' | 'affected';
  contribution: string;                          // Qué aporta
  decisionPower: number;                         // 0-100: poder decisión
  resourcesCommitted: number;                    // Recursos comprometidos (USD/ZNU)
};

export type ProjectFinancing = {
  // Financiamiento mixto (anfibio)
  totalCost_usd: number;
  fundingSources: FundingSource[];
  landValueCapture: LandValueCaptureConfig;
  greenBonds: GreenBondConfig | null;
  caasStreams: CaasStreamConfig | null;
  postmonetarioAllocation: number;               // % financiado modo postmonetario (ZNU/CaaS)
  conectadoAllocation: number;                   // % financiado modo conectado (USD)
};

export type FundingSource = {
  id: string;
  name: string;
  type: 'public_budget' | 'green_bond' | 'caas_stream' | 'private_investment' | 'international_cooperation' | 'land_value_capture' | 'payment_ecosystem_services' | 'crowdfunding' | 'carbon_credits';
  amount_usd: number;
  amount_znu?: number;                           // Modo postmonetario
  conditions: string[];
  timeline: { start: number; end: number };
};

export type LandValueCaptureConfig = {
  enabled: boolean;
  instruments: ('betterment_levy' | 'development_charges' | 'tax_increment_financing' | 'land_readjustment' | 'public_land_lease' | 'inclusionary_zoning' | 'density_bonus')[];
  capturedValue_usd: number;
  allocation: {
    infrastructure_pct: number;                  // % para infraestructura verde
    affordable_housing_pct: number;              // % vivienda asequible
    public_space_pct: number;                    // % espacio público
    community_fund_pct: number;                  // % fondo comunitario
    anti_displacement_pct: number;               // % fondo anti-desplazamiento
  };
  antiDisplacementMeasures: string[];            // Medidas anti-desplazamiento explícitas
};

export type GreenBondConfig = {
  enabled: boolean;
  issuer: string;
  amount_usd: number;
  couponRate: number;
  maturity_years: number;
  useOfProceeds: string[];                       // Uso de fondos (taxonomía verde)
  certification: 'climate_bonds' | 'green_bond_principles' | 'national' | 'none';
  sugevalRegistered: boolean;                    // Registrado SUGEVAL (Costa Rica)
};

export type CaasStreamConfig = {
  enabled: boolean;
  streamKey: string;                             // Clave stream CaaS (suscripcion, revenue_share, etc.)
  znuAllocation: number;                         // ZNU asignados
  priceParity_usd_per_znu: number;               // Oráculo priceParity
  revenueSharePct: number;                       // % revenue share por AUT
};

export type LandValueCapture = {
  // Captura de plusvalía del suelo
  projectId: string;
  projectName: string;
  location: string;
  // Valorización
  preProjectLandValue_usd_per_m2: number;
  postProjectLandValue_usd_per_m2: number;
  valueIncrement_usd_per_m2: number;
  totalCapturedValue_usd: number;
  // Captura
  captureRate: number;                           // % capturado (0-1)
  capturedValue_usd: number;
  // Distribución (EBD-GS-03: SIN desplazamiento)
  distribution: {
    greenInfrastructure_usd: number;
    affordableHousing_usd: number;
    publicSpace_usd: number;
    communityFund_usd: number;
    antiDisplacementFund_usd: number;
  };
  // Anti-desplazamiento
  displacementRisk: 'low' | 'medium' | 'high' | 'critical';
  antiDisplacementMeasures: string[];
  displacedHouseholds: number;
  // Métricas gobernanza
  transparencyIndex: number;                     // 0-100
  communityParticipationIndex: number;           // 0-100
  capturedAt: number;
};

export type GovernanceInstrument = {
  // Instrumentos de gestión del suelo (conectados a 4 requisitos)
  id: string;
  name: string;
  type: 'regulatory' | 'economic' | 'informational' | 'participatory' | 'land_based';
  description: string;
  // Conexión a 4 requisitos (EBD-GS-04)
  connectedTo: {
    updatedInfo: boolean;        // Información actualizada
    projects: boolean;           // Proyectos
    budget: boolean;             // Presupuesto
    institutionalCapacity: boolean; // Capacidad institucional
  };
  applicableActors: string[];    // Qué actores afecta
  enforcementMechanism: string;
  monitoringIndicators: string[];
  status: 'proposed' | 'approved' | 'implemented' | 'evaluated' | 'revised';
  createdAt: number;
  updatedAt: number;
};

export type GovernanceCoordination = {
  // Coordinación multi-actor (DV-GS-01)
  scenarioId: string;
  actors: GovernanceActor[];
  coordinationScore: number;                     // 0-100
  contradictions: Contradiction[];               // Contradicciones detectadas
  sharedStrategy: boolean;                       // ¿Hay estrategia compartida?
  strategyDescription: string;
  coordinationMechanisms: string[];              // Mecanismos coordinación
  lastAssessment: number;
};

export type Contradiction = {
  id: string;
  description: string;
  involvedActors: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  domain: 'land_use' | 'infrastructure' | 'services' | 'budget' | 'timeline' | 'environmental' | 'social';
  proposedResolution: string;
};

export type SharedStrategy = {
  // Estrategia compartida vs decisiones aisladas (DV-GS-04)
  hasSharedStrategy: boolean;
  strategyDocument: string;
  participatingActors: string[];
  commonGoals: string[];
  contradictionsResolved: number;
  contradictionsRemaining: number;
  implementationPlan: ImplementationStep[];
  monitoringFramework: MonitoringIndicator[];
};

export type ImplementationStep = {
  id: string;
  description: string;
  responsibleActors: string[];
  timeline: { start: number; end: number };
  budget_usd: number;
  budget_znu?: number;
  dependencies: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'delayed' | 'cancelled';
};

export type MonitoringIndicator = {
  id: string;
  name: string;
  type: 'outcome' | 'output' | 'process' | 'input';
  target: number;
  current: number;
  frequency: 'monthly' | 'quarterly' | 'annual' | 'continuous';
  responsibleActor: string;
};

export type UrbanGreenState = {
  // Estado principal del módulo
  sbnProjects: Record<string, SBNProject>;
  ecosystemServices: Record<string, EcosystemServices>;
  greenROI: Record<string, GreenROI>;
  urbanMicroclimate: Record<string, UrbanMicroclimate>;
  governanceCoordination: Record<string, GovernanceCoordination>;
  landValueCapture: Record<string, LandValueCapture>;
  governanceInstruments: Record<string, GovernanceInstrument>;
  sharedStrategies: Record<string, SharedStrategy>;
  // Metadatos
  createdAt: number;
  updatedAt: number;
  version: number;
};

// Claves almacenamiento
export const URBAN_GREEN_STORAGE_KEY = 'urban_green_governance_v1';
export const URBAN_GREEN_V1_STORAGE_KEY = 'urban_green_governance_v1_legacy';
export const URBAN_GREEN_MIGRATION_FLAG_KEY = 'urban_green_migrated_v1';

// Logros
export const URBAN_GREEN_ACHIEVEMENTS = [
  { id: 'first_sbn', name: 'Primer Proyecto SBN', description: 'Proyecto SBN registrado', icon: '🌳', threshold: 1 },
  { id: 'roi_positive', name: 'ROI Positivo', description: 'Proyecto con ROI ambiental > 1', icon: '📈', threshold: 1 },
  { id: 'microclimate_improved', name: 'Microclima Mejorado', description: 'Reducción temp > 1°C lograda', icon: '🌡️', threshold: 1 },
  { id: 'land_value_captured', name: 'Plusvalía Capturada', description: 'Plusvalía capturada y redistribuida', icon: '💰', threshold: 1 },
  { id: 'no_displacement', name: 'Cero Desplazamiento', description: 'Proyecto con fondo anti-desplazamiento activo', icon: '🛡️', threshold: 1 },
  { id: 'shared_strategy', name: 'Estrategia Compartida', description: 'Gobernanza con estrategia ciudad activa', icon: '🤝', threshold: 1 },
  { id: 'green_bond_issued', name: 'Bono Verde Emitido', description: 'Bono verde certificado emitido', icon: '📜', threshold: 1 },
  { id: 'caas_stream_active', name: 'Stream CaaS Activo', description: 'Financiamiento vía CaaS operativo', icon: '🔄', threshold: 1 },
];

// Claves i18n esperadas
export const I18N_KEYS = {
  nav: 'nav.urbanGreen',
  title: 'title.urbanGreen',
  // Dashboard
  'dashboard.sbnProjects': 'urbanGreen.dashboard.sbnProjects',
  'dashboard.ecosystemServices': 'urbanGreen.dashboard.ecosystemServices',
  'dashboard.greenROI': 'urbanGreen.dashboard.greenROI',
  'dashboard.microclimate': 'urbanGreen.dashboard.microclimate',
  'dashboard.governance': 'urbanGreen.dashboard.governance',
  'dashboard.landValue': 'urbanGreen.dashboard.landValue',
  'dashboard.instruments': 'urbanGreen.dashboard.instruments',
  'dashboard.strategy': 'urbanGreen.dashboard.strategy',
  // Planificador
  'planner.newProject': 'urbanGreen.planner.newProject',
  'planner.ecosystemCalc': 'urbanGreen.planner.ecosystemCalc',
  'planner.roiCalc': 'urbanGreen.planner.roiCalc',
  'planner.microclimateSim': 'urbanGreen.planner.microclimateSim',
  // Gobernanza
  'governance.coordination': 'urbanGreen.governance.coordination',
  'governance.landValue': 'urbanGreen.governance.landValue',
  'governance.instruments': 'urbanGreen.governance.instruments',
  'governance.strategy': 'urbanGreen.governance.strategy',
  'governance.actors': 'urbanGreen.governance.actors',
  'governance.plusvalia': 'urbanGreen.governance.plusvalia',
  'governance.antiDisplacement': 'urbanGreen.governance.antiDisplacement',
  // Simulador
  'simulator.microclimate': 'urbanGreen.simulator.microclimate',
  'simulator.flood': 'urbanGreen.simulator.flood',
  'simulator.heat': 'urbanGreen.simulator.heat',
  'simulator.scenarios': 'urbanGreen.simulator.scenarios',
  // Tipos
  'sbnProject': 'urbanGreen.types.sbnProject',
  'ecosystemServices': 'urbanGreen.types.ecosystemServices',
  'greenROI': 'urbanGreen.types.greenROI',
  'urbanMicroclimate': 'urbanGreen.types.urbanMicroclimate',
  'landValueCapture': 'urbanGreen.types.landValueCapture',
  'governanceInstrument': 'urbanGreen.types.governanceInstrument',
  'sharedStrategy': 'urbanGreen.types.sharedStrategy',
};