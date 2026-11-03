// ie-rce-math.ts — Port exacto TypeScript de contracts/src/libraries/RCEMath.sol
// Matemática canónica RCE para el Protocolo Inteligencia Exponencial (IE)
// Reproduce EXACTAMENTE el prototipo Excel WhatMatters: $288,008 → 1 RCE = $1,000.03 en nivel 5

import {
  IE_MAX_LEVEL,
  IE_W_FULL,
  IE_W_LOW,
  IE_W_MID,
  IE_COEFFICIENTS,
  IEWeightClass,
  IE_WEIGHT_NUM,
} from './ie-constants';

/**
 * Personas físicas en la base de un árbol completo nivel n = 3^n
 * @param level Nivel IE (1-21)
 * @returns BigInt con 3^level
 */
export function iePhysicalPersons(level: number): bigint {
  _checkLevel(level);
  return _pow3(BigInt(level));
}

/**
 * Posiciones totales en la red completa hasta nivel n = (3^(n+1) - 3) / 2
 * @param level Nivel IE (1-21)
 * @returns BigInt con posiciones totales
 */
export function iePositionsTotal(level: number): bigint {
  _checkLevel(level);
  return (_pow3(BigInt(level) + 1n) - 3n) / 2n;
}

/**
 * Coeficiente canónico RCE por nivel (1-21)
 * Tomado VERBATIM del prototipo Excel WhatMatters
 * @param level Nivel IE (1-21)
 * @returns Coeficiente canónico
 */
export function ieCoefficient(level: number): bigint {
  if (level < 1 || level > IE_MAX_LEVEL) {
    throw new Error(`ieCoefficient: level out of range (1-${IE_MAX_LEVEL})`);
  }
  return IE_COEFFICIENTS[level - 1];
}

/**
 * Valor de 1 RCE completa (Alta/Tronco/Semilla) para un fondo en un nivel dado
 * Reproduce la columna "Valor 1 RCE" del prototipo
 * @param fund Fondo total en base units (6 decimales, ej. USDC)
 * @param level Nivel IE (1-21)
 * @returns Valor 1 RCE en base units
 */
export function ieOneRce(fund: bigint, level: number): bigint {
  return fund / ieCoefficient(level);
}

/**
 * Payout para una posición dado su peso (3/2/1)
 * Fórmula exacta: fund * weightNum / (coefficient * 3)
 * Computado en una expresión para preservar precisión
 * @param fund Fondo total en base units
 * @param level Nivel IE (1-21)
 * @param weightNum Peso numerador: 3 (full), 2 (low), 1 (mid)
 * @returns Payout en base units
 */
export function iePayout(fund: bigint, level: number, weightNum: bigint): bigint {
  if (weightNum !== IE_W_FULL && weightNum !== IE_W_LOW && weightNum !== IE_W_MID) {
    throw new Error('iePayout: bad weight (must be 3, 2, or 1)');
  }
  return (fund * weightNum) / (ieCoefficient(level) * 3n);
}

/**
 * Payout por clase de peso (convenience)
 */
export function iePayoutByClass(fund: bigint, level: number, cls: IEWeightClass): bigint {
  return iePayout(fund, level, IE_WEIGHT_NUM[cls]);
}

// ---- Helpers privados ----

function _checkLevel(level: number): void {
  if (level < 1 || level > IE_MAX_LEVEL) {
    throw new Error(`Level out of range (1-${IE_MAX_LEVEL})`);
  }
}

function _pow3(n: bigint): bigint {
  let r = 1n;
  for (let i = 0n; i < n; ++i) {
    r *= 3n;
  }
  return r;
}

// ---- Tabla RCE completa (reproduce prototipo Excel) ----

export interface IERCERow {
  level: number;
  persons: bigint;        // 3^level
  positions: bigint;      // (3^(level+1) - 3) / 2
  coefficient: bigint;    // coeficiente canónico
  full: bigint;           // 1 RCE (peso 3)
  low: bigint;            // 2/3 RCE (peso 2)
  mid: bigint;            // 1/3 RCE (peso 1)
}

/**
 * Construye la tabla RCE completa para un fondo dado
 * Reproduce EXACTAMENTE el prototipo spreadsheet WhatMatters
 * @param fund Fondo total en base units (6 decimales)
 * @param maxLevel Nivel máximo a mostrar (default 21)
 * @returns Array de filas con todos los cálculos
 */
export function ieRCETable(fund: bigint, maxLevel: number = IE_MAX_LEVEL): IERCERow[] {
  const rows: IERCERow[] = [];
  for (let level = 1; level <= maxLevel; level++) {
    rows.push({
      level,
      persons: iePhysicalPersons(level),
      positions: iePositionsTotal(level),
      coefficient: ieCoefficient(level),
      full: iePayout(fund, level, IE_W_FULL),
      low: iePayout(fund, level, IE_W_LOW),
      mid: iePayout(fund, level, IE_W_MID),
    });
  }
  return rows;
}

// ---- Formatting helpers (asume token 6 decimales tipo USDC) ----

/**
 * Formatea base units (6 decimales) como USD con separadores de miles
 * @param baseUnits Valor en base units (puede ser negative)
 * @param maxFrac Máximos decimales a mostrar (default 2)
 * @returns String formateado ej: "$1,000.03"
 */
export function ieFormatUSDC(baseUnits: bigint, maxFrac: number = 2): string {
  const neg = baseUnits < 0n;
  const v = neg ? -baseUnits : baseUnits;
  const whole = v / 1_000_000n;
  const frac = v % 1_000_000n;
  const fracStr = frac.toString().padStart(6, '0').slice(0, maxFrac);
  const wholeStr = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${neg ? '-' : ''}$${wholeStr}${maxFrac > 0 ? '.' + fracStr : ''}`;
}

/**
 * Formatea BigInt con separadores de miles
 */
export function ieFormatBigInt(v: bigint): string {
  const neg = v < 0n;
  const abs = neg ? -v : v;
  return `${neg ? '-' : ''}${abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

/**
 * Formatea BigInt como porcentaje (base 100 = 1%)
 */
export function ieFormatPercent(bps: bigint): string {
  const whole = bps / 100n;
  const frac = bps % 100n;
  return `${whole.toString()}.${frac.toString().padStart(2, '0')}%`;
}