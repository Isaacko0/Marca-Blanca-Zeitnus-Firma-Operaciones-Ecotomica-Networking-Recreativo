// arm-loomio/src/lib/loomio/proposalTypes.ts
// Ported from Loomio's config/poll_types.yml - 11 Proposal Types for Collaborative Decision Making

export enum ProposalType {
  PROPOSAL = 'proposal',
  CHECK = 'check',
  ADVICE = 'advice',
  CONSENT = 'consent',
  CONSENSUS = 'consensus',
  POLL = 'poll',
  SCORE = 'score',
  DOT_VOTE = 'dot_vote',
  RANKED_CHOICE = 'ranked_choice',
  STV = 'stv',
  MEETING = 'meeting',
}

export enum VotingMethod {
  MAJORITY = 'majority',
  CONSENSUS = 'consensus',
  CONSENT = 'consent',
  PLURALITY = 'plurality',
  SCORING = 'scoring',
  DOT_VOTING = 'dot_voting',
  IRV = 'irv',
  STV = 'stv',
  SCHEDULING = 'scheduling',
}

export enum HideResults {
  NEVER = 'never',
  UNTIL_CLOSED = 'until_closed',
  ALWAYS = 'always',
}

export enum StanceReasonRequired {
  DISABLED = 'disabled',
  REQUIRED = 'required',
  REQUIRED_FOR_DISAGREE_OR_BLOCK = 'required_for_disagree_or_block',
  REQUIRED_FOR_BLOCK = 'required_for_block',
}

export interface ProposalTypeDefaults {
  durationDays?: number;
  choiceCountMin?: number;
  choiceCountMax?: number;
  hideResults?: HideResults;
  stanceReasonRequired?: StanceReasonRequired;
  preventAnonymous?: boolean;
  preventWeightedVoting?: boolean;
  // STV specific
  stvSeats?: number;
  stvMethod?: 'scottish' | 'meek';
  stvQuota?: 'droop' | 'hare';
  // Score specific
  scoreMin?: number;
  scoreMax?: number;
  // Dot vote specific
  pointsPerVoter?: number;
  // Meeting specific
  meetingDuration?: number;
  timeZone?: string;
  canRespondMaybe?: boolean;
  // Ranked choice specific
  requireAllChoices?: boolean;
  showNoneOfTheAbove?: boolean;
}

export interface ProposalTypeConstraints {
  requiresOptions: boolean;
  minOptions?: number;
  maxOptions?: number;
  supportsWeightedVoting: boolean;
  supportsAnonymous: boolean;
  supportsStv: boolean;
  supportsRankedChoices: boolean;
  supportsScoring: boolean;
  supportsDotVoting: boolean;
}

export interface ProposalTypeConfig {
  key: ProposalType;
  label: string;
  description: string;
  votingMethod: VotingMethod;
  defaults: ProposalTypeDefaults;
  constraints: ProposalTypeConstraints;
  // UI hints
  icon?: string;
  category?: 'decision' | 'consultation' | 'election' | 'scheduling' | 'prioritization';
  complexity?: 'simple' | 'moderate' | 'complex';
  recommendedFor?: string[];
}

// Complete Proposal Type Registry - Ported from Loomio poll_types.yml
export const PROPOSAL_TYPES: Record<ProposalType, ProposalTypeConfig> = {
  [ProposalType.PROPOSAL]: {
    key: ProposalType.PROPOSAL,
    label: 'Proposal',
    description: 'Formal decision with agree/disagree/block options. Used for binding decisions requiring consensus or majority.',
    votingMethod: VotingMethod.CONSENSUS,
    defaults: {
      durationDays: 7,
      hideResults: HideResults.UNTIL_CLOSED,
      stanceReasonRequired: StanceReasonRequired.REQUIRED_FOR_DISAGREE_OR_BLOCK,
      preventAnonymous: false,
      preventWeightedVoting: false,
    },
    constraints: {
      requiresOptions: false, // Uses fixed agree/disagree/block
      supportsWeightedVoting: true,
      supportsAnonymous: true,
      supportsStv: false,
      supportsRankedChoices: false,
      supportsScoring: false,
      supportsDotVoting: false,
    },
    icon: 'gavel',
    category: 'decision',
    complexity: 'moderate',
    recommendedFor: ['binding decisions', 'policy changes', 'budget approvals', 'strategic choices'],
  },

  [ProposalType.CHECK]: {
    key: ProposalType.CHECK,
    label: 'Check',
    description: 'Quick verification or health check. Simple yes/no/maybe for rapid alignment.',
    votingMethod: VotingMethod.MAJORITY,
    defaults: {
      durationDays: 3,
      hideResults: HideResults.NEVER,
      stanceReasonRequired: StanceReasonRequired.DISABLED,
      preventAnonymous: false,
      preventWeightedVoting: true,
    },
    constraints: {
      requiresOptions: false,
      supportsWeightedVoting: false,
      supportsAnonymous: true,
      supportsStv: false,
      supportsRankedChoices: false,
      supportsScoring: false,
      supportsDotVoting: false,
    },
    icon: 'check_circle',
    category: 'consultation',
    complexity: 'simple',
    recommendedFor: ['health checks', 'quick alignment', 'temperature checks', 'standup syncs'],
  },

  [ProposalType.ADVICE]: {
    key: ProposalType.ADVICE,
    label: 'Advice',
    description: 'Request for comments without binding decision. Collects input to inform a decision maker.',
    votingMethod: VotingMethod.PLURALITY,
    defaults: {
      durationDays: 14,
      hideResults: HideResults.NEVER,
      stanceReasonRequired: StanceReasonRequired.REQUIRED,
      preventAnonymous: false,
      preventWeightedVoting: true,
    },
    constraints: {
      requiresOptions: true,
      minOptions: 2,
      maxOptions: 10,
      supportsWeightedVoting: false,
      supportsAnonymous: true,
      supportsStv: false,
      supportsRankedChoices: false,
      supportsScoring: true,
      supportsDotVoting: false,
    },
    icon: 'lightbulb',
    category: 'consultation',
    complexity: 'simple',
    recommendedFor: ['RFCs', 'design reviews', 'strategy input', 'feedback collection'],
  },

  [ProposalType.CONSENT]: {
    key: ProposalType.CONSENT,
    label: 'Consent',
    description: 'Sociocracy-style consent: no objection = consent. Objections must be reasoned and parametrized.',
    votingMethod: VotingMethod.CONSENT,
    defaults: {
      durationDays: 7,
      hideResults: HideResults.UNTIL_CLOSED,
      stanceReasonRequired: StanceReasonRequired.REQUIRED_FOR_BLOCK,
      preventAnonymous: false,
      preventWeightedVoting: false,
    },
    constraints: {
      requiresOptions: false, // Fixed: consent/objection
      supportsWeightedVoting: true,
      supportsAnonymous: true,
      supportsStv: false,
      supportsRankedChoices: false,
      supportsScoring: false,
      supportsDotVoting: false,
    },
    icon: 'thumb_up',
    category: 'decision',
    complexity: 'moderate',
    recommendedFor: ['sociocracy circles', 'operational decisions', 'role assignments', 'policy tweaks'],
  },

  [ProposalType.CONSENSUS]: {
    key: ProposalType.CONSENSUS,
    label: 'Consensus',
    description: 'Graduated consensus: agree/agree with reservations/stand aside/block. Seeks highest alignment.',
    votingMethod: VotingMethod.CONSENSUS,
    defaults: {
      durationDays: 14,
      hideResults: HideResults.UNTIL_CLOSED,
      stanceReasonRequired: StanceReasonRequired.REQUIRED_FOR_DISAGREE_OR_BLOCK,
      preventAnonymous: false,
      preventWeightedVoting: false,
    },
    constraints: {
      requiresOptions: false, // Fixed: agree/reservations/stand_aside/block
      supportsWeightedVoting: true,
      supportsAnonymous: true,
      supportsStv: false,
      supportsRankedChoices: false,
      supportsScoring: false,
      supportsDotVoting: false,
    },
    icon: 'handshake',
    category: 'decision',
    complexity: 'complex',
    recommendedFor: ['major strategic decisions', 'values alignment', 'conflict resolution', 'foundational agreements'],
  },

  [ProposalType.POLL]: {
    key: ProposalType.POLL,
    label: 'Poll',
    description: 'Multiple choice poll with plurality or majority winner. Standard survey-style decision.',
    votingMethod: VotingMethod.PLURALITY,
    defaults: {
      durationDays: 7,
      choiceCountMin: 1,
      choiceCountMax: 1,
      hideResults: HideResults.UNTIL_CLOSED,
      stanceReasonRequired: StanceReasonRequired.DISABLED,
      preventAnonymous: false,
      preventWeightedVoting: false,
    },
    constraints: {
      requiresOptions: true,
      minOptions: 2,
      maxOptions: 20,
      supportsWeightedVoting: true,
      supportsAnonymous: true,
      supportsStv: false,
      supportsRankedChoices: false,
      supportsScoring: false,
      supportsDotVoting: false,
    },
    icon: 'poll',
    category: 'decision',
    complexity: 'simple',
    recommendedFor: ['preference surveys', 'option selection', 'candidate elections', 'feature prioritization'],
  },

  [ProposalType.SCORE]: {
    key: ProposalType.SCORE,
    label: 'Score Voting',
    description: 'Rate each option on a numeric scale. Highest average wins. Allows nuanced preference expression.',
    votingMethod: VotingMethod.SCORING,
    defaults: {
      durationDays: 7,
      choiceCountMin: 1,
      choiceCountMax: 1,
      scoreMin: 0,
      scoreMax: 100,
      hideResults: HideResults.UNTIL_CLOSED,
      stanceReasonRequired: StanceReasonRequired.DISABLED,
      preventAnonymous: false,
      preventWeightedVoting: false,
    },
    constraints: {
      requiresOptions: true,
      minOptions: 2,
      maxOptions: 15,
      supportsWeightedVoting: true,
      supportsAnonymous: true,
      supportsStv: false,
      supportsRankedChoices: false,
      supportsScoring: true,
      supportsDotVoting: false,
    },
    icon: 'score',
    category: 'prioritization',
    complexity: 'moderate',
    recommendedFor: ['project prioritization', 'budget allocation', 'multi-criteria decisions', 'idea evaluation'],
  },

  [ProposalType.DOT_VOTE]: {
    key: ProposalType.DOT_VOTE,
    label: 'Dot Voting',
    description: 'Distribute limited points across options. Visual priority allocation with constrained budget.',
    votingMethod: VotingMethod.DOT_VOTING,
    defaults: {
      durationDays: 7,
      choiceCountMin: 1,
      pointsPerVoter: 10,
      hideResults: HideResults.UNTIL_CLOSED,
      stanceReasonRequired: StanceReasonRequired.DISABLED,
      preventAnonymous: false,
      preventWeightedVoting: true, // Points are the weight
    },
    constraints: {
      requiresOptions: true,
      minOptions: 3,
      maxOptions: 20,
      supportsWeightedVoting: false, // Points replace weights
      supportsAnonymous: true,
      supportsStv: false,
      supportsRankedChoices: false,
      supportsScoring: false,
      supportsDotVoting: true,
    },
    icon: 'circle',
    category: 'prioritization',
    complexity: 'moderate',
    recommendedFor: ['participatory budgeting', 'resource allocation', 'feature voting', 'retrospective actions'],
  },

  [ProposalType.RANKED_CHOICE]: {
    key: ProposalType.RANKED_CHOICE,
    label: 'Ranked Choice (IRV)',
    description: 'Rank options by preference. Instant Runoff Voting eliminates lowest until majority winner.',
    votingMethod: VotingMethod.IRV,
    defaults: {
      durationDays: 7,
      choiceCountMin: 1,
      choiceCountMax: 10,
      requireAllChoices: false,
      showNoneOfTheAbove: false,
      hideResults: HideResults.UNTIL_CLOSED,
      stanceReasonRequired: StanceReasonRequired.DISABLED,
      preventAnonymous: false,
      preventWeightedVoting: false,
    },
    constraints: {
      requiresOptions: true,
      minOptions: 3,
      maxOptions: 15,
      supportsWeightedVoting: true,
      supportsAnonymous: true,
      supportsStv: false,
      supportsRankedChoices: true,
      supportsScoring: false,
      supportsDotVoting: false,
    },
    icon: 'sort',
    category: 'election',
    complexity: 'moderate',
    recommendedFor: ['single-winner elections', 'candidate selection', 'office elections', 'award voting'],
  },

  [ProposalType.STV]: {
    key: ProposalType.STV,
    label: 'Single Transferable Vote (STV)',
    description: 'Proportional representation for multi-seat elections. Scottish STV or Meek STV with Droop/Hare quota.',
    votingMethod: VotingMethod.STV,
    defaults: {
      durationDays: 14,
      choiceCountMin: 1,
      choiceCountMax: 20,
      stvSeats: 3,
      stvMethod: 'scottish',
      stvQuota: 'droop',
      hideResults: HideResults.UNTIL_CLOSED,
      stanceReasonRequired: StanceReasonRequired.DISABLED,
      preventAnonymous: false,
      preventWeightedVoting: true, // STV doesn't support weighted voting
    },
    constraints: {
      requiresOptions: true,
      minOptions: 4, // Need more candidates than seats
      maxOptions: 30,
      supportsWeightedVoting: false,
      supportsAnonymous: true,
      supportsStv: true,
      supportsRankedChoices: true,
      supportsScoring: false,
      supportsDotVoting: false,
    },
    icon: 'election',
    category: 'election',
    complexity: 'complex',
    recommendedFor: ['board elections', 'committee elections', 'proportional representation', 'multi-winner roles'],
  },

  [ProposalType.MEETING]: {
    key: ProposalType.MEETING,
    label: 'Meeting Scheduler',
    description: 'Find best meeting time. Participants indicate availability across time slots.',
    votingMethod: VotingMethod.SCHEDULING,
    defaults: {
      durationDays: 7,
      meetingDuration: 60, // minutes
      timeZone: 'UTC',
      canRespondMaybe: true,
      hideResults: HideResults.NEVER,
      stanceReasonRequired: StanceReasonRequired.DISABLED,
      preventAnonymous: false,
      preventWeightedVoting: true,
    },
    constraints: {
      requiresOptions: true, // Time slots
      minOptions: 2,
      maxOptions: 50,
      supportsWeightedVoting: false,
      supportsAnonymous: false,
      supportsStv: false,
      supportsRankedChoices: false,
      supportsScoring: false,
      supportsDotVoting: false,
    },
    icon: 'event',
    category: 'scheduling',
    complexity: 'simple',
    recommendedFor: ['meeting scheduling', 'availability polling', 'event planning', 'sync coordination'],
  },
};

// Helper functions
export function getProposalTypeConfig(type: ProposalType): ProposalTypeConfig {
  return PROPOSAL_TYPES[type];
}

export function getAllProposalTypes(): ProposalTypeConfig[] {
  return Object.values(PROPOSAL_TYPES);
}

export function getProposalTypesByCategory(category: ProposalTypeConfig['category']): ProposalTypeConfig[] {
  return Object.values(PROPOSAL_TYPES).filter(t => t.category === category);
}

export function validateProposalConfig(type: ProposalType, config: Partial<ProposalTypeDefaults>): string[] {
  const errors: string[] = [];
  const typeConfig = PROPOSAL_TYPES[type];
  
  if (!typeConfig) {
    errors.push(`Unknown proposal type: ${type}`);
    return errors;
  }
  
  // Validate STV settings
  if (type === ProposalType.STV) {
    const seats = config.stvSeats ?? typeConfig.defaults.stvSeats ?? 1;
    if (seats < 1) errors.push('STV seats must be >= 1');
    if (config.choiceCountMax && config.choiceCountMax <= seats) {
      errors.push('STV requires more candidates than seats');
    }
  }
  
  // Validate Score range
  if (type === ProposalType.SCORE) {
    const min = config.scoreMin ?? typeConfig.defaults.scoreMin ?? 0;
    const max = config.scoreMax ?? typeConfig.defaults.scoreMax ?? 100;
    if (min >= max) errors.push('Score min must be less than max');
  }
  
  // Validate Dot Vote points
  if (type === ProposalType.DOT_VOTE) {
    const points = config.pointsPerVoter ?? typeConfig.defaults.pointsPerVoter ?? 10;
    if (points < 1) errors.push('Points per voter must be >= 1');
  }
  
  // Validate choice counts
  if (config.choiceCountMin !== undefined && config.choiceCountMax !== undefined) {
    if (config.choiceCountMin > config.choiceCountMax) {
      errors.push('Choice count min cannot exceed max');
    }
  }
  
  return errors;
}

export function getDefaultConfig(type: ProposalType): ProposalTypeDefaults {
  return { ...PROPOSAL_TYPES[type].defaults };
}

export function mergeConfig(type: ProposalType, userConfig: Partial<ProposalTypeDefaults>): ProposalTypeDefaults {
  const defaults = getDefaultConfig(type);
  return { ...defaults, ...userConfig };
}