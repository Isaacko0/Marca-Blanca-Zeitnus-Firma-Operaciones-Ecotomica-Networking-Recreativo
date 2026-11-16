/**
 * ARM Amphibious Monetary Layer — lib/valueDual.ts
 *
 * Principio de diseño HSCSG (anfibio): al asimilar repos externos con infra
 * monetizada (Stripe/USD/analytics/ad-networks), NO extirpar el dinero —
 * hacer el módulo ANFIBIO. Misma lógica de cálculo opera en modo
 * 'postmonetario' (ZNU/CaaS, default offline) o 'conectado' (USD/USDC vía
 * oráculo priceParity, Nivel 3 ReFi); el render decide la etiqueta, la lógica
 * es agnóstica a la unidad.
 *
 * Aplicado en DeseOS/Contento.pro (lib/valueDual.ts + nodeMode/priceParity en
 * store + pantalla /agencia). Extirpar solo la INFRA ajena, conservar la LÓGICA.
 */

export type MonetaryMode = "postmonetario" | "conectado";

export interface PriceParityOracle {
  /** USD per 1 ZNU (or CaaS unit) */
  znuToUsd: number;
  /** USD per 1 CaaS (if different from ZNU) */
  caasToUsd?: number;
  /** Timestamp of the oracle reading */
  at: string;
  /** Source of the oracle (e.g., "zeitnus-mainnet", "manual", "mock") */
  source: string;
}

export interface DualValue {
  /** Value in postmonetario units (ZNU/CaaS) */
  znu: number;
  /** Value in USD (when mode === "conectado" and oracle available) */
  usd?: number;
  /** Formatted label for display */
  label: string;
  /** Raw numeric value in the current mode's primary unit */
  primary: number;
  /** Primary unit label ("ZNU" | "USD" | "CaaS") */
  primaryUnit: string;
}

export interface DualValueConfig {
  /** Current monetary mode */
  mode: MonetaryMode;
  /** Price parity oracle (required for "conectado" mode) */
  oracle?: PriceParityOracle;
  /** Default ZNU/USD rate if oracle unavailable (fallback) */
  fallbackRate?: number;
  /** Precision for display */
  precision?: number;
}

/**
 * Convert a ZNU/CaaS value to dual representation based on current mode and oracle.
 * The core logic is mode-agnostic; only the presentation layer changes.
 */
export function toDualValue(znu: number, config: DualValueConfig): DualValue {
  const precision = config.precision ?? 2;
  const mode = config.mode;
  const oracle = config.oracle;
  const fallbackRate = config.fallbackRate ?? 1.0; // 1 ZNU = 1 USD fallback

  if (mode === "postmonetario" || !oracle) {
    // Postmonetario mode: primary unit is ZNU, no USD conversion
    return {
      znu,
      usd: undefined,
      label: `${znu.toLocaleString(undefined, { minimumFractionDigits: precision, maximumFractionDigits: precision })} ZNU`,
      primary: znu,
      primaryUnit: "ZNU",
    };
  }

  // Conectado mode: convert using oracle
  const rate = oracle.znuToUsd ?? fallbackRate;
  const usd = znu * rate;

  return {
    znu,
    usd,
    label: `$${usd.toLocaleString(undefined, { minimumFractionDigits: precision, maximumFractionDigits: precision })} USD (${znu.toFixed(precision)} ZNU)`,
    primary: usd,
    primaryUnit: "USD",
  };
}

/**
 * Convert USD to ZNU (for input in conectado mode)
 */
export function usdToZnu(usd: number, oracle?: PriceParityOracle, fallbackRate = 1.0): number {
  const rate = oracle?.znuToUsd ?? fallbackRate;
  return rate > 0 ? usd / rate : usd * fallbackRate;
}

/**
 * Convert CaaS to ZNU (if CaaS oracle available)
 */
export function caasToZnu(caas: number, oracle?: PriceParityOracle): number {
  if (oracle?.caasToUsd && oracle.znuToUsd) {
    const usd = caas * oracle.caasToUsd;
    return usd / oracle.znuToUsd;
  }
  return caas; // 1:1 fallback
}

/**
 * Format a value for display in the current mode.
 * Used by UI components to render monetary values consistently.
 */
export function formatDual(value: number, config: DualValueConfig, options: { showBoth?: boolean } = {}): string {
  const dual = toDualValue(value, config);
  if (options.showBoth && dual.usd !== undefined) {
    return `${dual.label} ≈ ${dual.znu.toFixed(config.precision ?? 2)} ZNU`;
  }
  return dual.label;
}

/**
 * Account ARR in dual mode
 */
export interface DualAccountMetrics {
  arr: DualValue;
  health: number | null;      // 0-100, mode-agnostic
  fit: number | null;         // 0-100, mode-agnostic
  sourceConfidence: number | null; // 0-100, mode-agnostic
}

/**
 * Deal value in dual mode
 */
export interface DualDealMetrics {
  value: DualValue;
  probability: number;        // 0-100, mode-agnostic
}

/**
 * Compute dual-mode account metrics
 */
export function computeDualAccountMetrics(
  arr: number,
  health: number | null,
  fit: number | null,
  sourceConfidence: number | null,
  config: DualValueConfig
): DualAccountMetrics {
  return {
    arr: toDualValue(arr, config),
    health,
    fit,
    sourceConfidence,
  };
}

/**
 * Compute dual-mode deal metrics
 */
export function computeDualDealMetrics(
  value: number,
  probability: number,
  config: DualValueConfig
): DualDealMetrics {
  return {
    value: toDualValue(value, config),
    probability,
  };
}

/**
 * Weighted pipeline in dual mode
 */
export function computeDualWeightedPipeline(
  deals: Array<{ value: number; probability: number }>,
  config: DualValueConfig
): DualValue {
  const totalZnu = deals.reduce((sum, d) => sum + (d.value * d.probability) / 100, 0);
  return toDualValue(totalZnu, config);
}

/**
 * Default oracle for testing/development
 */
export const MOCK_ORACLE: PriceParityOracle = {
  znuToUsd: 2.5, // 1 ZNU = 2.5 USD (example rate)
  caasToUsd: 1.0,
  at: new Date().toISOString(),
  source: "mock",
};

/**
 * Mode detection from environment/store
 */
export function detectModeFromEnv(): MonetaryMode {
  // In browser: check localStorage or URL param
  // In Node: check env var or config file
  if (typeof process !== "undefined" && process.env?.ARM_MODE === "conectado") {
    return "conectado";
  }
  if (typeof window !== "undefined") {
    const urlMode = new URLSearchParams(window.location.search).get("mode");
    if (urlMode === "conectado") return "conectado";
    const stored = localStorage.getItem("arm:mode");
    if (stored === "conectado") return "conectado";
  }
  return "postmonetario"; // Default HSCSG mode
}

/**
 * Create config from mode and optional oracle
 */
export function createDualConfig(mode: MonetaryMode, oracle?: PriceParityOracle): DualValueConfig {
  return {
    mode,
    oracle,
    fallbackRate: 1.0,
    precision: 2,
  };
}