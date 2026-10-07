// ============ +COLONIA DOMAIN LOGIC ============
// Lógica pura dominio +Colonia (Uruguay) - Nodo piloto ALRAC Capa 1-3
// Principio Anfibio: misma lógica opera en modo Triaxial (offline) y TypeSafe (conectado)

import type { DID, Timestamp, GeoCoord, PoolId, ZNUVesting, SkillCredential } from '@core/lib/alrac';
import type { TQAccount, CPPPool, CPPBridgeConfig, CPPCommitment } from '@core/lib/cpp';

// ============ TIPOS DOMINIO +COLONIA ============

export interface ColoniaNode {
  did: DID;                           // did:key:colonya-uy
  name: '+Colonia';
  location: GeoCoord;                 // -34.47, -57.85 (aprox)
  areaHa: 515;
  coastKm: 7;
  energyMatrix: EnergyMatrix;         // 97% renovables
  greenSpaceRatio: 0.50;
  connectivity: ConnectivitySpec;     // 1Gbps, 5G, WiFi6
  masterplan: MasterplanSpec;         // Gómez Platero, células modulares
  districts: District[];              // Génesis, outdoors, reserva, playas, wellness, deportes, muelle, vial costero
  governance: GovernanceModel;        // Comisiones, asambleas trimestrales, cayapas
  education: EducationSpec;           // Lifelong, coding, campus, business schools
  culture: CultureSpec;               // Arte, gastronomía, música, puente BsAs-MVD
  legalEntity: 'Ala Este SAS';
  investmentUSD: 500_000_000;
  stage: 'construction' | 'operational' | 'expansion';
}

export interface ColoniaResident {
  did: DID;
  tqAccount: TQAccount;               // ±500 TQ, 1 TQ = 1 kWh
  znuVesting: ZNUVesting;             // Crédito vivienda 2-3%
  cppPools: PoolId[];                 // Pools innovación, cultura, energía, alimentos
  skillCredentials: SkillCredential[]; // RAO verified
  proximityScore: number;             // 15-min city compliance
  district: District;                 // Distrito de residencia
  joinedAt: Timestamp;
}

// ============ SUB-TIPOS ============

export interface EnergyMatrix {
  renewablePercent: number;           // 97
  sources: EnergySource[];
  totalCapacityKw: number;
  storageCapacityKwh: number;
  gridConnection: 'grid_tied' | 'off_grid' | 'hybrid';
}

export interface EnergySource {
  type: 'solar' | 'wind' | 'hydro' | 'biomass' | 'grid';
  capacityKw: number;
  annualProductionKwh: number;
  location: GeoCoord;
}

export interface ConnectivitySpec {
  fiberGbps: number;                  // 1
  mobile5g: boolean;                  // true
  wifi6Coverage: boolean;             // true
  meshNodes: number;                  // Solarpunk mesh nodes
  dtnBundles: boolean;                // DTN/NATS federation
}

export interface MasterplanSpec {
  architect: 'Gómez Platero';
  designPrinciples: string[];         // ['entramado_celular', 'densidad_variable', '50%_verde_obligatorio', 'ciudad_15_minutos']
  cells: MasterplanCell[];
  phasing: MasterplanPhase[];
}

export interface MasterplanCell {
  id: string;
  district: District;
  areaHa: number;
  density: 'alta' | 'media' | 'baja';
  mixedUse: boolean;
  greenSpaceRatio: number;
  tqInfrastructure: boolean;          // Nodo TQ físico en célula
}

export interface MasterplanPhase {
  phase: number;
  name: string;
  startDate: Timestamp;
  endDate: Timestamp;
  hectares: number;
  investmentUSD: number;
  milestones: string[];
}

export type District = 
  | 'genesis'           
  | 'outdoors'          
  | 'reserva'           
  | 'playas'            
  | 'wellness'          
  | 'deportes'          
  | 'centro_calabres'   
  | 'muelle_calabres'   
  | 'vial_costero'      
  | 'conexion_mvd';

export interface GovernanceModel {
  type: 'assembly' | 'council' | 'hybrid';
  assemblyFrequencyDays: number;      // 90 = trimestral
  votingMethod: '1a1v' | 'weighted' | 'hybrid';
  quorum: number;
  commissions: Commission[];
  juries: CivicJury[];
}

export interface Commission {
  id: string;
  name: string;
  domain: string;                     // 'energia', 'agua', 'residuos', 'cultura', 'innovacion', 'educacion'
  members: DID[];
  mandateDays: number;
  budgetTQ: bigint;                   // Presupuesto en TQ
}

export interface CivicJury {
  id: string;
  domain: string;                     // 'admisiones', 'impuestos', 'distribucion_fondos', 'politicas'
  size: number;                       // 12
  sortitionMethod: 'random' | 'stratified' | 'reputation_weighted';
  termDays: number;                   // 90
}

export interface EducationSpec {
  lifelongLearning: boolean;
  codingSchools: boolean;
  universityCampus: boolean;
  businessSchoolAlliances: string[];
  phPrograms: string[];
  tqCreditedCourses: boolean;         // Cursos acreditan TQ
}

export interface CultureSpec {
  artsCenter: boolean;
  gastronomyHub: boolean;
  musicVenues: number;
  culturalBridgeBsAsMvd: boolean;     // Puente cultural BsAs-Montevideo
  eventsPerYear: number;
  tqCulturalEconomy: boolean;         // Entradas/events en TQ
}

// ============ ZNU VESTING (Crédito Vivienda 2-3%) ============

export interface ZNUVesting {
  did: DID;
  principal: bigint;                  // Principal en ZNU
  interestRate: number;               // 0.025 = 2.5%
  indexation: 'basket' | 'CPI' | 'energy';
  basketComposition: Map<string, number>; // % por item canasta
  startDate: Timestamp;
  maturityDate: Timestamp;
  status: 'active' | 'vesting' | 'matured' | 'defaulted';
  paymentsMade: number;
  paymentsTotal: number;
  collateral: CollateralSpec;
}

export interface CollateralSpec {
  type: 'land_usufruct' | 'clt_shares' | 'coop_shares' | 'hybrid';
  valueZNU: bigint;
  legalReference: string;
}

// ============ FACTORY FUNCTIONS ============

/** Crea nodo +Colonia con configuración por defecto */
export function createColoniaNode(): ColoniaNode {
  return {
    did: 'did:key:colonya-uy',
    name: '+Colonia',
    location: { lat: -34.47, lng: -57.85, name: '+Colonia, Colonia del Sacramento, Uruguay' },
    areaHa: 515,
    coastKm: 7,
    energyMatrix: {
      renewablePercent: 97,
      sources: [
        { type: 'solar', capacityKw: 50000, annualProductionKwh: 87600000, location: { lat: -34.47, lng: -57.85 } },
        { type: 'wind', capacityKw: 30000, annualProductionKwh: 105120000, location: { lat: -34.48, lng: -57.84 } },
        { type: 'grid', capacityKw: 10000, annualProductionKwh: 8760000, location: { lat: -34.47, lng: -57.85 } },
      ],
      totalCapacityKw: 90000,
      storageCapacityKwh: 200000,
      gridConnection: 'hybrid',
    },
    greenSpaceRatio: 0.50,
    connectivity: {
      fiberGbps: 1,
      mobile5g: true,
      wifi6Coverage: true,
      meshNodes: 50,
      dtnBundles: true,
    },
    masterplan: {
      architect: 'Gómez Platero',
      designPrinciples: ['entramado_celular', 'densidad_variable', '50%_verde_obligatorio', 'ciudad_15_minutos'],
      cells: createMasterplanCells(),
      phasing: createMasterplanPhases(),
    },
    districts: ['genesis', 'outdoors', 'reserva', 'playas', 'wellness', 'deportes', 'centro_calabres', 'muelle_calabres', 'vial_costero', 'conexion_mvd'],
    governance: {
      type: 'hybrid',
      assemblyFrequencyDays: 90,
      votingMethod: 'hybrid',
      quorum: 0.6,
      commissions: createCommissions(),
      juries: createCivicJuries(),
    },
    education: {
      lifelongLearning: true,
      codingSchools: true,
      universityCampus: true,
      businessSchoolAlliances: ['IEEM', 'ORT', 'UCUDAL'],
      phPrograms: ['Regenerative Urbanism', 'Energy Systems', 'Governance'],
      tqCreditedCourses: true,
    },
    culture: {
      artsCenter: true,
      gastronomyHub: true,
      musicVenues: 5,
      culturalBridgeBsAsMvd: true,
      eventsPerYear: 50,
      tqCulturalEconomy: true,
    },
    legalEntity: 'Ala Este SAS',
    investmentUSD: 500_000_000,
    stage: 'construction',
  };
}

function createMasterplanCells(): MasterplanCell[] {
  return [
    { id: 'genesis_01', district: 'genesis', areaHa: 50, density: 'alta', mixedUse: true, greenSpaceRatio: 0.4, tqInfrastructure: true },
    { id: 'outdoors_01', district: 'outdoors', areaHa: 100, density: 'baja', mixedUse: false, greenSpaceRatio: 0.8, tqInfrastructure: true },
    { id: 'reserva_01', district: 'reserva', areaHa: 150, density: 'baja', mixedUse: false, greenSpaceRatio: 0.95, tqInfrastructure: false },
    { id: 'playas_01', district: 'playas', areaHa: 80, density: 'media', mixedUse: true, greenSpaceRatio: 0.3, tqInfrastructure: true },
    { id: 'wellness_01', district: 'wellness', areaHa: 30, density: 'media', mixedUse: true, greenSpaceRatio: 0.5, tqInfrastructure: true },
    { id: 'deportes_01', district: 'deportes', areaHa: 40, density: 'baja', mixedUse: false, greenSpaceRatio: 0.6, tqInfrastructure: true },
    { id: 'centro_calabres_01', district: 'centro_calabres', areaHa: 25, density: 'alta', mixedUse: true, greenSpaceRatio: 0.2, tqInfrastructure: true },
    { id: 'muelle_calabres_01', district: 'muelle_calabres', areaHa: 15, density: 'media', mixedUse: true, greenSpaceRatio: 0.1, tqInfrastructure: true },
    { id: 'vial_costero_01', district: 'vial_costero', areaHa: 15, density: 'baja', mixedUse: false, greenSpaceRatio: 0.7, tqInfrastructure: true },
    { id: 'conexion_mvd_01', district: 'conexion_mvd', areaHa: 10, density: 'baja', mixedUse: false, greenSpaceRatio: 0.8, tqInfrastructure: true },
  ];
}

function createMasterplanPhases(): MasterplanPhase[] {
  return [
    { phase: 1, name: 'Infraestructura Base + Distrito Génesis', startDate: Date.now(), endDate: Date.now() + 365*24*60*60*1000, hectares: 100, investmentUSD: 100_000_000, milestones: ['TQ Network deployed', 'Mesh/DTN operational', '50 hogares TQ accounts', 'CPP pools registered'] },
    { phase: 2, name: 'Expansión Residencial + Ecosistema Innovación', startDate: Date.now() + 365*24*60*60*1000, endDate: Date.now() + 2*365*24*60*60*1000, hectares: 200, investmentUSD: 200_000_000, milestones: ['500 hogares TQ', '20 startups en pool innovación', 'ZNU credit 100 viviendas', 'CLT constituido'] },
    { phase: 3, name: 'Ciudad Completa + Federación Cono Sur', startDate: Date.now() + 2*365*24*60*60*1000, endDate: Date.now() + 5*365*24*60*60*1000, hectares: 515, investmentUSD: 500_000_000, milestones: ['Autonomía plena ALRAC', 'Federación 3+ nodos TQ', 'Velocity ZNU > 0', 'Gobernanza 1a1v real'] },
  ];
}

function createCommissions(): Commission[] {
  return [
    { id: 'com_energia', name: 'Comisión Energía', domain: 'energia', members: [], mandateDays: 365, budgetTQ: 10000n },
    { id: 'com_agua', name: 'Comisión Agua', domain: 'agua', members: [], mandateDays: 365, budgetTQ: 5000n },
    { id: 'com_residuos', name: 'Comisión Residuos', domain: 'residuos', members: [], mandateDays: 365, budgetTQ: 3000n },
    { id: 'com_cultura', name: 'Comisión Cultura', domain: 'cultura', members: [], mandateDays: 365, budgetTQ: 5000n },
    { id: 'com_innovacion', name: 'Comisión Innovación', domain: 'innovacion', members: [], mandateDays: 365, budgetTQ: 20000n },
    { id: 'com_educacion', name: 'Comisión Educación', domain: 'educacion', members: [], mandateDays: 365, budgetTQ: 10000n },
    { id: 'com_tierra', name: 'Comisión Tierra y Hábitat', domain: 'tierra', members: [], mandateDays: 365, budgetTQ: 50000n },
  ];
}

function createCivicJuries(): CivicJury[] {
  return [
    { id: 'jury_admisiones', domain: 'admisiones', size: 12, sortitionMethod: 'stratified', termDays: 90 },
    { id: 'jury_impuestos', domain: 'impuestos', size: 12, sortitionMethod: 'stratified', termDays: 90 },
    { id: 'jury_fondos', domain: 'distribucion_fondos', size: 12, sortitionMethod: 'stratified', termDays: 90 },
    { id: 'jury_politicas', domain: 'politicas', size: 12, sortitionMethod: 'stratified', termDays: 90 },
  ];
}

/** Crea residente +Colonia por defecto */
export function createColoniaResident(did: DID, district: District): ColoniaResident {
  return {
    did,
    tqAccount: {
      did,
      balance: 0n,
      commitments: [],
      pools: ['pool_innovacion', 'pool_energia', 'pool_cultura', 'pool_alimentos'],
      cppBridge: {
        tqToCpp: { numerator: 1n, denominator: 1n },
        cppToTq: { numerator: 1n, denominator: 1n },
        autoPooling: true,
        exposureManagement: true,
        transductionRules: [],
      },
      createdAt: Date.now(),
      lastActivity: Date.now(),
      velocity30d: 0n,
    },
    znuVesting: {
      did,
      principal: 0n,
      interestRate: 0.025,
      indexation: 'basket',
      basketComposition: new Map([['energy', 0.2], ['water', 0.2], ['food', 0.2], ['commons', 0.2], ['health_education', 0.2]]),
      startDate: Date.now(),
      maturityDate: Date.now() + 36*30*24*60*60*1000, // 36 meses
      status: 'active',
      paymentsMade: 0,
      paymentsTotal: 432, // 36 meses * 12 pagos/año (mensual)
      collateral: {
        type: 'hybrid',
        valueZNU: 0n,
        legalReference: '',
      },
    },
    cppPools: ['pool_innovacion', 'pool_energia', 'pool_cultura', 'pool_alimentos'],
    skillCredentials: [],
    proximityScore: 100, // 15-min city compliance target
    district,
    joinedAt: Date.now(),
  };
}

/** Calcula score de proximidad 15-min city */
export function calculateProximityScore(
  resident: ColoniaResident,
  node: ColoniaNode
): number {
  // En implementación real: cálculo geoespacial real
  // Por ahora: score basado en distrito y servicios accesibles
  const districtScores: Record<District, number> = {
    genesis: 95,
    outdoors: 70,
    reserva: 50,
    playas: 80,
    wellness: 85,
    deportes: 75,
    centro_calabres: 90,
    muelle_calabres: 80,
    vial_costero: 60,
    conexion_mvd: 40,
  };
  
  let score = districtScores[resident.district] || 50;
  
  // Bonus por TQ account activo
  if (resident.tqAccount.velocity30d > 0n) score += 5;
  
  // Bonus por participación en CPP pools
  if (resident.cppPools.length >= 3) score += 5;
  
  // Bonus por skill credentials
  if (resident.skillCredentials.length > 0) score += 5;
  
  return Math.min(100, score);
}

/** Genera compromiso CPP para residente (ej. energía excedente) */
export function createResidentEnergyCommitment(
  resident: ColoniaResident,
  kwh: bigint,
  expiryDays: number = 30
): CPPCommitment {
  return {
    id: `colonya_energy_${resident.did}_${Date.now()}`,
    issuer: resident.did,
    commitment: `Energía solar excedente: ${kwh} kWh`,
    quantity: kwh,
    unit: 'kWh',
    expiry: Date.now() + expiryDays * 24 * 60 * 60 * 1000,
    conditions: ['generated_on_site', 'grid_export_approved', 'smart_meter_verified'],
    poolId: 'pool_energia',
  };
}

/** Calcula capacidad de crédito ZNU basada en TQ velocity + CPP exposure */
export function calculateZNUCreditCapacity(
  resident: ColoniaResident,
  node: ColoniaNode
): bigint {
  const tqVelocity = resident.tqAccount.velocity30d;
  const cppExposure = resident.cppPools.length * 1000n; // Estimado
  const proximityBonus = BigInt(Math.floor(resident.proximityScore / 10)) * 100n;
  
  // Fórmula: base 5000 ZNU + velocity factor + proximity - exposure
  const baseCapacity = 5000n;
  const velocityFactor = tqVelocity / 10n; // 1 ZNU per 10 TQ velocity
  const exposureDeduction = cppExposure / 10n;
  
  const capacity = baseCapacity + velocityFactor + proximityBonus - exposureDeduction;
  return capacity > 0n ? capacity : 0n;
}