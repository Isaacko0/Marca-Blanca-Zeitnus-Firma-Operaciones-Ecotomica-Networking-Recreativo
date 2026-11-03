// hooks/ilargiakaos.ts — Zustand store para Teoría Cyberpunk/Postcapitalismo Ilargiakaos
// Principio Anfibio: postmonetario (ZNU/CaaS) ↔ conectado (USD/USDC vía priceParity)

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  IlargiakaosState,
  TechnoMutant,
  CyberneticSubject,
  CapitalistRealism,
  PAC,
  TechOrientation,
  Accelerationism,
  EcoAnarchistTech,
  PostcapitalistDesire,
  HumanHybridIdentity,
  NeoludditeAudit,
  CyberfeministComms,
  PostApocalypticGovernance,
} from '@core/lib/ilargiakaos-types';
import {
  INITIAL_ILARGIAKAOS_STATE,
  ILARGIAKAOS_STORAGE_KEY,
  ILARGIAKAOS_V1_STORAGE_KEY,
  ILARGIAKAOS_MIGRATION_FLAG_KEY,
  ILARGIAKAOS_ACHIEVEMENTS,
} from '@core/state/ilargiakaos';
import {
  detectCapitalistRealism,
  assessTechFlexibility,
  buildPAC,
  simulateAntiAcceleration,
  assessEcoAnarchistTech,
  verifyHumanHybridIdentity,
  extractPostcapitalistDesire,
  auditNeoludditeTrigger,
  measureCyberfeministComms,
  simulatePostApocalypticDayAfter,
  createInitialIlargiakaosState,
} from '@core/lib/ilargiakaos-theory';

export type IlargiakaosStore = IlargiakaosState & {
  // PAC Actions
  createPAC: (community: { name: string; members: string[]; values: string[]; context: string }, values: string[], techOrientation?: Partial<import('@core/lib/ilargiakaos-types').TechOrientation>) => PAC;
  setActivePAC: (pac: PAC | null) => void;
  archivePAC: (pacId: string) => void;

  // Capitalist Realism Actions
  scanRealism: (text: string, code?: string) => CapitalistRealism;
  getRealismHistory: () => CapitalistRealism[];

  // Identity Actions
  registerIdentity: (agent: { agentId: string; carbonTraits: string[]; siliconTraits: string[]; mandatoryImplants: string[]; chosenAugmentations: string[]; surveillanceExposure: number; pohVerification?: { verified: boolean; type: string; score: number } }) => HumanHybridIdentity;
  updateIdentity: (agentId: string, updates: Partial<HumanHybridIdentity>) => void;
  removeIdentity: (agentId: string) => void;

  // Cultural Analysis Actions
  analyzeArtifact: (artifact: { id: string; type: 'film' | 'series' | 'book' | 'game' | 'toy' | 'meme' | 'other'; title: string; year: number; creators: string[]; description: string; themes: string[] }) => PostcapitalistDesire;
  getExtractedDesires: () => PostcapitalistDesire[];

  // Accelerationism Actions
  analyzeAccelerationism: (scenario: { name: string; description: string; techAdvances: string[]; socialChanges: string[]; economicModel: string }) => ReturnType<typeof simulateAntiAcceleration>;
  getAccelerationismAnalysis: () => Accelerationism;

  // Tech Assessment Actions
  assessTechnology: (tech: { name: string; description: string; purpose: string; controlStructure: 'corporate' | 'state' | 'community' | 'commons' | 'open-source'; liberatesLabor: boolean; ecologicalImpact: 'regenerative' | 'neutral' | 'degenerative' | 'unknown'; democraticGovernance: boolean; accessModel: 'proprietary' | 'freemium' | 'open-access' | 'commons-based' }) => EcoAnarchistTech;
  auditDeployment: (deployment: { techDeploymentId: string; techName: string; description: string; context: 'neoliberal' | 'cooperative' | 'public' | 'commons' | 'military'; controlStructure: string; purpose: string; ecologicalImpact: string; criticalVoicesAllowed: boolean }) => NeoludditeAudit;
  getAssessedTechs: () => EcoAnarchistTech[];
  getAudits: () => NeoludditeAudit[];

  // Comms Actions
  measureComms: (network: { networkId: string; networkName: string; topology: 'hierarchical' | 'flat' | 'mesh' | 'federated' | 'hybrid'; decisionMaking: 'top-down' | 'consensus' | 'consent' | 'voting' | 'algorithmic'; participationRate: number; feministModeration: boolean; patriarchalPatterns: string[]; neoliberalMetrics: boolean }) => CyberfeministComms;
  getCommsAnalyses: () => CyberfeministComms[];

  // Futures Actions
  modelPostApocalyptic: (scenario: { scenarioId: string; scenarioName: string; triggerEvent: 'nuclear' | 'pandemic' | 'climate' | 'meteor' | 'war' | 'zombie' | 'economic_collapse'; initialPopulation: number; availableTech: string[]; socialCohesion: number; ecologicalDamage: number }) => PostApocalypticGovernance;
  getPostApocalypticModels: () => PostApocalypticGovernance[];

  // PAC Actions
  createPACFromCommunity: (community: { name: string; members: string[]; values: string[]; context: string }, values: string[], techOrientation?: Partial<import('@core/lib/ilargiakaos-types').TechOrientation>) => PAC;
  getPAChistory: () => PAC[];

  // Utility
  unlockAchievement: (achievementId: string) => void;
  reset: () => void;
  saveToStorage: () => void;
  loadFromStorage: () => void;
  clearStorage: () => void;
  detectV1Data: () => boolean;
  migrateV1ToV2: (userId: string) => Promise<boolean>;
  dismissMigration: () => void;

  // Tech Flexibility
  assessTechFlexibility: (tech: { name: string; description: string; currentUse: string; potentialUses: string[] }, culture: { name: string; values: string[]; isCapitalist: boolean; isNeoliberal: boolean }) => ReturnType<typeof assessTechFlexibility>;
};

// ============================================================================
// STORE ZUSTAND
// ============================================================================

export const useIlargiakaosStore = create<IlargiakaosStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      ...INITIAL_ILARGIAKAOS_STATE,

      // ========================================================================
      // PAC ACTIONS
      // ========================================================================
      createPAC: (community, values, techOrientation) => {
        const pac = buildPAC(community, values, techOrientation);
        set((state) => ({
          activePAC: pac,
          pacHistory: [pac, ...state.pacHistory].slice(0, 50),
          updatedAt: Date.now(),
        }));
        return pac;
      },

      setActivePAC: (pac: PAC | null) =>
        set({ activePAC: pac, updatedAt: Date.now() }),

      archivePAC: (pacId: string) =>
        set((state) => ({
          pacHistory: state.pacHistory.filter(p => p.id !== pacId),
          updatedAt: Date.now(),
        })),

      // ========================================================================
      // CAPITALIST REALISM ACTIONS
      // ========================================================================
      scanRealism: (text: string, code?: string) => {
        const realism = detectCapitalistRealism(text, code);
        set((state) => ({
          capitalistRealism: realism,
          realismScans: [realism, ...state.realismScans].slice(0, 100),
          updatedAt: Date.now(),
        }));
        return realism;
      },

      getRealismHistory: () => get().realismScans,

      // ========================================================================
      // IDENTITY ACTIONS
      // ========================================================================
      registerIdentity: (agent) => {
        const identity = verifyHumanHybridIdentity(agent);
        set((state) => ({
          agentIdentities: { ...state.agentIdentities, [agent.agentId]: identity },
          updatedAt: Date.now(),
        }));
        return identity;
      },

      updateIdentity: (agentId: string, updates: Partial<HumanHybridIdentity>) =>
        set((state) => ({
          agentIdentities: {
            ...state.agentIdentities,
            [agentId]: { ...state.agentIdentities[agentId], ...updates, lastUpdated: Date.now() },
          },
          updatedAt: Date.now(),
        })),

      removeIdentity: (agentId: string) =>
        set((state) => {
          const { [agentId]: _, ...rest } = state.agentIdentities;
          return { agentIdentities: rest, updatedAt: Date.now() };
        }),

      // ========================================================================
      // CULTURAL ANALYSIS ACTIONS
      // ========================================================================
      analyzeArtifact: (artifact) => {
        const desire = extractPostcapitalistDesire(artifact);
        set((state) => ({
          extractedDesires: [desire, ...state.extractedDesires].slice(0, 200),
          updatedAt: Date.now(),
        }));
        return desire;
      },

      getExtractedDesires: () => get().extractedDesires,

      // ========================================================================
      // ACCELERATIONISM ACTIONS
      // ========================================================================
      analyzeAccelerationism: (scenario) => {
        const analysis = simulateAntiAcceleration(scenario);
        set((state) => ({
          accelerationismAnalysis: {
            ...state.accelerationismAnalysis,
            landianAccelerationism: analysis.landianTrajectory.probability > 0.5 ? {
              detected: true,
              capitalismSurpassesHuman: true,
              postcapitalismViaInhuman: true,
              uncontrolledBecoming: true,
              infinitePlasticity: true,
            } : state.accelerationismAnalysis.landianAccelerationism,
            antiAccelerationism: {
              reapropriationOfNew: true,
              humanCentricFuture: true,
              controlledInnovation: true,
              culturalProgrammingOfTech: true,
            },
            divergenceScore: analysis.divergenceScore,
            lastAnalysis: Date.now(),
          },
          updatedAt: Date.now(),
        }));
        return analysis;
      },

      getAccelerationismAnalysis: () => get().accelerationismAnalysis,

      // ========================================================================
      // TECH ASSESSMENT ACTIONS
      // ========================================================================
      assessTechnology: (tech) => {
        const assessed = assessEcoAnarchistTech(tech);
        set((state) => ({
          assessedTechnologies: { ...state.assessedTechnologies, [assessed.techId]: assessed },
          updatedAt: Date.now(),
        }));
        return assessed;
      },

      auditDeployment: (deployment) => {
        const audit = auditNeoludditeTrigger(deployment);
        set((state) => ({
          neoludditeAudits: [audit, ...state.neoludditeAudits].slice(0, 100),
          updatedAt: Date.now(),
        }));
        return audit;
      },

      getAssessedTechs: () => Object.values(get().assessedTechnologies),
      getAudits: () => get().neoludditeAudits,

      // ========================================================================
      // COMMS ACTIONS
      // ========================================================================
      measureComms: (network) => {
        const analysis = measureCyberfeministComms(network);
        set((state) => ({
          commsAnalyses: { ...state.commsAnalyses, [network.networkId]: analysis },
          updatedAt: Date.now(),
        }));
        return analysis;
      },

      getCommsAnalyses: () => Object.values(get().commsAnalyses),

      // ========================================================================
      // FUTURES ACTIONS
      // ========================================================================
      modelPostApocalyptic: (scenario) => {
        const model = simulatePostApocalypticDayAfter(scenario);
        set((state) => ({
          postApocalypticModels: { ...state.postApocalypticModels, [scenario.scenarioId]: model },
          updatedAt: Date.now(),
        }));
        return model;
      },

      getPostApocalypticModels: () => Object.values(get().postApocalypticModels),

      // ========================================================================
      // PAC FROM COMMUNITY
      // ========================================================================
      createPACFromCommunity: (community, values, techOrientation) => {
        const pac = buildPAC(community, values, techOrientation);
        set((state) => ({
          activePAC: pac,
          pacHistory: [pac, ...state.pacHistory].slice(0, 50),
          updatedAt: Date.now(),
        }));
        return pac;
      },

      getPAChistory: () => get().pacHistory,

      // ========================================================================
      // TECH FLEXIBILITY
      // ========================================================================
      assessTechFlexibility: (tech, culture) => assessTechFlexibility(tech, culture),

      // ========================================================================
      // UTILITY
      // ========================================================================
      unlockAchievement: (achievementId: string) => {
        const achievement = ILARGIAKAOS_ACHIEVEMENTS.find(a => a.id === achievementId);
        if (achievement) {
          console.log(`[Ilargiakaos] Logro desbloqueado: ${achievement.name}`);
        }
      },

      reset: () => set(createInitialIlargiakaosState()),

      saveToStorage: () => {
        console.log('[Ilargiakaos] Estado guardado en localStorage');
      },

      loadFromStorage: () => {
        console.log('[Ilargiakaos] Estado cargado desde localStorage');
      },

      clearStorage: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(ILARGIAKAOS_STORAGE_KEY);
          localStorage.removeItem(ILARGIAKAOS_V1_STORAGE_KEY);
          localStorage.removeItem(ILARGIAKAOS_MIGRATION_FLAG_KEY);
        }
        set(createInitialIlargiakaosState());
      },

      detectV1Data: () => {
        if (typeof window === 'undefined') return false;
        const v1Data = localStorage.getItem(ILARGIAKAOS_V1_STORAGE_KEY);
        const migrated = localStorage.getItem(ILARGIAKAOS_MIGRATION_FLAG_KEY);
        return !!v1Data && !migrated;
      },

      migrateV1ToV2: async (userId: string) => {
        if (typeof window === 'undefined') return false;
        try {
          const v1Data = localStorage.getItem(ILARGIAKAOS_V1_STORAGE_KEY);
          if (!v1Data) return false;
          const parsed = JSON.parse(v1Data);
          const v2State = createInitialIlargiakaosState();
          // Migrar campos compatibles
          if (parsed.activePAC) v2State.activePAC = parsed.activePAC;
          if (parsed.pacHistory) v2State.pacHistory = parsed.pacHistory;
          if (parsed.capitalistRealism) v2State.capitalistRealism = parsed.capitalistRealism;
          if (parsed.agentIdentities) v2State.agentIdentities = parsed.agentIdentities;
          if (parsed.extractedDesires) v2State.extractedDesires = parsed.extractedDesires;
          set(v2State);
          localStorage.setItem(ILARGIAKAOS_MIGRATION_FLAG_KEY, 'true');
          localStorage.removeItem(ILARGIAKAOS_V1_STORAGE_KEY);
          return true;
        } catch (e) {
          console.error('[Ilargiakaos] Error migrando v1→v2:', e);
          return false;
        }
      },

      dismissMigration: () => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(ILARGIAKAOS_MIGRATION_FLAG_KEY, 'dismissed');
        }
      },
    }),
    {
      name: ILARGIAKAOS_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activePAC: state.activePAC,
        pacHistory: state.pacHistory,
        capitalistRealism: state.capitalistRealism,
        realismScans: state.realismScans.slice(0, 20),
        agentIdentities: state.agentIdentities,
        extractedDesires: state.extractedDesires.slice(0, 50),
        accelerationismAnalysis: state.accelerationismAnalysis,
        assessedTechnologies: state.assessedTechnologies,
        neoludditeAudits: state.neoludditeAudits.slice(0, 30),
        commsAnalyses: state.commsAnalyses,
        postApocalypticModels: state.postApocalypticModels,
        createdAt: state.createdAt,
        version: state.version,
      }),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
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

export const useIlargiakaos = () => useIlargiakaosStore();

export const useActivePAC = () => useIlargiakaosStore((s) => s.activePAC);
export const usePAChistory = () => useIlargiakaosStore((s) => s.pacHistory);
export const useCapitalistRealism = () => useIlargiakaosStore((s) => s.capitalistRealism);
export const useRealismScans = () => useIlargiakaosStore((s) => s.realismScans);
export const useAgentIdentities = () => useIlargiakaosStore((s) => s.agentIdentities);
export const useExtractedDesires = () => useIlargiakaosStore((s) => s.extractedDesires);
export const useAccelerationismAnalysis = () => useIlargiakaosStore((s) => s.accelerationismAnalysis);
export const useAssessedTechnologies = () => useIlargiakaosStore((s) => s.assessedTechnologies);
export const useNeoludditeAudits = () => useIlargiakaosStore((s) => s.neoludditeAudits);
export const useCommsAnalyses = () => useIlargiakaosStore((s) => s.commsAnalyses);
export const usePostApocalypticModels = () => useIlargiakaosStore((s) => s.postApocalypticModels);

// Selectores compuestos
export const useRealismSeverity = () => useIlargiakaosStore((s) => s.capitalistRealism.severity);
export const useRealismDetected = () => useIlargiakaosStore((s) => s.capitalistRealism.atmosphereDetected);
export const useActivePACViability = () => useIlargiakaosStore((s) => s.activePAC?.collectiveViability ?? 0);
export const useActivePACEcosocial = () => useIlargiakaosStore((s) => s.activePAC?.ecosocialAlignment ?? 0);
export const useDivergenceScore = () => useIlargiakaosStore((s) => s.accelerationismAnalysis.divergenceScore);
export const useAssessedTechCount = () => useIlargiakaosStore((s) => Object.keys(s.assessedTechnologies).length);
export const useLiberatingTechCount = () => useIlargiakaosStore((s) =>
  Object.values(s.assessedTechnologies).filter(t => t.assessment === 'liberadora').length
);
export const useExtractiveTechCount = () => useIlargiakaosStore((s) =>
  Object.values(s.assessedTechnologies).filter(t => t.assessment === 'extractiva').length
);
export const useAuditCount = () => useIlargiakaosStore((s) => s.neoludditeAudits.length);
export const useCriticalAuditCount = () => useIlargiakaosStore((s) =>
  s.neoludditeAudits.filter(a => a.criticalAuditTriggered).length
);
export const useNetworkedCommsAvg = () => useIlargiakaosStore((s) => {
  const analyses = Object.values(s.commsAnalyses);
  if (analyses.length === 0) return 0;
  return analyses.reduce((sum, a) => sum + a.networkedCommunicationScore, 0) / analyses.length;
});
export const usePostApocalypticViability = () => useIlargiakaosStore((s) => {
  const models = Object.values(s.postApocalypticModels);
  if (models.length === 0) return 0;
  return models.reduce((sum, m) => sum + m.viabilityScore, 0) / models.length;
});