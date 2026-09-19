// ALRAC Types - Consorcio de Transducción Soberana
// Federar proyectos afines sin fusionarlos
// Arquitectura: 4 capas + capa 0 epistémica + capa 0.5 normativa

export interface ALRACState {
  // Capa 0: Epistémica (dos registros)
  epistemicLayer: EpistemicLayer;
  // Capa 0.5: Normativa
  normativeLayer: NormativeLayer;
  // Capa 1: Contable-física (TQ)
  accountingLayer: AccountingLayer;
  // Capa 2: Interoperabilidad (CaaS/HSCSG)
  interopLayer: InteropLayer;
  // Capa 3: Membrana fiat (ZEITNUS)
  fiatLayer: FiatLayer;
  // Gobernanza
  governance: ALRACGovernance;
  // Reparto financiero (ecuación Amid)
  revenueSplit: RevenueSplit;
  // Productos/Líneas
  productLines: ProductLine[];
  // Estado del consorcio
  status: 'forming' | 'active' | 'reconfiguring' | 'dissolved';
  lastAudit: number | null;
}

// Capa 0: Epistémica - Dos registros (Amid + Yoka)
export interface EpistemicLayer {
  amid: AmidRegister;
  yoka: YokaRegister;
  convergenceVerified: boolean;
}

export interface AmidRegister {
  principleOfIncapacity: boolean; // PI
  credoSet: CredoSet; // 𝕮
  gammaCARMIS: GammaCARMIS;
  triaxialVerification: TriaxialVerification;
  integratedEcroticAnalyzer: IntegratedEcroticAnalyzer;
  cognitiveLimits: CognitiveLimit[];
  license: 'CC0';
  responsibleUseRules: ResponsibleUseRule[];
}

export interface YokaRegister {
  frictionAsSignal: boolean;
  presenceMethod: PresenceMethod;
  sixFieldMethod: SixFieldMethod;
  entryExitNoDebt: boolean;
  convergenceNoAuthority: boolean;
  legitimateSeparation: boolean;
  zeroOrigin: boolean;
  license: 'custom'; // sin deuda entrada/permanencia/salida
}

export interface CredoSet {
  id: string;
  name: string;
  observer: string;
  domain: string;
  elements: any[];
  harmony: number; // αʰ = Ω·s
  criticalThreshold: number; // κ
  isStable: boolean; // αʰ > κ
  stability: boolean;
  relations: CredoRelation[];
  timestamp: number;
}

export interface CredoRelation {
  from: string;
  to: string;
  type: 'coupling' | 'evasion' | 'interference';
  strength: number;
}

export interface GammaCARMIS {
  triggered: boolean;
  overload: number;
  kappa: number;
  reconfigurationProtocol: string[];
  mandatoryBeforeRupture: boolean;
  deadline: number;
  timestamp: number;
}

export interface TriaxialVerification {
  mental: boolean;
  simulation: boolean;
  laboratory: boolean;
  passed: boolean;
  timestamp: number;
}

export interface IntegratedEcroticAnalyzer {
  diagnose(idea: string): EcroticDiagnosis;
}

export interface EcroticDiagnosis {
  valid: boolean;
  limits: string[];
  recommendations: string[];
}

export interface CognitiveLimit {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ResponsibleUseRule {
  id: string;
  rule: string;
  mandatory: boolean;
}

export interface PresenceMethod {
  observe: boolean;
  sustain: boolean;
  register: boolean;
}

export interface SixFieldMethod {
  category: string;
  observedCosts: string;
  timeHorizon: string;
  bodyTraceType: string;
  observedResult: string;
  reopening: string;
}

// Capa 0.5: Normativa (Javier)
export interface NormativeLayer {
  sevenPrinciples: Principle[];
  fiveAntiRules: AntiRule[];
  catlasModels: CAtlaSModel[];
}

export interface Principle {
  id: string;
  name: string;
  description: string;
  instrumentInALRAC: string;
}

export interface AntiRule {
  id: string;
  name: string;
  alraicBiasEquivalent: string;
}

export interface CAtlaSModel {
  id: string;
  name: string;
  context: string;
  applicability: string;
}

// Capa 1: Contable-física (TQ - Cergio)
export interface AccountingLayer {
  tqLedger: TQLedger;
  symmetricLimits: SymmetricLimits;
  energyCatalog: EnergyCatalog;
  conversionFactor: ConversionFactor;
  nfcOffline: NFCOffline;
  prohibition: ProhibitionRule;
}

export interface TQLedger {
  unit: 'TQ';
  anchor: '1 TQ = 1 kWh';
  accounts: TQAccount[];
  transactions: TQTransaction[];
}

export interface TQAccount {
  id: string;
  owner: string;
  balance: number; // TQ
  maxLimit: 500; // ±500 TQ
  minLimit: -500;
  confidenceLevel: number; // progresivo: 500→1000→5000→∞
}

export interface TQTransaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  type: 'reciprocity' | 'production' | 'regeneration';
}

export interface SymmetricLimits {
  positive: number; // 500
  negative: number; // -500
  antiHoarding: boolean;
  progressiveConfidence: boolean;
}

export interface EnergyCatalog {
  iceDatabase: boolean;
  ecoinvent: boolean;
  items: EnergyItem[];
}

export interface EnergyItem {
  id: string;
  name: string;
  tqValue: number; // kWh equivalent
  category: string;
}

export interface ConversionFactor {
  // FC = canasta_TQ(500) / canasta_Fiat
  // Solo para import/export DEX
  basketTQ: number;
  basketFiat: number;
  factor: number;
  dexImportExport: boolean;
}

export interface NFCOffline {
  enabled: boolean;
  hardware: 'ESP32' | 'ESP32-S3';
  protocol: 'NFC';
}

export interface ProhibitionRule {
  rule: 'TQ never exchanged for fiat or crypto';
  enforcedByArchitecture: boolean;
  membraneFiatLayer: string; // Capa 3 (ZEITNUS)
}

// Capa 2: Interoperabilidad (HSCSG/CaaS)
export interface InteropLayer {
  caas: CAASConfig;
  aut: AUTConfig;
  rao: RAOConfig;
  automaton: AutomatonConfig;
  nodeFederation: NodeFederationConfig;
}

export interface CAASConfig {
  contributionVectors: ContributionVector[];
  accessByContribution: boolean;
}

export interface ContributionVector {
  id: string;
  name: string;
  weight: number;
}

export interface AUTConfig {
  vectors: AUTVector[];
  sovereigntyThreshold: number;
}

export interface AUTVector {
  id: string;
  domain: string;
  capacity: number;
  contribution: number;
}

export interface RAOConfig {
  // Registro Auditoría Origen: identidad + emisor + procedencia + permisos + estado
  identity: string;
  issuer: string;
  provenance: string;
  permissions: string[];
  status: 'valid' | 'expired' | 'revoked';
}

export interface AutomatonConfig {
  version: string;
  selfImprovement: boolean;
  gitAudited: boolean;
}

export interface NodeFederationConfig {
  totalAutonomy: boolean;
  ownNorms: boolean;
  ownCulture: boolean;
}

// Capa 3: Membrana fiat (ZEITNUS)
export interface FiatLayer {
  legalEntity: 'cooperativa';
  jurisdiction: 'Mexico' | 'Venezuela';
  oneMemberOneVote: boolean;
  realProductionBacked: boolean;
  bankingBridge: boolean;
  noSavingsCapture: boolean; // No captar ahorro antes de 2-3 años balance auditado
  timeline: {
    yearsBeforeSavings: number;
    auditRequired: boolean;
  };
}

// Gobernanza de paz
export interface ALRACGovernance {
  noAbsorptionContract: boolean;
  triaxialArbitration: boolean;
  gammaCARMISReconfig: boolean;
  totalConsentCoreChanges: boolean; // nunca mayoría 51/49
  decisionLadder: DecisionLadderStep[];
  licenseAudit: LicenseAudit;
}

export interface DecisionLadderStep {
  step: number;
  action: 'build' | 'integrate' | 'associate' | 'adopt' | 'co-create' | 'merge';
  description: string;
}

export interface LicenseAudit {
  status: 'pending' | 'in_progress' | 'completed';
  backupsTotal: number;
  withDeclaredLicense: number;
  conflicts: LicenseConflict[];
  yokaFabioBalbiConflict: boolean;
}

export interface LicenseConflict {
  source: string;
  license: string;
  conflictWith: string;
  severity: 'high' | 'medium' | 'low';
}

// Reparto financiero (ecuación Amid)
export interface RevenueSplit {
  formula: string; // ω⁽ᵏ⁾ = ½ · θ_generado⁽ᵏ⁾ · (1 + ι) · φʰ⁽ᵏ⁾
  // φʰ⁽ᵏ⁾ = (0.95)ᵏ · (1 + αʰ⁽ᵏ⁾ / 10)
  halfToGenerator: boolean;
  restByHarmony: boolean;
  ppeClause: boolean; // γ_ind ≈ ½θ_generado = cláusula anti-explotación
  betaCritCap: boolean; // techo anti-acaparamiento interno
  layers: RevenueLayer[];
}

export interface RevenueLayer {
  id: string;
  name: string;
  used: boolean;
  harmonyContribution: number; // αʰ
  percentage: number;
}

// Líneas de producto (A-E)
export interface ProductLine {
  id: 'A' | 'B' | 'C' | 'D' | 'E';
  name: string;
  description: string;
  deliverables: string[];
  fundedBy: string[]; // estrategias Forner
  status: 'planned' | 'pilot' | 'active' | 'scaling';
  pilot?: PilotConfig;
}

export interface PilotConfig {
  name: string;
  description: string;
  externalDefined: boolean;
  client?: string;
  timeline: {
    start: string;
    end: string;
  };
}

// Factory
export const makeALRACState = (): ALRACState => ({
  epistemicLayer: {
    amid: {
      principleOfIncapacity: true,
      credoSet: {
        id: 'alrac-credo',
        name: 'ALRAC Consorcio',
        observer: 'ALRAC',
        domain: 'transduccion-soberana',
        elements: [],
        harmony: 0,
        criticalThreshold: 1,
        isStable: false,
        stability: false,
        relations: [],
        timestamp: Date.now(),
      },
      gammaCARMIS: {
        triggered: false,
        overload: 0,
        kappa: 1,
        reconfigurationProtocol: ['detect', 'diagnose', 'reconfigure', 'verify'],
        mandatoryBeforeRupture: true,
        deadline: 0,
        timestamp: Date.now(),
      },
      triaxialVerification: {
        mental: false,
        simulation: false,
        laboratory: false,
        passed: false,
        timestamp: Date.now(),
      },
      integratedEcroticAnalyzer: {
        diagnose: (idea: string) => ({
          valid: false,
          limits: [],
          recommendations: [],
        }),
      },
      cognitiveLimits: [
        { id: 'TAD', name: 'TAD', description: 'Explotar demora acción-consecuencia', severity: 'high' },
        { id: 'HD', name: 'HD', description: 'Cambiar dueño sin recontrastar modelo', severity: 'high' },
        { id: 'FCP', name: 'FCP', description: 'Relato en lugar de choque con lo inherente', severity: 'high' },
        { id: 'PPE', name: 'PPE', description: 'Explotación γ_ind ≪ ½θ_generado', severity: 'critical' },
        { id: 'TECNOFIX', name: 'Tecnofix', description: 'Tecnología sin cambio social', severity: 'high' },
      ],
      license: 'CC0',
      responsibleUseRules: [
        { id: 'no-clinical', rule: 'Nunca diagnosticar clínicamente', mandatory: true },
        { id: 'no-dependency', rule: 'Nunca crear dependencia', mandatory: true },
        { id: 'mandatory-referral', rule: 'Derivación obligatoria ante crisis', mandatory: true },
      ],
    },
    yoka: {
      frictionAsSignal: true,
      presenceMethod: { observe: true, sustain: true, register: true },
      sixFieldMethod: {
        category: '',
        observedCosts: '',
        timeHorizon: '',
        bodyTraceType: '',
        observedResult: '',
        reopening: '',
      },
      entryExitNoDebt: true,
      convergenceNoAuthority: true,
      legitimateSeparation: true,
      zeroOrigin: true,
      license: 'custom',
    },
    convergenceVerified: false,
  },
  normativeLayer: {
    sevenPrinciples: [
      { id: 'basic-needs', name: 'Necesidades básicas garantizadas', description: 'Base Material / vectores AUT (HSCSG)', instrumentInALRAC: 'Base Material / vectores AUT' },
      { id: 'limited-markets', name: 'Mercados limitados por reglas sociales y ecológicas', description: 'Prohibición cambiaria + techo ±500 TQ', instrumentInALRAC: 'Prohibición cambiaria + techo ±500 TQ' },
      { id: 'diverse-property', name: 'Propiedad diversa', description: 'Fideicomiso comunitario indivisible + cooperativa ZEITNUS', instrumentInALRAC: 'Fideicomiso comunitario indivisible + cooperativa ZEITNUS' },
      { id: 'economic-democracy', name: 'Democracia económica', description: 'Asamblea de nodo + jurados sorteados (CEL)', instrumentInALRAC: 'Asamblea de nodo + jurados sorteados (CEL)' },
      { id: 'concentration-limits', name: 'Límites a la concentración', description: 'β_crit + fondo comunitario', instrumentInALRAC: 'β_crit + fondo comunitario' },
      { id: 'less-growth', name: 'Menos dependencia del crecimiento', description: 'Postulado 4 + saldo cero', instrumentInALRAC: 'Postulado 4 + saldo cero' },
      { id: 'eco-planning', name: 'Planificación ecológica democrática', description: 'Catálogo energético + anclaje 1 TQ = 1 kWh', instrumentInALRAC: 'Catálogo energético + anclaje 1 TQ = 1 kWh' },
    ],
    fiveAntiRules: [
      { id: 'only-growth', name: 'Solo más crecimiento', alraicBiasEquivalent: 'TAD — explotar la demora entre acción y consecuencia' },
      { id: 'only-nationalize', name: 'Solo nacionalizar', alraicBiasEquivalent: 'HD — cambiar el dueño sin recontrastar el modelo' },
      { id: 'only-green-market', name: 'Solo mercado verde', alraicBiasEquivalent: 'FCP — relato en lugar de choque con lo inherente' },
      { id: 'degrowth-no-redistribution', name: 'Decrecimiento sin redistribución', alraicBiasEquivalent: 'γ_ind ≪ ½θ_generado — explotación (PPE)' },
      { id: 'tech-no-social', name: 'Tecnología sin cambio social', alraicBiasEquivalent: 'FCP en su forma "tecnofix"' },
    ],
    catlasModels: [],
  },
  accountingLayer: {
    tqLedger: {
      unit: 'TQ',
      anchor: '1 TQ = 1 kWh',
      accounts: [],
      transactions: [],
    },
    symmetricLimits: {
      positive: 500,
      negative: -500,
      antiHoarding: true,
      progressiveConfidence: true,
    },
    energyCatalog: {
      iceDatabase: true,
      ecoinvent: true,
      items: [],
    },
    conversionFactor: {
      basketTQ: 0,
      basketFiat: 0,
      factor: 0,
      dexImportExport: true,
    },
    nfcOffline: {
      enabled: true,
      hardware: 'ESP32',
      protocol: 'NFC',
    },
    prohibition: {
      rule: 'TQ never exchanged for fiat or crypto',
      enforcedByArchitecture: true,
      membraneFiatLayer: 'ZEITNUS (Capa 3)',
    },
  },
  interopLayer: {
    caas: {
      contributionVectors: [],
      accessByContribution: true,
    },
    aut: {
      vectors: [],
      sovereigntyThreshold: 0,
    },
    rao: {
      identity: '',
      issuer: '',
      provenance: '',
      permissions: [],
      status: 'valid',
    },
    automaton: {
      version: 'v0.1',
      selfImprovement: true,
      gitAudited: true,
    },
    nodeFederation: {
      totalAutonomy: true,
      ownNorms: true,
      ownCulture: true,
    },
  },
  fiatLayer: {
    legalEntity: 'cooperativa',
    jurisdiction: 'Mexico',
    oneMemberOneVote: true,
    realProductionBacked: true,
    bankingBridge: true,
    noSavingsCapture: true,
    timeline: {
      yearsBeforeSavings: 3,
      auditRequired: true,
    },
  },
  governance: {
    noAbsorptionContract: true,
    triaxialArbitration: true,
    gammaCARMISReconfig: true,
    totalConsentCoreChanges: true,
    decisionLadder: [
      { step: 1, action: 'build', description: 'Construir capacidad faltante' },
      { step: 2, action: 'integrate', description: 'Integrar capacidad existente' },
      { step: 3, action: 'associate', description: 'Asociarse con quien la tiene' },
      { step: 4, action: 'adopt', description: 'Adoptar estándar probado' },
      { step: 5, action: 'co-create', description: 'Co-crear nueva capacidad' },
      { step: 6, action: 'merge', description: 'Fusionar solo si es necesario' },
    ],
    licenseAudit: {
      status: 'pending',
      backupsTotal: 84,
      withDeclaredLicense: 25,
      conflicts: [],
      yokaFabioBalbiConflict: true,
    },
  },
  revenueSplit: {
    formula: 'ω⁽ᵏ⁾ = ½ · θ_generado⁽ᵏ⁾ · (1 + ι) · φʰ⁽ᵏ⁾',
    halfToGenerator: true,
    restByHarmony: true,
    ppeClause: true,
    betaCritCap: true,
    layers: [
      { id: 'epistemic-amid', name: 'Capa 0 - Amid', used: true, harmonyContribution: 0, percentage: 0 },
      { id: 'epistemic-yoka', name: 'Capa 0 - Yoka', used: true, harmonyContribution: 0, percentage: 0 },
      { id: 'normative', name: 'Capa 0.5 - Javier', used: true, harmonyContribution: 0, percentage: 0 },
      { id: 'accounting', name: 'Capa 1 - Cergio (TQ)', used: true, harmonyContribution: 0, percentage: 0 },
      { id: 'interop', name: 'Capa 2 - Isaac/HSCSG', used: true, harmonyContribution: 0, percentage: 0 },
      { id: 'fiat', name: 'Capa 3 - ZEITNUS', used: true, harmonyContribution: 0, percentage: 0 },
    ],
  },
  productLines: [
    {
      id: 'A',
      name: 'Diagnóstico de Encaje y Paz Operativa',
      description: 'Producto ancla: Paz = αʰ > κ sostenido (Amid) o ausencia fricción sostenida (Yoka)',
      deliverables: ['Encaje: 𝕮-Atlas diagnóstico', 'Desatasco: protocolo 6 campos para cooperativas fracturadas'],
      fundedBy: ['Forner-3', 'Forner-10', 'Forner-12'],
      status: 'planned',
    },
    {
      id: 'B',
      name: 'Nodo Llave en Mano',
      description: 'Stack Cergio desplegable: servidor mTLS, terminales ESP32/NFC, catálogo energético, plantillas asamblea',
      deliverables: ['Instalación', 'Mantenimiento anual'],
      fundedBy: ['Forner-2', 'Forner-4', 'Forner-9'],
      status: 'planned',
    },
    {
      id: 'C',
      name: 'Medición, Cumplimiento y Confianza',
      description: 'Dos clientes, una tecnología: reporte impacto + verificación credenciales alianzas IA',
      deliverables: ['Reporte impacto 7 principios + catálogo + ledger TQ + RAO', 'Experimento 2 - Trusted Credential (Gran Alianza)'],
      fundedBy: ['Forner-1', 'Forner-5', 'Forner-6', 'Forner-7', 'Forner-8', 'Forner-11'],
      status: 'pilot',
      pilot: {
        name: 'Experimento 2 - Trusted Credential',
        description: 'Verificar certificación real: quién emitió, cómo valida, si vigente, quién puede leerla',
        externalDefined: true,
        client: 'Gran Alianza por la Vida',
        timeline: { start: 'Semanas 4-8', end: 'Semanas 8-12' },
      },
    },
    {
      id: 'D',
      name: 'Editorial y Escuela Alráica',
      description: 'Libros existentes: El Dojo, Ecoaldeas Federadas, Prompt Maestro ZEITNUS, Documento Maestro E→V',
      deliverables: ['Edición', 'Distribución', 'Traducción', 'Curso'],
      fundedBy: ['Forner-1', 'Forner-5', 'Forner-6', 'Forner-7', 'Forner-8', 'Forner-11'],
      status: 'planned',
    },
    {
      id: 'E',
      name: 'Estudio Zeitnus',
      description: 'Desarrollo web clientes locales - sostiene A-D mientras maduran',
      deliverables: ['Proyectos web locales'],
      fundedBy: ['propios'],
      status: 'active',
    },
  ],
  status: 'forming',
  lastAudit: null,
});