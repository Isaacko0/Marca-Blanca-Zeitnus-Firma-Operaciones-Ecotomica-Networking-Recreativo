// ie-protocol.ts — Lógica pura del Protocolo IE (WhatMatters)
// Funciones deterministas, sin side effects, testeable off-chain
// Basado en contracts/src/WhatMatters.sol adaptado a HSCSG v15 OS

import {
  IE_MAX_LEVEL,
  IE_W_FULL,
  IE_W_LOW,
  IE_W_MID,
  IE_STAKE_UNIT,
  IE_MAX_STAKE_BONUS,
  IE_GIVE_UNIT,
  IE_MAX_GIVE_BONUS,
} from './ie-constants';
import {
  IEChallenge,
  IEPosition,
  IEMilestone,
  IEPositionView,
  IEGiveAllocation,
  IEFundingConfig,
  IEWeightClass,
  IELevel,
} from './ie-types';
import { iePayout, ieRCETable, ieFormatUSDC } from './ie-rce-math';
import { ieSplit } from './ie-protocol-fee';

// ============================================================================
// GENERADORES DE IDs
// ============================================================================

let _challengeCounter = 0;
let _positionCounter = 0;
let _milestoneCounter = 0;

export function ieGenerateChallengeId(): string {
  return `ch_${Date.now()}_${++_challengeCounter}_${Math.random().toString(36).slice(2, 8)}`;
}

export function ieGeneratePositionId(): string {
  return `pos_${Date.now()}_${++_positionCounter}_${Math.random().toString(36).slice(2, 8)}`;
}

export function ieGenerateMilestoneId(): string {
  return `ms_${Date.now()}_${++_milestoneCounter}_${Math.random().toString(36).slice(2, 8)}`;
}

// ============================================================================
// CREACIÓN DE DESAFÍO
// ============================================================================

export interface CreateChallengeInput {
  funder: string;
  token: string;
  metaURI: string;
  milestones: { title: string; amount: bigint; approvalsRequired: number }[];
  fundingConfig: IEFundingConfig;
}

export function ieCreateChallenge(input: CreateChallengeInput): IEChallenge {
  const id = ieGenerateChallengeId();
  const now = Date.now();
  
  return {
    id,
    funder: input.funder,
    token: input.token,
    metaURI: input.metaURI,
    funded: 0n,
    released: 0n,
    level: 1,
    seedCount: 0,
    milestones: input.milestones.map((m, i) => ({
      id: ieGenerateMilestoneId(),
      title: m.title,
      amount: m.amount,
      approvalsRequired: m.approvalsRequired,
      approvals: 0,
      released: false,
    })),
    status: 'forming',
    fundingConfig: input.fundingConfig,
    createdAt: now,
    updatedAt: now,
  };
}

// ============================================================================
// FONDEO CON COMISIÓN REGRESIVA
// ============================================================================

export function ieFundChallenge(
  challenge: IEChallenge,
  gross: bigint
): { challenge: IEChallenge; fee: bigint; net: bigint } {
  const { fee, net } = ieSplit(gross);
  return {
    challenge: {
      ...challenge,
      funded: challenge.funded + net,
      updatedAt: Date.now(),
    },
    fee,
    net,
  };
}

// ============================================================================
// CRECIMIENTO RED TRIÁDICA (3→2)
// ============================================================================

/**
 * Crea una nueva posición en el árbol
 */
export function ieCreatePosition(
  challenge: IEChallenge,
  holder: string,
  parentId: string,
  depth: number
): { position: IEPosition; newChallenge: IEChallenge } {
  const positionId = ieGeneratePositionId();
  const weightClass = depth === 1 ? 'full' : 'low'; // Seeds = full, luego se actualiza
  
  const position: IEPosition = {
    id: positionId,
    challengeId: challenge.id,
    holder,
    parentId,
    depth: depth as IELevel,
    childCount: 0,
    isCoordinator: false,
    stake: 0n,
    giveReceived: 0n,
    weightClass,
    effectiveWeight: IE_W_FULL, // Se actualiza con ieRecalculateEffectiveWeight
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  // Actualizar challenge
  const newChallenge: IEChallenge = {
    ...challenge,
    seedCount: depth === 1 ? challenge.seedCount + 1 : challenge.seedCount,
    level: depth > challenge.level ? depth : challenge.level,
    updatedAt: Date.now(),
  };
  
  // Recalcular peso efectivo
  position.effectiveWeight = ieCalculateEffectiveWeight(position, 0n, 0n);
  
  return { position, newChallenge };
}

/**
 * Verifica si un inviter puede aceptar más hijos (max 3)
 */
export function ieCanJoin(challenge: IEChallenge, inviterPosition: IEPosition): boolean {
  return inviterPosition.childCount < 3;
}

/**
 * Obtiene hijos directos de una posición
 */
export function ieGetChildren(positions: IEPosition[], parentId: string): IEPosition[] {
  return positions.filter(p => p.parentId === parentId);
}

/**
 * Obtiene raíces (semillas) de un desafío
 */
export function ieGetRoots(positions: IEPosition[]): IEPosition[] {
  return positions.filter(p => p.parentId === '0');
}

/**
 * Obtiene todas las posiciones de un desafío ordenadas por depth
 */
export function ieGetPositionsByDepth(positions: IEPosition[]): IEPosition[] {
  return [...positions].sort((a, b) => a.depth - b.depth);
}

// ============================================================================
// PESOS Y DISTRIBUCIÓN RCE
// ============================================================================

/**
 * Calcula clase de peso por regla WhatMatters:
 * - depth=1 (seed) OR isCoordinator=true → 'full' (3)
 * - childCount=0 (hoja) → 'low' (2)
 * - intermedio → 'mid' (1)
 */
export function ieCalculateWeightClass(position: IEPosition): IEWeightClass {
  if (position.depth === 1 || position.isCoordinator) return 'full';
  if (position.childCount === 0) return 'low';
  return 'mid';
}

/**
 * Bonus por staking: +1 por cada STAKE_UNIT, max MAX_STAKE_BONUS
 */
export function ieCalculateStakeBonus(stake: bigint): bigint {
  const bonus = stake / IE_STAKE_UNIT;
  return bonus > IE_MAX_STAKE_BONUS ? IE_MAX_STAKE_BONUS : bonus;
}

/**
 * Bonus por GIVE recibido: +1 por cada GIVE_UNIT, max MAX_GIVE_BONUS
 */
export function ieCalculateGiveBonus(giveReceived: bigint): bigint {
  const bonus = giveReceived / IE_GIVE_UNIT;
  return bonus > IE_MAX_GIVE_BONUS ? IE_MAX_GIVE_BONUS : bonus;
}

/**
 * Peso efectivo total = clase (3/2/1) + stakeBonus + giveBonus
 */
export function ieCalculateEffectiveWeight(
  position: IEPosition,
  giveReceived: bigint = 0n
): bigint {
  const weightNum = position.weightClass === 'full' ? IE_W_FULL
    : position.weightClass === 'low' ? IE_W_LOW
    : IE_W_MID;
  const stakeBonus = ieCalculateStakeBonus(position.stake);
  const giveBonus = ieCalculateGiveBonus(giveReceived);
  return weightNum + stakeBonus + giveBonus;
}

/**
 * Actualiza peso efectivo de una posición (inmutable)
 */
export function ieUpdatePositionWeight(
  position: IEPosition,
  giveReceived: bigint
): IEPosition {
  const weightClass = ieCalculateWeightClass(position);
  const effectiveWeight = ieCalculateEffectiveWeight(
    { ...position, weightClass },
    giveReceived
  );
  return {
    ...position,
    weightClass,
    effectiveWeight,
    giveReceived,
    updatedAt: Date.now(),
  };
}

/**
 * Calcula A3 = Σ effectiveWeight de todas las posiciones del desafío
 * Denominador para distribución RCE
 */
export function ieCalculateA3(positions: IEPosition[]): bigint {
  let a3 = 0n;
  for (const pos of positions) {
    a3 += pos.effectiveWeight;
  }
  return a3;
}

/**
 * Calcula pagos RCE para un tramo dado
 * pago_i = tramo × effectiveWeight_i / A3
 * Garantiza Σ pagos = tramo (polvo → treasury)
 */
export function ieCalculatePayouts(
  positions: IEPosition[],
  trancheAmount: bigint
): Map<string, bigint> {
  const payouts = new Map<string, bigint>();
  const a3 = ieCalculateA3(positions);
  
  if (a3 === 0n) return payouts;
  
  let totalDistributed = 0n;
  
  for (const pos of positions) {
    // Fórmula exacta: (tranche * weight) / A3
    const payout = (trancheAmount * pos.effectiveWeight) / a3;
    payouts.set(pos.id, payout);
    totalDistributed += payout;
  }
  
  // Polvo por redondeo se queda en treasury (no se distribuye)
  // totalDistributed <= trancheAmount siempre
  
  return payouts;
}

/**
 * Verifica conservación: Σ pagos ≤ tramo (nunca sobre-distribuir)
 */
export function ieVerifyConservation(
  payouts: Map<string, bigint>,
  tranche: bigint
): { valid: boolean; distributed: bigint; dust: bigint } {
  let distributed = 0n;
  for (const amount of payouts.values()) {
    distributed += amount;
  }
  return {
    valid: distributed <= tranche,
    distributed,
    dust: tranche - distributed,
  };
}

// ============================================================================
// CONSENSO Y HITOS
// ============================================================================

/**
 * Verifica si un votante puede aprobar un hito
 * Reglas: debe ser participante del desafío (positionsHeld > 0), no haber votado ya
 */
export function ieCanApprove(
  challenge: IEChallenge,
  milestoneId: string,
  voter: string,
  positionsHeld: Record<string, number>, // challengeId -> holder -> count
  hasApproved: Record<string, boolean>   // milestoneId -> voter -> bool
): boolean {
  // Verificar que es participante
  const held = positionsHeld[challenge.id]?.[voter] ?? 0;
  if (held === 0) return false;
  
  // Verificar que no ha votado ya
  const key = `${milestoneId}:${voter}`;
  if (hasApproved[key]) return false;
  
  // Verificar que hito existe y no está released
  const milestone = challenge.milestones.find(m => m.id === milestoneId);
  if (!milestone || milestone.released) return false;
  
  return true;
}

/**
 * Procesa aprobación de hito
 */
export function ieApproveMilestone(
  challenge: IEChallenge,
  milestoneId: string,
  voter: string,
  positionId: string
): { challenge: IEChallenge; approvals: number; released: boolean } {
  const milestoneIndex = challenge.milestones.findIndex(m => m.id === milestoneId);
  if (milestoneIndex === -1) throw new Error('Milestone not found');
  
  const milestone = challenge.milestones[milestoneIndex];
  const newApprovals = milestone.approvals + 1;
  const released = newApprovals >= milestone.approvalsRequired;
  
  const newMilestones = [...challenge.milestones];
  newMilestones[milestoneIndex] = {
    ...milestone,
    approvals: newApprovals,
    released,
    releasedAt: released ? Date.now() : undefined,
    a3AtRelease: released ? 0n : undefined, // Se llena al liberar
    approvalsDetail: [
      ...(milestone.approvalsDetail || []),
      { voter, positionId, approvedAt: Date.now() }
    ],
  };
  
  const newChallenge: IEChallenge = {
    ...challenge,
    milestones: newMilestones,
    released: released ? challenge.released + milestone.amount : challenge.released,
    updatedAt: Date.now(),
  };
  
  return { challenge: newChallenge, approvals: newApprovals, released };
}

/**
 * Libera hito y calcula distribución RCE
 * Retorna pagos por positionId y A3 usado
 */
export function ieReleaseMilestone(
  challenge: IEChallenge,
  milestoneId: string,
  positions: IEPosition[]
): { payouts: Map<string, bigint>; a3: bigint; newChallenge: IEChallenge } {
  const milestoneIndex = challenge.milestones.findIndex(m => m.id === milestoneId);
  if (milestoneIndex === -1) throw new Error('Milestone not found');
  
  const milestone = challenge.milestones[milestoneIndex];
  if (!milestone.released) throw new Error('Milestone not approved for release');
  if (milestone.releasedAt === undefined) throw new Error('Milestone not released yet');
  
  // Calcular distribución
  const a3 = ieCalculateA3(positions);
  const payouts = ieCalculatePayouts(positions, milestone.amount);
  
  // Actualizar hito con A3 snapshot
  const newMilestones = [...challenge.milestones];
  newMilestones[milestoneIndex] = {
    ...milestone,
    a3AtRelease: a3,
  };
  
  const newChallenge: IEChallenge = {
    ...challenge,
    milestones: newMilestones,
    updatedAt: Date.now(),
  };
  
  return { payouts, a3, newChallenge };
}

// ============================================================================
// STAKING
// ============================================================================

export function ieStake(
  position: IEPosition,
  amount: bigint
): { position: IEPosition; newStake: bigint } {
  const newStake = position.stake + amount;
  const giveBonus = ieCalculateGiveBonus(position.giveReceived);
  const stakeBonus = ieCalculateStakeBonus(newStake);
  const weightNum = position.weightClass === 'full' ? IE_W_FULL
    : position.weightClass === 'low' ? IE_W_LOW
    : IE_W_MID;
  const effectiveWeight = weightNum + stakeBonus + giveBonus;
  
  return {
    position: {
      ...position,
      stake: newStake,
      effectiveWeight,
      updatedAt: Date.now(),
    },
    newStake,
  };
}

export function ieUnstake(
  position: IEPosition,
  amount: bigint
): { position: IEPosition; newStake: bigint } {
  const newStake = position.stake >= amount ? position.stake - amount : 0n;
  const giveBonus = ieCalculateGiveBonus(position.giveReceived);
  const stakeBonus = ieCalculateStakeBonus(newStake);
  const weightNum = position.weightClass === 'full' ? IE_W_FULL
    : position.weightClass === 'low' ? IE_W_LOW
    : IE_W_MID;
  const effectiveWeight = weightNum + stakeBonus + giveBonus;
  
  return {
    position: {
      ...position,
      stake: newStake,
      effectiveWeight,
      updatedAt: Date.now(),
    },
    newStake,
  };
}

// ============================================================================
// PEER SCORING (GIVE)
// ============================================================================

/**
 * Asigna GIVE a un par
 * Reglas: budget 100 por desafío, GIVE_UNIT=20 para +1 peso, max bonus 5
 */
export function ieAllocateGive(
  challengeId: string,
  fromHolder: string,
  toPosition: IEPosition,
  amount: bigint,
  giveUsed: bigint,        // GIVE ya usado por fromHolder en este desafío
  giveReceived: bigint     // GIVE total recibido por toPosition
): { toPosition: IEPosition; giveBonus: bigint; totalGiven: bigint } {
  const budget = 100n;
  const remaining = budget - giveUsed;
  const actualAmount = amount > remaining ? remaining : amount;
  
  if (actualAmount === 0n) {
    return {
      toPosition,
      giveBonus: ieCalculateGiveBonus(giveReceived),
      totalGiven: giveUsed,
    };
  }
  
  const newGiveReceived = giveReceived + actualAmount;
  const giveBonus = ieCalculateGiveBonus(newGiveReceived);
  
  const weightNum = toPosition.weightClass === 'full' ? IE_W_FULL
    : toPosition.weightClass === 'low' ? IE_W_LOW
    : IE_W_MID;
  const stakeBonus = ieCalculateStakeBonus(toPosition.stake);
  const effectiveWeight = weightNum + stakeBonus + giveBonus;
  
  return {
    toPosition: {
      ...toPosition,
      giveReceived: newGiveReceived,
      effectiveWeight,
      updatedAt: Date.now(),
    },
    giveBonus,
    totalGiven: giveUsed + actualAmount,
  };
}

// ============================================================================
// COORDINADOR
// ============================================================================

export function ieSetCoordinator(
  position: IEPosition,
  value: boolean
): IEPosition {
  const newPosition = { ...position, isCoordinator: value };
  newPosition.weightClass = ieCalculateWeightClass(newPosition);
  newPosition.effectiveWeight = ieCalculateEffectiveWeight(newPosition, position.giveReceived);
  newPosition.updatedAt = Date.now();
  return newPosition;
}

// ============================================================================
// VALIDACIÓN ÁRBOL
// ============================================================================

export interface IETreeValidation {
  valid: boolean;
  errors: string[];
}

export function ieValidateTree(
  challenge: IEChallenge,
  positions: IEPosition[]
): IETreeValidation {
  const errors: string[] = [];
  
  // 1. Challenge existe
  if (!challenge.id) errors.push('Challenge ID missing');
  
  // 2. Semillas ≤ 3
  if (challenge.seedCount > 3) errors.push(`Seed count ${challenge.seedCount} > 3`);
  
  // 3. Cada posición tiene challengeId correcto
  for (const pos of positions) {
    if (pos.challengeId !== challenge.id) {
      errors.push(`Position ${pos.id} challengeId mismatch`);
    }
  }
  
  // 4. Estructura árbol: cada posición (excepto roots) tiene padre válido
  const positionMap = new Map(positions.map(p => [p.id, p]));
  for (const pos of positions) {
    if (pos.parentId !== '0') {
      const parent = positionMap.get(pos.parentId);
      if (!parent) {
        errors.push(`Position ${pos.id} parent ${pos.parentId} not found`);
      } else if (parent.challengeId !== challenge.id) {
        errors.push(`Position ${pos.id} parent in different challenge`);
      }
    }
  }
  
  // 5. Hijos ≤ 3 por posición
  const childCounts = new Map<string, number>();
  for (const pos of positions) {
    if (pos.parentId !== '0') {
      const count = (childCounts.get(pos.parentId) || 0) + 1;
      childCounts.set(pos.parentId, count);
      if (count > 3) {
        errors.push(`Position ${pos.parentId} has ${count} children > 3`);
      }
    }
  }
  
  // 6. Profundidad coherente con challenge.level
  const maxDepth = Math.max(...positions.map(p => p.depth), 0);
  if (maxDepth !== challenge.level) {
    errors.push(`Challenge level ${challenge.level} != actual max depth ${maxDepth}`);
  }
  
  // 7. Clases de peso consistentes
  for (const pos of positions) {
    const expectedClass = ieCalculateWeightClass(pos);
    if (pos.weightClass !== expectedClass) {
      errors.push(`Position ${pos.id} weightClass ${pos.weightClass} != expected ${expectedClass}`);
    }
  }
  
  // 8. Peso efectivo ≥ clase base
  for (const pos of positions) {
    const baseWeight = pos.weightClass === 'full' ? IE_W_FULL
      : pos.weightClass === 'low' ? IE_W_LOW : IE_W_MID;
    if (pos.effectiveWeight < baseWeight) {
      errors.push(`Position ${pos.id} effectiveWeight ${pos.effectiveWeight} < base ${baseWeight}`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}

// ============================================================================
// SIMULACIÓN CRECIMIENTO
// ============================================================================

export interface IEGrowthStep {
  level: number;
  newPositions: bigint;
  cumulative: bigint;
  coordinators: bigint;
}

export function ieSimulateGrowth(
  initialSeeds: number,
  maxLevel: number
): IEGrowthStep[] {
  const results: IEGrowthStep[] = [];
  let cumulative = BigInt(initialSeeds * 3); // Nivel 1: 3 personas por semilla
  let coordinators = 0n;
  
  for (let level = 1; level <= maxLevel; level++) {
    if (level === 1) {
      results.push({ level, newPositions: cumulative, cumulative, coordinators: 0n });
      continue;
    }
    
    // Solo hojas (no coordinadores) reclutan 2 cada una
    const activeLeaves = cumulative - coordinators;
    const newPositions = activeLeaves * 2n;
    cumulative += newPositions;
    
    // Nuevos coordinadores emergen ~1 por cada 3 hojas nuevas
    const newCoordinators = newPositions / 3n;
    coordinators += newCoordinators;
    
    results.push({ level, newPositions, cumulative, coordinators });
  }
  
  return results;
}

// ============================================================================
// PROYECCIÓN RCE
// ============================================================================

export interface IERCEProjectionRow {
  level: number;
  fund: bigint;
  oneRCE: bigint;
  fullRCE: bigint;
  lowRCE: bigint;
  midRCE: bigint;
  totalParticipants: bigint;
}

export function ieProjectRCE(
  fund: bigint,
  maxLevel: number
): IERCEProjectionRow[] {
  const rows: IERCEProjectionRow[] = [];
  for (let level = 1; level <= maxLevel; level++) {
    rows.push({
      level,
      fund,
      oneRCE: iePayout(fund, level, IE_W_FULL), // oneRce = payout con peso 3
      fullRCE: iePayout(fund, level, IE_W_FULL),
      lowRCE: iePayout(fund, level, IE_W_LOW),
      midRCE: iePayout(fund, level, IE_W_MID),
      totalParticipants: iePhysicalPersons(level) * 3n, // aprox
    });
  }
  return rows;
}

// ============================================================================
// HELPERS DE FORMATTING PARA UI
// ============================================================================

export function ieFormatPayout(baseUnits: bigint): string {
  return ieFormatUSDC(baseUnits);
}

export function ieFormatWeight(weight: bigint): string {
  if (weight >= 3n) return `${weight} (Alta)`;
  if (weight === 2n) return '2 (Baja)';
  return '1 (Media)';
}

export function ieFormatA3(a3: bigint): string {
  return a3.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}