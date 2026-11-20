// src/core/lib/myconet-governance.ts
// Myconet — Módulo 09: Governance.
// AI-facilitated governance: conflictos, propuestas, votación transparente.
// Lógica pura en TypeScript. No copia código de RegenTribe.

export interface Proposal {
  id: string;
  title: string;
  description: string;
  proposerId: string;
  neighborhoodId: string;
  status: 'open' | 'voting' | 'passed' | 'rejected' | 'blocked';
  votes: Map<string, 'yes' | 'no' | 'abstain'>;
  quorumThreshold: number;     // 0-1
  approvalThreshold: number;   // 0-1
  createdAt: number;
  closedAt?: number;
}

export interface GovernanceResult {
  proposalId: string;
  passed: boolean;
  votes: { yes: number; no: number; abstain: number };
  quorumMet: boolean;
  totalVoters: number;
}

let proposalIdCounter = 0;
function nextProposalId(): string {
  proposalIdCounter += 1;
  return `proposal-${Date.now()}-${proposalIdCounter}`;
}

/**
 * Crea una propuesta de gobernanza abierta.
 */
export function createProposal(
  proposal: Omit<Proposal, 'id' | 'status' | 'votes' | 'createdAt'>,
): Proposal {
  if (proposal.quorumThreshold < 0 || proposal.quorumThreshold > 1) {
    throw new Error('myconet-governance: quorumThreshold debe estar en [0,1]');
  }
  if (proposal.approvalThreshold < 0 || proposal.approvalThreshold > 1) {
    throw new Error('myconet-governance: approvalThreshold debe estar en [0,1]');
  }
  return {
    ...proposal,
    id: nextProposalId(),
    status: 'open',
    votes: new Map(),
    createdAt: Date.now(),
  };
}

/**
 * Registra un voto en una propuesta.
 */
export function castVote(
  proposal: Proposal,
  voterId: string,
  vote: 'yes' | 'no' | 'abstain',
): Proposal {
  if (proposal.status !== 'open' && proposal.status !== 'voting') {
    throw new Error('myconet-governance: la propuesta no está abierta para votación');
  }
  const updated = { ...proposal };
  updated.status = 'voting';
  updated.votes.set(voterId, vote);
  return updated;
}

/**
 * Cierra una propuesta y determina si pasa.
 * Requiere quórum (participación mínima) y umbral de aprobación.
 */
export function closeProposal(
  proposal: Proposal,
  eligibleVoters: number,
): GovernanceResult {
  const { votes } = proposal;
  const yes = [...votes.values()].filter((v) => v === 'yes').length;
  const no = [...votes.values()].filter((v) => v === 'no').length;
  const abstain = [...votes.values()].filter((v) => v === 'abstain').length;
  const totalVoters = votes.size;

  const quorumMet = eligibleVoters > 0 ? totalVoters / eligibleVoters >= proposal.quorumThreshold : false;
  const approvalMet = totalVoters > 0 ? yes / totalVoters >= proposal.approvalThreshold : false;

  const passed = quorumMet && approvalMet;

  return {
    proposalId: proposal.id,
    passed,
    votes: { yes, no, abstain },
    quorumMet,
    totalVoters,
  };
}

/**
 * Detecta conflictos entre propuestas (ej. dos propuestas que modifican el mismo recurso).
 */
export function detectConflicts(
  proposals: Proposal[],
): Array<{ proposalIds: string[]; conflictType: string; reason: string }> {
  const conflicts: Array<{ proposalIds: string[]; conflictType: string; reason: string }> = [];

  for (let i = 0; i < proposals.length; i++) {
    for (let j = i + 1; j < proposals.length; j++) {
      const a = proposals[i];
      const b = proposals[j];
      if (a.neighborhoodId === b.neighborhoodId && a.status === 'open' && b.status === 'open') {
        // Heurística simple: títulos similares = posible conflicto
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        const sharedWords = titleA.split(' ').filter((w) => titleB.includes(w));
        if (sharedWords.length >= 2) {
          conflicts.push({
            proposalIds: [a.id, b.id],
            conflictType: 'same-neighborhood-overlap',
            reason: 'Ambas propuestas operan en el mismo barrio con términos similares',
          });
        }
      }
    }
  }

  return conflicts;
}
