// arm-sensorica/src/patterns.ts - Pattern Detection (Sensorica Patterns)
import { 
  SensoricaEvent, 
  SensoricaState, 
  SensoricaPattern, 
  PatternMatch,
  Contribution,
  Project,
  Affiliate,
  TrustScore,
  Proposal,
  ProposalType,
  DistributionResult,
  ResourcePool,
  ResourceAccessRequest
} from './types';

// ============================================
// PATTERN DEFINITIONS
// ============================================

export const SENSORICA_PATTERNS: SensoricaPattern[] = [
  {
    id: 'contribution-streak',
    name: 'Contribution Streak',
    description: 'Affiliate contributing consistently for N consecutive periods',
    detector: detectContributionStreak
  },
  {
    id: 'resource-bottleneck',
    name: 'Resource Bottleneck',
    description: 'Resource pool access requests exceeding capacity',
    detector: detectResourceBottleneck
  },
  {
    id: 'value-equation-imbalance',
    name: 'Value Equation Imbalance',
    description: 'Distribution heavily skewed to few contribution types',
    detector: detectValueEquationImbalance
  },
  {
    id: 'governance-stalemate',
    name: 'Governance Stalemate',
    description: 'Proposals not reaching quorum repeatedly',
    detector: detectGovernanceStalemate
  },
  {
    id: 'exchange-firm-drift',
    name: 'Exchange Firm Drift',
    description: 'External revenue not flowing to value equation per config',
    detector: detectExchangeFirmDrift
  },
  {
    id: 'trust-anomaly',
    name: 'Trust Anomaly',
    description: 'Sudden trust score changes without contribution basis',
    detector: detectTrustAnomaly
  },
  {
    id: 'contribution-burst',
    name: 'Contribution Burst',
    description: 'Sudden spike in contributions from single affiliate',
    detector: detectContributionBurst
  },
  {
    id: 'project-stagnation',
    name: 'Project Stagnation',
    description: 'Active project with no verified contributions for extended period',
    detector: detectProjectStagnation
  },
  {
    id: 'trust-manipulation',
    name: 'Trust Manipulation',
    description: 'Coordinated trust score updates without observations',
    detector: detectTrustManipulation
  },
  {
    id: 'resource-hoarding',
    name: 'Resource Hoarding',
    description: 'Single affiliate monopolizing shared resources',
    detector: detectResourceHoarding
  }
];

// ============================================
// PATTERN DETECTORS
// ============================================

function detectContributionStreak(events: SensoricaEvent[], state: SensoricaState): PatternMatch[] {
  const matches: PatternMatch[] = [];
  const streakThreshold = 7; // 7 consecutive days
  
  // Group contributions by affiliate and date
  const contributionsByAffiliate = new Map<string, Map<string, number>>(); // affiliateId -> date -> count
  
  for (const event of events) {
    if (event.type === 'contribution.submit' && event.payload.verificationStatus === 'verified') {
      const affiliateId = event.author as string;
      const date = new Date(event.timestamp.value).toISOString().split('T')[0];
      
      if (!contributionsByAffiliate.has(affiliateId)) {
        contributionsByAffiliate.set(affiliateId, new Map());
      }
      const affiliateMap = contributionsByAffiliate.get(affiliateId)!;
      affiliateMap.set(date, (affiliateMap.get(date) || 0) + 1);
    }
  }
  
  for (const [affiliateId, dateMap] of contributionsByAffiliate) {
    const dates = Array.from(dateMap.keys()).sort();
    let streak = 1;
    
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]).getTime();
      const curr = new Date(dates[i]).getTime();
      const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        streak++;
      } else {
        streak = 1;
      }
      
      if (streak >= streakThreshold) {
        matches.push({
          patternId: 'contribution-streak',
          patternName: 'Contribution Streak',
          detectedAt: { value: Date.now(), timezone: 'UTC' },
          affectedEntities: [affiliateId],
          severity: 'info',
          details: { streakLength: streak, startDate: dates[i - streakThreshold + 1], endDate: dates[i] }
        });
      }
    }
  }
  
  return matches;
}

function detectResourceBottleneck(events: SensoricaEvent[], state: SensoricaState): PatternMatch[] {
  const matches: PatternMatch[] = [];
  const accessRequests = new Map<string, number>(); // resourceId -> count
  
  for (const event of events) {
    if (event.type === 'resourcePool.access') {
      const resourceId = event.payload.resourceId;
      accessRequests.set(resourceId, (accessRequests.get(resourceId) || 0) + 1);
    }
  }
  
  for (const [resourceId, count] of accessRequests) {
    const pool = Array.from(state.resourcePools.values()).find(p => 
      p.resources.some(r => r.id === resourceId)
    );
    
    if (pool) {
      const resource = pool.resources.find(r => r.id === resourceId);
      if (resource && count > Number(resource.capacity.value) * 2) {
        matches.push({
          patternId: 'resource-bottleneck',
          patternName: 'Resource Bottleneck',
          detectedAt: { value: Date.now(), timezone: 'UTC' },
          affectedEntities: [resourceId],
          severity: 'warning',
          details: { requestCount: count, capacity: resource.capacity.value }
        });
      }
    }
  }
  
  return matches;
}

function detectValueEquationImbalance(events: SensoricaEvent[], state: SensoricaState): PatternMatch[] {
  const matches: PatternMatch[] = [];
  
  for (const [projectId, distribution] of state.distributions) {
    const contributions = Array.from(state.contributions.values())
      .filter(c => c.projectId === projectId && c.verificationStatus === 'verified');
    
    if (contributions.length < 5) continue;
    
    // Count by type
    const typeCounts = new Map<string, number>();
    for (const c of contributions) {
      typeCounts.set(c.type, (typeCounts.get(c.type) || 0) + 1);
    }
    
    // Check if one type dominates (>80%)
    const total = contributions.length;
    for (const [type, count] of typeCounts) {
      if (count / total > 0.8) {
        matches.push({
          patternId: 'value-equation-imbalance',
          patternName: 'Value Equation Imbalance',
          detectedAt: { value: Date.now(), timezone: 'UTC' },
          affectedEntities: [projectId],
          severity: 'warning',
          details: { dominantType: type, percentage: (count / total) * 100 }
        });
      }
    }
  }
  
  return matches;
}

function detectGovernanceStalemate(events: SensoricaEvent[], state: SensoricaState): PatternMatch[] {
  const matches: PatternMatch[] = [];
  const rejectedProposals = new Map<string, number>(); // projectId -> count
  
  for (const proposal of state.governanceProposals.values()) {
    if (proposal.status === 'rejected' || (proposal.status === 'voting' && isProposalExpired(proposal))) {
      rejectedProposals.set(proposal.projectId, (rejectedProposals.get(proposal.projectId) || 0) + 1);
    }
  }
  
  for (const [projectId, count] of rejectedProposals) {
    if (count >= 3) {
      matches.push({
        patternId: 'governance-stalemate',
        patternName: 'Governance Stalemate',
        detectedAt: { value: Date.now(), timezone: 'UTC' },
        affectedEntities: [projectId],
        severity: 'warning',
        details: { rejectedCount: count }
      });
    }
  }
  
  return matches;
}

function detectExchangeFirmDrift(events: SensoricaEvent[], state: SensoricaState): PatternMatch[] {
  const matches: PatternMatch[] = [];
  
  for (const firm of state.exchangeFirms.values()) {
    // Check if firm has revenue events but no corresponding distributions
    const revenueEvents = events.filter(e => 
      e.type === 'exchangeFirm.revenueReceived' && e.payload.exchangeFirmId === firm.id
    );
    
    const distributions = Array.from(state.distributions.values())
      .filter(d => {
        const project = state.projects.get(d.projectId);
        return project && project.exchangeFirms?.includes(firm.id);
      });
    
    if (revenueEvents.length > 0 && distributions.length === 0) {
      matches.push({
        patternId: 'exchange-firm-drift',
        patternName: 'Exchange Firm Drift',
        detectedAt: { value: Date.now(), timezone: 'UTC' },
        affectedEntities: [firm.id],
        severity: 'critical',
        details: { revenueEvents: revenueEvents.length, distributions: distributions.length }
      });
    }
  }
  
  return matches;
}

function detectTrustAnomaly(events: SensoricaEvent[], state: SensoricaState): PatternMatch[] {
  const matches: PatternMatch[] = [];
  
  for (const event of events) {
    if (event.type === 'trust.update') {
      const trustScore = state.trustScores.get(event.payload.affiliateId);
      const change = Math.abs(event.payload.newScore - (trustScore?.value || 0.5));
      
      // Flag if trust changed by >0.3 without recent contributions
      if (change > 0.3) {
        const recentContributions = Array.from(state.contributions.values()).filter(c => 
          c.affiliateId === event.payload.affiliateId &&
          Date.now() - c.timestamp.value < 7 * 24 * 60 * 60 * 1000
        );
        
        if (recentContributions.length === 0) {
          matches.push({
            patternId: 'trust-anomaly',
            patternName: 'Trust Anomaly',
            detectedAt: { value: Date.now(), timezone: 'UTC' },
            affectedEntities: [event.payload.affiliateId],
            severity: 'warning',
            details: { scoreChange: change, recentContributions: recentContributions.length }
          });
        }
      }
    }
  }
  
  return matches;
}

function detectContributionBurst(events: SensoricaEvent[], state: SensoricaState): PatternMatch[] {
  const matches: PatternMatch[] = [];
  const contributionsByAffiliate = new Map<string, SensoricaEvent[]>();
  
  for (const event of events) {
    if (event.type === 'contribution.submit') {
      const affiliateId = event.author;
      if (!contributionsByAffiliate.has(affiliateId)) {
        contributionsByAffiliate.set(affiliateId, []);
      }
      contributionsByAffiliate.get(affiliateId)!.push(event);
    }
  }
  
  for (const [affiliateId, events] of contributionsByAffiliate) {
    // Check for burst in last hour
    const hourAgo = Date.now() - 60 * 60 * 1000;
    const recent = events.filter(e => e.timestamp.value > hourAgo);
    
    if (recent.length >= 10) {
      matches.push({
        patternId: 'contribution-burst',
        patternName: 'Contribution Burst',
        detectedAt: { value: Date.now(), timezone: 'UTC' },
        affectedEntities: [affiliateId],
        severity: 'info',
        details: { count: recent.length, window: '1 hour' }
      });
    }
  }
  
  return matches;
}

function detectProjectStagnation(events: SensoricaEvent[], state: SensoricaState): PatternMatch[] {
  const matches: PatternMatch[] = [];
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  
  for (const project of state.projects.values()) {
    if (project.status !== 'active') continue;
    
    const recentContributions = Array.from(state.contributions.values()).filter(c => 
      c.projectId === project.id && 
      c.verificationStatus === 'verified' &&
      c.timestamp.value > thirtyDaysAgo
    );
    
    if (recentContributions.length === 0 && project.affiliates.length > 0) {
      matches.push({
        patternId: 'project-stagnation',
        patternName: 'Project Stagnation',
        detectedAt: { value: Date.now(), timezone: 'UTC' },
        affectedEntities: [project.id],
        severity: 'warning',
        details: { daysSinceLastContribution: Math.floor((Date.now() - project.updatedAt.value) / (24 * 60 * 60 * 1000)) }
      });
    }
  }
  
  return matches;
}

function detectTrustManipulation(events: SensoricaEvent[], state: SensoricaState): PatternMatch[] {
  const matches: PatternMatch[] = [];
  const trustUpdatesByUpdater = new Map<string, SensoricaEvent[]>();
  
  for (const event of events) {
    if (event.type === 'trust.update') {
      const updater = event.author;
      if (!trustUpdatesByUpdater.has(updater)) {
        trustUpdatesByUpdater.set(updater, []);
      }
      trustUpdatesByUpdater.get(updater)!.push(event);
    }
  }
  
  for (const [updater, updates] of trustUpdatesByUpdater) {
    // Check for coordinated updates (multiple updates in short time to different affiliates)
    const hourAgo = Date.now() - 60 * 60 * 1000;
    const recent = updates.filter(e => e.timestamp.value > hourAgo);
    
    if (recent.length >= 5) {
      const uniqueSubjects = new Set(recent.map(u => u.payload.affiliateId));
      if (uniqueSubjects.size >= 3) {
        matches.push({
          patternId: 'trust-manipulation',
          patternName: 'Trust Manipulation',
          detectedAt: { value: Date.now(), timezone: 'UTC' },
          affectedEntities: [updater, ...uniqueSubjects],
          severity: 'critical',
          details: { updater, targets: Array.from(uniqueSubjects), count: recent.length }
        });
      }
    }
  }
  
  return matches;
}

function detectResourceHoarding(events: SensoricaEvent[], state: SensoricaState): PatternMatch[] {
  const matches: PatternMatch[] = [];
  const accessByAffiliate = new Map<string, Map<string, number>>(); // affiliateId -> resourceId -> count
  
  for (const event of events) {
    if (event.type === 'resourcePool.access' && event.payload.status === 'approved') {
      const affiliateId = event.payload.affiliateId;
      const resourceId = event.payload.resourceId;
      
      if (!accessByAffiliate.has(affiliateId)) {
        accessByAffiliate.set(affiliateId, new Map());
      }
      const resourceMap = accessByAffiliate.get(affiliateId)!;
      resourceMap.set(resourceId, (resourceMap.get(resourceId) || 0) + 1);
    }
  }
  
  for (const [affiliateId, resourceMap] of accessByAffiliate) {
    for (const [resourceId, count] of resourceMap) {
      // Check if this affiliate has >80% of accesses to this resource
      let totalAccesses = 0;
      for (const [_, rMap] of accessByAffiliate) {
        totalAccesses += rMap.get(resourceId) || 0;
      }
      
      if (totalAccesses > 0 && count / totalAccesses > 0.8) {
        matches.push({
          patternId: 'resource-hoarding',
          patternName: 'Resource Hoarding',
          detectedAt: { value: Date.now(), timezone: 'UTC' },
          affectedEntities: [affiliateId, resourceId],
          severity: 'warning',
          details: { affiliateAccesses: count, totalAccesses, percentage: (count / totalAccesses) * 100 }
        });
      }
    }
  }
  
  return matches;
}

function isProposalExpired(proposal: any): boolean {
  return Date.now() >= proposal.votingEndsAt.value;
}

import { generateId } from './utils';