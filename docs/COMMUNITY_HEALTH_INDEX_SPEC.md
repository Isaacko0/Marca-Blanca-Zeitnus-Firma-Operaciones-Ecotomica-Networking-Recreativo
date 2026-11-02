# Spec: Community Health Index (CHI) Predictivo + CRM Sync + Auto Re-engagement

**Fuente**: Documento "Plataformas de Comunidades CaaS.txt" — Secciones: Fidelidad/Retención + ROI + Gamificación Metodología Fase 4  
**Prioridad**: P0 (Crítico para retención y ROI)  
**Archivos Zeitnus**: `src/core/lib/communityHealthIndex.ts`, `src/core/state/communityHealthIndex.ts`, `src/app/screens/CommunityHealthIndex.tsx`

---

## 1. Modelo de Datos (State)

```typescript
// src/core/state/communityHealthIndex.ts

export interface CommunityHealthIndex {
  // 4 Dimensiones (0-100 cada una)
  participation: ParticipationMetrics;
  valueCreation: ValueCreationMetrics;
  cohesion: CohesionMetrics;
  sustainability: SustainabilityMetrics;
  
  // Score compuesto y trend
  overallScore: number;              // 0-100
  trend: 'improving' | 'stable' | 'declining' | 'critical';
  lastCalculated: number;
  
  // Alertas predictivas
  alerts: CHIAlert[];
  
  // Segmentación
  byTier: Record<string, number>;    // tier -> score
  byCohort: Record<string, number>;  // cohort -> score
  bySegment: Record<string, number>; // segment personalizado -> score
}

export interface ParticipationMetrics {
  // Métricas base (0-100)
  activeRatio: number;               // MAU / Total members
  lurkerRatio: number;               // Miembros sin actividad 30d (inverso: menor mejor)
  newMemberActivation: number;       // % nuevos que publican semana 1
  weeklyRetention: number;           // Semana N / Semana N-1
  sessionDepth: number;              // Acciones por sesión
  contributionBreadth: number;       // Categorías distintas usadas / total
  
  // Raw data para debugging
  totalMembers: number;
  mau: number;
  dau: number;
  newMembersThisWeek: number;
  activatedNewMembers: number;
  avgActionsPerSession: number;
  avgCategoriesPerMember: number;
}

export interface ValueCreationMetrics {
  solutionsPerWeek: number;          // Respuestas validadas como solución
  guidesPublished: number;           // Guías técnicas publicadas
  peerSupportHours: number;          // Horas ayuda estimadas (labor_events × horas)
  deflectionRate: number;            // % visitas que evitan ticket (benchmark 14-45%)
  knowledgeBaseGrowth: number;       // Artículos indexados/mes
  coCreationEvents: number;          // Propuestas roadmap implementadas
  advocacyActions: number;           // Reviews, referrals, referencias
  
  // Raw data
  totalSolutions: number;
  totalGuides: number;
  totalDeflections: number;
  communityVisits: number;
}

export interface CohesionMetrics {
  trustIndex: number;                // 0-1 (basado en trustScore gamificación promedio)
  conflictRate: number;              // Reportes válidos / interacciones totales
  moderatorLoad: number;             // Acciones moderación / moderador activo
  crossTierInteraction: number;      // Interacciones entre tiers distintos / total
  mentorshipActivity: number;        // Mentor-mentee pairs activos
  psychologicalSafety: number;       // Encuesta trimestral anónima (0-100)
  
  // Raw data
  totalReports: number;
  validReports: number;
  activeModerators: number;
  crossTierInteractions: number;
  totalInteractions: number;
  mentorshipPairs: number;
  safetySurveyScore: number | null;
}

export interface SustainabilityMetrics {
  moderatorBurnoutRisk: number;      // 0-1 (basado en carga + soporte + trustScore)
  revenueDiversification: number;    // Streams activos / total streams (0-1)
  costPerActiveMember: number;       // (Platform + moderation) / MAU
  ltvToCacRatio: number;             // LTV community / CAC community
  reserveRunway: number;             // Meses de operación con reserves actuales
  demurrageHealth: number;           // ZNU circulation velocity (0-1)
  znuCirculationRate: number;        // ZNU transaccionado / ZNU total supply
  
  // Raw data
  monthlyPlatformCost: number;
  monthlyModerationCost: number;
  activeStreams: number;
  totalStreams: number;
  treasuryReserves: number;
  monthlyBurn: number;
  totalZNUSupply: number;
  znuTransactedMonthly: number;
}

export type CHIAlertSeverity = 'info' | 'warning' | 'critical' | 'emergency';
export type CHIAlertTrend = 'rising' | 'falling' | 'stable';

export interface CHIAlert {
  id: string;
  dimension: 'participation' | 'valueCreation' | 'cohesion' | 'sustainability';
  metric: string;                    // Nombre de la métrica afectada
  severity: CHIAlertSeverity;
  currentValue: number;
  threshold: number;                 // Umbral que se cruzó
  trend: CHIAlertTrend;
  detectedAt: number;
  recommendedAction: string;
  autoActionTriggered: boolean;
  assignedTo?: string;               // memberId o 'customer-success' | 'moderators' | 'founders'
  relatedMembers?: string[];         // Miembros afectados
  acknowledged: boolean;
  acknowledgedAt?: number;
  acknowledgedBy?: string;
}

export interface CHISnapshot {
  chi: CommunityHealthIndex;
  calculatedAt: number;
  period: { start: number; end: number };
}

export interface CommunityHealthState {
  current: CommunityHealthIndex | null;
  history: CHISnapshot[];            // Últimas 52 semanas
  lastCalculation: number | null;
  calculationInProgress: boolean;
  crmSyncStatus: { [crm: string]: { lastSync: number; success: boolean; error?: string } };
  reengagementLog: ReengagementLogEntry[];
}

export interface ReengagementLogEntry {
  id: string;
  alertId: string;
  memberId: string;
  action: 'push_notification' | 'reengagement_challenge' | 'customer_success_escalation' | 'human_intervention' | 'email' | 'in_app_message';
  triggeredAt: number;
  result: 'pending' | 'sent' | 'opened' | 'clicked' | 'completed' | 'failed';
  details?: string;
}
```

---

## 2. Motor de Cálculo (CommunityHealthEngine)

```typescript
// src/core/lib/communityHealthIndex.ts

import type {
  CommunityHealthIndex, ParticipationMetrics, ValueCreationMetrics,
  CohesionMetrics, SustainabilityMetrics, CHIAlert, CHIAlertSeverity,
  CHISnapshot, CommunityHealthState, ReengagementLogEntry
} from '@core/state/communityHealthIndex';

export class CommunityHealthEngine {
  private state: CommunityHealthState = {
    current: null,
    history: [],
    lastCalculation: null,
    calculationInProgress: false,
    crmSyncStatus: {},
    reengagementLog: []
  };

  // Pesos por dimensión (configurables por nodo según objetivo)
  private dimensionWeights = {
    participation: 0.25,
    valueCreation: 0.30,
    cohesion: 0.25,
    sustainability: 0.20
  };

  // Umbrales para alertas (basados en benchmarks 2026)
  private readonly THRESHOLDS = {
    participation: {
      activeRatio: { warning: 0.15, critical: 0.10, emergency: 0.05 },
      lurkerRatio: { warning: 0.85, critical: 0.90, emergency: 0.95 },
      newMemberActivation: { warning: 0.20, critical: 0.10, emergency: 0.05 },
      weeklyRetention: { warning: 0.60, critical: 0.40, emergency: 0.20 },
      sessionDepth: { warning: 3, critical: 2, emergency: 1 },
      contributionBreadth: { warning: 0.3, critical: 0.2, emergency: 0.1 }
    },
    valueCreation: {
      deflectionRate: { warning: 0.15, critical: 0.10, emergency: 0.05 },
      solutionsPerWeek: { warning: 5, critical: 2, emergency: 0 },
      guidesPublished: { warning: 1, critical: 0, emergency: 0 },
      knowledgeBaseGrowth: { warning: 2, critical: 1, emergency: 0 }
    },
    cohesion: {
      trustIndex: { warning: 0.5, critical: 0.3, emergency: 0.1 },
      conflictRate: { warning: 0.05, critical: 0.10, emergency: 0.20 },
      moderatorLoad: { warning: 50, critical: 100, emergency: 200 },
      crossTierInteraction: { warning: 0.15, critical: 0.10, emergency: 0.05 },
      mentorshipActivity: { warning: 0.1, critical: 0.05, emergency: 0 }
    },
    sustainability: {
      moderatorBurnoutRisk: { warning: 0.6, critical: 0.8, emergency: 0.95 },
      revenueDiversification: { warning: 0.4, critical: 0.2, emergency: 0.1 },
      costPerActiveMember: { warning: 50, critical: 100, emergency: 200 },
      ltvToCacRatio: { warning: 3, critical: 2, emergency: 1 },
      reserveRunway: { warning: 6, critical: 3, emergency: 1 },
      demurrageHealth: { warning: 0.3, critical: 0.1, emergency: 0.05 }
    }
  };

  // ============================================================================
  // CÁLCULO PRINCIPAL (Job semanal)
  // ============================================================================

  async calculateCHI(nodeId: string = 'local'): Promise<CommunityHealthIndex> {
    this.state.calculationInProgress = true;
    
    try {
      // 1. Obtener datos de todos los sistemas
      const [integral, caas, colaberry, frs, cds, gamification] = await Promise.all([
        this.getIntegralData(nodeId),
        this.getCaaSData(nodeId),
        this.getColaberryData(nodeId),
        this.getFRSData(nodeId),
        this.getCDSData(nodeId),
        this.getGamificationData(nodeId)
      ]);

      // 2. Calcular 4 dimensiones
      const participation = this.calcParticipation(integral, caas, colaberry, gamification);
      const valueCreation = this.calcValueCreation(integral, caas, frs, gamification);
      const cohesion = this.calcCohesion(integral, caas, colaberry, cds, gamification);
      const sustainability = this.calcSustainability(caas, integral, gamification);

      // 3. Score compuesto ponderado
      const overallScore = Math.round(
        participation * this.dimensionWeights.participation +
        valueCreation * this.dimensionWeights.valueCreation +
        cohesion * this.dimensionWeights.cohesion +
        sustainability * this.dimensionWeights.sustainability
      );

      // 4. Trend analysis
      const trend = this.calcTrend(overallScore);

      // 5. Generar alertas predictivas
      const alerts = this.generateAlerts(participation, valueCreation, cohesion, sustainability);

      // 6. Segmentación
      const byTier = this.calcByTier(caas);
      const byCohort = this.calcByCohort(integral, gamification);

      const chi: CommunityHealthIndex = {
        participation, valueCreation, cohesion, sustainability,
        overallScore,
        trend,
        lastCalculated: Date.now(),
        alerts,
        byTier,
        byCohort,
        bySegment: {}
      };

      // 7. Guardar snapshot en historial
      const snapshot: CHISnapshot = {
        chi,
        calculatedAt: Date.now(),
        period: { start: Date.now() - 7 * 86400000, end: Date.now() }
      };
      this.state.history.push(snapshot);
      if (this.state.history.length > 52) this.state.history.shift();

      this.state.current = chi;
      this.state.lastCalculation = Date.now();

      // 8. Auto-trigger re-engagement para alerts critical/emergency
      for (const alert of alerts.filter(a => a.severity === 'critical' || a.severity === 'emergency')) {
        await this.triggerAutoReengagement(alert, nodeId);
      }

      return chi;
    } finally {
      this.state.calculationInProgress = false;
    }
  }

  // ============================================================================
  // CÁLCULO DE DIMENSIONES
  // ============================================================================

  private calcParticipation(integral: any, caas: any, colaberry: any, gamification: any): ParticipationMetrics {
    const members = caas.memberships || [];
    const activeMembers = members.filter(m => this.isActive(m, integral, colaberry, gamification));
    const newMembers = members.filter(m => this.isNewMember(m));
    
    const totalMembers = members.length;
    const mau = activeMembers.length;
    const activeRatio = totalMembers > 0 ? mau / totalMembers : 0;
    const lurkerRatio = totalMembers > 0 ? (totalMembers - mau) / totalMembers : 0;
    
    const newMemberActivation = newMembers.length > 0 
      ? newMembers.filter(m => this.hasPublishedWeek1(m, integral)).length / newMembers.length 
      : 0;
    
    const weeklyRetention = this.calcWeeklyRetention(integral);
    const sessionDepth = this.calcSessionDepth(integral, gamification);
    const contributionBreadth = this.calcContributionBreadth(integral, gamification);

    return {
      activeRatio: Math.round(activeRatio * 100),
      lurkerRatio: Math.round(lurkerRatio * 100),
      newMemberActivation: Math.round(newMemberActivation * 100),
      weeklyRetention: Math.round(weeklyRetention * 100),
      sessionDepth: Math.round(sessionDepth),
      contributionBreadth: Math.round(contributionBreadth * 100),
      totalMembers, mau, dau: this.calcDAU(integral),
      newMembersThisWeek: newMembers.length,
      activatedNewMembers: newMembers.filter(m => this.hasPublishedWeek1(m, integral)).length,
      avgActionsPerSession: sessionDepth,
      avgCategoriesPerMember: contributionBreadth
    };
  }

  private calcValueCreation(integral: any, caas: any, frs: any, gamification: any): ValueCreationMetrics {
    const laborEvents = integral.labor_events || [];
    const solutions = laborEvents.filter(e => e.verification_status === 'verified' && e.itc_credits_issued > 0);
    const guides = integral.designs?.filter(d => d.status === 'certified' && d.ecological_flag === 'low') || [];
    const signals = frs.signals || [];
    deflections = signals.filter(s => s.finding?.includes('deflection') || s.finding?.includes('resolved without ticket')).length;
    
    return {
      solutionsPerWeek: Math.round(solutions.length / 4),
      guidesPublished: guides.length,
      peerSupportHours: solutions.reduce((s, e) => s + e.hours, 0),
      deflectionRate: signals.length > 0 ? deflections / signals.length : 0,
      knowledgeBaseGrowth: integral.designs?.filter(d => d.created_at > Date.now() - 30*86400000).length || 0,
      coCreationEvents: integral.issues?.filter(i => i.status === 'implemented' && i.source === 'FRS').length || 0,
      advocacyActions: gamification.memberStates ? 
        Array.from(gamification.memberStates.values()).reduce((s, m) => s + m.advocacyPoints, 0) : 0,
      totalSolutions: solutions.length,
      totalGuides: guides.length,
      totalDeflections: deflections,
      communityVisits: this.estimateCommunityVisits(integral, caas)
    };
  }

  private calcCohesion(integral: any, caas: any, colaberry: any, cds: any, gamification: any): CohesionMetrics {
    const gamStates = gamification.memberStates ? Array.from(gamification.memberStates.values()) : [];
    const avgTrustScore = gamStates.length > 0 
      ? gamStates.reduce((s, m) => s + m.trustScore, 0) / gamStates.length 
      : 1;
    
    const reports = integral.issues?.filter(i => i.source === 'moderation') || [];
    const validReports = reports.filter(r => r.band === 'VERIFIED').length;
    const conflictRate = reports.length > 0 ? validReports / reports.length : 0;
    
    const moderators = caas.memberships?.filter(m => m.tier === 'vip' || m.tier === 'founder') || [];
    const moderatorLoad = moderators.length > 0 ? reports.length / moderators.length : 0;
    
    const crossTierInteraction = this.calcCrossTierInteraction(integral, caas);
    const mentorshipActivity = gamStates.filter(m => m.badges.some(b => b.badgeId === 'mentor')).length / Math.max(gamStates.length, 1);
    
    return {
      trustIndex: Math.round(avgTrustScore * 100),
      conflictRate: Math.round(conflictRate * 100),
      moderatorLoad: Math.round(moderatorLoad),
      crossTierInteraction: Math.round(crossTierInteraction * 100),
      mentorshipActivity: Math.round(mentorshipActivity * 100),
      psychologicalSafety: this.getPsychologicalSafetyScore(colaberry),
      totalReports: reports.length,
      validReports,
      activeModerators: moderators.length,
      crossTierInteractions: Math.round(crossTierInteraction * integral.labor_events?.length || 0),
      totalInteractions: integral.labor_events?.length || 0,
      mentorshipPairs: gamStates.filter(m => m.badges.some(b => b.badgeId === 'mentor')).length,
      safetySurveyScore: this.getPsychologicalSafetyScore(colaberry) || null
    };
  }

  private calcSustainability(caas: any, integral: any, gamification: any): SustainabilityMetrics {
    const streams = caas.revenueStreams || [];
    const activeStreams = streams.filter(s => s.enabled).length;
    const totalStreams = streams.length;
    
    const platformCost = caas.monthlyPlatformCost || 0;
    const moderationCost = caas.monthlyModerationCost || 0;
    const monthlyBurn = platformCost + moderationCost;
    
    const treasury = integral.base?.usdc_reserva || 0;
    const reserveRunway = monthlyBurn > 0 ? treasury / monthlyBurn : 999;
    
    const gamStates = gamification.memberStates ? Array.from(gamification.memberStates.values()) : [];
    const avgTrustScore = gamStates.length > 0 
      ? gamStates.reduce((s, m) => s + m.trustScore, 0) / gamStates.length 
      : 1;
    const burnoutRisk = 1 - avgTrustScore; // Inverso de trust
    
    const ltv = this.estimateLTV(caas);
    const cac = this.estimateCAC(caas);
    
    const znuSupply = integral.accounts ? Array.from(integral.accounts.values()).reduce((s, a) => s + a.balance, 0) : 0;
    const znuTransacted = integral.ledger?.filter(e => e.timestamp > Date.now() - 30*86400000).reduce((s, e) => s + Math.abs(e.amount), 0) || 0;
    
    return {
      moderatorBurnoutRisk: Math.round(burnoutRisk * 100),
      revenueDiversification: totalStreams > 0 ? Math.round((activeStreams / totalStreams) * 100) : 0,
      costPerActiveMember: caas.memberships?.length ? monthlyBurn / caas.memberships.length : 0,
      ltvToCacRatio: cac > 0 ? Math.round(ltv / cac * 100) / 100 : 0,
      reserveRunway: Math.round(reserveRunway * 10) / 10,
      demurrageHealth: integral.znu ? Math.min(1, integral.znu.circulationVelocity || 0) : 0,
      znuCirculationRate: znuSupply > 0 ? Math.round(znuTransacted / znuSupply * 100) / 100 : 0,
      monthlyPlatformCost: platformCost,
      monthlyModerationCost: moderationCost,
      activeStreams,
      totalStreams,
      treasuryReserves: treasury,
      monthlyBurn,
      totalZNUSupply: znuSupply,
      znuTransactedMonthly: znuTransacted
    };
  }

  // ============================================================================
  // ALERTAS PREDICTIVAS
  // ============================================================================

  private generateAlerts(participation: ParticipationMetrics, valueCreation: ValueCreationMetrics, cohesion: CohesionMetrics, sustainability: SustainabilityMetrics): CHIAlert[] {
    const alerts: CHIAlert[] = [];
    const now = Date.now();

    // Helper para crear alerta
    const checkThreshold = (dimension: CHIAlert['dimension'], metric: string, value: number, thresholds: { warning: number; critical: number; emergency: number }, higherIsBetter = true) => {
      let severity: CHIAlertSeverity | null = null;
      let threshold = 0;
      
      if (higherIsBetter) {
        if (value <= thresholds.emergency) { severity = 'emergency'; threshold = thresholds.emergency; }
        else if (value <= thresholds.critical) { severity = 'critical'; threshold = thresholds.critical; }
        else if (value <= thresholds.warning) { severity = 'warning'; threshold = thresholds.warning; }
      } else {
        if (value >= thresholds.emergency) { severity = 'emergency'; threshold = thresholds.emergency; }
        else if (value >= thresholds.critical) { severity = 'critical'; threshold = thresholds.critical; }
        else if (value >= thresholds.warning) { severity = 'warning'; threshold = thresholds.warning; }
      }
      
      if (severity) {
        alerts.push({
          id: `alert_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
          dimension,
          metric,
          severity,
          currentValue: value,
          threshold,
          trend: this.getMetricTrend(dimension, metric),
          detectedAt: now,
          recommendedAction: this.getRecommendedAction(dimension, metric, severity),
          autoActionTriggered: severity === 'critical' || severity === 'emergency',
          assignedTo: this.getAssignedTo(dimension, severity)
        });
      }
    };

    // Participation alerts
    checkThreshold('participation', 'activeRatio', participation.activeRatio, this.THRESHOLDS.participation.activeRatio, true);
    checkThreshold('participation', 'lurkerRatio', participation.lurkerRatio, this.THRESHOLDS.participation.lurkerRatio, false);
    checkThreshold('participation', 'newMemberActivation', participation.newMemberActivation, this.THRESHOLDS.participation.newMemberActivation, true);
    checkThreshold('participation', 'weeklyRetention', participation.weeklyRetention, this.THRESHOLDS.participation.weeklyRetention, true);
    checkThreshold('participation', 'sessionDepth', participation.sessionDepth, this.THRESHOLDS.participation.sessionDepth, true);
    checkThreshold('participation', 'contributionBreadth', participation.contributionBreadth, this.THRESHOLDS.participation.contributionBreadth, true);

    // Value Creation alerts
    checkThreshold('valueCreation', 'deflectionRate', valueCreation.deflectionRate, this.THRESHOLDS.valueCreation.deflectionRate, true);
    checkThreshold('valueCreation', 'solutionsPerWeek', valueCreation.solutionsPerWeek, this.THRESHOLDS.valueCreation.solutionsPerWeek, true);
    checkThreshold('valueCreation', 'guidesPublished', valueCreation.guidesPublished, this.THRESHOLDS.valueCreation.guidesPublished, true);
    checkThreshold('valueCreation', 'knowledgeBaseGrowth', valueCreation.knowledgeBaseGrowth, this.THRESHOLDS.valueCreation.knowledgeBaseGrowth, true);

    // Cohesion alerts
    checkThreshold('cohesion', 'trustIndex', cohesion.trustIndex, this.THRESHOLDS.cohesion.trustIndex, true);
    checkThreshold('cohesion', 'conflictRate', cohesion.conflictRate, this.THRESHOLDS.cohesion.conflictRate, false);
    checkThreshold('cohesion', 'moderatorLoad', cohesion.moderatorLoad, this.THRESHOLDS.cohesion.moderatorLoad, false);
    checkThreshold('cohesion', 'crossTierInteraction', cohesion.crossTierInteraction, this.THRESHOLDS.cohesion.crossTierInteraction, true);
    checkThreshold('cohesion', 'mentorshipActivity', cohesion.mentorshipActivity, this.THRESHOLDS.cohesion.mentorshipActivity, true);

    // Sustainability alerts
    checkThreshold('sustainability', 'moderatorBurnoutRisk', sustainability.moderatorBurnoutRisk, this.THRESHOLDS.sustainability.moderatorBurnoutRisk, false);
    checkThreshold('sustainability', 'revenueDiversification', sustainability.revenueDiversification, this.THRESHOLDS.sustainability.revenueDiversification, true);
    checkThreshold('sustainability', 'costPerActiveMember', sustainability.costPerActiveMember, this.THRESHOLDS.sustainability.costPerActiveMember, false);
    checkThreshold('sustainability', 'ltvToCacRatio', sustainability.ltvToCacRatio, this.THRESHOLDS.sustainability.ltvToCacRatio, true);
    checkThreshold('sustainability', 'reserveRunway', sustainability.reserveRunway, this.THRESHOLDS.sustainability.reserveRunway, true);
    checkThreshold('sustainability', 'demurrageHealth', sustainability.demurrageHealth, this.THRESHOLDS.sustainability.demurrageHealth, true);

    return alerts;
  }

  // ============================================================================
  // AUTO RE-ENGAGEMENT (Fase 4 Metodología)
  // ============================================================================

  private async triggerAutoReengagement(alert: CHIAlert, nodeId: string): Promise<void> {
    const affectedMembers = alert.relatedMembers || await this.getAffectedMembers(alert);
    
    for (const memberId of affectedMembers) {
      // 1. Push notification personalizada
      await this.sendPushNotification(memberId, this.generateReengagementMessage(alert));
      this.logReengagement(alert.id, memberId, 'push_notification', 'sent');
      
      // 2. Challenge de reactivación personalizado
      await this.assignReengagementChallenge(memberId, alert);
      this.logReengagement(alert.id, memberId, 'reengagement_challenge', 'sent');
      
      // 3. Customer Success escalation para high-value
      const memberValue = await this.getMemberValue(memberId);
      if (memberValue > this.getHighValueThreshold()) {
        await this.alertCustomerSuccess(memberId, alert);
        this.logReengagement(alert.id, memberId, 'customer_success_escalation', 'sent');
      }
      
      // 4. Intervención humana si trustScore crítico
      const gamState = await this.getGamificationState(memberId);
      if (gamState && gamState.trustScore < 0.3) {
        await this.escalateToHumanIntervention(memberId, alert);
        this.logReengagement(alert.id, memberId, 'human_intervention', 'sent');
      }
    }
  }

  private generateReengagementMessage(alert: CHIAlert): string {
    const messages: Record<string, string> = {
      participation: "Te echamos de menos en la comunidad. ¿Todo bien? Aquí tienes un reto fácil para volver a conectar.",
      valueCreation: "Tu experiencia es valiosa. ¿Te animas a resolver una duda pendiente o compartir un recurso?",
      cohesion: "La comunidad te necesita. Tu perspectiva ayuda a mantener el equilibrio.",
      sustainability: "Tu participación sostiene este ecosistema. Pequeñas acciones, gran impacto."
    };
    return messages[alert.dimension] || "Hay actividad en tu comunidad. ¡Pasa a ver qué pasa!";
  }

  // ============================================================================
  // CRM SYNC (Fase 4 Metodología)
  // ============================================================================

  async syncToCRM(chi: CommunityHealthIndex, crm: 'salesforce' | 'hubspot' | 'gainsight'): Promise<void> {
    const payload = {
      community_health_score: chi.overallScore,
      community_health_trend: chi.trend,
      participation_rate: chi.participation.activeRatio,
      deflection_rate: chi.valueCreation.deflectionRate,
      member_ltr_score: chi.valueCreation.solutionsPerWeek,
      churn_risk_members: chi.alerts.filter(a => a.severity === 'critical' || a.severity === 'emergency')
        .flatMap(a => a.relatedMembers || []).length,
      trust_index: chi.cohesion.trustIndex,
      moderator_burnout_risk: chi.sustainability.moderatorBurnoutRisk,
      revenue_diversification: chi.sustainability.revenueDiversification,
      reserve_runway_months: chi.sustainability.reserveRunway
    };

    this.state.crmSyncStatus[crm] = { 
      lastSync: Date.now(), 
      success: true 
    };
    
    // En implementación real: await this.crmUpsert(crm, payload);
  }

  // ============================================================================
  // HELPERS & STUBS
  // ============================================================================

  private calcTrend(currentScore: number): 'improving' | 'stable' | 'declining' | 'critical' {
    if (this.state.history.length < 2) return 'stable';
    const prevScore = this.state.history[this.state.history.length - 1].chi.overallScore;
    const diff = currentScore - prevScore;
    if (diff > 5) return 'improving';
    if (diff < -10) return 'critical';
    if (diff < -5) return 'declining';
    return 'stable';
  }

  private getMetricTrend(dimension: string, metric: string): CHIAlertTrend {
    if (this.state.history.length < 3) return 'stable';
    const recent = this.state.history.slice(-3).map(s => s.chi[dimension as keyof CommunityHealthIndex]?.[metric as keyof any]);
    if (recent[2] > recent[1] && recent[1] > recent[0]) return 'rising';
    if (recent[2] < recent[1] && recent[1] < recent[0]) return 'falling';
    return 'stable';
  }

  private getRecommendedAction(dimension: string, metric: string, severity: CHIAlertSeverity): string {
    const actions: Record<string, Record<string, string>> = {
      participation: {
        activeRatio: 'Lanzar campaña de reactivación + challenge onboarding para lurkers',
        lurkerRatio: 'Reducir fricción: simplificar onboarding, añadir icebreakers automáticos',
        newMemberActivation: 'Revisar flujo onboarding: encuesta bienvenida + primer post guiado',
        weeklyRetention: 'Auditar experiencia semanal: identificar drop-off points',
        sessionDepth: 'Añadir content widgets: hilos relacionados, recursos sugeridos',
        contributionBreadth: 'Promover cross-posting entre espacios temáticos'
      },
      valueCreation: {
        deflectionRate: 'Mejorar base de conocimiento: indexar más soluciones, SEO interno',
        solutionsPerWeek: 'Incentivar respuestas: badge "Primer Resolutor" + puntos extra',
        guidesPublished: 'Lanzar challenge "Autor de Guía" con mentoría',
        knowledgeBaseGrowth: 'Sesiones de documentación colaborativa semanales'
      },
      cohesion: {
        trustIndex: 'Revisar gaming flags: aplicar sanciones, restaurar trustScore',
        conflictRate: 'Aumentar moderación cívica: entrenar moderadores, clarificar normas',
        moderatorLoad: 'Contratar/ascender moderadores: delegar carga, automatizar triaje',
        crossTierInteraction: 'Eventos cross-tier: AMAs, masterminds mixtos, buddy system',
        mentorshipActivity: 'Programa mentoría formal: matching automático, recompensas'
      },
      sustainability: {
        moderatorBurnoutRisk: 'Redistribuir carga: automatizar moderación, rotar moderadores',
        revenueDiversification: 'Activar streams dormidos: afiliados verdes, contenido ZNU',
        costPerActiveMember: 'Optimizar costes: renegociar plataforma, automatizar tareas',
        ltvToCacRatio: 'Mejorar onboarding + retención para subir LTV',
        reserveRunway: 'Plan de financiación: revenue sharing, stake ZNU, grants',
        demurrageHealth: 'Aumentar velocidad ZNU: más transacciones peer-to-peer, menos hoarding'
      }
    };
    return actions[dimension]?.[metric] || `Investigar ${metric} en ${dimension} y tomar acción correctiva`;
  }

  private getAssignedTo(dimension: string, severity: CHIAlertSeverity): string {
    if (severity === 'emergency') return 'founders';
    if (severity === 'critical') {
      const assignments: Record<string, string> = {
        participation: 'community-managers',
        valueCreation: 'knowledge-team',
        cohesion: 'moderators',
        sustainability: 'treasury'
      };
      return assignments[dimension] || 'community-managers';
    }
    return 'community-managers';
  }

  // Stubs para integración real
  private async getIntegralData(nodeId: string) { return {}; }
  private async getCaaSData(nodeId: string) { return {}; }
  private async getColaberryData(nodeId: string) { return {}; }
  private async getFRSData(nodeId: string) { return {}; }
  private async getCDSData(nodeId: string) { return {}; }
  private async getGamificationData(nodeId: string) { return {}; }
  
  private isActive(member: any, integral: any, colaberry: any, gamification: any): boolean { return true; }
  private isNewMember(member: any): boolean { return false; }
  private hasPublishedWeek1(member: any, integral: any): boolean { return false; }
  private calcWeeklyRetention(integral: any): number { return 0.7; }
  private calcSessionDepth(integral: any, gamification: any): number { return 5; }
  private calcContributionBreadth(integral: any, gamification: any): number { return 0.4; }
  private calcDAU(integral: any): number { return 0; }
  private estimateCommunityVisits(integral: any, caas: any): number { return 0; }
  private calcCrossTierInteraction(integral: any, caas: any): number { return 0.2; }
  private getPsychologicalSafetyScore(colaberry: any): number { return 75; }
  private estimateLTV(caas: any): number { return 5000; }
  private estimateCAC(caas: any): number { return 500; }
  private calcByTier(caas: any): Record<string, number> { return {}; }
  private calcByCohort(integral: any, gamification: any): Record<string, number> { return {}; }
  private async getAffectedMembers(alert: CHIAlert): Promise<string[]> { return []; }
  private async sendPushNotification(memberId: string, message: string): Promise<void> {}
  private async assignReengagementChallenge(memberId: string, alert: CHIAlert): Promise<void> {}
  private async alertCustomerSuccess(memberId: string, alert: CHIAlert): Promise<void> {}
  private async getMemberValue(memberId: string): Promise<number> { return 1000; }
  private getHighValueThreshold(): number { return 5000; }
  private async getGamificationState(memberId: string): Promise<any> { return { trustScore: 1 }; }
  private async escalateToHumanIntervention(memberId: string, alert: CHIAlert): Promise<void> {}
  private logReengagement(alertId: string, memberId: string, action: string, result: string): void {}
  
  // Getters públicos
  getState(): CommunityHealthState { return this.state; }
  getCurrentCHI(): CommunityHealthIndex | null { return this.state.current; }
}
```

---

## 3. Integración con Store

```typescript
// En store.ts - slice communityHealth

interface CommunityHealthSlice {
  chiEngine: CommunityHealthEngine;
  chiState: CommunityHealthState;
  
  calculateCHI: (nodeId?: string) => Promise<CommunityHealthIndex>;
  getCHI: () => CommunityHealthIndex | null;
  getCHIHistory: () => CHISnapshot[];
  getAlerts: (severity?: CHIAlertSeverity) => CHIAlert[];
  acknowledgeAlert: (alertId: string, memberId: string) => void;
  triggerReengagement: (alertId: string) => Promise<void>;
  syncToCRM: (crm: 'salesforce' | 'hubspot' | 'gainsight') => Promise<void>;
  getCRMSyncStatus: () => CommunityHealthState['crmSyncStatus'];
  getReengagementLog: () => ReengagementLogEntry[];
  runWeeklyJob: () => Promise<CommunityHealthIndex>;
}
```

---

## 4. Pantalla CommunityHealthIndex.tsx

```tsx
// src/app/screens/CommunityHealthIndex.tsx

export function CommunityHealthIndexScreen() {
  const { 
    chiState, 
    calculateCHI, 
    getCHI, 
    getAlerts, 
    acknowledgeAlert, 
    triggerReengagement, 
    syncToCRM,
    getCRMSyncStatus,
    runWeeklyJob 
  } = useAppStore();

  const chi = getCHI();
  const alerts = getAlerts();
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'emergency');
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => calculateCHI(), 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, calculateCHI]);

  return (
    <div className="p-6 space-y-6">
      <Header title="Community Health Index" subtitle="Predictivo + CRM Sync + Auto Re-engagement" />
      
      {/* Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        <Btn onClick={() => calculateCHI()} disabled={chiState.calculationInProgress}>
          {chiState.calculationInProgress ? 'Calculando...' : 'Calcular CHI Ahora'}
        </Btn>
        <Btn variant="ghost" onClick={() => runWeeklyJob()}>Job Semanal Completo</Btn>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} />
          Auto-refresh 5min
        </label>
      </div>

      {/* Overall Score Card */}
      {chi && (
        <CHIOverallCard chi={chi} />
      )}

      {/* 4 Dimensiones Grid */}
      {chi && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <DimensionCard 
            title="Participación" 
            score={Math.round(chi.participation.activeRatio + (100-chi.participation.lurkerRatio) + chi.participation.newMemberActivation + chi.participation.weeklyRetention) / 4}
            metrics={chi.participation}
            color="text-violet-400"
            icon="Users"
          />
          <DimensionCard 
            title="Creación Valor" 
            score={Math.round(chi.valueCreation.deflectionRate*100 + chi.valueCreation.solutionsPerWeek*2 + chi.valueCreation.guidesPublished*10) }
            metrics={chi.valueCreation}
            color="text-emerald-400"
            icon="Lightbulb"
          />
          <DimensionCard 
            title="Cohesión" 
            score={Math.round(chi.cohesion.trustIndex + (100-chi.cohesion.conflictRate) + (100-chi.cohesion.moderatorLoad) + chi.cohesion.crossTierInteraction) / 4}
            metrics={chi.cohesion}
            color="text-amber-400"
            icon="Heart"
          />
          <DimensionCard 
            title="Sostenibilidad" 
            score={Math.round((100-chi.sustainability.moderatorBurnoutRisk) + chi.sustainability.revenueDiversification + (100-Math.min(100,chi.sustainability.costPerActiveMember)) + chi.sustainability.ltvToCacRatio*10) / 4}
            metrics={chi.sustainability}
            color="text-rose-400"
            icon="Shield"
          />
        </div>
      )}

      {/* Alertas Predictivas */}
      <Card title={`Alertas Predictivas (${alerts.length})`}>
        {criticalAlerts.length > 0 && (
          <AlertBanner count={criticalAlerts.length} severity="critical" />
        )}
        <AlertsTable 
          alerts={alerts} 
          onAcknowledge={acknowledgeAlert}
          onTrigger={triggerReengagement}
        />
      </Card>

      {/* CRM Sync Panel */}
      <CRMSyncPanel 
        status={getCRMSyncStatus()} 
        onSync={syncToCRM}
      />

      {/* Segmentación */}
      {chi && (
        <SegmentationPanel 
          byTier={chi.byTier} 
          byCohort={chi.byCohort}
        />
      )}

      {/* Historial Trend */}
      {chiState.history.length > 1 && (
        <TrendChart data={chiState.history.map(s => ({ date: s.calculatedAt, score: s.chi.overallScore }))} />
      )}
    </div>
  );
}
```

---

## 5. Criterios de Aceptación

### CHI Core
- [ ] 4 dimensiones calculadas: Participation, Value Creation, Cohesion, Sustainability
- [ ] 24 métricas subyacentes con raw data para debugging
- [ ] Overall score 0-100 ponderado (configurable por nodo)
- [ ] Trend detection: improving/stable/declining/critical
- [ ] Historial 52 snapshots semanales

### Alertas Predictivas
- [ ] 24+ thresholds con 4 niveles (info/warning/critical/emergency)
- [ ] Trend detection por métrica (rising/falling/stable)
- [ ] Auto-action triggered para critical/emergency
- [ ] AssignedTo routing: founders, community-managers, moderators, treasury
- [ ] Recommended actions contextuales por métrica

### Auto Re-engagement (Fase 4)
- [ ] Push notifications personalizadas por alerta
- [ ] Challenge de reactivación asignado automáticamente
- [ ] Customer Success escalation para high-value members (LTV > threshold)
- [ ] Human intervention escalation para trustScore < 0.3
- [ ] Reengagement log completo con resultados

### CRM Sync (Fase 4)
- [ ] Campos mapeados: health_score, trend, participation_rate, deflection_rate, ltr_score, churn_risk, trust_index, burnout_risk, revenue_diversification, reserve_runway
- [ ] Soporta Salesforce, HubSpot, Gainsight
- [ ] Sync status tracking con lastSync + success/error
- [ ] Manual + auto sync (post CHI calculation)

### Segmentación
- [ ] ByTier: scores por tier (entry/premium/vip/founder)
- [ ] ByCohort: scores por cohort (onboarding, monthly, quarterly)
- [ ] BySegment: extensible para segmentos custom

### Job Semanal Automatizado
- [ ] calculateCHI() ejecuta completo en <30s
- [ ] Historial 52 snapshots (1 año)
- [ ] Trend analysis con 3+ puntos
- [ ] Auto-reengagement disparado en <5min post-cálculo

---

## Referencias Normativas

- **Documento fuente**: "Plataformas de Comunidades CaaS.txt" — Secciones: Fidelidad (Peer support, CRM Health Scoring, Knowledge base, AI Rituals) + ROI (Benchmarks) + Gamificación Metodología Fase 4
- **CaaS_integration.md**: CaaS-BM actual (revenue streams, AUT/CDS, MJ gate)
- **Integral Devguide v0.1**: FRS (signal_packets, diagnostic_findings), CDS (governance), ITC (decay, rewards)
- **Reglamento Fedeco**: Art 9 (cayapa → participation), Art 16 (límite simétrico → sustainability), Art 12 (faltas → cohesion)
- **Benchmarks 2026**: deflection 15-45%, retention 65-85%+, pipeline 10-30%+, engagement 3.4-6.8%