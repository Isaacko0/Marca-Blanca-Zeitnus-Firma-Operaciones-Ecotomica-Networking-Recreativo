// src/core/lib/tq-social-audit.ts
// Social Audit Panel with CDS Rotation
// Implements: Panel rotation, Audit scheduling, CDS-weighted selection, Audit reports, Appeal process

import type { TQTransaction } from './tq';
import type { DisCO_CAT_Engine, DisCOContribution, ConsentDecision } from './tq-disco-cat';
import type { BreadEngine, BreadProfile } from './tq-bread';
import type { OASAConstitutionEngine, CloserVillage } from './tq-oasa';
import type { VirginiaVestingGateway } from './tq-types-extended';

// ============================================================================
// SOCIAL AUDIT TYPES
// ============================================================================

export interface SocialAuditPanel {
  id: string;
  name: string;
  purpose: string;
  members: SocialAuditMember[];
  rotationSchedule: RotationSchedule;
  scope: AuditScope;
  status: 'forming' | 'active' | 'paused' | 'dissolved';
  createdAt: number;
  updatedAt: number;
}

export interface SocialAuditMember {
  did: string;
  displayName: string;
  cdsScore: number;
  reputation: number;
  domain: string; // Virginia N2 domain
  role: 'chair' | 'member' | 'observer' | 'subject-matter-expert';
  termStart: number;
  termEnd: number;
  auditsCompleted: number;
  auditsChaired: number;
  conflictsOfInterest: string[]; // DIDs/orgs
  status: 'active' | 'on-leave' | 'removed';
}

export interface RotationSchedule {
  interval: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
  maxConsecutiveTerms: number;
  coolingPeriod: number; // ms
  selectionMethod: 'cds-weighted' | 'lottery' | 'hybrid';
  panelSize: number;
  chairRotation: boolean;
  nextRotation: number;
}

export interface AuditScope {
  domains: string[]; // Virginia N2 domains covered
  criteria: AuditCriterion[];
  frequency: 'continuous' | 'triggered' | 'scheduled';
  triggerEvents: string[];
}

export interface AuditCriterion {
  id: string;
  name: string;
  description: string;
  category: 'care' | 'governance' | 'ecological' | 'economic' | 'federation' | 'transparency';
  weight: number;
  measurement: 'score' | 'boolean' | 'evidence' | 'threshold';
  required: boolean;
  evaluatorRole: 'panel' | 'expert' | 'community' | 'automated';
}

export interface SocialAudit {
  id: string;
  panelId: string;
  subjectType: 'village' | 'dho' | 'n3-node' | 'proposal' | 'federation' | 'agent';
  subjectId: string;
  subjectName: string;
  scope: AuditScope;
  status: 'scheduled' | 'in-progress' | 'review' | 'completed' | 'appealed' | 'closed';
  findings: AuditFinding[];
  overallScore: number;
  passed: boolean;
  chairDid: string;
  members: string[]; // DIDs of participating members
  startedAt: number;
  completedAt?: number;
  expiresAt: number;
  raoCredentialId: string;
  appeal?: AuditAppeal;
}

export interface AuditFinding {
  criterionId: string;
  criterionName: string;
  score: number; // 0-1
  passed: boolean;
  evidence: AuditEvidence[];
  notes: string;
  severity: 'info' | 'minor' | 'major' | 'critical';
  recommendedActions: string[];
  evaluatedBy: string; // DID
  evaluatedAt: number;
}

export interface AuditEvidence {
  type: 'document' | 'measurement' | 'observation' | 'testimony' | 'onchain' | 'oracle' | 'photo' | 'video';
  uri: string;
  hash: string;
  description: string;
  timestamp: number;
  collectorDid: string;
}

export interface AuditAppeal {
  id: string;
  auditId: string;
  appellantDid: string;
  grounds: string[];
  status: 'submitted' | 'under-review' | 'upheld' | 'overturned' | 'dismissed';
  reviewPanel: string[]; // DIDs
  decision?: string;
  decidedAt?: number;
  raoCredentialId: string;
}

export interface SocialAuditReport {
  auditId: string;
  panelId: string;
  subjectType: string;
  subjectId: string;
  subjectName: string;
  period: { start: number; end: number };
  executiveSummary: string;
  overallScore: number;
  passed: boolean;
  findings: AuditFinding[];
  strengths: string[];
  weaknesses: string[];
  recommendations: AuditRecommendation[];
  chairStatement: string;
  memberSignatures: Map<string, string>; // DID -> signature
  publishedAt: number;
  public: boolean;
}

export interface AuditRecommendation {
  priority: 'immediate' | 'high' | 'medium' | 'low';
  category: string;
  description: string;
  responsibleParty: string;
  deadline: number;
  measurableOutcome: string;
}

// ============================================================================
// SOCIAL AUDIT ENGINE
// ============================================================================

export class SocialAuditEngine {
  private panels: Map<string, SocialAuditPanel> = new Map();
  private audits: Map<string, SocialAudit> = new Map();
  private reports: Map<string, SocialAuditReport> = new Map();
  private appeals: Map<string, AuditAppeal> = new Map();

  constructor(
    private discoEngine?: DisCO_CAT_Engine,
    private breadEngine?: BreadEngine,
    private oasaEngine?: OASAConstitutionEngine,
    private virginiaGateway?: VirginiaVestingGateway
  ) {}

  // ---------------------------------------------------------------------------
  // PANEL MANAGEMENT
  // ---------------------------------------------------------------------------

  createPanel(panel: Omit<SocialAuditPanel, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): SocialAuditPanel {
    const id = panel.id || `panel_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const newPanel: SocialAuditPanel = {
      ...panel,
      id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.panels.set(id, newPanel);
    return newPanel;
  }

  getPanel(id: string): SocialAuditPanel | undefined {
    return this.panels.get(id);
  }

  listPanels(): SocialAuditPanel[] {
    return Array.from(this.panels.values());
  }

  // ---------------------------------------------------------------------------
  // CDS-WEIGHTED PANEL SELECTION
  // ---------------------------------------------------------------------------

  selectPanelMembers(
    candidatePool: Map<string, { cdsScore: number; reputation: number; domain: string; lastActive: number }>,
    config: RotationSchedule
  ): SocialAuditMember[] {
    const candidates = Array.from(candidatePool.entries())
      .filter(([, data]) => 
        data.lastActive > Date.now() - 86400000 * 90 && // active in last 90 days
        data.cdsScore >= 0.4 &&
        data.reputation >= 0.3
      )
      .map(([did, data]) => ({ did, ...data }));

    if (candidates.length < config.panelSize) {
      throw new Error(`Insufficient candidates: ${candidates.length} < ${config.panelSize}`);
    }

    let selected: SocialAuditMember[] = [];

    if (config.selectionMethod === 'cds-weighted') {
      selected = this.cdsWeightedSelection(candidates, config);
    } else if (config.selectionMethod === 'lottery') {
      selected = this.lotterySelection(candidates, config);
    } else { // hybrid
      selected = this.hybridSelection(candidates, config);
    }

    // Assign roles
    const now = Date.now();
    const termLength = this.getIntervalMs(config.interval);
    
    return selected.map((member, index) => ({
      did: member.did,
      displayName: `Member ${member.did.slice(-6)}`, // Would fetch from profile
      cdsScore: member.cdsScore,
      reputation: member.reputation,
      domain: member.domain,
      role: index === 0 ? 'chair' : 'member',
      termStart: now,
      termEnd: now + termLength,
      auditsCompleted: 0,
      auditsChaired: 0,
      conflictsOfInterest: [],
      status: 'active',
    }));
  }

  private cdsWeightedSelection(candidates: Array<{ did: string; cdsScore: number; reputation: number; domain: string }>, config: RotationSchedule): Array<{ did: string; cdsScore: number; reputation: number; domain: string }> {
    // Sort by CDS score * reputation
    const scored = candidates.map(c => ({
      ...c,
      compositeScore: c.cdsScore * 0.6 + c.reputation * 0.4,
    })).sort((a, b) => b.compositeScore - a.compositeScore);

    // Ensure domain diversity
    const selected: typeof candidates = [];
    const domainsUsed = new Set<string>();

    for (const candidate of scored) {
      if (selected.length >= config.panelSize) break;
      
      const domainCount = selected.filter(s => s.domain === candidate.domain).length;
      if (domainCount < 2 || domainsUsed.size < config.panelSize / 2) {
        selected.push(candidate);
        domainsUsed.add(candidate.domain);
      }
    }

    // Fill remaining slots
    for (const candidate of scored) {
      if (selected.length >= config.panelSize) break;
      if (!selected.some(s => s.did === candidate.did)) {
        selected.push(candidate);
      }
    }

    return selected.slice(0, config.panelSize);
  }

  private lotterySelection(candidates: Array<{ did: string; cdsScore: number; reputation: number; domain: string }>, config: RotationSchedule): Array<{ did: string; cdsScore: number; reputation: number; domain: string }> {
    // Weighted lottery based on CDS score
    const weighted = candidates.flatMap(c => 
      Array(Math.ceil(c.cdsScore * 100)).fill(c)
    );
    
    const selected: typeof candidates = [];
    const used = new Set<string>();
    
    while (selected.length < config.panelSize && weighted.length > 0) {
      const idx = Math.floor(Math.random() * weighted.length);
      const candidate = weighted[idx];
      if (!used.has(candidate.did)) {
        selected.push(candidate);
        used.add(candidate.did);
      }
      weighted.splice(idx, 1);
    }

    return selected;
  }

  private hybridSelection(candidates: Array<{ did: string; cdsScore: number; reputation: number; domain: string }>, config: RotationSchedule): Array<{ did: string; cdsScore: number; reputation: number; domain: string }> {
    // 70% CDS-weighted, 30% lottery
    const weightedCount = Math.floor(config.panelSize * 0.7);
    const lotteryCount = config.panelSize - weightedCount;

    const weighted = this.cdsWeightedSelection(candidates, { ...config, panelSize: weightedCount });
    const remaining = candidates.filter(c => !weighted.some(w => w.did === c.did));
    const lottery = this.lotterySelection(remaining, { ...config, panelSize: lotteryCount });

    return [...weighted, ...lottery];
  }

  private getIntervalMs(interval: RotationSchedule['interval']): number {
    switch (interval) {
      case 'monthly': return 86400000 * 30;
      case 'quarterly': return 86400000 * 90;
      case 'semi-annual': return 86400000 * 180;
      case 'annual': return 86400000 * 365;
    }
  }

  // ---------------------------------------------------------------------------
  // PANEL ROTATION
  // ---------------------------------------------------------------------------

  rotatePanel(panelId: string, candidatePool: Map<string, { cdsScore: number; reputation: number; domain: string; lastActive: number }>): SocialAuditMember[] {
    const panel = this.panels.get(panelId);
    if (!panel) throw new Error('Panel not found');

    // Check cooling period for outgoing members
    const now = Date.now();
    const eligibleOutgoing = panel.members.filter(m => 
      m.status === 'active' && 
      now - m.termEnd >= panel.rotationSchedule.coolingPeriod &&
      m.auditsCompleted < panel.rotationSchedule.maxConsecutiveTerms * 3 // rough audit count per term
    );

    // Keep eligible members, rotate out others
    const continuing = panel.members.filter(m => 
      m.status === 'active' && 
      (now - m.termEnd < panel.rotationSchedule.coolingPeriod || 
       m.auditsCompleted < panel.rotationSchedule.maxConsecutiveTerms * 3)
    );

    const slotsToFill = panel.rotationSchedule.panelSize - continuing.length;
    
    if (slotsToFill > 0) {
      const newMembers = this.selectPanelMembers(candidatePool, {
        ...panel.rotationSchedule,
        panelSize: slotsToFill,
      });
      
      panel.members = [...continuing, ...newMembers];
    } else {
      panel.members = continuing;
    }

    // Rotate chair if enabled
    if (panel.rotationSchedule.chairRotation && panel.members.length > 1) {
      const currentChairIdx = panel.members.findIndex(m => m.role === 'chair');
      const nextChairIdx = (currentChairIdx + 1) % panel.members.length;
      
      panel.members.forEach((m, i) => {
        m.role = i === nextChairIdx ? 'chair' : m.role === 'chair' ? 'member' : m.role;
      });
    }

    panel.rotationSchedule.nextRotation = now + this.getIntervalMs(panel.rotationSchedule.interval);
    panel.updatedAt = now;

    return panel.members;
  }

  // ---------------------------------------------------------------------------
  // AUDIT SCHEDULING & EXECUTION
  // ---------------------------------------------------------------------------

  scheduleAudit(audit: Omit<SocialAudit, 'id' | 'status' | 'findings' | 'overallScore' | 'passed' | 'startedAt' | 'completedAt' | 'raoCredentialId' | 'appeal'> & { id?: string }): SocialAudit {
    const panel = this.panels.get(audit.panelId);
    if (!panel) throw new Error('Panel not found');

    const id = audit.id || `audit_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const chair = panel.members.find(m => m.role === 'chair');
    if (!chair) throw new Error('No chair assigned');

    const newAudit: SocialAudit = {
      ...audit,
      id,
      status: 'scheduled',
      findings: [],
      overallScore: 0,
      passed: false,
      chairDid: chair.did,
      members: panel.members.filter(m => m.status === 'active').map(m => m.did),
      startedAt: 0,
      expiresAt: Date.now() + 86400000 * 30, // 30 days to complete
      raoCredentialId: `rao_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    };

    this.audits.set(id, newAudit);
    return newAudit;
  }

  startAudit(auditId: string): boolean {
    const audit = this.audits.get(auditId);
    if (!audit || audit.status !== 'scheduled') return false;

    audit.status = 'in-progress';
    audit.startedAt = Date.now();
    return true;
  }

  async evaluateCriterion(auditId: string, criterion: AuditCriterion, evaluatorDid: string, evidence: AuditEvidence[]): Promise<AuditFinding> {
    const audit = this.audits.get(auditId);
    if (!audit) throw new Error('Audit not found');

    // Automated evaluation based on criterion type
    let score = 0;
    let passed = false;
    let severity: AuditFinding['severity'] = 'info';
    const notes: string[] = [];

    switch (criterion.id) {
      // CARE CRITERIA
      case 'care-flow-active':
        if (this.discoEngine) {
          const flows = this.discoEngine.getAllFlowsSummary();
          const careFlow = flows.care;
          score = careFlow.verifiedCount > 0 ? Math.min(1, careFlow.totalValue / 1000) : 0;
          passed = score >= 0.3;
          severity = score < 0.2 ? 'critical' : score < 0.5 ? 'major' : 'minor';
          notes.push(`Care flow: ${careFlow.count} contributions, ${careFlow.verifiedCount} verified, ${careFlow.totalValue} ZNU value`);
        }
        break;

      case 'care-recognized-in-governance':
        score = this.checkCareInGovernance(audit.subjectId);
        passed = score >= 0.5;
        severity = score < 0.3 ? 'major' : 'minor';
        notes.push(`Care recognition in governance: ${(score*100).toFixed(0)}%`);
        break;

      // GOVERNANCE CRITERIA
      case 'consent-participation':
        if (this.discoEngine) {
          const cat = this.discoEngine.getCAT();
          const recentDecisions = cat.assembly.consentDecisions.filter(d => 
            d.integratedAt > Date.now() - 86400000 * 90
          );
          const participation = recentDecisions.length > 0
            ? recentDecisions.reduce((sum, d) => sum + d.consents.size, 0) / 
              (recentDecisions.length * (this.discoEngine.getAllMembers().length || 1))
            : 0;
          score = Math.min(1, participation * 2); // Target 50% participation
          passed = score >= 0.7;
          severity = score < 0.4 ? 'critical' : score < 0.7 ? 'major' : 'minor';
          notes.push(`Consent participation: ${(participation*100).toFixed(0)}%`);
        }
        break;

      case 'no-stale-blocks':
        if (this.discoEngine) {
          const cat = this.discoEngine.getCAT();
          const staleBlocks = cat.assembly.consentDecisions.filter(d => 
            d.status === 'blocked' && Date.now() - d.integratedAt > 86400000 * 30
          ).length;
          score = staleBlocks === 0 ? 1 : Math.max(0, 1 - staleBlocks * 0.2);
          passed = staleBlocks === 0;
          severity = staleBlocks > 2 ? 'critical' : staleBlocks > 0 ? 'major' : 'info';
          notes.push(`Stale blocks (>30 days): ${staleBlocks}`);
        }
        break;

      case 'transparency-score':
        if (this.discoEngine) {
          score = this.discoEngine.getTransparencyScore();
          passed = score >= 0.8;
          severity = score < 0.5 ? 'critical' : score < 0.8 ? 'major' : 'minor';
          notes.push(`Transparency score: ${(score*100).toFixed(0)}%`);
        }
        break;

      // ECOLOGICAL CRITERIA
      case 'oasa-principles-compliance':
        if (this.oasaEngine && audit.subjectType === 'village') {
          const village = this.oasaEngine.getVillage(audit.subjectId);
          if (village) {
            score = village.oasaPrinciplesCompliance;
            passed = score >= 0.7;
            severity = score < 0.4 ? 'critical' : score < 0.7 ? 'major' : 'minor';
            notes.push(`OASA compliance: ${(score*100).toFixed(0)}%`);
          }
        }
        break;

      case 'regenerative-improvement':
        score = await this.measureRegenerativeImprovement(audit.subjectId, audit.subjectType);
        passed = score >= 0.5;
        severity = score < 0.3 ? 'critical' : score < 0.5 ? 'major' : 'minor';
        notes.push(`Regenerative improvement: ${(score*100).toFixed(0)}%`);
        break;

      // ECONOMIC CRITERIA
      case 'tq-production-verified':
        if (this.virginiaGateway && audit.subjectType === 'n3-node') {
          const weight = this.virginiaGateway.computeN3Weight();
          score = Math.min(1, weight / 2.0); // Target weight 2.0
          passed = score >= 0.6;
          severity = score < 0.3 ? 'critical' : score < 0.6 ? 'major' : 'minor';
          notes.push(`N3 dynamic weight: ${weight.toFixed(2)}`);
        }
        break;

      case 'vesting-compliance':
        if (this.virginiaGateway && audit.subjectType === 'n3-node') {
          const canClaim = this.virginiaGateway.canClaimVesting();
          score = canClaim ? 1 : 0.5;
          passed = canClaim;
          severity = canClaim ? 'info' : 'major';
          notes.push(`Vesting claim eligible: ${canClaim}`);
        }
        break;

      // FEDERATION CRITERIA
      case 'federation-treaty-active':
        score = await this.checkFederationTreaty(audit.subjectId);
        passed = score >= 0.75;
        severity = score < 0.5 ? 'critical' : score < 0.75 ? 'major' : 'minor';
        notes.push(`Federation treaty compliance: ${(score*100).toFixed(0)}%`);
        break;

      case 'rao-sync-active':
        score = await this.checkRAOSync(audit.subjectId);
        passed = score >= 0.8;
        severity = score < 0.6 ? 'critical' : score < 0.8 ? 'major' : 'minor';
        notes.push(`RAO sync: ${(score*100).toFixed(0)}%`);
        break;

      // TRANSPARENCY CRITERIA
      case 'valueflows-complete':
        score = await this.checkValueFlowsCompleteness(audit.subjectId);
        passed = score >= 0.8;
        severity = score < 0.5 ? 'critical' : score < 0.8 ? 'major' : 'minor';
        notes.push(`ValueFlows completeness: ${(score*100).toFixed(0)}%`);
        break;

      case 'audit-trail-current':
        if (this.discoEngine) {
          const cat = this.discoEngine.getCAT();
          const recentAudits = cat.transparency.auditTrail.filter(a => a.timestamp > Date.now() - 86400000 * 7).length;
          score = Math.min(1, recentAudits / 10); // Expect ~10 audit entries/week
          passed = score >= 0.7;
          severity = score < 0.3 ? 'major' : 'minor';
          notes.push(`Recent audit entries (7 days): ${recentAudits}`);
        }
        break;

      default:
        score = 0.5; // Default neutral
        passed = true;
    }

    const finding: AuditFinding = {
      criterionId: criterion.id,
      criterionName: criterion.name,
      score,
      passed,
      evidence,
      notes: notes.join('; '),
      severity,
      recommendedActions: passed ? [] : this.generateRecommendations(criterion, score),
      evaluatedBy: evaluatorDid,
      evaluatedAt: Date.now(),
    };

    return finding;
  }

  private checkCareInGovernance(subjectId: string): number {
    // Check if care flow contributions affect governance weight
    // Simplified - would integrate with Virginia N3 weight calculation
    return 0.6; // placeholder
  }

  private async measureRegenerativeImprovement(subjectId: string, subjectType: string): Promise<number> {
    // Would compare current OASA metrics to baseline
    // Simplified
    return 0.55;
  }

  private async checkFederationTreaty(subjectId: string): Promise<number> {
    // Would check DHO federation status
    return 0.8;
  }

  private async checkRAOSync(subjectId: string): Promise<number> {
    // Would check RAO credential sync status
    return 0.9;
  }

  private async checkValueFlowsCompleteness(subjectId: string): Promise<number> {
    // Would check ValueFlows coverage
    return 0.85;
  }

  private generateRecommendations(criterion: AuditCriterion, score: number): string[] {
    const gap = 1 - score;
    const recommendations: string[] = [];

    if (criterion.category === 'care') {
      recommendations.push(`Establish care flow tracking (current gap: ${(gap*100).toFixed(0)}%)`);
      recommendations.push('Integrate care contributions into N1 weight calculation');
    } else if (criterion.category === 'governance') {
      recommendations.push(`Increase consent decision participation (target: 70%)`);
      recommendations.push('Resolve stale blocks within 30 days');
      recommendations.push('Publish all governance records on ValueFlows');
    } else if (criterion.category === 'ecological') {
      recommendations.push(`Improve OASA principles compliance to ≥70%`);
      recommendations.push('Set measurable targets for all 7 principles');
      recommendations.push('Establish quarterly ecological monitoring');
    } else if (criterion.category === 'economic') {
      recommendations.push('Verify TQ production on-ledger');
      recommendations.push('Complete vesting milestones per schedule');
    } else if (criterion.category === 'federation') {
      recommendations.push('Execute federation treaty with RAO sync');
      recommendations.push('Activate shared treasury with multisig');
    } else if (criterion.category === 'transparency') {
      recommendations.push('Complete ValueFlows recording for all flows');
      recommendations.push('Maintain weekly audit trail entries');
    }

    return recommendations;
  }

  // ---------------------------------------------------------------------------
  // AUDIT COMPLETION
  // ---------------------------------------------------------------------------

  completeAudit(auditId: string, findings: AuditFinding[]): SocialAuditReport | null {
    const audit = this.audits.get(auditId);
    if (!audit || audit.status !== 'in-progress') return null;

    // Calculate overall score
    const panel = this.panels.get(audit.panelId);
    if (!panel) return null;

    let weightedScore = 0;
    let totalWeight = 0;

    for (const finding of findings) {
      const criterion = panel.scope.criteria.find(c => c.id === finding.criterionId);
      if (criterion) {
        weightedScore += finding.score * criterion.weight;
        totalWeight += criterion.weight;
      }
    }

    const overallScore = totalWeight > 0 ? weightedScore / totalWeight : 0;
    const passed = overallScore >= 0.7; // Default panel threshold

    audit.findings = findings;
    audit.overallScore = overallScore;
    audit.passed = passed;
    audit.status = 'completed';
    audit.completedAt = Date.now();

    // Generate report
    const report = this.generateReport(audit);
    this.reports.set(report.auditId, report);

    return report;
  }

  private generateReport(audit: SocialAudit): SocialAuditReport {
    const panel = this.panels.get(audit.panelId)!;
    const chair = panel.members.find(m => m.did === audit.chairDid);

    const strengths = audit.findings
      .filter(f => f.passed && f.score > 0.8)
      .map(f => f.criterionName);

    const weaknesses = audit.findings
      .filter(f => !f.passed || f.score < 0.6)
      .map(f => f.criterionName);

    const recommendations: AuditRecommendation[] = [];
    for (const finding of audit.findings) {
      if (!finding.passed) {
        for (const action of finding.recommendedActions) {
          recommendations.push({
            priority: finding.severity === 'critical' ? 'immediate' : finding.severity === 'major' ? 'high' : 'medium',
            category: finding.criterionName,
            description: action,
            responsibleParty: audit.subjectId,
            deadline: Date.now() + 86400000 * (finding.severity === 'critical' ? 30 : finding.severity === 'major' ? 90 : 180),
            measurableOutcome: `Pass ${finding.criterionName} criterion on next audit`,
          });
        }
      }
    }

    return {
      auditId: audit.id,
      panelId: audit.panelId,
      subjectType: audit.subjectType,
      subjectId: audit.subjectId,
      subjectName: audit.subjectName,
      period: { start: audit.startedAt, end: audit.completedAt! },
      executiveSummary: `${audit.subjectName} scored ${(audit.overallScore*100).toFixed(0)}% on social audit. ${audit.passed ? 'PASSED' : 'FAILED'}. ${audit.findings.filter(f => f.passed).length}/${audit.findings.length} criteria met.`,
      overallScore: audit.overallScore,
      passed: audit.passed,
      findings: audit.findings,
      strengths,
      weaknesses,
      recommendations,
      chairStatement: `As chair of ${panel.name}, I certify this audit was conducted per OASA Constitution Article 9 (Future Generations) and DisCO Principle 4 (Transparency).`,
      memberSignatures: new Map(),
      publishedAt: Date.now(),
      public: true,
    };
  }

  // ---------------------------------------------------------------------------
  // APPEAL PROCESS
  // ---------------------------------------------------------------------------

  submitAppeal(appeal: Omit<AuditAppeal, 'id' | 'status' | 'reviewPanel' | 'decidedAt'> & { id?: string }): AuditAppeal {
    const audit = this.audits.get(appeal.auditId);
    if (!audit || audit.status !== 'completed') throw new Error('Audit not completed');

    const panel = this.panels.get(audit.panelId);
    if (!panel) throw new Error('Panel not found');

    // Select review panel (different from original, higher CDS)
    const reviewPanel = panel.members
      .filter(m => !audit.members.includes(m.did) && m.cdsScore > 0.7)
      .slice(0, 3)
      .map(m => m.did);

    const newAppeal: AuditAppeal = {
      ...appeal,
      id: appeal.id || `appeal_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      status: 'submitted',
      reviewPanel,
    };

    this.appeals.set(newAppeal.id, newAppeal);
    audit.status = 'appealed';
    audit.appeal = newAppeal;

    return newAppeal;
  }

  decideAppeal(appealId: string, decision: 'upheld' | 'overturned' | 'dismissed', reviewerDid: string, reasoning: string): boolean {
    const appeal = this.appeals.get(appealId);
    if (!appeal || appeal.status !== 'under-review') return false;
    if (!appeal.reviewPanel.includes(reviewerDid)) return false;

    appeal.status = decision;
    appeal.decision = reasoning;
    appeal.decidedAt = Date.now();

    const audit = this.audits.get(appeal.auditId);
    if (audit) {
      if (decision === 'overturned') {
        audit.passed = !audit.passed;
        audit.status = 'review';
      } else {
        audit.status = 'closed';
      }
    }

    return true;
  }

  // ---------------------------------------------------------------------------
  // PRESET PANELS FOR ZEITNUS
  // ---------------------------------------------------------------------------

  createVillageAuditPanel(): SocialAuditPanel {
    return this.createPanel({
      id: 'village-audit-panel',
      name: 'Village Regenerative Audit Panel',
      purpose: 'Audit village compliance with OASA 7 Principles, DisCO CAT, and Virginia N3 integration',
      members: [],
      rotationSchedule: {
        interval: 'quarterly',
        maxConsecutiveTerms: 2,
        coolingPeriod: 86400000 * 90, // 90 days
        selectionMethod: 'hybrid',
        panelSize: 5,
        chairRotation: true,
        nextRotation: Date.now() + 86400000 * 90,
      },
      scope: {
        domains: ['governance', 'ecosystem', 'tech', 'care'],
        criteria: [
          { id: 'care-flow-active', name: 'Active Care Flow', description: 'Care contributions tracked and verified', category: 'care', weight: 0.15, measurement: 'score', required: true, evaluatorRole: 'automated' },
          { id: 'care-recognized-in-governance', name: 'Care in Governance', description: 'Care flow affects voting weight', category: 'care', weight: 0.10, measurement: 'score', required: true, evaluatorRole: 'panel' },
          { id: 'consent-participation', name: 'Consent Participation', description: 'Member participation in consent decisions', category: 'governance', weight: 0.15, measurement: 'score', required: true, evaluatorRole: 'automated' },
          { id: 'no-stale-blocks', name: 'No Stale Blocks', description: 'No consent blocks older than 30 days', category: 'governance', weight: 0.10, measurement: 'boolean', required: true, evaluatorRole: 'automated' },
          { id: 'transparency-score', name: 'Transparency Score', description: 'DisCO CAT transparency ≥80%', category: 'transparency', weight: 0.10, measurement: 'score', required: true, evaluatorRole: 'automated' },
          { id: 'oasa-principles-compliance', name: 'OASA Principles', description: '7 Principles compliance ≥70%', category: 'ecological', weight: 0.20, measurement: 'score', required: true, evaluatorRole: 'panel' },
          { id: 'regenerative-improvement', name: 'Regenerative Improvement', description: 'Measured improvement vs baseline', category: 'ecological', weight: 0.10, measurement: 'score', required: true, evaluatorRole: 'expert' },
          { id: 'tq-production-verified', name: 'TQ Verified', description: 'TQ production on-ledger', category: 'economic', weight: 0.05, measurement: 'score', required: false, evaluatorRole: 'automated' },
          { id: 'audit-trail-current', name: 'Current Audit Trail', description: 'Weekly audit entries', category: 'transparency', weight: 0.05, measurement: 'score', required: false, evaluatorRole: 'automated' },
        ],
        frequency: 'scheduled',
        triggerEvents: ['quarterly-review', 'phase-transition', 'fund-application'],
      },
      status: 'forming',
    });
  }

  createDHOAuditPanel(): SocialAuditPanel {
    return this.createPanel({
      id: 'dho-audit-panel',
      name: 'DHO Federation Audit Panel',
      purpose: 'Audit DHO federation health, treaty compliance, and shared treasury operations',
      members: [],
      rotationSchedule: {
        interval: 'semi-annual',
        maxConsecutiveTerms: 3,
        coolingPeriod: 86400000 * 180,
        selectionMethod: 'cds-weighted',
        panelSize: 7,
        chairRotation: true,
        nextRotation: Date.now() + 86400000 * 180,
      },
      scope: {
        domains: ['governance', 'ecosystem', 'federation'],
        criteria: [
          { id: 'federation-treaty-active', name: 'Active Federation Treaty', description: 'Treaty signed, RAO sync, shared treasury', category: 'federation', weight: 0.30, measurement: 'score', required: true, evaluatorRole: 'panel' },
          { id: 'rao-sync-active', name: 'RAO Sync', description: 'RAO credentials synchronized across federation', category: 'federation', weight: 0.20, measurement: 'score', required: true, evaluatorRole: 'automated' },
          { id: 'governance-health', name: 'Cross-DHO Governance', description: 'Consent decisions across federated DHOs', category: 'governance', weight: 0.20, measurement: 'score', required: true, evaluatorRole: 'panel' },
          { id: 'care-flow-active', name: 'Care Flow', description: 'Care contributions in federation', category: 'care', weight: 0.15, measurement: 'score', required: false, evaluatorRole: 'automated' },
          { id: 'transparency-score', name: 'Federation Transparency', description: 'Shared audit trail', category: 'transparency', weight: 0.15, measurement: 'score', required: true, evaluatorRole: 'automated' },
        ],
        frequency: 'scheduled',
        triggerEvents: ['treaty-renewal', 'treasury-audit', 'dispute'],
      },
      status: 'forming',
    });
  }

  createGranAlianzaAuditPanel(): SocialAuditPanel {
    return this.createPanel({
      id: 'gran-alianza-audit-panel',
      name: 'Gran Alianza 7 Holones Audit Panel',
      purpose: 'Comprehensive audit of 7 holones federation: resource sharing, governance alignment, intergenerational justice',
      members: [],
      rotationSchedule: {
        interval: 'annual',
        maxConsecutiveTerms: 1,
        coolingPeriod: 86400000 * 365,
        selectionMethod: 'cds-weighted',
        panelSize: 9,
        chairRotation: true,
        nextRotation: Date.now() + 86400000 * 365,
      },
      scope: {
        domains: ['governance', 'ecosystem', 'federation', 'care', 'tech'],
        criteria: [
          { id: 'federation-treaty-active', name: '7 Holones Treaty', description: 'All 7 holones federated with treaty', category: 'federation', weight: 0.25, measurement: 'boolean', required: true, evaluatorRole: 'panel' },
          { id: 'rao-sync-active', name: 'Global RAO Sync', description: 'RAO synchronized across all holones', category: 'federation', weight: 0.15, measurement: 'score', required: true, evaluatorRole: 'automated' },
          { id: 'oasa-principles-compliance', name: 'OASA Compliance', description: 'All holones ≥70% compliance', category: 'ecological', weight: 0.20, measurement: 'score', required: true, evaluatorRole: 'expert' },
          { id: 'care-flow-active', name: 'Cross-Holon Care', description: 'Care flow between holones', category: 'care', weight: 0.10, measurement: 'score', required: false, evaluatorRole: 'panel' },
          { id: 'regenerative-improvement', name: 'Planetary Regeneration', description: 'Aggregate 7-gen impact positive', category: 'ecological', weight: 0.15, measurement: 'score', required: true, evaluatorRole: 'expert' },
          { id: 'governance-health', name: 'Federated Governance', description: 'Holographic consensus functional', category: 'governance', weight: 0.15, measurement: 'score', required: true, evaluatorRole: 'panel' },
        ],
        frequency: 'scheduled',
        triggerEvents: ['annual-assembly', 'treaty-amendment', 'guardian-veto'],
      },
      status: 'forming',
    });
  }

  // ---------------------------------------------------------------------------
  // GETTERS
  // ---------------------------------------------------------------------------

  getAudit(id: string): SocialAudit | undefined {
    return this.audits.get(id);
  }

  getAuditsForSubject(subjectType: SocialAudit['subjectType'], subjectId: string): SocialAudit[] {
    return Array.from(this.audits.values()).filter(a => a.subjectType === subjectType && a.subjectId === subjectId);
  }

  getReport(id: string): SocialAuditReport | undefined {
    return this.reports.get(id);
  }

  getAppeal(id: string): AuditAppeal | undefined {
    return this.appeals.get(appealId);
  }
}

// ============================================================================
// FACTORY
// ============================================================================

export function createSocialAuditEngine(
  discoEngine?: DisCO_CAT_Engine,
  breadEngine?: BreadEngine,
  oasaEngine?: OASAConstitutionEngine,
  virginiaGateway?: VirginiaVestingGateway
): SocialAuditEngine {
  return new SocialAuditEngine(discoEngine, breadEngine, oasaEngine, virginiaGateway);
}

// ============================================================================
// EXPORTS
// ============================================================================

export const socialAuditEngine = new SocialAuditEngine();
export default socialAuditEngine;