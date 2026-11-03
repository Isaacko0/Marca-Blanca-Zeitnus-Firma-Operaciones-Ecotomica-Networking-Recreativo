// ie-protocol-fee.ts — Port exacto TypeScript de contracts/src/libraries/ProtocolFee.sol
// Comisión regresiva de protocolo WhatMatters (hasta 10%)

import { IE_FEE_TIERS, IE_BPS } from './ie-constants';

/**
 * Calcula fee en basis points para un monto gestionado
 * @param amount Monto en base units (6 decimales, ej. USDC)
 * @returns Fee en basis points (10000 = 100%)
 */
export function ieFeeBps(amount: bigint): bigint {
  for (const tier of IE_FEE_TIERS) {
    if (tier.max === 0n || amount <= tier.max) {
      return BigInt(tier.bps);
    }
  }
  // Fallback (no debería alcanzarse)
  return 100n; // 1%
}

/**
 * Divide un monto en (fee, neto) usando la tabla regresiva
 * @param amount Monto bruto en base units
 * @returns { fee, net } ambos en base units
 */
export function ieSplit(amount: bigint): { fee: bigint; net: bigint } {
  const fee = (amount * ieFeeBps(amount)) / IE_BPS;
  const net = amount - fee;
  return { fee, net };
}

/**
 * Calcula fee y neto para múltiples montos (batch)
 */
export function ieSplitBatch(amounts: bigint[]): { fee: bigint; net: bigint }[] {
  return amounts.map(ieSplit);
}

/**
 * Verifica conservación: fee + net = amount
 */
export function ieVerifyConservation(amount: bigint): boolean {
  const { fee, net } = ieSplit(amount);
  return fee + net === amount;
}

/**
 * Obtiene el tier aplicable para un monto (para UI)
 */
export function ieGetApplicableTier(amount: bigint): { max: bigint; bps: number; label: string } {
  for (const tier of IE_FEE_TIERS) {
    if (tier.max === 0n || amount <= tier.max) {
      const maxLabel = tier.max === 0n
        ? '> 10M'
        : `≤ ${ieFormatUSDC(tier.max / 1_000_000n * 1_000_000n, 0).replace('$', '')}`; // approx
      return {
        max: tier.max,
        bps: tier.bps,
        label: `${tier.bps / 100}% (${maxLabel} USDC)`,
      };
    }
  }
  return { max: 0n, bps: 100, label: '1% (> 10M USDC)' };
}

// Re-export formatting para conveniencia
import { ieFormatUSDC } from './ie-rce-math';