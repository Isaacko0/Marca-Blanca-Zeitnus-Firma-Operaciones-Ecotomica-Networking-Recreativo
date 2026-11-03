// hooks/urban-green-governance.ts — Zustand store para SBN + Gobernanza del Suelo Urbano
// Principio Anfibio: postmonetario (ZNU/CaaS) ↔ conectado (USD/USDC vía priceParity)

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  UrbanGreenState,
  SBNProject,
  EcosystemServices,
  GreenROI,
  UrbanMicroclimate,
  MicroclimateScenario,
  ProjectGovernance,
  GovernanceActor,
  ProjectFinancing,
  FundingSource,
  LandValueCaptureConfig,
  GreenBondConfig,
  CaasStreamConfig,
  LandValueCapture,
  GovernanceInstrument,
  GovernanceCoordination,
  Contradiction,
  SharedStrategy,
  ImplementationStep,
  MonitoringIndicator,
} from '@core/lib/urban-green-governance-types';
import {
  INITIAL_URBAN_GREEN_STATE,
  URBAN_GREEN_STORAGE_KEY,
  URBAN_GREEN_V1_STORAGE_KEY,
  URBAN_GREEN_MIGRATION_FLAG_KEY,
  URBAN_GREEN_ACHIEVEMENTS,
} from '@core/state/urban-green-governance';
import {
  calculateEcosystemServices,
  simulateGreenROI,
  modelUrbanMicroclimate,
  assessGovernanceCoordination,
  calculateLandValueCapture,
  designGovernanceInstruments,
  simulateSharedStrategy,
  createInitialUrbanGreenState,
} from '@core/lib/urban-green-governance';

export type UrbanGreenStore = UrbanGreenState & {
  // SBN Projects
  createSBNProject: (project: Omit<SBNProject, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'ecosystemServices' | 'roi' | 'microclimateImpact' | 'governance' | 'financing'>) => SBNProject;
  updateSBNProject: (id: string, updates: Partial<SBNProject>) => void;
  deleteSBNProject: (id: string) => void;
  getSBNProject: (id: string) => SBNProject | undefined;
  listSBNProjects: () => SBNProject[];

  // Ecosystem Services & ROI
  recalculateEcosystemServices: (projectId: string) => void;
  recalculateROI: (projectId: string, investment: number, mode: 'postmonetario' | 'conectado', priceParity?: number) => void;
  recalculateMicroclimate: (projectId: string, urbanContext: any) => void;

  // Governance
  assessCoordination: (actors: GovernanceActor[]) => GovernanceCoordination;
  captureLandValue: (params: any) => LandValueCapture;
  designInstruments: (params: any) => GovernanceInstrument[];
  simulateStrategy: (actors: GovernanceActor[]) => SharedStrategy;

  // Actors
  addActor: (actor: Omit<GovernanceActor, 'id'>) => GovernanceActor;
  updateActor: (id: string, updates: Partial<GovernanceActor>) => void;
  deleteActor: (id: string) => void;

  // Instruments
  addInstrument: (instrument: Omit<GovernanceInstrument, 'id' | 'createdAt' | 'updatedAt'>) => GovernanceInstrument;
  updateInstrument: (id: string, updates: Partial<GovernanceInstrument>) => void;
  deleteInstrument: (id: string) => void;

  // Land Value Capture
  addLandValueCapture: (capture: Omit<LandValueCapture, 'capturedAt'>) => LandValueCapture;

  // Shared Strategy
  updateSharedStrategy: (id: string, updates: Partial<SharedStrategy>) => void;

  // Utility
  unlockAchievement: (achievementId: string) => void;
  reset: () => void;
  saveToStorage: () => void;
  loadFromStorage: () => void;
  clearStorage: () => void;
  detectV1Data: () => boolean;
  migrateV1ToV2: (userId: string) => Promise<boolean>;
  dismissMigration: () => void;
};

// ============================================================================
// STORE ZUSTAND
// ============================================================================

export const useUrbanGreenStore = create<UrbanGreenStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      ...INITIAL_URBAN_GREEN_STATE,

      // ========================================================================
      // SBN PROJECTS
      // ========================================================================
      createSBNProject: (projectData) => {
        const now = Date.now();
        const id = `sbn_${now}_${Math.random().toString(36).slice(2, 8)}`;
        
        // Calcular servicios ecosistémicos
        const ecosystemServices = calculateEcosystemServices({
          type: projectData.type,
          location: projectData.location,
          area_hectares: projectData.location.area_hectares,
        });

        // Crear proyecto base (ROI y microclima se calculan luego)
        const project: SBNProject = {
          ...projectData,
          id,
          ecosystemServices,
          roi: {
            initialInvestment_usd: 0,
            annualReturns_usd: 0,
            paybackPeriod_years: 0,
            netPresentValue_usd: 0,
            internalRateOfReturn: 0,
            benefitCostRatio: 0,
            returnsBreakdown: { co2: 0, water: 0, pollution: 0, energy: 0, other: 0 },
            monetaryMode: 'postmonetario',
          },
          microclimateImpact: {
            temperatureReduction_celsius: 0,
            heatIslandMitigation: 0,
            floodRiskReduction: 0,
            humidityRegulation: 0,
            windSpeedModification: 0,
            thermalComfortIndex: 0,
            scenarios: [],
          },
          governance: projectData.governance || {
            leadEntity: '',
            participatingActors: [],
            coordinationMechanism: 'municipal',
            decisionMakingProcess: 'participatory',
            transparencyMechanisms: [],
            accountabilityMeasures: [],
            communityParticipationLevel: 'consult',
            conflictResolutionMechanism: '',
          },
          financing: projectData.financing || {
            totalCost_usd: 0,
            fundingSources: [],
            landValueCapture: { enabled: false, instruments: [], capturedValue_usd: 0, allocation: { infrastructure_pct: 0, affordable_housing_pct: 0, public_space_pct: 0, community_fund_pct: 0, anti_displacement_pct: 0 }, antiDisplacementMeasures: [] },
            greenBonds: null,
            caasStreams: null,
            postmonetarioAllocation: 0,
            conectadoAllocation: 0,
          },
          createdAt: now,
          updatedAt: now,
          version: 1,
        };

        set((state) => ({
          sbnProjects: { ...state.sbnProjects, [id]: project },
          ecosystemServices: { ...state.ecosystemServices, [id]: project.ecosystemServices },
          updatedAt: now,
        }));

        return project;
      },

      updateSBNProject: (id: string, updates: Partial<SBNProject>) =>
        set((state) => {
          const project = state.sbnProjects[id];
          if (!project) return state;
          const updated = { ...project, ...updates, updatedAt: Date.now() };
          return {
            sbnProjects: { ...state.sbnProjects, [id]: updated },
            updatedAt: Date.now(),
          };
        }),

      deleteSBNProject: (id: string) =>
        set((state) => {
          const { [id]: _, ...sbnProjects } = state.sbnProjects;
          const { [id]: _, ...ecosystemServices } = state.ecosystemServices;
          const { [id]: _, ...greenROI } = state.greenROI;
          const { [id]: _, ...urbanMicroclimate } = state.urbanMicroclimate;
          return { sbnProjects, ecosystemServices, greenROI, urbanMicroclimate, updatedAt: Date.now() };
        }),

      getSBNProject: (id: string) => get().sbnProjects[id],

      listSBNProjects: () => Object.values(get().sbnProjects),

      // ========================================================================
      // ECOSYSTEM SERVICES & ROI
      // ========================================================================
      recalculateEcosystemServices: (projectId: string) =>
        set((state) => {
          const project = state.sbnProjects[projectId];
          if (!project) return state;
          const services = calculateEcosystemServices({
            type: project.type,
            location: project.location,
            area_hectares: project.location.area_hectares,
          });
          return {
            sbnProjects: { ...state.sbnProjects, [projectId]: { ...project, ecosystemServices, updatedAt: Date.now() } },
            ecosystemServices: { ...state.ecosystemServices, [projectId]: services },
            updatedAt: Date.now(),
          };
        }),

      recalculateROI: (projectId: string, investment: number, mode: 'postmonetario' | 'conectado', priceParity?: number) =>
        set((state) => {
          const project = state.sbnProjects[projectId];
          if (!project) return state;
          const roi = simulateGreenROI({
            project: { type: project.type, location: project.location, area_hectares: project.location.area_hectares },
            initialInvestment_usd: investment,
            monetaryMode: mode,
            priceParity_usd_per_znu: priceParity,
          });
          return {
            sbnProjects: { ...state.sbnProjects, [projectId]: { ...project, roi, updatedAt: Date.now() } },
            greenROI: { ...state.greenROI, [projectId]: roi },
            updatedAt: Date.now(),
          };
        }),

      recalculateMicroclimate: (projectId: string, urbanContext: any) =>
        set((state) => {
          const project = state.sbnProjects[projectId];
          if (!project) return state;
          const microclimate = modelUrbanMicroclimate({
            project: { type: project.type, location: project.location, area_hectares: project.location.area_hectares },
            urbanContext,
          });
          return {
            sbnProjects: { ...state.sbnProjects, [projectId]: { ...project, microclimateImpact: microclimate, updatedAt: Date.now() } },
            urbanMicroclimate: { ...state.urbanMicroclimate, [projectId]: microclimate },
            updatedAt: Date.now(),
          };
        }),

      // ========================================================================
      // GOVERNANCE
      // ========================================================================
      assessCoordination: (actors: GovernanceActor[]) => {
        const coordination = assessGovernanceCoordination(actors);
        set((state) => ({
          governanceCoordination: { ...state.governanceCoordination, [coordination.scenarioId]: coordination },
          updatedAt: Date.now(),
        }));
        return coordination;
      },

      captureLandValue: (params: any) => {
        const capture = calculateLandValueCapture(params);
        set((state) => ({
          landValueCapture: { ...state.landValueCapture, [capture.projectId]: capture },
          updatedAt: Date.now(),
        }));
        return capture;
      },

      designInstruments: (params: any) => {
        const instruments = designGovernanceInstruments(params);
        set((state) => {
          const newInstruments = { ...state.governanceInstruments };
          instruments.forEach(inst => { newInstruments[inst.id] = inst; });
          return { governanceInstruments: newInstruments, updatedAt: Date.now() };
        });
        return instruments;
      },

      simulateStrategy: (actors: GovernanceActor[]) => {
        const strategy = simulateSharedStrategy(actors);
        set((state) => ({
          sharedStrategies: { ...state.sharedStrategies, [strategy.implementationPlan[0]?.id || `strategy_${Date.now()}`]: strategy },
          updatedAt: Date.now(),
        }));
        return strategy;
      },

      // ========================================================================
      // ACTORS
      // ========================================================================
      addActor: (actor: Omit<GovernanceActor, 'id'>) => {
        const id = `actor_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const newActor = { ...actor, id };
        set((state) => ({
          // Actors would be stored in a separate slice; for now just return
        }));
        return newActor;
      },

      updateActor: (id: string, updates: Partial<GovernanceActor>) => {
        // Implementation would update actor in coordination scenarios
      },

      deleteActor: (id: string) => {
        // Implementation would remove actor
      },

      // ========================================================================
      // INSTRUMENTS
      // ========================================================================
      addInstrument: (instrument: Omit<GovernanceInstrument, 'id' | 'createdAt' | 'updatedAt'>) => {
        const now = Date.now();
        const id = `inst_${now}_${Math.random().toString(36).slice(2, 8)}`;
        const newInstrument: GovernanceInstrument = { ...instrument, id, createdAt: now, updatedAt: now };
        set((state) => ({
          governanceInstruments: { ...state.governanceInstruments, [id]: newInstrument },
          updatedAt: now,
        }));
        return newInstrument;
      },

      updateInstrument: (id: string, updates: Partial<GovernanceInstrument>) =>
        set((state) => ({
          governanceInstruments: { ...state.governanceInstruments, [id]: { ...state.governanceInstruments[id], ...updates, updatedAt: Date.now() } },
          updatedAt: Date.now(),
        })),

      deleteInstrument: (id: string) =>
        set((state) => {
          const { [id]: _, ...instruments } = state.governanceInstruments;
          return { governanceInstruments: instruments, updatedAt: Date.now() };
        }),

      // ========================================================================
      // LAND VALUE CAPTURE
      // ========================================================================
      addLandValueCapture: (capture: Omit<LandValueCapture, 'capturedAt'>) => {
        const newCapture: LandValueCapture = { ...capture, capturedAt: Date.now() };
        set((state) => ({
          landValueCapture: { ...state.landValueCapture, [newCapture.projectId]: newCapture },
          updatedAt: Date.now(),
        }));
        return newCapture;
      },

      // ========================================================================
      // SHARED STRATEGY
      // ========================================================================
      updateSharedStrategy: (id: string, updates: Partial<SharedStrategy>) =>
        set((state) => ({
          sharedStrategies: { ...state.sharedStrategies, [id]: { ...state.sharedStrategies[id], ...updates } },
          updatedAt: Date.now(),
        })),

      // ========================================================================
      // UTILITY
      // ========================================================================
      unlockAchievement: (achievementId: string) => {
        const achievement = URBAN_GREEN_ACHIEVEMENTS.find(a => a.id === achievementId);
        if (achievement) console.log(`[UrbanGreen] Logro: ${achievement.name}`);
      },

      reset: () => set(createInitialUrbanGreenState()),

      saveToStorage: () => console.log('[UrbanGreen] Estado guardado'),

      loadFromStorage: () => console.log('[UrbanGreen] Estado cargado'),

      clearStorage: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(URBAN_GREEN_STORAGE_KEY);
          localStorage.removeItem(URBAN_GREEN_V1_STORAGE_KEY);
          localStorage.removeItem(URBAN_GREEN_MIGRATION_FLAG_KEY);
        }
        set(createInitialUrbanGreenState());
      },

      detectV1Data: () => {
        if (typeof window === 'undefined') return false;
        return !!localStorage.getItem(URBAN_GREEN_V1_STORAGE_KEY) && !localStorage.getItem(URBAN_GREEN_MIGRATION_FLAG_KEY);
      },

      migrateV1ToV2: async (userId: string) => {
        if (typeof window === 'undefined') return false;
        try {
          const v1Data = localStorage.getItem(URBAN_GREEN_V1_STORAGE_KEY);
          if (!v1Data) return false;
          const parsed = JSON.parse(v1Data);
          const v2State = createInitialUrbanGreenState();
          // Migrar campos compatibles
          Object.assign(v2State, parsed);
          set(v2State);
          localStorage.setItem(URBAN_GREEN_MIGRATION_FLAG_KEY, 'true');
          localStorage.removeItem(URBAN_GREEN_V1_STORAGE_KEY);
          return true;
        } catch { return false; }
      },

      dismissMigration: () => {
        if (typeof window !== 'undefined') localStorage.setItem(URBAN_GREEN_MIGRATION_FLAG_KEY, 'dismissed');
      },
    }),
    {
      name: URBAN_GREEN_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sbnProjects: state.sbnProjects,
        ecosystemServices: state.ecosystemServices,
        greenROI: state.greenROI,
        urbanMicroclimate: state.urbanMicroclimate,
        governanceCoordination: state.governanceCoordination,
        landValueCapture: state.landValueCapture,
        governanceInstruments: state.governanceInstruments,
        sharedStrategies: state.sharedStrategies,
        createdAt: state.createdAt,
        version: state.version,
      }),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) return { ...persistedState, version: 1 };
        return persistedState;
      },
    }
  )
);

// ============================================================================
// SELECTORES
// ============================================================================

export const useUrbanGreen = () => useUrbanGreenStore();

export const useSBNProjects = () => useUrbanGreenStore((s) => s.sbnProjects);
export const useEcosystemServices = () => useUrbanGreenStore((s) => s.ecosystemServices);
export const useGreenROI = () => useUrbanGreenStore((s) => s.greenROI);
export const useUrbanMicroclimate = () => useUrbanGreenStore((s) => s.urbanMicroclimate);
export const useGovernanceCoordination = () => useUrbanGreenStore((s) => s.governanceCoordination);
export const useLandValueCapture = () => useUrbanGreenStore((s) => s.landValueCapture);
export const useGovernanceInstruments = () => useUrbanGreenStore((s) => s.governanceInstruments);
export const useSharedStrategies = () => useUrbanGreenStore((s) => s.sharedStrategies);

export const useSBNProjectList = () => useUrbanGreenStore((s) => Object.values(s.sbnProjects));
export const useTotalSBNArea = () => useUrbanGreenStore((s) => Object.values(s.sbnProjects).reduce((sum, p) => sum + p.location.area_hectares, 0));
export const useTotalEcosystemValue = () => useUrbanGreenStore((s) => Object.values(s.ecosystemServices).reduce((sum, e) => sum + e.economicValue_usd_per_year, 0));
export const useTotalROI = () => useUrbanGreenStore((s) => {
  const rois = Object.values(s.greenROI);
  return rois.length > 0 ? rois.reduce((sum, r) => sum + r.netPresentValue_usd, 0) / rois.length : 0;
});
export const useAvgTempReduction = () => useUrbanGreenStore((s) => {
  const micros = Object.values(s.urbanMicroclimate);
  return micros.length > 0 ? micros.reduce((sum, m) => sum + m.temperatureReduction_celsius, 0) / micros.length : 0;
});
export const useCoordinationScore = () => useUrbanGreenStore((s) => {
  const coords = Object.values(s.governanceCoordination);
  return coords.length > 0 ? coords.reduce((sum, c) => sum + c.coordinationScore, 0) / coords.length : 0;
});
export const useTotalCapturedValue = () => useUrbanGreenStore((s) => Object.values(s.landValueCapture).reduce((sum, l) => sum + l.capturedValue_usd, 0));
export const useInstrumentCount = () => useUrbanGreenStore((s) => Object.keys(s.governanceInstruments).length);
export const useActiveStrategies = () => useUrbanGreenStore((s) => Object.values(s.sharedStrategies).filter(str => str.hasSharedStrategy).length);