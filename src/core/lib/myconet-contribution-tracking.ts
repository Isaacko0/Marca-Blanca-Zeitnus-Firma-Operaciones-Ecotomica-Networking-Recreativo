// src/core/lib/myconet-contribution-tracking.ts
// Myconet — Módulo 08: Contribution Tracking.
// Points, badges, reputation tracking portable entre comunidades.
// Lógica pura en TypeScript. No copia código de RegenTribe.

export type ContributionType = 'labor' | 'resource' | 'knowledge' | 'funds' | 'land';

export interface ContributionRecord {
  id: string;
  memberId: string;
  type: ContributionType;
  amount: number;
  unit: string;
  neighborhoodId: string;
  timestamp: number;
  portable: boolean;           // true = portable entre comunidades
}

export interface MemberReputation {
  memberId: string;
  totalContributions: number;
  reputationScore: number;     // 0-1
  badges: string[];
  portableReputation: number;  // score portable entre comunidades (0-1)
  lastUpdated: number;
}

let contributionIdCounter = 0;
function nextContributionId(): string {
  contributionIdCounter += 1;
  return `contrib-${Date.now()}-${contributionIdCounter}`;
}

/**
 * Registra una contribución de un miembro.
 * Si portable = true, la reputación es transferible entre comunidades.
 */
export function recordContribution(
  contribution: Omit<ContributionRecord, 'id' | 'timestamp'>,
): ContributionRecord {
  if (contribution.amount <= 0) {
    throw new Error('myconet-contribution-tracking: amount debe ser mayor a 0');
  }
  return {
    ...contribution,
    id: nextContributionId(),
    timestamp: Date.now(),
  };
}

/**
 * Calcula la reputación de un miembro basada en sus contribuciones.
 */
export function calculateReputation(
  memberId: string,
  contributions: ContributionRecord[],
): MemberReputation {
  const memberContribs = contributions.filter((c) => c.memberId === memberId);
  const totalContributions = memberContribs.length;
  const portableContribs = memberContribs.filter((c) => c.portable).length;

  // Score simple: contribuciones portables pesan más para reputación portable
  const reputationScore = totalContributions > 0
    ? Math.min(1, (portableContribs * 2 + (totalContributions - portableContribs)) / 20)
    : 0;

  const badges: string[] = [];
  if (totalContributions >= 1) badges.push('primer-aporte');
  if (portableContribs >= 3) badges.push('aportador-portable');
  if (totalContributions >= 10) badges.push('miembro-activo');
  if (portableContribs >= 10) badges.push('aportador-intercomunidades');

  return {
    memberId,
    totalContributions,
    reputationScore,
    badges,
    portableReputation: reputationScore, // mismo score base, portable por diseño
    lastUpdated: Date.now(),
  };
}

/**
 * Transfiere reputación portable entre comunidades.
 * Un miembro con reputación portable la lleva consigo al nuevo barrio.
 */
export function transferPortableReputation(
  memberId: string,
  fromNeighborhood: string,
  toNeighborhood: string,
  reputation: MemberReputation,
): { transferred: boolean; amount: number; targetNeighborhood: string } {
  if (reputation.portableReputation <= 0) {
    return { transferred: false, amount: 0, targetNeighborhood: toNeighborhood };
  }
  return {
    transferred: true,
    amount: reputation.portableReputation,
    targetNeighborhood: toNeighborhood,
  };
}
