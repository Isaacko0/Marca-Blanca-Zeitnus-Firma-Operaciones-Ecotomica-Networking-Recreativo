// offerDesigner.ts — Tipos de estado para OfferDesigner Offer Designer (Zustand + Persist)
// Principio Anfibio: tipos agnósticos a unidad monetaria (ZNU/USD via priceParity)

import type {
  OfferData,
  OfferMode,
  OfferLevelConfig,
  LevelData,
  ExportRecord,
  PriceParityOracle,
  PowerBreakdown,
  EvaluationResult
} from '../lib/offer-designer';
import { OFFER_LEVELS } from '../lib/offer-designer-levels';

// ============================================================================
// ESTADO PRINCIPAL DEL SLICE
// ============================================================================

export interface OfferDesignerState {
  // Datos de la oferta
  offer: OfferData;

  // UI state
  ui: {
    currentScreen: string;           // 'onboarding' | 'base' | 'soulmate' | ... | 'carta' | 'evaluator'
    currentLevel: string;            // nivel activo en stepper
    sidebarOpen: boolean;
    showPowerBreakdown: boolean;
    showExportModal: boolean;
    showEvaluatorModal: boolean;
    showMigrationModal: boolean;
    toasts: Toast[];
    activeModal: string | null;
  };

  // Configuración
  config: {
    mode: OfferMode;
    priceParity: PriceParityOracle | null;
    language: 'es' | 'en' | 'pt';
    autoSave: boolean;
    autoSaveInterval: number;        // ms
    evaluatorMode: 'mock' | 'claude' | 'openai' | 'local-llm';
    evaluatorApiKey: string | null;
  };

  // Evaluación
  evaluation: EvaluationResult | null;
  evaluationLoading: boolean;
  evaluationError: string | null;

  // Migración v1→v2
  migration: {
    v1Data: V1LocalStorageData | null;
    status: 'idle' | 'detected' | 'migrating' | 'completed' | 'error';
    error: string | null;
  };
}

// ============================================================================
// TIPOS AUXILIARES
// ============================================================================

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'achievement';
  title: string;
  message: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

export interface V1LocalStorageData {
  version: 1;
  power: number;
  screens: Record<string, { fields: Record<string, string> }>;
  timestamps: Record<string, number>;
  exportHistory: Array<{ timestamp: number; power: number; text: string }>;
}

// ============================================================================
// FACTORY DE ESTADO INICIAL
// ============================================================================

export function createInitialOffer(mode: OfferMode = 'postmonetario', language: 'es' | 'en' | 'pt' = 'es'): OfferData {
  const now = Date.now();
  const levels: Record<string, LevelData> = {};

  for (const config of OFFER_LEVELS) {
    levels[config.id] = {
      fields: {},
      completed: false,
      powerContribution: 0,
      qualityScore: 0,
      lastEdited: 0
    };
  }

  return {
    version: 2,
    mode,
    power: 0,
    currentLevel: 'base',
    completedLevels: [],
    levels,
    timestamps: {},
    exportHistory: [],
    achievements: [],
    metadata: {
      createdAt: now,
      updatedAt: now,
      source: 'hscsg-native',
      language
    }
  };
}

export const initialOfferDesignerState: OfferDesignerState = {
  offer: createInitialOffer(),

  ui: {
    currentScreen: 'onboarding',
    currentLevel: 'base',
    sidebarOpen: true,
    showPowerBreakdown: false,
    showExportModal: false,
    showEvaluatorModal: false,
    showMigrationModal: false,
    toasts: [],
    activeModal: null
  },

  config: {
    mode: 'postmonetario',
    priceParity: null,
    language: 'es',
    autoSave: true,
    autoSaveInterval: 5000,
    evaluatorMode: 'mock',
    evaluatorApiKey: null
  },

  evaluation: null,
  evaluationLoading: false,
  evaluationError: null,

  migration: {
    v1Data: null,
    status: 'idle',
    error: null
  }
};

// ============================================================================
// SELECTORES COMPUTADOS (para hooks)
// ============================================================================

export const offerDesignerSelectors = {
  // Oferta actual
  currentOffer: (state: OfferDesignerState) => state.offer,

  // Nivel actual
  currentLevel: (state: OfferDesignerState) => state.offer.levels[state.offer.currentLevel],

  // Power breakdown computado
  powerBreakdown: (state: OfferDesignerState) => {
    const { calculateTotalPower } = require('../lib/offer-designer');
    return calculateTotalPower(state.offer.levels, state.offer.mode);
  },

  // Niveles completados
  completedLevels: (state: OfferDesignerState) => state.offer.completedLevels,

  // Próximo nivel incompleto
  nextIncompleteLevel: (state: OfferDesignerState) => {
    const { getNextIncompleteLevel } = require('../lib/offer-designer');
    return getNextIncompleteLevel(state.offer.levels);
  },

  // Progreso general
  progress: (state: OfferDesignerState) => {
    const total = OFFER_LEVELS.length;
    const completed = state.offer.completedLevels.length;
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  },

  // Niveles desbloqueados
  unlockedLevels: (state: OfferDesignerState) => {
    const { isLevelUnlocked } = require('../lib/offer-designer');
    return OFFER_LEVELS.filter(l => isLevelUnlocked(l.id, state.offer.levels)).map(l => l.id);
  },

  // Carta de venta generada
  salesLetter: (state: OfferDesignerState) => {
    const { generateSalesLetter } = require('../lib/offer-designer');
    return generateSalesLetter(state.offer.levels, state.offer.mode, state.offer.priceParity || undefined);
  },

  // Evaluación actual
  currentEvaluation: (state: OfferDesignerState) => state.evaluation,

  // Toast más reciente
  latestToast: (state: OfferDesignerState) => state.ui.toasts[state.ui.toasts.length - 1],

  // Configuración evaluador
  evaluatorConfig: (state: OfferDesignerState) => ({
    mode: state.config.evaluatorMode,
    apiKey: state.config.evaluatorApiKey,
    model: state.config.evaluatorMode === 'claude' ? 'claude-3-5-sonnet-20241022' :
           state.config.evaluatorMode === 'openai' ? 'gpt-4o' : 'llama3'
  })
};

// ============================================================================
// ACCIONES TIPADAS (para hooks)
// ============================================================================

export type OfferDesignerActions = {
  // Navegación
  setScreen: (screen: string) => void;
  setLevel: (levelId: string) => void;
  nextLevel: () => void;
  prevLevel: () => void;
  toggleSidebar: () => void;

  // Datos de nivel
  updateLevelField: (levelId: string, field: string, value: string) => void;
  updateLevelFields: (levelId: string, fields: Record<string, string>) => void;
  validateAndCompleteLevel: (levelId: string) => boolean;
  resetLevel: (levelId: string) => void;

  // Power & Evaluación
  recalculatePower: () => void;
  runEvaluation: () => Promise<void>;
  clearEvaluation: () => void;

  // Export/Import
  exportOffer: (format?: 'json' | 'text' | 'markdown') => string;
  importOffer: (json: string) => boolean;
  copySalesLetter: () => void;

  // Migración v1→v2
  detectV1Data: () => V1LocalStorageData | null;
  migrateV1ToV2: (userId: string) => Promise<boolean>;
  dismissMigration: () => void;

  // Configuración
  setMode: (mode: OfferMode) => void;
  setPriceParity: (parity: PriceParityOracle) => void;
  setLanguage: (lang: 'es' | 'en' | 'pt') => void;
  setEvaluatorMode: (mode: 'mock' | 'claude' | 'openai' | 'local-llm', apiKey?: string) => void;

  // UI Modals
  openExportModal: () => void;
  closeExportModal: () => void;
  openEvaluatorModal: () => void;
  closeEvaluatorModal: () => void;
  openMigrationModal: () => void;
  closeMigrationModal: () => void;

  // Toasts
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Logros
  unlockAchievement: (id: string) => void;

  // Persistencia
  saveToStorage: () => void;
  loadFromStorage: () => void;
  clearStorage: () => void;
};

// ============================================================================
// CONSTANTES DE STORAGE
// ============================================================================

export const HAPPYY_STORAGE_KEY = 'hscsg_offerDesigner_offer_v2';
export const HAPPYY_V1_STORAGE_KEY = 'offerDesigner_offer_v1';
export const HAPPYY_MIGRATION_FLAG_KEY = 'hscsg_offerDesigner_migrated_v1';

export const ACHIEVEMENTS = {
  first_level: { id: 'first_level', title: 'Primer Paso', desc: 'Completaste tu primer nivel' },
  half_way: { id: 'half_way', title: 'A Mitad de Camino', desc: '4 de 8 niveles completados' },
  all_levels: { id: 'all_levels', title: 'Arquitecto de Ofertas', desc: 'Todos los 8 niveles completados' },
  power_50: { id: 'power_50', title: 'Potencia Media', desc: 'Alcanzaste 50% de poder' },
  power_85: { id: 'power_85', title: 'Oferta Sólida', desc: 'Alcanzaste 85% de poder' },
  power_100: { id: 'power_100', title: 'Lista para Lanzar', desc: '100% poder — oferta ready' },
  first_export: { id: 'first_export', title: 'Primera Exportación', desc: 'Copiaste tu carta de venta' },
  first_evaluation: { id: 'first_evaluation', title: 'Evaluada por IA', desc: 'Pasaste por el evaluador' },
  evaluation_a: { id: 'evaluation_a', title: 'Calificación A', desc: 'Score 90+ en evaluación' },
  migrated_v1: { id: 'migrated_v1', title: 'Migrante V1', desc: 'Migraste tu oferta v1 a v2' },
  mode_connected: { id: 'mode_connected', title: 'Modo Conectado', desc: 'Activaste modo USD/USDC con priceParity' }
} as const;

export type AchievementId = keyof typeof ACHIEVEMENTS;