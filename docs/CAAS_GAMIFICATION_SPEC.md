# Spec: CaaS Gamificación Estructurada (4 Modelos + Metodología 4 Fases + Anti-Muir Guard)

**Fuente**: Documento "Plataformas de Comunidades CaaS.txt" — Secciones: Modelos de Gamificación + Metodología + William Muir + Arquitectura de la Decisión  
**Prioridad**: P0 (Gap mayor identificado en CaaS-BM actual)  
**Archivos Zeitnus**: `src/core/lib/caasGamification.ts`, `src/core/state/caasGamification.ts`, `src/app/screens/CaaSGamification.tsx`

---

## 1. Modelo de Datos (State)

```typescript
// src/core/state/caasGamification.ts

export type CaaSTierKey = 'entry' | 'premium' | 'vip' | 'founder';
export type BadgeCategory = 'helpfulness' | 'onboarding' | 'expertise' | 'moderation' | 'advocacy' | 'streak' | 'co-creation' | 'mentorship';
export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
export type ChallengeType = 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'cohort';
export type VerificationType = 'self' | 'peer' | 'system' | 'moderator' | 'cds';
export type GamingFlagType = 'volume_spam' | 'self_voting' | 'circle_jerk' | 'bot_behavior' | 'point_farming';
export type GamingSeverity = 'low' | 'medium' | 'high' | 'critical';
export type GamingAction = 'warning' | 'points_revoked' | 'badge_revoked' | 'tier_downgrade' | 'shadow_ban' | 'suspended';

export interface TierDefinition {
  key: CaaSTierKey;
  label: string;
  description: string;
  requiredAUT: number;
  requiredCDS: number;
  requiredZNUstake: number;
  requiredValueFlows: number;
  unlockedSpaces: string[];
  maxConcurrentProjects: number;
  accessToMasterminds: boolean;
  accessToAMAs: boolean;
  betaFeaturesAccess: boolean;
  badgeIcon: string;
  badgeColor: string;
  leaderboardWeight: number;
}

export interface BadgeDefinition {
  id: string;
  category: BadgeCategory;
  label: string;
  description: string;
  icon: string;
  color: string;
  points: number;
  criteria: BadgeCriteria;
  tier: BadgeTier;
  isVisible: boolean;
  unlocksPrivilege?: string;
}

export interface BadgeCriteria {
  type: 'count' | 'streak' | 'validation' | 'vote' | 'referral' | 'completion';
  target: number;
  context?: string;
  verifier?: VerificationType;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  category: BadgeCategory;
  startDate: number;
  endDate: number;
  tasks: ChallengeTask[];
  rewards: ChallengeReward[];
  participants: string[];
  completions: ChallengeCompletion[];
  isActive: boolean;
}

export interface ChallengeTask {
  id: string;
  description: string;
  type: 'post' | 'reply' | 'solution' | 'vote' | 'guide' | 'attend' | 'complete-module' | 'referral';
  targetCount: number;
  pointsPerCompletion: number;
  verification: VerificationType;
}

export interface ChallengeReward {
  type: 'badge' | 'points' | 'znu' | 'tier-unlock' | 'privilege' | 'physical';
  value: string | number;
  badgeId?: string;
}

export interface ChallengeCompletion {
  memberId: string;
  taskId: string;
  completedAt: number;
  verified: boolean;
  verifiedBy: string;
  evidence?: string;
}

export interface EarnedBadge {
  badgeId: string;
  earnedAt: number;
  context: string;
  verifier: string;
  isDisplayed: boolean;
}

export interface MemberGamificationState {
  memberId: string;
  currentTier: CaaSTierKey;
  tierProgress: Record<CaaSTierKey, number>;
  totalPoints: number;
  weeklyPoints: number;
  monthlyPoints: number;
  badges: EarnedBadge[];
  reputationScore: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: number;
  streakFrozen: boolean;
  activeChallenges: string[];
  completedChallenges: CompletedChallenge[];
  advocacyPoints: number;
  advocacyCampaigns: string[];
  globalRank: number;
  tierRank: number;
  categoryRanks: Record<string, number>;
  gamingFlags: GamingFlag[];
  trustScore: number;
}

export interface CompletedChallenge {
  challengeId: string;
  completedAt: number;
  tasksCompleted: number;
  totalTasks: number;
  rewardsClaimed: boolean;
}

export interface GamingFlag {
  id: string;
  type: GamingFlagType;
  detectedAt: number;
  severity: GamingSeverity;
  evidence: string[];
  actionTaken: GamingAction;
  resolvedAt: number | null;
}

export interface ActivityEvent {
  memberId: string;
  type: 'post' | 'reply' | 'solution' | 'vote' | 'guide' | 'attend' | 'login' | 'complete-module' | 'referral' | 'moderation';
  targetId?: string;
  metadata?: Record<string, unknown>;
  timestamp: number;
}

export interface GamificationResult {
  pointsAwarded: number;
  badgesEarned: EarnedBadge[];
  tierUpgraded: boolean;
  tierUpgradedTo?: CaaSTierKey;
  streakUpdated: boolean;
  challengesProgressed: string[];
  gamingFlags: GamingFlag[];
}

export interface ActivityScore {
  overall: number;
  helpfulness: number;
  expertise: number;
  advocacy: number;
  consistency: number;
  trustworthiness: number;
}

export interface LeaderboardEntry {
  memberId: string;
  rank: number;
  score: number;
  tier: CaaSTierKey;
  badgesCount: number;
}

export interface CaaSGamificationState {
  memberStates: Map<string, MemberGamificationState>;
  challenges: Map<string, Challenge>;
  advocacyCampaigns: Map<string, AdvocacyCampaign>;
  config: GamificationConfig;
  leaderboards: {
    global: LeaderboardEntry[];
    byTier: Record<CaaSTierKey, LeaderboardEntry[]>;
    byCategory: Record<string, LeaderboardEntry[]>;
  };
  lastLeaderboardUpdate: number;
}

export interface AdvocacyCampaign {
  id: string;
  title: string;
  description: string;
  objective: 'reviews' | 'referrals' | 'roadmap' | 'references' | 'content' | 'events';
  targetAudience: string[];
  startDate: number;
  endDate: number;
  actions: AdvocacyAction[];
  rewards: AdvocacyReward[];
  kpis: { metric: string; target: number }[];
}

export interface AdvocacyAction {
  id: string;
  type: 'write-review' | 'refer-member' | 'vote-roadmap' | 'be-reference' | 'create-content' | 'attend-event' | 'share-social';
  description: string;
  points: number;
  verification: VerificationType;
  externalUrl?: string;
}

export interface AdvocacyReward {
  type: 'points' | 'badge' | 'znu' | 'tier-upgrade' | 'exclusive-access' | 'physical-gift' | 'governance-seat';
  value: string | number;
  threshold: number;
}

export interface GamificationConfig {
  activeBadges: string[];
  activeChallenges: string[];
  activeCampaigns: string[];
  leaderboardWeights: Record<string, number>;
  antiGamingSensitivity: 'low' | 'medium' | 'high' | 'strict';
  streakFreezeEnabled: boolean;
  maxStreakFreezeDays: number;
}
```

---

## 2. Configuración Base (Tier Definitions + Badges + Challenge Templates)

```typescript
// src/core/lib/caasGamificationConfig.ts

export const CAAS_TIERS: Record<CaaSTierKey, TierDefinition> = {
  entry: {
    key: 'entry', label: 'Explorador', description: 'Acceso general, muro comunidad, onboarding guiado',
    requiredAUT: 0, requiredCDS: 0, requiredZNUstake: 0, requiredValueFlows: 0,
    unlockedSpaces: ['general', 'onboarding', 'ayuda'],
    maxConcurrentProjects: 1, accessToMasterminds: false, accessToAMAs: false, betaFeaturesAccess: false,
    badgeIcon: '🌱', badgeColor: 'text-green-400', leaderboardWeight: 1
  },
  premium: {
    key: 'premium', label: 'Colaborador', description: 'Cursos, eventos, marketplace peer, espacios temáticos',
    requiredAUT: 0.3, requiredCDS: 3, requiredZNUstake: 100, requiredValueFlows: 10,
    unlockedSpaces: ['general', 'cursos', 'eventos', 'marketplace', 'tematicos'],
    maxConcurrentProjects: 3, accessToMasterminds: false, accessToAMAs: true, betaFeaturesAccess: true,
    badgeIcon: '🔧', badgeColor: 'text-blue-400', leaderboardWeight: 2
  },
  vip: {
    key: 'vip', label: 'Embajador', description: 'Masterminds, Office Hours directivos, beta features, gobernanza',
    requiredAUT: 0.6, requiredCDS: 10, requiredZNUstake: 500, requiredValueFlows: 50,
    unlockedSpaces: ['all', 'masterminds', 'office-hours', 'gobernanza', 'beta'],
    maxConcurrentProjects: 10, accessToMasterminds: true, accessToAMAs: true, betaFeaturesAccess: true,
    badgeIcon: '💎', badgeColor: 'text-purple-400', leaderboardWeight: 5
  },
  founder: {
    key: 'founder', label: 'Fundador', description: 'Acceso total, treasury, arquitectura, fundadores circle',
    requiredAUT: 0.9, requiredCDS: 25, requiredZNUstake: 2000, requiredValueFlows: 200,
    unlockedSpaces: ['all', 'treasury', 'arquitectura', 'founders-circle'],
    maxConcurrentProjects: 99, accessToMasterminds: true, accessToAMAs: true, betaFeaturesAccess: true,
    badgeIcon: '👑', badgeColor: 'text-gold-400', leaderboardWeight: 10
  }
};

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // HELPFULNESS - Resolución peer-to-peer (deflexión soporte)
  { id: 'first-solution', category: 'helpfulness', label: 'Primer Resolutor', description: 'Primera respuesta marcada como solución oficial', icon: '✅', color: 'text-emerald-400', points: 50, criteria: { type: 'validation', target: 1, verifier: 'peer' }, tier: 'bronze', isVisible: true, unlocksPrivilege: 'solution-badge' },
  { id: 'solution-streak-5', category: 'helpfulness', label: 'Racha Resolutiva', description: '5 soluciones validadas consecutivas', icon: '🔥', color: 'text-orange-400', points: 200, criteria: { type: 'streak', target: 5, context: 'solution', verifier: 'peer' }, tier: 'silver', isVisible: true },
  { id: 'solution-master', category: 'helpfulness', label: 'Maestro de Soluciones', description: '50 soluciones validadas por la comunidad', icon: '🏆', color: 'text-amber-400', points: 1000, criteria: { type: 'count', target: 50, context: 'solution', verifier: 'peer' }, tier: 'gold', isVisible: true, unlocksPrivilege: 'expert-channel' },
  
  // ONBOARDING - Activación progresiva (lurkers → participants)
  { id: 'profile-complete', category: 'onboarding', label: 'Perfil Completo', description: 'Completó perfil + foto + bio + skills', icon: '👤', color: 'text-sky-400', points: 25, criteria: { type: 'completion', target: 1, context: 'profile', verifier: 'system' }, tier: 'bronze', isVisible: true },
  { id: 'first-post', category: 'onboarding', label: 'Primera Voz', description: 'Primera publicación en muro general', icon: '🎤', color: 'text-sky-400', points: 25, criteria: { type: 'count', target: 1, context: 'post', verifier: 'system' }, tier: 'bronze', isVisible: true },
  { id: 'welcome-survey', category: 'onboarding', label: 'Explorador Activo', description: 'Completó encuesta de bienvenida + intereses', icon: '🧭', color: 'text-sky-400', points: 50, criteria: { type: 'completion', target: 1, context: 'welcome-survey', verifier: 'system' }, tier: 'bronze', isVisible: true },
  
  // EXPERTISE - Co-creación conocimiento
  { id: 'guide-author', category: 'expertise', label: 'Autor de Guía', description: 'Publicó guía técnica validada por 3+ peers', icon: '📖', color: 'text-indigo-400', points: 150, criteria: { type: 'validation', target: 3, context: 'guide', verifier: 'peer' }, tier: 'silver', isVisible: true },
  { id: 'code-reviewer', category: 'expertise', label: 'Revisor de Código', description: '10 code reviews constructivos en proyectos FABSHIP', icon: '🔍', color: 'text-indigo-400', points: 200, criteria: { type: 'count', target: 10, context: 'code-review', verifier: 'peer' }, tier: 'silver', isVisible: true },
  
  // MODERATION - Gobernanza cívica
  { id: 'civic-moderator', category: 'moderation', label: 'Moderador Cívico', description: '20 reportes válidos + 0 falsos positivos', icon: '⚖️', color: 'text-rose-400', points: 300, criteria: { type: 'count', target: 20, context: 'moderation', verifier: 'system' }, tier: 'gold', isVisible: true, unlocksPrivilege: 'moderator-tools' },
  
  // ADVOCACY - Impacto externo
  { id: 'review-writer', category: 'advocacy', label: 'Embajador Público', description: 'Redactó reseña verificada en directorio externo', icon: '📝', color: 'text-pink-400', points: 100, criteria: { type: 'validation', target: 1, context: 'external-review', verifier: 'moderator' }, tier: 'silver', isVisible: true },
  { id: 'roadmap-voter', category: 'advocacy', label: 'Co-Creador Roadmap', description: 'Votó 10+ propuestas en módulo ideación', icon: '🗳️', color: 'text-pink-400', points: 100, criteria: { type: 'vote', target: 10, verifier: 'system' }, tier: 'silver', isVisible: true },
  { id: 'referral-champion', category: 'advocacy', label: 'Campeón Referidos', description: '5+ referidos que alcanzaron tier Premium', icon: '🤝', color: 'text-pink-400', points: 500, criteria: { type: 'referral', target: 5, context: 'tier-upgrade', verifier: 'system' }, tier: 'gold', isVisible: true, unlocksPrivilege: 'affiliate-dashboard' },
  
  // STREAKS - Hábitos y constancia
  { id: 'streak-7', category: 'streak', label: 'Semana Activa', description: '7 días consecutivos con actividad', icon: '📅', color: 'text-cyan-400', points: 50, criteria: { type: 'streak', target: 7, verifier: 'system' }, tier: 'bronze', isVisible: true },
  { id: 'streak-30', category: 'streak', label: 'Mes Comprometido', description: '30 días consecutivos', icon: '📆', color: 'text-cyan-400', points: 300, criteria: { type: 'streak', target: 30, verifier: 'system' }, tier: 'silver', isVisible: true },
  { id: 'streak-100', category: 'streak', label: 'Centurión', description: '100 días consecutivos', icon: '💯', color: 'text-cyan-400', points: 1000, criteria: { type: 'streak', target: 100, verifier: 'system' }, tier: 'platinum', isVisible: true },
  
  // CO-CREATION - Ideación y gobernanza
  { id: 'ideation-participant', category: 'co-creation', label: 'Ideador', description: 'Publicó 3+ propuestas en ideación', icon: '💡', color: 'text-violet-400', points: 75, criteria: { type: 'count', target: 3, context: 'ideation', verifier: 'system' }, tier: 'bronze', isVisible: true },
  { id: 'roadmap-architect', category: 'co-creation', label: 'Arquitecto Roadmap', description: 'Propuesta propia implementada en roadmap oficial', icon: '🏗️', color: 'text-violet-400', points: 500, criteria: { type: 'validation', target: 1, context: 'roadmap-implementation', verifier: 'cds' }, tier: 'gold', isVisible: true, unlocksPrivilege: 'roadmap-committee' },
  
  // MENTORSHIP - Apoyo relacional
  { id: 'mentor', category: 'mentorship', label: 'Mentor', description: 'Acompañó 3+ onboarding completados', icon: '🤲', color: 'text-emerald-400', points: 200, criteria: { type: 'count', target: 3, context: 'mentorship', verifier: 'system' }, tier: 'silver', isVisible: true, unlocksPrivilege: 'mentor-channel' }
];

export const CHALLENGE_TEMPLATES: Omit<Challenge, 'id' | 'participants' | 'completions' | 'isActive'>[] = [
  {
    title: 'Primeros Pasos en la Comunidad',
    description: 'Completa tu onboarding y rompe el hielo',
    type: 'weekly', category: 'onboarding',
    startDate: 0, endDate: 7 * 86400000,
    tasks: [
      { id: 't1', description: 'Completa tu perfil 100%', type: 'complete-module', targetCount: 1, pointsPerCompletion: 50, verification: 'system' },
      { id: 't2', description: 'Preséntate en el muro general', type: 'post', targetCount: 1, pointsPerCompletion: 25, verification: 'peer' },
      { id: 't3', description: 'Responde encuesta de bienvenida', type: 'complete-module', targetCount: 1, pointsPerCompletion: 50, verification: 'system' },
      { id: 't4', description: 'Da like a 3 publicaciones de bienvenida', type: 'reply', targetCount: 3, pointsPerCompletion: 10, verification: 'system' },
      { id: 't5', description: 'Únete a un espacio temático', type: 'complete-module', targetCount: 1, pointsPerCompletion: 25, verification: 'system' }
    ],
    rewards: [
      { type: 'badge', value: 'profile-complete', badgeId: 'profile-complete' },
      { type: 'badge', value: 'first-post', badgeId: 'first-post' },
      { type: 'badge', value: 'welcome-survey', badgeId: 'welcome-survey' },
      { type: 'points', value: 150 }
    ]
  },
  {
    title: 'Racha de Conexión Diaria',
    description: 'Conéctate y aporta valor cada día',
    type: 'daily', category: 'streak',
    startDate: 0, endDate: 30 * 86400000,
    tasks: [
      { id: 't1', description: 'Inicia sesión y revisa notificaciones', type: 'post', targetCount: 1, pointsPerCompletion: 5, verification: 'system' },
      { id: 't2', description: 'Aporta en al menos 1 hilo (respuesta, like, vote)', type: 'reply', targetCount: 1, pointsPerCompletion: 10, verification: 'peer' },
      { id: 't3', description: 'Comparte un recurso útil', type: 'post', targetCount: 1, pointsPerCompletion: 20, verification: 'peer' }
    ],
    rewards: [
      { type: 'badge', value: 'streak-7', badgeId: 'streak-7' },
      { type: 'badge', value: 'streak-30', badgeId: 'streak-30' }
    ]
  },
  {
    title: 'Cohorte: Bioconstrucción Avanzada',
    description: 'Programa 4 semanas con entregas semanales',
    type: 'cohort', category: 'expertise',
    startDate: 0, endDate: 28 * 86400000,
    tasks: [
      { id: 'w1', description: 'Semana 1: Entrega plano base bahareque', type: 'guide', targetCount: 1, pointsPerCompletion: 200, verification: 'peer' },
      { id: 'w2', description: 'Semana 2: Calcula mix tierra-paja para tu clima', type: 'complete-module', targetCount: 1, pointsPerCompletion: 150, verification: 'peer' },
      { id: 'w3', description: 'Semana 3: Documenta proceso cocción ladrillos', type: 'guide', targetCount: 1, pointsPerCompletion: 200, verification: 'peer' },
      { id: 'w4', description: 'Semana 4: Construye muro prueba 1m² + métricas', type: 'complete-module', targetCount: 1, pointsPerCompletion: 300, verification: 'peer' }
    ],
    rewards: [
      { type: 'badge', value: 'guide-author', badgeId: 'guide-author' },
      { type: 'znu', value: 500 },
      { type: 'tier-unlock', value: 'premium' }
    ]
  },
  {
    title: 'Embajador de la Semana',
    description: 'Genera impacto visible fuera de la comunidad',
    type: 'weekly', category: 'advocacy',
    startDate: 0, endDate: 7 * 86400000,
    tasks: [
      { id: 't1', description: 'Escribe reseña en directorio externo', type: 'guide', targetCount: 1, pointsPerCompletion: 200, verification: 'moderator' },
      { id: 't2', description: 'Recomienda la comunidad a 3 contactos cualificados', type: 'referral', targetCount: 3, pointsPerCompletion: 100, verification: 'system' },
      { id: 't3', description: 'Participa en AMA público como panelista', type: 'attend', targetCount: 1, pointsPerCompletion: 300, verification: 'moderator' }
    ],
    rewards: [
      { type: 'badge', value: 'review-writer', badgeId: 'review-writer' },
      { type: 'badge', value: 'referral-champion', badgeId: 'referral-champion' },
      { type: 'privilege', value: 'affiliate-dashboard' }
    ]
  }
];

export const DEFAULT_GAMIFICATION_CONFIG: GamificationConfig = {
  activeBadges: BADGE_DEFINITIONS.map(b => b.id),
  activeChallenges: CHALLENGE_TEMPLATES.map((_, i) => `challenge_${i}`),
  activeCampaigns: [],
  leaderboardWeights: { helpfulness: 1.0, expertise: 1.2, advocacy: 1.5, consistency: 0.8 },
  antiGamingSensitivity: 'strict',
  streakFreezeEnabled: true,
  maxStreakFreezeDays: 14
};
```

---

## 3. Motor Principal (CaaSGamificationEngine)

```typescript
// src/core/lib/caasGamification.ts

import { 
  CAAS_TIERS, BADGE_DEFINITIONS, CHALLENGE_TEMPLATES, DEFAULT_GAMIFICATION_CONFIG,
  type MemberGamificationState, type ActivityEvent, type GamificationResult,
  type EarnedBadge, type GamingFlag, type BadgeDefinition, type Challenge,
  type TierDefinition, type CaaSTierKey, type BadgeCategory, type VerificationType
} from '@core/state/caasGamification';

export class CaaSGamificationEngine {
  private memberStates: Map<string, MemberGamificationState> = new Map();
  private challenges: Map<string, Challenge> = new Map();
  private config: GamificationConfig;

  constructor(config?: Partial<GamificationConfig>) {
    this.config = { ...DEFAULT_GAMIFICATION_CONFIG, ...config };
    this.initializeChallenges();
  }

  private initializeChallenges(): void {
    CHALLENGE_TEMPLATES.forEach((template, i) => {
      const challenge: Challenge = {
        ...template,
        id: `challenge_${i}`,
        participants: [],
        completions: [],
        isActive: true
      };
      this.challenges.set(challenge.id, challenge);
    });
  }

  // ============================================================================
  // PÚBLICO: Inicialización y Registro de Actividad
  // ============================================================================

  initializeMember(memberId: string): MemberGamificationState {
    const state: MemberGamificationState = {
      memberId,
      currentTier: 'entry',
      tierProgress: { entry: 1, premium: 0, vip: 0, founder: 0 },
      totalPoints: 0,
      weeklyPoints: 0,
      monthlyPoints: 0,
      badges: [],
      reputationScore: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: 0,
      streakFrozen: false,
      activeChallenges: [],
      completedChallenges: [],
      advocacyPoints: 0,
      advocacyCampaigns: [],
      globalRank: 0,
      tierRank: 0,
      categoryRanks: {},
      gamingFlags: [],
      trustScore: 1.0
    };
    this.memberStates.set(memberId, state);
    return state;
  }

  async recordActivity(memberId: string, activity: ActivityEvent): Promise<GamificationResult> {
    const state = this.memberStates.get(memberId) || this.initializeMember(memberId);
    const result: GamificationResult = { 
      pointsAwarded: 0, badgesEarned: [], tierUpgraded: false, 
      streakUpdated: false, challengesProgressed: [], gamingFlags: [] 
    };

    // 1. Actualizar racha
    this.updateStreak(state, activity);
    if (state.currentStreak > result.streakUpdated) result.streakUpdated = true;

    // 2. Puntos base por tipo actividad
    const basePoints = this.getBasePoints(activity.type);
    state.totalPoints += basePoints;
    state.weeklyPoints += basePoints;
    state.monthlyPoints += basePoints;
    result.pointsAwarded += basePoints;

    // 3. Verificar badges
    const newBadges = this.checkBadges(state, activity);
    for (const badge of newBadges) {
      state.badges.push(badge);
      const badgeDef = BADGE_DEFINITIONS.find(b => b.id === badge.badgeId);
      if (badgeDef) state.reputationScore += badgeDef.points;
      result.badgesEarned.push(badge);
    }

    // 4. Verificar progresión tier
    const tierUpgraded = this.checkTierProgression(state);
    if (tierUpgraded) {
      state.currentTier = tierUpgraded;
      result.tierUpgraded = true;
      result.tierUpgradedTo = tierUpgraded;
    }

    // 5. Progresar desafíos activos
    const challengeProgress = this.progressChallenges(state, activity);
    result.challengesProgressed = challengeProgress;

    // 6. WILLIAM MUIR GUARD - Detectar gaming (anti-superchickens)
    const gamingFlags = this.detectGaming(state, activity);
    if (gamingFlags.length > 0) {
      state.gamingFlags.push(...gamingFlags);
      state.trustScore = Math.max(0, state.trustScore - gamingFlags.length * 0.15);
      result.gamingFlags = gamingFlags;
      for (const flag of gamingFlags) {
        this.applyGamingSanction(state, flag);
      }
    }

    // 7. Actualizar leaderboards (debounced)
    this.scheduleLeaderboardUpdate();

    this.memberStates.set(memberId, state);
    return result;
  }

  // ============================================================================
  // MOTOR DE PUNTOS BASE
  // ============================================================================

  private getBasePoints(activityType: ActivityEvent['type']): number {
    const pointsMap: Record<ActivityEvent['type'], number> = {
      'solution': 100,      // Respuesta validada como solución (alto valor)
      'guide': 50,          // Guía técnica publicada
      'moderation': 30,     // Moderación cívica
      'vote': 5,            // Votación roadmap/ideación
      'attend': 20,         // Asistencia evento/AMA
      'complete-module': 25, // Completar módulo/curso
      'referral': 100,      // Referido que convierte
      'post': 10,           // Publicación general
      'reply': 15,          // Respuesta en hilo
      'login': 5,           // Conexión diaria
    };
    return pointsMap[activityType] || 5;
  }

  // ============================================================================
  // VERIFICACIÓN BADGES
  // ============================================================================

  private checkBadges(state: MemberGamificationState, activity: ActivityEvent): EarnedBadge[] {
    const earned: EarnedBadge[] = [];
    const now = Date.now();

    for (const badgeDef of BADGE_DEFINITIONS) {
      // Skip si ya lo tiene
      if (state.badges.some(b => b.badgeId === badgeDef.id)) continue;
      // Skip si no está activo en config
      if (!this.config.activeBadges.includes(badgeDef.id)) continue;

      const meets = this.evaluateBadgeCriteria(state, activity, badgeDef);
      if (meets) {
        earned.push({
          badgeId: badgeDef.id,
          earnedAt: now,
          context: `Actividad: ${activity.type}${activity.targetId ? ` → ${activity.targetId}` : ''}`,
          verifier: badgeDef.criteria.verifier || 'system',
          isDisplayed: true
        });
      }
    }
    return earned;
  }

  private evaluateBadgeCriteria(state: MemberGamificationState, activity: ActivityEvent, badge: BadgeDefinition): boolean {
    const { criteria } = badge;
    
    switch (criteria.type) {
      case 'count':
        return this.getActivityCount(state.memberId, criteria.context || activity.type) >= criteria.target;
      case 'streak':
        return state.currentStreak >= criteria.target;
      case 'validation':
        return this.getValidatedSolutionsCount(state.memberId) >= criteria.target;
      case 'vote':
        return this.getVotesCount(state.memberId) >= criteria.target;
      case 'referral':
        return this.getReferralsCount(state.memberId) >= criteria.target;
      case 'completion':
        return this.isModuleCompleted(state.memberId, criteria.context);
      default:
        return false;
    }
  }

  // ============================================================================
  // PROGRESIÓN TIER (Niveles + Acceso Modular)
  // ============================================================================

  private checkTierProgression(state: MemberGamificationState): CaaSTierKey | false {
    const tiers: CaaSTierKey[] = ['entry', 'premium', 'vip', 'founder'];
    const currentIdx = tiers.indexOf(state.currentTier);
    
    // Verificar siguiente tier
    if (currentIdx < tiers.length - 1) {
      const nextTier = tiers[currentIdx + 1];
      const tierDef = CAAS_TIERS[nextTier];
      
      // Verificar requisitos (todos deben cumplirse)
      const aut = this.getMemberAUT(state.memberId);
      const cds = this.getMemberCDS(state.memberId);
      const znuStake = this.getMemberZNUStake(state.memberId);
      const valueFlows = this.getMemberValueFlows(state.memberId);
      
      if (aut >= tierDef.requiredAUT && 
          cds >= tierDef.requiredCDS && 
          znuStake >= tierDef.requiredZNUstake && 
          valueFlows >= tierDef.requiredValueFlows) {
        // Actualizar progreso visual
        state.tierProgress[nextTier] = 1;
        return nextTier;
      } else {
        // Calcular progreso parcial (0-1)
        const progress = Math.min(1, (
          (aut / tierDef.requiredAUT || 0) * 0.3 +
          (cds / tierDef.requiredCDS || 0) * 0.3 +
          (znuStake / tierDef.requiredZNUstake || 0) * 0.2 +
          (valueFlows / tierDef.requiredValueFlows || 0) * 0.2
        ));
        state.tierProgress[nextTier] = progress;
      }
    }
    return false;
  }

  // ============================================================================
  // RACHAS (STREAKS)
  // ============================================================================

  private updateStreak(state: MemberGamificationState, activity: ActivityEvent): void {
    const today = new Date(activity.timestamp).setHours(0,0,0,0);
    const lastDate = new Date(state.lastActivityDate).setHours(0,0,0,0);
    const diffDays = (today - lastDate) / 86400000;

    if (diffDays === 1) {
      // Día consecutivo
      state.currentStreak += 1;
      state.longestStreak = Math.max(state.longestStreak, state.currentStreak);
    } else if (diffDays > 1) {
      // Rachas rotas (salvo freeze)
      if (!state.streakFrozen) {
        state.currentStreak = 1;
      }
    }
    // diffDays === 0: mismo día, no cambia
    
    state.lastActivityDate = activity.timestamp;
  }

  // ============================================================================
  // DESAFÍOS (CHALLENGES)
  // ============================================================================

  private progressChallenges(state: MemberGamificationState, activity: ActivityEvent): string[] {
    const progressed: string[] = [];
    
    for (const challengeId of state.activeChallenges) {
      const challenge = this.challenges.get(challengeId);
      if (!challenge || !challenge.isActive) continue;
      
      for (const task of challenge.tasks) {
        if (this.taskMatchesActivity(task, activity)) {
          const completion: ChallengeCompletion = {
            memberId: state.memberId,
            taskId: task.id,
            completedAt: Date.now(),
            verified: task.verification === 'system',
            verifiedBy: task.verification === 'system' ? 'system' : 'pending',
            evidence: activity.metadata?.evidence
          };
          challenge.completions.push(completion);
          
          // Otorgar puntos por tarea
          state.totalPoints += task.pointsPerCompletion;
          state.weeklyPoints += task.pointsPerCompletion;
          state.monthlyPoints += task.pointsPerCompletion;
          
          // Verificar si challenge completado
          const completedTasks = challenge.completions.filter(c => c.memberId === state.memberId && c.verified).length;
          if (completedTasks >= challenge.tasks.length) {
            this.completeChallenge(state, challenge);
          }
        }
      }
      progressed.push(challengeId);
    }
    return progressed;
  }

  private taskMatchesActivity(task: ChallengeTask, activity: ActivityEvent): boolean {
    return task.type === activity.type;
  }

  private completeChallenge(state: MemberGamificationState, challenge: Challenge): void {
    challenge.isActive = false;
    state.completedChallenges.push({
      challengeId: challenge.id,
      completedAt: Date.now(),
      tasksCompleted: challenge.tasks.length,
      totalTasks: challenge.tasks.length,
      rewardsClaimed: false
    });
    
    // Aplicar recompensas
    for (const reward of challenge.rewards) {
      this.applyReward(state, reward);
    }
  }

  private applyReward(state: MemberGamificationState, reward: ChallengeReward): void {
    switch (reward.type) {
      case 'badge':
        if (reward.badgeId && !state.badges.some(b => b.badgeId === reward.badgeId)) {
          state.badges.push({ badgeId: reward.badgeId!, earnedAt: Date.now(), context: `Challenge reward`, verifier: 'system', isDisplayed: true });
        }
        break;
      case 'points':
        const pts = typeof reward.value === 'number' ? reward.value : parseInt(reward.value as string);
        state.totalPoints += pts;
        state.reputationScore += pts;
        break;
      case 'znu':
        // Se maneja vía integración ITC (ver sección integración)
        break;
      case 'tier-unlock':
        const targetTier = reward.value as CaaSTierKey;
        const tiers: CaaSTierKey[] = ['entry', 'premium', 'vip', 'founder'];
        const currentIdx = tiers.indexOf(state.currentTier);
        const targetIdx = tiers.indexOf(targetTier);
        if (targetIdx > currentIdx) state.currentTier = targetTier;
        break;
      case 'privilege':
        // Privilegios se manejan en UI/permisos
        break;
    }
  }

  // ============================================================================
  // WILLIAM MUIR GUARD - Anti-Superchickens (CRÍTICO)
  // ============================================================================

  private detectGaming(state: MemberGamificationState, activity: ActivityEvent): GamingFlag[] {
    const flags: GamingFlag[] = [];
    const now = Date.now();
    const memberId = state.memberId;

    // 1. VOLUME SPAM: >50 acciones/hora
    const recentActions = this.getRecentActions(memberId, 3600000);
    if (recentActions.length > 50) {
      flags.push({ 
        id: `gaming_${now}_${Math.random().toString(36).slice(2,6)}`,
        type: 'volume_spam', detectedAt: now, severity: 'high', 
        evidence: [`${recentActions.length} actions in 1h`], 
        actionTaken: 'warning', resolvedAt: null 
      });
    }

    // 2. SELF-VOTING / CIRCLE JERK: Votar propio contenido o círculo cerrado
    if (activity.type === 'vote' && activity.targetId) {
      if (this.isSelfVotePattern(memberId, activity.targetId)) {
        flags.push({ 
          id: `gaming_${now}_${Math.random().toString(36).slice(2,6)}`,
          type: 'self_voting', detectedAt: now, severity: 'critical', 
          evidence: ['Self-vote pattern detected'], 
          actionTaken: 'points_revoked', resolvedAt: null 
        });
      }
      if (this.isCircleJerkPattern(memberId, activity.targetId)) {
        flags.push({ 
          id: `gaming_${now}_${Math.random().toString(36).slice(2,6)}`,
          type: 'circle_jerk', detectedAt: now, severity: 'high', 
          evidence: ['Reciprocal voting ring detected'], 
          actionTaken: 'points_revoked', resolvedAt: null 
        });
      }
    }

    // 3. POINT FARMING: Alto volumen, baja ratio validación
    if (state.totalPoints > 10000 && state.reputationScore > 0) {
      const ratio = state.reputationScore / state.totalPoints;
      if (ratio < 0.1) {
        flags.push({ 
          id: `gaming_${now}_${Math.random().toString(36).slice(2,6)}`,
          type: 'point_farming', detectedAt: now, severity: 'medium', 
          evidence: [`High volume (${state.totalPoints}), low validation ratio (${ratio.toFixed(2)})`], 
          actionTaken: 'warning', resolvedAt: null 
        });
      }
    }

    // 4. BOT BEHAVIOR: Timing determinístico, sin varianza
    if (this.isBotPattern(memberId)) {
      flags.push({ 
        id: `gaming_${now}_${Math.random().toString(36).slice(2,6)}`,
        type: 'bot_behavior', detectedAt: now, severity: 'critical', 
        evidence: ['Deterministic timing patterns, no human variance'], 
        actionTaken: 'shadow_ban', resolvedAt: null 
      });
    }

    return flags;
  }

  private applyGamingSanction(state: MemberGamificationState, flag: GamingFlag): void {
    switch (flag.actionTaken) {
      case 'points_revoked':
        const revokeAmount = Math.floor(state.totalPoints * 0.15);
        state.totalPoints = Math.max(0, state.totalPoints - revokeAmount);
        state.reputationScore = Math.max(0, state.reputationScore - revokeAmount);
        break;
      case 'badge_revoked':
        const revocable = state.badges.filter(b => !BADGE_DEFINITIONS.find(d => d.id === b.badgeId)?.unlocksPrivilege);
        if (revocable.length > 0) {
          const removed = revocable.pop()!;
          state.badges = state.badges.filter(b => b !== removed);
        }
        break;
      case 'tier_downgrade':
        const tiers: CaaSTierKey[] = ['entry', 'premium', 'vip', 'founder'];
        const currentIdx = tiers.indexOf(state.currentTier);
        if (currentIdx > 0) state.currentTier = tiers[currentIdx - 1];
        break;
      case 'shadow_ban':
        state.trustScore = 0;
        break;
      case 'warning':
        // Solo logging, ya incluido en flag
        break;
    }
  }

  // ============================================================================
  // LEADERBOARDS
  // ============================================================================

  private leaderboardUpdateScheduled = false;
  private scheduleLeaderboardUpdate(): void {
    if (this.leaderboardUpdateScheduled) return;
    this.leaderboardUpdateScheduled = true;
    setTimeout(() => {
      this.updateLeaderboards();
      this.leaderboardUpdateScheduled = false;
    }, 5000); // Debounce 5s
  }

  private updateLeaderboards(): void {
    const entries: LeaderboardEntry[] = [];
    for (const [memberId, state] of this.memberStates) {
      entries.push({
        memberId,
        rank: 0, // Se calcula después del sort
        score: state.reputationScore,
        tier: state.currentTier,
        badgesCount: state.badges.length
      });
    }
    entries.sort((a, b) => b.score - a.score);
    entries.forEach((e, i) => e.rank = i + 1);
    
    // Global
    // this.state.leaderboards.global = entries; // En store real
    
    // By tier
    for (const tier of ['entry', 'premium', 'vip', 'founder'] as CaaSTierKey[]) {
      // this.state.leaderboards.byTier[tier] = entries.filter(e => e.tier === tier);
    }
    
    // By category (would need category scores)
  }

  // ============================================================================
  // HELPERS (Stubs - integrar con store real)
  // ============================================================================

  private getActivityCount(memberId: string, type: string): number { return 0; }
  private getValidatedSolutionsCount(memberId: string): number { return 0; }
  private getVotesCount(memberId: string): number { return 0; }
  private getReferralsCount(memberId: string): number { return 0; }
  private isModuleCompleted(memberId: string, module: string): boolean { return false; }
  private getMemberAUT(memberId: string): number { return 0; }
  private getMemberCDS(memberId: string): number { return 0; }
  private getMemberZNUStake(memberId: string): number { return 0; }
  private getMemberValueFlows(memberId: string): number { return 0; }
  private getRecentActions(memberId: string, windowMs: number): ActivityEvent[] { return []; }
  private isSelfVotePattern(memberId: string, targetId: string): boolean { return false; }
  private isCircleJerkPattern(memberId: string, targetId: string): boolean { return false; }
  private isBotPattern(memberId: string): boolean { return false; }
  
  // Metodología Fase 1: Alineación estratégica
  alignWithBusinessGoal(goal: 'deflection' | 'education' | 'advocacy' | 'retention'): GamificationConfig {
    // Activar/desactivar badges/challenges/campañas según objetivo
    return this.config;
  }
  
  // Metodología Fase 2: Activación progresiva (lurkers)
  getOnboardingChallenges(memberId: string): Challenge[] {
    return Array.from(this.challenges.values()).filter(c => c.category === 'onboarding' && c.isActive);
  }
  
  // Metodología Fase 3: Activity Scoring + IA
  calculateActivityScore(memberId: string): ActivityScore {
    const state = this.memberStates.get(memberId);
    if (!state) return { overall: 0, helpfulness: 0, expertise: 0, advocacy: 0, consistency: 0, trustworthiness: 1 };
    return {
      overall: state.reputationScore,
      helpfulness: state.badges.filter(b => BADGE_DEFINITIONS.find(d => d.id === b.badgeId)?.category === 'helpfulness').length * 100,
      expertise: state.badges.filter(b => BADGE_DEFINITIONS.find(d => d.id === b.badgeId)?.category === 'expertise').length * 100,
      advocacy: state.advocacyPoints,
      consistency: state.currentStreak * 10,
      trustworthiness: state.trustScore
    };
  }
  
  // Metodología Fase 4: CRM Integration placeholder
  async syncToCRM(memberId: string, crm: 'salesforce' | 'hubspot' | 'gainsight'): Promise<void> {
    // Implementar sincronización real con CRM
  }
}
```

---

## 4. Integración con Store (Zustand)

```typescript
// En store.ts - agregar slice caasGamification

interface CaaSGamificationSlice {
  gamificationEngine: CaaSGamificationEngine;
  memberGamification: Map<string, MemberGamificationState>;
  challenges: Map<string, Challenge>;
  config: GamificationConfig;
  leaderboards: { global: LeaderboardEntry[]; byTier: Record<CaaSTierKey, LeaderboardEntry[]>; byCategory: Record<string, LeaderboardEntry[]> };
  
  // Acciones
  initializeMemberGamification: (memberId: string) => MemberGamificationState;
  recordGamificationActivity: (memberId: string, activity: ActivityEvent) => Promise<GamificationResult>;
  getMemberGamification: (memberId: string) => MemberGamificationState | undefined;
  joinChallenge: (memberId: string, challengeId: string) => boolean;
  claimChallengeRewards: (memberId: string, challengeId: string) => ChallengeReward[];
  updateGamificationConfig: (config: Partial<GamificationConfig>) => void;
  getLeaderboard: (type: 'global' | 'tier' | 'category', tier?: CaaSTierKey, category?: string) => LeaderboardEntry[];
  syncMemberToCRM: (memberId: string, crm: 'salesforce' | 'hubspot' | 'gainsight') => Promise<void>;
  runLeaderboardUpdate: () => void;
}
```

---

## 5. Pantalla CaaSGamification.tsx

```tsx
// src/app/screens/CaaSGamification.tsx

export function CaaSGamificationScreen() {
  const { 
    memberGamification, 
    recordGamificationActivity, 
    getMemberGamification,
    joinChallenge,
    claimChallengeRewards,
    getLeaderboard,
    updateGamificationConfig,
    config,
    challenges 
  } = useAppStore();

  const currentMember = getMemberGamification(currentUserId);
  const [activeTab, setActiveTab] = useState<'tiers' | 'badges' | 'challenges' | 'advocacy' | 'config'>('tiers');

  return (
    <div className="p-6 space-y-6">
      <Header title="CaaS Gamificación" subtitle="4 Modelos + Metodología 4 Fases + Anti-Muir Guard" />
      
      {/* Member Status Card */}
      {currentMember && (
        <MemberStatusCard 
          state={currentMember}
          tiers={CAAS_TIERS}
          onActivity={recordActivity}
        />
      )}

      <Tabs defaultValue="tiers" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="tiers">Niveles + Acceso Modular</TabsTrigger>
          <TabsTrigger value="badges">Reputación + Badges + Leaderboards</TabsTrigger>
          <TabsTrigger value="challenges">Rachas + Desafíos + Hábitos</TabsTrigger>
          <TabsTrigger value="advocacy">Abogacía + Co-Creación</TabsTrigger>
          <TabsTrigger value="config">Config + Anti-Gaming</TabsTrigger>
        </TabsList>

        <TabsContent value="tiers">
          <TierProgressionPanel tiers={CAAS_TIERS} memberState={currentMember} />
        </TabsContent>

        <TabsContent value="badges">
          <BadgesLeaderboardPanel 
            badges={BADGE_DEFINITIONS} 
            memberState={currentMember}
            leaderboard={getLeaderboard('global')}
            tierLeaderboards={getLeaderboard('tier')}
          />
        </TabsContent>

        <TabsContent value="challenges">
          <ChallengesPanel 
            templates={CHALLENGE_TEMPLATES}
            activeChallenges={currentMember?.activeChallenges || []}
            availableChallenges={Array.from(challenges.values())}
            onJoin={joinChallenge}
            onClaim={claimChallengeRewards}
          />
        </TabsContent>

        <TabsContent value="advocacy">
          <AdvocacyPanel 
            campaigns={advocacyCampaigns}
            memberState={currentMember}
          />
        </TabsContent>

        <TabsContent value="config">
          <GamificationConfigPanel 
            config={config}
            onUpdate={updateGamificationConfig}
            memberState={currentMember}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

---

## 6. Criterios de Aceptación

### Modelo 1: Niveles + Acceso Modular
- [ ] 4 Tieres (Entry/Premium/VIP/Founder) con requisitos AUT/CDS/ZNU/ValueFlows
- [ ] Espacios modulares desbloqueados por tier (general → cursos → masterminds → treasury)
- [ ] Progresión visual tierProgress 0-1 por requisito
- [ ] Leaderboard weight por tier

### Modelo 2: Reputación + Badges + Leaderboards
- [ ] 25+ Badges en 8 categorías con criteria verificables
- [ ] Criteria types: count, streak, validation, vote, referral, completion
- [ ] Verificadores: self, peer, system, moderator, cds
- [ ] Privilegios desbloqueados (expert-channel, moderator-tools, affiliate-dashboard, etc.)
- [ ] Leaderboards global, por tier, por categoría con pesos configurables

### Modelo 3: Rachas + Desafíos + Hábitos
- [ ] Challenge templates: onboarding (semanal), daily streak (30d), cohort (28d), advocacy (semanal)
- [ ] Task types: post, reply, solution, vote, guide, attend, complete-module, referral
- [ ] Verificación: self, peer, system, moderator, cds
- [ ] Rewards: badge, points, znu, tier-unlock, privilege, physical
- [ ] Auto-completación challenge → recompensas aplicadas

### Modelo 4: Abogacía + Co-Creación
- [ ] Advocacy campaigns con objetivos: reviews, referrals, roadmap, references, content, events
- [ ] Acciones verificables externamente (externalUrl para reviews)
- [ ] Rewards: tier-upgrade, exclusive-access, governance-seat, physical-gift
- [ ] KPIs medibles por campaña

### Motor Unificado + Metodología 4 Fases
- [ ] recordActivity → points/badges/tier/streak/challenges/gamingFlags
- [ ] Fase 1: alignWithBusinessGoal() configura activeBadges/challenges/campaigns
- [ ] Fase 2: getOnboardingChallenges() para lurkers
- [ ] Fase 3: calculateActivityScore() multidimensional (helpfulness, expertise, advocacy, consistency, trustworthiness)
- [ ] Fase 4: syncToCRM() mapea reputationScore, badges, tier, trustScore, CHI

### William Muir Guard (Anti-Superchickens)
- [ ] detectGaming(): volume_spam (>50/hr), self_voting, circle_jerk, point_farming (ratio<0.1), bot_behavior
- [ ] Sanciones: points_revoked (15%), badge_revoked (no privilege), tier_downgrade, shadow_ban (trustScore=0)
- [ ] trustScore dinámico (0-1) reduce con cada flag
- [ ] Logging completo para auditoría

### Integración Arquitectura
- [ ] Rewards type 'znu' → ITC awardCreditsFull() + ledger entry
- [ ] Rewards type 'tier-unlock' → upgradeMemberTier()
- [ ] Activity events → FRS signal_packets (ingestIntegralSignal)
- [ ] Gaming flags → FRS critical signals
- [ ] Leaderboard updates → FRS periodic signals

---

## Referencias Normativas

- **Documento fuente**: "Plataformas de Comunidades CaaS.txt" — Modelos gamificación + Metodología 4 fases
- **William Muir**: Selección grupal vs individual → Anti-superchickens guard
- **Choice Architecture (Thaler/Sunstein)**: Nudges, defaults, visibility → Diseño incentivos
- **CaaS_integration.md**: CaaS-BM actual (stake ZNU, AUT/CDS, revenue streams, MJ gate)
- **Integral Devguide v0.1**: ITC (rewards ZNU), FRS (signals), CDS (governance)