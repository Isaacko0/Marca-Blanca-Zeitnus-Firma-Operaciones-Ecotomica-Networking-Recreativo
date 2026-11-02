// zeitnus-cooperative.ts — Lógica pura del Ecosistema Cooperativo ZEITNUS
// Principio Anfibio: postmonetario (ZNU/CaaS) ↔ conectado (USD/USDC vía priceParity)

export type CooperativeType =
  | 'educativa'
  | 'productiva'
  | 'ahorro_credito'
  | 'ecosistema_mixtro'
  | 'servicios'
  | 'vivienda'
  | 'consumo'
  | 'transporte'
  | 'electricidad'
  | 'industrial';

export type CapitalType =
  | 'aporte_capital'      // Certificado de aportación - patrimonio cooperativo
  | 'ahorro_disponible'   // Ahorro vista - liquidez inmediata
  | 'ahorro_programado'   // Ahorro con periodicidad definida
  | 'ahorro_plazo'        // Certificado depósito a plazo
  | 'inversion_bono'      // Valor financiero regulado SUGEVAL
  | 'credito'             // Instrumento operación - genera ingresos+riesgo
  | 'excedente'           // Resultado gestión colectiva - distribución legal/estatutos
  | 'donacion'            // Apoyo sin expectativa retorno
  | 'prestamo'            // Préstamo con devolución condicionada
  | 'compra_anticipada';  // Compra anticipada servicio/producto

export type RiskProfile = {
  crediticio: number;      // 0-100: probabilidad incumplimiento cartera
  liquidez: number;        // 0-100: capacidad cumplir obligaciones inmediatas
  tasaInteres: number;     // 0-100: sensibilidad variaciones tasas
  operativo: number;       // 0-100: fallas tech/procesos/seguridad
  gobiernoCorporativo: number; // 0-100: concentración/transparencia/conflictos
  fraude: number;          // 0-100: uso indebido/manipulación/abuso confianza
  perdidaCapital: number;  // 0-100: recuperación aporte según situación/reglas
  overall: number;         // Promedio ponderado
  level: 'bajo' | 'medio' | 'alto' | 'critico';
  mitigations: string[];
};

export type RegulatoryRegime =
  | 'infocoop_fomento'           // Solo fomento/educación - INFOCOOP
  | 'sugef_supervision'          // Intermediación financiera - SUGEF
  | 'conassif_normas'            // Sujeto normas sistema financiero - CONASSIF
  | 'banco_central_entorno'      // Entorno macro - Banco Central
  | 'sugeval_valores'            // Instrumentos negociables - SUGEVAL
  | 'ninguno'                    // Actividad no financiera (educativa/productiva)
  | 'mixto';                     // Múltiples regímenes según actividades

export type ProgressivePhase =
  | 'fase_1_vision'              // Definir visión económica/social + metas
  | 'fase_2_comunidad'           // Construir comunidad informada (educación prioritaria)
  | 'fase_3_necesidades'         // Identificar necesidades reales participantes
  | 'fase_4_viabilidad'          // Estudio viabilidad económica
  | 'fase_5_estructura'          // Elegir estructura adecuada (coop/empresa/ecosistema)
  | 'fase_6_gobierno'            // Diseñar modelo gobierno corporativo
  | 'fase_7_transparencia'       // Sistemas transparencia (info financiera, auditorías, participación)
  | 'fase_8_proyectos'           // Desarrollar proyectos económicos reales (circular, tech, agri, etc.)
  | 'fase_9_evaluar_financiera'  // Evaluar estructura financiera (NO paso 1)
  | 'fase_10_escalar'            // Escalar responsable: medir, corregir, fortalecer, capacitar
  | 'completa';

export type CircularEconomyMetrics = {
  residuosRecuperados: number;      // kg/toneladas recuperados
  materialesReutilizados: number;   // % materiales en nuevos ciclos
  empleosGenerados: number;         // empleos directos/indirectos
  proyectosDesarrollados: number;   // proyectos economía circular activos
  impactoEconomico: number;         // USD/ZNU generados
  participacionComunitaria: number; // participantes activos
  transparenciaInstitucional: number; // 0-100: info financiera, reportes, auditorías
  recursosNaturalesProtegidos: number; // hectáreas/recursos conservados
};

export type SocialCapitalIndicators = {
  confianza: number;                // 0-100: confianza entre miembros
  relacionesHumanas: number;        // 0-100: densidad red relaciones
  cooperacion: number;              // 0-100: disposición colaborar
  conocimientoCompartido: number;   // 0-100: conocimiento accesible/compartido
  capacidadOrganizacion: number;    // 0-100: capacidad coordinación colectiva
  overall: number;                  // Promedio ponderado
  nivel: 'incipiente' | 'en_desarrollo' | 'solido' | 'alto';
};

export type CooperativeState = {
  // Identidad
  name: string;
  type: CooperativeType;
  registryNumber?: string;
  statutes?: string;
  // Capital y recursos
  cooperativeCapital: number;        // Capital social cooperativo (aportes)
  savings: Record<CapitalType, number>; // Ahorros por tipo
  creditPortfolio: CreditPortfolio;  // Cartera de créditos
  surplus: number;                   // Excedentes acumulados
  // Riesgos y regulación
  riskProfile: RiskProfile;
  regulatoryRegime: RegulatoryRegime[];
  // Progreso ZEITNUS
  progressivePhase: ProgressivePhase;
  phaseCompleted: ProgressivePhase[];
  phaseMetrics: Record<ProgressivePhase, PhaseMetrics>;
  // Economía circular
  circularProjects: CircularProject[];
  circularMetrics: CircularEconomyMetrics;
  // Capital social
  socialCapital: SocialCapitalIndicators;
  // Transparencia
  transparencyIndex: number;         // 0-100
  transparencyMechanisms: TransparencyMechanism[];
  // Educación
  educationPrograms: EducationProgram[];
  financialLiteracyIndex: number;    // 0-100
  // Gobernanza
  governance: GovernanceStructure;
  // Metadatos
  createdAt: number;
  updatedAt: number;
  version: number;
};

export type CreditPortfolio = {
  totalCredits: number;
  activeCredits: number;
  totalOutstanding: number;
  nonPerformingLoans: number;        // NPL ratio
  averageInterestRate: number;
  concentrationRisk: number;         // 0-100
  sectors: Record<string, number>;   // Distribución por sector
  provisions: number;                // Provisiones para pérdidas
};

export type PhaseMetrics = {
  startedAt?: number;
  completedAt?: number;
  indicators: Record<string, number>;
  gatePassed: boolean;
  gateCriteria: string[];
};

export type CircularProject = {
  id: string;
  name: string;
  type: 'reciclaje' | 'produccion_sostenible' | 'tech_ambiental' | 'construccion_ecologica' | 'agri_regenerativa' | 'servicios_digitales' | 'educacion' | 'investigacion';
  status: 'planificacion' | 'ejecucion' | 'completado' | 'pausado';
  inputs: Record<string, number>;    // Residuos/materiales entrada
  outputs: Record<string, number>;   // Productos/recursos salida
  metrics: CircularEconomyMetrics;
  startDate: number;
  endDate?: number;
  budget: number;
  actualCost: number;
  revenue: number;
};

export type TransparencyMechanism = {
  id: string;
  name: string;
  type: 'info_financiera' | 'reportes_periodicos' | 'comunicacion_abierta' | 'auditorias' | 'registro_decisiones' | 'participacion_asociados';
  frequency: 'tiempo_real' | 'diaria' | 'semanal' | 'mensual' | 'trimestral' | 'anual';
  lastExecuted?: number;
  status: 'activo' | 'pendiente' | 'retrasado';
  responsible: string;
};

export type EducationProgram = {
  id: string;
  name: string;
  type: 'glosario' | 'simulador_interes_compuesto' | 'checklist_verificacion' | 'educacion_financiera_basica' | 'principios_cooperativos' | 'gestion_riesgos' | 'gobernanza_cooperativa' | 'economia_circular';
  targetAudience: 'asociados_nuevos' | 'asociados_activos' | 'dirigentes' | 'personal' | 'comunidad_externa';
  status: 'planificado' | 'en_curso' | 'completado';
  participants: number;
  completedCount: number;
  financialLiteracyGain: number;     // 0-100 mejora en alfabetización financiera
  startDate: number;
  endDate?: number;
};

export type GovernanceStructure = {
  assembly: {
    frequency: 'mensual' | 'trimestral' | 'semestral' | 'anual';
    lastHeld?: number;
    attendanceRate: number;          // 0-100
    quorumMet: boolean;
  };
  board: {
    members: number;
    independentMembers: number;
    meetingsPerYear: number;
    lastMeeting?: number;
    conflictOfInterestPolicy: boolean;
  };
  management: {
    generalManager: string;
    keyPositions: string[];
    professionalCertifications: string[];
  };
  committees: {
    audit: boolean;
    risk: boolean;
    credit: boolean;
    governance: boolean;
    education: boolean;
    technology: boolean;
  };
  conflictResolution: {
    mechanism: string;
    casesResolved: number;
    averageResolutionDays: number;
  };
};

// ============================================================================
// FUNCIONES PURAS - LÓGICA DEL ECOSISTEMA
// ============================================================================

/**
 * Calcula el capital cooperativo a partir de aportes
 * Los aportes integran capital social, no son depósitos ni acciones
 */
export function calculateCooperativeCapital(aports: { associateId: string; amount: number; date: number; type: 'inicial' | 'adicional' | 'obligatorio' | 'voluntario' }[]): {
  total: number;
  byAssociate: Record<string, number>;
  byType: Record<string, number>;
  timeline: { date: number; cumulative: number }[];
} {
  const byAssociate: Record<string, number> = {};
  const byType: Record<string, number> = {};
  const timeline: { date: number; cumulative: number }[] = [];

  let cumulative = 0;
  const sorted = [...aports].sort((a, b) => a.date - b.date);

  for (const aport of sorted) {
    byAssociate[aport.associateId] = (byAssociate[aport.associateId] || 0) + aport.amount;
    byType[aport.type] = (byType[aport.type] || 0) + aport.amount;
    cumulative += aport.amount;
    timeline.push({ date: aport.date, cumulative });
  }

  return {
    total: cumulative,
    byAssociate,
    byType,
    timeline,
  };
}

/**
 * Simula interés compuesto con factores reales (inflación, impuestos, comisiones)
 * VF = CI × (1 + r)^n ajustado por factores reales
 */
export function simulateCompoundInterest(params: {
  initialCapital: number;
  annualRate: number;           // Tasa nominal anual (ej: 0.05 = 5%)
  periods: number;              // Número de periodos (años)
  inflationRate?: number;       // Inflación anual (ej: 0.04 = 4%)
  taxRate?: number;             // Tasa impuesto rendimientos (ej: 0.15 = 15%)
  commissionRate?: number;      // Comisión anual (ej: 0.01 = 1%)
  compoundFrequency?: number;   // Veces por año que se capitaliza (default: 1)
}): {
  nominalFutureValue: number;
  realFutureValue: number;      // Ajustado por inflación
  netFutureValue: number;       // Después de impuestos y comisiones
  totalNominalReturn: number;
  totalRealReturn: number;
  totalNetReturn: number;
  yearlyBreakdown: {
    year: number;
    nominalValue: number;
    realValue: number;
    netValue: number;
    nominalReturn: number;
    realReturn: number;
    netReturn: number;
  }[];
} {
  const {
    initialCapital,
    annualRate,
    periods,
    inflationRate = 0,
    taxRate = 0,
    commissionRate = 0,
    compoundFrequency = 1,
  } = params;

  const ratePerPeriod = annualRate / compoundFrequency;
  const totalPeriods = periods * compoundFrequency;
  const inflationPerPeriod = inflationRate / compoundFrequency;
  const taxPerPeriod = taxRate / compoundFrequency;
  const commissionPerPeriod = commissionRate / compoundFrequency;

  let nominalValue = initialCapital;
  let realValue = initialCapital;
  let netValue = initialCapital;

  const yearlyBreakdown: typeof params['yearlyBreakdown'] = [];

  for (let p = 1; p <= totalPeriods; p++) {
    // Capitalización nominal
    const nominalReturn = nominalValue * ratePerPeriod;
    nominalValue += nominalReturn;

    // Ajuste por inflación (valor real)
    const realReturn = realValue * (ratePerPeriod - inflationPerPeriod);
    realValue += realReturn;

    // Ajuste por impuestos y comisiones (valor neto)
    const grossReturn = netValue * ratePerPeriod;
    const tax = grossReturn * taxPerPeriod;
    const commission = netValue * commissionPerPeriod;
    const netReturn = grossReturn - tax - commission;
    netValue += netReturn;

    // Registrar anualmente
    if (p % compoundFrequency === 0) {
      const year = p / compoundFrequency;
      yearlyBreakdown.push({
        year,
        nominalValue,
        realValue,
        netValue,
        nominalReturn: nominalValue - initialCapital,
        realReturn: realValue - initialCapital,
        netReturn: netValue - initialCapital,
      });
    }
  }

  return {
    nominalFutureValue: nominalValue,
    realFutureValue: realValue,
    netFutureValue: netValue,
    totalNominalReturn: nominalValue - initialCapital,
    totalRealReturn: realValue - initialCapital,
    totalNetReturn: netValue - initialCapital,
    yearlyBreakdown,
  };
}

/**
 * Evalúa perfil de riesgo de una cooperativa (5 riesgos principales + overall)
 */
export function assessRiskProfile(data: {
  // Crediticio
  nplRatio: number;                    // Non-performing loans ratio (0-1)
  portfolioDiversification: number;    // 0-1 (1 = bien diversificada)
  provisionCoverage: number;           // Cobertura provisiones/NPL (0-1+)
  // Liquidez
  liquidityRatio: number;              // Liquidez disponible / obligaciones cortas plazo
  liquidAssets: number;                // Activos líquidos totales
  shortTermObligations: number;        // Obligaciones < 30 días
  // Tasa interés
  interestRateSensitivity: number;     // % cambio ingresos por 1% cambio tasa
  fixedVsVariableRate: number;         // Proporción tasa fija (0-1)
  // Operativo
  techMaturity: number;                // 0-1 madurez tech/seguridad
  processAutomation: number;           // 0-1 procesos automatizados
  incidentRate: number;                // Incidentes/mes
  // Gobierno corporativo
  powerConcentration: number;          // 0-1 concentración poder
  transparencyScore: number;           // 0-1 transparencia
  directorPreparedness: number;        // 0-1 preparación dirigentes
  internalSupervision: number;         // 0-1 supervisión interna
  // Fraude
  segregationOfDuties: number;         // 0-1 separación funciones
  auditFrequency: number;              // Auditorías/año
  authorizationControls: number;       // 0-1 controles autorización
  // Pérdida capital
  capitalAdequacy: number;             // Ratio capital/activos ponderados riesgo
  associateAwareness: number;          // 0-1 conciencia asociados sobre aporte
}): RiskProfile {
  // Crediticio (0-100, mayor = más riesgo)
  const crediticio = Math.round(
    (data.nplRatio * 40) +
    ((1 - data.portfolioDiversification) * 30) +
    ((1 - Math.min(data.provisionCoverage, 1)) * 30)
  );

  // Liquidez
  const liquidez = Math.round(
    ((1 - Math.min(data.liquidityRatio, 2) / 2) * 50) +
    ((1 - Math.min(data.liquidAssets / Math.max(data.shortTermObligations, 1), 1)) * 50)
  );

  // Tasa interés
  const tasaInteres = Math.round(
    (data.interestRateSensitivity * 50) +
    ((1 - data.fixedVsVariableRate) * 50)
  );

  // Operativo
  const operativo = Math.round(
    ((1 - data.techMaturity) * 30) +
    ((1 - data.processAutomation) * 30) +
    (Math.min(data.incidentRate / 10, 1) * 40)
  );

  // Gobierno corporativo
  const gobiernoCorporativo = Math.round(
    (data.powerConcentration * 30) +
    ((1 - data.transparencyScore) * 30) +
    ((1 - data.directorPreparedness) * 20) +
    ((1 - data.internalSupervision) * 20)
  );

  // Fraude
  const fraude = Math.round(
    ((1 - data.segregationOfDuties) * 30) +
    ((1 - Math.min(data.auditFrequency / 4, 1)) * 30) +
    ((1 - data.authorizationControls) * 40)
  );

  // Pérdida capital
  const perdidaCapital = Math.round(
    ((1 - Math.min(data.capitalAdequacy / 0.1, 1)) * 50) +
    ((1 - data.associateAwareness) * 50)
  );

  const overall = Math.round(
    (crediticio * 0.25) +
    (liquidez * 0.20) +
    (tasaInteres * 0.10) +
    (operativo * 0.15) +
    (gobiernoCorporativo * 0.15) +
    (fraude * 0.10) +
    (perdidaCapital * 0.05)
  );

  let level: RiskProfile['level'];
  if (overall >= 70) level = 'critico';
  else if (overall >= 50) level = 'alto';
  else if (overall >= 30) level = 'medio';
  else level = 'bajo';

  // Generar mitigaciones basadas en riesgos altos
  const mitigations: string[] = [];
  if (crediticio >= 50) mitigations.push('Diversificar cartera, fortalecer análisis crediticio, aumentar provisiones');
  if (liquidez >= 50) mitigations.push('Aumentar reservas liquidez, diversificar fuentes financiamiento, líneas contingencia');
  if (tasaInteres >= 50) mitigations.push('Aumentar proporción tasa fija, cobertura derivados, análisis escenarios');
  if (operativo >= 50) mitigations.push('Invertir madurez tech/ciberseguridad, automatizar procesos, plan continuidad');
  if (gobiernoCorporativo >= 50) mitigations.push('Descentralizar decisiones, política transparencia, capacitación dirigentes, auditoría independiente');
  if (fraude >= 50) mitigations.push('Separación funciones, auditorías trimestrales, controles autorización, canal denuncias');
  if (perdidaCapital >= 50) mitigations.push('Fortalecer capital, educación asociados sobre aporte, comunicación transparente');

  return {
    crediticio,
    liquidez,
    tasaInteres,
    operativo,
    gobiernoCorporativo,
    fraude,
    perdidaCapital,
    overall,
    level,
    mitigations,
  };
}

/**
 * Verifica régimen regulatorio según actividad
 */
export function verifyRegulatoryRegime(activities: {
  captacionAhorro: boolean;
  otorgamientoCredito: boolean;
  intermediacionFinanciera: boolean;
  emisionBonos: boolean;
  emisionValores: boolean;
  captacionPublico: boolean;
  actividadProductiva: boolean;
  serviciosFinancieros: boolean;
  educacionFinanciera: boolean;
  proyectosProductivos: boolean;
  economiaCircular: boolean;
  tecnologiaAmbiental: boolean;
}): RegulatoryRegime[] {
  const regimes: RegulatoryRegime[] = [];

  // Fomento cooperativo siempre aplica
  regimes.push('infocoop_fomento');

  // Actividades financieras reguladas
  if (activities.captacionAhorro || activities.otorgamientoCredito || activities.intermediacionFinanciera || activities.captacionPublico) {
    regimes.push('sugef_supervision');
    regimes.push('conassif_normas');
  }

  // Entorno macro siempre aplica
  regimes.push('banco_central_entorno');

  // Mercado de valores
  if (activities.emisionBonos || activities.emisionValores) {
    regimes.push('sugeval_valores');
  }

  // Solo actividades no financieras
  if (!activities.captacionAhorro && !activities.otorgamientoCredito && !activities.intermediacionFinanciera && !activities.emisionBonos && !activities.emisionValores && !activities.captacionPublico) {
    if (!regimes.includes('sugef_supervision')) {
      regimes = regimes.filter(r => r !== 'sugef_supervision' && r !== 'conassif_normas' && r !== 'sugeval_valores');
    }
  }

  return regimes.length > 0 ? regimes : ['ninguno'];
}

/**
 * Diseña modelo progresivo 10 fases ZEITNUS
 */
export function designProgressiveModel(config: {
  vision: string;
  targetCommunity: string;
  initialCapital: number;
  hasLegalAdvice: boolean;
  hasAccounting: boolean;
  hasTechTeam: boolean;
  targetActivities: string[];
}): {
  phases: ProgressivePhase[];
  currentPhase: ProgressivePhase;
  estimatedTimeline: Record<ProgressivePhase, { minMonths: number; maxMonths: number }>;
  gates: Record<ProgressivePhase, { criteria: string[]; required: boolean }>;
  estimatedTotalMonths: number;
  recommendedStartPhase: ProgressivePhase;
} {
  const phases: ProgressivePhase[] = [
    'fase_1_vision',
    'fase_2_comunidad',
    'fase_3_necesidades',
    'fase_4_viabilidad',
    'fase_5_estructura',
    'fase_6_gobierno',
    'fase_7_transparencia',
    'fase_8_proyectos',
    'fase_9_evaluar_financiera',
    'fase_10_escalar',
    'completa',
  ];

  const estimatedTimeline: Record<ProgressivePhase, { minMonths: number; maxMonths: number }> = {
    'fase_1_vision': { minMonths: 1, maxMonths: 2 },
    'fase_2_comunidad': { minMonths: 3, maxMonths: 6 },
    'fase_3_necesidades': { minMonths: 2, maxMonths: 3 },
    'fase_4_viabilidad': { minMonths: 2, maxMonths: 4 },
    'fase_5_estructura': { minMonths: 1, maxMonths: 3 },
    'fase_6_gobierno': { minMonths: 2, maxMonths: 4 },
    'fase_7_transparencia': { minMonths: 1, maxMonths: 2 },
    'fase_8_proyectos': { minMonths: 6, maxMonths: 18 },
    'fase_9_evaluar_financiera': { minMonths: 3, maxMonths: 6 },
    'fase_10_escalar': { minMonths: 12, maxMonths: 36 },
    'completa': { minMonths: 0, maxMonths: 0 },
  };

  const gates: Record<ProgressivePhase, { criteria: string[]; required: boolean }> = {
    'fase_1_vision': {
      criteria: ['Visión documentada', 'Mínimo 3 metas medibles', 'Problema claramente definido'],
      required: true,
    },
    'fase_2_comunidad': {
      criteria: ['Comunidad mínima 20 personas', '80% completan educación básica', 'Estatutos preliminares'],
      required: true,
    },
    'fase_3_necesidades': {
      criteria: ['Diagnóstico necesidades completado', 'Mínimo 3 necesidades validadas', 'Priorización comunitaria'],
      required: true,
    },
    'fase_4_viabilidad': {
      criteria: ['Estudio viabilidad positivo', 'ROI proyectado > 0 a 24 meses', 'Riesgos identificados y mitigados'],
      required: true,
    },
    'fase_5_estructura': {
      criteria: ['Estructura jurídica seleccionada', 'Asesoría legal confirmada', 'Registro viable'],
      required: true,
    },
    'fase_6_gobierno': {
      criteria: ['Órganos definidos', 'Política conflictos interés', 'Mecanismo resolución conflictos'],
      required: true,
    },
    'fase_7_transparencia': {
      criteria: ['Info financiera publicada', 'Calendario reportes', 'Auditoría programada', 'Canal participación'],
      required: true,
    },
    'fase_8_proyectos': {
      criteria: ['Mínimo 2 proyectos piloto', 'Modelo financiero viable', 'Impacto medible', 'Equipo técnico'],
      required: true,
    },
    'fase_9_evaluar_financiera': {
      criteria: ['Comunidad estable (>50 activos)', 'Gobierno corporativo funcionando', 'Capital suficiente (>500k)', 'Equipo especializado', 'Tech segura', 'Controles internos', 'Cumplimiento regulatorio'],
      required: true,
    },
    'fase_10_escalar': {
      criteria: ['Crecimiento sostenido 12+ meses', 'Sistemas fortalecidos', 'Equipo capacitado', 'Adaptación entorno'],
      required: false,
    },
    'completa': {
      criteria: ['Todas las fases completadas', 'Institución madura y sostenible'],
      required: false,
    },
  };

  // Determinar fase inicial recomendada
  let recommendedStartPhase: ProgressivePhase = 'fase_1_vision';
  if (config.hasLegalAdvice && config.hasAccounting && config.initialCapital > 100000) {
    recommendedStartPhase = 'fase_5_estructura';
  } else if (config.targetActivities.some(a => ['educativa', 'investigacion'].includes(a))) {
    recommendedStartPhase = 'fase_1_vision';
  }

  const estimatedTotalMonths = Object.values(estimatedTimeline)
    .filter((_, i) => phases.indexOf(phases[i]) >= phases.indexOf(recommendedStartPhase))
    .reduce((sum, t) => sum + t.maxMonths, 0);

  return {
    phases,
    currentPhase: recommendedStartPhase,
    estimatedTimeline,
    gates,
    estimatedTotalMonths,
    recommendedStartPhase,
  };
}

/**
 * Mide métricas economía circular
 */
export function measureCircularEconomy(inputs: {
  residuosEntrada: Record<string, number>;    // kg por tipo
  productosSalida: Record<string, number>;    // unidades/kg por producto
  empleosDirectos: number;
  empleosIndirectos: number;
  proyectosActivos: number;
  participantesActivos: number;
  recursosNaturalesConservados: number;       // hectáreas/recursos
  infoFinancieraPublicada: boolean;
  reportesPeriodicos: boolean;
  auditoriasRealizadas: number;
  decisionesRegistradas: boolean;
  participacionAsociados: number;             // 0-100
  ingresosGenerados: number;                  // USD/ZNU
  costosOperativos: number;
}): CircularEconomyMetrics {
  const totalEntrada = Object.values(inputs.residuosEntrada).reduce((a, b) => a + b, 0);
  const totalSalida = Object.values(inputs.productosSalida).reduce((a, b) => a + b, 0);

  return {
    residuosRecuperados: totalEntrada,
    materialesReutilizados: totalEntrada > 0 ? Math.round((totalSalida / totalEntrada) * 100) : 0,
    empleosGenerados: inputs.empleosDirectos + inputs.empleosIndirectos,
    proyectosDesarrollados: inputs.proyectosActivos,
    impactoEconomico: inputs.ingresosGenerados - inputs.costosOperativos,
    participacionComunitaria: inputs.participantesActivos,
    transparenciaInstitucional: (
      (inputs.infoFinancieraPublicada ? 25 : 0) +
      (inputs.reportesPeriodicos ? 25 : 0) +
      (Math.min(inputs.auditoriasRealizadas / 2, 1) * 25) +
      (inputs.decisionesRegistradas ? 25 : 0)
    ),
    recursosNaturalesProtegidos: inputs.recursosNaturalesConservados,
  };
}

/**
 * Construye indicadores capital social
 */
export function buildSocialCapital(data: {
  trustSurveys: { associateId: string; score: number }[];           // 0-100 confianza
  networkDensity: number;                                            // 0-1 densidad red relaciones
  collaborationEvents: { eventId: string; participants: number }[]; // eventos colaborativos
  knowledgeSharing: { topic: string; contributors: number }[];      // conocimiento compartido
  coordinationSuccess: { projectId: string; success: boolean }[];   // capacidad organización
}): SocialCapitalIndicators {
  const confianza = data.trustSurveys.length > 0
    ? Math.round(data.trustSurveys.reduce((sum, s) => sum + s.score, 0) / data.trustSurveys.length)
    : 0;

  const relacionesHumanas = Math.round(data.networkDensity * 100);

  const totalCollabParticipants = data.collaborationEvents.reduce((sum, e) => sum + e.participants, 0);
  const avgCollabSize = data.collaborationEvents.length > 0
    ? totalCollabParticipants / data.collaborationEvents.length
    : 0;
  const cooperacion = Math.min(Math.round(avgCollabSize / 10 * 100), 100);

  const totalContributors = data.knowledgeSharing.reduce((sum, k) => sum + k.contributors, 0);
  const avgContributors = data.knowledgeSharing.length > 0
    ? totalContributors / data.knowledgeSharing.length
    : 0;
  const conocimientoCompartido = Math.min(Math.round(avgContributors / 5 * 100), 100);

  const successfulCoords = data.coordinationSuccess.filter(c => c.success).length;
  const capacidadOrganizacion = data.coordinationSuccess.length > 0
    ? Math.round((successfulCoords / data.coordinationSuccess.length) * 100)
    : 0;

  const overall = Math.round(
    (confianza * 0.3) +
    (relacionesHumanas * 0.2) +
    (cooperacion * 0.2) +
    (conocimientoCompartido * 0.15) +
    (capacidadOrganizacion * 0.15)
  );

  let nivel: SocialCapitalIndicators['nivel'];
  if (overall >= 80) nivel = 'alto';
  else if (overall >= 60) nivel = 'solido';
  else if (overall >= 30) nivel = 'en_desarrollo';
  else nivel = 'incipiente';

  return {
    confianza,
    relacionesHumanas,
    cooperacion,
    conocimientoCompartido,
    capacidadOrganizacion,
    overall,
    nivel,
  };
}

/**
 * Asegura transparencia institucional - calcula índice y sugiere mecanismos
 */
export function ensureTransparency(data: {
  financialInfoPublished: boolean;
  periodicReports: boolean;
  openCommunication: boolean;
  auditsPerformed: number;           // por año
  decisionsRecorded: boolean;
  associateParticipation: number;    // 0-100
  conflictOfInterestPolicy: boolean;
  whistleblowerChannel: boolean;
}): {
  transparencyIndex: number;         // 0-100
  mechanisms: TransparencyMechanism[];
  gaps: string[];
  recommendations: string[];
} {
  let score = 0;
  const mechanisms: TransparencyMechanism[] = [];
  const gaps: string[] = [];
  const recommendations: string[] = [];

  // Info financiera
  if (data.financialInfoPublished) {
    score += 20;
    mechanisms.push({
      id: 'info_financiera',
      name: 'Información financiera pública',
      type: 'info_financiera',
      frequency: 'trimestral',
      status: 'activo',
      responsible: 'Gerencia/Contabilidad',
    });
  } else {
    gaps.push('Información financiera no publicada');
    recommendations.push('Publicar estados financieros trimestrales en sitio web');
  }

  // Reportes periódicos
  if (data.periodicReports) {
    score += 20;
    mechanisms.push({
      id: 'reportes_periodicos',
      name: 'Reportes periódicos a asociados',
      type: 'reportes_periodicos',
      frequency: 'trimestral',
      status: 'activo',
      responsible: 'Consejo Administración',
    });
  } else {
    gaps.push('Falta de reportes periódicos');
    recommendations.push('Establecer calendario reportes trimestrales obligatorios');
  }

  // Comunicación abierta
  if (data.openCommunication) {
    score += 15;
    mechanisms.push({
      id: 'comunicacion_abierta',
      name: 'Comunicación abierta con asociados',
      type: 'comunicacion_abierta',
      frequency: 'mensual',
      status: 'activo',
      responsible: 'Comunicación',
    });
  } else {
    gaps.push('Comunicación no abierta');
    recommendations.push('Implementar boletín mensual y asambleas informativas');
  }

  // Auditorías
  if (data.auditsPerformed >= 1) {
    score += 20;
    mechanisms.push({
      id: 'auditorias',
      name: 'Auditorías independientes',
      type: 'auditorias',
      frequency: 'anual',
      lastExecuted: Date.now(),
      status: 'activo',
      responsible: 'Comité Auditoría',
    });
  } else {
    gaps.push('Sin auditorías independientes recientes');
    recommendations.push('Contratar auditoría externa anual obligatoria');
  }

  // Registro decisiones
  if (data.decisionsRecorded) {
    score += 10;
    mechanisms.push({
      id: 'registro_decisiones',
      name: 'Registro público de decisiones',
      type: 'registro_decisiones',
      frequency: 'tiempo_real',
      status: 'activo',
      responsible: 'Secretaría',
    });
  } else {
    gaps.push('Decisiones no registradas públicamente');
    recommendations.push('Implementar actas públicas y portal transparencia');
  }

  // Participación asociados
  if (data.associateParticipation >= 50) {
    score += 15;
    mechanisms.push({
      id: 'participacion_asociados',
      name: 'Participación activa en asambleas',
      type: 'participacion_asociados',
      frequency: 'trimestral',
      status: 'activo',
      responsible: 'Presidencia/Secretaría',
    });
  } else {
    gaps.push('Baja participación asociados (<50%)');
    recommendations.push('Incentivar participación: horarios accesibles, voto electrónico, información previa');
  }

  // Políticas adicionales
  if (data.conflictOfInterestPolicy) score += 5;
  else recommendations.push('Establecer política conflictos de interés obligatoria');

  if (data.whistleblowerChannel) score += 5;
  else recommendations.push('Implementar canal denuncia anónima/confidencial');

  return {
    transparencyIndex: Math.min(score, 100),
    mechanisms,
    gaps,
    recommendations,
  };
}

/**
 * Inicializa estado base para cooperativa ZEITNUS
 */
export function createInitialCooperativeState(name: string, type: CooperativeType): CooperativeState {
  const now = Date.now();
  return {
    name,
    type,
    cooperativeCapital: 0,
    savings: {} as Record<CapitalType, number>,
    creditPortfolio: {
      totalCredits: 0,
      activeCredits: 0,
      totalOutstanding: 0,
      nonPerformingLoans: 0,
      averageInterestRate: 0,
      concentrationRisk: 0,
      sectors: {},
      provisions: 0,
    },
    surplus: 0,
    riskProfile: {
      crediticio: 0,
      liquidez: 0,
      tasaInteres: 0,
      operativo: 0,
      gobiernoCorporativo: 0,
      fraude: 0,
      perdidaCapital: 0,
      overall: 0,
      level: 'bajo',
      mitigations: [],
    },
    regulatoryRegime: ['infocoop_fomento'],
    progressivePhase: 'fase_1_vision',
    phaseCompleted: [],
    phaseMetrics: {} as Record<ProgressivePhase, PhaseMetrics>,
    circularProjects: [],
    circularMetrics: {
      residuosRecuperados: 0,
      materialesReutilizados: 0,
      empleosGenerados: 0,
      proyectosDesarrollados: 0,
      impactoEconomico: 0,
      participacionComunitaria: 0,
      transparenciaInstitucional: 0,
      recursosNaturalesProtegidos: 0,
    },
    socialCapital: {
      confianza: 0,
      relacionesHumanas: 0,
      cooperacion: 0,
      conocimientoCompartido: 0,
      capacidadOrganizacion: 0,
      overall: 0,
      nivel: 'incipiente',
    },
    transparencyIndex: 0,
    transparencyMechanisms: [],
    educationPrograms: [],
    financialLiteracyIndex: 0,
    governance: {
      assembly: { frequency: 'anual', attendanceRate: 0, quorumMet: false },
      board: { members: 0, independentMembers: 0, meetingsPerYear: 0, conflictOfInterestPolicy: false },
      management: { generalManager: '', keyPositions: [], professionalCertifications: [] },
      committees: { audit: false, risk: false, credit: false, governance: false, education: false, technology: false },
      conflictResolution: { mechanism: '', casesResolved: 0, averageResolutionDays: 0 },
    },
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

// ============================================================================
// CONSTANTES Y CONFIGURACIÓN
// ============================================================================

export const COOPERATIVE_PRINCIPLES = [
  { id: 1, name: 'Adhesión voluntaria y abierta', description: 'Participación libre, sin discriminación, derechos y deberes compartidos' },
  { id: 2, name: 'Control democrático', description: '1 asociado = 1 voto, participación activa en decisiones' },
  { id: 3, name: 'Participación económica', description: 'Aportes forman patrimonio colectivo, excedentes ≠ utilidades SA' },
  { id: 4, name: 'Autonomía e independencia', description: 'Vínculos externos sin perder decisión propia' },
  { id: 5, name: 'Educación, formación, información', description: 'Proceso continuo: funcionamiento, productos, riesgos, derechos, responsabilidades' },
  { id: 6, name: 'Cooperación entre cooperativas', description: 'Alianzas, proyectos conjuntos, compartir conocimientos, autonomía respetada' },
  { id: 7, name: 'Compromiso con la comunidad', description: 'Desarrollo sostenible local: educación financiera, proyectos productivos, ambientales, culturales, sociales' },
];

export const REGULATORY_BODIES = {
  infocoop: { name: 'INFOCOOP', role: 'Fomento, promoción, capacitación, asistencia técnica, financiamiento', supervises: false },
  sugef: { name: 'SUGEF', role: 'Supervisión prudencial, evaluación riesgos, cumplimiento, info financiera', supervises: true },
  conassif: { name: 'CONASSIF', role: 'Normas generales sistema financiero, coordina superintendencias', supervises: false },
  centralBank: { name: 'Banco Central', role: 'Política monetaria, estabilidad, sistemas pago, info económica', supervises: false },
  sugeval: { name: 'SUGEVAL', role: 'Supervisión mercado valores, instrumentos negociables, participantes bursátiles', supervises: true },
};

export const RISK_THRESHOLDS = {
  crediticio: { bajo: 30, medio: 50, alto: 70 },
  liquidez: { bajo: 30, medio: 50, alto: 70 },
  tasaInteres: { bajo: 30, medio: 50, alto: 70 },
  operativo: { bajo: 30, medio: 50, alto: 70 },
  gobiernoCorporativo: { bajo: 30, medio: 50, alto: 70 },
  fraude: { bajo: 30, medio: 50, alto: 70 },
  perdidaCapital: { bajo: 30, medio: 50, alto: 70 },
  overall: { bajo: 30, medio: 50, alto: 70 },
};

export const PROGRESSIVE_PHASE_ORDER: ProgressivePhase[] = [
  'fase_1_vision',
  'fase_2_comunidad',
  'fase_3_necesidades',
  'fase_4_viabilidad',
  'fase_5_estructura',
  'fase_6_gobierno',
  'fase_7_transparencia',
  'fase_8_proyectos',
  'fase_9_evaluar_financiera',
  'fase_10_escalar',
  'completa',
];

export const PHASE_NAMES: Record<ProgressivePhase, string> = {
  'fase_1_vision': 'Definir Visión Económica y Social',
  'fase_2_comunidad': 'Construir Comunidad Informada',
  'fase_3_necesidades': 'Identificar Necesidades Reales',
  'fase_4_viabilidad': 'Estudio de Viabilidad',
  'fase_5_estructura': 'Elegir Estructura Adecuada',
  'fase_6_gobierno': 'Diseñar Modelo de Gobierno',
  'fase_7_transparencia': 'Crear Sistemas de Transparencia',
  'fase_8_proyectos': 'Desarrollar Proyectos Económicos Reales',
  'fase_9_evaluar_financiera': 'Evaluar Estructura Financiera',
  'fase_10_escalar': 'Escalar de Forma Responsable',
  'completa': 'Completa',
};

export const CAPITAL_TYPE_LABELS: Record<CapitalType, string> = {
  aporte_capital: 'Aporte de Capital (Certificado Aportación)',
  ahorro_disponible: 'Ahorro Disponible',
  ahorro_programado: 'Ahorro Programado',
  ahorro_plazo: 'Ahorro a Plazo (Certificado Depósito)',
  inversion_bono: 'Inversión en Bonos/Valores',
  credito: 'Crédito (Instrumento Operación)',
  excedente: 'Excedente Cooperativo',
  donacion: 'Donación',
  prestamo: 'Préstamo',
  compra_anticipada: 'Compra Anticipada',
};

export const COOPERATIVE_TYPE_LABELS: Record<CooperativeType, string> = {
  educativa: 'Educativa / Investigación',
  productiva: 'Productiva (Reciclaje, Agri, Tech, Servicios)',
  ahorro_credito: 'Ahorro y Crédito',
  ecosistema_mixtro: 'Ecosistema Mixto (Múltiples entidades)',
  servicios: 'Servicios',
  vivienda: 'Vivienda',
  consumo: 'Consumo',
  transporte: 'Transporte',
  electricidad: 'Eléctrica',
  industrial: 'Industrial',
};

export const RISK_LEVEL_LABELS: Record<RiskProfile['level'], string> = {
  bajo: '🟢 Bajo',
  medio: '🟡 Medio',
  alto: '🟠 Alto',
  critico: '🔴 Crítico',
};

export const REGULATORY_REGIME_LABELS: Record<RegulatoryRegime, string> = {
  infocoop_fomento: 'INFOCOOP - Fomento/Promoción/Educación',
  sugef_supervision: 'SUGEF - Supervisión Prudencial',
  conassif_normas: 'CONASSIF - Normas Sistema Financiero',
  banco_central_entorno: 'Banco Central - Entorno Macro',
  sugeval_valores: 'SUGEVAL - Mercado de Valores',
  ninguno: 'Sin régimen financiero (actividad no financiera)',
  mixto: 'Múltiples regímenes',
};

export const PHASE_LABELS: Record<ProgressivePhase, string> = {
  fase_1_vision: '1️⃣ Visión',
  fase_2_comunidad: '2️⃣ Comunidad',
  fase_3_necesidades: '3️⃣ Necesidades',
  fase_4_viabilidad: '4️⃣ Viabilidad',
  fase_5_estructura: '5️⃣ Estructura',
  fase_6_gobierno: '6️⃣ Gobierno',
  fase_7_transparencia: '7️⃣ Transparencia',
  fase_8_proyectos: '8️⃣ Proyectos',
  fase_9_evaluar_financiera: '9️⃣ Evaluar Financiera',
  fase_10_escalar: '🔟 Escalar',
  completa: '✅ Completa',
};