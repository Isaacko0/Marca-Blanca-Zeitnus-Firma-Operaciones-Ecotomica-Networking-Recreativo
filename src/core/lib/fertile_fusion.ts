/**
 * Fusión Fértil (FF) + Test de Viabilidad Híbrida (TVH)
 * — Equivalente HSCSG a "Manteconcha" + "Tres Efes"
 * 
 * Validador de ideas híbridas: combina dos modelos probados (mainstream A + mainstream B)
 * y testea fertilidad: ¿Funciona? ¿Es replicable? ¿Escala?
 * 
 * Principio: "Mainstream A + Mainstream B = Híbrido Fértil (si pasa 3 tests)"
 * Uber = Taxis + Smartphone | Airbnb = Hoteles + Economía Colaborativa
 */

export interface MainstreamModel {
  id: string;
  name: string;
  description: string;
  proven: boolean;           // ¿Tiene evidencia de funcionamiento?
  market: string;            // Mercado donde opera
  keyMechanism: string;      // Mecanismo clave que lo hace funcionar
  scalability: number;       // 1-100
  replicability: number;     // 1-100
  tags: string[];
}

export interface HybridProposal {
  id: string;
  parentA: MainstreamModel;
  parentB: MainstreamModel;
  fusionThesis: string;      // Por qué esta fusión tiene sentido
  combinedMechanism: string; // Cómo se combinan los mecanismos
  targetMarket: string;
  createdAt: Date;
}

export interface ViabilityTestResult {
  test: 'FUNCTIONALITY' | 'REPLICABILITY' | 'SCALABILITY';
  passed: boolean;
  score: number;             // 0-100
  evidence: string;
  risks: string[];
  mitigation: string[];
}

export interface FertileFusionResult {
  proposal: HybridProposal;
  tests: ViabilityTestResult[];
  overallScore: number;      // 0-100 (media ponderada)
  isFertile: boolean;        // Pasa los 3 tests con score ≥ 70
  fertilityLevel: 'ESTERIL' | 'INCUBANDO' | 'FERTIL' | 'HIPERFERTIL';
  recommendations: string[];
  nextSteps: string[];
  createdAt: Date;
}

export interface FertileFusionCriteria {
  minFunctionalityScore: number;     // default 70
  minReplicabilityScore: number;     // default 70
  minScalabilityScore: number;       // default 70
  weights: {
    functionality: number;           // default 0.4
    replicability: number;           // default 0.3
    scalability: number;             // default 0.3
  };
}

export const DEFAULT_FERTILITY_CRITERIA: FertileFusionCriteria = {
  minFunctionalityScore: 70,
  minReplicabilityScore: 70,
  minScalabilityScore: 70,
  weights: {
    functionality: 0.4,
    replicability: 0.3,
    scalability: 0.3
  }
};

/**
 * Registry de modelos mainstream conocidos (seeds)
 */
export const MAINSTREAM_REGISTRY: MainstreamModel[] = [
  {
    id: 'taxis',
    name: 'Taxis Tradicionales',
    description: 'Transporte punto-a-punto con conductor profesional',
    proven: true,
    market: 'Transporte urbano',
    keyMechanism: 'Flota propia + despacho centralizado',
    scalability: 40,
    replicability: 90,
    tags: ['transporte', 'servicio', 'local']
  },
  {
    id: 'smartphone',
    name: 'Smartphone + GPS',
    description: 'Dispositivo móvil con geolocalización y apps',
    proven: true,
    market: 'Tecnología de consumo',
    keyMechanism: 'Ubicación en tiempo real + interfaz táctil',
    scalability: 100,
    replicability: 100,
    tags: ['tech', 'plataforma', 'global']
  },
  {
    id: 'hoteles',
    name: 'Hoteles Tradicionales',
    description: 'Alojamiento estandarizado con servicios',
    proven: true,
    market: 'Hospitalidad',
    keyMechanism: 'Inmueble propio + operaciones estandarizadas',
    scalability: 50,
    replicability: 80,
    tags: ['hospitalidad', 'bienes-raices', 'servicio']
  },
  {
    id: 'economia-colaborativa',
    name: 'Economía Colaborativa (P2P)',
    description: 'Intercambio entre pares mediado por plataforma',
    proven: true,
    market: 'Marketplaces',
    keyMechanism: 'Matchmaking oferta-demanda + reputación + pagos',
    scalability: 90,
    replicability: 85,
    tags: ['marketplace', 'p2p', 'plataforma']
  },
  {
    id: 'cursos-online',
    name: 'Cursos Online (MOOC)',
    description: 'Educación digital escalable',
    proven: true,
    market: 'Educación',
    keyMechanism: 'Contenido grabado + comunidad + certificación',
    scalability: 100,
    replicability: 95,
    tags: ['educacion', 'digital', 'contenido']
  },
  {
    id: 'comunidad-suscripcion',
    name: 'Comunidad por Suscripción',
    description: 'Acceso recurrente a comunidad + contenido exclusivo',
    proven: true,
    market: 'Creator Economy',
    keyMechanism: 'Recurrencia + pertenencia + valor exclusivo',
    scalability: 85,
    replicability: 90,
    tags: ['comunidad', 'suscripcion', 'recurrente']
  },
  {
    id: 'masterclass-gratis',
    name: 'Masterclass Gratis como Lead Magnet',
    description: 'Clase gratuita alto valor → conversión a pago',
    proven: true,
    market: 'Info-products',
    keyMechanism: 'Reciprocidad + demostración valor + cierre suave',
    scalability: 95,
    replicability: 90,
    tags: ['marketing', 'embudo', 'conversion']
  },
  {
    id: 'coaching-grupal',
    name: 'Coaching Grupal / Cohortes',
    description: 'Aprendizaje en cohorte con facilitador',
    proven: true,
    market: 'Educación ejecutiva',
    keyMechanism: 'Cohorte sincrónica + accountability + red',
    scalability: 60,
    replicability: 80,
    tags: ['coaching', 'cohorte', 'sincronico']
  }
];

/**
 * Crea propuesta de fusión híbrida
 */
export function createHybridProposal(
  parentAId: string,
  parentBId: string,
  fusionThesis: string,
  combinedMechanism: string,
  targetMarket: string
): HybridProposal {
  const parentA = MAINSTREAM_REGISTRY.find(m => m.id === parentAId);
  const parentB = MAINSTREAM_REGISTRY.find(m => m.id === parentBId);
  
  if (!parentA || !parentB) {
    throw new Error(`Modelos no encontrados: ${parentAId}, ${parentBId}`);
  }
  
  return {
    id: `hybrid_${parentAId}_${parentBId}_${Date.now()}`,
    parentA,
    parentB,
    fusionThesis,
    combinedMechanism,
    targetMarket,
    createdAt: new Date()
  };
}

/**
 * Test 1: Funcionalidad — ¿El híbrido resuelve el problema mejor que cada parte por separado?
 */
export function testFunctionality(
  proposal: HybridProposal,
  criteria: { minSynergyScore: number } = { minSynergyScore: 70 }
): ViabilityTestResult {
  // Sinergia = mecanismo combinado resuelve problema que ninguno resuelve solo
  const synergyFactors = [
    proposal.parentA.proven && proposal.parentB.proven ? 30 : 10,
    proposal.combinedMechanism.length > 50 ? 25 : 10, // mecanismo bien descrito
    proposal.fusionThesis.length > 100 ? 25 : 10,    // tesis bien fundamentada
    proposal.parentA.keyMechanism !== proposal.parentB.keyMechanism ? 20 : 5 // mecanismos complementarios
  ];
  
  const synergyScore = synergyFactors.reduce((a, b) => a + b, 0);
  const passed = synergyScore >= criteria.minSynergyScore;
  
  return {
    test: 'FUNCTIONALITY',
    passed,
    score: synergyScore,
    evidence: `Sinergia: ${synergyScore}/100. Mecanismos: "${proposal.parentA.keyMechanism}" + "${proposal.parentB.keyMechanism}" = "${proposal.combinedMechanism}"`,
    risks: passed ? [] : ['Mecanismos no complementarios', 'Tesis de fusión débil'],
    mitigation: passed ? [] : ['Refinar tesis de fusión', 'Buscar mecanismos más complementarios']
  };
}

/**
 * Test 2: Replicabilidad — ¿Puede replicarse el híbrido sin depender de fundadores específicos?
 */
export function testReplicability(
  proposal: HybridProposal,
  criteria: { minReplicabilityScore: number } = { minReplicabilityScore: 70 }
): ViabilityTestResult {
  // Replicabilidad = ambos padres replicables + mecanismos documentables
  const replicabilityFactors = [
    (proposal.parentA.replicability + proposal.parentB.replicability) / 2 * 0.5,
    proposal.combinedMechanism.includes('documentad') || proposal.combinedMechanism.includes('sistematiz') ? 25 : 10,
    proposal.fusionThesis.includes('proceso') || proposal.fusionThesis.includes('sistema') ? 25 : 10,
    !proposal.combinedMechanism.includes('fundador') && !proposal.combinedMechanism.includes('carisma') ? 25 : 5
  ];
  
  const replicabilityScore = Math.round(replicabilityFactors.reduce((a, b) => a + b, 0));
  const passed = replicabilityScore >= criteria.minReplicabilityScore;
  
  return {
    test: 'REPLICABILITY',
    passed,
    score: replicabilityScore,
    evidence: `Replicabilidad: ${replicabilityScore}/100. Padres: ${proposal.parentA.replicability}/${proposal.parentB.replicability}. Mecanismo documentable: ${proposal.combinedMechanism.includes('documentad') || proposal.combinedMechanism.includes('sistematiz')}`,
    risks: passed ? [] : ['Dependencia de fundadores', 'Mecanismo no documentable'],
    mitigation: passed ? [] : ['Documentar procesos', 'Eliminar dependencia de talento único']
  };
}

/**
 * Test 3: Escalabilidad — ¿El híbrido puede crecer sin degradar calidad?
 */
export function testScalability(
  proposal: HybridProposal,
  criteria: { minScalabilityScore: number } = { minScalabilityScore: 70 }
): ViabilityTestResult {
  // Escalabilidad = ambos padres escalables + mercado objetivo grande + mecanismo sin cuellos de botella
  const avgParentScalability = (proposal.parentA.scalability + proposal.parentB.scalability) / 2;
  
  const scalabilityFactors = [
    avgParentScalability * 0.4,
    proposal.targetMarket.includes('global') || proposal.targetMarket.includes('digital') ? 30 : 15,
    proposal.combinedMechanism.includes('automatiz') || proposal.combinedMechanism.includes('plataforma') ? 30 : 10
  ];
  
  const scalabilityScore = Math.round(scalabilityFactors.reduce((a, b) => a + b, 0));
  const passed = scalabilityScore >= criteria.minScalabilityScore;
  
  return {
      test: 'SCALABILITY',
      passed,
      score: scalabilityScore,
      evidence: `Escalabilidad: ${scalabilityScore}/100. Promedio padres: ${avgParentScalability}. Mercado: ${proposal.targetMarket}. Mecanismo: ${proposal.combinedMechanism}`,
      risks: passed ? [] : ['Mercado limitado', 'Cuellos de botella en mecanismo'],
      mitigation: passed ? [] : ['Expandir mercado objetivo', 'Automatizar cuellos de botella']
    };
}

/**
 * Evalúa fertilidad completa de una propuesta híbrida
 */
export function evaluateFertileFusion(
  proposal: HybridProposal,
  criteria: FertileFusionCriteria = DEFAULT_FERTILITY_CRITERIA
): FertileFusionResult {
  const tests: ViabilityTestResult[] = [
    testFunctionality(proposal, { minSynergyScore: criteria.minFunctionalityScore }),
    testReplicability(proposal, { minReplicabilityScore: criteria.minReplicabilityScore }),
    testScalability(proposal, { minScalabilityScore: criteria.minScalabilityScore })
  ];
  
  // Score ponderado
  const weightedScore = Math.round(
    tests[0].score * criteria.weights.functionality +
    tests[1].score * criteria.weights.replicability +
    tests[2].score * criteria.weights.scalability
  );
  
  const allPassed = tests.every(t => t.passed);
  const isFertile = allPassed && weightedScore >= 70;
  
  let fertilityLevel: FertileFusionResult['fertilityLevel'];
  if (weightedScore >= 90 && allPassed) fertilityLevel = 'HIPERFERTIL';
  else if (weightedScore >= 75 && allPassed) fertilityLevel = 'FERTIL';
  else if (weightedScore >= 50) fertilityLevel = 'INCUBANDO';
  else fertilityLevel = 'ESTERIL';
  
  const recommendations = generateRecommendations(tests, fertilityLevel);
  const nextSteps = generateNextSteps(proposal, tests, fertilityLevel);
  
  return {
    proposal,
    tests,
    overallScore: weightedScore,
    isFertile,
    fertilityLevel,
    recommendations,
    nextSteps,
    createdAt: new Date()
  };
}

function generateRecommendations(tests: ViabilityTestResult[], level: FertileFusionResult['fertilityLevel']): string[] {
  const recs: string[] = [];
  
  tests.forEach(t => {
    if (!t.passed) {
      recs.push(...t.mitigation);
    }
  });
  
  switch (level) {
    case 'HIPERFERTIL':
      recs.push('Priorizar desarrollo inmediato', 'Buscar funding para acelerar', 'Documentar como caso de estudio');
      break;
    case 'FERTIL':
      recs.push('Desarrollar MVP en 90 días', 'Validar con 10 usuarios beta', 'Documentar procesos');
      break;
    case 'INCUBANDO':
      recs.push('Refinar tesis de fusión', 'Validar supuestos clave con experimentos baratos', 'Buscar socio complementario');
      break;
    case 'ESTERIL':
      recs.push('Descartar o rediseñar radicalmente', 'Analizar por qué falló cada test', 'Buscar padres alternativos');
      break;
  }
  
  return [...new Set(recs)];
}

function generateNextSteps(proposal: HybridProposal, tests: ViabilityTestResult[], level: FertileFusionResult['fertilityLevel']): string[] {
  const steps: string[] = [];
  
  if (level === 'ESTERIL' || level === 'INCUBANDO') {
    steps.push('Revisar tests fallidos y rediseñar propuesta');
    steps.push('Considerar padres alternativos en registry');
    return steps;
  }
  
  // FERTIL o HIPERFERTIL
  steps.push('Definir MVP mínimo (1 feature core del mecanismo combinado)');
  steps.push('Crear landing page de validación para mercado objetivo');
  steps.push('Reclutar 10-20 usuarios beta para test de usabilidad');
  steps.push('Definir métricas de éxito: activación, retención, NPS');
  steps.push('Establecer cronograma: MVP 30 días → Beta 60 días → Launch 90 días');
  
  if (level === 'HIPERFERTIL') {
    steps.push('Preparar pitch deck para funding si requiere capital');
    steps.push('Diseñar programa de partners/affiliates para crecimiento viral');
  }
  
  return steps;
}

/**
 * Busca fusiones fértiles automáticamente en el registry
 */
export function discoverFertileFusions(
  criteria: FertileFusionCriteria = DEFAULT_FERTILITY_CRITERIA,
  maxResults = 10
): FertileFusionResult[] {
  const results: FertileFusionResult[] = [];
  
  for (let i = 0; i < MAINSTREAM_REGISTRY.length; i++) {
    for (let j = i + 1; j < MAINSTREAM_REGISTRY.length; j++) {
      const a = MAINSTREAM_REGISTRY[i];
      const b = MAINSTREAM_REGISTRY[j];
      
      // Solo combinar si tienen tags complementarios (no mismo mercado)
      const sharedTags = a.tags.filter(t => b.tags.includes(t));
      if (sharedTags.length > 1) continue; // Muy similares
      
      // Generar tesis automática básica
      const thesis = `Combinar ${a.keyMechanism} de ${a.name} con ${b.keyMechanism} de ${b.name} para crear ${a.name.toLowerCase()} + ${b.name.toLowerCase()} en mercado ${a.market} ∩ ${b.market}`;
      const mechanism = `${a.keyMechanism} + ${b.keyMechanism}`;
      const market = `${a.market} + ${b.market}`;
      
      const proposal = createHybridProposal(a.id, b.id, thesis, mechanism, market);
      const result = evaluateFertileFusion(proposal, criteria);
      
      if (result.isFertile) {
        results.push(result);
      }
    }
  }
  
  // Ordenar por score descendente
  return results
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, maxResults);
}

/**
 * Genera reporte de fertilidad
 */
export function generateFertilityReport(result: FertileFusionResult): string {
  const levelLabels = {
    ESTERIL: '💀 ESTÉRIL',
    INCUBANDO: '🥚 INCUBANDO',
    FERTIL: '🌱 FÉRTIL',
    HIPERFERTIL: '🚀 HIPERFÉRTIL'
  };
  
  return `
# Reporte Fusión Fértil (FF)

## Propuesta
- **Padres:** ${result.proposal.parentA.name} × ${result.proposal.parentB.name}
- **Tesis:** ${result.proposal.fusionThesis}
- **Mecanismo Combinado:** ${result.proposal.combinedMechanism}
- **Mercado Objetivo:** ${result.proposal.targetMarket}

## Resultados Tests
${result.tests.map(t => `
### ${t.test} — ${t.passed ? '✅ PASS' : '❌ FAIL'} (${t.score}/100)
- **Evidencia:** ${t.evidence}
- **Riesgos:** ${t.risks.join(', ') || 'Ninguno'}
- **Mitigación:** ${t.mitigation.join(', ') || 'N/A'}
`).join('\n')}

## Resultado Global
- **Score Ponderado:** ${result.overallScore}/100
- **¿Es Fértil?** ${result.isFertile ? '✅ SÍ' : '❌ NO'}
- **Nivel:** ${levelLabels[result.fertilityLevel]}

## Recomendaciones
${result.recommendations.map(r => `- ${r}`).join('\n')}

## Próximos Pasos
${result.nextSteps.map((s, i) => `${i+1}. ${s}`).join('\n')}

---
*Generado por HSCSG FertileFusion Engine v1.0*
  `.trim();
}

/**
 * Factory para fusiones conocidas exitosas (reference)
 */
export const KnownFertileFusions = {
  uber: () => createHybridProposal(
    'taxis', 'smartphone',
    'App que conecta pasajeros con conductores vía GPS en tiempo real',
    'Flota descentralizada + geolocalización + matching algorítmico + pagos integrados',
    'Transporte urbano global'
  ),
  
  airbnb: () => createHybridProposal(
    'hoteles', 'economia-colaborativa',
    'Marketplace de alojamiento en casas particulares con reputación y pagos seguros',
    'Inventario distribuido P2P + estandarización confianza + pagos escrow',
    'Hospitalidad global'
  ),
  
  happyModel: () => createHybridProposal(
    'masterclass-gratis', 'comunidad-suscripcion',
    'Masterclass gratis demuestra valor → comunidad recurrente monetiza relación continua',
    'Reciprocidad + demostración valor + cierre suave + recurrencia + pertenencia',
    'Info-products hispanohablantes'
  )
};