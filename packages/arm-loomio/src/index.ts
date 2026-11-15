// arm-loomio/src/index.ts
// Main barrel export for @hscsg/arm-loomio

// Types
export * from './types';

// Operations
export * from './ops';

// Utils
export * from './utils';

// Patterns
export * from './patterns';

// Agent-Human
export * from './agentHuman';

// Library modules
export * from '../lib/loomio';

// Core domain classes (to be implemented in src/core/)
export { LoomioDecisionEngine } from './core/decisionEngine';
export { LoomioProposalService } from './core/proposalService';
export { LoomioVotingService } from './core/votingService';
export { LoomioThreadService } from './core/threadService';
export { LoomioGroupService } from './core/groupService';
export { LoomioMembershipService } from './core/membershipService';
export { LoomioTemplateService } from './core/templateService';
export { LoomioAnalyticsService } from './core/analyticsService';