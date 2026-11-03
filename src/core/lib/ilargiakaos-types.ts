// ilargiakaos-types.ts — Tipos para Teoría Cyberpunk/Postcapitalismo Ilargiakaos
// Principio Anfibio: postmonetario (ZNU/CaaS) ↔ conectado (USD/USDC vía priceParity)

export type TechnoMutant = {
  id: string;
  carbonComponents: string[];           // Biología base
  siliconComponents: string[];          // Implantes, neurotech, IA
  hybridRatio: number;                  // 0-1: proporción silicio/carbono
  resistanceLevel: number;              // 0-100: capacidad resistencia cibercapitalismo
  autonomyScore: number;                // 0-100: puntuación AUT
  mandatoryImplants: boolean;           // Implantes obligatorios para trabajo
  surveillanceExposure: number;         // 0-100: exposición vigilancia algorítmica
  createdAt: number;
  updatedAt: number;
};

export type CyberneticSubject = {
  // Carne vieja (cartesiano)
  cartesianSubject: {
    reasonCentered: boolean;            // Razón como centro
    bodyAsBoundary: boolean;            // Cuerpo = frontera cognoscible
    inertMatterSeparate: boolean;       // Materia inerte en plano distinto
  };
  // Carne nueva (cibernético)
  cyberneticSubject: {
    bodyBoundaryPorous: boolean;        // Frontera cuerpo porosa/hackeable
    techAsExtension: boolean;           // Tech = extensión/existencia
    desireReconfigured: boolean;        // Deseo reconfigurado por capitalismo tardío
    humanMachineIrreversible: boolean;  // Mezcla irreversible humano-máquina
  };
  // Transición
  transitionPhase: 'cartesiano' | 'hibrido' | 'cibernetico' | 'posthumano';
  cronenbergianAnalysis: boolean;       // Análisis tipo Cronenberg aplicado
};

export type CapitalistRealism = {
  // Fisher: atmósfera que condiciona
  atmosphereDetected: boolean;
  noAlternativeBelief: number;          // 0-100: creencia "no hay alternativa"
  cultureProductionConditioned: boolean; // Cultura condicionada
  workRegulationInternalized: boolean;   // Regulación trabajo internalizada
  educationRegulationInternalized: boolean;
  genuineThoughtBlocked: boolean;        // Pensamiento genuino bloqueado
  consciousnessRetreated: boolean;       // Conciencia de clase retrocedida
  malaiseIndividualized: boolean;        // Malestar canalizado a lo individual
  // Detección en código/texto
  detectionPatterns: string[];           // Patrones detectados
  severity: 'low' | 'medium' | 'high' | 'critical';
  lastScan: number;
};

export type PAC = { // Proyecto Axiológico Colectivo (Corbí/Escobar)
  id: string;
  name: string;
  community: string;
  values: string[];                     // Valores fundamentales
  howToAct: Record<string, string>;     // "cómo" actuar en el medio (indeterminación genética)
  techOrientation: TechOrientation;     // Orientación científico-tecnológica
  axiologicalStructure: string;         // Estructura narrativa/lingüística
  collectiveViability: number;          // 0-100: viabilidad colectiva
  ecosocialAlignment: number;           // 0-100: alineación eco-social
  replacesNeoliberalPAC: boolean;       // Reemplaza PAC neoliberal
  createdAt: number;
  updatedAt: number;
  version: number;
};

export type TechOrientation = {
  flexibilityScore: number;             // 0-1: flexibilidad científico-tecnológica
  servesLifeNotSurvival: boolean;       // Bookchin: al servicio de la vida
  liberatesPhysicalLabor: boolean;      // Libera trabajo físico
  regeneratesBiosphere: boolean;        // Regenera biosfera
  reducesAlienation: boolean;           // Reduce alienación
  cyberfeministNetworked: boolean;      // Plant: comunicación en red, democrática
  antiExtractive: boolean;              // No extractiva (neoludismo)
  culturalProgramAligned: boolean;      // Alineada con programa cultural no capitalista
};

export type Accelerationism = {
  // Land/CCRU vs Anti-aceleracionismo (Bobadilla/Soler)
  landianAccelerationism: {
    detected: boolean;
    capitalismSurpassesHuman: boolean;  // Capitalismo supera humano
    postcapitalismViaInhuman: boolean;  // Postcapitalismo vía lo inhumano
    uncontrolledBecoming: boolean;      // Devenir fuera de control
    infinitePlasticity: boolean;        // Plasticidad infinita
  };
  antiAccelerationism: {
    reapropriationOfNew: boolean;       // Reapropiación de "lo nuevo" para lo humano
    humanCentricFuture: boolean;        // Futuro centrado en lo humano
    controlledInnovation: boolean;      // Innovación controlada/dirigida
    culturalProgrammingOfTech: boolean; // Programación cultural de la tech
  };
  divergenceScore: number;              // -100 a 100: aceleracionismo vs anti-
  lastAnalysis: number;
};

export type EcoAnarchistTech = {
  // Bookchin: tecnología liberadora/ecológica
  techId: string;
  name: string;
  category: 'energy' | 'food' | 'manufacturing' | 'communication' | 'transport' | 'health' | 'education' | 'other';
  liberatesPhysicalLabor: boolean;      // Libera trabajo físico humano
  regeneratesBiosphere: boolean;        // Regenera biosfera
  reducesAlienation: boolean;           // Reduce alienación laboral
  servesLifeNotSurvival: boolean;       // Al servicio de la vida (no mera supervivencia)
  ecologicalFootprint: number;          // 0-100: huella ecológica (inverso = mejor)
  democraticControl: boolean;           // Control democrático/comunitario
  antiAuthoritarian: boolean;           // Anti-autoritario (Bookchin)
  communityOwned: boolean;              // Propiedad comunitaria
  assessedAt: number;
  assessment: 'liberadora' | 'extractiva' | 'neutra' | 'mixta';
};

export type PostcapitalistDesire = {
  // Deseos postcapitalistas latentes en cultura (Cronenberg, Blade Runner, Small Soldiers)
  artifactId: string;
  artifactType: 'film' | 'series' | 'book' | 'game' | 'toy' | 'meme' | 'other';
  title: string;
  year: number;
  creators: string[];
  // Análisis estructural
  hiddenDesires: string[];              // Deseos postcapitalistas detectados
  capitalistRealismSubverted: boolean;  // Subvierte realismo capitalista
  bodyTechBoundaryExplored: boolean;    // Explora frontera cuerpo-tech
  empathyAsResistance: boolean;         // Empatía como resistencia (Blade Runner)
  monopolyCritique: boolean;            // Crítica monopolio tech (Small Soldiers)
  posthumanConditioning: boolean;       // Condicionamiento posthumano
  culturalProgrammingVisible: boolean;  // Programación cultural visible
  extractionPotential: number;          // 0-100: potencial extracción para PAC
  analyzedAt: number;
};

export type HumanHybridIdentity = {
  // Identidad fluida/hibrida (tecnomutantes, carne nueva, Poh extendido)
  agentId: string;
  identityType: 'carbon' | 'silicon' | 'hybrid' | 'fluid' | 'tecnomutant';
  carbonPercentage: number;             // 0-100
  siliconPercentage: number;            // 0-100
  mandatoryImplants: string[];          // Implantes obligatorios (trabajo/supervivencia)
  chosenAugmentations: string[];        // Aumentaciones elegidas
  surveillanceExposure: number;         // 0-100
  autonomyScore: number;                // 0-100 (AUT)
  resistanceToCapitalistRealism: number; // 0-100
  pohVerification: {
    verified: boolean;
    verificationType: 'biometric' | 'social' | 'hybrid' | 'web-of-trust';
    humanityScore: number;              // No binario: 0-100
  };
  lastUpdated: number;
};

export type NeoludditeAudit = {
  // Auditoría neoludista (Glendinning)
  auditId: string;
  techDeploymentId: string;
  techName: string;
  deploymentContext: 'neoliberal' | 'cooperative' | 'public' | 'commons' | 'military';
  // Criterios Glendinning
  destructivePower: number;             // 0-100: poder destructivo en manos neoliberales
  criticalVoiceSuppressed: boolean;     // Voces críticas suprimidas
  appropriationNonCapitalist: boolean;  // Apropiación no capitalista posible
  criticalAuditTriggered: boolean;      // Trigger auditoría crítica
  // Resultado
  classification: 'extractiva' | 'liberadora' | 'ambigua' | 'peligrosa';
  recommendations: string[];
  auditedAt: number;
  auditor: string;
};

export type CyberfeministComms = {
  // Medición comunicación ciberfeminista (Plant/Bañón)
  networkId: string;
  networkName: string;
  // Plant: lineal (masculina, jerárquica) vs red (femenina, democrática)
  linearCommunicationScore: number;     // 0-100: comunicación lineal, jerárquica
  networkedCommunicationScore: number;  // 0-100: comunicación en red, democrática
  hierarchicalDepth: number;            // Profundidad jerárquica (0 = plana)
  feministParticipationRate: number;    // Tasa participación feminista
  patriarchyResistance: number;         // Resistencia al fagocentrismo/patriarcado
  neoliberalResistance: number;         // Resistencia al neoliberalismo
  assessedAt: number;
};

export type PostApocalypticGovernance = {
  // Modelo gobernanza "día después de la revolución" (Malatesta)
  scenarioId: string;
  scenarioName: string;
  triggerEvent: 'nuclear' | 'pandemic' | 'climate' | 'meteor' | 'war' | 'zombie' | 'economic_collapse';
  // Modelo neo-anarquista operativo
  mutualAidNetworks: boolean;           // Redes apoyo mutuo
  horizontalDecisionMaking: boolean;    // Toma decisiones horizontal
  resourceCommons: boolean;             // Recursos como comunes
  technologyReappropriated: boolean;    // Tech reapropiada (no capitalista)
  ecologicalRegeneration: boolean;      // Regeneración ecológica
  solidarityOverCompetition: boolean;   // Solidaridad > competencia
  viabilityScore: number;               // 0-100: viabilidad del modelo
  bookchinAlignment: number;            // 0-100: alineación Bookchin
  assessedAt: number;
};

export type IlargiakaosState = {
  // Estado principal del módulo
  // PAC activo
  activePAC: PAC | null;
  pacHistory: PAC[];
  // Realismo capitalista
  capitalistRealism: CapitalistRealism;
  realismScans: CapitalistRealism[];
  // Identidad híbrida
  agentIdentities: Record<string, HumanHybridIdentity>;
  // Deseos postcapitalistas
  extractedDesires: PostcapitalistDesire[];
  // Aceleracionismo
  accelerationismAnalysis: Accelerationism;
  // Tech eco-anarquista
  assessedTechnologies: Record<string, EcoAnarchistTech>;
  // Auditorías neoludistas
  neoludditeAudits: NeoludditeAudit[];
  // Comunicación ciberfeminista
  commsAnalyses: Record<string, CyberfeministComms>;
  // Gobernanza postapocalíptica
  postApocalypticModels: Record<string, PostApocalypticGovernance>;
  // Metadatos
  createdAt: number;
  updatedAt: number;
  version: number;
};

// Claves almacenamiento
export const ILARGIAKAOS_STORAGE_KEY = 'ilargiakaos_theory_v1';
export const ILARGIAKAOS_V1_STORAGE_KEY = 'ilargiakaos_theory_v1_legacy';
export const ILARGIAKAOS_MIGRATION_FLAG_KEY = 'ilargiakaos_migrated_v1';

// Logros
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