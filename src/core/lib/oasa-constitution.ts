// src/core/lib/oasa-constitution.ts
// Principios regenerativos y constitución OASA codificados en TypeScript puro.
// Reimplementa la lógica pura del manifiesto OASA (3 Rs, 7 generaciones,
// tokens no-speculativos, conocimiento abierto) sin copiar código externo.

export interface ThreeRsAssessment {
  respect: boolean;
  reciprocity: boolean;
  relationship: boolean;
  compliant: boolean;
}

export interface TokenPolicyAssessment {
  nonSpeculative: boolean;
  noFinancialReturn: boolean;
  notRedeemableForCurrency: boolean;
  bondingCurveEmissionOnly: boolean; // emisión única, no recompra por emisor
  compliant: boolean;
}

export interface ConstitutionCheck {
  threeRs: ThreeRsAssessment;
  tokenPolicy: TokenPolicyAssessment;
  sevenGenerations: boolean;
  openKnowledge: boolean;
  compliant: boolean;
}

/**
 * Evalúa si una acción respeta los 3 Rs: Respect, Reciprocity, Relationship.
 */
export function assessThreeRs(
  respect: boolean,
  reciprocity: boolean,
  relationship: boolean,
): ThreeRsAssessment {
  return {
    respect,
    reciprocity,
    relationship,
    compliant: respect && reciprocity && relationship,
  };
}

/**
 * Evalúa si la política de tokens es no-speculativa (OASA Constitution Article VI).
 * Tokens dan derechos de uso (noches, cosechas, votos), no retornos financieros.
 * No redimibles en moneda. Bonding curve de emisión única (no recompra por emisor).
 */
export function assessTokenPolicy(
  isNonSpeculative: boolean,
  promisesFinancialReturn: boolean,
  redeemableForCurrency: boolean,
  bondingCurveEmissionOnly: boolean,
): TokenPolicyAssessment {
  return {
    nonSpeculative: isNonSpeculative,
    noFinancialReturn: !promisesFinancialReturn,
    notRedeemableForCurrency: !redeemableForCurrency,
    bondingCurveEmissionOnly,
    compliant:
      isNonSpeculative &&
      !promisesFinancialReturn &&
      !redeemableForCurrency &&
      bondingCurveEmissionOnly,
  };
}

/**
 * Evalúa cumplimiento de la constitución OASA completa.
 */
export function assessConstitution(
  threeRs: ThreeRsAssessment,
  tokenPolicy: TokenPolicyAssessment,
  sevenGenerationsCompliant: boolean,
  knowledgeOpen: boolean,
): ConstitutionCheck {
  return {
    threeRs,
    tokenPolicy,
    sevenGenerations: sevenGenerationsCompliant,
    openKnowledge: knowledgeOpen,
    compliant:
      threeRs.compliant &&
      tokenPolicy.compliant &&
      sevenGenerationsCompliant &&
      knowledgeOpen,
  };
}

/**
 * Determina si un token es permisible bajo la constitución OASA.
 * Retorna false si es especulativo, promete retorno, es redimible en moneda,
 * o no sigue bonding curve de emisión única.
 */
export function isNonSpeculativeToken(policy: TokenPolicyAssessment): boolean {
  return policy.compliant;
}

/**
 * Umbral de rewilding: al menos 50% del área del proyecto como wild/rewilded.
 */
export const REWILDING_FLOOR_PCT = 50;

/**
 * Densidad mínima de agroforestería: 5 especies por 10m², 20 por hectárea.
 */
export const AGROFORESTRY_MIN_SPECIES_PER_10M2 = 5;
export const AGROFORESTRY_MIN_SPECIES_PER_HECTARE = 20;
