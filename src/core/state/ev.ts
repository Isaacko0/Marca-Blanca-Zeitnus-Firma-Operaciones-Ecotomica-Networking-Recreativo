// E→V Types - Core types for E→V pattern as pure logic
// E→V describes the passage of energy to efficiency through experience
// Life → Truth → Virtue (anfibio: postmonetario ZNU/CaaS o conectado USD/USDC)

export type Energy = {
  readonly amount: number;           // Energía gastada (tiempo vital, atención, esfuerzo)
  readonly source: 'vital' | 'attention' | 'effort'; // Fuente de energía
  readonly timestamp: number;        // Cuándo se gastó
  readonly direction: string;        // Hacia qué se dirigió
  readonly narrative?: string;       // Narrativa sostenida (si aplica)
};

export type Experience = {
  readonly energy: Energy;           // Energía que atraviesa la experiencia
  readonly truth: Truth;             // Verdad que transforma (no se posee, se atraviesa)
  readonly operatorId: string;       // Quién la vive (soberanía del operador)
  readonly timestamp: number;        // Cuándo ocurrió
  readonly integrated: boolean;      // Si se metabolizó/integró
  readonly learning?: Learning;      // Aprendizaje resultante (si se integró)
};

export type Truth = {
  readonly content: string;          // Lo que se comprende
  readonly source: 'own' | 'ontological'; // Verdad propia vs ontológica
  readonly verified: boolean;        // Si fue contrastada
  readonly timestamp: number;
};

export type Efficiency = {
  readonly amount: number;           // Eficiencia resultante (funcionamiento óptimo)
  readonly source: 'coherence' | 'virtue'; // Coherencia o virtud funcional
  readonly timestamp: number;
  readonly direction: string;        // Dirección sostenida
  readonly waste: number;            // Desperdicio mínimo
};

export type Virtue = {
  readonly excellence: number;       // Excelencia / funcionamiento óptimo (no moral)
  readonly functional: boolean;      // Es funcional, no moral
  readonly integratedLearning: Learning; // Aprendizaje integrado
};

export type Learning = {
  readonly content: string;          // Lo aprendido
  readonly modifiesCapacity: boolean; // Modifica capacidad de operar
  readonly timestamp: number;
};

export type Presence = {
  readonly active: boolean;          // Si está presente en micro-momento
  readonly bodySignal: BodySignal;   // Señal corporal (tensión/fluidez)
  readonly attention: Attention;     // Atención (dirigida/capturada/recuperada)
  readonly timestamp: number;
};

export type BodySignal = {
  readonly type: 'tension' | 'fluidity' | 'neutral';
  readonly location: string;         // Dónde se registra (pecho, estómago, respiración, etc.)
  readonly intensity: number;        // 0-1
};

export type Attention = {
  readonly state: 'directed' | 'captured' | 'fragmented' | 'recovered' | 'given';
  readonly target?: string;          // Hacia dónde va
  readonly source?: string;          // Quién/qué la captura
  readonly timestamp: number;
};

export type Friction = {
  readonly present: boolean;         // Si hay fricción
  readonly source: 'narrative' | 'structure' | 'interference' | 'evasion';
  readonly intensity: number;        // 0-1
  readonly location: 'body' | 'relationships' | 'structure' | 'environment' | 'time';
  readonly deferred: boolean;        // Si es diferida (aparece en otra capa/momento)
  readonly timestamp: number;
};

export type Coherence = {
  readonly present: boolean;         // Si hay coherencia
  readonly efficiency: Efficiency;   // Eficiencia resultante
  readonly timestamp: number;
};

export type DataRoot = {
  readonly content: string;          // Punto cero de observación (lo que se sabe sin capas)
  readonly verified: boolean;
  readonly timestamp: number;
};

export type Margin = {
  readonly trajectories: Trajectory[]; // Trayectorias disponibles
  readonly restrictions: Restriction[]; // Restricciones concretas
  readonly thresholds: Threshold[];   // Umbrales (info insuficiente)
  readonly gaps: Gap[];               // Desfases (conciencia > capacidad)
  readonly relationalGaps: RelationalGap[]; // Desfases relacionales
  readonly timestamp: number;
};

export type Trajectory = {
  readonly id: string;
  readonly direction: string;
  readonly available: boolean;
  readonly cost: number;             // Energía requerida
};

export type Restriction = {
  readonly domain: 'attention' | 'relationships' | 'territory' | 'time' | 'resources';
  readonly description: string;
  readonly concrete: boolean;        // Si se puede señalar en dominio concreto
};

export type Threshold = {
  readonly description: string;
  readonly infoMissing: string;
};

export type Gap = {
  readonly type: 'awareness_ahead' | 'capacity_behind';
  readonly description: string;
  readonly painful: boolean;         // Duele pero no es evasión
};

export type RelationalGap = {
  readonly description: string;
  readonly noCompatibleNetwork: boolean;
  readonly painful: true;
};

export type Interference = {
  readonly type: 'extraction' | 'betrayal' | 'damage';
  readonly source: string;
  readonly targetOperator: string;
  readonly energyDiverted: number;
  readonly frictionGenerated: Friction; // Fricción de interferencia (no propia)
  readonly recognized: boolean;      // Si se reconoció
  readonly corrected: boolean;       // Si se corrigió (dejar de sostener)
  readonly timestamp: number;
};

export type ErrorType = {
  readonly recognized: boolean;
  readonly solutionAvailable: boolean;
  readonly persistence: number;      // Tiempo sin resolver
  readonly friction: Friction | null; // Error reconocido sin solución no genera fricción
  readonly timestamp: number;
};

export type EvasionType = {
  readonly narrative: string;        // Narrativa que la realidad no sostiene
  readonly recognized: boolean;      // Divergencia reconocida
  readonly sustained: boolean;       // Se decide sostenerla
  readonly friction: Friction;       // Genera fricción sostenida
  readonly timestamp: number;
};

export type Integration = {
  readonly experience: Experience;   // Experiencia metabolizada
  readonly learning: Learning;       // Aprendizaje resultante
  readonly capacityModified: boolean; // Modifica capacidad de operar
  readonly timestamp: number;
};

export type TruthOwn = {
  readonly content: string;          // Lo que el operador capta de su existencia
  readonly correspondence: boolean;  // Alineación dirección-elegida ↔ experiencia-vivida
  readonly operatorId: string;
  readonly timestamp: number;
};

export type TruthOntological = {
  readonly structure: string;        // Estructura de la realidad independiente
  readonly demonstratesCompatibility: boolean; // Demuestra compatibilidad existencial
  readonly timestamp: number;
};

export type Sovereignty = {
  readonly evaluationInstance: 'operator' | 'external'; // Instancia final = operador
  readonly validationRequired: boolean; // No necesita validación externa
  readonly timestamp: number;
};

export type NaturalLaw = {
  readonly description: string;      // Suelo (no depende de legislador)
  readonly operates: boolean;        // Opera independientemente
  readonly recognized: boolean;
};

export type PositiveLaw = {
  readonly description: string;      // Construcción humana sobre suelo
  readonly aligned: boolean;         // Alineada con ley natural
  readonly mutable: boolean;         // Puede modificarse/derogarse
};

export type CouplingInternal = {
  readonly anchorVectorAligned: boolean; // Ancla-vector alineados
  readonly experienceVoiceAligned: boolean; // Experiencia-voz alineados
  readonly dataRootActionAligned: boolean; // Dato raíz-acción alineados
};

export type CouplingExternal = {
  readonly operators: string[];      // Pares soberanos
  readonly voluntaryAttention: boolean; // Atención voluntaria
  readonly returnsCapacity: boolean; // Devuelve capacidad al operador
};

export type CompatibilityExistential = {
  readonly operatorA: string;
  readonly operatorB: string;
  readonly corresponds: boolean;     // Dato de correspondencia
  readonly renewable: boolean;       // Se renueva cada día
  readonly gap: boolean;             // Brecha real (no se cierra)
};

export type LegitimateSeparation = {
  readonly sharedDataRoot: boolean;  // Mismo dato raíz
  readonly differentDirections: boolean; // Direcciones distintas
  readonly recognized: boolean;      // Operador reconoce en su experiencia
  readonly noFight: boolean;         // Sin pelea, sin confesión ajena
  readonly timestamp: number;
};

export type ZeroOrigin = {
  readonly noContract: true;
  readonly noOriginalDebt: true;
  readonly noOriginalSin: true;
  readonly existenceOwesNothing: true;
  readonly weOweNothing: true;
  readonly accepted: boolean;        // Aceptación del cero
  readonly timestamp: number;
};

export type EVState = {
  // Core cycle
  energy: Energy[];
  experience: Experience[];
  efficiency: Efficiency[];
  
  // Dual triad
  life: Energy[];
  truth: Truth[];
  virtue: Virtue[];
  
  // Presence & signals
  presence: Presence[];
  bodySignals: BodySignal[];
  attention: Attention[];
  
  // Cycle signals
  friction: Friction[];
  coherence: Coherence[];
  
  // Margin & restrictions
  dataRoot: DataRoot[];
  margin: Margin[];
  
  // Interference & errors
  interference: Interference[];
  errors: ErrorType[];
  evasions: EvasionType[];
  
  // Integration & learning
  integration: Integration[];
  learning: Learning[];
  
  // Truth & sovereignty
  truthOwn: TruthOwn[];
  truthOntological: TruthOntological[];
  sovereignty: Sovereignty[];
  
  // Laws
  naturalLaw: NaturalLaw[];
  positiveLaw: PositiveLaw[];
  
  // Coupling
  couplingInternal: CouplingInternal[];
  couplingExternal: CouplingExternal[];
  
  // Compatibility
  compatibility: CompatibilityExistential[];
  separation: LegitimateSeparation[];
  
  // Origin
  zeroOrigin: ZeroOrigin[];
  
  // Records
  huella: Huella[];
  rastro: Rastro[];
  mapaVivo: MapaVivo[];
  convergence: Convergence[];
  compatibility: CompatibilityExistential[];
  separation: LegitimateSeparation[];
  
  // Method
  records: EVRecord[];
  
  // Metadata
  lastUpdated: number;
};

export type Huella = {
  readonly event: string;            // Qué ocurrió
  readonly timestamp: number;
  readonly operatorId: string;
};

export type Rastro = {
  readonly huellaId: string;
  readonly understanding: string;    // Enseñanza que deja la verdad
  readonly direction: string;        // Dirección que el operador da
  readonly capacityModified: boolean;
  readonly timestamp: number;
};

export type MapaVivo = {
  readonly version: number;
  readonly rastros: string[];        // IDs de rastros
  readonly understanding: string;    // Comprensión actual
  readonly unknown: string;          // Lo que todavía no se sabe
  readonly timestamp: number;
};

export type Convergence = {
  readonly operators: string[];
  readonly pattern: string;          // Patrón estructural compartido
  readonly reinforced: boolean;
  readonly timestamp: number;
};

export type EVRecord = {
  readonly id: string;
  readonly category: 'work' | 'relationships' | 'body' | 'past' | 'expectation' | 'other';
  readonly costs: {
    readonly internal: boolean;
    readonly transition: boolean;
    readonly external: boolean;
  };
  readonly timeHorizon: string;      // '1 día' | '1 semana' | '1 mes' | 'other'
  readonly bodyTrace: string;        // 'chest' | 'stomach' | 'breath' | 'sleep' | 'energy' | 'other'
  readonly result: 'relief' | 'chaos' | 'ambiguous';
  readonly reopening: {
    readonly happened: boolean;
    readonly reason?: 'choice' | 'habit' | 'external_pressure';
  };
  readonly timestamp: number;
};

export type EVRecordForm = {
  category: EVRecord['category'];
  costs: EVRecord['costs'];
  timeHorizon: EVRecord['timeHorizon'];
  bodyTrace: EVRecord['bodyTrace'];
  result: EVRecord['result'];
  reopening: EVRecord['reopening'];
};

// Helper functions types
export type MakeEVState = () => EVState;
export type EnergyToEfficiency = (energy: Energy, experience: Experience) => Efficiency;
export type LifeToVirtue = (life: Energy, truth: Truth) => Virtue;
export type DetectFriction = (state: EVState) => Friction[];
export type DetectCoherence = (state: EVState) => Coherence[];
export type CalculateMargin = (dataRoot: DataRoot, presence: Presence, attention: Attention, evasion: EvasionType[], interference: Interference[]) => Margin;
export type UpdateDataRoot = (experience: Experience) => DataRoot;
export type IntegrateExperience = (experience: Experience) => Integration;
export type RecognizeError = (action: string, reality: string, recognition: boolean) => ErrorType;
export type DistinguishErrorFromEvasion = (action: string, reality: string, awareness: boolean) => ErrorType | EvasionType;
export type CalculateAutonomyCost = (cost: number) => number;
export type CalculateCDS = (capacity: number) => number;
export type VerifyPresence = (operator: string) => Presence;
export type RegisterHuella = (event: string, operatorId: string) => Huella;
export type GenerateRastro = (understanding: string, direction: string, capacityModified: boolean, operatorId: string) => Rastro;
export type UpdateMapaVivo = (rastro: Rastro) => MapaVivo;
export type ConvergeMaps = (operators: string[]) => Convergence;
export type VerifyCompatibility = (operators: string[]) => CompatibilityExistential[];
export type LegitimateSeparation = (dataRoot: DataRoot, directions: string[]) => LegitimateSeparation;
export type ZeroOrigin = () => ZeroOrigin;