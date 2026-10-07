// ============ SAMAY PERMACULTURA — Lógica Pura Dominio ============
// Nodo piloto HSCSG v15 OS / ALRAC — Ecuador, 20+ años experiencia
// Principio Anfibio: misma lógica opera en modo Triaxial (offline) y TypeSafe (conectado)

import type { DID, Timestamp, GeoCoord, PoolId, ConversionFactor } from './alrac';
import type { TQAccount, CPPPool, CPPBridgeConfig, CPPCommitment } from './cpp';
import type { ZNUVesting, SkillCredential } from './alrac';

// ============ TIPOS CORE SAMAY ============

export interface SamayNode {
  did: DID;                           // did:key:samay-ec
  name: 'Samay Permacultura Online';
  location: GeoCoord;                 // Quito, Ecuador (-0.1807, -78.4678)
  foundation: 'Fundación Runakawsai';
  experienceYears: 20;
  team: SamayTeamMember[];
  pillars: SamayPillar[];
  samayOS: SamayOSConfig;
  programs: SamayProgram[];
  internationalLinks: InternationalLink[];
  metrics: SamayMetrics;
}

export interface SamayTeamMember {
  did: DID;
  name: string;
  role: 'founder' | 'senior_facilitator' | 'facilitator' | 'builder' | 'designer' | 'admin' | 'elder';
  specialties: SamaySpecialty[];
  pillars: ('water' | 'productive' | 'infrastructure' | 'community' | 'intelligence')[];
  tqAccount: TQAccount;
  cppPools: PoolId[];
  skillCredentials: SkillCredential[];
  raoVerified: boolean;
  joinedAt: Timestamp;
}

export type SamaySpecialty =
  | 'hydrological_design'
  | 'keyline_design'
  | 'swale_construction'
  | 'earth_dam'
  | 'agroforestry'
  | 'syntropic_agriculture'
  | 'mandala_garden'
  | 'food_forest'
  | 'seed_saving'
  | 'bioinput_production'
  | 'earth_building'
  | 'superadobe'
  | 'bamboo_construction'
  | 'bioclimatic_design'
  | 'passive_cooling'
  | 'community_facilitation'
  | 'assembly_governance'
  | 'conflict_resolution'
  | 'territorial_analysis'
  | 'gis_mapping'
  | 'water_monitoring'
  | 'soil_analysis'
  | 'permaculture_education'
  | 'regenerative_tourism'
  | 'healthy_cooking'
  | 'food_systems'
  | 'agile_methodologies';

export interface SamayPillar {
  id: 'water' | 'productive' | 'infrastructure' | 'community' | 'intelligence';
  name: string;
  icon: 'Droplets' | 'Seedling' | 'Home' | 'Users' | 'Brain'; // lucide válidos
  services: SamayService[];
  metrics: PillarMetrics;
  // HSCSG integration:
  tqAccounting: boolean;              // Capa 1: contabilizar agua/energía/biomasa en TQ
  cppPools: PoolId[];                 // Capa 2: pools intercambio
  znuCreditEligible: boolean;         // Capa 3: crédito para infraestructura
}

export interface SamayService {
  id: string;
  name: string;
  description: string;
  targetAudience: 'personas' | 'fincas' | 'comunidades' | 'organizaciones' | 'proyectos';
  duration: string;                   // '1 día' | '3 meses' | 'acompañamiento continuo'
  tqCredited: boolean;                // Acredita TQ (Capa 1)
  cppPoolId?: PoolId;                 // Genera compromisos CPP (Capa 2)
  znuCreditEligible: boolean;         // Elegible crédito ZNU (Capa 3)
  prerequisites: string[];
  // Métricas de resultado
  expectedOutcomes: ServiceOutcome[];
}

export interface ServiceOutcome {
  metric: string;                     // 'días_autonomía_hídrica' | 'diversidad_especies' | 'confort_térmico' | 'participación_comunitaria'
  targetValue: number;
  unit: string;
  measurementMethod: string;
}

export interface PillarMetrics {
  projectsCompleted: number;
  hectaresRegenerated: number;
  peopleFormed: number;
  tqVelocity: bigint;                 // TQ generado/circulado en este pilar
  cppCommitmentsActive: number;       // Compromisos CPP vivos
  znuCreditDeployed: bigint;          // ZNU credit desembolsado
}

export interface SamayOSConfig {
  // SAMAY OS actual → migrar a HSCSG + MINIAGI
  currentPlatform: 'Google Sites' | 'Custom' | 'HSCSG';
  modules: SamayOSModule[];
  dataSources: DataSource[];
  offlineCapable: boolean;            // Principio Anfibio: offline-first
  meshIntegration: boolean;           // Solarpunk meshProtocol
  // Migración
  migrationStatus: 'planning' | 'in_progress' | 'mvp' | 'production';
  targetModules: SamayOSModule[];
}

export interface SamayOSModule {
  id: string;
  name: string;
  supports: ('water' | 'productive' | 'infrastructure' | 'community' | 'intelligence')[];
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
  // HSCSG: lógica pura en lib/, estado en state/, UI en screens/
  hscsgModulePath?: string;           // ej. '@core/lib/waterDesign'
  hscsgScreenPath?: string;           // ej. '@app/screens/WaterDesign'
}

export interface DataSource {
  type: 'GIS' | 'satellite' | 'field_survey' | 'community_mapping' | 'ancestral_knowledge' | 'sensor_iot';
  description: string;
  frequency: 'realtime' | 'daily' | 'seasonal' | 'project_based';
  tqMeasurable: boolean;              // ¿Genera datos para TQ ledger?
  // Privacidad y soberanía
  dataTrustLevel: 'commons' | 'community' | 'private' | 'sacred';
  raoRequired: boolean;               // Requiere RAO verification
}

export interface SamayProgram {
  id: string;
  name: string;
  pillar: SamayPillar['id'];
  description: string;
  targetAudience: string[];
  duration: string;
  format: 'presencial' | 'híbrido' | 'online' | 'campo';
  tqCredited: boolean;
  cppPoolId?: PoolId;
  prerequisites: string[];
  maxParticipants: number;
  priceTQ?: bigint;                   // Precio en TQ (si aplica)
  priceUSD?: number;                  // Precio en USD (Capa 3)
  outcomes: ProgramOutcome[];
}

export interface ProgramOutcome {
  competency: string;
  assessmentMethod: 'portfolio' | 'field_demo' | 'peer_review' | 'community_feedback';
  raoCredentialId?: string;           // SkillCredential RAO al completar
}

export interface InternationalLink {
  organization: string;
  type: 'academic' | 'institutional' | 'network' | 'mentorship';
  country: string;
  description: string;
  since: number;                      // Año inicio
  collaborationAreas: string[];
  gnapConnected: boolean;             // ¿Conectado via GNAP?
}

export interface SamayMetrics {
  // Capa 1
  totalTQAccounts: number;
  tqVelocity30d: bigint;
  waterInfiltratedLiters: bigint;     // Métrica hídrica core
  energyGeneratedKwh: bigint;
  biomassProducedKg: bigint;
  // Capa 2
  cppPoolsActive: number;
  cppCrossBorderExchanges: number;
  seedVarietiesExchanged: number;
  knowledgeModulesShared: number;
  // Capa 3
  znuCreditDeployed: bigint;
  bioconstructionsFinanced: number;
  cooperativeMembers: number;
  // Transversal
  facilitatorsTrained: number;        // +250 bioconstructores, +450 diseñadores
  projectsAccompanied: number;
  countriesReached: number;
  // Salud sistémica
  overallHealth: 'critical' | 'stressed' | 'stable' | 'thriving';
  lastGammaCarmisTick: Timestamp;
}

// ============ EQUIVALENCIAS HIDROLÓGICAS PARA TQ ============

/**
 * Equivalencias base para contabilidad TQ en contexto hidrológico/regenerativo
 * Basado en: 1 TQ = 1 kWh (invariante física)
 * Extensión Samay: equivalencias agua/suelo/biomasa
 */
export const SAMAY_TQ_EQUIVALENCES = {
  // Agua
  'water_infiltrated_liter': { numerator: 1n, denominator: 1000n },    // 1 L infiltrado = 0.001 TQ (aprox 1 Wh energía embebida)
  'water_stored_m3': { numerator: 1n, denominator: 1n },               // 1 m³ almacenado = 1 TQ
  'swale_meter': { numerator: 5n, denominator: 1n },                   // 1 m lineal swale = 5 TQ (capacidad infiltración)
  'keyline_ha': { numerator: 100n, denominator: 1n },                  // 1 ha keyline = 100 TQ
  
  // Suelo
  'soil_organic_matter_ton': { numerator: 50n, denominator: 1n },      // 1 ton MO = 50 TQ
  'compost_ton': { numerator: 20n, denominator: 1n },                  // 1 ton compost = 20 TQ
  'biochar_ton': { numerator: 100n, denominator: 1n },                 // 1 ton biochar = 100 TQ (secuestro largo)
  
  // Biomasa / Productivo
  'food_kg': { numerator: 2n, denominator: 1n },                       // 1 kg alimento = 2 TQ
  'seed_packet': { numerator: 10n, denominator: 1n },                  // 1 paquete semillas = 10 TQ
  'tree_planted': { numerator: 50n, denominator: 1n },                 // 1 árbol = 50 TQ (valor futuro)
  'bioinput_liter': { numerator: 5n, denominator: 1n },                // 1 L bioinsumo = 5 TQ
  
  // Trabajo / Tiempo
  'facilitation_hour': { numerator: 20n, denominator: 1n },            // 1 hora facilitación = 20 TQ
  'design_hour': { numerator: 30n, denominator: 1n },                  // 1 hora diseño = 30 TQ
  'construction_day': { numerator: 200n, denominator: 1n },            // 1 día construcción = 200 TQ
  'community_work_day': { numerator: 100n, denominator: 1n },          // 1 día minga/cayapa = 100 TQ
  
  // Infraestructura
  'superadobe_m2': { numerator: 100n, denominator: 1n },               // 1 m² superadobe = 100 TQ
  'bamboo_m2': { numerator: 80n, denominator: 1n },                    // 1 m² bambú = 80 TQ
  'earth_plaster_m2': { numerator: 20n, denominator: 1n },             // 1 m² enlucido tierra = 20 TQ
  
  // Educación
  'pdc_course': { numerator: 5000n, denominator: 1n },                 // Curso PDC 72h = 5000 TQ
  'permaculture_00': { numerator: 1000n, denominator: 1n },            // Permacultura 00 = 1000 TQ
  'specialized_workshop': { numerator: 500n, denominator: 1n },        // Taller especializado = 500 TQ
} as const;

/** Calcula equivalencia TQ para una métrica Samay */
export function calculateTQFromSamayMetric(
  metricType: keyof typeof SAMAY_TQ_EQUIVALENCES,
  quantity: number
): bigint {
  const eq = SAMAY_TQ_EQUIVALENCES[metricType];
  return (BigInt(Math.round(quantity)) * eq.numerator) / eq.denominator;
}

/** Convierte métricas de un proyecto Samay a TQ total */
export function projectToTQBalance(project: {
  waterInfiltratedL?: number;
  waterStoredM3?: number;
  swaleMeters?: number;
  keylineHa?: number;
  soilOrganicMatterTon?: number;
  compostTon?: number;
  foodKg?: number;
  seedsPackets?: number;
  treesPlanted?: number;
  bioinputLiters?: number;
  facilitationHours?: number;
  designHours?: number;
  constructionDays?: number;
  communityWorkDays?: number;
  superadobeM2?: number;
  bambooM2?: number;
  earthPlasterM2?: number;
  pdcCourses?: number;
  permaculture00Courses?: number;
  workshops?: number;
}): bigint {
  let total = 0n;
  
  if (project.waterInfiltratedL) total += calculateTQFromSamayMetric('water_infiltrated_liter', project.waterInfiltratedL);
  if (project.waterStoredM3) total += calculateTQFromSamayMetric('water_stored_m3', project.waterStoredM3);
  if (project.swaleMeters) total += calculateTQFromSamayMetric('swale_meter', project.swaleMeters);
  if (project.keylineHa) total += calculateTQFromSamayMetric('keyline_ha', project.keylineHa);
  if (project.soilOrganicMatterTon) total += calculateTQFromSamayMetric('soil_organic_matter_ton', project.soilOrganicMatterTon);
  if (project.compostTon) total += calculateTQFromSamayMetric('compost_ton', project.compostTon);
  if (project.foodKg) total += calculateTQFromSamayMetric('food_kg', project.foodKg);
  if (project.seedsPackets) total += calculateTQFromSamayMetric('seed_packet', project.seedsPackets);
  if (project.treesPlanted) total += calculateTQFromSamayMetric('tree_planted', project.treesPlanted);
  if (project.bioinputLiters) total += calculateTQFromSamayMetric('bioinput_liter', project.bioinputLiters);
  if (project.facilitationHours) total += calculateTQFromSamayMetric('facilitation_hour', project.facilitationHours);
  if (project.designHours) total += calculateTQFromSamayMetric('design_hour', project.designHours);
  if (project.constructionDays) total += calculateTQFromSamayMetric('construction_day', project.constructionDays);
  if (project.communityWorkDays) total += calculateTQFromSamayMetric('community_work_day', project.communityWorkDays);
  if (project.superadobeM2) total += calculateTQFromSamayMetric('superadobe_m2', project.superadobeM2);
  if (project.bambooM2) total += calculateTQFromSamayMetric('bamboo_m2', project.bambooM2);
  if (project.earthPlasterM2) total += calculateTQFromSamayMetric('earth_plaster_m2', project.earthPlasterM2);
  if (project.pdcCourses) total += calculateTQFromSamayMetric('pdc_course', project.pdcCourses);
  if (project.permaculture00Courses) total += calculateTQFromSamayMetric('permaculture_00', project.permaculture00Courses);
  if (project.workshops) total += calculateTQFromSamayMetric('specialized_workshop', project.workshops);
  
  return total;
}

// ============ POOLS CPP ESPECÍFICOS SAMAY ============

export const SAMAY_DEFAULT_CPP_POOLS: Omit<CPPPool, 'commitments' | 'exchangeRules' | 'exposureManagement' | 'boundaryCuration'>[] = [
  {
    id: 'pool_semillas_criollas',
    name: 'Semillas Criollas y Nativas',
    members: [],
    exposureLimit: 10000n,
    authority: { type: 'consensus', curators: [], threshold: 0.66 },
    ndo_identity_hash: undefined,
  },
  {
    id: 'pool_saberes_ancestrales',
    name: 'Saberes Ancestrales y Técnicos',
    members: [],
    exposureLimit: 5000n,
    authority: { type: 'dao', curators: [], daoAddress: 'samay_dao.eth' },
    ndo_identity_hash: undefined,
  },
  {
    id: 'pool_mano_obra_regenerativa',
    name: 'Mano de Obra Regenerativa (Mingas/Cayapas)',
    members: [],
    exposureLimit: 20000n,
    authority: { type: 'consensus', curators: [], threshold: 0.75 },
    ndo_identity_hash: undefined,
  },
  {
    id: 'pool_biomasa_compost',
    name: 'Biomasa, Compost y Bioinsumos',
    members: [],
    exposureLimit: 15000n,
    authority: { type: 'algorithmic', curators: [], algorithmConfig: { pricing: 'nutrient_content', quality: 'lab_verified' } },
    ndo_identity_hash: undefined,
  },
  {
    id: 'pool_turismo_regenerativo',
    name: 'Turismo Comunitario Regenerativo',
    members: [],
    exposureLimit: 5000n,
    authority: { type: 'multi_sig', curators: [], threshold: 2 },
    ndo_identity_hash: undefined,
  },
];

// ============ FACTORY FUNCTIONS ============

export function createSamayNode(): SamayNode {
  return {
    did: 'did:key:samay-ec',
    name: 'Samay Permacultura Online',
    location: { lat: -0.1807, lng: -78.4678, name: 'Quito, Ecuador' },
    foundation: 'Fundación Runakawsai',
    experienceYears: 20,
    team: [],
    pillars: createSamayPillars(),
    samayOS: {
      currentPlatform: 'Google Sites',
      modules: [],
      dataSources: createSamayDataSources(),
      offlineCapable: true,
      meshIntegration: false,
      migrationStatus: 'planning',
      targetModules: [],
    },
    programs: createSamayPrograms(),
    internationalLinks: createInternationalLinks(),
    metrics: {
      totalTQAccounts: 0,
      tqVelocity30d: 0n,
      waterInfiltratedLiters: 0n,
      energyGeneratedKwh: 0n,
      biomassProducedKg: 0n,
      cppPoolsActive: 0,
      cppCrossBorderExchanges: 0,
      seedVarietiesExchanged: 0,
      knowledgeModulesShared: 0,
      znuCreditDeployed: 0n,
      bioconstructionsFinanced: 0,
      cooperativeMembers: 0,
      facilitatorsTrained: 700, // 250 + 450
      projectsAccompanied: 0,
      countriesReached: 1,
      overallHealth: 'bootstrapping',
      lastGammaCarmisTick: 0,
    },
  };
}

function createSamayPillars(): SamayPillar[] {
  return [
    {
      id: 'water',
      name: 'Agua y Paisaje',
      icon: 'Droplets',
      services: [
        {
          id: 'hydrological_diagnosis',
          name: 'Diagnóstico Hidrológico Integral',
          description: 'Análisis de cuenca, patrones de escorrentía, infiltración, recarga acuífera',
          targetAudience: 'fincas',
          duration: '2-5 días',
          tqCredited: true,
          cppPoolId: 'pool_saberes_ancestrales',
          znuCreditEligible: false,
          prerequisites: ['acceso_terreno', 'permiso_propietario'],
          expectedOutcomes: [
            { metric: 'días_autonomía_hídrica', targetValue: 30, unit: 'días', measurementMethod: 'modelo_hidrológico + monitoreo piezómetros' },
            { metric: 'porcentaje_escorrentía_retenida', targetValue: 80, unit: '%', measurementMethod: 'comparación pre/post intervención' },
          ],
        },
        {
          id: 'keyline_design',
          name: 'Diseño Keyline y Swales',
          description: 'Diseño de líneas clave para distribución pasiva de agua en el paisaje',
          targetAudience: 'fincas',
          duration: '1-2 semanas',
          tqCredited: true,
          cppPoolId: 'pool_mano_obra_regenerativa',
          znuCreditEligible: true,
          prerequisites: ['diagnóstico_hidrológico', 'maquinaria_disponible'],
          expectedOutcomes: [
            { metric: 'metros_swales_construidos', targetValue: 500, unit: 'm', measurementMethod: 'GPS + medición campo' },
            { metric: 'hectáreas_keyline', targetValue: 10, unit: 'ha', measurementMethod: 'GIS + verificación campo' },
          ],
        },
      ],
      metrics: { projectsCompleted: 0, hectaresRegenerated: 0, peopleFormed: 0, tqVelocity: 0n, cppCommitmentsActive: 0, znuCreditDeployed: 0n },
      tqAccounting: true,
      cppPools: ['pool_saberes_ancestrales', 'pool_mano_obra_regenerativa'],
      znuCreditEligible: true,
    },
    {
      id: 'productive',
      name: 'Sistemas Productivos',
      icon: 'Seedling',
      services: [
        {
          id: 'agroforestry_design',
          name: 'Diseño Agroforestería Sintópica',
          description: 'Sistemas multiestrato con sucesión ecológica, alta diversidad y productividad',
          targetAudience: 'fincas',
          duration: '3-6 meses acompañamiento',
          tqCredited: true,
          cppPoolId: 'pool_semillas_criollas',
          znuCreditEligible: true,
          prerequisites: ['suelo_analizado', 'agua_disponible'],
          expectedOutcomes: [
            { metric: 'diversidad_especies', targetValue: 50, unit: 'especies/ha', measurementMethod: 'inventario botánico' },
            { metric: 'productividad_kg_ha_año', targetValue: 20000, unit: 'kg/ha/año', measurementMethod: 'cosecha + pesaje' },
          ],
        },
      ],
      metrics: { projectsCompleted: 0, hectaresRegenerated: 0, peopleFormed: 0, tqVelocity: 0n, cppCommitmentsActive: 0, znuCreditDeployed: 0n },
      tqAccounting: true,
      cppPools: ['pool_semillas_criollas', 'pool_biomasa_compost'],
      znuCreditEligible: true,
    },
    {
      id: 'infrastructure',
      name: 'Infraestructura Regenerativa',
      icon: 'Home',
      services: [
        {
          id: 'superadobe_construction',
          name: 'Bioconstrucción Superadobe',
          description: 'Estructuras de tierra ensacada, resistentes, bioclimáticas, bajo costo',
          targetAudience: 'personas',
          duration: '2-4 semanas',
          tqCredited: true,
          cppPoolId: 'pool_mano_obra_regenerativa',
          znuCreditEligible: true,
          prerequisites: ['tierra_apta', 'bolsas_tubulares', 'alambre'],
          expectedOutcomes: [
            { metric: 'confort_térmico_diferencial', targetValue: 10, unit: '°C', measurementMethod: 'dataloggers interior/exterior' },
            { metric: 'm2_construidos', targetValue: 50, unit: 'm²', measurementMethod: 'planimetría' },
          ],
        },
        {
          id: 'bamboo_construction',
          name: 'Construcción con Bambú (Guadua)',
          description: 'Estructuras de guadua angustifolia, sísmicamente resistentes, carbono negativo',
          targetAudience: 'organizaciones',
          duration: '1-3 meses',
          tqCredited: true,
          cppPoolId: 'pool_mano_obra_regenerativa',
          znuCreditEligible: true,
          prerequisites: ['bambú_maduro', 'tratamiento_bórax', 'herramientas'],
          expectedOutcomes: [
            { metric: 'carbono_secuestrado_ton', targetValue: 5, unit: 'ton CO2eq', measurementMethod: 'cálculo biomasa + factor IPCC' },
            { metric: 'm2_construidos', targetValue: 100, unit: 'm²', measurementMethod: 'planimetría' },
          ],
        },
      ],
      metrics: { projectsCompleted: 0, hectaresRegenerated: 0, peopleFormed: 0, tqVelocity: 0n, cppCommitmentsActive: 0, znuCreditDeployed: 0n },
      tqAccounting: true,
      cppPools: ['pool_mano_obra_regenerativa'],
      znuCreditEligible: true,
    },
    {
      id: 'community',
      name: 'Comunidades y Territorio',
      icon: 'Users',
      services: [
        {
          id: 'neighborhood_design',
          name: 'Diseño Barrios Sustentables / Ecoaldeas',
          description: 'Planificación participativa, zonas comunes, gobernanza compartida, resiliencia',
          targetAudience: 'comunidades',
          duration: '6-12 meses',
          tqCredited: true,
          cppPoolId: 'pool_mano_obra_regenerativa',
          znuCreditEligible: true,
          prerequisites: ['consenso_comunitario', 'tierra_disponible'],
          expectedOutcomes: [
            { metric: 'participación_asambleas', targetValue: 80, unit: '%', measurementMethod: 'lista asistencia' },
            { metric: 'fondos_comunes_acumulados', targetValue: 10000, unit: 'TQ', measurementMethod: 'ledger TQ' },
          ],
        },
      ],
      metrics: { projectsCompleted: 0, hectaresRegenerated: 0, peopleFormed: 0, tqVelocity: 0n, cppCommitmentsActive: 0, znuCreditDeployed: 0n },
      tqAccounting: true,
      cppPools: ['pool_mano_obra_regenerativa', 'pool_turismo_regenerativo'],
      znuCreditEligible: true,
    },
    {
      id: 'intelligence',
      name: 'Inteligencia Territorial',
      icon: 'Brain',
      services: [
        {
          id: 'territorial_analysis',
          name: 'Análisis Territorial Multicapa (SAMAY OS)',
          description: 'GIS + datos campo + conocimiento ancestral → diagnóstico + escenarios + plan de acción',
          targetAudience: 'proyectos',
          duration: '2-4 semanas',
          tqCredited: true,
          cppPoolId: 'pool_saberes_ancestrales',
          znuCreditEligible: false,
          prerequisites: ['acceso_datos', 'equipo_local'],
          expectedOutcomes: [
            { metric: 'capas_gis_integradas', targetValue: 10, unit: 'capas', measurementMethod: 'inventario capas QGIS/GRASS' },
            { metric: 'escenarios_evaluados', targetValue: 3, unit: 'escenarios', measurementMethod: 'workshop participativo' },
          ],
        },
      ],
      metrics: { projectsCompleted: 0, hectaresRegenerated: 0, peopleFormed: 0, tqVelocity: 0n, cppCommitmentsActive: 0, znuCreditDeployed: 0n },
      tqAccounting: false,
      cppPools: ['pool_saberes_ancestrales'],
      znuCreditEligible: false,
    },
  ];
}

function createSamayDataSources(): DataSource[] {
  return [
    { type: 'GIS', description: 'Capas base: hidrología, suelos, clima, cobertura vegetal, tenencia tierra', frequency: 'project_based', tqMeasurable: false, dataTrustLevel: 'commons', raoRequired: false },
    { type: 'satellite', description: 'Índices NDVI, NDWI, temperatura superficie, precipitación (Sentinel, Landsat)', frequency: 'seasonal', tqMeasurable: true, dataTrustLevel: 'commons', raoRequired: false },
    { type: 'field_survey', description: 'Muestreo suelos, caudal puntos, inventario especies, mediciones confort', frequency: 'project_based', tqMeasurable: true, dataTrustLevel: 'community', raoRequired: true },
    { type: 'community_mapping', description: 'Mapeo participativo: usos suelo, recursos, problemas, sueños comunidad', frequency: 'project_based', tqMeasurable: false, dataTrustLevel: 'community', raoRequired: true },
    { type: 'ancestral_knowledge', description: 'Conocimiento local: ciclos agua, especies nativas, prácticas tradicionales, sitios sagrados', frequency: 'project_based', tqMeasurable: false, dataTrustLevel: 'sacred', raoRequired: true },
    { type: 'sensor_iot', description: 'Sensores humedad suelo, caudalímetros, estaciones meteorológicas, dataloggers térmicos', frequency: 'realtime', tqMeasurable: true, dataTrustLevel: 'private', raoRequired: false },
  ];
}

function createSamayPrograms(): SamayProgram[] {
  return [
    {
      id: 'pdc_72h',
      name: 'Permaculture Design Certificate (PDC) 72h',
      pillar: 'productive',
      description: 'Certificación internacional estándar PRI. Diseño completo finca/proyecto.',
      targetAudience: ['personas', 'fincas', 'proyectos'],
      duration: '12-14 días intensivo',
      format: 'presencial',
      tqCredited: true,
      cppPoolId: 'pool_saberes_ancestrales',
      prerequisites: [],
      maxParticipants: 25,
      priceTQ: 5000n,
      outcomes: [
        { competency: 'diseño_permacultura_completo', assessmentMethod: 'portfolio', raoCredentialId: 'pdc_designer' },
        { competency: 'análisis_sectores_zonas', assessmentMethod: 'field_demo', raoCredentialId: 'zone_sector_analyst' },
      ],
    },
    {
      id: 'permacultura_00',
      name: 'Permacultura 00 - Dimensión Humana del Diseño',
      pillar: 'intelligence',
      description: 'Hábitos de observación, atención, prioridades, claridad interior. Fundamento de todo diseño.',
      targetAudience: ['personas', 'organizaciones'],
      duration: '4 semanas (híbrido)',
      format: 'híbrido',
      tqCredited: true,
      cppPoolId: 'pool_saberes_ancestrales',
      prerequisites: [],
      maxParticipants: 30,
      priceTQ: 1000n,
      outcomes: [
        { competency: 'autobservación_diseño', assessmentMethod: 'peer_review', raoCredentialId: 'permaculture_00_practitioner' },
        { competency: 'claridad_interior_proyectos', assessmentMethod: 'community_feedback', raoCredentialId: 'design_clarity_facilitator' },
      ],
    },
    {
      id: 'bioconstruccion_superadobe',
      name: 'Bioconstrucción Superadobe - Certificación Práctica',
      pillar: 'infrastructure',
      description: 'Técnicas completas: cimentación, muros, bóvedas, techos, enlucidos, instalaciones.',
      targetAudience: ['personas', 'constructores'],
      duration: '4 semanas campo',
      format: 'presencial',
      tqCredited: true,
      cppPoolId: 'pool_mano_obra_regenerativa',
      znuCreditEligible: true,
      prerequisites: ['condición_física_básica'],
      maxParticipants: 15,
      priceTQ: 3000n,
      priceUSD: 1200,
      outcomes: [
        { competency: 'construcción_superadobe', assessmentMethod: 'field_demo', raoCredentialId: 'superadobe_builder' },
        { competency: 'diseño_bioclimático_tierra', assessmentMethod: 'portfolio', raoCredentialId: 'bioclimatic_designer_earth' },
      ],
    },
    {
      id: 'water_design_practicum',
      name: 'Practicum Diseño Hidrológico y Keyline',
      pillar: 'water',
      description: 'Diseño e implementación: swales, presas, keyline, recarga acuífera, monitoreo.',
      targetAudience: ['fincas', 'proyectos'],
      duration: '2 semanas campo',
      format: 'presencial',
      tqCredited: true,
      cppPoolId: 'pool_mano_obra_regenerativa',
      znuCreditEligible: true,
      prerequisites: ['topografía_básica'],
      maxParticipants: 12,
      priceTQ: 2000n,
      outcomes: [
        { competency: 'diseño_keyline', assessmentMethod: 'field_demo', raoCredentialId: 'keyline_designer' },
        { competency: 'monitoreo_hidrológico', assessmentMethod: 'portfolio', raoCredentialId: 'hydrological_monitor' },
      ],
    },
  ];
}

function createInternationalLinks(): InternationalLink[] {
  return [
    {
      organization: 'Permaculture Research Institute (PRI)',
      type: 'academic',
      country: 'Australia',
      description: 'Vinculación docente, estándares PDC, investigación permacultura aplicada',
      since: 2010,
      collaborationAreas: ['education', 'research', 'certification'],
      gnapConnected: false,
    },
    {
      organization: 'Tagari Institute (Bill Mollison Legacy)',
      type: 'institutional',
      country: 'Australia',
      description: 'Formación y colaboración relacionada con el legado del fundador de la permacultura',
      since: 2015,
      collaborationAreas: ['education', 'philosophy', 'teacher_training'],
      gnapConnected: false,
    },
    {
      organization: 'Fundación Runakawsai',
      type: 'institutional',
      country: 'Ecuador',
      description: 'Más de 20 años impulsando educación, territorio y regeneración en Ecuador y Andes',
      since: 2004,
      collaborationAreas: ['community_development', 'bioconstruction', 'water', 'education', 'policy'],
      gnapConnected: false,
    },
  ];
}