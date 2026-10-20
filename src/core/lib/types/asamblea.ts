// HSCSG v15 OS — Tipos para configuración asamblearia
// Single source of truth para todos los parámetros mutables

export interface AsambleaConfig {
  version: string;
  lastAssemblyDecision: string;           // ISO8601
  decidedBy: string;                      // asamblea ID
  raoAnchor: string;                      // RAO credential ID
  
  // ===== D1-D8: DECISIONES FONDOS =====
  tresFondos: TresFondosConfig;
  miembro: MiembroConfig;
  herencia: HerenciaConfig;
  datosSensibles: DatosSensiblesConfig;
  noMiembros: NoMiembrosConfig;
  
  // ===== MÉTODOS DE REPARTICIÓN =====
  metodosReparticion: MetodosReparticionConfig;
  
  // ===== GOBERNANZA FONDO COMUNITARIO =====
  fondoComunitarioGobernanza: FondoComunitarioGobernanzaConfig;
}

export interface TresFondosConfig {
  porcentajeFijoExcedenteFiat: number;    // 0-1, ej: 0.10 = 10%
  sueloEstatutario: number;               // 0-1, suelo inmodificable por Asamblea
  unidadExcedente: ExcessUnit;            // Sobre qué unidad se aplica el %
  clausulaArranque: ClausulaArranqueConfig;
  pesosInternos: FondosPesosInternos;     // Distribución entre los 3 fondos
}

export type ExcessUnit = 'fiat_neto' | 'tq_beta_crit' | 'kwh_termodinamico';

export interface ClausulaArranqueConfig {
  activa: boolean;
  triggerContratoId: string | null;
  primerContratoReal: string | null;
}

export interface FondosPesosInternos {
  memoria: number;        // 0-1, suma = 1.0
  cuidado: number;        // 0-1
  autotrofia: number;     // 0-1
}

export interface MiembroConfig {
  stakeZNUMinimo: number;           // Tier CaaS mínimo (ej: 20 = Aprendiz)
  autMinimo: number;                // AUT mínimo 0-1+
  cdsMinimo: number;                // CDS mínimo 0-1+
  requiereVerificacionTriaxial: boolean;
}

export interface HerenciaConfig {
  hereda: HeredableAsset[];         // Qué SÍ se hereda
  noHereda: NonHeredableAsset[];    // Qué NO se hereda (inmutables)
  mecanismo: string;                // Ej: "clausula_estatutos_cooperativa"
}

export type HeredableAsset = 
  | 'obra' 
  | 'memoria' 
  | 'reputacion_erc8004' 
  | 'complete_data_package';

export type NonHeredableAsset = 
  | 'hr_vital' 
  | 'znu' 
  | 'tq';

export interface DatosSensiblesConfig {
  consentimientoRevocable: boolean;
  datosPersonalesOffLedger: boolean;
  soloHashesEnRAO: boolean;
  lfpddppCompliance: boolean;
  datosFallecidos: 'requiere_asesoria_legal' | 'resuelto' | 'pendiente';
}

export interface NoMiembrosConfig {
  politica: NoMiembroPolitica;
  definicionServicioLongevidad: string;
  definicionLucro: string;
  excedenteGeneradoAFondos: number;   // 0-1, % excedente que va a fondos
}

export type NoMiembroPolitica = 'prohibicion_total' | 'permiso_costo_real';

export interface MetodosReparticionConfig {
  fondoSolarpunk: FondoSolarpunkConfig;
  commonomicsGaia: CommonomicsGaiaConfig;
  gaiaCommons33: GaiaCommons33Config;
  alracBetaCrit: AlracBetaCritConfig;
  caasRevenueShare: CaasRevenueShareConfig;
  virginiaNetwork: VirginiaNetworkConfig;
  tripartita50301055: Tripartita50301055Config;
  frneEcoaldea: FrneEcoaldeaConfig;
  ecosystem4Circulos: Ecosystem4CirculosConfig;
  ldfvAlrac: LdfvAlracConfig;
}

export interface FondoSolarpunkConfig {
  activo: boolean;
  porcentaje: number;         // 0-1, ej: 0.25 = 25%
  pgsThreshold: number;       // PGS mínimo para recibir subvención
  destino: string;            // Ej: "subvenciones_nodos"
}

export interface CommonomicsGaiaConfig {
  activo: boolean;
  platformPct: number;
  marketingPct: number;
  referralPct: number;
  contingencyPct: number;
  facilitador: string;        // "caso_a_caso" | porcentaje fijo
}

export interface GaiaCommons33Config {
  activo: boolean;
  localPct: number;
  nationalPct: number;
  globalPct: number;
}

export interface AlracBetaCritConfig {
  activo: boolean;
  betaThreshold: number;      // % liquidez total (default 0.30)
  betaRate: number;           // % excedente redistribuido (default 0.50)
  proposalThreshold: number;  // % fondo para proponer (default 0.05)
  approvalQuorum: number;     // % asamblea (default 0.60)
  maxAllocationPerProposal: number; // % fondo máx/propuesta (default 0.20)
}

export interface CaasRevenueShareConfig {
  activo: boolean;
  autWeight: number;          // Peso AUT en fórmula (default 0.5)
  cdsWeight: number;          // Peso CDS en fórmula (default 0.5)
  demurrageThreshold: number; // Umbral ZNU para demurrage (default 300)
  demurrageRate: number;      // Tasa demurrage (default 0.05 = 5%)
}

export interface VirginiaNetworkConfig {
  activo: boolean;
  n3Divisor: number;          // Divisor para peso N3 = kWh/1000
  demurrageBase: number;      // Tasa base demurrage dinámico
  demurrageProgressive: number; // Progresividad demurrage
}

export interface Tripartita50301055Config {
  activo: boolean;
  nodosPct: number;
  tierraPct: number;
  educacionPct: number;
  infraPct: number;
  reservaPct: number;
}

export interface FrneEcoaldeaConfig {
  activo: boolean;
  fondoComunitarioPct: number;
  penalizacionEspeculacion: string; // "formula_frne" | fórmula explícita
}

export interface Ecosystem4CirculosConfig {
  activo: boolean;
  circlePcts: number[];       // [C1, C2, C3, C4] = [0.15, 0.20, 0.35, 0.30]
  autCoeff: number;
  cdsCoeff: number;
  baseCoeff: number;
  bonusCap: number;
}

export interface LdfvAlracConfig {
  activo: boolean;
  halfShare: number;          // ½ en fórmula LDFV
  decayFactor: number;        // 0.95^k
  harmonyDivisor: number;     // 10 en (1 + αʰ/10)
  ppeThreshold: string;       // "mitad_theta" | fórmula
  betaCritFormula: string;    // "custom" | fórmula
}

export interface FondoComunitarioGobernanzaConfig {
  proposalThreshold: number;      // % fondo para proponer
  approvalQuorum: number;         // % asamblea para aprobar
  auditRequired: boolean;         // Siempre true
  maxAllocationPerProposal: number; // % fondo máx por propuesta
  propositosPermitidos: FundPurpose[];
}

export type FundPurpose = 
  | 'soil_regeneration'
  | 'water_infrastructure'
  | 'energy_sovereignty'
  | 'housing_regenerative'
  | 'health_access'
  | 'education'
  | 'emergency'
  | 'memory'            // ← NUEVO: Fondo Memoria
  | 'food'              // ← NUEVO: Autotrofia alimentaria
  | 'preventive_care';  // ← NUEVO: Cuidado preventivo

// ============================================
// RESULT TYPES para validaciones
// ============================================

export interface MJGateResult {
  checks: Record<string, boolean>;
  overall: 'ok' | 'warn' | 'blocked';
  actionables: string[];
}

export interface SimulationMetrics {
  excedente_anual_fondos_znu: number;
  cobertura_cuidado_pct: number;
  brecha_equidad_gini: number;
  consentimiento_memoria_pct: number;
  excedente_autotrofia_znu: number;
}