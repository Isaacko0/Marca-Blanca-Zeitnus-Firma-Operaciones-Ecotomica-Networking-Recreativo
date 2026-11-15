// arm-loomio/src/core/analyticsService.ts
// Analytics Service - Decision Analytics & Group Health

import { 
  DecisionAnalytics,
  GroupHealthMetrics,
} from '../../types';

export class LoomioAnalyticsService {
  /**
   * Get decision analytics for a group
   */
  async getDecisionAnalytics(groupId: string, period: { start: number; end: number }): Promise<any> {
    // Implementation would query proposals, votes, outcomes
    return {
      groupId,
      period,
      proposalsCreated: 0,
      proposalsClosed: 0,
      proposalsWithOutcome: 0,
      averageParticipationRate: 0,
      consensusRate: 0,
      blockRate: 0,
      proposalTypesUsed: new Map(),
      averageTimeToDecision: 0,
      voteWeightDistribution: {
        giniCoefficient: 0,
        totalWeight: 0,
        activeVoters: 0,
      },
      anonymousVoteRate: 0,
      stvElectionsCount: 0,
    } as any;
  }

  /**
   * Get group health metrics
   */
  async getGroupHealthMetrics(groupId: string): Promise<any> {
    return {
      groupId,
      memberCount: 0,
      activeMemberCount: 0,
      proposalCount: 0,
      threadCount: 0,
      participationRate: 0,
      decisionVelocity: 0,
      consensusHealth: 0,
      weightFairness: 0,
      subgroupIntegration: 0,
      templateUsageRate: 0,
      legalCompliance: 0,
    } as any;
  }

  /**
   * Calculate Gini coefficient for vote weight distribution
   */
  calculateGiniCoefficient(weights: number[]): number {
    if (weights.length === 0) return 0;
    
    const sorted = [...weights].sort((a, b) => a - b);
    const n = sorted.length;
    let sum = 0;
    
    for (let i = 0; i < n; i++) {
      sum += (2 * (i + 1) - n - 1) * sorted[i];
    }
    
    const total = sorted.reduce((a, b) => a + b, 0);
    if (total === 0) return 0;
    
    return sum / (n * total);
  }

  /**
   * Calculate participation rate
   */
  calculateParticipationRate(eligibleVoters: number, actualVotes: number): number {
    if (eligibleVoters === 0) return 0;
    return actualVotes / eligibleVoters;
  }

  /**
   * Calculate consensus rate
   */
  calculateConsensusRate(proposals: any[]): number {
    if (proposals.length === 0) return 0;
    
    const consensusProposals = proposals.filter(p => 
      p.type === 'consensus' || p.type === 'consent'
    );
    if (consensusProposals.length === 0) return 0;
    
    const withOutcome = consensusProposals.filter(p => p.outcomeRecorded);
    if (withOutcome.length === 0) return 0;
    
    const approved = withOutcome.filter(p => p.decision === 'approved' || p.decision === 'consensus');
    return approved.length / withOutcome.length;
  }

  /**
   * Calculate block rate
   */
  calculateBlockRate(proposals: any[]): number {
    if (proposals.length === 0) return 0;
    
    const consensusProposals = proposals.filter(p => 
      p.type === 'consensus' || p.type === 'consent'
    );
    if (consensusProposals.length === 0) return 0;
    
    const withOutcome = consensusProposals.filter(p => p.outcomeRecorded);
    if (withOutcome.length === 0) return 0;
    
    const blocked = withOutcome.filter(p => p.decision === 'blocked');
    return blocked.length / withOutcome.length;
  }

  /**
   * Calculate average time to decision
   */
  calculateAverageTimeToDecision(proposals: any[]): number {
    const closed = proposals.filter(p => p.closedAt);
    if (closed.length === 0) return 0;
    
    const totalTime = closed.reduce((sum, p) => sum + (p.closedAt - p.createdAt), 0);
    return totalTime / closed.length;
  }

  /**
   * Calculate decision velocity (decisions per week)
   */
  calculateDecisionVelocity(proposals: any[], periodMs: number): number {
    const closed = proposals.filter(p => p.closedAt);
    const weeks = periodMs / (7 * 24 * 60 * 60 * 1000);
    if (weeks === 0) return 0;
    return closed.length / weeks;
  }
}