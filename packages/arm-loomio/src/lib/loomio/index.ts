// arm-loomio/src/lib/loomio/index.ts
// Barrel export for all Loomio library modules

export * from './proposalTypes';
export * from './stv';
export * from './voteWeights';
export * from './anonymousVoting';
export * from './threadSequence';
export * from './groupHierarchy';
export * from './notificationRouting';
export * from './legalAcceptance';

// Re-export commonly used types
export type {
  ProposalType,
  VotingMethod,
  HideResults,
  StanceReasonRequired,
  ProposalTypeConfig,
  ProposalTypeDefaults,
  ProposalTypeConstraints,
} from './proposalTypes';

export type {
  STVBallot,
  STVCandidate,
  STVRound,
  TransferEvent,
  STVResult,
  STVConfig,
} from './stv';

export type {
  VoteWeight,
  VoteWeightInput,
  VoteWeightValidationResult,
  BulkVoteWeightResult,
  VoteWeightAuditEntry,
} from './voteWeights';

export type {
  AnonymousBallot,
  AnonymousBallotChoice,
  AnonymousPollVoter,
  AnonymousVotingConfig,
  FrozenAnonymousConfig,
  BallotSubmission,
  BallotVerificationResult,
} from './anonymousVoting';

export type {
  ThreadItem,
  ThreadItemKind,
  ThreadSequenceState,
} from './threadSequence';

export type {
  GroupHierarchyNode,
  GroupPermissions,
  EffectivePermissions,
} from './groupHierarchy';

export type {
  DeliveryChannel,
  VolumeLevel,
  DeliveryPreferences,
  NotificationEvent,
  NotificationType,
  RecipientDeliveryPrefs,
  VolumeConfig,
} from './notificationRouting';

export type {
  LegalTermsVersion,
  LegalAcceptance,
  LegalAcceptanceStatus,
  LegalTermsConfig,
} from './legalAcceptance';