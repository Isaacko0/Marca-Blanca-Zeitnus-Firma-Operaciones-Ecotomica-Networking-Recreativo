// arm-loomio/src/patterns.ts
// Pattern Detectors for Collaborative Decision Making
// Following ARM Patterns → Signals Architecture

import { 
  LoomioProposal, 
  LoomioVote, 
  LoomioGroup, 
  LoomioMembership,
  LoomioThread,
  DecisionAnalytics,
  GroupHealthMetrics,
} from './types';

import { Signal, PatternDetector } from '@hscsg/arm-core/src/patterns';

/**
 * Pattern Detection Context
 */
export interface DetectionContext {
  group: LoomioGroup;
  proposals: LoomioProposal[];
  votes: LoomioVote[];
  memberships: LoomioMembership[];
  threads: LoomioThread[];
  timeRange: { start: number; end: number };
}

/**
 * Detected Pattern Signal
 */
export interface LoomioSignal extends Signal {
  domain: 'loomio';
  pattern: LoomioPatternType;
  severity: 'info' | 'warning' | 'critical';
  metadata: Record<string, any>;
}

export enum LoomioPatternType {
  PROPOSAL_STALLED = 'proposal.stalled',
  CONSENSUS_EMERGING = 'consensus.emerging',
  BLOCK_PERSISTENT = 'block.persistent',
  PARTICIPATION_LOW = 'participation.low',
  WEIGHT_CONCENTRATED = 'weight.concentrated',
  SUBGROUP_ISOLATED = 'subgroup.isolated',
  TEMPLATE_UNUSED = 'template.unused',
  ANONYMITY_ANOMALY = 'anonymity.anomaly',
  STV_COMPLEX = 'stv.complex',
  OUTCOME_MISSING = 'outcome.missing',
  LEGAL_NON_COMPLIANT = 'legal.non_compliant',
  THREAD_ABANDONED = 'thread.abandoned',
  VOTE_WEIGHT_DRIFT = 'vote_weight.drift',
  DECISION_VELOCITY_DROP = 'decision_velocity.drop',
}

/**
 * Base Pattern Detector Interface
 */
export interface LoomioPatternDetector extends PatternDetector<DetectionContext, LoomioSignal> {
  patternType: LoomioPatternType;
  severity: 'info' | 'warning' | 'critical';
  cooldownMs: number; // Minimum time between detections
}

/**
 * 1. Proposal Stalled Detector
 * Detects proposals open too long without votes
 */
export class ProposalStalledDetector implements LoomioPatternDetector {
  patternType = LoomioPatternType.PROPOSAL_STALLED;
  severity = 'warning';
  cooldownMs = 24 * 60 * 60 * 1000; // 24 hours

  detect(context: DetectionContext): LoomioSignal[] {
    const signals: LoomioSignal[] = [];
    const now = Date.now();
    const stalledThreshold = 7 * 24 * 60 * 60 * 1000; // 7 days

    for (const proposal of context.proposals) {
      if (proposal.closedAt) continue; // Already closed
      
      const age = now - proposal.createdAt;
      if (age > stalledThreshold) {
        const votesForProposal = context.votes.filter(v => v.proposalId === proposal.id);
        const participationRate = votesForProposal.length / context.group.memberships.filter(m => m.status === 'accepted').length;
        
        if (participationRate < 0.3) { // Less than 30% participation
          signals.push({
            id: `signal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            domain: 'loomio',
            pattern: this.patternType,
            severity: this.severity,
            timestamp: now,
            source: 'pattern_detector',
            metadata: {
              proposalId: proposal.id,
              proposalTitle: proposal.title,
              proposalType: proposal.type,
              ageDays: Math.round(age / (24 * 60 * 60 * 1000)),
              participationRate: Math.round(participationRate * 100),
              eligibleVoters: context.group.memberships.filter(m => m.status === 'accepted').length,
              actualVotes: votesForProposal.length,
              recommendation: 'Send reminder notifications, consider extending deadline or simplifying proposal',
            },
          });
        }
      }
    }

    return signals;
  }
}

/**
 * 2. Consensus Emerging Detector
 * Detects when consensus is forming in open proposals
 */
export class ConsensusEmergingDetector implements LoomioPatternDetector {
  patternType = LoomioPatternType.CONSENSUS_EMERGING;
  severity = 'info';
  cooldownMs = 60 * 60 * 1000; // 1 hour

  detect(context: DetectionContext): LoomioSignal[] {
    const signals: LoomioSignal[] = [];
    const now = Date.now();

    for (const proposal of context.proposals) {
      if (proposal.closedAt) continue;
      if (proposal.type !== 'consensus' && proposal.type !== 'consent') continue;

      const votesForProposal = context.votes.filter(v => v.proposalId === proposal.id);
      if (votesForProposal.length === 0) continue;

      // Check for high agreement
      const agreeVotes = votesForProposal.filter(v => 
        v.choices.some(c => c.optionId.includes('agree'))
      ).length;
      const blockVotes = votesForProposal.filter(v => 
        v.choices.some(c => c.optionId.includes('block'))
      ).length;

      const agreementRate = agreeVotes / votesForProposal.length;
      const blockRate = blockVotes / votesForProposal.length;

      if (agreementRate >= 0.8 && blockRate === 0 && votesForProposal.length >= 3) {
        signals.push({
          id: `signal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          domain: 'loomio',
          pattern: this.patternType,
          severity: this.severity,
          timestamp: now,
          source: 'pattern_detector',
          metadata: {
            proposalId: proposal.id,
            proposalTitle: proposal.title,
            agreementRate: Math.round(agreementRate * 100),
            voteCount: votesForProposal.length,
            recommendation: 'Consensus emerging - consider recording outcome if quorum met',
          },
        });
      }
    }

    return signals;
  }
}

/**
 * 3. Persistent Block Detector
 * Detects repeated blocks in consensus proposals
 */
export class PersistentBlockDetector implements LoomioPatternDetector {
  patternType = LoomioPatternType.BLOCK_PERSISTENT;
  severity = 'critical';
  cooldownMs = 24 * 60 * 60 * 1000; // 24 hours

  detect(context: DetectionContext): LoomioSignal[] {
    const signals: LoomioSignal[] = [];
    const now = Date.now();

    for (const proposal of context.proposals) {
      if (proposal.closedAt) continue;
      if (proposal.type !== 'consensus' && proposal.type !== 'consent') continue;

      const votesForProposal = context.votes.filter(v => v.proposalId === proposal.id);
      const blockVotes = votesForProposal.filter(v => 
        v.choices.some(c => c.optionId.includes('block'))
      );

      if (blockVotes.length >= 2) {
        // Check if same members blocking across proposals
        const blockers = blockVotes.map(v => v.affiliateId);
        const blockHistory = context.votes.filter(v => 
          blockers.includes(v.affiliateId) &&
          v.choices.some(c => c.optionId.includes('block')) &&
          v.proposalId !== proposal.id
        );

        if (blockHistory.length >= 2) {
          signals.push({
            id: `signal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            domain: 'loomio',
            pattern: this.patternType,
            severity: this.severity,
            timestamp: now,
            source: 'pattern_detector',
            metadata: {
              proposalId: proposal.id,
              proposalTitle: proposal.title,
              blockers: blockers.length,
              blockHistoryCount: blockHistory.length,
              persistentBlockers: [...new Set(blockHistory.map(v => v.affiliateId))].length,
              recommendation: 'Mediation recommended - persistent blocking pattern detected',
            },
          });
        }
      }
    }

    return signals;
  }
}

/**
 * 4. Low Participation Detector
 * Detects proposals with critically low participation
 */
export class LowParticipationDetector implements LoomioPatternDetector {
  patternType = LoomioPatternType.PARTICIPATION_LOW;
  severity = 'warning';
  cooldownMs = 12 * 60 * 60 * 1000; // 12 hours

  detect(context: DetectionContext): LoomioSignal[] {
    const signals: LoomioSignal[] = [];
    const now = Date.now();

    for (const proposal of context.proposals) {
      if (proposal.closedAt) continue;

      const eligibleVoters = context.memberships.filter(m => m.status === 'accepted').length;
      if (eligibleVoters === 0) continue;

      const votesForProposal = context.votes.filter(v => v.proposalId === proposal.id);
      const participationRate = votesForProposal.length / eligibleVoters;

      // Check if proposal is in latter half of its duration
      const proposalAge = now - proposal.createdAt;
      const proposalDuration = (proposal.config.durationDays ?? 7) * 24 * 60 * 60 * 1000;
      const progressRatio = proposalAge / proposalDuration;

      if (progressRatio > 0.5 && participationRate < 0.2) {
        signals.push({
          id: `signal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          domain: 'loomio',
          pattern: this.patternType,
          severity: this.severity,
          timestamp: now,
          source: 'pattern_detector',
          metadata: {
            proposalId: proposal.id,
            proposalTitle: proposal.title,
            participationRate: Math.round(participationRate * 100),
            progressRatio: Math.round(progressRatio * 100),
            eligibleVoters,
            actualVotes: votesForProposal.length,
            recommendation: 'Send targeted reminders, consider extending deadline',
          },
        });
      }
    }

    return signals;
  }
}

/**
 * 5. Vote Weight Concentration Detector
 * Detects when voting power is concentrated in few members
 */
export class WeightConcentrationDetector implements LoomioPatternDetector {
  patternType = LoomioPatternType.WEIGHT_CONCENTRATED;
  severity = 'warning';
  cooldownMs = 7 * 24 * 60 * 60 * 1000; // 7 days

  detect(context: DetectionContext): LoomioSignal[] {
    const signals: LoomioSignal[] = [];
    const now = Date.now();

    const weights = context.memberships
      .filter(m => m.status === 'accepted' && m.voteWeight > 0)
      .map(m => ({ affiliateId: m.affiliateId, weight: m.voteWeight }))
      .sort((a, b) => b.weight - a.weight);

    if (weights.length < 3) return signals;

    const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
    const top20PercentCount = Math.ceil(weights.length * 0.2);
    const top20Weight = weights.slice(0, top20PercentCount).reduce((sum, w) => sum + w.weight, 0);
    const concentrationRatio = top20Weight / totalWeight;

    if (concentrationRatio > 0.8) { // Top 20% hold >80% of weight
      signals.push({
        id: `signal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        domain: 'loomio',
        pattern: this.patternType,
        severity: this.severity,
        timestamp: now,
        source: 'pattern_detector',
        metadata: {
          totalMembers: weights.length,
          totalWeight,
          concentrationRatio: Math.round(concentrationRatio * 100),
          topMembers: weights.slice(0, top20PercentCount).map(w => ({
            affiliateId: w.affiliateId,
            weight: w.weight,
          })),
          recommendation: 'Review vote weight distribution for fairness',
        },
      });
    }

    return signals;
  }
}

/**
 * 6. Subgroup Isolation Detector
 * Detects subgroups with no cross-participation
 */
export class SubgroupIsolationDetector implements LoomioPatternDetector {
  patternType = LoomioPatternType.SUBGROUP_ISOLATED;
  severity = 'info';
  cooldownMs = 7 * 24 * 60 * 60 * 1000; // 7 days

  detect(context: DetectionContext): LoomioSignal[] {
    const signals: LoomioSignal[] = [];
    const now = Date.now();

    // Group proposals by subgroup
    const subgroupProposals = new Map<string, LoomioProposal[]>();
    
    for (const proposal of context.proposals) {
      // In real implementation, would get group hierarchy
      const groupId = proposal.groupId; // Simplified
      if (!subgroupProposals.has(groupId)) {
        subgroupProposals.set(groupId, []);
      }
      subgroupProposals.get(groupId)!.push(proposal);
    }

    // Check cross-participation
    for (const [groupId, proposals] of subgroupProposals) {
      if (proposals.length < 2) continue;

      const groupMembers = context.memberships.filter(m => m.groupId === groupId);
      if (groupMembers.length === 0) continue;

      // Check if members participate in parent group proposals
      const memberIds = new Set(groupMembers.map(m => m.affiliateId));
      let crossParticipation = 0;

      for (const [otherGroupId, otherProposals] of subgroupProposals) {
        if (otherGroupId === groupId) continue;
        
        for (const otherProposal of otherProposals) {
          const otherVotes = context.votes.filter(v => v.proposalId === otherProposal.id);
          const crossVotes = otherVotes.filter(v => memberIds.has(v.affiliateId));
          if (crossVotes.length > 0) crossParticipation++;
        }
      }

      if (crossParticipation === 0 && proposals.length > 0) {
        signals.push({
          id: `signal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          domain: 'loomio',
          pattern: this.patternType,
          severity: this.severity,
          timestamp: now,
          source: 'pattern_detector',
          metadata: {
            subgroupId: groupId,
            proposalsCount: proposals.length,
            memberCount: groupMembers.length,
            recommendation: 'Consider shared proposals or cross-subgroup discussions',
          },
        });
      }
    }

    return signals;
  }
}

/**
 * 7. Unused Template Detector
 * Detects proposal templates that are never used
 */
export class UnusedTemplateDetector implements LoomioPatternDetector {
  patternType = LoomioPatternType.TEMPLATE_UNUSED;
  severity = 'info';
  cooldownMs = 30 * 24 * 60 * 60 * 1000; // 30 days

  detect(context: DetectionContext): LoomioSignal[] {
    // Would need template data - simplified for now
    return [];
  }
}

/**
 * 8. Anonymity Anomaly Detector
 * Detects unusual patterns in anonymous vs identified voting
 */
export class AnonymityAnomalyDetector implements LoomioPatternDetector {
  patternType = LoomioPatternType.ANONYMITY_ANOMALY;
  severity = 'warning';
  cooldownMs = 24 * 60 * 60 * 1000; // 24 hours

  detect(context: DetectionContext): LoomioSignal[] {
    const signals: LoomioSignal[] = [];
    const now = Date.now();

    for (const proposal of context.proposals) {
      if (!proposal.anonymous) continue;

      const votesForProposal = context.votes.filter(v => v.proposalId === proposal.id);
      const anonymousVotes = votesForProposal.filter(v => v.anonymous).length;
      const identifiedVotes = votesForProposal.filter(v => !v.anonymous).length;

      if (anonymousVotes + identifiedVotes === 0) continue;

      const anonymityRatio = anonymousVotes / (anonymousVotes + identifiedVotes);

      // Alert if unusual mix (e.g., mostly anonymous with some identified, or vice versa)
      if (anonymityRatio > 0 && anonymityRatio < 1 && (anonymousVotes + identifiedVotes) >= 5) {
        if (anonymityRatio < 0.2 || anonymityRatio > 0.8) {
          signals.push({
            id: `signal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            domain: 'loomio',
            pattern: this.patternType,
            severity: this.severity,
            timestamp: now,
            source: 'pattern_detector',
            metadata: {
              proposalId: proposal.id,
              proposalTitle: proposal.title,
              anonymityRatio: Math.round(anonymityRatio * 100),
              anonymousVotes,
              identifiedVotes,
              totalVotes: anonymousVotes + identifiedVotes,
              recommendation: 'Review anonymity configuration - unusual voting pattern',
            },
          });
        }
      }
    }

    return signals;
  }
}

/**
 * 9. Complex STV Detector
 * Detects STV elections requiring many rounds
 */
export class STVComplexityDetector implements LoomioPatternDetector {
  patternType = LoomioPatternType.STV_COMPLEX;
  severity = 'info';
  cooldownMs = 24 * 60 * 60 * 1000; // 24 hours

  detect(context: DetectionContext): LoomioSignal[] {
    const signals: LoomioSignal[] = [];
    const now = Date.now();

    for (const proposal of context.proposals) {
      if (proposal.type !== 'stv' || !proposal.stvResult) continue;
      if (proposal.closedAt && !proposal.stvResult.rounds.length) continue;

      const rounds = proposal.stvResult.rounds.length;
      const candidates = proposal.stvResult.elected.length + 
        (proposal.stvResult.tied?.length ?? 0);

      if (rounds >= 5) {
        signals.push({
          id: `signal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          domain: 'loomio',
          pattern: this.patternType,
          severity: this.severity,
          timestamp: now,
          source: 'pattern_detector',
          metadata: {
            proposalId: proposal.id,
            proposalTitle: proposal.title,
            rounds,
            seats: proposal.stvResult.seats,
            candidates,
            method: proposal.stvResult.method,
            quotaType: proposal.stvResult.quotaType,
            recommendation: 'Complex STV count - provide detailed explanation to voters',
          },
        });
      }
    }

    return signals;
  }
}

/**
 * 10. Missing Outcome Detector
 * Detects closed proposals without recorded outcomes
 */
export class MissingOutcomeDetector implements LoomioPatternDetector {
  patternType = LoomioPatternType.OUTCOME_MISSING;
  severity = 'warning';
  cooldownMs = 24 * 60 * 60 * 1000; // 24 hours

  detect(context: DetectionContext): LoomioSignal[] {
    const signals: LoomioSignal[] = [];
    const now = Date.now();

    for (const proposal of context.proposals) {
      if (!proposal.closedAt) continue;
      // In real implementation, would check for outcome record
      // For now, check if tally exists but no outcome
      if (proposal.tally && !proposal.outcomeRecorded) {
        signals.push({
          id: `signal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          domain: 'loomio',
          pattern: this.patternType,
          severity: this.severity,
          timestamp: now,
          source: 'pattern_detector',
          metadata: {
            proposalId: proposal.id,
            proposalTitle: proposal.title,
            closedAt: proposal.closedAt,
            hasTally: !!proposal.tally,
            recommendation: 'Record outcome for closed proposal',
          },
        });
      }
    }

    return signals;
  }
}

/**
 * 11. Legal Non-Compliance Detector
 * Detects members participating without legal acceptance
 */
export class LegalNonComplianceDetector implements LoomioPatternDetector {
  patternType = LoomioPatternType.LEGAL_NON_COMPLIANT;
  severity = 'critical';
  cooldownMs = 60 * 60 * 1000; // 1 hour

  detect(context: DetectionContext): LoomioSignal[] {
    const signals: LoomioSignal[] = [];
    const now = Date.now();

    // Would check legal acceptance status
    // Simplified for now
    return signals;
  }
}

/**
 * 12. Abandoned Thread Detector
 * Detects threads with no activity for extended period
 */
export class ThreadAbandonedDetector implements LoomioPatternDetector {
  patternType = LoomioPatternType.THREAD_ABANDONED;
  severity = 'info';
  cooldownMs = 7 * 24 * 60 * 60 * 1000; // 7 days

  detect(context: DetectionContext): LoomioSignal[] {
    const signals: LoomioSignal[] = [];
    const now = Date.now();
    const abandonedThreshold = 30 * 24 * 60 * 60 * 1000; // 30 days

    for (const thread of context.threads) {
      if (thread.lockedAt) continue;
      if (now - thread.lastActivityAt > abandonedThreshold) {
        signals.push({
          id: `signal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          domain: 'loomio',
          pattern: this.patternType,
          severity: this.severity,
          timestamp: now,
          source: 'pattern_detector',
          metadata: {
            threadId: thread.id,
            threadTitle: thread.title,
            daysInactive: Math.round((now - thread.lastActivityAt) / (24 * 60 * 60 * 1000)),
            itemsCount: thread.itemsCount,
            recommendation: 'Consider locking or archiving abandoned thread',
          },
        });
      }
    }

    return signals;
  }
}

/**
 * 13. Vote Weight Drift Detector
 * Detects significant changes in vote weight distribution
 */
export class VoteWeightDriftDetector implements LoomioPatternDetector {
  patternType = LoomioPatternType.VOTE_WEIGHT_DRIFT;
  severity = 'warning';
  cooldownMs = 24 * 60 * 60 * 1000; // 24 hours

  detect(context: DetectionContext): LoomioSignal[] {
    // Would compare current weights to historical baseline
    return [];
  }
}

/**
 * 14. Decision Velocity Drop Detector
 * Detects when group decision-making slows down
 */
export class DecisionVelocityDropDetector implements LoomioPatternDetector {
  patternType = LoomioPatternType.DECISION_VELOCITY_DROP;
  severity = 'warning';
  cooldownMs = 7 * 24 * 60 * 60 * 1000; // 7 days

  detect(context: DetectionContext): LoomioSignal[] {
    // Would compare current period velocity to historical
    return [];
  }
}

/**
 * Pattern Detector Registry
 */
export const LOOMIO_PATTERN_DETECTORS: LoomioPatternDetector[] = [
  new ProposalStalledDetector(),
  new ConsensusEmergingDetector(),
  new PersistentBlockDetector(),
  new LowParticipationDetector(),
  new WeightConcentrationDetector(),
  new SubgroupIsolationDetector(),
  new UnusedTemplateDetector(),
  new AnonymityAnomalyDetector(),
  new STVComplexityDetector(),
  new MissingOutcomeDetector(),
  new LegalNonComplianceDetector(),
  new ThreadAbandonedDetector(),
  new VoteWeightDriftDetector(),
  new DecisionVelocityDropDetector(),
];

/**
 * Run all pattern detectors
 */
export function detectAllPatterns(context: DetectionContext): LoomioSignal[] {
  const allSignals: LoomioSignal[] = [];
  
  for (const detector of LOOMIO_PATTERN_DETECTORS) {
    try {
      const signals = detector.detect(context);
      allSignals.push(...signals);
    } catch (error) {
      console.error(`Pattern detector ${detector.patternType} failed:`, error);
    }
  }
  
  // Sort by severity and timestamp
  return allSignals.sort((a, b) => {
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
    if (severityDiff !== 0) return severityDiff;
    return b.timestamp - a.timestamp;
  });
}

/**
 * Filter signals by pattern type
 */
export function filterSignalsByType(signals: LoomioSignal[], types: LoomioPatternType[]): LoomioSignal[] {
  return signals.filter(s => types.includes(s.pattern));
}

/**
 * Get signals for specific group
 */
export function getGroupSignals(signals: LoomioSignal[], groupId: string): LoomioSignal[] {
  return signals.filter(s => 
    s.metadata.groupId === groupId || 
    s.metadata.proposalId?.startsWith(groupId) ||
    s.metadata.threadId?.startsWith(groupId)
  );
}