// ============ COMMITMENT POOLING PROTOCOL (Capa 2 ALRAC) ============
// Basado en definición canónica Will Ruddick + Nondominium federation primitives
// "CPP keeps obligation attached to particular commitments and particular issuers, then uses pools to make those commitments exchangeable."
// "Commitment Pooling Protocol is a coordination protocol abstracted in part from patterns of human social coordination, where autonomous agents can coordinate commitments, limits, exchange, authority, and shared memory without requiring a digital substrate."

import type { DID, Timestamp, ActionHash, ConversionFactor } from './alrac';

// ============ TIPOS CORE CPP ============

export interface CPPCommitment {
  id: string;
  issuer: DID;                              // Emisor específico (NO cuenta única TQ)
  commitment: string;                       // Descripción legible humano
  quantity: bigint;                         // En unidades base (kWh, horas, kg, etc.)
  unit: 'kWh' | 'hours' | 'kg' | 'custom';
  expiry: Timestamp;                        // Límite temporal
  conditions: string[];                     // Condiciones de cumplimiento
  poolId?: PoolId;                          // Pool al que pertenece (opcional)
  // Nondominium federation fields:
  ndo_identity_hash?: ActionHash;           // Link a NDO si el compromiso referencia recurso
  fulfillment_hash?: ActionHash;            // EconomicEvent que cumple el compromiso
  // Ruddick: "without requiring a digital substrate" → offline-first
  offlineProof?: OfflineProof;              // Para operación NFC/papel/voz
}

export interface OfflineProof {
  type: 'nfc' | 'paper' | 'voice' | 'qr';
  payload: string;                          // Datos serializados del compromiso
  signature: string;                        // Firma del emisor
  timestamp: Timestamp;
  witnesses?: DID[];                        // Testigos para validación social
}

export type PoolId = string & { readonly __brand: unique symbol };

export interface CPPPool {
  id: PoolId;
  name: string;
  members: DID[];                           // Participantes del pool
  commitments: CPPCommitment[];             // Compromisos pooled
  exchangeRules: ExchangeRule[];            // Reglas de intercambio entre pools
  exposureLimit: bigint;                    // Límite exposición por miembro
  authority: AuthorityConfig;               // Gobernanza del pool
  // Nondominium integration:
  ndo_identity_hash?: ActionHash;           // Pool asociado a NDO (opcional)
  // Ruddick: "curates what crosses boundaries, manages exposure"
  boundaryCuration: BoundaryRule[];         // Qué compromisos cruzan a otros pools/sistemas
  exposureManagement: ExposureLimit[];      // Límites por miembro/pool
}

export interface ExchangeRule {
  fromPool: PoolId;
  toPool: PoolId;
  rate: ConversionFactor;                   // Factor conversión (ej. 1 TQ = X kWh = Y USD)
  curated: boolean;                         // Curado por pool (gestiona qué cruza fronteras)
  // Metadata para auditoría
  createdAt: Timestamp;
  createdBy: DID;
  active: boolean;
}

export interface BoundaryRule {
  id: string;
  sourcePool: PoolId;
  targetSystem: 'cpp_pool' | 'tq_network' | 'fiat_rail' | 'unyt_alliance' | 'custom';
  targetId: string;                         // PoolId, TQNetworkId, etc.
  allowedCommitmentTypes: string[];         // Tipos de compromiso permitidos a cruzar
  requiresCuratorApproval: boolean;         // Curación humana/algorítmica
  maxVolumePerPeriod: bigint;               // Límite de volumen por período
  periodDays: number;
}

export interface ExposureLimit {
  memberDid: DID;
  poolId: PoolId;
  maxExposure: bigint;                      // Exposición máxima permitida
  currentExposure: bigint;                  // Exposición actual (calculada)
  alertThreshold: number;                   // % del límite para alerta (ej. 80%)
  hardLimit: boolean;                       // Si true, bloquea nuevos compromisos al alcanzar límite
}

export interface AuthorityConfig {
  type: 'single_curator' | 'multi_sig' | 'dao' | 'consensus' | 'algorithmic';
  curators: DID[];                          // Curadores autorizados
  threshold?: number;                       // Para multi-sig/consensus
  daoAddress?: string;                      // Si type === 'dao'
  algorithmConfig?: Record<string, unknown>; // Si type === 'algorithmic'
}

// ============ PUENTE TQ (Capa 1) ↔ CPP (Capa 2) ============

export interface CPPBridgeConfig {
  // Conversión base: 1 TQ = 1 kWh (definición Ruddick + Feria Conuquera)
  tqToCpp: ConversionFactor;                // 1 TQ → X unidades CPP (base kWh)
  cppToTq: ConversionFactor;                // X unidades CPP → 1 TQ
  // Gestión automática
  autoPooling: boolean;                     // Auto-move commitments to pools based on rules
  exposureManagement: boolean;              // Gestión límites exposición (Ruddick: "manages exposure")
  // Reglas de transducción
  transductionRules: TransductionRule[];    // Reglas para convertir TQ↔CPP commitments
}

export interface TransductionRule {
  id: string;
  name: string;
  condition: 'commitment_expiry' | 'pool_threshold' | 'manual' | 'scheduled';
  fromLayer: 1 | 2;                         // 1 = TQ, 2 = CPP
  toLayer: 1 | 2;
  conversionFactor: ConversionFactor;
  maxAmountPerTx: bigint;
  requiresApproval: boolean;
  approverRole?: string;
}

// ============ ACCIONES CPP (Pure Functions) ============

/** Crea un compromiso CPP válido */
export function createCPPCommitment(params: {
  issuer: DID;
  commitment: string;
  quantity: bigint;
  unit: CPPCommitment['unit'];
  expiry: Timestamp;
  conditions: string[];
  poolId?: PoolId;
  ndo_identity_hash?: ActionHash;
}): CPPCommitment {
  return {
    id: `cpp_commitment_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    issuer: params.issuer,
    commitment: params.commitment,
    quantity: params.quantity,
    unit: params.unit,
    expiry: params.expiry,
    conditions: params.conditions,
    poolId: params.poolId,
    ndo_identity_hash: params.ndo_identity_hash,
  };
}

/** Valida que un compromiso no haya expirado */
export function isCommitmentValid(commitment: CPPCommitment, now: Timestamp): boolean {
  return commitment.expiry > now;
}

/** Calcula exposición actual de un miembro en un pool */
export function calculateMemberExposure(
  pool: CPPPool,
  memberDid: DID,
  now: Timestamp
): bigint {
  return pool.commitments
    .filter(c => c.issuer === memberDid && isCommitmentValid(c, now))
    .reduce((sum, c) => sum + c.quantity, 0n);
}

/** Verifica si un miembro puede agregar un compromiso sin exceder límite */
export function canAddCommitment(
  pool: CPPPool,
  memberDid: DID,
  newCommitmentQuantity: bigint,
  now: Timestamp
): { allowed: boolean; reason?: string } {
  const exposureLimit = pool.exposureManagement.find(e => e.memberDid === memberDid);
  if (!exposureLimit) return { allowed: true }; // Sin límite configurado = permitido

  const currentExposure = calculateMemberExposure(pool, memberDid, now);
  const projectedExposure = currentExposure + newCommitmentQuantity;

  if (projectedExposure > exposureLimit.maxExposure) {
    return {
      allowed: false,
      reason: `Exposición superaría límite: ${projectedExposure} > ${exposureLimit.maxExposure}`,
    };
  }

  if (exposureLimit.hardLimit && projectedExposure >= exposureLimit.maxExposure) {
    return { allowed: false, reason: 'Límite duro alcanzado' };
  }

  return { allowed: true };
}

/** Aplica regla de intercambio entre pools */
export function applyExchangeRule(
  rule: ExchangeRule,
  amount: bigint,
  fromPool: CPPPool,
  toPool: CPPPool
): { success: boolean; convertedAmount: bigint; reason?: string } {
  if (!rule.active) return { success: false, convertedAmount: 0n, reason: 'Regla inactiva' };
  if (rule.fromPool !== fromPool.id || rule.toPool !== toPool.id) {
    return { success: false, convertedAmount: 0n, reason: 'Pools no coinciden con regla' };
  }

  const convertedAmount = (amount * rule.rate.numerator) / rule.rate.denominator;
  return { success: true, convertedAmount };
}

/** Genera prueba offline para compromiso (NFC/papel/voz) */
export function generateOfflineProof(
  commitment: CPPCommitment,
  type: OfflineProof['type'],
  issuerPrivateKey: string // En implementación real: clave privada del emisor
): OfflineProof {
  const payload = JSON.stringify({
    id: commitment.id,
    issuer: commitment.issuer,
    commitment: commitment.commitment,
    quantity: commitment.quantity.toString(),
    unit: commitment.unit,
    expiry: commitment.expiry,
    conditions: commitment.conditions,
  });

  // En implementación real: firma criptográfica con issuerPrivateKey
  const signature = `sig_${Buffer.from(payload).toString('base64').slice(0, 32)}`;

  return {
    type,
    payload,
    signature,
    timestamp: Date.now(),
  };
}

/** Verifica prueba offline */
export function verifyOfflineProof(
  proof: OfflineProof,
  issuerPublicKey: string // Clave pública del emisor
): { valid: boolean; commitment?: CPPCommitment; reason?: string } {
  try {
    const payload = JSON.parse(proof.payload);
    // En implementación real: verificación criptográfica de signature con issuerPublicKey
    const commitment = payload as CPPCommitment;
    return { valid: true, commitment };
  } catch {
    return { valid: false, reason: 'Payload inválido o firma incorrecta' };
  }
}

// ============ INTEGRACIÓN NONDOMINIUM ============

/** Mapea PropertyRegime Nondominium a configuración CPP por defecto */
export function getDefaultCPPConfigForRegime(regime: string): Partial<AuthorityConfig> & { boundaryCuration: BoundaryRule[] } {
  const baseConfig = {
    boundaryCuration: [] as BoundaryRule[],
  };

  switch (regime) {
    case 'Nondominium':
      return {
        ...baseConfig,
        type: 'consensus',
        boundaryCuration: [
          {
            id: 'nondominium_outbound',
            sourcePool: 'main',
            targetSystem: 'custom',
            targetId: 'external',
            allowedCommitmentTypes: ['contribution', 'use', 'maintenance'],
            requiresCuratorApproval: true,
            maxVolumePerPeriod: 1000n,
            periodDays: 30,
          },
        ],
      };
    case 'Commons':
      return {
        ...baseConfig,
        type: 'dao',
        boundaryCuration: [
          {
            id: 'commons_outbound',
            sourcePool: 'main',
            targetSystem: 'cpp_pool',
            targetId: 'partner_pool',
            allowedCommitmentTypes: ['access', 'contribution'],
            requiresCuratorApproval: false,
            maxVolumePerPeriod: 5000n,
            periodDays: 30,
          },
        ],
      };
    case 'Pool':
      return {
        ...baseConfig,
        type: 'multi_sig',
        threshold: 2,
        boundaryCuration: [
          {
            id: 'pool_custody_transfer',
            sourcePool: 'main',
            targetSystem: 'tq_network',
            targetId: 'local_tq',
            allowedCommitmentTypes: ['custody_transfer'],
            requiresCuratorApproval: true,
            maxVolumePerPeriod: 2000n,
            periodDays: 7,
          },
        ],
      };
    default:
      return baseConfig;
  }
}

/** Convierte NdoHardLink a CPP pool relationship */
export function ndoHardLinkToPoolRelation(link: {
  link_type: 'Component' | 'DerivedFrom' | 'Supersedes';
  from_ndo: ActionHash;
  to_ndo: ActionHash;
}): BoundaryRule {
  const typeMap = {
    Component: 'component_dependency',
    DerivedFrom: 'design_evolution',
    Supersedes: 'version_supersession',
  };

  return {
    id: `ndo_${link.link_type.toLowerCase()}_${Date.now()}`,
    sourcePool: 'main',
    targetSystem: 'cpp_pool',
    targetId: link.to_ndo.toString(),
    allowedCommitmentTypes: [typeMap[link.link_type]],
    requiresCuratorApproval: link.link_type === 'Supersedes',
    maxVolumePerPeriod: 10000n,
    periodDays: 365,
  };
}

// ============ TIPOS PARA OPEN SPEC ============

export const CPP_PROTOCOL_SPEC_VERSION = '0.1.0';
export const CPP_PROTOCOL_SPEC_DATE = '2026-10-06';

export interface CPPProtocolSpec {
  version: string;
  date: string;
  // Core definitions
  commitment: CPPCommitment;
  pool: CPPPool;
  exchangeRule: ExchangeRule;
  boundaryRule: BoundaryRule;
  exposureLimit: ExposureLimit;
  authorityConfig: AuthorityConfig;
  // Bridge TQ↔CPP
  bridgeConfig: CPPBridgeConfig;
  transductionRule: TransductionRule;
  // Offline-first
  offlineProof: OfflineProof;
  // Nondominium integration
  ndoIntegration: {
    propertyRegimeDefaults: Record<string, ReturnType<typeof getDefaultCPPConfigForRegime>>;
    hardLinkMapping: ReturnType<typeof ndoHardLinkToPoolRelation>;
  };
}