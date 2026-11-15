// arm-loomio/src/core/votingService.ts
// Voting Service - Business Logic for Voting

import { 
  LoomioProposal, 
  LoomioVote, 
  LoomioAnonymousVote,
  CastVoteInput,
  CastAnonymousVoteInput,
} from '../../types';

import { 
  STVCountService, 
  STVConfig,
} from '../../lib/loomio/stv';

import { 
  AnonymousVotingService, 
  InMemoryAnonymousVotingRepository,
} from '../../lib/loomio/anonymousVoting';

import { 
  VoteWeightService, 
  InMemoryVoteWeightRepository,
} from '../../lib/loomio/voteWeights';

import { generateId, now } from '../utils';

export class LoomioVotingService {
  private votes = new Map<string, LoomioVote[]>(); // proposalId -> votes[]
  private anonymousVotes = new Map<string, LoomioAnonymousVote[]>(); // proposalId -> ballots[]

  private anonymousVotingService: AnonymousVotingService;
  private voteWeightService: any; // Would be injected

  constructor() {
    const anonymousVotingRepo = new InMemoryAnonymousVotingRepository();
    this.anonymousVotingService = new AnonymousVotingService(anonymousVotingRepo);
    // voteWeightService would be injected
  }

  /**
   * Cast an identified vote
   */
  async castVote(input: CastVoteInput): Promise<LoomioVote> {
    // Validation would happen here
    const vote: LoomioVote = {
      id: generateId('vote'),
      proposalId: input.proposalId,
      proposalType: 'poll', // Would get from proposal
      affiliateId: input.affiliateId,
      choices: input.choices.map((c, index) => ({
        optionId: c.optionId,
        score: c.score,
        rank: c.rank,
        position: index,
      })),
      reason: input.reason,
      reasonFormat: input.reasonFormat || 'html',
      weight: 1, // Would get from voteWeightService
      anonymous: false,
      castAt: now(),
    };

    if (!this.votes.has(input.proposalId)) {
      this.votes.set(input.proposalId, []);
    }
    this.votes.get(input.proposalId)!.push(vote);

    return vote;
  }

  /**
   * Cast an anonymous vote
   */
  async castAnonymousVote(input: CastAnonymousVoteInput): Promise<any> {
    const result = await this.anonymousVotingService.submitBallot(input);
    return result;
  }

  /**
   * Get votes for a proposal
   */
  getVotes(proposalId: string): LoomioVote[] {
    return this.votes.get(proposalId) ?? [];
  }

  /**
   * Get anonymous ballots for a proposal
   */
  getAnonymousBallots(proposalId: string): any[] {
    return this.anonymousVotes.get(proposalId) ?? [];
  }

  /**
   * Count STV for a proposal
   */
  async countSTV(proposal: any): Promise<any> {
    const votes = this.votes.get(proposal.id) ?? [];
    const anonymousVotes = this.anonymousVotes.get(proposal.id) ?? [];

    const stvConfig: any = {
      seats: proposal.stvSeats ?? 1,
      method: proposal.stvMethod ?? 'scottish',
      quotaType: proposal.stvQuota ?? 'droop',
      candidates: proposal.options.map((o: any) => ({
        id: o.id,
        name: o.name,
        elected: false,
        eliminated: false,
        votes: 0,
        keepValue: 1,
      })),
      ballots: [
        ...votes.map((v: any) => ({
          preferences: v.choices
            .sort((a: any, b: any) => (a.rank ?? 0) - (b.rank ?? 0))
            .map((c: any) => c.optionId),
          weight: v.weight,
        })),
        ...anonymousVotes.map((v: any) => ({
          preferences: v.choices
            .sort((a: any, b: any) => a.position - b.position)
            .map((c: any) => c.proposalOptionId),
          weight: 1,
        })),
      ],
    };

    return STVCountService.count(stvConfig);
  }
}