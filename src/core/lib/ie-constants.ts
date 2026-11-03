// ie-constants.ts — Constantes canónicas del Protocolo IE (WhatMatters)
// Basado en: contracts/src/libraries/RCEMath.sol, ProtocolFee.sol, AttestationRegistry.sol
// Coeficientes tomados VERBATIM del prototipo Excel WhatMatters (niveles 1-21)

export const IE_MAX_LEVEL = 21;

// Pesos RCE (numerador sobre denominador 3)
export const IE_W_FULL = 3n;  // Alta / Tronco / Semilla -> 1 RCE
export const IE_W_LOW = 2n;   // Baja -> 2/3 RCE
export const IE_W_MID = 1n;   // Media -> 1/3 RCE

export type IEWeightClass = 'full' | 'low' | 'mid';

export const IE_WEIGHT_NUM: Record<IEWeightClass, bigint> = {
  full: IE_W_FULL,
  low: IE_W_LOW,
  mid: IE_W_MID,
};

export const IE_WEIGHT_LABEL: Record<IEWeightClass, string> = {
  full: 'Alta / Tronco / Semilla',
  low: 'Baja',
  mid: 'Media',
};

export const IE_WEIGHT_RCE_RATIO: Record<IEWeightClass, string> = {
  full: '1 RCE',
  low: '2/3 RCE',
  mid: '1/3 RCE',
};

// Coeficientes canónicos RCE por nivel (1-21) — VERBATIM del prototipo WhatMatters
// Valor 1 RCE = fondo / coeficiente[nivel]
export const IE_COEFFICIENTS: readonly bigint[] = [
  3n,           // L1
  11n,          // L2
  33n,          // L3
  99n,          // L4
  288n,         // L5  ← Calibración exacta: $288,008 → $1,000.03
  864n,         // L6
  2565n,        // L7
  7695n,        // L8
  23088n,       // L9
  69267n,       // L10
  207048n,      // L11
  621120n,      // L12
  1863363n,     // L13
  5583450n,     // L14
  16750272n,    // L15
  50250819n,    // L16
  150693168n,   // L17
  452079264n,   // L18
  1356237795n,  // L19
  4068181218n,  // L20
  12204542928n, // L21
] as const;

// Staking (Polkadot-style)
export const IE_STAKE_UNIT = 1_000_000_000n;  // 1,000 mUSDC (6 decimales)
export const IE_MAX_STAKE_BONUS = 6n;         // +1 peso por STAKE_UNIT, max +6

// Peer Scoring GIVE (Coordinape-style)
export const IE_GIVE_BUDGET = 100n;   // Presupuesto GIVE por participante por desafío
export const IE_GIVE_UNIT = 20n;      // +1 peso por GIVE_UNIT recibido
export const IE_MAX_GIVE_BONUS = 5n;  // Cap bonus GIVE

// Comisión regresiva de protocolo (basis points)
// Umbrales en base units (6 decimales, ej. USDC)
export interface IEFeeTier {
  max: bigint;    // 0 = sin límite (último tier)
  bps: number;    // basis points (10000 = 100%)
}

export const IE_FEE_TIERS: readonly IEFeeTier[] = [
  { max: 10_000_000_000n, bps: 1000 },    // ≤ 10,000 USDC    -> 10%
  { max: 100_000_000_000n, bps: 700 },    // ≤ 100,000 USDC   -> 7%
  { max: 1_000_000_000_000n, bps: 400 },  // ≤ 1,000,000 USDC -> 4%
  { max: 10_000_000_000_000n, bps: 200 }, // ≤ 10,000,000 USDC -> 2%
  { max: 0n, bps: 100 },                   // > 10,000,000 USDC -> 1% (max=0 = sin límite)
] as const;

export const IE_BPS = 10_000n;

// Esquemas de atestación (EAS-compatible ids)
export const IE_SCHEMAS = {
  contribution: 'WhatMatters:Contribution',
  consensus: 'WhatMatters:MilestoneConsensus',
  role: 'WhatMatters:Role',
  impact: 'WhatMatters:ImpactCertification',
} as const;

export type IESchemaKey = keyof typeof IE_SCHEMAS;

// Modos de financiamiento (Principio Anfibio)
export type IEFundingMode = 'postmonetario' | 'conectado';

export interface IEFundingConfig {
  mode: IEFundingMode;
  token: 'ZNU' | 'USDC' | string;
  priceParity?: number;          // ZNU/USD oráculo (modo conectado)
  caasStreams?: string[];        // ['suscripcion', 'revenue_share', 'b2b', 'afiliados_verdes', 'educacion']
}

// Presets para calculadora RCE
export const IE_RCE_PRESETS = [
  { label: 'Prototipo WhatMatters', value: 288008 },
  { label: 'Premio XPRIZE', value: 3500000 },
  { label: '1 Millón USD', value: 1000000 },
  { label: '100 Millones USD', value: 100000000 },
] as const;

// Achievements IE Protocol
export const IE_ACHIEVEMENTS = [
  { id: 'first_challenge', name: 'Primer Desafío', description: 'Creaste tu primer desafío IE', icon: '🌱', threshold: 1 },
  { id: 'seed_planter', name: 'Sembrador', description: 'Registraste una semilla en un desafío', icon: '🌿', threshold: 1 },
  { id: 'network_builder', name: 'Constructor de Red', description: 'Te uniste a una posición (join)', icon: '🌳', threshold: 1 },
  { id: 'contributor', name: 'Contribuyente', description: 'Registraste tu primer aporte', icon: '📝', threshold: 1 },
  { id: 'consensus_maker', name: 'Hacedor de Consenso', description: 'Aprobaste tu primer hito', icon: '✅', threshold: 1 },
  { id: 'rce_earner', name: 'Ganador RCE', description: 'Cobraste tu primera RCE', icon: '💰', threshold: 1 },
  { id: 'coordinator', name: 'Coordinador/a', description: 'Fuiste marcado como coordinador', icon: '🎯', threshold: 1 },
  { id: 'staker', name: 'Staker', description: 'Stakeaste tokens en tu posición', icon: '🔒', threshold: 1 },
  { id: 'give_giver', name: 'Reconocedor', description: 'Diste GIVE a un par', icon: '🤝', threshold: 1 },
  { id: 'impact_certified', name: 'Impacto Certificado', description: 'Recibiste un certificado de impacto', icon: '🏆', threshold: 1 },
  { id: 'level_5', name: 'Nivel 5 Alcanzado', description: 'Red llegó a 243 personas base', icon: '🏟️', threshold: 1 },
  { id: 'level_10', name: 'Estadio Lleno', description: 'Red llegó a ~59,000 personas', icon: '🌍', threshold: 1 },
  { id: 'level_20', name: 'Escala Planetaria', description: 'Red llegó a ~3.4B personas', icon: '🪐', threshold: 1 },
] as const;

// Storage keys
export const IE_STORAGE_KEY = 'ie_protocol_v1';
export const IE_STORAGE_VERSION = 1;