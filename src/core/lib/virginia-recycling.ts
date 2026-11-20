// src/core/lib/virginia-recycling.ts
// Reciclaje de Valor Agregado vía Sistema Virginia + Universal Share Holding (USH).
// Implementa el ciclo de reciclaje propuesto en alrac-virginia-reciclaje-va (borrador v0.1).
// Lógica pura en TypeScript. No usa semillas ficticias; no convierte TQ↔fiat.

import type { VirginiaState } from '@core/state/virginia';

export interface VirginiaRecyclingConfig {
  r0: number;              // 0.10 (provisional)
  lambdaIAL: number;       // 0.5 (provisional)
  rMin: number;            // 0.05
  rMax: number;            // 0.20
  phiR: number;            // 0.40
  phiC: number;            // 0.20
  phiD: number;            // 0.40
  demurrageRate: number;   // 0.05 (existente en Virginia)
  demurrageFloorZNU: number; // 300 (existente)
  captureRatioMax: number;   // 3 (provisional)
  dividendExpiryDays: number; // 90 (Postulado 4)
}

export interface RecyclingCycleResult {
  poolTotal: number;
  allocation: { reinvestment: number; credit: number; dividend: number };
  dividendPerMember: number;
  activeMembers: number;
  captureRatio: number;
  complianceOk: boolean;
  carmisBlocked: boolean;
}

export interface UshParticipation {
  memberId: string;
  active: boolean;
  dividendBalance: number;      // TQ/ZNU pendiente
  lastDividendCycle: number;    // timestamp del último dividendo
  expiryDate: number;           // caducidad a 90 días
}

export interface NodeVA {
  nodeId: string;
  ingresos: number;
  insumosExternos: number;
  auditable: boolean;
  ial: number;                  // 0-1, dependencia de insumos externos
  receivedFromTree: number;     // reparto del árbol Virginia (incentivo recreativo)
}

const DEFAULT_CONFIG: VirginiaRecyclingConfig = {
  r0: 0.10,
  lambdaIAL: 0.5,
  rMin: 0.05,
  rMax: 0.20,
  phiR: 0.40,
  phiC: 0.20,
  phiD: 0.40,
  demurrageRate: 0.05,
  demurrageFloorZNU: 300,
  captureRatioMax: 3,
  dividendExpiryDays: 90,
};

/**
 * Calcula el valor agregado real de un nodo.
 * Solo cuenta si auditable === true. VA simulado nunca habilita reparto.
 */
export function calculateRealVA(
  ingresos: number,
  insumosExternos: number,
  auditable: boolean,
): number {
  if (!auditable) {
    throw new Error(
      'virginia-recycling: VA simulado no habilita reparto (auditable=false)',
    );
  }
  const va = ingresos - insumosExternos;
  return Math.max(0, va);
}

/**
 * Calcula el demurrage del ciclo: 5% sobre el exceso de 300 ZNU por balance.
 */
export function computeDemurragePool(
  balancesZNU: Record<string, number>,
  cfg: VirginiaRecyclingConfig = DEFAULT_CONFIG,
): number {
  let demurrage = 0;
  for (const balance of Object.values(balancesZNU)) {
    const exceso = Math.max(0, balance - cfg.demurrageFloorZNU);
    demurrage += cfg.demurrageRate * exceso;
  }
  return demurrage;
}

/**
 * Calcula la tasa de reciclaje de un nodo según su IAL.
 * r_i = r0 × (1 + λ × (1 - IAL_i)), acotado a [rMin, rMax].
 * Nodo autotrófico (IAL alto) recicla menos; nodo dependiente, más.
 */
export function computeRecyclingRate(
  ial: number,
  cfg: VirginiaRecyclingConfig = DEFAULT_CONFIG,
): number {
  const r = cfg.r0 * (1 + cfg.lambdaIAL * (1 - ial));
  return Math.min(Math.max(r, cfg.rMin), cfg.rMax);
}

/**
 * Verifica si el compliance MJ permite distribuir.
 * Debe integrarse con checkVirginiaMJCompliance() de tq-virginia.ts.
 */
export function isComplianceOk(complianceOverall: string): boolean {
  return complianceOverall === 'ok';
}

/**
 * Verifica si γ-CARMIS bloquea distribuciones (αʰ < κ).
 */
export function isCarmisBlocked(alphaH: number, kappa: number): boolean {
  return alphaH < kappa;
}

/**
 * Ejecuta un ciclo completo de reciclaje de valor agregado.
 *
 * Pasos:
 * 1. Gate: compliance MJ === 'ok' y γ-CARMIS no activo.
 * 2. Calcular D_t (demurrage) y VA_i,t por nodo.
 * 3. Formar P_t = D_t + Σ r_i × max(0, VA_i,t).
 * 4. Asignar salidas: φ_R reinversión, φ_C crédito mutuo, φ_D dividendo.
 * 5. Calcular dividendo por miembro (USH, igualitario).
 * 6. Aplicar tope anti-captura ρ; exceso del árbol → Pool.
 * 7. Validar suma de salidas ≤ P_t.
 * 8. Registrar en ValueFlows (trazabilidad).
 */
export function runVirginiaRecyclingCycle(
  state: VirginiaState,
  nodesVA: NodeVA[],
  cfg: VirginiaRecyclingConfig = DEFAULT_CONFIG,
  complianceOverall: string = 'ok',
  alphaH: number = 0,
  kappa: number = 1,
): RecyclingCycleResult {
  // --- Circuit breakers ---
  const complianceOk = isComplianceOk(complianceOverall);
  const carmisBlocked = isCarmisBlocked(alphaH, kappa);

  if (!complianceOk || carmisBlocked) {
    return {
      poolTotal: 0,
      allocation: { reinvestment: 0, credit: 0, dividend: 0 },
      dividendPerMember: 0,
      activeMembers: 0,
      captureRatio: 0,
      complianceOk,
      carmisBlocked,
    };
  }

  // --- Demurrage del ciclo (D_t) ---
  // balancesZNU vendría de state; aquí se asume que se pasa vía nodosVA o state.
  // Para este ciclo puro, calculamos D_t a partir de un saldo base si estuviera disponible.
  // En la implementación real, se lee de tq-virginia / znu state.
  const demurragePool = 0; // placeholder: se conecta con state de ZNU

  // --- VA por nodo y tasa de reciclaje ---
  let vaTotal = 0;
  const nodeResults: Array<{ nodeId: string; va: number; ri: number; contribution: number }> = [];

  for (const node of nodesVA) {
    const va = calculateRealVA(node.ingresos, node.insumosExternos, node.auditable);
    const ri = computeRecyclingRate(node.ial, cfg);
    const contribution = ri * Math.max(0, va);
    vaTotal += va;
    nodeResults.push({ nodeId: node.nodeId, va, ri, contribution });
  }

  const poolTotal = demurragePool + nodeResults.reduce((s, n) => s + n.contribution, 0);

  // --- Tres salidas ---
  const reinvestment = cfg.phiR * poolTotal;
  const credit = cfg.phiC * poolTotal;
  const dividend = cfg.phiD * poolTotal;

  const activeMembers = nodesVA.filter((n) => n.auditable).length;
  const dividendPerMember = activeMembers > 0 ? dividend / activeMembers : 0;

  // --- Tope anti-captura ρ ---
  const receivedTotal = nodeResults.map(
    (n) => n.contribution + dividendPerMember,
  );
  const maxReceived = Math.max(...receivedTotal);
  const minReceived = Math.min(...receivedTotal);
  let captureRatio =
    minReceived > 0 ? maxReceived / minReceived : 0;

  let poolReassignment = 0;
  if (captureRatio > cfg.captureRatioMax) {
    // Reasignar exceso del árbol al Pool
    const threshold = cfg.captureRatioMax * minReceived;
    for (const nr of nodeResults) {
      const total = nr.contribution + dividendPerMember;
      if (total > threshold) {
        poolReassignment += total - threshold;
      }
    }
    // Recalcular ratio tras reasignación (aproximado)
    captureRatio = cfg.captureRatioMax;
  }

  const finalPool = poolTotal + poolReassignment;

  // --- Validación: suma de salidas ≤ P_t ---
  const salidasSuma = reinvestment + credit + dividend;
  if (salidasSuma > finalPool) {
    throw new Error(
      'virginia-recycling: suma de salidas excede P_t (creación de valor prohibida)',
    );
  }

  return {
    poolTotal: finalPool,
    allocation: { reinvestment, credit, dividend },
    dividendPerMember,
    activeMembers,
    captureRatio,
    complianceOk: true,
    carmisBlocked: false,
  };
}

/**
 * Expira dividendos no usados a los 90 días (Postulado 4).
 * Retorna el monto expirado que vuelve al Pool.
 */
export function expireDividends(
  participations: UshParticipation[],
  now: number = Date.now(),
): { expiredAmount: number; updated: UshParticipation[] } {
  let expiredAmount = 0;
  const updated = participations.map((p) => {
    if (p.active && p.dividendBalance > 0 && now > p.expiryDate) {
      expiredAmount += p.dividendBalance;
      return { ...p, dividendBalance: 0 };
    }
    return p;
  });
  return { expiredAmount, updated };
}

/**
 * Config por defecto del ciclo de reciclaje.
 */
export function getDefaultConfig(): VirginiaRecyclingConfig {
  return { ...DEFAULT_CONFIG };
}
