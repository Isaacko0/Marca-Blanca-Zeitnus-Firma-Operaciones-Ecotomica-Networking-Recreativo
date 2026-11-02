# Plataformas de Comunidades CaaS — Integración Zeitnus (HSCSG v15 OS)

**Fuente**: `Downloads/Desktop/HSCSG dinero flores/Gamificacion HSCSG/Plataformas de Comunidades CaaS.txt`  
**Contenido**: Comparativa plataformas 2026 + Modelos negocio CaaS + Incentivos + Fidelidad + ROI + Gamificación (4 modelos + metodología 4 fases) + William Muir + Arquitectura de la decisión + Economía del Donut  
**Fecha asimilación**: Octubre 2026

---

## Resumen Ejecutivo

Este documento sintetiza **inteligencia de mercado 2026** sobre Community as a Service (CaaS) y su ecosistema de gamificación/incentivos/fidelidad/ROI. Lo crítico para HSCSG v15 OS:

1. **CaaS-BM ya implementado en Zeitnus** (docs/CaaS_integration.md) — Coherente con hallazgos de mercado
2. **Gaps identificados**: Gamificación estructurada, ROI dashboard, Community Health Index, CRM sync
3. **Fundamentos teóricos validados**: William Muir (anti-superchickens), Choice Architecture (Thaler/Sunstein), Doughnut Economics (Raworth) — Alineados con MJ/HSCSG

**Relación con repos existentes:**
- `docs/CaaS_integration.md` = Implementación actual CaaS-BM (postmonetario, ZNU, AUT/CDS)
- `src/core/lib/caas.ts` + `src/core/state/caas.ts` + `src/app/screens/CaaS.tsx` = Código vivo
- `src/core/state/integral.ts` (ITC/FRS/CDS) = Donde integra gamificación/fidelidad/ROI
- **ESTE DOC** = Specs para cerrar gaps y evolucionar a CaaS-BM v2.0

---

## Mapeo Concepto Mercado → Zeitnus/HSCSG

| Concepto Mercado (2026) | CaaS-BM Actual (Zeitnus) | Estado | Gap / Acción |
|---|---|---|---|
| **SaaS Infraestructura** (Skool/Circle/Mighty/Bettermode/Hivebrite/Khoros) | Módulo `/caas` nativo offline-first | ✅ Base | Falta: White-label mobile, SSO enterprise |
| **Agency Retainers** (servicios gestionados) | Orquestación (Paperclip) + Autómata | ⚠️ Parcial | Falta: Marketplace agencias verificadas |
| **Monetización directa** (membresías, cursos, eventos, sponsors, job board) | Revenue streams: stake ZNU, AUT-share, peer services, afiliados verdes, contenido ZNU | ✅ Completo | Falta: Stripe/USDC bridge para nodeMode='conectado' |
| **Enterprise Economics** (deflexión soporte, aceleración ventas, retención) | Integral: FRS→CDS, ITC decay, CDS governance | ⚠️ Parcial | **CRÍTICO**: Community Health Index + CRM sync + ROI dashboard |
| **Gamificación** (4 modelos) | ZNU demurrage + Vesting + Solarpunk offers/needs | ❌ **Gap mayor** | **P0**: Implementar 4 modelos + metodología 4 fases |
| **Fidelidad/Retención** (peer support, CRM health scoring, knowledge base, AI rituals) | Colaberry + FRS + Lucidez | ⚠️ Parcial | **P0**: Community Health Index predictivo + re-engagement automatizado |
| **ROI CaaS** (SDS formula, ROI integrado, benchmarks, payback 12-18m) | Métricas AUT/PGS/ICS/PMRTE | ❌ **Gap** | **P0**: CaaS ROI Calculator + SDS tracker |
| **William Muir / Choice Architecture** | MJ Leyes I/II/III + Autómata soberano | ✅ Filosóficamente alineado | **P1**: Anti-superchickens guard en gamificación |
| **Doughnut Economics** | Base Material (suelo) + AUT/Techo + Regenerativo | ✅ Estructuralmente alineado | **P1**: Safe & Just Space dashboard |

---

## Specs de Implementación (Prioridad P0)

### 1. Gamificación Estructurada (4 Modelos + Metodología 4 Fases)

```typescript
// src/core/lib/caasGamification.ts

// ============================================================================
// MODELO 1: Progresión por Niveles + Acceso Modular (Skool/Mighty Pro style)
// ============================================================================

export type CaaSTierKey = 'entry' | 'premium' | 'vip' | 'founder';

export interface TierDefinition {
  key: CaaSTierKey;
  label: string;
  description: string;
  // Requisitos (ganados, no comprados)
  requiredAUT: number;           // Coeficiente Autonomía mínimo
  requiredCDS: number;           // Participación gobernanza mínima
  requiredZNUstake: number;      // Stake ZNU bloqueado
  requiredValueFlows: number;    // Labor/Love/Care/Repair/Manufacture events
  // Beneficios desbloqueados
  unlockedSpaces: string[];      // IDs de espacios modulares
  maxConcurrentProjects: number;
  accessToMasterminds: boolean;
  accessToAMAs: boolean;
  betaFeaturesAccess: boolean;
  // Gamificación visual
  badgeIcon: string;
  badgeColor: string;
  leaderboardWeight: number;     // Peso en tablas clasificación
}

export const CAAS_TIERS: Record<CaaSTierKey, TierDefinition> = {
  entry: {
    key: 'entry',
    label: 'Explorador',
    description: 'Acceso general, muro comunidad, onboarding guiado',
    requiredAUT: 0,
    requiredCDS: 0,
    requiredZNUstake: 0,
    requiredValueFlows: 0,
    unlockedSpaces: ['general', 'onboarding', 'ayuda'],
    maxConcurrentProjects: 1,
    accessToMasterminds: false,
    accessToAMAs: false,
    betaFeaturesAccess: false,
    badgeIcon: '🌱',
    badgeColor: 'text-green-400',
    leaderboardWeight: 1
  },
  premium: {
    key: 'premium',
    label: 'Colaborador',
    description: 'Cursos, eventos, marketplace peer, espacios temáticos',
    requiredAUT: 0.3,
    requiredCDS: 3,
    requiredZNUstake: 100,
    requiredValueFlows: 10,
    unlockedSpaces: ['general', 'cursos', 'eventos', 'marketplace', 'tematicos'],
    maxConcurrentProjects: 3,
    accessToMasterminds: false,
    accessToAMAs: true,
    betaFeaturesAccess: true,
    badgeIcon: '🔧',
    badgeColor: 'text-blue-400',
    leaderboardWeight: 2
  },
  vip: {
    key: 'vip',
    label: 'Embajador',
    description: 'Masterminds, Office Hours directivos, beta features, gobernanza',
    requiredAUT: 0.6,
    requiredCDS: 10,
    requiredZNUstake: 500,
    requiredValueFlows: 50,
    unlockedSpaces: ['all', 'masterminds', 'office-hours', 'gobernanza', 'beta'],
    maxConcurrentProjects: 10,
    accessToMasterminds: true,
    accessToAMAs: true,
    betaFeaturesAccess: true,
    badgeIcon: '💎',
    badgeColor: 'text-purple-400',
    leaderboardWeight: 5
  },
  founder: {
    key: 'founder',
    label: 'Fundador',
    description: 'Acceso total, treasury, arquitectura, fundadores circle',
    requiredAUT: 0.9,
    requiredCDS: 25,
    requiredZNUstake: 2000,
    requiredValueFlows: 200,
    unlockedSpaces: ['all', 'treasury', 'arquitectura', 'founders-circle'],
    maxConcurrentProjects: 99,
    accessToMasterminds: true,
    accessToAMAs: true,
    betaFeaturesAccess: true,
    badgeIcon: '👑',
    badgeColor: 'text-gold-400',
    leaderboardWeight: 10
  }
};

// ============================================================================
// MODELO 2: Reputación Social + Badges + Leaderboards (Circle/Bettermode style)
// ============================================================================

export type BadgeCategory = 
  | 'helpfulness'      // Respuestas validadas como solución
  | 'onboarding'       // Completar perfil, bienvenida, primera publicación
  | 'expertise'        // Guías técnicas, documentación, code reviews
  | 'moderation'       // Moderación cívica, reportes válidos
  | 'advocacy'         // Reseñas, referidos, roadmap voting
  | 'streak'           // Rachas de actividad consecutiva
  | 'co-creation'      // Ideación, roadmap voting, diseño colaborativo
  | 'mentorship';      // Acompañar nuevos miembros

export interface BadgeDefinition {
  id: string;
  category: BadgeCategory;
  label: string;
  description: string;
  icon: string;
  color: string;
  points: number;                    // Puntos reputación otorgados
  criteria: BadgeCriteria;           // Cómo se gana
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  isVisible: boolean;                // Público en perfil
  unlocksPrivilege?: string;         // Privilegio desbloqueado (ej: 'moderator-tools')
}

export interface BadgeCriteria {
  type: 'count' | 'streak' | 'validation' | 'vote' | 'referral' | 'completion';
  target: number;                    // Cantidad objetivo
  context?: string;                  // Contexto específico
  verifier?: 'peer' | 'system' | 'moderator' | 'cds'; // Quién valida
}

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

// ============================================================================
// MODELO 3: Rachas, Desafíos, Hábitos (Mighty Pro style)
// ============================================================================

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'cohort';
  category: BadgeCategory;
  startDate: number;
  endDate: number;
  tasks: ChallengeTask[];
  rewards: ChallengeReward[];
  participants: string[];            // member IDs
  completions: ChallengeCompletion[];
  isActive: boolean;
}

export interface ChallengeTask {
  id: string;
  description: string;
  type: 'post' | 'reply' | 'solution' | 'vote' | 'guide' | 'attend' | 'complete-module' | 'referral';
  targetCount: number;
  pointsPerCompletion: number;
  verification: 'self' | 'peer' | 'system' | 'moderator';
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

// Challenge templates (fase 2: activación progresiva)
export const CHALLENGE_TEMPLATES: Omit<Challenge, 'id' | 'participants' | 'completions' | 'isActive'>[] = [
  // ONBOARDING (baja fricción, primera semana)
  {
    title: 'Primeros Pasos en la Comunidad',
    description: 'Completa tu onboarding y rompe el hielo',
    type: 'weekly',
    category: 'onboarding',
    startDate: 0, // relative
    endDate: 7 * 86400000,
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
  
  // HÁBITO DIARIO (constancia)
  {
    title: 'Racha de Conexión Diaria',
    description: 'Conéctate y aporta valor cada día',
    type: 'daily',
    category: 'streak',
    startDate: 0,
    endDate: 30 * 86400000,
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
  
  // COHORTE EDUCATIVA (Mighty Pro style)
  {
    title: 'Cohorte: Bioconstrucción Avanzada',
    description: 'Programa 4 semanas con entregas semanales',
    type: 'cohort',
    category: 'expertise',
    startDate: 0,
    endDate: 28 * 86400000,
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
  
  // ADVOCACY (impacto externo)
  {
    title: 'Embajador de la Semana',
    description: 'Genera impacto visible fuera de la comunidad',
    type: 'weekly',
    category: 'advocacy',
    startDate: 0,
    endDate: 7 * 86400000,
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

// ============================================================================
// MODELO 4: Abogacía y Co-Creación (Influitive/Gainsight style)
// ============================================================================

export interface AdvocacyCampaign {
  id: string;
  title: string;
  description: string;
  objective: 'reviews' | 'referrals' | 'roadmap' | 'references' | 'content' | 'events';
  targetAudience: string[];          // tier keys o segmentos
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
  verification: 'self' | 'peer' | 'platform' | 'external';
  externalUrl?: string;              // Para verificación externa
}

export interface AdvocacyReward {
  type: 'points' | 'badge' | 'znu' | 'tier-upgrade' | 'exclusive-access' | 'physical-gift' | 'governance-seat';
  value: string | number;
  threshold: number;                 // Puntos mínimos para reclamar
}

// ============================================================================
// MOTOR DE GAMIFICACIÓN UNIFICADO
// ============================================================================

export interface MemberGamificationState {
  memberId: string;
  // Progresión
  currentTier: CaaSTierKey;
  tierProgress: { [key in CaaSTierKey]?: number }; // 0-1 progreso hacia cada tier
  totalPoints: number;
  weeklyPoints: number;
  monthlyPoints: number;
  // Reputación
  badges: EarnedBadge[];
  reputationScore: number;           // Puntos totales ponderados
  // Rachas
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: number;
  streakFrozen: boolean;             // Protección vacaciones/enfermedad
  // Desafíos
  activeChallenges: string[];        // challenge IDs
  completedChallenges: CompletedChallenge[];
  // Abogacía
  advocacyPoints: number;
  advocacyCampaigns: string[];
  // Leaderboards
  globalRank: number;
  tierRank: number;
  categoryRanks: { [category: string]: number };
  // Anti-gaming (William Muir guard)
  gamingFlags: GamingFlag[];
  trustScore: number;                // 0-1, baja si gaming detectado
}

export interface EarnedBadge {
  badgeId: string;
  earnedAt: number;
  context: string;                   // Qué acción lo generó
  verifier: string;
  isDisplayed: boolean;
}

export interface CompletedChallenge {
  challengeId: string;
  completedAt: number;
  tasksCompleted: number;
  totalTasks: number;
  rewardsClaimed: boolean;
}

export interface GamingFlag {
  type: 'volume_spam' | 'self_voting' | 'circle_jerk' | 'bot_behavior' | 'point_farming';
  detectedAt: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  evidence: string[];
  actionTaken: 'warning' | 'points_revoked' | 'badge_revoked' | 'tier_downgrade' | 'shadow_ban' | 'suspended';
  resolvedAt: number | null;
}

// Motor principal
export class CaaSGamificationEngine {
  private memberStates: Map<string, MemberGamificationState> = new Map();
  private challenges: Map<string, Challenge> = new Map();
  private advocacyCampaigns: Map<string, AdvocacyCampaign> = new Map();
  
  // Inicializar miembro
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
  
  // Registrar actividad → procesar gamificación
  async recordActivity(memberId: string, activity: ActivityEvent): Promise<GamificationResult> {
    const state = this.memberStates.get(memberId) || this.initializeMember(memberId);
    const result: GamificationResult = { pointsAwarded: 0, badgesEarned: [], tierUpgraded: false, streakUpdated: false, challengesProgressed: [], gamingFlags: [] };
    
    // 1. Actualizar racha
    this.updateStreak(state, activity);
    
    // 2. Otorgar puntos base por tipo actividad
    const basePoints = this.getBasePoints(activity);
    state.totalPoints += basePoints;
    state.weeklyPoints += basePoints;
    state.monthlyPoints += basePoints;
    result.pointsAwarded += basePoints;
    
    // 3. Verificar badges
    const newBadges = this.checkBadges(state, activity);
    for (const badge of newBadges) {
      state.badges.push(badge);
      state.reputationScore += BADGE_DEFINITIONS.find(b => b.id === badge.badgeId)?.points || 0;
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
    
    // 6. DETECTAR GAMING (William Muir guard)
    const gamingFlags = this.detectGaming(state, activity);
    if (gamingFlags.length > 0) {
      state.gamingFlags.push(...gamingFlags);
      state.trustScore = Math.max(0, state.trustScore - gamingFlags.length * 0.1);
      result.gamingFlags = gamingFlags;
      // Aplicar sanciones automáticas
      for (const flag of gamingFlags) {
        this.applyGamingSanction(state, flag);
      }
    }
    
    // 7. Actualizar leaderboards (async)
    this.updateLeaderboards(state);
    
    this.memberStates.set(memberId, state);
    return result;
  }
  
  // William Muir Anti-Superchickens Guard
  private detectGaming(state: MemberGamificationState, activity: ActivityEvent): GamingFlag[] {
    const flags: GamingFlag[] = [];
    const now = Date.now();
    
    // Volume spam: >50 acciones/hora
    const recentActions = this.getRecentActions(memberId, 3600000);
    if (recentActions.length > 50) {
      flags.push({ type: 'volume_spam', detectedAt: now, severity: 'high', evidence: [`${recentActions.length} actions in 1h`], actionTaken: 'warning', resolvedAt: null });
    }
    
    // Self-voting / Circle jerk detection
    if (activity.type === 'vote' && this.isSelfVotePattern(memberId, activity.targetId)) {
      flags.push({ type: 'self_voting', detectedAt: now, severity: 'critical', evidence: ['Self-vote pattern detected'], actionTaken: 'points_revoked', resolvedAt: null });
    }
    
    // Point farming: high points/low value ratio
    if (state.totalPoints > 10000 && state.reputationScore / state.totalPoints < 0.1) {
      flags.push({ type: 'point_farming', detectedAt: now, severity: 'medium', evidence: ['High volume, low validation ratio'], actionTaken: 'warning', resolvedAt: null });
    }
    
    // Bot behavior: perfect timing, no variance
    if (this.isBotPattern(memberId)) {
      flags.push({ type: 'bot_behavior', detectedAt: now, severity: 'critical', evidence: ['Deterministic timing patterns'], actionTaken: 'shadow_ban', resolvedAt: null });
    }
    
    return flags;
  }
  
  private applyGamingSanction(state: MemberGamificationState, flag: GamingFlag): void {
    switch (flag.actionTaken) {
      case 'points_revoked':
        const revokeAmount = Math.floor(state.totalPoints * 0.1);
        state.totalPoints = Math.max(0, state.totalPoints - revokeAmount);
        state.reputationScore = Math.max(0, state.reputationScore - revokeAmount);
        break;
      case 'badge_revoked':
        // Revocar último badge no esencial
        const revocable = state.badges.filter(b => !BADGE_DEFINITIONS.find(d => d.id === b.badgeId)?.unlocksPrivilege);
        if (revocable.length > 0) state.badges.pop();
        break;
      case 'tier_downgrade':
        const tiers: CaaSTierKey[] = ['entry', 'premium', 'vip', 'founder'];
        const currentIdx = tiers.indexOf(state.currentTier);
        if (currentIdx > 0) state.currentTier = tiers[currentIdx - 1];
        break;
      case 'shadow_ban':
        // Marcar para shadow ban (contenido invisible a otros)
        state.trustScore = 0;
        break;
    }
  }
  
  // Metodología 4 Fases - Implementación
  
  // FASE 1: Alineación estratégica
  alignWithBusinessGoal(goal: 'deflection' | 'education' | 'advocacy' | 'retention'): GamificationConfig {
    // Configura qué badges/challenges/campañas están activos según objetivo
  }
  
  // FASE 2: Activación progresiva (lurkers)
  getOnboardingChallenges(memberId: string): Challenge[] {
    // Retorna challenges de onboarding personalizados
  }
  
  // FASE 3: Activity Scoring + IA
  calculateActivityScore(memberId: string): ActivityScore {
    // Puntuación multidimensional (no solo volumen)
  }
  
  // FASE 4: CRM Integration + Community Health Index
  async syncToCRM(memberId: string, crm: 'salesforce' | 'hubspot' | 'gainsight'): Promise<void> {
    // Sincroniza reputationScore, badges, tier, trustScore, CHI
  }
  
  // Helpers
  private getBasePoints(activity: ActivityEvent): number { /* ... */ }
  private checkBadges(state: MemberGamificationState, activity: ActivityEvent): EarnedBadge[] { /* ... */ }
  private checkTierProgression(state: MemberGamificationState): CaaSTierKey | false { /* ... */ }
  private progressChallenges(state: MemberGamificationState, activity: ActivityEvent): string[] { /* ... */ }
  private updateStreak(state: MemberGamificationState, activity: ActivityEvent): void { /* ... */ }
  private updateLeaderboards(state: MemberGamificationState): void { /* ... */ }
  private getRecentActions(memberId: string, windowMs: number): ActivityEvent[] { return []; }
  private isSelfVotePattern(memberId: string, targetId: string): boolean { return false; }
  private isBotPattern(memberId: string): boolean { return false; }
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
  overall: number;           // 0-1000
  helpfulness: number;       // Resolución peer-to-peer
  expertise: number;         // Co-creación conocimiento
  advocacy: number;          // Impacto externo
  consistency: number;       // Rachas, regularidad
  trustworthiness: number;   // Anti-gaming (1 - gaming flags severity)
}

export interface GamificationConfig {
  activeBadges: string[];
  activeChallenges: string[];
  activeCampaigns: string[];
  leaderboardWeights: { [category: string]: number };
  antiGamingSensitivity: 'low' | 'medium' | 'high' | 'strict';
}
```

---

### 2. Community Health Index (CHI) Predictivo + CRM Sync

```typescript
// src/core/lib/communityHealthIndex.ts

export interface CommunityHealthIndex {
  // Dimensiones (0-100 cada una)
  participation: ParticipationMetrics;
  valueCreation: ValueCreationMetrics;
  cohesion: CohesionMetrics;
  sustainability: SustainabilityMetrics;
  // Score compuesto
  overallScore: number;              // 0-100
  trend: 'improving' | 'stable' | 'declining' | 'critical';
  lastCalculated: number;
  // Alertas predictivas
  alerts: CHIAlert[];
  // Segmentación
  byTier: { [tier: string]: number };
  byCohort: { [cohort: string]: number };
}

export interface ParticipationMetrics {
  activeRatio: number;               // MAU / Total members
  lurkerRatio: number;               // Miembros sin actividad 30d
  newMemberActivation: number;       // % nuevos que publican semana 1
  weeklyRetention: number;           // Semana N / Semana N-1
  sessionDepth: number;              // Acciones por sesión
  contributionBreadth: number;       // Categorías distintas usadas
}

export interface ValueCreationMetrics {
  solutionsPerWeek: number;          // Respuestas validadas
  guidesPublished: number;           // Guías técnicas
  peerSupportHours: number;          // Horas ayuda estimadas
  deflectionRate: number;            // % visitas que evitan ticket
  knowledgeBaseGrowth: number;       // Artículos indexados/mes
  coCreationEvents: number;          // Propuestas roadmap implementadas
}

export interface CohesionMetrics {
  trustIndex: number;                // 0-1 (basado en trustScore gamificación)
  conflictRate: number;              // Reportes válidos / interacciones
  moderatorLoad: number;             // Acciones moderación / moderador activo
  crossTierInteraction: number;      // Interacciones entre tiers distintos
  mentorshipActivity: number;        // Mentor-mentee pairs activos
  psychologicalSafety: number;       // Encuesta trimestral anónima
}

export interface SustainabilityMetrics {
  moderatorBurnoutRisk: number;      // 0-1 (basado en carga + soporte)
  revenueDiversification: number;    // Streams activos / total
  costPerActiveMember: number;       // Platform + moderation / MAU
  ltvToCacRatio: number;             // LTV community / CAC community
  reserveRunway: number;             // Meses de operación con reserves
  demurrageHealth: number;           // ZNU circulation velocity
}

export interface CHIAlert {
  id: string;
  dimension: keyof ParticipationMetrics | keyof ValueCreationMetrics | keyof CohesionMetrics | keyof SustainabilityMetrics;
  metric: string;
  severity: 'info' | 'warning' | 'critical' | 'emergency';
  currentValue: number;
  threshold: number;
  trend: 'rising' | 'falling' | 'stable';
  detectedAt: number;
  recommendedAction: string;
  autoActionTriggered: boolean;
  assignedTo?: string;
}

export class CommunityHealthEngine {
  private history: CommunityHealthIndex[] = [];
  
  async calculateCHI(nodeId: string): Promise<CommunityHealthIndex> {
    // 1. Obtener datos de todos los sistemas (Integral, CaaS, Colaberry, FRS, CDS)
    const [integral, caas, colaberry, frs, cds] = await Promise.all([
      this.getIntegralData(nodeId),
      this.getCaaSData(nodeId),
      this.getColaberryData(nodeId),
      this.getFRSData(nodeId),
      this.getCDSData(nodeId)
    ]);
    
    // 2. Calcular dimensiones
    const participation = this.calcParticipation(integral, caas, colaberry);
    const valueCreation = this.calcValueCreation(integral, caas, frs);
    const cohesion = this.calcCohesion(integral, caas, colaberry, cds);
    const sustainability = this.calcSustainability(caas, integral);
    
    // 3. Score compuesto (ponderado por objetivo nodo)
    const weights = this.getDimensionWeights(nodeId);
    const overallScore = 
      participation * weights.participation +
      valueCreation * weights.valueCreation +
      cohesion * weights.cohesion +
      sustainability * weights.sustainability;
    
    // 4. Trend analysis
    const trend = this.calcTrend(overallScore);
    
    // 5. Generar alertas predictivas
    const alerts = this.generateAlerts(participation, valueCreation, cohesion, sustainability);
    
    // 6. Auto-trigger re-engagement para alerts critical
    for (const alert of alerts.filter(a => a.severity === 'critical' || a.severity === 'emergency')) {
      await this.triggerAutoReengagement(alert, nodeId);
    }
    
    const chi: CommunityHealthIndex = {
      participation, valueCreation, cohesion, sustainability,
      overallScore: Math.round(overallScore),
      trend,
      lastCalculated: Date.now(),
      alerts,
      byTier: this.calcByTier(caas),
      byCohort: this.calcByCohort(integral)
    };
    
    this.history.push(chi);
    if (this.history.length > 52) this.history.shift(); // 1 año semanal
    
    return chi;
  }
  
  // CRM Sync (Fase 4 metodología)
  async syncToCRM(chi: CommunityHealthIndex, crm: 'salesforce' | 'hubspot' | 'gainsight'): Promise<void> {
    // Mapear CHI → CRM fields
    const payload = {
      community_health_score: chi.overallScore,
      community_health_trend: chi.trend,
      participation_rate: chi.participation.activeRatio,
      deflection_rate: chi.valueCreation.deflectionRate,
      member_ltr_score: chi.valueCreation.solutionsPerWeek, // proxy
      churn_risk_members: chi.alerts.filter(a => a.severity === 'critical' || a.severity === 'emergency')
        .flatMap(a => this.getAffectedMembers(a)).length,
      trust_index: chi.cohesion.trustIndex,
      moderator_burnout_risk: chi.sustainability.moderatorBurnoutRisk
    };
    
    // Upsert en CRM (Contact/Account custom fields)
    await this.crmUpsert(crm, payload);
  }
  
  // Re-engagement automatizado
  private async triggerAutoReengagement(alert: CHIAlert, nodeId: string): Promise<void> {
    const affectedMembers = this.getAffectedMembers(alert);
    
    for (const memberId of affectedMembers) {
      // 1. Notificación push personalizada (mobile app white-label)
      await this.sendPushNotification(memberId, this.generateReengagementMessage(alert));
      
      // 2. Asignar challenge de reactivación personalizado
      await this.assignReengagementChallenge(memberId, alert);
      
      // 3. Alertar Customer Success si high-value member
      const memberValue = await this.getMemberValue(memberId);
      if (memberValue > this.getHighValueThreshold()) {
        await this.alertCustomerSuccess(memberId, alert);
      }
      
      // 4. Si trustScore crítico → intervención humana
      const memberState = await this.getGamificationState(memberId);
      if (memberState.trustScore < 0.3) {
        await this.escalateToHumanIntervention(memberId, alert);
      }
    }
  }
}
```

---

### 3. CaaS ROI Calculator + SDS Tracker

```typescript
// src/core/lib/caasROI.ts

export interface CaasROIInputs {
  // Costes
  platformLicenseMonthly: number;        // USD/mes
  managedServicesMonthly: number;        // Agencia/moderación
  moderationHoursMonthly: number;        // Horas moderación interna
  moderationHourlyRate: number;          // USD/hora
  // Volumen soporte
  monthlySupportTickets: number;         // Tickets/mes antes CaaS
  ticketFullyLoadedCost: number;         // USD/ticket (agentes + infra + overhead)
  // Deflexión
  communitySearchesMonthly: number;      // Búsquedas/visitas hilos solución
  deflectionRate: number;                // 0-1 (benchmark 14-45%)
  // Retención
  totalCustomers: number;
  annualChurnRate: number;               // 0-1
  communityMemberChurnReduction: number; // 0-1 (benchmark 30-31% mejor retención)
  avgCustomerLTV: number;                // USD
  // Pipeline
  monthlyDeals: number;
  communityInfluencedDealRate: number;   // 0-1 (benchmark 10-30%)
  dealCloseRateTraditional: number;      // 0-1 (benchmark 42%)
  dealCloseRateCommunity: number;        // 0-1 (benchmark 72%)
  avgDealSize: number;                   // USD
  salesCycleDaysTraditional: number;     // Días (benchmark 90+)
  salesCycleDaysCommunity: number;       // Días (benchmark <90)
}

export interface CaasROIResult {
  // SDS (Ahorro Neto Deflexión)
  sds: {
    grossSavings: number;                // V_searches × R_deflection × C_ticket
    platformOverhead: number;            // E_platform_overhead anual
    netSavings: number;                  // Gross - Overhead
    monthlySavings: number;
    paybackMonths: number;
  };
  // ROI Integral
  roi: {
    deflectionSavings: number;           // Anual
    retentionValue: number;              // LTV lift anual
    pipelineValue: number;               // Pipeline acelerado anual
    totalCosts: number;                  // Anual
    roiPercent: number;                  // %
    paybackMonths: number;
  };
  // Benchmarks
  benchmarks: {
    deflectionRate: { current: number; good: [number, number]; excellent: [number, number] };
    retentionRate: { current: number; good: [number, number]; excellent: [number, number] };
    pipelineInfluence: { current: number; good: [number, number]; excellent: [number, number] };
    engagementRate: { current: number; good: number; excellent: number };
  };
  // Proyección 12/24/36 meses
  projection: { month: number; cumulativeNetValue: number; cumulativeROI: number }[];
}

export class CaasROICalculator {
  // Benchmarks de mercado 2026 (del documento)
  static readonly BENCHMARKS = {
    deflectionRate: { good: [0.15, 0.25], excellent: [0.35, 0.45] },
    annualRetention: { good: [0.65, 0.75], excellent: [0.85, 1.0] },
    pipelineInfluence: { good: [0.10, 0.20], excellent: [0.30, 1.0] },
    engagementRate: { good: 0.034, excellent: 0.068 }
  };
  
  calculate(inputs: CaasROIInputs): CaasROIResult {
    // 1. SDS (Support Deflection Savings)
    const annualSearches = inputs.communitySearchesMonthly * 12;
    const grossSavings = annualSearches * inputs.deflectionRate * inputs.ticketFullyLoadedCost;
    
    const annualPlatformCost = (inputs.platformLicenseMonthly + inputs.managedServicesMonthly) * 12;
    const annualModerationCost = inputs.moderationHoursMonthly * inputs.moderationHourlyRate * 12;
    const platformOverhead = annualPlatformCost + annualModerationCost;
    
    const netSavings = grossSavings - platformOverhead;
    const monthlySavings = netSavings / 12;
    const paybackMonths = platformOverhead > 0 ? Math.ceil(platformOverhead / monthlySavings) : 0;
    
    // 2. Retention Value (LTV Lift)
    const churnReduction = inputs.annualChurnRate * inputs.communityMemberChurnReduction;
    const retainedCustomers = inputs.totalCustomers * churnReduction;
    const retentionValue = retainedCustomers * inputs.avgCustomerLTV;
    
    // 3. Pipeline Value (Accelerated deals)
    const communityDeals = inputs.monthlyDeals * 12 * inputs.communityInfluencedDealRate;
    const traditionalDeals = inputs.monthlyDeals * 12 * (1 - inputs.communityInfluencedDealRate);
    const acceleratedRevenue = communityDeals * inputs.dealCloseRateCommunity * inputs.avgDealSize;
    const traditionalRevenue = traditionalDeals * inputs.dealCloseRateTraditional * inputs.avgDealSize;
    const pipelineValue = acceleratedRevenue - traditionalRevenue; // Incremental
    
    // 4. Total ROI
    const totalCosts = platformOverhead;
    const totalBenefits = netSavings + retentionValue + pipelineValue;
    const roiPercent = totalCosts > 0 ? ((totalBenefits - totalCosts) / totalCosts) * 100 : 0;
    const roiPaybackMonths = totalCosts > 0 ? Math.ceil(totalCosts / (totalBenefits / 12)) : 0;
    
    // 4. Benchmarks assessment
    const benchmarks = this.assessBenchmarks(inputs);
    
    // 5. Projection
    const projection = this.projectMonths(inputs, netSavings, retentionValue, pipelineValue, totalCosts, 36);
    
    return {
      sds: { grossSavings, platformOverhead, netSavings, monthlySavings, paybackMonths },
      roi: { deflectionSavings: netSavings, retentionValue, pipelineValue, totalCosts, roiPercent, paybackMonths: roiPaybackMonths },
      benchmarks,
      projection
    };
  }
  
  private assessBenchmarks(inputs: CaasROIInputs) {
    return {
      deflectionRate: { 
        current: inputs.deflectionRate, 
        good: this.BENCHMARKS.deflectionRate.good, 
        excellent: this.BENCHMARKS.deflectionRate.excellent 
      },
      retentionRate: { 
        current: 1 - inputs.annualChurnRate * (1 - inputs.communityMemberChurnReduction), 
        good: this.BENCHMARKS.annualRetention.good, 
        excellent: this.BENCHMARKS.annualRetention.excellent 
      },
      pipelineInfluence: { 
        current: inputs.communityInfluencedDealRate, 
        good: this.BENCHMARKS.pipelineInfluence.good, 
        excellent: this.BENCHMARKS.pipelineInfluence.excellent 
      },
      engagementRate: { 
        current: 0, // calcular desde datos reales
        good: this.BENCHMARKS.engagementRate.good, 
        excellent: this.BENCHMARKS.engagementRate.excellent 
      }
    };
  }
  
  private projectMonths(inputs: CaasROIInputs, monthlySavings: number, monthlyRetention: number, monthlyPipeline: number, monthlyCosts: number, months: number) {
    const projection = [];
    let cumulativeNet = 0;
    for (let m = 1; m <= months; m++) {
      const monthlyNet = monthlySavings + monthlyRetention + monthlyPipeline - monthlyCosts;
      cumulativeNet += monthlyNet;
      const cumulativeROI = monthlyCosts * m > 0 ? (cumulativeNet / (monthlyCosts * m)) * 100 : 0;
      projection.push({ month: m, cumulativeNetValue: cumulativeNet, cumulativeROI: cumulativeROI });
    }
    return projection;
  }
}
```

---

### 4. Pantallas UI Nuevas

```tsx
// src/app/screens/CaaSGamification.tsx
export function CaaSGamificationScreen() {
  const { gamificationEngine, memberState, recordActivity, getLeaderboard, syncToCRM } = useAppStore();
  
  return (
    <div className="p-6 space-y-6">
      <Header title="CaaS Gamificación" subtitle="4 Modelos + Metodología 4 Fases + Anti-Muir Guard" />
      
      {/* Estado Miembro */}
      <MemberGamificationPanel 
        state={memberState}
        onActivity={recordActivity}
      />
      
      {/* Tabs por Modelo */}
      <Tabs defaultValue="tiers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tiers">Niveles + Acceso Modular</TabsTrigger>
          <TabsTrigger value="badges">Reputación + Badges + Leaderboards</TabsTrigger>
          <TabsTrigger value="challenges">Rachas + Desafíos + Hábitos</TabsTrigger>
          <TabsTrigger value="advocacy">Abogacía + Co-Creación</TabsTrigger>
          <TabsTrigger value="config">Config + Anti-Gaming</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tiers">
          <TierProgressionPanel tiers={CAAS_TIERS} memberState={memberState} />
        </TabsContent>
        
        <TabsContent value="badges">
          <BadgesLeaderboardPanel 
            badges={BADGE_DEFINITIONS} 
            memberState={memberState}
            leaderboard={getLeaderboard('global')}
          />
        </TabsContent>
        
        <TabsContent value="challenges">
          <ChallengesPanel 
            templates={CHALLENGE_TEMPLATES}
            activeChallenges={memberState.activeChallenges}
            onJoin={joinChallenge}
          />
        </TabsContent>
        
        <TabsContent value="advocacy">
          <AdvocacyPanel 
            campaigns={advocacyCampaigns}
            memberState={memberState}
          />
        </TabsContent>
        
        <TabsContent value="config">
          <GamificationConfigPanel 
            config={gamificationConfig}
            onUpdate={updateConfig}
            gamingFlags={memberState.gamingFlags}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// src/app/screens/CommunityHealthIndex.tsx
export function CommunityHealthIndexScreen() {
  const { chi, calculateCHI, syncToCRM, alerts, triggerReengagement } = useAppStore();
  
  return (
    <div className="p-6 space-y-6">
      <Header title="Community Health Index" subtitle="Predictivo + CRM Sync + Auto Re-engagement" />
      
      {/* Overall Score + Trend */}
      <CHIScoreCard chi={chi} />
      
      {/* 4 Dimensiones */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DimensionCard 
          title="Participación" 
          score={chi.participation} 
          metrics={chi.participation}
          color="text-violet-400"
        />
        <DimensionCard 
          title="Creación Valor" 
          score={chi.valueCreation} 
          metrics={chi.valueCreation}
          color="text-emerald-400"
        />
        <DimensionCard 
          title="Cohesión" 
          score={chi.cohesion} 
          metrics={chi.cohesion}
          color="text-amber-400"
        />
        <DimensionCard 
          title="Sostenibilidad" 
          score={chi.sustainability} 
          metrics={chi.sustainability}
          color="text-rose-400"
        />
      </div>
      
      {/* Alertas Predictivas */}
      <AlertsPanel alerts={chi.alerts} onTrigger={triggerReengagement} />
      
      {/* CRM Sync Status */}
      <CRMSyncPanel onSync={syncToCRM} lastSync={lastCRMSync} />
      
      {/* Segmentación */}
      <SegmentationPanel byTier={chi.byTier} byCohort={chi.byCohort} />
    </div>
  );
}

// src/app/screens/CaaSROI.tsx
export function CaaSROIScreen() {
  const { roiCalculator, inputs, calculateROI, projection } = useAppStore();
  
  return (
    <div className="p-6 space-y-6">
      <Header title="CaaS ROI Calculator" subtitle="SDS + ROI Integral + Benchmarks 2026 + Proyección 36m" />
      
      {/* Inputs Panel */}
      <InputsPanel inputs={inputs} onChange={setInputs} />
      
      {/* Results */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="SDS Neto Mensual" value={`${roi.sds.monthlySavings}/mes`} color="text-emerald-400" />
        <StatCard title="ROI Anual" value={`${roi.roi.roiPercent.toFixed(1)}%`} color={roi.roi.roiPercent > 0 ? 'text-emerald-400' : 'text-rose-400'} />
        <StatCard title="Payback" value={`${roi.roi.paybackMonths}m`} color="text-sky-400" />
        <StatCard title="CHI Score" value={chi?.overallScore || 'N/A'} color="text-violet-400" />
      </div>
      
      {/* Breakdown */}
      <ROIBreakdownCard roi={roi.roi} />
      
      {/* Benchmarks */}
      <BenchmarksCard benchmarks={roi.benchmarks} />
      
      {/* Projection Chart */}
      <ProjectionChart data={roi.projection} />
    </div>
  );
}
```

---

### 5. Integración con Sistemas Existentes

```typescript
// Puntos de integración en store.ts

// 1. CaaS Gamification → Integral ITC (rewards en ZNU)
async function awardGamificationRewards(memberId: string, rewards: ChallengeReward[]) {
  for (const reward of rewards) {
    if (reward.type === 'znu') {
      const { account, ledgerEntry } = awardCreditsFull(
        getITCAccount(memberId), 
        createLaborEventForReward(reward.value), 
        getPolicySnapshot()
      );
      updateITCAccount(memberId, account);
      addLedgerEntry(ledgerEntry);
    }
    if (reward.type === 'tier-unlock') {
      await upgradeMemberTier(memberId, reward.value as CaaSTierKey);
    }
  }

// 2. CaaS Gamification → Integral FRS (signals)
function emitGamificationSignal(memberId: string, event: string, severity: 'info' | 'warning' | 'critical') {
  ingestIntegralSignal('CaaS', severity, `Gamification: ${event} for member ${memberId}`);
}

// 3. Community Health Index → Integral FRS (signal_packets)
async function runWeeklyCHIJob() {
  const chi = await calculateCHI('local');
  // Auto-incluido en runSignalIntake() via buildCDSSummary/buildOADSummary etc
  // Pero también crear signal_packet dedicado CHI
  const packet = await runSignalIntake('local', lastWeek);
  // ... 
}

// 4. CRM Sync (Fase 4) → CaaS revenue streams + member data
async function syncCaaSToCRM(crm: 'salesforce' | 'hubspot' | 'gainsight') {
  const members = getAllMembers();
  for (const member of members) {
    const gamification = getGamificationState(member.id);
    const chi = getMemberCHI(member.id);
    await syncMemberToCRM(crm, member, gamification, chi);
  }
}
```

---

## Criterios de Aceptación (Definition of Done)

### Gamificación (P0)
- [ ] 4 Tieres (Entry/Premium/VIP/Founder) con requisitos AUT/CDS/ZNU/ValueFlows
- [ ] 25+ Badges definidos en 8 categorías con criteria verificables
- [ ] Challenge templates: onboarding, daily streak, cohort, advocacy
- [ ] Advocacy campaigns con acciones verificables externamente
- [ ] Motor unificado: recordActivity → points/badges/tier/streak/challenges
- [ ] **William Muir Guard**: Detección volume_spam, self_voting, circle_jerk, bot_behavior, point_farming
- [ ] Sanciones automáticas: points_revoked, badge_revoked, tier_downgrade, shadow_ban
- [ ] Leaderboards por tier, global, categoría
- [ ] TrustScore dinámico (0-1) basado en gaming flags

### Community Health Index (P0)
- [ ] 4 dimensiones: Participation, Value Creation, Cohesion, Sustainability
- [ ] 16+ métricas con thresholds good/excellent
- [ ] Overall score 0-100 + trend + alertas predictivas
- [ ] Auto-re-engagement para alerts critical/emergency
- [ ] Push notifications personalizadas + challenge reactivación
- [ ] Escalación Customer Success para high-value members
- [ ] Intervención humana para trustScore < 0.3
- [ ] CRM sync (Salesforce/HubSpot/Gainsight) campos mapeados
- [ ] Historial 52 semanas + trend analysis

### CaaS ROI Calculator (P0)
- [ ] SDS formula: (V_searches × R_deflection × C_ticket) - E_overhead
- [ ] ROI integral: Deflection + Retention/LTV + Pipeline - Costs
- [ ] Benchmarks 2026: deflection 15-25%/35-45%, retention 65-75%/85%+, pipeline 10-20%/30%+, engagement 3.4%/6.8%
- [ ] Payback projection 12-18 meses
- [ ] Proyección 36 meses con cumulative net value + ROI
- [ ] Inputs panel editable + real-time calculation

### Integración Arquitectura (P0)
- [ ] Gamification rewards → ITC (ZNU credits + ledger entries)
- [ ] Gamification events → FRS (signal_packets)
- [ ] CHI → FRS (weekly signal_packet dedicado)
- [ ] Gamification + CHI → CRM sync (Fase 4 metodología)
- [ ] Anti-Muir guard integrado en todas las acciones de puntos

---

## Referencias Normativas

- **CaaS_integration.md**: CaaS-BM actual (stake ZNU, AUT/CDS, revenue streams, MJ gate)
- **Integral Devguide v0.1**: CDS/OAD/COS/ITC/FRS loop + Data contracts + Interfaces
- **Reglamento Fedeco**: Art 9 (cayapa), Art 16 (límite simétrico), Art 17 (impuestos), Art 12 (faltas)
- **William Muir**: Selección grupal vs individual → Anti-superchickens en gamificación
- **Choice Architecture (Thaler/Sunstein)**: Nudges, defaults, visibility → Diseño incentivos
- **Doughnut Economics (Raworth)**: Suelo social (inclusión) + Techo ecológico (burnout/spam) → CHI
- **Benchmarks mercado 2026**: Del documento fuente (deflection, retention, pipeline, engagement)

---

## Próximos Pasos

1. **Crear specs detallados** en `docs/`:
   - `CAAS_GAMIFICATION_SPEC.md` (4 modelos + motor + anti-Muir)
   - `COMMUNITY_HEALTH_INDEX_SPEC.md` (CHI + CRM sync + re-engagement)
   - `CAAS_ROI_CALCULATOR_SPEC.md` (SDS + ROI + benchmarks + proyección)

2. **Implementar libs core**:
   - `src/core/lib/caasGamification.ts`
   - `src/core/lib/communityHealthIndex.ts`
   - `src/core/lib/caasROI.ts`

3. **Crear screens**:
   - `CaaSGamification.tsx`, `CommunityHealthIndex.tsx`, `CaaSROI.tsx`

4. **Integrar en store.ts** (acciones + state slices)

5. **Actualizar Integral state** (nuevos tipos en `integral.ts`)

6. **Verificar**: `npx tsc --noEmit` + `npm run build`

7. **Commit + push** con mensaje referenciando fuente documento CaaS 2026