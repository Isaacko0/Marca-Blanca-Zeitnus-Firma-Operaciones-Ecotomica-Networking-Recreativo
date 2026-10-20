// HSCSG v15 OS — β_crit Implementation (applyBetaCrit real)
// Redistribución atómica, trazabilidad RAO, anti-doble-gasto

import type { 
  TQNodeState, 
  BetaCritConfig, 
  BetaCritResult, 
  RedistributionDestination, 
  CommunityFund, 
  FundAllocation,
  TQTransaction,
  TQAccount
} from './tq';

// ============================================================================
// FUNCIONES AUXILIARES (placeholders - en producción usar implementaciones criptográficas reales)
// ============================================================================

function getNode(nodeId: string): TQNodeState | null {
  // TODO: Implementar obtención real del nodo desde estado/DB
  // Placeholder para spec
  return null;
}

function hashData(data: string): string {
  // TODO: SHA-256 real
  // Placeholder para spec
  return '0'.repeat(64);
}

function signData(data: string, privateKey: string): string {
  // TODO: Firmar con clave privada Ed25519 real
  // Placeholder para spec
  return 'signature';
}

function verifySignature(data: string, signature: string, publicKey: string): boolean {
  // TODO: Verificar firma Ed25519 real
  // Placeholder para spec
  return true;
}

function anchorToRAO(transfers: RedistributionDestination[]): string {
  // TODO: Anclar a RAO real
  const payload = JSON.stringify(transfers);
  return `RAO:beta_crit:${hashData(payload)}:${Date.now()}`;
}

function executeTransfer(
  fromAccount: string, 
  toAccount: string, 
  amount: number, 
  type: TQTransaction['type'],
  raoCredentialId: string
): TQTransaction {
  // TODO: Ejecutar transferencia real en ledger TQ
  return {
    id: `tx_${Date.now()}_${Math.random().toString(36).slice(2,9)}`,
    from: fromAccount,
    to: toAccount,
    type,
    amount,
    timestamp: Date.now(),
    raoCredentialId,
    fromCurrency: 'TQ',
    toCurrency: 'TQ'
  };
}

// ============================================================================
// IMPLEMENTACIÓN REAL DE applyBetaCrit
// ============================================================================

export function applyBetaCrit(nodeId: string, config: BetaCritConfig): BetaCritResult {
  const node = getNode(nodeId);
  
  if (!node) {
    return { 
      applied: false, 
      timestamp: Date.now(),
      error: `Nodo ${nodeId} no encontrado`
    };
  }
  
  const totalLiquidity = node.communityFund.balance; // Simplificado: balance del fondo comunitario
  const threshold = totalLiquidity * config.threshold; // 30% por defecto
  
  if (node.communityFund.balance <= threshold) {
    return { 
      applied: false, 
      timestamp: Date.now(),
      reason: `Balance ${node.communityFund.balance} ≤ threshold ${threshold}`
    };
  }
  
  const excess = node.communityFund.balance - threshold;
  const redistributed = excess * config.rate; // 50% por defecto
  const retained = excess * (1 - config.rate);
  
  // Calcular destinos basados en asignaciones aprobadas
  const destinations = computeRedistributionDestinations(redistributed, node.communityFund);
  
  if (destinations.length === 0) {
    return {
      applied: false,
      timestamp: Date.now(),
      reason: 'No hay asignaciones aprobadas para redistribuir',
      excess,
      redistributed: 0,
      retained
    };
  }
  
  // Ejecutar redistribución atómica
  const transfers = executeRedistributionAtomic(destinations, nodeId, config);
  
  if (!transfers.success) {
    return {
      applied: false,
      timestamp: Date.now(),
      reason: transfers.error || 'Falló redistribución atómica',
      excess,
      redistributed: 0,
      retained
    };
  }
  
  // Verificar no doble gasto
  const doubleSpendCheck = verifyNoDoubleSpend(transfers.transactions);
  if (!doubleSpendCheck.valid) {
    return {
      applied: false,
      timestamp: Date.now(),
      reason: `Doble gasto detectado: ${doubleSpendCheck.violations.join(', ')}`,
      excess,
      redistributed: 0,
      retained
    };
  }
  
  // Anclar a RAO
  const raoCredentialId = anchorToRAO(transfers.transactions.map(t => ({
    type: t.type,
    from: t.from,
    to: t.to,
    amount: t.amount,
    timestamp: t.timestamp
  })));
  
  return {
    applied: true,
    excess,
    redistributed,
    retained,
    destinations: transfers.transactions.map(t => ({
      type: 'community_fund' as const,
      targetId: t.to,
      amount: t.amount
    })),
    timestamp: Date.now(),
    raoCredentialId,
    transactions: transfers.transactions
  };
}

interface RedistributionExecutionResult {
  success: boolean;
  transactions: TQTransaction[];
  error?: string;
}

function computeRedistributionDestinations(
  amount: number, 
  fund: CommunityFund
): RedistributionDestination[] {
  // Filtrar asignaciones aprobadas
  const approvedAllocations = fund.allocations.filter(a => a.status === 'approved');
  
  if (approvedAllocations.length === 0) {
    return [];
  }
  
  // Calcular total aprobado
  const totalApproved = approvedAllocations.reduce((sum, a) => sum + a.amount, 0);
  
  if (totalApproved === 0) {
    return [];
  }
  
  // Distribuir proporcionalmente a asignaciones aprobadas
  // Con techo: máx 20% del fondo por propuesta (gobernanza)
  const maxPerProposal = fund.balance * fund.governance.maxAllocationPerProposal;
  
  return approvedAllocations.map(allocation => {
    const proportionalAmount = amount * (allocation.amount / totalApproved);
    const cappedAmount = Math.min(proportionalAmount, maxPerProposal);
    
    return {
      type: 'community_fund' as const,
      targetId: allocation.id,
      amount: cappedAmount
    };
  });
}

function executeRedistributionAtomic(
  destinations: RedistributionDestination[],
  nodeId: string,
  config: BetaCritConfig
): RedistributionExecutionResult {
  const transactions: TQTransaction[] = [];
  const raoCredentialId = `RAO:beta_crit:${nodeId}:${Date.now()}`;
  
  try {
    // En implementación real: transacción atómica en base de datos/ledger
    // Aquí simulamos ejecución secuencial con rollback si falla
    
    for (const dest of destinations) {
      // Obtener cuenta origen (fondo comunitario del nodo)
      const fromAccount = `community_fund_${nodeId}`;
      const toAccount = dest.targetId;
      
      const tx = executeTransfer(
        fromAccount,
        toAccount,
        dest.amount,
        'regeneration', // β_crit redistribuye a regeneración
        raoCredentialId
      );
      
      transactions.push(tx);
    }
    
    // Verificar que la suma de transferencias = amount total
    const totalTransferred = transactions.reduce((sum, t) => sum + t.amount, 0);
    const expectedTotal = destinations.reduce((sum, d) => sum + d.amount, 0);
    
    if (Math.abs(totalTransferred - expectedTotal) > 0.001) {
      throw new Error(`Suma transferencias (${totalTransferred}) ≠ expected (${expectedTotal})`);
    }
    
    return { success: true, transactions };
    
  } catch (error) {
    // Rollback: en implementación real, revertir transacciones
    return { 
      success: false, 
      transactions: [], 
      error: error instanceof Error ? error.message : 'Error desconocido en redistribución' 
    };
  }
}

function verifyNoDoubleSpend(transactions: TQTransaction[]): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  const seen = new Map<string, number>(); // accountId -> total amount
  
  for (const tx of transactions) {
    // Verificar cuenta origen no gasta más de lo que tiene
    // En implementación real: consultar balance actual
    const fromKey = tx.from;
    const currentSpent = seen.get(fromKey) || 0;
    seen.set(fromKey, currentSpent + tx.amount);
    
    // Verificar que la transacción cumple prohibición cambiaria
    if (!verifyTQProhibition(tx)) {
      violations.push(`Transacción ${tx.id} viola prohibición cambiaria TQ`);
    }
    
    // Verificar límites ±500
    // En implementación real: consultar balance destino
    if (tx.amount > 500) {
      violations.push(`Transacción ${tx.id} excede límite ±500 TQ`);
    }
  }
  
  return { valid: violations.length === 0, violations };
}

// Re-exportar verifyTQProhibition para uso interno
function verifyTQProhibition(tx: TQTransaction): boolean {
  return (
    tx.fromCurrency === 'TQ' &&
    tx.toCurrency === 'TQ' &&
    ['reciprocity', 'production', 'regeneration'].includes(tx.type) &&
    !('exchangeRate' in tx) &&
    !('fiatValue' in tx)
  );
}

// ============================================================================
// FUNCIÓN PARA CREAR FONDO COMUNITARIO CON β_crit CONFIGURADO
// ============================================================================

export function createCommunityFundWithBetaCrit(
  nodeId: string,
  betaCritConfig?: Partial<BetaCritConfig>
): CommunityFund {
  const defaultConfig: BetaCritConfig = {
    threshold: 0.30,      // 30% liquidez total
    rate: 0.50,           // 50% excedente redistribuido
    frequency: 'monthly'
  };
  
  const config = { ...defaultConfig, ...betaCritConfig };
  
  return {
    id: `fund_${nodeId}_${Date.now()}`,
    nodeId,
    balance: 0,
    allocations: [],
    governance: {
      proposalThreshold: 0.05,      // 5% fondo para proponer
      approvalQuorum: 0.60,         // 60% asamblea
      auditRequired: true,
      maxAllocationPerProposal: 0.20, // 20% máx por propuesta
      betaCritConfig: config
    }
  };
}

// ============================================================================
// PROPÓSITOS VÁLIDOS PARA ASIGNACIONES (incluye nuevos de PMCRT)
// ============================================================================

export type FundPurpose = 
  | 'soil_regeneration'
  | 'water_infrastructure'
  | 'energy_sovereignty'
  | 'housing_regenerative'
  | 'health_access'
  | 'education'
  | 'emergency'
  | 'memory'            // ← NUEVO: Fondo Memoria (PMCRT)
  | 'food'              // ← NUEVO: Autotrofia alimentaria (PMCRT)
  | 'preventive_care';  // ← NUEVO: Cuidado preventivo (PMCRT)

export const FUND_PURPOSES: FundPurpose[] = [
  'soil_regeneration',
  'water_infrastructure',
  'energy_sovereignty',
  'housing_regenerative',
  'health_access',
  'education',
  'emergency',
  'memory',
  'food',
  'preventive_care'
];

export function isValidFundPurpose(purpose: string): purpose is FundPurpose {
  return FUND_PURPOSES.includes(purpose as FundPurpose);
}