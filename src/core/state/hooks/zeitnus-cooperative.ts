// hooks/zeitnus-cooperative.ts — Zustand store para Ecosistema Cooperativo ZEITNUS
// Principio Anfibio: postmonetario (ZNU/CaaS) ↔ conectado (USD/USDC vía priceParity)

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  CooperativeState,
  CooperativeType,
  CapitalType,
  RiskProfile,
  RegulatoryRegime,
  ProgressivePhase,
  CircularEconomyMetrics,
  SocialCapitalIndicators,
  CreditPortfolio,
  PhaseMetrics,
  CircularProject,
  TransparencyMechanism,
  EducationProgram,
  GovernanceStructure,
} from '@core/lib/zeitnus-cooperative-types';
import {
  INITIAL_COOPERATIVE_STATE,
  ZEITNUS_COOP_STORAGE_KEY,
  ZEITNUS_COOP_V1_STORAGE_KEY,
  ZEITNUS_COOP_MIGRATION_FLAG_KEY,
  COOPERATIVE_ACHIEVEMENTS,
} from '@core/state/zeitnus-cooperative';
import {
  calculateCooperativeCapital,
  simulateCompoundInterest,
  assessRiskProfile,
  verifyRegulatoryRegime,
  designProgressiveModel,
  measureCircularEconomy,
  buildSocialCapital,
  ensureTransparency,
  createInitialCooperativeState,
} from '@core/lib/zeitnus-cooperative';

export type ZeitnusCooperativeState = CooperativeState;

export type ZeitnusCooperativeActions = {
  // Configuración básica
  setName: (name: string) => void;
  setType: (type: CooperativeState['type']) => void;
  setRegistryNumber: (number: string) => void;
  setStatutes: (statutes: string) => void;

  // Capital y recursos
  addCapitalAport: (associateId: string, amount: number, type: 'inicial' | 'adicional' | 'obligatorio' | 'voluntario') => void;
  updateSavings: (type: CapitalType, amount: number) => void;
  updateCreditPortfolio: (portfolio: Partial<CreditPortfolio>) => void;
  setSurplus: (amount: number) => void;

  // Riesgos y regulación
  recalculateRiskProfile: (data: Parameters<typeof assessRiskProfile>[0]) => void;
  updateRegulatoryRegime: (activities: Parameters<typeof verifyRegulatoryRegime>[0]) => void;

  // Progreso ZEITNUS
  setProgressivePhase: (phase: ProgressivePhase) => void;
  completePhase: (phase: ProgressivePhase, metrics: PhaseMetrics) => void;
  updatePhaseMetrics: (phase: ProgressivePhase, metrics: Partial<PhaseMetrics>) => void;

  // Economía circular
  addCircularProject: (project: Omit<CircularProject, 'id'>) => void;
  updateCircularProject: (id: string, updates: Partial<CircularProject>) => void;
  removeCircularProject: (id: string) => void;
  recalculateCircularMetrics: () => void;

  // Capital social
  updateSocialCapital: (data: Parameters<typeof buildSocialCapital>[0]) => void;

  // Transparencia
  addTransparencyMechanism: (mechanism: Omit<TransparencyMechanism, 'id'>) => void;
  updateTransparencyMechanism: (id: string, updates: Partial<TransparencyMechanism>) => void;
  removeTransparencyMechanism: (id: string) => void;
  recalculateTransparencyIndex: (data: Parameters<typeof ensureTransparency>[0]) => void;

  // Educación
  addEducationProgram: (program: Omit<EducationProgram, 'id'>) => void;
  updateEducationProgram: (id: string, updates: Partial<EducationProgram>) => void;
  removeEducationProgram: (id: string) => void;
  updateFinancialLiteracyIndex: (index: number) => void;

  // Gobernanza
  updateGovernance: (updates: Partial<GovernanceStructure>) => void;
  updateAssembly: (updates: Partial<GovernanceStructure['assembly']>) => void;
  updateBoard: (updates: Partial<GovernanceStructure['board']>) => void;
  updateManagement: (updates: Partial<GovernanceStructure['management']>) => void;
  updateCommittees: (updates: Partial<GovernanceStructure['committees']>) => void;
  updateConflictResolution: (updates: Partial<GovernanceStructure['conflictResolution']>) => void;

  // Utilidades
  recalculateRiskProfileFromState: () => void;
  recalculateCircularMetricsFromState: () => void;
  recalculateSocialCapitalFromState: () => void;
  recalculateTransparencyIndexFromState: () => void;

  // Persistencia
  saveToStorage: () => void;
  loadFromStorage: () => void;
  clearStorage: () => void;

  // Migración v1→v2
  detectV1Data: () => boolean;
  migrateV1ToV2: (userId: string) => Promise<boolean>;
  dismissMigration: () => void;

  // Achievements
  unlockAchievement: (achievementId: string) => void;

  // Reset
  reset: () => void;
};

export type ZeitnusCooperativeStore = ZeitnusCooperativeState & ZeitnusCooperativeActions;

// ============================================================================
// STORE ZUSTAND
// ============================================================================

export const useZeitnusCooperativeStore = create<ZeitnusCooperativeStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      ...INITIAL_COOPERATIVE_STATE,

      // ========================================================================
      // ACCIONES DE CONFIGURACIÓN BÁSICA
      // ========================================================================
      setName: (name: string) => set({ name, updatedAt: Date.now() }),
      setType: (type: CooperativeState['type']) => set({ type, updatedAt: Date.now() }),
      setRegistryNumber: (registryNumber: string) => set({ registryNumber, updatedAt: Date.now() }),
      setStatutes: (statutes: string) => set({ statutes, updatedAt: Date.now() }),

      // ========================================================================
      // CAPITAL Y RECURSOS
      // ========================================================================
      addCapitalAport: (associateId: string, amount: number, aportType: 'inicial' | 'adicional' | 'obligatorio' | 'voluntario') =>
        set((state) => {
          const newCapital = state.cooperativeCapital + amount;
          const result = calculateCooperativeCapital([
            ...Object.entries(state.savings).flatMap(([type, total]) =>
              total > 0 ? [{ associateId: 'legacy', amount: total, date: state.createdAt, type: 'inicial' as const }] : []
            ),
            { associateId, amount, date: Date.now(), type: aportType },
          ]);
          return {
            cooperativeCapital: newCapital,
            savings: { ...state.savings, aporte_capital: newCapital },
            updatedAt: Date.now(),
          };
        }),

      updateSavings: (type: CapitalType, amount: number) =>
        set((state) => ({
          savings: { ...state.savings, [type]: amount },
          updatedAt: Date.now(),
        })),

      updateCreditPortfolio: (portfolio: Partial<CreditPortfolio>) =>
        set((state) => ({
          creditPortfolio: { ...state.creditPortfolio, ...portfolio },
          updatedAt: Date.now(),
        })),

      setSurplus: (surplus: number) => set({ surplus, updatedAt: Date.now() }),

      // ========================================================================
      // RIESGOS Y REGULACIÓN
      // ========================================================================
      recalculateRiskProfile: (data: Parameters<typeof assessRiskProfile>[0]) =>
        set((state) => ({
          riskProfile: assessRiskProfile(data),
          updatedAt: Date.now(),
        })),

      updateRegulatoryRegime: (activities: Parameters<typeof verifyRegulatoryRegime>[0]) =>
        set((state) => ({
          regulatoryRegime: verifyRegulatoryRegime(activities),
          updatedAt: Date.now(),
        })),

      // ========================================================================
      // PROGRESO ZEITNUS
      // ========================================================================
      setProgressivePhase: (phase: ProgressivePhase) =>
        set((state) => ({
          progressivePhase: phase,
          updatedAt: Date.now(),
        })),

      completePhase: (phase: ProgressivePhase, metrics: PhaseMetrics) =>
        set((state) => ({
          phaseCompleted: [...state.phaseCompleted.filter(p => p !== phase), phase],
          phaseMetrics: { ...state.phaseMetrics, [phase]: { ...state.phaseMetrics[phase], ...metrics, gatePassed: true } },
          // Auto-avanzar a siguiente fase si no es la última
          progressivePhase: phase === 'fase_10_escalar' ? 'completa' :
            (['fase_1_vision', 'fase_2_comunidad', 'fase_3_necesidades', 'fase_4_viabilidad',
              'fase_5_estructura', 'fase_6_gobierno', 'fase_7_transparencia', 'fase_8_proyectos',
              'fase_9_evaluar_financiera', 'fase_10_escalar'].indexOf(phase) >= 0
              ? (['fase_1_vision', 'fase_2_comunidad', 'fase_3_necesidades', 'fase_4_viabilidad',
                'fase_5_estructura', 'fase_6_gobierno', 'fase_7_transparencia', 'fase_8_proyectos',
                'fase_9_evaluar_financiera', 'fase_10_escalar'][
                  ['fase_1_vision', 'fase_2_comunidad', 'fase_3_necesidades', 'fase_4_viabilidad',
                    'fase_5_estructura', 'fase_6_gobierno', 'fase_7_transparencia', 'fase_8_proyectos',
                    'fase_9_evaluar_financiera', 'fase_10_escalar'].indexOf(phase) + 1
                ] as ProgressivePhase)
              : state.progressivePhase),
          updatedAt: Date.now(),
        })),

      updatePhaseMetrics: (phase: ProgressivePhase, metrics: Partial<PhaseMetrics>) =>
        set((state) => ({
          phaseMetrics: { ...state.phaseMetrics, [phase]: { ...state.phaseMetrics[phase], ...metrics } },
          updatedAt: Date.now(),
        })),

      // ========================================================================
      // ECONOMÍA CIRCULAR
      // ========================================================================
      addCircularProject: (project: Omit<CircularProject, 'id'>) =>
        set((state) => ({
          circularProjects: [...state.circularProjects, { ...project, id: `cp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}` }],
          updatedAt: Date.now(),
        })),

      updateCircularProject: (id: string, updates: Partial<CircularProject>) =>
        set((state) => ({
          circularProjects: state.circularProjects.map(p => p.id === id ? { ...p, ...updates } : p),
          updatedAt: Date.now(),
        })),

      removeCircularProject: (id: string) =>
        set((state) => ({
          circularProjects: state.circularProjects.filter(p => p.id !== id),
          updatedAt: Date.now(),
        })),

      recalculateCircularMetrics: () =>
        set((state) => {
          const metrics = measureCircularEconomy({
            residuosEntrada: Object.fromEntries(
              state.circularProjects.flatMap(p => Object.entries(p.inputs))
            ),
            productosSalida: Object.fromEntries(
              state.circularProjects.flatMap(p => Object.entries(p.outputs))
            ),
            empleosDirectos: state.circularProjects.reduce((sum, p) => sum + (p.metrics.empleosGenerados || 0), 0),
            empleosIndirectos: 0,
            proyectosActivos: state.circularProjects.filter(p => p.status === 'ejecucion').length,
            participantesActivos: state.socialCapital.participacionComunitaria || 0,
            recursosNaturalesConservados: state.circularMetrics.recursosNaturalesProtegidos,
            infoFinancieraPublicada: state.transparencyMechanisms.some(m => m.type === 'info_financiera' && m.status === 'activo'),
            reportesPeriodicos: state.transparencyMechanisms.some(m => m.type === 'reportes_periodicos' && m.status === 'activo'),
            auditoriasRealizadas: state.transparencyMechanisms.filter(m => m.type === 'auditorias' && m.status === 'activo').length,
            decisionesRegistradas: state.transparencyMechanisms.some(m => m.type === 'registro_decisiones' && m.status === 'activo'),
            participacionAsociados: state.socialCapital.relacionesHumanas,
            ingresosGenerados: state.circularProjects.reduce((sum, p) => sum + p.revenue, 0),
            costosOperativos: state.circularProjects.reduce((sum, p) => sum + p.actualCost, 0),
          });
          return { circularMetrics: metrics, updatedAt: Date.now() };
        }),

      // ========================================================================
      // CAPITAL SOCIAL
      // ========================================================================
      updateSocialCapital: (data: Parameters<typeof buildSocialCapital>[0]) =>
        set((state) => ({
          socialCapital: buildSocialCapital(data),
          updatedAt: Date.now(),
        })),

      // ========================================================================
      // TRANSPARENCIA
      // ========================================================================
      addTransparencyMechanism: (mechanism: Omit<TransparencyMechanism, 'id'>) =>
        set((state) => ({
          transparencyMechanisms: [...state.transparencyMechanisms, { ...mechanism, id: `tm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}` }],
          updatedAt: Date.now(),
        })),

      updateTransparencyMechanism: (id: string, updates: Partial<TransparencyMechanism>) =>
        set((state) => ({
          transparencyMechanisms: state.transparencyMechanisms.map(m => m.id === id ? { ...m, ...updates } : m),
          updatedAt: Date.now(),
        })),

      removeTransparencyMechanism: (id: string) =>
        set((state) => ({
          transparencyMechanisms: state.transparencyMechanisms.filter(m => m.id !== id),
          updatedAt: Date.now(),
        })),

      recalculateTransparencyIndex: (data: Parameters<typeof ensureTransparency>[0]) =>
        set((state) => {
          const result = ensureTransparency(data);
          return {
            transparencyIndex: result.transparencyIndex,
            transparencyMechanisms: result.mechanisms,
            updatedAt: Date.now(),
          };
        }),

      // ========================================================================
      // EDUCACIÓN
      // ========================================================================
      addEducationProgram: (program: Omit<EducationProgram, 'id'>) =>
        set((state) => ({
          educationPrograms: [...state.educationPrograms, { ...program, id: `ep_${Date.now()}_${Math.random().toString(36).slice(2, 8)}` }],
          updatedAt: Date.now(),
        })),

      updateEducationProgram: (id: string, updates: Partial<EducationProgram>) =>
        set((state) => ({
          educationPrograms: state.educationPrograms.map(p => p.id === id ? { ...p, ...updates } : p),
          updatedAt: Date.now(),
        })),

      removeEducationProgram: (id: string) =>
        set((state) => ({
          educationPrograms: state.educationPrograms.filter(p => p.id !== id),
          updatedAt: Date.now(),
        })),

      updateFinancialLiteracyIndex: (financialLiteracyIndex: number) =>
        set({ financialLiteracyIndex: Math.max(0, Math.min(100, financialLiteracyIndex)), updatedAt: Date.now() }),

      // ========================================================================
      // GOBERNANZA
      // ========================================================================
      updateGovernance: (updates: Partial<GovernanceStructure>) =>
        set((state) => ({
          governance: { ...state.governance, ...updates },
          updatedAt: Date.now(),
        })),

      updateAssembly: (updates: Partial<GovernanceStructure['assembly']>) =>
        set((state) => ({
          governance: { ...state.governance, assembly: { ...state.governance.assembly, ...updates } },
          updatedAt: Date.now(),
        })),

      updateBoard: (updates: Partial<GovernanceStructure['board']>) =>
        set((state) => ({
          governance: { ...state.governance, board: { ...state.governance.board, ...updates } },
          updatedAt: Date.now(),
        })),

      updateManagement: (updates: Partial<GovernanceStructure['management']>) =>
        set((state) => ({
          governance: { ...state.governance, management: { ...state.governance.management, ...updates } },
          updatedAt: Date.now(),
        })),

      updateCommittees: (updates: Partial<GovernanceStructure['committees']>) =>
        set((state) => ({
          governance: { ...state.governance, committees: { ...state.governance.committees, ...updates } },
          updatedAt: Date.now(),
        })),

      updateConflictResolution: (updates: Partial<GovernanceStructure['conflictResolution']>) =>
        set((state) => ({
          governance: { ...state.governance, conflictResolution: { ...state.governance.conflictResolution, ...updates } },
          updatedAt: Date.now(),
        )),

      // ========================================================================
      // RECÁLCULOS DESDE ESTADO
      // ========================================================================
      recalculateRiskProfileFromState: () =>
        set((state) => {
          // Extraer datos del estado para evaluar riesgos
          const portfolio = state.creditPortfolio;
          const riskData = {
            nplRatio: portfolio.totalOutstanding > 0 ? portfolio.nonPerformingLoans / portfolio.totalOutstanding : 0,
            portfolioDiversification: portfolio.sectors && Object.keys(portfolio.sectors).length > 1 ? 0.8 : 0.3,
            provisionCoverage: portfolio.nonPerformingLoans > 0 ? portfolio.provisions / portfolio.nonPerformingLoans : 1,
            liquidityRatio: state.savings.ahorro_disponible / Math.max(state.creditPortfolio.totalOutstanding * 0.1, 1),
            liquidAssets: state.savings.ahorro_disponible + state.savings.ahorro_disponible,
            shortTermObligations: state.creditPortfolio.totalOutstanding * 0.1,
            interestRateSensitivity: 0.1,
            fixedVsVariableRate: 0.7,
            techMaturity: 0.5,
            processAutomation: 0.5,
            incidentRate: 0,
            powerConcentration: 0.3,
            transparencyScore: state.transparencyIndex / 100,
            directorPreparedness: 0.5,
            internalSupervision: state.governance.committees.audit ? 0.8 : 0.3,
            segregationOfDuties: state.governance.committees.audit ? 0.8 : 0.3,
            auditFrequency: state.governance.committees.audit ? 2 : 0,
            authorizationControls: 0.5,
            capitalAdequacy: state.cooperativeCapital / Math.max(state.creditPortfolio.totalOutstanding, 1),
            associateAwareness: 0.5,
          };
          return { riskProfile: assessRiskProfile(riskData), updatedAt: Date.now() };
        }),

      recalculateCircularMetricsFromState: () =>
        set((state) => {
          const metrics = measureCircularEconomy({
            residuosEntrada: Object.fromEntries(state.circularProjects.flatMap(p => Object.entries(p.inputs))),
            productosSalida: Object.fromEntries(state.circularProjects.flatMap(p => Object.entries(p.outputs))),
            empleosDirectos: state.circularProjects.reduce((sum, p) => sum + (p.metrics.empleosGenerados || 0), 0),
            empleosIndirectos: 0,
            proyectosActivos: state.circularProjects.filter(p => p.status === 'ejecucion').length,
            participantesActivos: state.socialCapital.participacionComunitaria || 0,
            recursosNaturalesConservados: state.circularMetrics.recursosNaturalesProtegidos,
            infoFinancieraPublicada: state.transparencyMechanisms.some(m => m.type === 'info_financiera' && m.status === 'activo'),
            reportesPeriodicos: state.transparencyMechanisms.some(m => m.type === 'reportes_periodicos' && m.status === 'activo'),
            auditoriasRealizadas: state.transparencyMechanisms.filter(m => m.type === 'auditorias' && m.status === 'activo').length,
            decisionesRegistradas: state.transparencyMechanisms.some(m => m.type === 'registro_decisiones' && m.status === 'activo'),
            participacionAsociados: state.socialCapital.relacionesHumanas,
            ingresosGenerados: state.circularProjects.reduce((sum, p) => sum + p.revenue, 0),
            costosOperativos: state.circularProjects.reduce((sum, p) => sum + p.actualCost, 0),
          });
          return { circularMetrics: metrics, updatedAt: Date.now() };
        }),

      recalculateSocialCapitalFromState: () =>
        set((state) => {
          // Placeholder - en implementación real se calcularía desde datos reales
          const socialCapital = buildSocialCapital({
            trustSurveys: [],
            networkDensity: 0,
            collaborationEvents: [],
            knowledgeSharing: [],
            coordinationSuccess: [],
          });
          return { socialCapital, updatedAt: Date.now() };
        }),

      recalculateTransparencyIndexFromState: () =>
        set((state) => {
          const result = ensureTransparency({
            financialInfoPublished: state.transparencyMechanisms.some(m => m.type === 'info_financiera' && m.status === 'activo'),
            periodicReports: state.transparencyMechanisms.some(m => m.type === 'reportes_periodicos' && m.status === 'activo'),
            openCommunication: state.transparencyMechanisms.some(m => m.type === 'comunicacion_abierta' && m.status === 'activo'),
            auditsPerformed: state.transparencyMechanisms.filter(m => m.type === 'auditorias' && m.status === 'activo').length,
            decisionsRecorded: state.transparencyMechanisms.some(m => m.type === 'registro_decisiones' && m.status === 'activo'),
            associateParticipation: state.socialCapital.relacionesHumanas,
            conflictOfInterestPolicy: state.governance.board.conflictOfInterestPolicy,
            whistleblowerChannel: false,
          });
          return {
            transparencyIndex: result.transparencyIndex,
            transparencyMechanisms: result.mechanisms,
            updatedAt: Date.now(),
          };
        }),

      // ========================================================================
      // PERSISTENCIA
      // ========================================================================
      saveToStorage: () => {
        // La persistencia la maneja Zustand middleware
        // Esta función es para forzar guardado manual si necesario
        console.log('[ZeitnusCooperative] Estado guardado en localStorage');
      },

      loadFromStorage: () => {
        // La carga la maneja Zustand middleware
        console.log('[ZeitnusCooperative] Estado cargado desde localStorage');
      },

      clearStorage: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(ZEITNUS_COOP_STORAGE_KEY);
          localStorage.removeItem(ZEITNUS_COOP_V1_STORAGE_KEY);
          localStorage.removeItem(ZEITNUS_COOP_MIGRATION_FLAG_KEY);
        }
        set(INITIAL_COOPERATIVE_STATE);
      },

      // ========================================================================
      // MIGRACIÓN V1→V2
      // ========================================================================
      detectV1Data: () => {
        if (typeof window === 'undefined') return false;
        const v1Data = localStorage.getItem(ZEITNUS_COOP_V1_STORAGE_KEY);
        const migrated = localStorage.getItem(ZEITNUS_COOP_MIGRATION_FLAG_KEY);
        return !!v1Data && !migrated;
      },

      migrateV1ToV2: async (userId: string) => {
        if (typeof window === 'undefined') return false;

        try {
          const v1Data = localStorage.getItem(ZEITNUS_COOP_V1_STORAGE_KEY);
          if (!v1Data) return false;

          const parsed = JSON.parse(v1Data);
          // Migrar estructura v1 a v2
          const v2State = createInitialCooperativeState('Migrada desde v1', 'educativa');
          v2State.cooperativeCapital = parsed.capital || 0;
          v2State.savings = parsed.savings || v2State.savings;
          v2State.creditPortfolio = parsed.creditPortfolio || v2State.creditPortfolio;
          v2State.surplus = parsed.surplus || 0;

          set(v2State);
          localStorage.setItem(ZEITNUS_COOP_MIGRATION_FLAG_KEY, 'true');
          localStorage.removeItem(ZEITNUS_COOP_V1_STORAGE_KEY);

          return true;
        } catch (e) {
          console.error('[ZeitnusCooperative] Error migrando v1→v2:', e);
          return false;
        }
      },

      dismissMigration: () => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(ZEITNUS_COOP_MIGRATION_FLAG_KEY, 'dismissed');
        }
      },

      // ========================================================================
      // LOGROS
      // ========================================================================
      unlockAchievement: (achievementId: string) => {
        const achievement = COOPERATIVE_ACHIEVEMENTS.find(a => a.id === achievementId);
        if (achievement) {
          console.log(`[ZeitnusCooperative] Logro desbloqueado: ${achievement.name}`);
          // En implementación real, mostrar toast/notificación
        }
      },

      // ========================================================================
      // RESET
      // ========================================================================
      reset: () => set(INITIAL_COOPERATIVE_STATE),
    }),
    {
      name: ZEITNUS_COOP_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        name: state.name,
        type: state.type,
        registryNumber: state.registryNumber,
        statutes: state.statutes,
        cooperativeCapital: state.cooperativeCapital,
        savings: state.savings,
        creditPortfolio: state.creditPortfolio,
        surplus: state.surplus,
        riskProfile: state.riskProfile,
        regulatoryRegime: state.regulatoryRegime,
        progressivePhase: state.progressivePhase,
        phaseCompleted: state.phaseCompleted,
        phaseMetrics: state.phaseMetrics,
        circularProjects: state.circularProjects,
        circularMetrics: state.circularMetrics,
        socialCapital: state.socialCapital,
        transparencyIndex: state.transparencyIndex,
        transparencyMechanisms: state.transparencyMechanisms,
        educationPrograms: state.educationPrograms,
        financialLiteracyIndex: state.financialLiteracyIndex,
        governance: state.governance,
        createdAt: state.createdAt,
        version: state.version,
      }),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migración de v0 a v1
          return { ...persistedState, version: 1 };
        }
        return persistedState;
      },
    }
  )
);

// ============================================================================
// SELECTORES (Hooks tipados)
// ============================================================================

export const useZeitnusCooperative = () => useZeitnusCooperativeStore();

export const useCooperativeCapital = () => useZeitnusCooperativeStore((s) => s.cooperativeCapital);
export const useSavings = () => useZeitnusCooperativeStore((s) => s.savings);
export const useCreditPortfolio = () => useZeitnusCooperativeStore((s) => s.creditPortfolio);
export const useSurplus = () => useZeitnusCooperativeStore((s) => s.surplus);
export const useRiskProfile = () => useZeitnusCooperativeStore((s) => s.riskProfile);
export const useRegulatoryRegime = () => useZeitnusCooperativeStore((s) => s.regulatoryRegime);
export const useProgressivePhase = () => useZeitnusCooperativeStore((s) => s.progressivePhase);
export const usePhaseCompleted = () => useZeitnusCooperativeStore((s) => s.phaseCompleted);
export const usePhaseMetrics = () => useZeitnusCooperativeStore((s) => s.phaseMetrics);
export const useCircularProjects = () => useZeitnusCooperativeStore((s) => s.circularProjects);
export const useCircularMetrics = () => useZeitnusCooperativeStore((s) => s.circularMetrics);
export const useSocialCapital = () => useZeitnusCooperativeStore((s) => s.socialCapital);
export const useTransparencyIndex = () => useZeitnusCooperativeStore((s) => s.transparencyIndex);
export const useTransparencyMechanisms = () => useZeitnusCooperativeStore((s) => s.transparencyMechanisms);
export const useEducationPrograms = () => useZeitnusCooperativeStore((s) => s.educationPrograms);
export const useFinancialLiteracyIndex = () => useZeitnusCooperativeStore((s) => s.financialLiteracyIndex);
export const useGovernance = () => useZeitnusCooperativeStore((s) => s.governance);
export const useCooperativeName = () => useZeitnusCooperativeStore((s) => s.name);
export const useCooperativeType = () => useZeitnusCooperativeStore((s) => s.type);
export const useProgressivePhase = () => useZeitnusCooperativeStore((s) => s.progressivePhase);
export const usePhaseCompleted = () => useZeitnusCooperativeStore((s) => s.phaseCompleted);

// Selectores compuestos
export const useTotalAssets = () => useZeitnusCooperativeStore((s) =>
  s.cooperativeCapital +
  Object.values(s.savings).reduce((a, b) => a + b, 0) +
  s.creditPortfolio.totalOutstanding
);

export const useLiquidityRatio = () => useZeitnusCooperativeStore((s) =>
  s.creditPortfolio.totalOutstanding > 0
    ? (s.savings.ahorro_disponible + s.savings.ahorro_disponible) / s.creditPortfolio.totalOutstanding
    : 0
);

export const useNPLRatio = () => useZeitnusCooperativeStore((s) =>
  s.creditPortfolio.totalOutstanding > 0
    ? s.creditPortfolio.nonPerformingLoans / s.creditPortfolio.totalOutstanding
    : 0
);

export const usePhaseProgress = () => useZeitnusCooperativeStore((s) => {
  const totalPhases = 10; // fase_1 a fase_10
  const completed = s.phaseCompleted.filter(p => p !== 'completa').length;
  return { completed, total: totalPhases, percentage: Math.round((completed / totalPhases) * 100) };
});

export const useCircularEconomyHealth = () => useZeitnusCooperativeStore((s) => ({
  activeProjects: s.circularProjects.filter(p => p.status === 'ejecucion').length,
  completedProjects: s.circularProjects.filter(p => p.status === 'completado').length,
  totalRevenue: s.circularProjects.reduce((sum, p) => sum + p.revenue, 0),
  totalCost: s.circularProjects.reduce((sum, p) => sum + p.actualCost, 0),
  netImpact: s.circularProjects.reduce((sum, p) => sum + p.revenue - p.actualCost, 0),
  wasteRecoveryRate: s.circularMetrics.materialesReutilizados,
}));

export const useSocialCapitalHealth = () => useZeitnusCooperativeStore((s) => ({
  level: s.socialCapital.nivel,
  score: s.socialCapital.overall,
  trust: s.socialCapital.confianza,
  collaboration: s.socialCapital.cooperacion,
}));

export const useTransparencyHealth = () => useZeitnusCooperativeStore((s) => ({
  index: s.transparencyIndex,
  activeMechanisms: s.transparencyMechanisms.filter(m => m.status === 'activo').length,
  totalMechanisms: s.transparencyMechanisms.length,
  gaps: s.transparencyMechanisms.length < 5 ? 'Insuficientes mecanismos' : 'Cobertura adecuada',
}));

export const useEducationHealth = () => useZeitnusCooperativeStore((s) => ({
  literacyIndex: s.financialLiteracyIndex,
  activePrograms: s.educationPrograms.filter(p => p.status === 'en_curso').length,
  completedPrograms: s.educationPrograms.filter(p => p.status === 'completado').length,
  totalParticipants: s.educationPrograms.reduce((sum, p) => sum + p.participants, 0),
}));