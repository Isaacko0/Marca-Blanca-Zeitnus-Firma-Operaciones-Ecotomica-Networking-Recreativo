// offerDesigner.ts — Zustand hooks para OfferDesigner Offer Designer
// Selectores + Acciones tipadas

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { OfferDesignerState, OfferDesignerActions, OfferData, OfferMode, PriceParityOracle, LevelData, Toast, V1LocalStorageData, AchievementId } from './offerDesigner';
import { initialOfferDesignerState, HAPPYY_STORAGE_KEY, ACHIEVEMENTS } from './offerDesigner';
import {
  calculateTotalPower,
  validateLevel,
  getNextIncompleteLevel,
  canAdvanceTo,
  generateSalesLetter,
  migrateV1toV2,
  exportToJSON,
  importFromJSON,
  type PowerBreakdown
} from '../lib/offer-designer';
import { OFFER_LEVELS, validateLevelData, isLevelUnlocked, getLevelProgress } from '../lib/offer-designer-levels';
import { OfferDesignerEvaluator, type EvaluationContext } from '../lib/offer-designer-evaluator';

// ============================================================================
// STORE COMPLETO (State + Actions)
// ============================================================================

type OfferDesignerStore = OfferDesignerState & OfferDesignerActions;

const useOfferDesignerStore = create<OfferDesignerStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      ...initialOfferDesignerState,

      // ========================================================================
      // NAVEGACIÓN
      // ========================================================================

      setScreen: (screen: string) => set({ ui: { ...get().ui, currentScreen: screen } }),

      setLevel: (levelId: string) => {
        const state = get();
        if (canAdvanceTo(levelId, state.offer.levels)) {
          set({
            offer: { ...state.offer, currentLevel: levelId },
            ui: { ...state.ui, currentLevel: levelId }
          });
        }
      },

      nextLevel: () => {
        const state = get();
        const next = getNextIncompleteLevel(state.offer.levels);
        if (next) {
          get().setLevel(next);
        }
      },

      prevLevel: () => {
        const state = get();
        const currentIdx = OFFER_LEVELS.findIndex(l => l.id === state.offer.currentLevel);
        if (currentIdx > 0) {
          const prev = OFFER_LEVELS[currentIdx - 1].id;
          get().setLevel(prev);
        }
      },

      toggleSidebar: () => set(state => ({
        ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen }
      })),

      // ========================================================================
      // DATOS DE NIVEL
      // ========================================================================

      updateLevelField: (levelId: string, field: string, value: string) => {
        const state = get();
        const level = state.offer.levels[levelId];
        if (!level) return;

        const newFields = { ...level.fields, [field]: value };
        const validation = validateLevelData(levelId, newFields);

        const updatedLevel: LevelData = {
          ...level,
          fields: newFields,
          lastEdited: Date.now()
        };

        const newLevels = { ...state.offer.levels, [levelId]: updatedLevel };
        const newOffer: OfferData = {
          ...state.offer,
          levels: newLevels,
          updatedAt: Date.now()
        };

        set({ offer: newOffer });

        // Auto-evaluar completado si campos requeridos llenos
        if (validation.isValid && !level.completed) {
          // No auto-completar, dejar que usuario valide explícitamente
        }
      },

      updateLevelFields: (levelId: string, fields: Record<string, string>) => {
        const state = get();
        const level = state.offer.levels[levelId];
        if (!level) return;

        const newFields = { ...level.fields, ...fields };
        const validation = validateLevelData(levelId, newFields);

        const updatedLevel: LevelData = {
          ...level,
          fields: newFields,
          lastEdited: Date.now()
        };

        const newLevels = { ...state.offer.levels, [levelId]: updatedLevel };
        const newOffer: OfferData = {
          ...state.offer,
          levels: newLevels,
          updatedAt: Date.now()
        };

        set({ offer: newOffer });
      },

      validateAndCompleteLevel: (levelId: string) => {
        const state = get();
        const level = state.offer.levels[levelId];
        if (!level) return false;

        const validation = validateLevelData(levelId, level.fields);
        if (!validation.isValid) {
          get().addToast({
            type: 'error',
            title: 'Nivel incompleto',
            message: `Faltan campos: ${validation.errors.join(', ')}`,
            duration: 5000
          });
          return false;
        }

        // Calcular power contribution
        const config = OFFER_LEVELS.find(l => l.id === levelId)!;
        const breakdown = calculateTotalPower(state.offer.levels, state.offer.mode);
        const powerContribution = breakdown.byLevel[levelId]?.total || 0;
        const qualityScore = breakdown.byLevel[levelId]?.heuristics || 0;

        const completedLevel: LevelData = {
          ...level,
          completed: true,
          powerContribution,
          qualityScore
        };

        const newLevels = { ...state.offer.levels, [levelId]: completedLevel };
        const completedLevels = [...new Set([...state.offer.completedLevels, levelId])];
        const nextLevel = getNextIncompleteLevel(newLevels);

        const newOffer: OfferData = {
          ...state.offer,
          levels: newLevels,
          completedLevels,
          currentLevel: nextLevel || levelId,
          updatedAt: Date.now()
        };

        set({ offer: newOffer });

        // Recalcular power total
        get().recalculatePower();

        // Logros
        if (completedLevels.length === 1) get().unlockAchievement('first_level');
        if (completedLevels.length === 4) get().unlockAchievement('half_way');
        if (completedLevels.length === 8) get().unlockAchievement('all_levels');

        // Auto-avanzar al siguiente
        if (nextLevel) {
          get().setLevel(nextLevel);
        }

        get().addToast({
          type: 'success',
          title: '¡Nivel completado!',
          message: `${config.title.es} marcado como completado (${powerContribution}% poder)`,
          duration: 3000
        });

        return true;
      },

      resetLevel: (levelId: string) => {
        const state = get();
        const level = state.offer.levels[levelId];
        if (!level) return;

        const resetLevel: LevelData = {
          ...level,
          fields: {},
          completed: false,
          powerContribution: 0,
          qualityScore: 0,
          lastEdited: Date.now()
        };

        const newLevels = { ...state.offer.levels, [levelId]: resetLevel };
        const completedLevels = state.offer.completedLevels.filter(l => l !== levelId);

        const newOffer: OfferData = {
          ...state.offer,
          levels: newLevels,
          completedLevels,
          updatedAt: Date.now()
        };

        set({ offer: newOffer });
        get().recalculatePower();

        get().addToast({
          type: 'info',
          title: 'Nivel reiniciado',
          message: `${OFFER_LEVELS.find(l => l.id === levelId)?.title.es || levelId} vuelto a borrador`,
          duration: 2000
        });
      },

      // ========================================================================
      // POWER & EVALUACIÓN
      // ========================================================================

      recalculatePower: () => {
        const state = get();
        const breakdown = calculateTotalPower(state.offer.levels, state.offer.mode);

        const newOffer: OfferData = {
          ...state.offer,
          power: breakdown.total,
          updatedAt: Date.now()
        };

        set({ offer: newOffer });

        // Logros de power
        if (breakdown.total >= 50 && !state.offer.achievements.includes('power_50')) {
          get().unlockAchievement('power_50');
        }
        if (breakdown.total >= 85 && !state.offer.achievements.includes('power_85')) {
          get().unlockAchievement('power_85');
        }
        if (breakdown.total >= 100 && !state.offer.achievements.includes('power_100')) {
          get().unlockAchievement('power_100');
        }
      },

      runEvaluation: async () => {
        const state = get();

        set({ evaluationLoading: true, evaluationError: null });

        try {
          const salesLetter = generateSalesLetter(state.offer.levels, state.offer.mode, state.offer.priceParity || undefined);

          const evaluator = new OfferDesignerEvaluator({
            mode: state.config.evaluatorMode,
            apiKey: state.config.evaluatorApiKey || undefined
          });

          const context: EvaluationContext = {
            offer: state.offer,
            salesLetter,
            mode: state.offer.mode,
            priceParity: state.offer.priceParity || undefined
          };

          const result = await evaluator.evaluate(context);

          set({
            evaluation: result,
            evaluationLoading: false
          });

          // Logro primera evaluación
          if (!state.offer.achievements.includes('first_evaluation')) {
            get().unlockAchievement('first_evaluation');
          }

          // Logro calificación A
          if (result.overall >= 90 && !state.offer.achievements.includes('evaluation_a')) {
            get().unlockAchievement('evaluation_a');
          }

          get().addToast({
            type: 'success',
            title: 'Evaluación completada',
            message: `Score global: ${result.overall}/100 (${result.scores.clarity}/${result.scores.desire}/${result.scores.proof}/${result.scores.urgency})`,
            duration: 5000
          });

        } catch (error) {
          const msg = error instanceof Error ? error.message : 'Error desconocido';
          set({ evaluationLoading: false, evaluationError: msg });
          get().addToast({
            type: 'error',
            title: 'Error en evaluación',
            message: msg,
            duration: 5000
          });
        }
      },

      clearEvaluation: () => set({ evaluation: null, evaluationError: null }),

      // ========================================================================
      // EXPORT/IMPORT
      // ========================================================================

      exportOffer: (format: 'json' | 'text' | 'markdown' = 'markdown') => {
        const state = get();
        const salesLetter = generateSalesLetter(state.offer.levels, state.offer.mode, state.offer.priceParity || undefined);

        if (format === 'json') {
          return exportToJSON(state.offer);
        }
        if (format === 'text') {
          return salesLetter;
        }
        // markdown con metadata
        return `# Oferta OfferDesigner — ${new Date().toLocaleDateString()}

**Power:** ${state.offer.power}% | **Modo:** ${state.offer.mode} | **Niveles:** ${state.offer.completedLevels.length}/8

---

${salesLetter}

---

*Generado por OfferDesigner Offer Designer (HSCSG v15 OS)*`;
      },

      importOffer: (json: string) => {
        const imported = importFromJSON(json);
        if (!imported) {
          get().addToast({
            type: 'error',
            title: 'Importación fallida',
            message: 'JSON inválido o estructura incompatible',
            duration: 5000
          });
          return false;
        }

        set({ offer: imported });
        get().recalculatePower();
        get().addToast({
          type: 'success',
          title: 'Oferta importada',
          message: `Power: ${imported.power}% | Niveles: ${imported.completedLevels.length}/8`,
          duration: 3000
        });
        return true;
      },

      copySalesLetter: () => {
        const state = get();
        const letter = generateSalesLetter(state.offer.levels, state.offer.mode, state.offer.priceParity || undefined);
        navigator.clipboard.writeText(letter);
        get().addToast({
          type: 'success',
          title: '¡Copiado al portapapeles!',
          message: 'Carta de venta lista para pegar en tu IA',
          duration: 3000
        });

        if (!state.offer.achievements.includes('first_export')) {
          get().unlockAchievement('first_export');
        }
      },

      // ========================================================================
      // MIGRACIÓN V1→V2
      // ========================================================================

      detectV1Data: () => {
        try {
          const v1Raw = localStorage.getItem('offerDesigner_offer_v1');
          if (!v1Raw) return null;

          const v1Data = JSON.parse(v1Raw) as V1LocalStorageData;
          if (v1Data.version !== 1) return null;

          // Verificar flag de migración ya hecha
          const migrated = localStorage.getItem('hscsg_offerDesigner_migrated_v1');
          if (migrated === 'true') return null;

          set({ migration: { ...get().migration, v1Data, status: 'detected' } });
          get().openMigrationModal();

          return v1Data;
        } catch {
          return null;
        }
      },

      migrateV1ToV2: async (userId: string) => {
        const state = get();
        if (!state.migration.v1Data) return false;

        set({ migration: { ...state.migration, status: 'migrating' } });

        try {
          const migrated = migrateV1toV2(state.migration.v1Data, userId, state.offer.mode);
          set({
            offer: migrated,
            migration: { v1Data: null, status: 'completed', error: null }
          });
          get().recalculatePower();
          get().closeMigrationModal();

          // Flag para no volver a detectar
          localStorage.setItem('hscsg_offerDesigner_migrated_v1', 'true');

          get().unlockAchievement('migrated_v1');
          get().addToast({
            type: 'success',
            title: '¡Migración completada!',
            message: `Tu oferta v1 ahora está en HSCSG v2 con ${migrated.power}% poder`,
            duration: 5000
          });

          return true;
        } catch (error) {
          const msg = error instanceof Error ? error.message : 'Error en migración';
          set({ migration: { ...state.migration, status: 'error', error: msg } });
          get().addToast({
            type: 'error',
            title: 'Migración fallida',
            message: msg,
            duration: 5000
          });
          return false;
        }
      },

      dismissMigration: () => {
        localStorage.setItem('hscsg_offerDesigner_migrated_v1', 'true');
        set({ migration: { v1Data: null, status: 'idle', error: null } });
        get().closeMigrationModal();
      },

      // ========================================================================
      // CONFIGURACIÓN
      // ========================================================================

      setMode: (mode: OfferMode) => {
        const state = get();
        const newOffer: OfferData = {
          ...state.offer,
          mode,
          updatedAt: Date.now()
        };
        set({
          offer: newOffer,
          config: { ...state.config, mode }
        });
        get().recalculatePower();

        if (mode === 'conectado' && !state.offer.achievements.includes('mode_connected')) {
          get().unlockAchievement('mode_connected');
        }
      },

      setPriceParity: (parity: PriceParityOracle) => set(state => ({
        offer: { ...state.offer, priceParity: parity, updatedAt: Date.now() },
        config: { ...state.config, priceParity: parity }
      })),

      setLanguage: (lang: 'es' | 'en' | 'pt') => set(state => ({
        offer: { ...state.offer, metadata: { ...state.offer.metadata, language: lang } },
        config: { ...state.config, language: lang }
      })),

      setEvaluatorMode: (mode: 'mock' | 'claude' | 'openai' | 'local-llm', apiKey?: string) => set(state => ({
        config: { ...state.config, evaluatorMode: mode, evaluatorApiKey: apiKey || null }
      })),

      // ========================================================================
      // UI MODALS
      // ========================================================================

      openExportModal: () => set(state => ({
        ui: { ...state.ui, showExportModal: true, activeModal: 'export' }
      })),

      closeExportModal: () => set(state => ({
        ui: { ...state.ui, showExportModal: false, activeModal: null }
      })),

      openEvaluatorModal: () => set(state => ({
        ui: { ...state.ui, showEvaluatorModal: true, activeModal: 'evaluator' }
      })),

      closeEvaluatorModal: () => set(state => ({
        ui: { ...state.ui, showEvaluatorModal: false, activeModal: null }
      })),

      openMigrationModal: () => set(state => ({
        ui: { ...state.ui, showMigrationModal: true, activeModal: 'migration' }
      })),

      closeMigrationModal: () => set(state => ({
        ui: { ...state.ui, showMigrationModal: false, activeModal: null }
      })),

      // ========================================================================
      // TOASTS
      // ========================================================================

      addToast: (toast: Omit<Toast, 'id'>) => {
        const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        const newToast: Toast = { ...toast, id };
        set(state => ({
          ui: { ...state.ui, toasts: [...state.ui.toasts, newToast] }
        }));

        // Auto-remove
        const duration = toast.duration ?? 4000;
        setTimeout(() => get().removeToast(id), duration);
      },

      removeToast: (id: string) => set(state => ({
        ui: { ...state.ui, toasts: state.ui.toasts.filter(t => t.id !== id) }
      })),

      clearToasts: () => set(state => ({
        ui: { ...state.ui, toasts: [] }
      })),

      // ========================================================================
      // LOGROS
      // ========================================================================

      unlockAchievement: (id: string) => {
        const state = get();
        if (state.offer.achievements.includes(id)) return;

        const achievement = ACHIEVEMENTS[id as AchievementId];
        if (!achievement) return;

        const newOffer: OfferData = {
          ...state.offer,
          achievements: [...state.offer.achievements, id]
        };

        set({ offer: newOffer });

        get().addToast({
          type: 'achievement',
          title: `🏆 ${achievement.title}`,
          message: achievement.desc,
          duration: 6000
        });
      },

      // ========================================================================
      // PERSISTENCIA
      // ========================================================================

      saveToStorage: () => {
        const state = get();
        try {
          localStorage.setItem(HAPPYY_STORAGE_KEY, JSON.stringify(state.offer));
          get().addToast({
            type: 'info',
            title: 'Guardado',
            message: 'Oferta guardada en localStorage',
            duration: 2000
          });
        } catch {
          get().addToast({
            type: 'error',
            title: 'Error guardando',
            message: 'No se pudo guardar en localStorage',
            duration: 3000
          });
        }
      },

      loadFromStorage: () => {
        try {
          const raw = localStorage.getItem(HAPPYY_STORAGE_KEY);
          if (raw) {
            const offer = JSON.parse(raw) as OfferData;
            set({ offer });
            get().recalculatePower();
          }
        } catch {
          // Silencioso: usar estado inicial
        }
      },

      clearStorage: () => {
        localStorage.removeItem(HAPPYY_STORAGE_KEY);
        set({ offer: createInitialOffer() });
        get().addToast({
          type: 'info',
          title: 'Storage limpiado',
          message: 'Oferta reiniciada a estado inicial',
          duration: 3000
        });
      }
    }),
    {
      name: HAPPYY_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        offer: state.offer,
        config: state.config
      }),
      version: 2,
      migrate: (persisted: any, version: number) => {
        if (version === 1) {
          // Migración automática v1→v2 en storage
          return {
            offer: { ...persisted.offer, version: 2 },
            config: { ...persisted.config, mode: 'postmonetario' }
          };
        }
        return persisted;
      }
    }
  )
);

// ============================================================================
// HOOKS ESPECÍFICOS (Selectores memoizados)
// ============================================================================

export const useOfferDesigner = () => useOfferDesignerStore(state => state.offer);
export const useOfferDesignerUI = () => useOfferDesignerStore(state => state.ui);
export const useOfferDesignerConfig = () => useOfferDesignerStore(state => state.config);
export const useOfferDesignerEvaluation = () => useOfferDesignerStore(state => ({
  evaluation: state.evaluation,
  loading: state.evaluationLoading,
  error: state.evaluationError
}));
export const useOfferDesignerMigration = () => useOfferDesignerStore(state => state.migration);
export const useOfferDesignerToasts = () => useOfferDesignerStore(state => state.ui.toasts);
export const useOfferDesignerActions = () => useOfferDesignerStore(state => ({
  // Navegación
  setScreen: state.setScreen,
  setLevel: state.setLevel,
  nextLevel: state.nextLevel,
  prevLevel: state.prevLevel,
  toggleSidebar: state.toggleSidebar,
  // Datos
  updateLevelField: state.updateLevelField,
  updateLevelFields: state.updateLevelFields,
  validateAndCompleteLevel: state.validateAndCompleteLevel,
  resetLevel: state.resetLevel,
  // Power
  recalculatePower: state.recalculatePower,
  runEvaluation: state.runEvaluation,
  clearEvaluation: state.clearEvaluation,
  // Export
  exportOffer: state.exportOffer,
  importOffer: state.importOffer,
  copySalesLetter: state.copySalesLetter,
  // Migración
  detectV1Data: state.detectV1Data,
  migrateV1ToV2: state.migrateV1ToV2,
  dismissMigration: state.dismissMigration,
  // Config
  setMode: state.setMode,
  setPriceParity: state.setPriceParity,
  setLanguage: state.setLanguage,
  setEvaluatorMode: state.setEvaluatorMode,
  // Modals
  openExportModal: state.openExportModal,
  closeExportModal: state.closeExportModal,
  openEvaluatorModal: state.openEvaluatorModal,
  closeEvaluatorModal: state.closeEvaluatorModal,
  openMigrationModal: state.openMigrationModal,
  closeMigrationModal: state.closeMigrationModal,
  // Toasts
  addToast: state.addToast,
  removeToast: state.removeToast,
  clearToasts: state.clearToasts,
  // Logros
  unlockAchievement: state.unlockAchievement,
  // Storage
  saveToStorage: state.saveToStorage,
  loadFromStorage: state.loadFromStorage,
  clearStorage: state.clearStorage
}));

// Selectores computados
export const useCurrentLevel = () => useOfferDesignerStore(state => state.offer.levels[state.offer.currentLevel]);
export const usePowerBreakdown = () => useOfferDesignerStore(state => calculateTotalPower(state.offer.levels, state.offer.mode));
export const useCompletedLevels = () => useOfferDesignerStore(state => state.offer.completedLevels);
export const useNextLevel = () => useOfferDesignerStore(state => getNextIncompleteLevel(state.offer.levels));
export const useProgress = () => useOfferDesignerStore(state => ({
  completed: state.offer.completedLevels.length,
  total: 8,
  percentage: Math.round((state.offer.completedLevels.length / 8) * 100)
}));
export const useUnlockedLevels = () => useOfferDesignerStore(state =>
  OFFER_LEVELS.filter(l => isLevelUnlocked(l.id, state.offer.levels)).map(l => l.id)
);
export const useSalesLetter = () => useOfferDesignerStore(state =>
  generateSalesLetter(state.offer.levels, state.offer.mode, state.offer.priceParity || undefined)
);
export const useCurrentEvaluation = () => useOfferDesignerStore(state => state.evaluation);