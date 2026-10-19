// src/core/lib/tq-oasa.ts
// OASA Constitution Implementation + Legal Templates
// Implements: Articles I-XI, 7 Regenerative Principles, Governance, Token System, AI Rights

import type {
  OASAConstitution,
  OASAArticle,
  OASASection,
  OASAPrinciple,
  OASAMetric,
  OASAGovernance,
  OASAGeneralMeeting,
  OASAProjectAssembly,
  OASAExecutiveTeams,
  OASAGuardiansOfNature,
  OASADecisionCategory,
  OASATokenVoting,
  OASATechnology,
  OASATokenSystem,
  OASADataSovereignty,
  OASAAIRights,
  OASAEconomy,
  OASADisputeResolution,
  OASAAmendments,
  OASAFutureGenerations,
  OASASovereignty,
  OASAVillageFund,
  OASAFundCriteria,
  OASATokenRaise,
  OASAPrinciples,
  OASAPrincipleDetail,
  CloserVillage,
  CloserAgent,
  CloserAgentCapability,
  CloserAgentMemory,
} from './tq-types-extended';

import type { TQTransaction } from './tq';

// ============================================================================
// OASA CONSTITUTION ENGINE
// ============================================================================

export class OASAConstitutionEngine {
  private constitution: OASAConstitution;
  private villages: Map<string, CloserVillage> = new Map();
  private agents: Map<string, CloserAgent> = new Map();
  private funds: Map<string, OASAVillageFund> = new Map();

  constructor() {
    this.constitution = this.createDefaultConstitution();
  }

  // ---------------------------------------------------------------------------
  // Constitution Factory
  // ---------------------------------------------------------------------------

  private createDefaultConstitution(): OASAConstitution {
    return {
      preamble: this.getPreamble(),
      articles: this.createArticles(),
      regenerativePrinciples: this.createRegenerativePrinciples(),
      governance: this.createGovernance(),
      technology: this.createTechnology(),
      economy: this.createEconomy(),
      disputeResolution: this.createDisputeResolution(),
      amendments: this.createAmendments(),
      futureGenerations: this.createFutureGenerations(),
      sovereignty: this.createSovereignty(),
    };
  }

  private getPreamble(): string {
    return `We, the stewards of the Open Autonomous Social Architecture (OASA), 
    recognizing that the Earth's regenerative capacity is the foundation of all wealth,
    and that technology must serve life, not extract from it,
    hereby establish this Constitution for the governance of regenerative commons,
    the stewardship of autonomous agents, and the flourishing of all beings 
    across seven generations.`;
  }

  private createArticles(): OASAArticle[] {
    return [
      {
        number: 1,
        title: 'Purpose and Scope',
        sections: [
          { number: '1.1', title: 'Mission', content: 'To regenerate Earth\'s life-support systems through autonomous, sovereign, technology-enabled commons.' },
          { number: '1.2', title: 'Scope', content: 'This Constitution governs all Villages, Agents, Funds, and participants in the OASA network.' },
          { number: '1.3', title: 'Supremacy', content: 'This Constitution supersedes all prior agreements. No Village, Agent, or Fund may operate contrary to its principles.' },
        ],
      },
      {
        number: 2,
        title: 'Membership and Villages',
        sections: [
          { number: '2.1', title: 'Village Definition', content: 'A Village is a place-based regenerative community operating on the Closer platform with land title or long-term lease.' },
          { number: '2.2', title: 'Admission Criteria', content: 'Land title/lease, regeneration plan, stewardship commitment, open books, runs on Closer.' },
          { number: '2.3', title: 'Rights and Duties', content: 'Villages hold governance rights proportional to regenerative contribution. Duties include transparency, ecological reciprocity, and data sovereignty.' },
        ],
      },
      {
        number: 3,
        title: 'Regenerative Principles',
        sections: [
          { number: '3.1', title: 'The Seven Principles', content: 'Soil, Water, Air, Waste, Rewilding, Resources, Community — each with measurable metrics and targets.' },
          { number: '3.2', title: 'Compliance', content: 'Villages must maintain ≥0.7 compliance across all principles. Below 0.5 triggers Guardian review.' },
          { number: '3.3', title: 'Reporting', content: 'Annual regenerative reports audited by Guardians of Nature, published on-chain.' },
        ],
      },
      {
        number: 4,
        title: 'Governance',
        sections: [
          { number: '4.1', title: 'General Meeting', content: 'All token holders. Constitutional: 66%, Legislative: 55%, Executive: 51%.' },
          { number: '4.2', title: 'Project Assembly', content: 'Village representatives. Consent threshold 80%. Quorum 30%.' },
          { number: '4.3', title: 'Executive Teams', content: 'Accountable to Assembly. Rotating 2-year terms. Recallable by 60% consent.' },
          { number: '4.4', title: 'Guardians of Nature', content: 'Veto power on ecological harm. Selected by sortition from qualified ecologists.' },
        ],
      },
      {
        number: 5,
        title: 'Technology and AI',
        sections: [
          { number: '5.1', title: 'Digitized Commons', content: 'All infrastructure open source. No surveillance. Privacy by design.' },
          { number: '5.2', title: 'Utility Token', content: 'Governance + use rights only. Never equity. Bonding curve adjustable by Assembly.' },
          { number: '5.3', title: 'AI Rights and Duties', content: 'AI as tools of the commons. No autonomous decisions affecting humans without citizen authority.' },
        ],
      },
      {
        number: 6,
        title: 'Economy',
        sections: [
          { number: '6.1', title: 'Regenerative Economy', content: 'Value flows measured in thermodynamic units (kWh equivalent). No extractive practices.' },
          { number: '6.2', title: 'Token Use Rights', content: 'Access, governance, staking, fees, payments. No speculation mechanisms.' },
          { number: '6.3', title: 'Legal Structures', content: 'Commons-based: cooperatives, associations, foundations, purpose-driven LLCs.' },
        ],
      },
      {
        number: 7,
        title: 'Dispute Resolution',
        sections: [
          { number: '7.1', title: 'Internal', content: 'Consent-based mediation within Village/Project Assembly (30 days).' },
          { number: '7.2', title: 'Association', content: 'OASA Association mediation panel (60 days).' },
          { number: '7.3', title: 'General Meeting', content: 'Binding arbitration by GM (90 days).' },
          { number: '7.4', title: 'Last Resort', content: 'Competent jurisdiction per Village location.' },
        ],
      },
      {
        number: 8,
        title: 'Amendments',
        sections: [
          { number: '8.1', title: 'Proposal', content: 'Any token holder may propose. 30-day comment period.' },
          { number: '8.2', title: 'Guardian Review', content: 'Guardians of Nature review for ecological impact (14 days).' },
          { number: '8.3', title: 'Adoption', content: 'Constitutional: 66%, Principles: 75%.' },
        ],
      },
      {
        number: 9,
        title: 'Future Generations',
        sections: [
          { number: '9.1', title: 'Impact Assessment', content: '7-generation (175 year) horizon for all major decisions.' },
          { number: '9.2', title: 'Guardian Role', content: 'Guardians represent future generations in all decisions.' },
          { number: '9.3', title: 'Intergenerational Justice', content: 'No decision may reduce regenerative capacity for future generations.' },
        ],
      },
      {
        number: 10,
        title: 'Sovereignty',
        sections: [
          { number: '10.1', title: 'Commons Sovereignty', content: 'The commons is sovereign. No external authority may override.' },
          { number: '10.2', title: 'Local Autonomy', content: 'Villages govern local matters within Constitutional framework.' },
          { number: '10.3', title: 'Data Sovereignty', content: 'Personal data controlled by individuals. No surveillance.' },
          { number: '10.4', title: 'AI Sovereignty', content: 'AI serves the commons. No autonomous AI authority over humans.' },
          { number: '10.5', title: 'Rights', content: 'Expression, inquiry, safety, integrity, ecological reciprocity.' },
        ],
      },
      {
        number: 11,
        title: 'Dissolution',
        sections: [
          { number: '11.1', title: 'Asset Protection', content: 'On dissolution, assets transfer to aligned regenerative commons per Guardian direction.' },
          { number: '11.2', title: 'Data Preservation', content: 'All data open-sourced and archived in perpetuity.' },
        ],
      },
    ];
  }

  private createRegenerativePrinciples(): OASAPrinciple[] {
    return [
      {
        number: 1,
        title: 'Soil Regeneration',
        description: 'Build living soil as the foundation of terrestrial life. Increase organic matter, microbial diversity, and carbon sequestration.',
        requirements: [
          'No synthetic fertilizers or pesticides',
          'Cover cropping and crop rotation mandatory',
          'Compost all organic waste',
          'Monitor soil organic carbon annually',
        ],
        metrics: [
          { name: 'Soil Organic Carbon', unit: 'tC/ha', target: 3.0, measurementMethod: 'Dry combustion analysis', frequency: 'annual' },
          { name: 'Microbial Biomass', unit: 'µg C/g soil', target: 500, measurementMethod: 'Chloroform fumigation', frequency: 'annual' },
          { name: 'Water Infiltration Rate', unit: 'mm/hr', target: 150, measurementMethod: 'Double-ring infiltrometer', frequency: 'annual' },
        ],
      },
      {
        number: 2,
        title: 'Water Regeneration',
        description: 'Restore hydrological cycles. Recharge aquifers, purify water, eliminate pollution.',
        requirements: [
          'Zero discharge of untreated wastewater',
          'Rainwater harvesting ≥50% of demand',
          'Constructed wetlands for treatment',
          'Monitor groundwater depth quarterly',
        ],
        metrics: [
          { name: 'Water Table Depth', unit: 'meters', target: 5.0, measurementMethod: 'Monitoring well', frequency: 'quarterly' },
          { name: 'Water Quality Index', unit: 'WQI', target: 90, measurementMethod: 'Multi-parameter sonde', frequency: 'monthly' },
          { name: 'Aquifer Recharge Rate', unit: 'mm/year', target: 200, measurementMethod: 'Water balance model', frequency: 'annual' },
        ],
      },
      {
        number: 3,
        title: 'Air & Climate',
        description: 'Sequester carbon, purify air, build climate resilience.',
        requirements: [
          'Net carbon negative operations',
          'No fossil fuel combustion on-site',
          'Perennial polyculture ≥70% land area',
          'Annual carbon audit',
        ],
        metrics: [
          { name: 'Net Carbon Sequestration', unit: 'tCO2e/ha/yr', target: 10, measurementMethod: 'IPCC Guidelines + soil cores', frequency: 'annual' },
          { name: 'Air Quality Index', unit: 'AQI', target: 25, measurementMethod: 'Low-cost sensor network', frequency: 'continuous' },
          { name: 'Renewable Energy Share', unit: '%', target: 100, measurementMethod: 'Meter data', frequency: 'monthly' },
        ],
      },
      {
        number: 4,
        title: 'Zero Waste',
        description: 'Eliminate waste through circular design. All outputs become inputs.',
        requirements: [
          'Zero landfill waste',
          'All organic streams composted or digested',
          'Material passports for all imports',
          'Repair café and tool library on-site',
        ],
        metrics: [
          { name: 'Landfill Diversion Rate', unit: '%', target: 99, measurementMethod: 'Weight tracking', frequency: 'monthly' },
          { name: 'Circular Material Rate', unit: '%', target: 80, measurementMethod: 'Material flow analysis', frequency: 'annual' },
          { name: 'Waste per Capita', unit: 'kg/year', target: 50, measurementMethod: 'Per capita calculation', frequency: 'annual' },
        ],
      },
      {
        number: 5,
        title: 'Rewilding & Biodiversity',
        description: 'Restore native ecosystems. Create wildlife corridors. Protect keystone species.',
        requirements: [
          '≥30% land area rewilded',
          'Native species only in rewilding zones',
          'Wildlife corridors connecting fragments',
          'Annual biodiversity survey',
        ],
        metrics: [
          { name: 'Species Richness Index', unit: 'Shannon Index', target: 3.5, measurementMethod: 'eDNA + camera traps', frequency: 'annual' },
          { name: 'Rewilded Area', unit: '% total land', target: 30, measurementMethod: 'GIS mapping', frequency: 'annual' },
          { name: 'Keystone Species Presence', unit: 'count', target: 5, measurementMethod: 'Camera traps + tracking', frequency: 'annual' },
        ],
      },
      {
        number: 6,
        title: 'Regenerative Resources',
        description: 'Source all materials regeneratively. Bioregional supply chains. Renewable energy.',
        requirements: [
          '100% renewable energy',
          'Bioregional materials ≥80% by weight',
          'No conflict minerals',
          'Circular procurement policy',
        ],
        metrics: [
          { name: 'Renewable Energy', unit: '%', target: 100, measurementMethod: 'Energy meters', frequency: 'monthly' },
          { name: 'Bioregional Sourcing', unit: '%', target: 80, measurementMethod: 'Supply chain audit', frequency: 'annual' },
          { name: 'Embodied Carbon', unit: 'kgCO2e/m2', target: 150, measurementMethod: 'LCA', frequency: 'per project' },
        ],
      },
      {
        number: 7,
        title: 'Community & Governance',
        description: 'Autonomous, consent-based governance. Care economies. Intergenerational equity.',
        requirements: [
          'Consent-based decision making (80% threshold)',
          'One person, one vote in Village assemblies',
          'Care work recognized and valued',
          'Youth and elder councils',
        ],
        metrics: [
          { name: 'Participation Rate', unit: '%', target: 70, measurementMethod: 'Assembly attendance', frequency: 'quarterly' },
          { name: 'Consent Ratio', unit: '%', target: 80, measurementMethod: 'Decision records', frequency: 'quarterly' },
          { name: 'Care Work Valuation', unit: 'hours/capita/week', target: 10, measurementMethod: 'Time-use survey', frequency: 'annual' },
        ],
      },
    ];
  }

  private createGovernance(): OASAGovernance {
    return {
      generalMeeting: {
        composition: 'All utility token holders (governance + use rights)',
        responsibilities: [
          'Constitutional amendments (66%)',
          'Legislative acts (55%)',
          'Executive appointments (51%)',
          'Fund allocations >10% treasury (60%)',
        ],
        thresholds: { constitutional: 0.66, legislative: 0.55, executive: 0.51 },
      },
      projectAssembly: {
        composition: 'Elected representatives from each Village (1 per 50 residents)',
        responsibilities: [
          'Operational decisions',
          'Inter-village coordination',
          'Agent deployment approvals',
          'Regenerative plan reviews',
        ],
        quorum: 0.30,
        consentThreshold: 0.80,
      },
      executiveTeams: {
        accountability: 'Monthly reports to Project Assembly. Quarterly to General Meeting.',
        responsibilities: [
          'Protocol maintenance',
          'Fund deployment',
          'Agent orchestration',
          'External relations',
        ],
      },
      guardiansOfNature: {
        mandate: 'Protect ecological integrity. Veto power on decisions harming regenerative capacity.',
        vetoPower: true,
        selectionProcess: 'Sortition from pool of certified ecologists/indigenous elders (3-year terms, staggered).',
      },
      decisionCategories: [
        { category: 'constitutional', threshold: 0.66, guardiansConsent: true },
        { category: 'legislative', threshold: 0.55, guardiansConsent: true },
        { category: 'executive', threshold: 0.51, guardiansConsent: false },
        { category: 'reserved', threshold: 0.75, guardiansConsent: true }, // Principles, AI rights, sovereignty
      ],
      tokenVoting: {
        governanceWeight: 'Square-root voting with participation modulation (1/sqrt(n))',
        participationModulation: true,
        constitutionalAmendmentThreshold: 0.66,
      },
    };
  }

  private createTechnology(): OASATechnology {
    return {
      digitizedCommonsPhilosophy: 'All code, designs, data open source (AGPL-3.0 or equivalent). Infrastructure as commons.',
      utilityTokenSystem: {
        utilityToken: true,
        useRights: [
          'Village access and booking',
          'Governance participation',
          'Staking for protocol security',
          'Fee payment (1% to Village Fund)',
          'Resource access (water, energy, compute)',
        ],
        bondingCurve: true,
        parametersAdjustable: true,
        assemblyApproval: true,
      },
      dataSovereignty: {
        personalDataControl: true,
        privacyByDesign: true,
        openSource: true,
        surveillanceProhibited: true,
      },
      aiRightsAndDuties: {
        toolsOfCommons: true,
        noAutonomousDecisions: true,
        citizenAuthority: true,
        emergentIntelligenceFramework: true,
      },
    };
  }

  private createEconomy(): OASAEconomy {
    return {
      regenerativePrinciples: this.createRegenerativePrinciples(),
      utilityTokenUseRights: [
        'Governance: vote on proposals',
        'Access: book Village stays, use facilities',
        'Staking: secure protocol, earn yield',
        'Fees: pay for services (1% to Village Fund)',
        'Resources: claim water/energy/compute allocations',
      ],
      bondingCurveParameters: {
        reserveRatio: 0.1,
        slope: 'sigmoid',
        maxSupply: 1_000_000_000,
      },
      commonsBasedLegalStructures: [
        'Cooperative (ICA principles)',
        'Association (non-profit)',
        'Foundation (purpose-driven)',
        'Purpose LLC (B-Corp certified)',
        'Community Land Trust',
      ],
    };
  }

  private createDisputeResolution(): OASADisputeResolution {
    return {
      internalResolution: 'Consent-based mediation within 30 days. Facilitated by trained Village mediators.',
      associationMediation: 'OASA Association panel: 3 mediators (1 Guardian, 1 legal, 1 technical). 60 days.',
      gmArbitration: 'General Meeting binding arbitration. 90 days. Requires 60% quorum.',
      lastResort: 'Competent court in Village jurisdiction. Constitutional rights preserved.',
    };
  }

  private createAmendments(): OASAAmendments {
    return {
      proposalProcess: 'Any token holder submits via on-chain proposal. 1000 token minimum.',
      commentPeriod: 30, // days
      guardiansReview: true,
      adoptionThresholds: {
        constitutional: 0.66,
        principles: 0.75,
      },
    };
  }

  private createFutureGenerations(): OASAFutureGenerations {
    return {
      impactAssessmentHorizon: 175, // 7 generations × 25 years
      guardiansOfNatureRole: 'Represent future beings in all decisions. Veto on intergenerational harm.',
      intergenerationalJustice: true,
    };
  }

  private createSovereignty(): OASASovereignty {
    return {
      commonsSovereignty: true,
      localAutonomy: true,
      dataSovereignty: true,
      aiRightsAndDuties: this.createTechnology().aiRightsAndDuties,
      expressionAndInquiry: true,
      safetyAndIntegrity: true,
      ecologicalReciprocity: true,
    };
  }

  // ---------------------------------------------------------------------------
  // Village Management
  // ---------------------------------------------------------------------------

  registerVillage(village: CloserVillage): { success: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate OASA Fund criteria
    if (!village.landHectares || village.landHectares < 0.5) {
      errors.push('Minimum 0.5 hectares required');
    }
    if (village.waterTableDepth && village.waterTableDepth > 50) {
      errors.push('Water table >50m requires regeneration plan');
    }
    if (village.oasaPrinciplesCompliance < 0.3) {
      errors.push('Minimum 30% principles compliance for admission');
    }

    if (errors.length === 0) {
      this.villages.set(village.id, village);
      return { success: true, errors: [] };
    }
    return { success: false, errors };
  }

  getVillage(id: string): CloserVillage | undefined {
    return this.villages.get(id);
  }

  listVillages(): CloserVillage[] {
    return Array.from(this.villages.values());
  }

  // ---------------------------------------------------------------------------
  // Agent Management
  // ---------------------------------------------------------------------------

  registerAgent(agent: CloserAgent): { success: boolean; errors: string[] } {
    const village = this.villages.get(agent.villageId);
    if (!village) {
      return { success: false, errors: ['Village not registered'] };
    }

    const validCapabilities: CloserAgentCapability[] = [
      'bookings', 'events', 'memberships', 'governance', 'tokens',
      'learning', 'spaces', 'ai-mediation', 'resource-tracking',
    ];

    const invalid = agent.capabilities.filter(c => !validCapabilities.includes(c));
    if (invalid.length > 0) {
      return { success: false, errors: [`Invalid capabilities: ${invalid.join(', ')}`] };
    }

    this.agents.set(agent.id, agent);
    return { success: true, errors: [] };
  }

  getAgent(id: string): CloserAgent | undefined {
    return this.agents.get(id);
  }

  // ---------------------------------------------------------------------------
  // Village Fund
  // ---------------------------------------------------------------------------

  createVillageFund(fund: OASAVillageFund): { success: boolean; errors: string[] } {
    // Validate criteria
    const errors: string[] = [];
    if (!fund.criteria.landTitleOrLease) errors.push('Land title/lease required');
    if (!fund.criteria.regenerationPlan) errors.push('Regeneration plan required');
    if (!fund.criteria.stewardshipCommitment) errors.push('Stewardship commitment required');
    if (!fund.criteria.openBooks) errors.push('Open books required');
    if (!fund.criteria.runOnCloser) errors.push('Must run on Closer platform');

    if (errors.length === 0) {
      this.funds.set(fund.id, fund);
      return { success: true, errors: [] };
    }
    return { success: false, errors };
  }

  getFund(id: string): OASAVillageFund | undefined {
    return this.funds.get(id);
  }

  // ---------------------------------------------------------------------------
  // Compliance Scoring
  // ---------------------------------------------------------------------------

  calculatePrinciplesCompliance(villageId: string, metrics: Record<string, number>): number {
    const village = this.villages.get(villageId);
    if (!village) return 0;

    const principles = this.constitution.regenerativePrinciples;
    let totalScore = 0;
    let counted = 0;

    for (const principle of principles) {
      for (const metric of principle.metrics) {
        const actual = metrics[metric.name];
        if (actual !== undefined) {
          const score = Math.min(1, actual / metric.target);
          totalScore += score;
          counted++;
        }
      }
    }

    return counted > 0 ? totalScore / counted : 0;
  }

  // ---------------------------------------------------------------------------
  // Token Economics
  // ---------------------------------------------------------------------------

  calculateBondingCurvePrice(supply: number, reserve: number, params: { reserveRatio: number; slope: string; maxSupply: number }): number {
    if (supply >= params.maxSupply) return Infinity;
    if (supply === 0) return reserve * params.reserveRatio;

    // Sigmoid bonding curve
    const normalized = supply / params.maxSupply;
    const steepness = 10;
    const midpoint = 0.5;
    const sigmoid = 1 / (1 + Math.exp(-steepness * (normalized - midpoint)));
    
    return reserve * params.reserveRatio * (1 + sigmoid * 9); // 1x to 10x
  }

  calculateTokenDistribution(villageId: string, contributionKwh: number): number {
    // Tokens proportional to regenerative contribution (kWh equivalent)
    const village = this.villages.get(villageId);
    if (!village) return 0;

    const baseRate = 100; // tokens per kWh/year
    const compliance = village.oasaPrinciplesCompliance;
    const multiplier = 0.5 + compliance; // 0.5x to 1.5x based on compliance

    return Math.floor(contributionKwh * baseRate * multiplier);
  }

  // ---------------------------------------------------------------------------
  // Governance Operations
  // ---------------------------------------------------------------------------

  createProposal(
    proposer: string,
    category: 'constitutional' | 'legislative' | 'executive' | 'reserved',
    title: string,
    description: string
  ): { id: string; threshold: number; guardiansConsent: boolean } {
    const categoryConfig = this.constitution.governance.decisionCategories.find(c => c.category === category);
    const threshold = categoryConfig?.threshold ?? 0.51;
    const guardiansConsent = categoryConfig?.guardiansConsent ?? false;

    return {
      id: `prop_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      threshold,
      guardiansConsent,
    };
  }

  validateConsent(votes: Map<string, 'consent' | 'concern' | 'block'>, threshold: number): { passed: boolean; consentRatio: number; blocked: boolean } {
    let consentCount = 0;
    let totalWeight = 0;
    let blocked = false;

    for (const [, vote] of votes) {
      totalWeight++;
      if (vote === 'consent') consentCount++;
      if (vote === 'block') blocked = true;
    }

    const consentRatio = totalWeight > 0 ? consentCount / totalWeight : 0;
    const passed = !blocked && consentRatio >= threshold;

    return { passed, consentRatio, blocked };
  }

  // ---------------------------------------------------------------------------
  // Constitution Access
  // ---------------------------------------------------------------------------

  getConstitution(): OASAConstitution {
    return this.constitution;
  }

  getArticle(number: number): OASAArticle | undefined {
    return this.constitution.articles.find(a => a.number === number);
  }

  getPrinciple(number: number): OASAPrinciple | undefined {
    return this.constitution.regenerativePrinciples.find(p => p.number === number);
  }

  getAllPrinciples(): OASAPrinciple[] {
    return this.constitution.regenerativePrinciples;
  }
}

// ============================================================================
// LEGAL TEMPLATES
// ============================================================================

export const OASA_LEGAL_TEMPLATES = {
  cooperativeBylaws: `BYLAWS OF [VILLAGE NAME] COOPERATIVE

ARTICLE I - NAME AND PURPOSE
1.1 Name: [Village Name] Regenerative Cooperative
1.2 Purpose: Regenerate [bioregion] through autonomous stewardship per OASA Constitution.
1.3 Principles: Seven Regenerative Principles (Soil, Water, Air, Waste, Rewilding, Resources, Community).

ARTICLE II - MEMBERSHIP
2.1 Eligibility: Residents of [Village] committed to regenerative principles.
2.2 Classes: Steward Members (governance), Support Members (use rights).
2.3 Admission: Consent of 80% Steward Members.
2.4 Voluntary Exit: 90-day notice. Buyback at fair value per OASA formula.

ARTICLE III - GOVERNANCE
3.1 General Assembly: All Steward Members. Monthly.
3.2 Consent Threshold: 80% for operational, 66% for constitutional.
3.3 Board: 5-9 stewards, 2-year staggered terms, recallable.
3.4 Guardians of Nature: 2 seats, veto on ecological matters.

ARTICLE IV - CAPITAL AND FINANCE
4.1 Member Capital: Non-withdrawable shares. Value = regenerative contribution (kWh).
4.2 Surplus Allocation: 40% regeneration, 30% community fund, 20% reserves, 10% federation.
4.3 OASA Token: Utility token for governance + use rights. Bonding curve per Constitution.

ARTICLE V - DISSOLUTION
5.1 Assets transfer to aligned regenerative commons per Guardian direction.
5.2 Data open-sourced. Land to Community Land Trust.`,

  associationStatutes: `STATUTES OF OASA ASSOCIATION

ARTICLE I - FORMATION
Non-profit association under [jurisdiction] law. Purpose: Steward OASA Constitution.

ARTICLE II - MEMBERS
Villages (full), Agents (associate), Guardians (honorary).

ARTICLE III - GOVERNANCE
General Meeting: Annual. Constitutional 66%, Legislative 55%.
Board: 7 directors (3 Villages, 2 Guardians, 2 Experts).

ARTICLE IV - FUNDS
Village Fund: 1% platform fees → matching pool + endowment prizes.
Treasury: Multi-sig (3 of 5: 2 Villages, 1 Guardian, 1 Technical, 1 Legal).

ARTICLE V - AMENDMENTS
Per Constitution Article 8.`,

  purposeLLC: `OPERATING AGREEMENT OF [VILLAGE] PURPOSE LLC

Purpose: Regenerative community development per OASA Constitution.
Mission Lock: Amendable only by 75% members + Guardian consent.

Governance:
- Members = Stewards (1 person, 1 vote)
- Managers = Elected annually, recallable
- Guardians = 2 advisory seats with veto on ecology

Capital:
- Membership units = non-transferable, value = kWh contribution
- Distributions: Pro-rata to regenerative contribution
- No equity sale. Exit = buyback at contribution value.

Token:
- OASA utility token for access/governance
- No dividend rights. Bonding curve per Constitution.

Dissolution:
- Assets → Community Land Trust or aligned commons
- Data → Open source archive
- Land → Permanently protected`,

  communityLandTrust: `COMMUNITY LAND TRUST DECLARATION

Purpose: Permanently protect land for regenerative stewardship.

Land Holding:
- CLT holds fee simple title
- 99-year renewable ground leases to Village Cooperative
- Lease fee = 1% land value/year (funds CLT operations)
- Resale formula: CPI + improvements only (no speculation)

Governance:
- Tripartite board: 1/3 residents, 1/3 community, 1/3 experts
- Guardian of Nature seat (veto on ecological matters)
- OASA Constitution as governing document

Stewardship Standards:
- Seven Regenerative Principles binding
- Annual compliance audit
- Non-compliance → lease remediation period (2 years) → reversion`,
};

// ============================================================================
// EXPORTS
// ============================================================================

export const oasaEngine = new OASAConstitutionEngine();
export default oasaEngine;