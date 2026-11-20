// src/core/lib/myconet-community-network.ts
// Myconet — Módulo 01: Community Network.
// Discovery y AI matching de miembros, visión holders, service providers, resource holders.
// Lógica pura en TypeScript. No copia código de RegenTribe ni Tribes Platform.

export type MemberArchetype =
  | 'vision-holder'
  | 'community-member'
  | 'service-provider'
  | 'resource-holder'
  | 'land-guardian'
  | 'collaborator';

export interface CommunityMember {
  id: string;
  profile: Record<string, unknown>;
  archetype: MemberArchetype;
  neighborhoodId?: string;
  reputationScore: number;     // 0-1
  contributions: string[];     // IDs de contribuciones
  timestamp: number;
}

export interface MatchResult {
  member: CommunityMember;
  affinityScore: number;       // 0-1
  matchReasons: string[];
}

let memberIdCounter = 0;
function nextMemberId(): string {
  memberIdCounter += 1;
  return `member-${Date.now()}-${memberIdCounter}`;
}

/**
 * Registra un miembro de la comunidad con arquetipo y reputación inicial.
 */
export function registerCommunityMember(
  member: Omit<CommunityMember, 'id' | 'timestamp'>,
): CommunityMember {
  if (member.reputationScore < 0 || member.reputationScore > 1) {
    throw new Error('myconet-community-network: reputationScore debe estar en [0,1]');
  }
  return {
    ...member,
    id: nextMemberId(),
    timestamp: Date.now(),
  };
}

/**
 * Encuentra miembros afines para un barrio dado.
 * Lógica de matching pura basada en arquetipos complementarios y habilidades.
 */
export function aiMatchMembers(
  members: CommunityMember[],
  targetArchetype: MemberArchetype,
  neighborhoodId?: string,
  limit: number = 10,
): MatchResult[] {
  const complementary: Record<MemberArchetype, MemberArchetype[]> = {
    'vision-holder': ['service-provider', 'land-guardian', 'resource-holder'],
    'community-member': ['service-provider', 'vision-holder'],
    'service-provider': ['vision-holder', 'community-member', 'land-guardian'],
    'resource-holder': ['vision-holder', 'land-guardian'],
    'land-guardian': ['vision-holder', 'service-provider', 'community-member'],
    'collaborator': ['vision-holder', 'community-member', 'service-provider'],
  };

  const compatible = complementary[targetArchetype] ?? [];

  const results: MatchResult[] = members
    .filter((m) => compatible.includes(m.archetype))
    .filter((m) => neighborhoodId ? m.neighborhoodId === neighborhoodId : true)
    .map((m) => {
      // Score de afinidad: reputación + compatibilidad de arquetipo
      let score = m.reputationScore * 0.6;
      score += 0.4; // bonus por ser arquetipo compatible

      const matchReasons: string[] = [`Arquetipo complementario: ${m.archetype}`];
      if (m.reputationScore > 0.7) matchReasons.push('Alta reputación');
      if (m.neighborhoodId === neighborhoodId) matchReasons.push('Mismo barrio');

      return { member: m, affinityScore: Math.min(score, 1), matchReasons };
    })
    .sort((a, b) => b.affinityScore - a.affinityScore)
    .slice(0, limit);

  return results;
}
