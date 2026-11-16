/**
 * Gratifieria ValueDual - Amphibious Monetary Layer
 * 
 * Extends arm-core valueDual for gratifieria-specific use cases:
 * - Karma/ZNU balances
 * - Match fulfillment rewards
 * - Sponsor USD matching (conectado mode)
 * - Anonymous gift bonuses (GAP-61)
 */

import { 
  toDualValue, 
  createDualConfig, 
  detectModeFromEnv, 
  DualValueConfig, 
  PriceParityOracle,
  formatDual,
  computeDualWeightedPipeline,
  MonetaryMode,
} from "@hscsg/arm-core";

/** Gratifieria-specific dual value configuration */
export interface GratiferiaDualConfig extends DualValueConfig {
  /** Karma fulfillment reward in ZNU */
  fulfillment_reward_znu?: number;
  /** Anonymous gift bonus in ZNU */
  anonymous_gift_bonus_znu?: number;
  /** Cancellation penalty in ZNU */
  cancellation_penalty_znu?: number;
  /** Sponsor matching ratio (conectado mode): 1 USD = X ZNU */
  sponsor_match_ratio?: number;
}

/** Create gratifieria dual config with defaults */
export function createGratiferiaDualConfig(
  mode: MonetaryMode = detectModeFromEnv(),
  oracle?: PriceParityOracle,
  overrides: Partial<GratiferiaDualConfig> = {}
): GratiferiaDualConfig {
  const baseConfig = createDualConfig(mode, oracle);
  return {
    ...baseConfig,
    fulfillment_reward_znu: 10,
    anonymous_gift_bonus_znu: 20,
    cancellation_penalty_znu: 5,
    sponsor_match_ratio: 1.0, // 1 USD = 1 ZNU default
    ...overrides,
  };
}

/** Format karma balance for UI display */
export function formatKarma(znu: number, config: GratiferiaDualConfig): string {
  return formatDual(znu, config, { showBoth: true });
}

/** Format match reward for UI */
export function formatMatchReward(znu: number, config: GratiferiaDualConfig): string {
  const dual = toDualValue(znu, config);
  if (config.mode === "conectado" && dual.usd !== undefined) {
    return `${dual.label} (match reward)`;
  }
  return `${dual.label} (match reward)`;
}

/** Calculate sponsor-matched amount (conectado mode) */
export function calculateSponsorMatch(usdAmount: number, config: GratiferiaDualConfig): number {
  if (config.mode !== "conectado") return 0;
  return usdAmount * (config.sponsor_match_ratio ?? 1.0);
}

/** Dual-mode transaction for gratifieria */
export interface GratiferiaDualTransaction {
  /** Amount in ZNU (postmonetario base) */
  znu: number;
  /** Amount in USD (conectado mode only) */
  usd?: number;
  /** Formatted label */
  label: string;
  /** Primary value for sorting/display */
  primary: number;
  /** Primary unit */
  primaryUnit: "ZNU" | "USD";
  /** Transaction type */
  type: "fulfillment" | "anonymous_gift" | "cancellation" | "sponsor_match" | "gratitude";
  /** Related entity IDs */
  listing_id?: string;
  match_id?: string;
  user_id: string;
}

/** Create dual transaction from ZNU amount */
export function createDualTransaction(
  znu: number,
  config: GratiferiaDualConfig,
  type: GratiferiaDualTransaction["type"],
  user_id: string,
  listing_id?: string,
  match_id?: string
): GratiferiaDualTransaction {
  const dual = toDualValue(znu, config);
  return {
    znu,
    usd: dual.usd,
    label: dual.label,
    primary: dual.primary,
    primaryUnit: dual.primaryUnit,
    type,
    user_id,
    listing_id,
    match_id,
  };
}

/** Sponsor pool for conectado mode */
export interface SponsorPool {
  id: string;                    // "sponsor_*"
  name: string;
  total_usd_committed: number;
  total_usd_disbursed: number;
  match_ratio: number;           // ZNU per USD
  active: boolean;
  created_at: string;
  updated_at: string;
}

/** Calculate sponsor pool distribution */
export function calculateSponsorDistribution(
  pool: SponsorPool,
  matchesFulfilled: number,
  avgRewardZnu: number,
  config: GratiferiaDualConfig
): { znu_per_match: number; usd_per_match: number; can_fulfill: boolean } {
  if (config.mode !== "conectado" || !pool.active) {
    return { znu_per_match: avgRewardZnu, usd_per_match: 0, can_fulfill: true };
  }

  const remainingUsd = pool.total_usd_committed - pool.total_usd_disbursed;
  const usdNeeded = matchesFulfilled * (avgRewardZnu / (config.oracle?.znu_to_usd ?? 1));
  
  return {
    znu_per_match: avgRewardZnu,
    usd_per_match: avgRewardZnu / (config.oracle?.znu_to_usd ?? 1),
    can_fulfill: remainingUsd >= usdNeeded,
  };
}

/** Gratifieria economic summary (dual mode) */
export interface GratiferiaEconomicSummary {
  total_listings: number;
  active_offers: number;
  active_needs: number;
  matches_proposed: number;
  matches_fulfilled: number;
  total_karma_circulating: number;    // ZNU
  total_karma_circulating_usd?: number; // USD (conectado)
  sponsor_pool?: SponsorPool;
  mode: MonetaryMode;
}

/** Compute economic summary from repository data */
export async function computeEconomicSummary(
  listings: { offers: number; needs: number },
  matches: { proposed: number; fulfilled: number },
  karmaTotal: number,
  sponsorPool?: SponsorPool,
  config: GratiferiaDualConfig = createGratiferiaDualConfig()
): Promise<GratiferiaEconomicSummary> {
  const totalKarma = toDualValue(karmaTotal, config);
  
  return {
    total_listings: listings.offers + listings.needs,
    active_offers: listings.offers,
    active_needs: listings.needs,
    matches_proposed: matches.proposed,
    matches_fulfilled: matches.fulfilled,
    total_karma_circulating: karmaTotal,
    total_karma_circulating_usd: totalKarma.usd,
    sponsor_pool: sponsorPool,
    mode: config.mode,
  };
}

/** Re-export core valueDual functions */
export { 
  toDualValue, 
  createDualConfig, 
  detectModeFromEnv, 
  formatDual,
  computeDualWeightedPipeline,
  MonetaryMode,
  PriceParityOracle,
  DualValueConfig,
} from "@hscsg/arm-core";