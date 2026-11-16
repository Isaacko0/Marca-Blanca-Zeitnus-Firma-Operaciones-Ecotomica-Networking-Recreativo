// arm-sensorica/src/index.ts - Main Exports

// Types
export * from './types';

// Core Modules
export * from './core/valueEquation';
export * from './core/contributionAccounting';
export * from './core/governance';
export * from './core/resourcePool';
export * from './core/accessControl';
export * from './core/trustLocal';
export * from './core/exchangeFirm';
export * from './core/blockchainPrimitives';
export * from './core/affiliate';

// Ops
export * from './ops';

// Utils
export * from './utils';

// Repositories (in-memory implementations)
export { 
  InMemoryContributionRepository,
  InMemoryGovernanceRepository,
  InMemoryResourcePoolRepository,
  InMemoryExchangeFirmRepository,
  InMemoryAffiliateRepository,
  InMemoryContributionSequenceStore,
  InMemoryGovernanceRepository,
  InMemoryGovernanceRepository
} from './core/contributionAccounting';
export { InMemoryGovernanceRepository } from './core/governance';
export { InMemoryResourcePoolRepository } from './core/resourcePool';
export { InMemoryExchangeFirmRepository } from './core/exchangeFirm';
export { InMemoryAffiliateRepository } from './core/affiliate';

// Services
export { 
  GovernanceServiceImpl,
  GovernanceService,
  ResourcePoolServiceImpl,
  AccessControlServiceImpl,
  LocalTrustSystem,
  ExchangeFirmServiceImpl,
  AffiliateServiceImpl,
  GovernanceServiceImpl
} from './core/governance';
export { ResourcePoolServiceImpl } from './core/resourcePool';
export { AccessControlServiceImpl, PlaceKeeperManagerImpl } from './core/accessControl';
export { LocalTrustSystem } from './core/trustLocal';
export { ExchangeFirmServiceImpl } from './core/exchangeFirm';
export { AffiliateServiceImpl } from './core/affiliate';
export { LocalTrustSystem } from './core/trustLocal';

// Factories
export { 
  createContribution,
  createResource,
  createAffiliate,
  createExchangeFirm,
  createDefaultValueEquationConfig,
  createDefaultGovernanceConfig,
  createDefaultCommonsRules,
  createAccessRule,
  createTimeRestriction,
  createAccessCondition,
  createPrivateRegime,
  createPublicRegime,
  createCommonsRegime,
  createNonDominiumRegime,
  createDefaultCommonsRules,
  createDefaultGovernanceConfig
} from './core/contributionAccounting';
export { createContribution } from './core/contributionAccounting';
export { createResource } from './core/resourcePool';
export { createAffiliate } from './core/affiliate';
export { createExchangeFirm } from './core/exchangeFirm';
export { createDefaultValueEquationConfig } from './core/valueEquation';
export { createDefaultGovernanceConfig } from './core/governance';
export { createDefaultCommonsRules } from './core/resourcePool';
export { createAccessRule, createTimeRestriction, createAccessCondition } from './core/resourcePool';
export { createPrivateRegime, createPublicRegime, createCommonsRegime, createNonDominiumRegime, createDefaultCommonsRules } from './core/resourcePool';

// Validators
export { 
  validateContribution,
  validateValueEquationConfig,
  DEFAULT_VALIDATION_RULES,
  validateContribution,
  validateValueEquationConfig
} from './core/contributionAccounting';
export { validateContribution, validateValueEquationConfig } from './core/contributionAccounting';
export { validateValueEquationConfig } from './core/valueEquation';

// Analytics
export { 
  summarizeContributions,
  analyzeAffiliates,
  filterAffiliates,
  sortAffiliates,
  checkResourceAvailability
} from './core/contributionAccounting';
export { summarizeContributions } from './core/contributionAccounting';
export { analyzeAffiliates, filterAffiliates, sortAffiliates } from './core/affiliate';
export { checkResourceAvailability } from './core/resourcePool';

// Utils
export * from './utils';

// Patterns & Agent-Human Loop
export * from './patterns';
export * from './agentHuman';