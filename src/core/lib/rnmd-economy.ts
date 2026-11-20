// src/core/lib/rnmd-economy.ts
// Marco modular RNMD — capa economy / exchangeware.
// Economía sostenible y productiva del barrio regenerativo.
// Lógica pura en TypeScript. No copia código ni assets de RegenTribe.

export interface ExchangewareNode {
  id: string;
  name: string;
  type: 'production' | 'exchange' | 'distribution' | 'consumption';
  capacity: number;
  currentOutput: number;
  raoCredentialId: string;
  isPublic: boolean;
  createdAt: number;
}

export interface EconomicSustainabilityAssessment {
  productive: boolean;
  nonSpeculative: boolean;
  mutualSupport: boolean;
  score: number; // 0-1
  level: 'bajo' | 'medio' | 'alto';
}

/**
 * Registra un nodo de exchangeware (producción, intercambio, distribución, consumo).
 */
export function registerExchangewareNode(
  node: Omit<ExchangewareNode, 'id' | 'createdAt'>,
): ExchangewareNode {
  if (!node.raoCredentialId) {
    throw new Error('rnmd-economy: raoCredentialId requerido');
  }
  return {
    ...node,
    id: `ex-${Date.now()}`,
    createdAt: Date.now(),
    isPublic: true,
  };
}

/**
 * Evalúa sostenibilidad económica del barrio.
 * Productivo: tiene nodos de producción con output > 0.
 * No especulativo: no hay extracción de plusvalía.
 * Mutual support: participa en red opt-in de apoyo mutuo.
 */
export function assessEconomicSustainability(
  productive: boolean,
  nonSpeculative: boolean,
  mutualSupport: boolean,
): EconomicSustainabilityAssessment {
  const score =
    (Number(productive) + Number(nonSpeculative) + Number(mutualSupport)) / 3;
  const level = score < 0.4 ? 'bajo' : score < 0.7 ? 'medio' : 'alto';
  return { productive, nonSpeculative, mutualSupport, score, level };
}
