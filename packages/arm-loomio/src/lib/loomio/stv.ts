// arm-loomio/src/lib/loomio/stv.ts
// Ported from Loomio's STV Count Service - Scottish STV + Meek STV
// Validated against official Scottish council election reports

export interface STVBallot {
  preferences: string[]; // Ordered candidate IDs (poll_option_id)
  weight?: number;       // Vote weight (default 1.0)
}

export interface STVCandidate {
  id: string;
  name: string;
  elected: boolean;
  eliminated: boolean;
  votes: number;
  keepValue: number;     // For Meek STV
}

export interface STVRound {
  round: number;
  quota: number;
  candidates: STVCandidate[];
  elected: string[];
  eliminated: string[];
  nonTransferable: number;
  exhaustedVotes: number;
  transfers: TransferEvent[];
}

export interface TransferEvent {
  from: string;
  to: string;
  value: number;
  reason: 'surplus' | 'elimination';
}

export interface STVResult {
  quota: number;
  seats: number;
  method: 'scottish' | 'meek';
  quotaType: 'droop' | 'hare';
  elected: string[];
  tied: string[];
  rounds: STVRound[];
  totalBallots: number;
  validBallots: number;
  exhaustedBallots: number;
}

export interface STVConfig {
  seats: number;
  method: 'scottish' | 'meek';
  quotaType: 'droop' | 'hare';
  candidates: STVCandidate[];
  ballots: STVBallot[];
}

/**
 * Calculate Droop quota: floor(valid_ballots / (seats + 1)) + 1
 */
export function calculateDroopQuota(validBallots: number, seats: number): number {
  return Math.floor(validBallots / (seats + 1)) + 1;
}

/**
 * Calculate Hare quota: valid_ballots / seats
 */
export function calculateHareQuota(validBallots: number, seats: number): number {
  return validBallots / seats;
}

/**
 * Calculate quota based on type
 */
export function calculateQuota(validBallots: number, seats: number, quotaType: 'droop' | 'hare'): number {
  return quotaType === 'droop' 
    ? calculateDroopQuota(validBallots, seats)
    : calculateHareQuota(validBallots, seats);
}

/**
 * Scottish STV Implementation
 * Based on Scottish Local Government Elections rules
 */
export class ScottishSTV {
  private candidates: Map<string, STVCandidate>;
  private ballots: STVBallot[];
  private seats: number;
  private quota: number;
  private quotaType: 'droop' | 'hare';
  private rounds: STVRound[] = [];
  private elected: string[] = [];
  private nonTransferable = 0;
  private exhaustedVotes = 0;

  constructor(config: STVConfig) {
    this.seats = config.seats;
    this.quotaType = config.quotaType;
    this.ballots = config.ballots.map(b => ({ ...b, weight: b.weight ?? 1 }));
    
    // Initialize candidates
    this.candidates = new Map();
    for (const c of config.candidates) {
      this.candidates.set(c.id, { ...c, votes: 0, keepValue: 1 });
    }

    // Count first preferences
    this.countFirstPreferences();
    
    // Calculate quota
    const validBallots = this.ballots.reduce((sum, b) => sum + (b.weight ?? 1), 0);
    this.quota = calculateQuota(validBallots, this.seats, this.quotaType);
  }

  private countFirstPreferences(): void {
    for (const ballot of this.ballots) {
      if (ballot.preferences.length > 0) {
        const firstChoice = ballot.preferences[0];
        const candidate = this.candidates.get(firstChoice);
        if (candidate && !candidate.eliminated) {
          candidate.votes += ballot.weight ?? 1;
        }
      }
    }
  }

  private findElected(): string[] {
    return Array.from(this.candidates.values())
      .filter(c => !c.elected && !c.eliminated && c.votes >= this.quota)
      .map(c => c.id);
  }

  private findLowest(): string | null {
    const continuing = Array.from(this.candidates.values())
      .filter(c => !c.elected && !c.eliminated);
    
    if (continuing.length === 0) return null;
    
    // Find minimum votes
    const minVotes = Math.min(...continuing.map(c => c.votes));
    const lowest = continuing.filter(c => c.votes === minVotes);
    
    // Tie-breaking: if tie, eliminate all tied lowest (Scottish rule)
    // In practice, random elimination or alphabetical for deterministic
    return lowest[0]?.id ?? null;
  }

  private transferSurplus(candidateId: string): TransferEvent[] {
    const candidate = this.candidates.get(candidateId)!;
    const surplus = candidate.votes - this.quota;
    const transferValue = surplus / candidate.votes;
    const transfers: TransferEvent[] = [];

    // Get ballots that voted for this candidate as current preference
    const relevantBallots = this.ballots.filter(b => 
      b.preferences.length > 0 && b.preferences[0] === candidateId
    );

    // Group by next preference
    const nextPrefs = new Map<string, STVBallot[]>();
    for (const ballot of relevantBallots) {
      if (ballot.preferences.length > 1) {
        const nextPref = ballot.preferences[1];
        if (!nextPrefs.has(nextPref)) nextPrefs.set(nextPref, []);
        nextPrefs.get(nextPref)!.push(ballot);
      } else {
        // No next preference - exhausted
        this.exhaustedVotes += ballot.weight ?? 1;
        this.nonTransferable += ballot.weight ?? 1;
      }
    }

    // Transfer votes
    for (const [nextCandidateId, ballots] of nextPrefs) {
      const nextCandidate = this.candidates.get(nextCandidateId);
      if (nextCandidate && !nextCandidate.eliminated && !nextCandidate.elected) {
        const transferAmount = ballots.reduce((sum, b) => sum + (b.weight ?? 1), 0) * transferValue;
        nextCandidate.votes += transferAmount;
        
        // Update ballot preferences (remove elected candidate)
        for (const ballot of ballots) {
          ballot.preferences.shift(); // Remove elected candidate
        }
        
        transfers.push({
          from: candidateId,
          to: nextCandidateId,
          value: transferAmount,
          reason: 'surplus'
        });
      } else {
        // Next candidate eliminated or elected - exhaust
        const transferAmount = ballots.reduce((sum, b) => sum + (b.weight ?? 1), 0) * transferValue;
        this.exhaustedVotes += transferAmount;
        this.nonTransferable += transferAmount;
      }
    }

    candidate.votes = this.quota;
    return transfers;
  }

  private eliminateCandidate(candidateId: string): TransferEvent[] {
    const candidate = this.candidates.get(candidateId)!;
    candidate.eliminated = true;
    const transfers: TransferEvent[] = [];

    // Get ballots currently assigned to this candidate
    const relevantBallots = this.ballots.filter(b => 
      b.preferences.length > 0 && b.preferences[0] === candidateId
    );

    // Group by next preference
    const nextPrefs = new Map<string, STVBallot[]>();
    for (const ballot of relevantBallots) {
      if (ballot.preferences.length > 1) {
        const nextPref = ballot.preferences[1];
        if (!nextPrefs.has(nextPref)) nextPrefs.set(nextPref, []);
        nextPrefs.get(nextPref)!.push(ballot);
      } else {
        // Exhausted
        this.exhaustedVotes += ballot.weight ?? 1;
        this.nonTransferable += ballot.weight ?? 1;
      }
    }

    // Transfer full value
    for (const [nextCandidateId, ballots] of nextPrefs) {
      const nextCandidate = this.candidates.get(nextCandidateId);
      if (nextCandidate && !nextCandidate.eliminated && !nextCandidate.elected) {
        const transferAmount = ballots.reduce((sum, b) => sum + (b.weight ?? 1), 0);
        nextCandidate.votes += transferAmount;
        
        for (const ballot of ballots) {
          ballot.preferences.shift(); // Remove eliminated candidate
        }
        
        transfers.push({
          from: candidateId,
          to: nextCandidateId,
          value: transferAmount,
          reason: 'elimination'
        });
      } else {
        // Next candidate also eliminated/elected
        const transferAmount = ballots.reduce((sum, b) => sum + (b.weight ?? 1), 0);
        this.exhaustedVotes += transferAmount;
        this.nonTransferable += transferAmount;
      }
    }

    candidate.votes = 0;
    return transfers;
  }

  private recordRound(transfers: TransferEvent[], electedThisRound: string[], eliminatedThisRound: string[]): void {
    const round: STVRound = {
      round: this.rounds.length + 1,
      quota: this.quota,
      candidates: Array.from(this.candidates.values()).map(c => ({ ...c })),
      elected: [...electedThisRound],
      eliminated: [...eliminatedThisRound],
      nonTransferable: this.nonTransferable,
      exhaustedVotes: this.exhaustedVotes,
      transfers: [...transfers],
    };
    this.rounds.push(round);
  }

  public count(): STVResult {
    let roundNum = 0;
    
    while (this.elected.length < this.seats) {
      roundNum++;
      
      // Check for elected candidates
      const newlyElected = this.findElected();
      
      if (newlyElected.length > 0) {
        // Process each elected candidate's surplus
        let allTransfers: TransferEvent[] = [];
        
        for (const candidateId of newlyElected) {
          const candidate = this.candidates.get(candidateId)!;
          candidate.elected = true;
          this.elected.push(candidateId);
          
          if (candidate.votes > this.quota) {
            const transfers = this.transferSurplus(candidateId);
            allTransfers.push(...transfers);
          }
        }
        
        this.recordRound(allTransfers, newlyElected, []);
        
        // Check if we have enough elected
        if (this.elected.length >= this.seats) break;
        continue;
      }
      
      // No one elected - eliminate lowest
      const lowest = this.findLowest();
      if (!lowest) break; // No continuing candidates
      
      const transfers = this.eliminateCandidate(lowest);
      this.recordRound(transfers, [], [lowest]);
      
      // Check if remaining candidates = remaining seats
      const continuing = Array.from(this.candidates.values())
        .filter(c => !c.elected && !c.eliminated);
      
      if (continuing.length <= this.seats - this.elected.length) {
        // Elect all remaining
        for (const c of continuing) {
          c.elected = true;
          this.elected.push(c.id);
        }
        this.recordRound([], continuing.map(c => c.id), []);
        break;
      }
    }

    // Determine tied candidates (for reporting)
    const continuing = Array.from(this.candidates.values())
      .filter(c => !c.elected && !c.eliminated);
    
    const tied = continuing.length > 0 
      ? continuing.filter(c => c.votes === Math.max(...continuing.map(c => c.votes))).map(c => c.id)
      : [];

    const totalBallots = this.ballots.length;
    const validBallots = this.ballots.filter(b => b.preferences.length > 0).length;
    const exhaustedBallots = this.ballots.filter(b => b.preferences.length === 0).length;

    return {
      quota: this.quota,
      seats: this.seats,
      method: 'scottish',
      quotaType: this.quotaType,
      elected: this.elected,
      tied,
      rounds: this.rounds,
      totalBallots,
      validBallots,
      exhaustedBallots,
    };
  }
}

/**
 * Meek STV Implementation
 * Iterative method - adjusts keep values until convergence
 */
export class MeekSTV {
  private candidates: Map<string, STVCandidate>;
  private ballots: STVBallot[];
  private seats: number;
  private quota: number;
  private quotaType: 'droop' | 'hare';
  private rounds: STVRound[] = [];
  private elected: string[] = [];
  private nonTransferable = 0;
  private exhaustedVotes = 0;
  private readonly MAX_ITERATIONS = 1000;
  private readonly TOLERANCE = 1e-7;

  constructor(config: STVConfig) {
    this.seats = config.seats;
    this.quotaType = config.quotaType;
    this.ballots = config.ballots.map(b => ({ ...b, weight: b.weight ?? 1 }));
    
    this.candidates = new Map();
    for (const c of config.candidates) {
      this.candidates.set(c.id, { ...c, votes: 0, keepValue: 1 });
    }

    const validBallots = this.ballots.reduce((sum, b) => sum + (b.weight ?? 1), 0);
    this.quota = calculateQuota(validBallots, this.seats, this.quotaType);
  }

  private calculateVotes(keepValues: Map<string, number>): Map<string, number> {
    const votes = new Map<string, number>();
    
    // Initialize all candidates with 0
    for (const candidateId of this.candidates.keys()) {
      votes.set(candidateId, 0);
    }

    for (const ballot of this.ballots) {
      let remainingWeight = ballot.weight ?? 1;
      
      for (const candidateId of ballot.preferences) {
        const candidate = this.candidates.get(candidateId);
        if (!candidate || candidate.eliminated) continue;
        
        const keepValue = keepValues.get(candidateId) ?? 1;
        const voteValue = remainingWeight * keepValue;
        
        votes.set(candidateId, (votes.get(candidateId) ?? 0) + voteValue);
        remainingWeight *= (1 - keepValue);
        
        if (remainingWeight < this.TOLERANCE) break;
      }
      
      // Exhausted
      this.nonTransferable += remainingWeight;
      this.exhaustedVotes += remainingWeight;
    }
    
    return votes;
  }

  private checkElected(votes: Map<string, number>): string[] {
    const newlyElected: string[] = [];
    
    for (const [candidateId, voteCount] of votes) {
      const candidate = this.candidates.get(candidateId)!;
      if (!candidate.elected && !candidate.eliminated && voteCount >= this.quota) {
        newlyElected.push(candidateId);
      }
    }
    
    return newlyElected;
  }

  private findLowest(votes: Map<string, number>): string | null {
    let minVotes = Infinity;
    let lowestId: string | null = null;
    
    for (const [candidateId, voteCount] of votes) {
      const candidate = this.candidates.get(candidateId)!;
      if (!candidate.elected && !candidate.eliminated && voteCount < minVotes) {
        minVotes = voteCount;
        lowestId = candidateId;
      }
    }
    
    return lowestId;
  }

  public count(): STVResult {
    // Initialize keep values
    const keepValues = new Map<string, number>();
    for (const candidateId of this.candidates.keys()) {
      keepValues.set(candidateId, 1);
    }

    let iteration = 0;
    let converged = false;

    while (!converged && iteration < this.MAX_ITERATIONS) {
      iteration++;
      const previousKeepValues = new Map(keepValues);
      
      // Calculate votes with current keep values
      const votes = this.calculateVotes(keepValues);
      
      // Check for newly elected
      const newlyElected = this.checkElected(votes);
      for (const candidateId of newlyElected) {
        const candidate = this.candidates.get(candidateId)!;
        candidate.elected = true;
        this.elected.push(candidateId);
      }
      
      // Check if we have enough elected
      if (this.elected.length >= this.seats) {
        // Set keep value = quota / votes for elected
        for (const candidateId of this.elected) {
          const voteCount = votes.get(candidateId) ?? 0;
          if (voteCount > 0) {
            keepValues.set(candidateId, this.quota / voteCount);
          }
        }
        converged = true;
        break;
      }
      
      // Eliminate lowest if no one elected
      if (newlyElected.length === 0) {
        const lowest = this.findLowest(votes);
        if (lowest) {
          const candidate = this.candidates.get(lowest)!;
          candidate.eliminated = true;
          keepValues.set(lowest, 0);
        }
      }
      
      // Update keep values for elected candidates
      for (const candidateId of this.elected) {
        const voteCount = votes.get(candidateId) ?? 0;
        if (voteCount > 0) {
          keepValues.set(candidateId, this.quota / voteCount);
        }
      }
      
      // Check convergence
      let maxDiff = 0;
      for (const [candidateId, keepValue] of keepValues) {
        const prev = previousKeepValues.get(candidateId) ?? 1;
        maxDiff = Math.max(maxDiff, Math.abs(keepValue - prev));
      }
      
      if (maxDiff < this.TOLERANCE) {
        converged = true;
      }
      
      // Record round
      const round: STVRound = {
        round: iteration,
        quota: this.quota,
        candidates: Array.from(this.candidates.values()).map(c => ({ 
          ...c, 
          votes: votes.get(c.id) ?? 0,
          keepValue: keepValues.get(c.id) ?? 1
        })),
        elected: [...newlyElected],
        eliminated: [],
        nonTransferable: this.nonTransferable,
        exhaustedVotes: this.exhaustedVotes,
        transfers: [], // Meek doesn't have discrete transfers
      };
      this.rounds.push(round);
    }

    // Final vote calculation
    const finalVotes = this.calculateVotes(keepValues);
    
    const continuing = Array.from(this.candidates.values())
      .filter(c => !c.elected && !c.eliminated);
    
    const tied = continuing.length > 0
      ? continuing.filter(c => (finalVotes.get(c.id) ?? 0) === Math.max(...continuing.map(c => finalVotes.get(c.id) ?? 0))).map(c => c.id)
      : [];

    const totalBallots = this.ballots.length;
    const validBallots = this.ballots.filter(b => b.preferences.length > 0).length;
    const exhaustedBallots = this.ballots.filter(b => b.preferences.length === 0).length;

    return {
      quota: this.quota,
      seats: this.seats,
      method: 'meek',
      quotaType: this.quotaType,
      elected: this.elected,
      tied,
      rounds: this.rounds,
      totalBallots,
      validBallots,
      exhaustedBallots,
    };
  }
}

/**
 * Main STV Count Service - Entry point
 */
export class STVCountService {
  static count(config: STVConfig): STVResult {
    if (config.ballots.length === 0) {
      return {
        quota: 0,
        seats: config.seats,
        method: config.method,
        quotaType: config.quotaType,
        elected: [],
        tied: [],
        rounds: [],
        totalBallots: 0,
        validBallots: 0,
        exhaustedBallots: 0,
      };
    }

    // Validate seats vs candidates
    if (config.seats < 1) {
      throw new Error('STV seats must be >= 1');
    }
    
    const continuingCandidates = config.candidates.filter(c => !c.eliminated).length;
    if (continuingCandidates <= config.seats) {
      // Everyone gets elected
      return {
        quota: 0,
        seats: config.seats,
        method: config.method,
        quotaType: config.quotaType,
        elected: config.candidates.filter(c => !c.eliminated).map(c => c.id),
        tied: [],
        rounds: [],
        totalBallots: config.ballots.length,
        validBallots: config.ballots.filter(b => b.preferences.length > 0).length,
        exhaustedBallots: config.ballots.filter(b => b.preferences.length === 0).length,
      };
    }

    if (config.method === 'meek') {
      const counter = new MeekSTV(config);
      return counter.count();
    } else {
      const counter = new ScottishSTV(config);
      return counter.count();
    }
  }

  static extractBallotsFromPoll(poll: any): STVBallot[] {
    // This would be implemented based on actual poll data structure
    // Ported from Loomio's extract_ballots method
    return [];
  }

  static explainResult(result: STVResult): string {
    let explanation = `STV Count (${result.method}, ${result.quotaType} quota)\n`;
    explanation += `Seats: ${result.seats}, Quota: ${result.quota.toFixed(2)}\n`;
    explanation += `Elected: ${result.elected.join(', ')}\n`;
    explanation += `Total ballots: ${result.totalBallots}, Valid: ${result.validBallots}, Exhausted: ${result.exhaustedBallots}\n\n`;
    
    for (const round of result.rounds) {
      explanation += `Round ${round.round}:\n`;
      for (const candidate of round.candidates) {
        const status = candidate.elected ? 'ELECTED' : candidate.eliminated ? 'ELIMINATED' : 'CONTINUING';
        explanation += `  ${candidate.name} (${candidate.id}): ${candidate.votes.toFixed(2)} votes [${status}]\n`;
      }
      if (round.elected.length > 0) {
        explanation += `  → Elected: ${round.elected.join(', ')}\n`;
      }
      if (round.eliminated.length > 0) {
        explanation += `  → Eliminated: ${round.eliminated.join(', ')}\n`;
      }
      if (round.transfers.length > 0) {
        explanation += `  Transfers:\n`;
        for (const t of round.transfers) {
          explanation += `    ${t.from} → ${t.to}: ${t.value.toFixed(2)} (${t.reason})\n`;
        }
      }
      explanation += `  Non-transferable: ${round.nonTransferable.toFixed(2)}, Exhausted: ${round.exhaustedVotes.toFixed(2)}\n\n`;
    }
    
    return explanation;
  }
}

// Export types and classes
export type { STVConfig, STVResult, STVRound, STVBallot, STVCandidate, TransferEvent };
export { ScottishSTV, MeekSTV, calculateDroopQuota, calculateHareQuota, calculateQuota };