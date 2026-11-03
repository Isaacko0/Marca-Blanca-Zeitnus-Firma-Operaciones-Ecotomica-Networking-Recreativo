// urban-green-governance.ts — Estado para SBN + Gobernanza del Suelo Urbano
// Principio Anfibio: postmonetario (ZNU/CaaS) ↔ conectado (USD/USDC vía priceParity)

import type {
  UrbanGreenState,
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
} from '@core/lib/urban-green-governance-types';

export type {
  UrbanGreenState,
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
};

// Estado inicial por defecto
export const INITIAL_URBAN_GREEN_STATE: UrbanGreenState = {
  sbnProjects: {},
  ecosystemServices: {},
  greenROI: {},
  urbanMicroclimate: {},
  governanceCoordination: {},
  landValueCapture: {},
  governanceInstruments: {},
  sharedStrategies: {},
  createdAt: Date.now(),
  updatedAt: Date.now(),
  version: 1,
};

// Claves de almacenamiento
export const URBAN_GREEN_STORAGE_KEY = 'urban_green_governance_v1';
export const URBAN_GREEN_V1_STORAGE_KEY = 'urban_green_governance_v1_legacy';
export const URBAN_GREEN_MIGRATION_FLAG_KEY = 'urban_green_migrated_v1';

// Logros del módulo
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