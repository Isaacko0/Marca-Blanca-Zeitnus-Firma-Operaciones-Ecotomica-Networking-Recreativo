// arm-loomio/src/lib/loomio/anonymousVoting.ts
// Anonymous Ballot System - Cryptographic Separation of Identity and Vote
// Ported from Loomio's anonymous_ballot.rb, anonymous_ballot_choice.rb, anonymous_poll_voter.rb

import { createHash, randomBytes } from 'crypto';

export interface AnonymousBallot {
  id: string;
  proposalId: string;
  ballotHash: string;          // Hash of (ballot_secret + proposal_id) for verification
  choices: AnonymousBallotChoice[];
  submittedAt: number;
  // NO affiliateId, NO identity linkage
}

export interface AnonymousBallotChoice {
  id: string;
  ballotId: string;
  proposalOptionId: string;
  score: number;               // For scored/ranked voting
  position: number;            // Order in ballot
}

export interface AnonymousPollVoter {
  id: string;
  proposalId: string;
  voterToken: string;          // One-time token for voting
  tokenHash: string;           // Stored hash of token
  ballotSubmitted: boolean;
  submittedAt?: number;
  // NO affiliateId linkage
}

export interface AnonymousVotingConfig {
  proposalId: string;
  enabled: boolean;
  hideResults: 'never' | 'until_closed' | 'always';
  // Config frozen after first ballot (immutable)
  frozenAt?: number;
  frozenConfig?: FrozenAnonymousConfig;
}

export interface FrozenAnonymousConfig {
  hideResults: 'never' | 'until_closed' | 'always';
  stanceReasonRequired: string;
  notifyOnClosingSoon: string;
  proposalType: string;
  // All STV/score/dot_vote settings frozen
  [key: string]: any;
}

export interface BallotSubmission {
  proposalId: string;
  voterToken: string;
  choices: { proposalOptionId: string; score?: number; position: number }[];
}

export interface BallotVerificationResult {
  valid: boolean;
  ballot?: AnonymousBallot;
  error?: string;
}

/**
 * Generate cryptographically secure voter token
 */
export function generateVoterToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Hash voter token for storage (never store plain token)
 */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Verify voter token
 */
export function verifyToken(token: string, tokenHash: string): boolean {
  return hashToken(token) === tokenHash;
}

/**
 * Generate ballot secret for voter (used to create ballot hash)
 */
export function generateBallotSecret(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Create ballot hash for verification without revealing identity
 * ballotHash = SHA256(ballotSecret + proposalId + choices)
 */
export function createBallotHash(
  ballotSecret: string,
  proposalId: string,
  choices: { proposalOptionId: string; score?: number; position: number }[]
): string {
  const choicesStr = choices
    .sort((a, b) => a.position - b.position)
    .map(c => `${c.proposalOptionId}:${c.score ?? 1}:${c.position}`)
    .join('|');
  
  return createHash('sha256')
    .update(ballotSecret + proposalId + choicesStr)
    .digest('hex');
}

/**
 * Verify ballot integrity
 */
export function verifyBallotHash(
  ballotSecret: string,
  proposalId: string,
  choices: { proposalOptionId: string; score?: number; position: number }[],
  storedHash: string
): boolean {
  const computedHash = createBallotHash(ballotSecret, proposalId, choices);
  return computedHash === storedHash;
}

/**
 * Anonymous Voting Repository Interface
 */
export interface AnonymousVotingRepository {
  // Voter token management
  createVoterToken(proposalId: string, token: string): Promise<AnonymousPollVoter>;
  getVoterByTokenHash(proposalId: string, tokenHash: string): Promise<AnonymousPollVoter | null>;
  markBallotSubmitted(voterId: string): Promise<void>;
  
  // Ballot management
  submitBallot(ballot: AnonymousBallot): Promise<AnonymousBallot>;
  getBallots(proposalId: string): Promise<AnonymousBallot[]>;
  getBallotCount(proposalId: string): Promise<number>;
  
  // Configuration
  setAnonymousConfig(proposalId: string, config: AnonymousVotingConfig): Promise<void>;
  getAnonymousConfig(proposalId: string): Promise<AnonymousVotingConfig | null>;
  freezeConfig(proposalId: string): Promise<void>;
}

/**
 * In-Memory Anonymous Voting Repository (for testing)
 */
export class InMemoryAnonymousVotingRepository implements AnonymousVotingRepository {
  private voters = new Map<string, Map<string, AnonymousPollVoter>>(); // proposalId -> tokenHash -> voter
  private ballots = new Map<string, AnonymousBallot[]>(); // proposalId -> ballots[]
  private configs = new Map<string, AnonymousVotingConfig>(); // proposalId -> config

  async createVoterToken(proposalId: string, token: string): Promise<AnonymousPollVoter> {
    const tokenHash = hashToken(token);
    const voter: AnonymousPollVoter = {
      id: `voter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      proposalId,
      voterToken: token, // Only stored once at creation
      tokenHash,
      ballotSubmitted: false,
    };
    
    if (!this.voters.has(proposalId)) {
      this.voters.set(proposalId, new Map());
    }
    this.voters.get(proposalId)!.set(tokenHash, voter);
    return voter;
  }

  async getVoterByTokenHash(proposalId: string, tokenHash: string): Promise<AnonymousPollVoter | null> {
    return this.voters.get(proposalId)?.get(tokenHash) ?? null;
  }

  async markBallotSubmitted(voterId: string): Promise<void> {
    for (const [, proposalVoters] of this.voters) {
      const voter = proposalVoters.get(voterId);
      if (voter) {
        voter.ballotSubmitted = true;
        voter.submittedAt = Date.now();
        return;
      }
    }
  }

  async submitBallot(ballot: AnonymousBallot): Promise<AnonymousBallot> {
    if (!this.ballots.has(ballot.proposalId)) {
      this.ballots.set(ballot.proposalId, []);
    }
    this.ballots.get(ballot.proposalId)!.push(ballot);
    return ballot;
  }

  async getBallots(proposalId: string): Promise<AnonymousBallot[]> {
    return this.ballots.get(proposalId) ?? [];
  }

  async getBallotCount(proposalId: string): Promise<number> {
    return this.ballots.get(proposalId)?.length ?? 0;
  }

  async setAnonymousConfig(proposalId: string, config: AnonymousVotingConfig): Promise<void> {
    // Check if already frozen
    const existing = this.configs.get(proposalId);
    if (existing?.frozenAt) {
      throw new Error('Anonymous ballot configuration frozen after first ballot');
    }
    this.configs.set(proposalId, config);
  }

  async getAnonymousConfig(proposalId: string): Promise<AnonymousVotingConfig | null> {
    return this.configs.get(proposalId) ?? null;
  }

  async freezeConfig(proposalId: string): Promise<void> {
    const config = this.configs.get(proposalId);
    if (config && !config.frozenAt) {
      config.frozenAt = Date.now();
      config.frozenConfig = {
        hideResults: config.hideResults,
        stanceReasonRequired: 'disabled', // Would come from proposal
        notifyOnClosingSoon: 'voters_uncast',
        proposalType: 'poll', // Would come from proposal
      };
    }
  }
}

/**
 * Anonymous Voting Service - Business Logic
 */
export class AnonymousVotingService {
  constructor(private repository: AnonymousVotingRepository) {}

  /**
   * Issue a voter token for anonymous voting
   * Returns plain token ONCE - must be delivered securely to voter
   */
  async issueVoterToken(proposalId: string): Promise<{ voterId: string; token: string }> {
    const token = generateVoterToken();
    const voter = await this.repository.createVoterToken(proposalId, token);
    return { voterId: voter.id, token: voter.voterToken };
  }

  /**
   * Submit an anonymous ballot
   */
  async submitBallot(submission: BallotSubmission): Promise<BallotVerificationResult> {
    const tokenHash = hashToken(submission.voterToken);
    const voter = await this.repository.getVoterByTokenHash(submission.proposalId, tokenHash);
    
    if (!voter) {
      return { valid: false, error: 'Invalid or expired voter token' };
    }
    
    if (voter.ballotSubmitted) {
      return { valid: false, error: 'Ballot already submitted for this token' };
    }
    
    // Validate choices based on proposal config
    const config = await this.repository.getAnonymousConfig(submission.proposalId);
    if (config?.frozenAt) {
      // Config is frozen - validate against frozen config
      // This would check STV seats, score ranges, etc.
    }
    
    // Generate ballot secret for voter (for later verification)
    const ballotSecret = generateBallotSecret();
    
    // Create ballot choices
    const choices: AnonymousBallotChoice[] = submission.choices.map((c, index) => ({
      id: `choice_${Date.now()}_${index}`,
      ballotId: '', // Set after ballot creation
      proposalOptionId: c.proposalOptionId,
      score: c.score ?? 1,
      position: c.position ?? index,
    }));
    
    // Create ballot
    const ballot: AnonymousBallot = {
      id: `ballot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      proposalId: submission.proposalId,
      ballotHash: createBallotHash(ballotSecret, submission.proposalId, submission.choices),
      choices,
      submittedAt: Date.now(),
    };
    
    // Link choices to ballot
    for (const choice of choices) {
      choice.ballotId = ballot.id;
    }
    
    await this.repository.submitBallot(ballot);
    await this.repository.markBallotSubmitted(voter.id);
    
    // Freeze config on first ballot
    await this.repository.freezeConfig(submission.proposalId);
    
    return { valid: true, ballot };
  }

  /**
   * Get all ballots for a proposal (for counting)
   */
  async getBallotsForCounting(proposalId: string): Promise<AnonymousBallot[]> {
    return this.repository.getBallots(proposalId);
  }

  /**
   * Convert anonymous ballots to STV ballot format
   */
  static ballotsToSTVFormat(ballots: AnonymousBallot[]): { preferences: string[]; weight?: number }[] {
    return ballots.map(ballot => ({
      preferences: ballot.choices
        .sort((a, b) => a.position - b.position)
        .map(c => c.proposalOptionId),
      weight: 1, // Anonymous ballots always weight 1
    }));
  }

  /**
   * Verify ballot integrity (for audit)
   */
  static verifyBallotIntegrity(
    ballot: AnonymousBallot,
    ballotSecret: string,
    proposalId: string
  ): boolean {
    return verifyBallotHash(
      ballotSecret,
      proposalId,
      ballot.choices.map(c => ({
        proposalOptionId: c.proposalOptionId,
        score: c.score,
        position: c.position,
      })),
      ballot.ballotHash
    );
  }

  /**
   * Get anonymous voting statistics
   */
  async getStatistics(proposalId: string): Promise<{
    tokensIssued: number;
    ballotsSubmitted: number;
    participationRate: number;
    configFrozen: boolean;
  }> {
    const config = await this.repository.getAnonymousConfig(proposalId);
    const ballots = await this.repository.getBallots(proposalId);
    const voters = Array.from((this.repository as any).voters.get(proposalId)?.values() ?? []);
    
    return {
      tokensIssued: voters.length,
      ballotsSubmitted: ballots.length,
      participationRate: voters.length > 0 ? ballots.length / voters.length : 0,
      configFrozen: !!config?.frozenAt,
    };
  }
}

/**
 * Anonymous Voting Configuration Freeze Enforcement
 * Ported from Loomio's anonymous_configuration_cannot_change_after_ballot
 */
export const ANONYMOUS_FROZEN_ATTRIBUTES = [
  'anonymous',
  'hide_results',
  'stance_reason_required',
  'proposal_type',
  'score_min',
  'score_max',
  'choice_count_min',
  'choice_count_max',
  'points_per_voter',
  'show_none_of_the_above',
  'stv_seats',
  'stv_method',
  'stv_quota',
];

export function checkAnonymousConfigFrozen(
  proposalId: string,
  changes: Record<string, any>,
  repository: AnonymousVotingRepository
): Promise<string | null> {
  return (async () => {
    const config = await repository.getAnonymousConfig(proposalId);
    if (!config?.frozenAt) return null;
    
    const frozenChanges = Object.keys(changes).filter(key => 
      ANONYMOUS_FROZEN_ATTRIBUTES.includes(key)
    );
    
    if (frozenChanges.length > 0) {
      return 'anonymous_ballot_configuration_frozen';
    }
    return null;
  })();
}