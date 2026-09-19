// E→V Library - Pure logic functions for E→V pattern
// E→V describes the passage of energy to efficiency through experience
// Life → Truth → Virtue (anfibio: postmonetario ZNU/CaaS o conectado USD/USDC)

import type {
  EVState,
  Energy,
  Experience,
  Efficiency,
  Truth,
  Virtue,
  Learning,
  Presence,
  BodySignal,
  Attention,
  Friction,
  Coherence,
  DataRoot,
  Margin,
  Trajectory,
  Restriction,
  Threshold,
  Gap,
  RelationalGap,
  Interference,
  ErrorType,
  EvasionType,
  Integration,
  TruthOwn,
  TruthOntological,
  Sovereignty,
  NaturalLaw,
  PositiveLaw,
  CouplingInternal,
  CouplingExternal,
  CompatibilityExistential,
  LegitimateSeparation,
  ZeroOrigin,
  Huella,
  Rastro,
  MapaVivo,
  Convergence,
  EVRecord,
  EVRecordForm,
  MakeEVState,
  EnergyToEfficiency,
  LifeToVirtue,
  DetectFriction,
  DetectCoherence,
  CalculateMargin,
  UpdateDataRoot,
  IntegrateExperience,
  RecognizeError,
  DistinguishErrorFromEvasion,
  CalculateAutonomyCost,
  CalculateCDS,
  VerifyPresence,
  RegisterHuella,
  GenerateRastro,
  UpdateMapaVivo,
  ConvergeMaps,
  VerifyCompatibility,
  LegitimateSeparation as LegitimateSeparationFn,
  ZeroOrigin,
} from '@core/state/ev';

// ============================================================================
// CORE HELPERS - Pure functions, no side effects
// ============================================================================

// Helper: Generate unique IDs
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Helper: Deep clone for immutable updates
const clone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

// ============================================================================
// STATE FACTORY
// ============================================================================

export const makeEVState: MakeEVState = (): EVState => ({
  // Core cycle
  energy: [],
  experience: [],
  efficiency: [],
  
  // Dual triad
  life: [],
  truth: [],
  virtue: [],
  
  // Presence & signals
  presence: [],
  bodySignals: [],
  attention: [],
  
  // Cycle signals
  friction: [],
  coherence: [],
  
  // Margin & restrictions
  dataRoot: [],
  margin: [],
  
  // Interference & errors
  interference: [],
  errors: [],
  evasions: [],
  
  // Integration & learning
  integration: [],
  learning: [],
  
  // Truth & sovereignty
  truthOwn: [],
  truthOntological: [],
  sovereignty: [],
  
  // Laws
  naturalLaw: [],
  positiveLaw: [],
  
  // Coupling
  couplingInternal: [],
  couplingExternal: [],
  
  // Compatibility
  compatibility: [],
  separation: [],
  
  // Origin
  zeroOrigin: [],
  
  // Records
  huella: [],
  rastro: [],
  mapaVivo: [],
  convergence: [],
  records: [],
  
  // Metadata
  lastUpdated: Date.now(),
});

// ============================================================================
// CORE CYCLE FUNCTIONS
// ============================================================================

/**
 * Energy → Efficiency through Experience
 * E→V: La energía, a través de la experiencia, se convierte en eficiencia
 */
export const energyToEfficiency: EnergyToEfficiency = (energy: Energy, experience: Experience): Efficiency => {
  const isCoherent = experience.integrated && experience.truth.verified;
  
  return {
    amount: isCoherent ? energy.amount * 0.9 : energy.amount * 0.3, // Eficiencia real vs fricción
    source: isCoherent ? 'coherence' : 'virtue',
    timestamp: Date.now(),
    direction: experience.truth.content,
    waste: isCoherent ? energy.amount * 0.1 : energy.amount * 0.7,
  };
};

/**
 * Life → Virtue through Truth
 * V→V: La vida, a través de la verdad, se convierte en virtud
 */
export const lifeToVirtue: LifeToVirtue = (life: Energy, truth: Truth): Virtue => {
  const isOwnTruth = truth.source === 'own' && truth.verified;
  
  return {
    excellence: isOwnTruth ? 0.9 : 0.3,
    functional: true,
    integratedLearning: {
      content: truth.content,
      modifiesCapacity: truth.verified && truth.source === 'own',
      timestamp: Date.now(),
    },
  };
};

/**
 * Detect fricciones en el estado
 * La fricción es la señal del gasto en dirección divergente
 */
export const detectFriction: DetectFriction = (state: EVState): Friction[] => {
  const frictions: Friction[] = [];
  
  // Detectar evasiones activas → fricción
  state.evasions.forEach(evasion => {
    if (evasion.sustained) {
      frictions.push({
        present: true,
        source: 'evasion',
        intensity: 0.7,
        location: 'body',
        deferred: false,
        timestamp: Date.now(),
      });
    }
  });
  
  // Detectar interferencias no corregidas → fricción
  state.interference.forEach(interference => {
    if (!interference.corrected) {
      frictions.push({
        present: true,
        source: interference.type === 'extraction' ? 'extraction' : 
                interference.type === 'betrayal' ? 'extraction' : 'extraction',
        intensity: 0.8,
        location: 'body',
        deferred: false,
        timestamp: Date.now(),
      });
    }
  });
  
  // Detectar errores no reconocidos → fricción potencial
  state.errors.forEach(error => {
    if (!error.recognized && error.persistence > 30 * 24 * 60 * 60 * 1000) { // >30 días
      frictions.push({
        present: true,
        source: 'evasion', // Error no reconocido = evasión
        intensity: 0.5,
        location: 'body',
        deferred: true,
        timestamp: Date.now(),
      });
    }
  });
  
  // Detectar narrativa no sostenida (dato raíz vs acción)
  state.dataRoot.forEach(root => {
    const alignedAction = state.experience.some(exp => 
      exp.direction === root.content && exp.integrated
    );
    if (!alignedAction && root.verified) {
      frictions.push({
        present: true,
        source: 'narrative',
        intensity: 0.6,
        location: 'body',
        deferred: false,
        timestamp: Date.now(),
      });
    }
  });
  
  return frictions;
};

/**
 * Detectar coherencia en el estado
 * Cuando el pasaje se completa, hay coherencia
 */
export const detectCoherence: DetectCoherence = (state: EVState): Coherence[] => {
  const coherences: Coherence[] = [];
  
  state.experience.forEach(exp => {
    if (exp.integrated && exp.truth.verified) {
      coherences.push({
        present: true,
        efficiency: {
          amount: exp.energy.amount * 0.9,
          source: 'coherence',
          timestamp: Date.now(),
          direction: exp.truth.content,
          waste: exp.energy.amount * 0.1,
        },
      });
    }
  });
  
  return coherences;
};

/**
 * Calcular margen real
 * Margen = espacio real de trayectorias disponibles
 */
export const calculateMargin: CalculateMargin = (
  dataRoot: DataRoot,
  presence: Presence,
  attention: Attention,
  evasions: EvasionType[],
  interferences: Interference[]
): Margin => {
  const trajectories: Trajectory[] = [
    { id: 't1', direction: 'expand_awareness', available: presence.active, cost: 10 },
    { id: 't2', direction: 'deepen_truth', available: presence.active && attention.state !== 'captured', cost: 20 },
    { id: 't3', direction: 'act_from_coherence', available: presence.active && attention.state === 'directed', cost: 15 },
  ];
  
  const restrictions: Restriction[] = [];
  if (!presence.active) {
    restrictions.push({ domain: 'attention', description: 'Presencia no activa', concrete: true });
  }
  if (attention.state === 'captured') {
    restrictions.push({ domain: 'attention', description: 'Atención capturada por narrativa externa', concrete: true });
  }
  
  const evasionsActive = evasions.filter(e => e.sustained).length;
  if (evasionsActive > 0) {
    restrictions.push({ domain: 'attention', description: `${evasionsActive} evasión(es) activa(s) reduciendo margen`, concrete: true });
  }
  
  interferences.forEach(intf => {
    if (!intf.corrected) {
      restrictions.push({ 
        domain: 'energy', 
        description: `Interferencia ${intf.type} no corregida: ${intf.energyDiverted} energía desviada`, 
        concrete: true 
      });
    }
  });
  
  const thresholds: Threshold[] = [];
  if (!dataRoot.verified) {
    thresholds.push({ description: 'Dato raíz no verificado', infoMissing: 'Verificación del dato raíz' });
  }
  
  const gaps: Gap[] = [];
  const hasExperience = state => state.experience.length > 0;
  const hasCapacity = state => state.efficiency.length > 0;
  if (hasExperience({ experience: [] }) && !hasCapacity({ efficiency: [] })) {
    gaps.push({ 
      type: 'capacity_behind', 
      description: 'Conciencia de dirección sin capacidad para actuar', 
      painful: true 
    });
  }
  
  const relationalGaps: RelationalGap[] = [];
  // Simplificado: en implementación real, verificar red compatible
  
  return {
    trajectories,
    restrictions,
    thresholds,
    gaps,
    relationalGaps,
    timestamp: Date.now(),
  };
};

/**
 * Actualizar dato raíz desde la experiencia
 * La experiencia de las consecuencias actualiza el dato raíz
 */
export const updateDataRoot: UpdateDataRoot = (experience: Experience): DataRoot => {
  return {
    content: experience.truth.content,
    verified: experience.truth.verified,
    timestamp: Date.now(),
  };
};

/**
 * Integrar experiencia → aprendizaje
 * La integración es el puente entre experiencia y capacidad
 */
export const integrateExperience: IntegrateExperience = (experience: Experience): Integration => {
  const learning: Learning = {
    content: `Integrated: ${experience.truth.content}`,
    modifiesCapacity: experience.integrated,
    timestamp: Date.now(),
  };
  
  return {
    experience,
    learning,
    capacityModified: experience.integrated,
    timestamp: Date.now(),
  };
};

/**
 * Reconocer error
 * El error se admite, se corrige, se cierra. El error es dato.
 */
export const recognizeError: RecognizeError = (
  action: string,
  reality: string,
  recognition: boolean
): ErrorType => {
  return {
    recognized: recognition,
    solutionAvailable: false,
    persistence: 0,
    friction: recognition ? null : {
      present: true,
      source: 'evasion',
      intensity: 0.5,
      location: 'body',
      deferred: false,
      timestamp: Date.now(),
    },
    timestamp: Date.now(),
  };
};

/**
 * Distinguir error de evasión
 * Lo que importa es la relación del operador con lo que sabe
 */
export const distinguishErrorFromEvasion: DistinguishErrorFromEvasion = (
  action: string,
  reality: string,
  awareness: boolean
): ErrorType | EvasionType => {
  if (!awareness) {
    // Error no reconocido
    return {
      recognized: false,
      solutionAvailable: false,
      persistence: 30 * 24 * 60 * 60 * 1000, // 30 días
      friction: {
        present: true,
        source: 'evasion',
        intensity: 0.5,
        location: 'body',
        deferred: true,
        timestamp: Date.now(),
      },
      timestamp: Date.now(),
    };
  }
  
  // Si hay awareness, verificar si sostiene narrativa falsa
  return {
    narrative: 'Acción no corresponde con realidad conocida',
    recognized: true,
    sustained: true,
    friction: {
      present: true,
      source: 'evasion',
      intensity: 0.7,
      location: 'body',
      deferred: false,
      timestamp: Date.now(),
    },
    timestamp: Date.now(),
  };
}

/**
 * Calcular costo de autonomía
 * Costo de sostenimiento = energía en mantener narrativa
 */
export const calculateAutonomyCost: CalculateAutonomyCost = (cost: number): number => {
  // Costo de no cambiar = costo de cambiar
  // La diferencia no está en la cantidad, está en la dirección
  return cost;
};

/**
 * Calcular CDS (Capacidad de Soberanía)
 * CDS = capacidad × autonomía
 */
export const calculateCDS: CalculateCDS = (capacity: number): number => {
  // CDS = AUT × CDS (autonomía × soberanía)
  // Simplificado: CDS ≈ capacity * autonomy_factor
  return capacity * 0.8; // factor autonomía base
};

/**
 * Verificar presencia
 * Presencia = función que se ejecuta en cada micro-momento
 */
export const verifyPresence: VerifyPresence = (operator: string): Presence => {
  // En implementación real: leer sensores corporales, meditación, etc.
  return {
    active: true,
    bodySignal: {
      type: 'fluidity',
      location: 'chest',
      intensity: 0.8,
    },
    attention: {
      state: 'directed',
      target: 'present_moment',
      timestamp: Date.now(),
    },
    timestamp: Date.now(),
  };
}

/**
 * Registrar huella
 * La verdad deja huella. La huella es que algo ocurrió.
 */
export const registerHuella: RegisterHuella = (event: string, operatorId: string): Huella => ({
  event,
  timestamp: Date.now(),
  operatorId,
});

/**
 * Generar rastro
 * La verdad comprendida deja rastro. El rastro es lo que queda después de la comprensión integrada.
 */
export const generateRastro: GenerateRastro = (
  understanding: string,
  direction: string,
  capacityModified: boolean,
  operatorId: string
): Rastro => ({
  huellaId: generateId(),
  understanding,
  direction,
  capacityModified,
  timestamp: Date.now(),
});

/**
 * Actualizar mapa vivo
 * La verdad deja huella, la verdad comprendida deja rastro, el rastro modifica el mapa
 */
export const updateMapaVivo: UpdateMapaVivo = (rastro: Rastro): MapaVivo => {
  // En implementación real: leer mapa actual, añadir rastro, actualizar versión
  return {
    version: 1,
    rastros: [rastro.huellaId],
    understanding: rastro.understanding,
    unknown: 'Lo que todavía no se sabe',
    timestamp: Date.now(),
  };
};

/**
 * Convergencia de mapas
 * Múltiples operadores, reduciendo su evasión, llegan al mismo patrón estructural
 */
export const convergeMaps: ConvergeMaps = (operators: string[]): Convergence => ({
  operators,
  pattern: 'E→V pattern recognized',
  reinforced: true,
  timestamp: Date.now(),
});

/**
 * Verificar compatibilidad existencial
 * Se registra en el propio instrumento — cuerpo y conciencia
 */
export const verifyCompatibility: VerifyCompatibility = (operators: string[]): CompatibilityExistential[] => {
  return operators.map((op, i) => ({
    operatorA: operators[0],
    operatorB: op,
    corresponds: true, // Simplificado: en realidad se mediría
    renewable: true,
    gap: false,
  }));
}

/**
 * Separación legítima
 * Divergencia de operadores que comparten dato raíz pero direcciones distintas
 */
export const legitimateSeparation: LegitimateSeparationFn = (
  dataRoot: DataRoot,
  directions: string[]
): LegitimateSeparation => ({
  sharedDataRoot: true,
  differentDirections: directions.length > 1,
  recognized: true,
  noFight: true,
  timestamp: Date.now(),
});

/**
 * Nacemos en cero
 * No elegimos venir. No hay contrato. No hay deuda original.
 */
export const zeroOrigin: ZeroOrigin = (): ZeroOrigin => ({
  noContract: true,
  noOriginalDebt: true,
  noOriginalSin: true,
  existenceOwesNothing: true,
  weOweNothing: true,
  accepted: true,
  timestamp: Date.now(),
});

// ============================================================================
// RECORD HANDLING
// ============================================================================

export const createEVRecord = (form: EVRecordForm): EVRecord => ({
  id: generateId(),
  ...form,
  timestamp: Date.now(),
});

export const validateEVRecord = (record: EVRecord): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!['work', 'relationships', 'body', 'past', 'expectation', 'other'].includes(record.category)) {
    errors.push('Invalid category');
  }
  
  if (!['relief', 'chaos', 'ambiguous'].includes(record.result)) {
    errors.push('Invalid result');
  }
  
  if (!['1 día', '1 semana', '1 mes', 'other'].includes(record.timeHorizon)) {
    errors.push('Invalid timeHorizon');
  }
  
  if (!['chest', 'stomach', 'breath', 'sleep', 'energy', 'other'].includes(record.bodyTrace)) {
    errors.push('Invalid bodyTrace');
  }
  
  if (!['choice', 'habit', 'external_pressure', undefined].includes(record.reopening?.reason)) {
    errors.push('Invalid reopening reason');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

// ============================================================================
// EXPORTS - All functions and types
// ============================================================================

export {
  // Types
  type EVState,
  type Energy,
  type Experience,
  type Efficiency,
  type Truth,
  type Virtue,
  type Learning,
  type Presence,
  type BodySignal,
  type Attention,
  type Friction,
  type Coherence,
  type DataRoot,
  type Margin,
  type Trajectory,
  type Restriction,
  type Threshold,
  type Gap,
  type RelationalGap,
  type Interference,
  type ErrorType,
  type EvasionType,
  type Integration,
  type TruthOwn,
  type TruthOntological,
  type Sovereignty,
  type NaturalLaw,
  type PositiveLaw,
  type CouplingInternal,
  type CouplingExternal,
  type CompatibilityExistential,
  type LegitimateSeparation,
  type ZeroOrigin,
  type Huella,
  type Rastro,
  type MapaVivo,
  type Convergence,
  type EVRecord,
  type EVRecordForm,
  type MakeEVState,
  type EnergyToEfficiency,
  type LifeToVirtue,
  type DetectFriction,
  type DetectCoherence,
  type CalculateMargin,
  type UpdateDataRoot,
  type IntegrateExperience,
  type RecognizeError,
  type DistinguishErrorFromEvasion,
  type CalculateAutonomyCost,
  type CalculateCDS,
  type VerifyPresence,
  type RegisterHuella,
  type GenerateRastro,
  type UpdateMapaVivo,
  type ConvergeMaps,
  type VerifyCompatibility,
  type LegitimateSeparation,
  type ZeroOrigin,
  // Functions
  makeEVState,
  energyToEfficiency,
  lifeToVirtue,
  detectFriction,
  detectCoherence,
  calculateMargin,
  updateDataRoot,
  integrateExperience,
  recognizeError,
  distinguishErrorFromEvasion,
  calculateAutonomyCost,
  calculateCDS,
  verifyPresence,
  registerHuella,
  generateRastro,
  updateMapaVivo,
  convergeMaps,
  verifyCompatibility,
  legitimateSeparation,
  zeroOrigin,
  createEVRecord,
  validateEVRecord,
};