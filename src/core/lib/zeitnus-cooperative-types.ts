// zeitnus-cooperative-types.ts — Tipos exportados para el Ecosistema Cooperativo ZEITNUS
// Re-exporta desde zeitnus-cooperative.ts para separación de responsabilidades

export type {
  CooperativeType,
  CapitalType,
  RiskProfile,
  RegulatoryRegime,
  ProgressivePhase,
  CircularEconomyMetrics,
  SocialCapitalIndicators,
  CooperativeState,
  CreditPortfolio,
  PhaseMetrics,
  CircularProject,
  TransparencyMechanism,
  EducationProgram,
  GovernanceStructure,
} from './zeitnus-cooperative';

export {
  COOPERATIVE_PRINCIPLES,
  REGULATORY_BODIES,
  RISK_THRESHOLDS,
  PROGRESSIVE_PHASE_ORDER,
  PHASE_NAMES,
  CAPITAL_TYPE_LABELS,
  COOPERATIVE_TYPE_LABELS,
  RISK_LEVEL_LABELS,
  REGULATORY_REGIME_LABELS,
  PHASE_LABELS,
  calculateCooperativeCapital,
  simulateCompoundInterest,
  assessRiskProfile,
  verifyRegulatoryRegime,
  designProgressiveModel,
  measureCircularEconomy,
  buildSocialCapital,
  ensureTransparency,
  createInitialCooperativeState,
} from './zeitnus-cooperative';