// HSCSG v15 OS — Límite Epistemológico del Kernel (BT213 Completo)
// Fuente: BT213 "El Límite del Kernel" + Kernel v214 Canónico
// Integrado con: Sistema Alráico (PI, γ-CARMIS, Verificación Triaxial) + HSCSG v15 OS

export const KERNEL_EPISTEMIC_LIMIT = {
  // Definición núcleo (BT213)
  definition: 'El kernel organiza rastros, no decide la verdad. La realidad produce consecuencias. Las consecuencias dejan rastros. El kernel clasifica afirmaciones en compatible, incompatible, no evaluable.',
  
  // Lo que kernel NO puede (absoluto - BT213)
  cannot: [
    'Acceder a experiencia directa de operador',
    'Auditar conciencia ajena', 
    'Decidir qué es verdadero',
    'Interpretar personas',
    'Sustituir presencia',
    'Detectar evasión interna (solo incoherencia entre rastros)',
    'Decidir qué es verdadero',
    'Interpretar causa de incompatibilidad (error, memoria, mentira, etc.)'
  ],
  
  // Lo que kernel SÍ puede (BT213)
  can: [
    'Organizar rastros',
    'Auditar coherencia entre rastros',
    'Detectar asimetría información estructural',
    'Detectar imposición sin reciprocidad', 
    'Detectar alternativas de acople no implementadas',
    'Describir estructura',
    'Mostrar incoherencia entre dichos y rastros',
    'Clasificar: compatible | incompatible | no-evaluable',
    'Silencio = dato neutro'
  ],
  
  // Tres dominios clasificación (BT213)
  classificationDomains: {
    compatible: 'sostiene provisionalmente',
    incompatible: 'no sostiene sin evasión',
    notEvaluable: 'rastros insuficientes, suspende juicio'
  } as const,
  
  // Presencia Nula (detectable por kernel - BT213)
  nullPresence: {
    criteria: [
      'asimetría información estructural',
      'imposición sin reciprocidad', 
      'alternativa acople verificable'
    ],
    allRequired: true,
    note: 'Los dos primeros no bastan solos; tercer criterio es agravante. Lo que convierte asimetría en extracción es combinación asimetría + imposibilidad efectiva reciprocidad dentro margen relevante.'
  } as const,
  
  // Coherencia operativa (BT213)
  coherence: {
    definition: 'Existe coherencia cuando un conjunto de rastros puede explicarse mediante una misma configuración causal sin introducir contradicciones con otros rastros verificados.'
  },
  
  // Verdad ontológica vs operacional (BT213)
  truthLevels: {
    ontological: 'estructura realidad, independiente de nosotros',
    operational: 'mejor traducción disponible, siempre provisional, kernel trabaja solo con esta'
  } as const,
  
  // Dos dominios de acceso (BT213)
  accessDomains: {
    directExperience: {
      name: 'Experiencia directa',
      description: 'Partes de la realidad accesibles solo desde dentro: cuerpo, percepción, conciencia, experiencia inmediata. Solo el operador puede verificarlas.',
      access: 'private',
      verifiableBy: 'operator_only'
    },
    sharedTraces: {
      name: 'Rastros compartidos',
      description: 'Consecuencias observables de interacciones con la realidad, verificables por más de un operador.',
      access: 'public',
      verifiableBy: 'multiple_operators'
    }
  } as const,
  
  // Verdad operacional vs ontológica (BT213)
  truth: {
    ontological: 'estructura de la realidad, independiente de nosotros. No depende de que alguien la traduzca. No cambia porque cambie nuestra descripción.',
    operational: 'mejor traducción disponible de esa realidad que un operador puede alcanzar en un momento dado, según los rastros accesibles. Siempre provisional. Puede actualizarse sin que la realidad cambie. El kernel trabaja exclusivamente con este segundo nivel.',
    note: 'Cuando dice "verdad", se refiere a la mejor traducción disponible, no a la estructura ontológica.'
  } as const,
  
  // Límite absoluto (BT213)
  absoluteBoundary: 'El kernel no tiene acceso a la experiencia directa. No puede auditar conciencia. La causa de incompatibilidad (error, memoria, mentira) es interpretada por operador, no por kernel.',
  
  // Silencio (BT213)
  silence: 'dato neutro, no clasificado como incoherencia por defecto. Solo audita incoherencia cuando hay discurso o rastros.',
  
  // Presencia (BT213)
  presence: {
    definition: 'capacidad de sostener la integración de experiencia directa y rastros compartidos en el momento presente',
    integration: 'cuando el operador integra su experiencia directa con los rastros compartidos sin evadir ninguno de los dos dominios, reduce la generación de deuda estructural',
    debt: 'cuando evade uno de los dos dominios (experiencia O rastros), la deuda se acumula'
  },
  
  // Deuda estructural (BT213)
  structuralDebt: {
    source: 'evadir experiencia directa O rastros compartidos',
    presence: 'integra ambos dominios sin evadir',
    integration: 'reduce generación deuda estructural'
  }
} as const;

// Validación de operaciones del kernel (BT213)
export interface KernelOperation {
  attemptsToDecideTruth?: boolean;
  attemptsToAuditConsciousness?: boolean;
  interpretsPersons?: boolean;
  classification?: string;
  attributesIncompatibilityCause?: boolean;
  attemptsToAccessDirectExperience?: boolean;
  attemptsToAuditConsciousnessDirectly?: boolean;
  interpretsInternalEvasion?: boolean;
}

export interface KernelValidationResult {
  valid: boolean;
  violations: string[];
}

export function validateKernelOperation(operation: KernelOperation): KernelValidationResult {
  const violations: string[] = [];
  
  if (operation.attemptsToDecideTruth) {
    violations.push('VIOLACIÓN BT213: Kernel no puede decidir verdad');
  }
  
  if (operation.attemptsToAuditConsciousness || operation.attemptsToAuditConsciousnessDirectly) {
    violations.push('VIOLACIÓN BT213: Kernel no puede auditar conciencia ajena');
  }
  
  if (operation.interpretsPersons) {
    violations.push('VIOLACIÓN BT213: Kernel no interpreta personas');
  }
  
  if (operation.classification && !['compatible', 'incompatible', 'no-evaluable'].includes(operation.classification)) {
    violations.push('VIOLACIÓN BT213: Clasificación debe ser compatible/incompatible/no-evaluable');
  }
  
  if (operation.attributesIncompatibilityCause) {
    violations.push('VIOLACIÓN BT213: Causa de incompatibilidad interpretada por operador, no kernel');
  }
  
  if (operation.attemptsToAccessDirectExperience) {
    violations.push('VIOLACIÓN BT213: Kernel no puede acceder a experiencia directa de operador');
  }
  
  if (operation.attemptsToAuditConsciousnessDirectly) {
    violations.push('VIOLACIÓN BT213: Kernel no puede auditar conciencia directamente');
  }
  
  if (operation.interpretsInternalEvasion) {
    violations.push('VIOLACIÓN BT213: Kernel no detecta evasión interna; solo incoherencia entre rastros');
  }
  
  return {
    valid: violations.length === 0,
    violations
  };
}

// Clasificación de afirmaciones (BT213)
export type ClassificationDomain = 'compatible' | 'incompatible' | 'no-evaluable';

export function classifyAssertion(_traces: Trace[], _assertion: string): { domain: 'compatible' | 'incompatible' | 'no-evaluable'; reason: string } {
  // En implementación real: análisis de rastros vs afirmación
  // Para spec: estructura de retorno
  return {
    domain: 'no-evaluable',
    reason: 'Implementación pendiente: análisis de rastros vs afirmación'
  };
}

export interface Trace {
  id: string;
  source: string;
  content: string;
  timestamp: number;
  verifiedBy: string[];
  domain: 'directExperience' | 'sharedTraces';
}

// Presencia Nula (BT213) - detectable por kernel
export interface NullPresenceCheck {
  structuralInfoAsymmetry: boolean;
  impositionWithoutReciprocity: boolean;
  verifiableAlternativeAcople: boolean;
}

export function checkNullPresence(check: NullPresenceCheck): { isNullPresence: boolean; details: string } {
  const criteria = [
    check.structuralInfoAsymmetry,
    check.impositionWithoutReciprocity,
    check.verifiableAlternativeAcople
  ];
  
  const allMet = criteria.every(c => c);
  const metCount = criteria.filter(c => c).length;
  
  return {
    isNullPresence: allMet,
    details: `Criterios cumplidos: ${metCount}/3. ${metCount < 3 ? 'Presencia Nula NO detectada (requieren los 3 criterios)' : 'Presencia Nula DETECTADA - Los 3 criterios cumplidos'}`
  };
}

// Coherencia operativa (BT213)
export interface CoherenceCheck {
  traces: Trace[];
  causalConfiguration: string;
  contradictions: string[];
}

export function checkCoherence(check: CoherenceCheck): { coherent: boolean; details: string } {
  // En implementación real: verificar si rastros explicables por misma configuración causal
  return {
    coherent: check.contradictions.length === 0,
    details: check.contradictions.length === 0 
      ? 'Coherente: rastros explicables por misma configuración causal sin contradicciones'
      : `Incoherente: ${check.contradictions.length} contradicciones detectadas`
  };
}

// Dos dominios de acceso (BT213)
export type AccessDomain = 'directExperience' | 'sharedTraces';

export interface AccessDomainCheck {
  domain: AccessDomain;
  accessible: boolean;
  verifiedBy: string;
}

export function verifyAccessDomain(check: AccessDomainCheck): { accessible: boolean; note: string } {
  if (check.domain === 'directExperience') {
    return {
      accessible: check.accessible,
      note: check.accessible 
        ? 'Experiencia directa accesible solo por operador (dominio privado)' 
        : 'Experiencia directa NO accesible - dominio privado, solo operador puede verificar'
    };
  } else {
    return {
      accessible: check.accessible,
      note: check.accessible
        ? 'Rastros compartidos accesibles y verificables por múltiples operadores (dominio público)'
        : 'Rastros compartidos NO accesibles - dominio público pero rastros insuficientes'
    };
  }
}

// Export principal
export const BT213_KERNEL_LIMITS = {
  definition: 'El kernel organiza rastros, no decide la verdad. La realidad produce consecuencias. Las consecuencias dejan rastros. El kernel clasifica afirmaciones en compatible, incompatible, no evaluable.',
  
  cannot: [
    'Acceder a experiencia directa de operador',
    'Auditar conciencia ajena', 
    'Decidir qué es verdadero',
    'Interpretar personas',
    'Sustituir presencia',
    'Detectar evasión interna (solo incoherencia entre rastros)',
    'Decidir qué es verdadero',
    'Interpretar causa de incompatibilidad (error, memoria, mentira, etc.)'
  ] as const,
  
  can: [
    'Organizar rastros',
    'Auditar coherencia entre rastros',
    'Detectar asimetría información estructural',
    'Detectar imposición sin reciprocidad', 
    'Detectar alternativas de acople no implementadas',
    'Describir estructura',
    'Mostrar incoherencia entre dichos y rastros',
    'Clasificar: compatible | incompatible | no-evaluable',
    'Silencio = dato neutro'
  ] as const,
  
  classificationDomains: {
    compatible: 'sostiene provisionalmente',
    incompatible: 'no sostiene sin evasión',
    notEvaluable: 'rastros insuficientes, suspende juicio'
  } as const,
  
  nullPresence: {
    criteria: [
      'asimetría información estructural',
      'imposición sin reciprocidad', 
      'alternativa acople verificable'
    ],
    allRequired: true,
    note: 'Los dos primeros no bastan solos; tercer criterio es agravante.'
  } as const,
  
  coherence: {
    definition: 'Existe coherencia cuando un conjunto de rastros puede explicarse mediante una misma configuración causal sin introducir contradicciones con otros rastros verificados.'
  },
  
  truthLevels: {
    ontological: 'estructura realidad, independiente de nosotros',
    operational: 'mejor traducción disponible, siempre provisional, kernel trabaja solo con esta'
  } as const,
  
  accessDomains: {
    directExperience: { name: 'Experiencia directa', access: 'private', verifiableBy: 'operator_only' },
    sharedTraces: { name: 'Rastros compartidos', access: 'public', verifiableBy: 'multiple_operators' }
  } as const,
  
  truth: {
    ontological: 'estructura de la realidad, independiente de nosotros',
    operational: 'mejor traducción disponible, siempre provisional, kernel trabaja solo con esta',
    note: 'Cuando dice "verdad", se refiere a la mejor traducción disponible, no a la estructura ontológica.'
  } as const,
  
  absoluteBoundary: 'El kernel no tiene acceso a la experiencia directa. No puede auditar conciencia. La causa de incompatibilidad (error, memoria, mentira) es interpretada por operador, no por kernel.',
  
  silence: 'dato neutro, no clasificado como incoherencia por defecto',
  
  presence: {
    definition: 'capacidad de sostener la integración de experiencia directa y rastros compartidos en el momento presente',
    integration: 'cuando el operador integra su experiencia directa con los rastros compartidos sin evadir ninguno de los dos dominios, reduce la generación de deuda estructural',
    debt: 'cuando evade uno de los dos dominios (experiencia O rastros), la deuda se acumula'
  },
  
  structuralDebt: {
    source: 'evadir experiencia directa O rastros compartidos',
    presence: 'integra ambos dominios sin evadir',
    integration: 'reduce generación deuda estructural'
  },
  
  validateKernelOperation,
  classifyAssertion,
  checkNullPresence,
  checkCoherence,
  verifyAccessDomain
} as const;

export type KernelLimitKeys = keyof typeof BT213_KERNEL_LIMITS;
export type CannotKeys = typeof BT213_KERNEL_LIMITS.cannot[number];
export type CanKeys = typeof BT213_KERNEL_LIMITS.can[number];