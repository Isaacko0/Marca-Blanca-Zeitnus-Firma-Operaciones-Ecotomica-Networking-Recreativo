// ilargiakaos.ts — Estado para Teoría Cyberpunk/Postcapitalismo Ilargiakaos
// Principio Anfibio: postmonetario (ZNU/CaaS) ↔ conectado (USD/USDC vía priceParity)

import type {
  IlargiakaosState,
  TechnoMutant,
  CyberneticSubject,
  CapitalistRealism,
  PAC,
  TechOrientation,
  Accelerationism,
  EcoAnarchistTech,
  PostcapitalistDesire,
  HumanHybridIdentity,
  NeoludditeAudit,
  CyberfeministComms,
  PostApocalypticGovernance,
} from '@core/lib/ilargiakaos-types';

export type {
  IlargiakaosState,
  TechnoMutant,
  CyberneticSubject,
  CapitalistRealism,
  PAC,
  TechOrientation,
  Accelerationism,
  EcoAnarchistTech,
  PostcapitalistDesire,
  HumanHybridIdentity,
  NeoludditeAudit,
  CyberfeministComms,
  PostApocalypticGovernance,
};

// Estado inicial por defecto
export const INITIAL_ILARGIAKAOS_STATE: IlargiakaosState = {
  activePAC: null,
  pacHistory: [],
  capitalistRealism: {
    atmosphereDetected: false,
    noAlternativeBelief: 0,
    cultureProductionConditioned: false,
    workRegulationInternalized: false,
    educationRegulationInternalized: false,
    genuineThoughtBlocked: false,
    consciousnessRetreated: false,
    malaiseIndividualized: false,
    detectionPatterns: [],
    severity: 'low',
    lastScan: Date.now(),
  },
  realismScans: [],
  agentIdentities: {},
  extractedDesires: [],
  accelerationismAnalysis: {
    landianAccelerationism: {
      detected: false,
      capitalismSurpassesHuman: false,
      postcapitalismViaInhuman: false,
      uncontrolledBecoming: false,
      infinitePlasticity: false,
    },
    antiAccelerationism: {
      reapropriationOfNew: true,
      humanCentricFuture: true,
      controlledInnovation: true,
      culturalProgrammingOfTech: true,
    },
    divergenceScore: 0,
    lastAnalysis: Date.now(),
  },
  assessedTechnologies: {},
  neoludditeAudits: [],
  commsAnalyses: {},
  postApocalypticModels: {},
  createdAt: Date.now(),
  updatedAt: Date.now(),
  version: 1,
};

// Claves de almacenamiento
export const ILARGIAKAOS_STORAGE_KEY = 'ilargiakaos_theory_v1';
export const ILARGIAKAOS_V1_STORAGE_KEY = 'ilargiakaos_theory_v1_legacy';
export const ILARGIAKAOS_MIGRATION_FLAG_KEY = 'ilargiakaos_migrated_v1';

// Logros del módulo
export const ILARGIAKAOS_ACHIEVEMENTS = [
  { id: 'first_pac', name: 'Primer PAC', description: 'Proyecto Axiológico Colectivo creado', icon: '📜', threshold: 1 },
  { id: 'realism_broken', name: 'Realismo Roto', description: 'Realismo capitalista detectado y contrarrestado', icon: '🔓', threshold: 1 },
  { id: 'hybrid_identity', name: 'Identidad Híbrida', description: 'Perfil tecnomutante registrado', icon: '🧬', threshold: 1 },
  { id: 'desire_extracted', name: 'Deseo Extraído', description: 'Deseo postcapitalista analizado de artefacto cultural', icon: '💭', threshold: 1 },
  { id: 'anti_acceleration', name: 'Anti-Aceleracionismo', description: 'Simulación reapropiación "lo nuevo" completada', icon: '⚡', threshold: 1 },
  { id: 'liberating_tech', name: 'Tech Liberadora', description: 'Tecnología evaluada como liberadora (Bookchin)', icon: '🌿', threshold: 1 },
  { id: 'neoluddite_audit', name: 'Auditoría Neoludista', description: 'Auditoría crítica de despliegue tech completada', icon: '🔍', threshold: 1 },
  { id: 'cyberfeminist_comms', name: 'Comms Ciberfeministas', description: 'Red comunicación en red/democrática medida', icon: '🕸️', threshold: 1 },
  { id: 'postapocalyptic_model', name: 'Modelo Postapocalíptico', description: 'Gobernanza "día después revolución" modelada', icon: '🌅', threshold: 1 },
];

// Claves i18n esperadas
export const I18N_KEYS = {
  nav: 'nav.ilargiakaos',
  title: 'title.ilargiakaos',
  // Dashboard
  'dashboard.realism': 'ilargiakaos.dashboard.realism',
  'dashboard.pac': 'ilargiakaos.dashboard.pac',
  'dashboard.identity': 'ilargiakaos.dashboard.identity',
  'dashboard.desires': 'ilargiakaos.dashboard.desires',
  'dashboard.acceleration': 'ilargiakaos.dashboard.acceleration',
  'dashboard.tech': 'ilargiakaos.dashboard.tech',
  'dashboard.audits': 'ilargiakaos.dashboard.audits',
  'dashboard.comms': 'ilargiakaos.dashboard.comms',
  'dashboard.futures': 'ilargiakaos.dashboard.futures',
  // Tipos
  'technoMutant': 'ilargiakaos.types.technoMutant',
  'cyberneticSubject': 'ilargiakaos.types.cyberneticSubject',
  'capitalistRealism': 'ilargiakaos.types.capitalistRealism',
  'pac': 'ilargiakaos.types.pac',
  'accelerationism': 'ilargiakaos.types.accelerationism',
  'ecoAnarchistTech': 'ilargiakaos.types.ecoAnarchistTech',
  'postcapitalistDesire': 'ilargiakaos.types.postcapitalistDesire',
  'humanHybridIdentity': 'ilargiakaos.types.humanHybridIdentity',
  'neoludditeAudit': 'ilargiakaos.types.neoludditeAudit',
  'cyberfeministComms': 'ilargiakaos.types.cyberfeministComms',
  'postApocalypticGovernance': 'ilargiakaos.types.postApocalypticGovernance',
  // Acciones
  'action.scanRealism': 'ilargiakaos.actions.scanRealism',
  'action.buildPAC': 'ilargiakaos.actions.buildPAC',
  'action.registerIdentity': 'ilargiakaos.actions.registerIdentity',
  'action.analyzeArtifact': 'ilargiakaos.actions.analyzeArtifact',
  'action.simulateAntiAcceleration': 'ilargiakaos.actions.simulateAntiAcceleration',
  'action.assessTech': 'ilargiakaos.actions.assessTech',
  'action.auditDeployment': 'ilargiakaos.actions.auditDeployment',
  'action.measureComms': 'ilargiakaos.actions.measureComms',
  'action.modelPostApocalyptic': 'ilargiakaos.actions.modelPostApocalyptic',
};