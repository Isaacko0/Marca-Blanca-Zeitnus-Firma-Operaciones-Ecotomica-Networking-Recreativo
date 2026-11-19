// src/core/lib/decay-tokens.ts
// Tokens no-transferibles con decay exponencial continuo (Presence / Sweat de TDF).
// Reimplementa la lógica pura de closerdao/proof-of-presence
// (ERC20NonTransferableDecaying, PresenceToken, SweatToken) en TypeScript puro.
// No copia código Solidity ni de ningún repo externo.
// Lógica: decayedAmount = initial × (1 − decayRatePerDay)^díasAgo

const DAY_MS = 86_400_000;
const PRECISION_SCALE = 1e18;

// Decay rate per día para ~10% anual: 1 - (1 - 0.10)^(1/365) ≈ 0.000288617
const DEFAULT_DECAY_RATE_PER_DAY = 0.000288617;

// Tolerancia de redondeo en wei (equivalente a MAX_ALLOWED_ROUNDING_ERROR de Solidity)
const MAX_ALLOWED_ROUNDING_ERROR = 100_000;

export interface DecayTokenState {
  address: string;
  nonDecayedBalance: bigint;
  lastDecayTimestamp: number;
  lastDecayedBalance: bigint;
  isHolder: boolean;
  decayRatePerDay: number;
}

export interface BurnEntry {
  amount: bigint;
  daysAgo: number;
}

export interface MintEntry {
  account: string;
  amount: bigint;
  daysAgo: number;
}

export interface BurnResult {
  finalBalance: bigint;
  state: DecayTokenState;
}

/**
 * Calcula el decay sobre una cantidad dada un número de días.
 * Fórmula: amount × (1 − rate)^días
 */
export function calculateDecayForDays(
  amount: bigint,
  daysAgo: number,
  decayRatePerDay: number = DEFAULT_DECAY_RATE_PER_DAY,
): bigint {
  if (daysAgo === 0) return amount;
  if (amount === 0n) return 0n;

  const retentionRate = PRECISION_SCALE - decayRatePerDay * PRECISION_SCALE;
  const totalRetentionRate = Math.pow(retentionRate / PRECISION_SCALE, daysAgo);
  return BigInt(Math.round(Number(amount) * totalRetentionRate));
}

/**
 * Calcula el balance decayado actual de una cuenta a partir del estado guardado.
 */
export function calculateDecayedBalance(
  state: DecayTokenState,
  now: number = Date.now(),
): bigint {
  if (state.lastDecayTimestamp === 0 || state.lastDecayedBalance === 0n) {
    return 0n;
  }

  const passedDays = Math.floor((now - state.lastDecayTimestamp) / DAY_MS);
  return calculateDecayForDays(
    state.lastDecayedBalance,
    passedDays,
    state.decayRatePerDay,
  );
}

/**
 * Mintea tokens con recálculo de decay previo.
 */
export function mint(
  state: DecayTokenState,
  entry: MintEntry,
  now: number = Date.now(),
): DecayTokenState {
  if (entry.amount === 0n) {
    throw new Error('decay-tokens: mint with zero amount');
  }

  const currentDecayed = calculateDecayedBalance(state, now);
  const decayedMinted = calculateDecayForDays(
    entry.amount,
    entry.daysAgo,
    state.decayRatePerDay,
  );

  return {
    ...state,
    address: entry.account,
    nonDecayedBalance: state.nonDecayedBalance + entry.amount,
    lastDecayedBalance: currentDecayed + decayedMinted,
    lastDecayTimestamp: now,
    isHolder: true,
  };
}

/**
 * Quema tokens con decay por lote (cada lote con su daysAgo).
 */
export function burn(
  state: DecayTokenState,
  entries: BurnEntry[],
  now: number = Date.now(),
): BurnResult {
  if (entries.length === 0) {
    throw new Error('decay-tokens: burn with empty entries');
  }

  let nonDecayedAmountToBurn = 0n;
  let decayedAmountToBurn = 0n;

  for (const entry of entries) {
    nonDecayedAmountToBurn += entry.amount;
    decayedAmountToBurn += calculateDecayForDays(
      entry.amount,
      entry.daysAgo,
      state.decayRatePerDay,
    );
  }

  const finalBalance = calculateDecayedBalance(state, now);
  let newLastDecayedBalance = finalBalance;

  const difference =
    decayedAmountToBurn > finalBalance
      ? decayedAmountToBurn - finalBalance
      : 0n;

  if (difference > MAX_ALLOWED_ROUNDING_ERROR) {
    throw new Error(
      `decay-tokens: burn amount exceeds decayed balance (toBurn=${decayedAmountToBurn}, balance=${finalBalance})`,
    );
  }

  if (decayedAmountToBurn > finalBalance) {
    newLastDecayedBalance = 0n;
  } else {
    newLastDecayedBalance = finalBalance - decayedAmountToBurn;
  }

  return {
    finalBalance: newLastDecayedBalance,
    state: {
      ...state,
      nonDecayedBalance:
        state.nonDecayedBalance >= nonDecayedAmountToBurn
          ? state.nonDecayedBalance - nonDecayedAmountToBurn
          : 0n,
      lastDecayedBalance: newLastDecayedBalance,
      lastDecayTimestamp: now,
      isHolder: newLastDecayedBalance > 0n,
    },
  };
}

/**
 * Crea un estado inicial de token decay para una cuenta.
 */
export function createDecayTokenState(
  address: string,
  decayRatePerDay: number = DEFAULT_DECAY_RATE_PER_DAY,
): DecayTokenState {
  return {
    address,
    nonDecayedBalance: 0n,
    lastDecayTimestamp: 0,
    lastDecayedBalance: 0n,
    isHolder: false,
    decayRatePerDay,
  };
}

/**
 * Los tokens de presencia y sweat son NO transferibles.
 */
export function isTransferable(): boolean {
  return false;
}

/**
 * Los tokens de presencia y sweat no permiten approvals.
 */
export function isApproveAllowed(): boolean {
  return false;
}

/**
 * Tasa de decay anual a partir de la tasa diaria: 1 - (1 - rate)^365
 */
export function getDecayRatePerYear(decayRatePerDay: number): number {
  const dailyRetention = 1 - decayRatePerDay;
  const yearlyRetention = Math.pow(dailyRetention, 365);
  return 1 - yearlyRetention;
}
