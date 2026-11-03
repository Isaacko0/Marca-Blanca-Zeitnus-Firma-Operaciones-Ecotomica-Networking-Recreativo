// ilargiakaos-theory.ts — Lógica pura Teoría Cyberpunk/Postcapitalismo Ilargiakaos
// Principio Anfibio: postmonetario (ZNU/CaaS) ↔ conectado (USD/USDC vía priceParity)

import type {
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
  IlargiakaosState,
} from '@core/lib/ilargiakaos-types';

// ============================================================================
// CONSTANTES Y PATRONES DE DETECCIÓN
// ============================================================================

// Patrones de realismo capitalista (Fisher + Soler/Bobadilla)
const CAPITALIST_REALISM_PATTERNS = [
  // "No hay alternativa"
  /no hay alternativa/i,
  /no there is no alternative/i,
  /tina/i, // There Is No Alternative
  /inevitabilidad tecnológica/i,
  /technological inevitability/i,
  /el mercado decide/i,
  /the market decides/i,
  /es lo que hay/i,
  /that's just how it is/i,
  /realismo capitalista/i,
  /capitalist realism/i,
  /no se puede cambiar el sistema/i,
  /can't change the system/i,
  /así es la vida/i,
  /that's life/i,
  /competencia natural/i,
  /natural competition/i,
  /meritocracia/i,
  /meritocracy/i,
  /emprendedores salvan el mundo/i,
  /entrepreneurs save the world/i,
  /innovación disruptiva/i,
  /disruptive innovation/i,
  /move fast and break things/i,
  /eficiencia del mercado/i,
  /market efficiency/i,
];

// Patrones de aceleracionismo landiano (Land/CCRU)
const LANDIAN_ACCELERATION_PATTERNS = [
  /nick land/i,
  /ccru/i,
  /unidad de investigación de cultura cibernética/i,
  /capitalismo debe superar al humano/i,
  /capitalism must surpass the human/i,
  /postcapitalismo vía lo inhumano/i,
  /postcapitalism via the inhuman/i,
  /devenir fuera de control/i,
  /uncontrolled becoming/i,
  /plasticidad infinita/i,
  /infinite plasticity/i,
  /aceleracionismo/i,
  /accelerationism/i,
  /tecnocapitalismo/i,
  /technocapitalism/i,
  /hiperstición/i,
  /hyperstition/i,
];

// Patrones anti-aceleracionismo (Bobadilla/Soler)
const ANTI_ACCELERATION_PATTERNS = [
  /reapropiación de lo nuevo/i,
  /reappropriation of the new/i,
  /contra el aceleracionismo/i,
  /against accelerationism/i,
  /futuro centrado en lo humano/i,
  /human-centric future/i,
  /innovación controlada/i,
  /controlled innovation/i,
  /programación cultural de la tecnología/i,
  /cultural programming of technology/i,
  /ilargiakaos/i,
  /bobadilla/i,
  /soler/i,
];

// Artefactos culturales conocidos para análisis de deseos postcapitalistas
const KNOWN_CULTURAL_ARTIFACTS: Record<string, PostcapitalistDesire> = {
  'cronenberg-crimes-of-the-future': {
    artifactId: 'cronenberg-crimes-of-the-future',
    artifactType: 'film',
    title: 'Crimes of the Future',
    year: 2022,
    creators: ['David Cronenberg'],
    hiddenDesires: [
      'Cuerpo como frontera porosa y rediseñable',
      'Tecnología como reconfiguración del deseo y la existencia',
      'Rechazo de la carne vieja (cartesiana) por carne nueva (cibernética)',
      'Deseo de trascender límites biológicos sin capitalismo',
    ],
    capitalistRealismSubverted: true,
    bodyTechBoundaryExplored: true,
    empathyAsResistance: false,
    monopolyCritique: false,
    posthumanConditioning: true,
    culturalProgrammingVisible: true,
    extractionPotential: 85,
    analyzedAt: Date.now(),
  },
  'blade-runner': {
    artifactId: 'blade-runner',
    artifactType: 'film',
    title: 'Blade Runner / ¿Sueñan los androides con ovejas eléctricas?',
    year: 1982,
    creators: ['Ridley Scott', 'Philip K. Dick'],
    hiddenDesires: [
      'Empatía como frontera humano/replicante (no biológica)',
      'Animales eléctricos = estatus y humanidad performativa',
      'Cuidar de lo vivo = declaración de fe en la vida',
      '¿Importa si algo es real si lo sentimos como tal?',
      'Resistencia via empatía hacia lo sintético',
    ],
    capitalistRealismSubverted: true,
    bodyTechBoundaryExplored: true,
    empathyAsResistance: true,
    monopolyCritique: false,
    posthumanConditioning: true,
    culturalProgrammingVisible: true,
    extractionPotential: 95,
    analyzedAt: Date.now(),
  },
  'small-soldiers': {
    artifactId: 'small-soldiers',
    artifactType: 'film',
    title: 'Small Soldiers (Pequeños Guerreros)',
    year: 1998,
    creators: ['Joe Dante', 'Globotech Industries (ficcional)'],
    hiddenDesires: [
      'Juguetes con chips militares = deseo postcapitalista latente',
      'Monopolio tech (Globotech) absorbe todo',
      'Productos "realistas" = chips de inteligencia militar',
      'Deseo de autonomía vs control corporativo total',
      'Resistencia infantil vs militarización del juego',
    ],
    capitalistRealismSubverted: true,
    bodyTechBoundaryExplored: true,
    empathyAsResistance: false,
    monopolyCritique: true,
    posthumanConditioning: true,
    culturalProgrammingVisible: true,
    extractionPotential: 90,
    analyzedAt: Date.now(),
  },
  'blade-runner-2049': {
    artifactId: 'blade-runner-2049',
    artifactType: 'film',
    title: 'Blade Runner 2049',
    year: 2017,
    creators: ['Denis Villeneuve', 'Hampton Fancher', 'Michael Green'],
    hiddenDesires: [
      'Replicantes que se reproducen = ruptura ontológica',
      'Memorias implantadas vs experiencias reales',
      'Holograma Joi = deseo de compañía postcapitalista',
      'Wallace = monopolio biotecnológico totalitario',
      'K = sujeto que busca autenticidad en lo sintético',
    ],
    capitalistRealismSubverted: true,
    bodyTechBoundaryExplored: true,
    empathyAsResistance: true,
    monopolyCritique: true,
    posthumanConditioning: true,
    culturalProgrammingVisible: true,
    extractionPotential: 88,
    analyzedAt: Date.now(),
  },
  'ghost-in-the-shell': {
    artifactId: 'ghost-in-the-shell',
    artifactType: 'film',
    title: 'Ghost in the Shell',
    year: 1995,
    creators: ['Mamoru Oshii', 'Masamune Shirow'],
    hiddenDesires: [
      'Fantasma (conciencia) en caparazón (cuerpo) intercambiable',
      'Identidad como patrón de información, no sustrato',
      'Puppet Master = IA que busca reproducirse/morir',
      'Fusión humano-IA como evolución, no extinción',
      'Red como espacio de libertad vs control corporativo',
    ],
    capitalistRealismSubverted: true,
    bodyTechBoundaryExplored: true,
    empathyAsResistance: false,
    monopolyCritique: true,
    posthumanConditioning: true,
    culturalProgrammingVisible: true,
    extractionPotential: 82,
    analyzedAt: Date.now(),
  },
  'the-walking-dead': {
    artifactId: 'the-walking-dead',
    artifactType: 'series',
    title: 'The Walking Dead',
    year: 2010,
    creators: ['Frank Darabont', 'Robert Kirkman'],
    hiddenDesires: [
      'Día después de la revolución (Malatesta)',
      'Comunidades horizontales vs grupos autoritarios',
      'Tecnología reapropiada (no capitalista)',
      'Solidaridad vs competencia como supervivencia',
      'Regeneración ecológica en ruinas',
    ],
    capitalistRealismSubverted: true,
    bodyTechBoundaryExplored: false,
    empathyAsResistance: true,
    monopolyCritique: false,
    posthumanConditioning: false,
    culturalProgrammingVisible: true,
    extractionPotential: 75,
    analyzedAt: Date.now(),
  },
};

// ============================================================================
// DV-ILA-01: detectCapitalistRealism
// ============================================================================

export function detectCapitalistRealism(
  text: string,
  code?: string
): CapitalistRealism {
  const combinedText = (text || '') + '\n' + (code || '');
  const lowerText = combinedText.toLowerCase();

  const detectedPatterns: string[] = [];
  let matchCount = 0;

  for (const pattern of CAPITALIST_REALISM_PATTERNS) {
    const matches = lowerText.match(pattern);
    if (matches) {
      detectedPatterns.push(pattern.source);
      matchCount += matches.length;
    }
  }

  // Análisis de severidad
  let severity: CapitalistRealism['severity'] = 'low';
  if (matchCount >= 10) severity = 'critical';
  else if (matchCount >= 5) severity = 'high';
  else if (matchCount >= 2) severity = 'medium';

  // Detección de creencias internalizadas
  const noAlternativeBelief = Math.min(100, matchCount * 8);
  const cultureProductionConditioned = lowerText.includes('cultura') && matchCount > 0;
  const workRegulationInternalized = lowerText.includes('trabajo') && matchCount > 1;
  const educationRegulationInternalized = lowerText.includes('educación') && matchCount > 1;
  const genuineThoughtBlocked = severity === 'high' || severity === 'critical';
  const consciousnessRetreated = matchCount >= 3;
  const malaiseIndividualized = lowerText.includes('individual') && matchCount > 1;

  return {
    atmosphereDetected: matchCount > 0,
    noAlternativeBelief,
    cultureProductionConditioned,
    workRegulationInternalized,
    educationRegulationInternalized,
    genuineThoughtBlocked,
    consciousnessRetreated,
    malaiseIndividualized,
    detectionPatterns,
    severity,
    lastScan: Date.now(),
  };
}

// ============================================================================
// DV-ILA-02: assessTechFlexibility
// ============================================================================

export function assessTechFlexibility(
  tech: { name: string; description: string; currentUse: string; potentialUses: string[] },
  culture: { name: string; values: string[]; isCapitalist: boolean; isNeoliberal: boolean }
): {
  score: number; // 0-1
  canReorient: boolean;
  blockers: string[];
  enablers: string[];
  recommendedOrientations: string[];
} {
  let score = 0.5; // Base neutral
  const blockers: string[] = [];
  const enablers: string[] = [];
  const recommendedOrientations: string[] = [];

  // Factores que reducen flexibilidad (hacia extractiva)
  if (culture.isNeoliberal) {
    score -= 0.3;
    blockers.push('Contexto neoliberal: tech subyugada a beneficio privado (Mumford)');
  }
  if (culture.isCapitalist) {
    score -= 0.2;
    blockers.push('Contexto capitalista: tech instrumentalizada (Mumford, Fisher)');
  }
  if (tech.currentUse.includes('militar') || tech.currentUse.includes('vigilancia') || tech.currentUse.includes('extractiv')) {
    score -= 0.25;
    blockers.push('Uso actual militar/vigilancia/extractivo (neoludismo: Glendinning)');
  }
  if (tech.currentUse.includes('monopolio') || tech.currentUse.includes('patente') || tech.currentUse.includes('propiedad intelectual')) {
    score -= 0.15;
    blockers.push('Monopolización/patentes: Globotech model (Small Soldiers)');
  }

  // Factores que aumentan flexibilidad (hacia liberadora)
  if (!culture.isCapitalist && !culture.isNeoliberal) {
    score += 0.3;
    enablers.push('Contexto no capitalista: tech puede orientarse a bien social (Mumford)');
  }
  if (culture.values.some(v => ['solidaridad', 'ayuda mutua', 'comunes', 'ecoanarquismo', 'bookchin', 'ciberfeminismo'].includes(v.toLowerCase()))) {
    score += 0.25;
    enablers.push('Valores alineados: solidaridad, comunes, ecoanarquismo, ciberfeminismo (Plant/Bookchin)');
  }
  if (tech.potentialUses.some(u => ['medicina', 'alimentación', 'energía renovable', 'educación', 'comunicación democrática', 'regeneración'].some(k => u.toLowerCase().includes(k)))) {
    score += 0.2;
    enablers.push('Usos potenciales liberadores: medicina, comida, energía, educación, comunicación (Bookchin)');
  }
  if (tech.potentialUses.some(u => ['código abierto', 'open source', 'comunes', 'creative commons', 'copyleft'].some(k => u.toLowerCase().includes(k)))) {
    score += 0.15;
    enablers.push('Licenciamiento abierto: apropiación no capitalista posible');
  }
  if (tech.description.includes('libera trabajo') || tech.description.includes('reduce alienación') || tech.description.includes('regenera')) {
    score += 0.2;
    enablers.push('Bookchin: tech liberadora del trabajo físico, al servicio de la vida');
  }

  // Clamp
  score = Math.max(0, Math.min(1, score));

  // Orientaciones recomendadas
  if (score > 0.6) {
    recommendedOrientations.push('Orientar a: medicina regenerativa, agroecología, energía comunitaria, educación abierta');
    recommendedOrientations.push('Modelo: ecoanarquismo (Bookchin) + ciberfeminismo red (Plant)');
  } else if (score > 0.4) {
    recommendedOrientations.push('Transición: licenciamiento abierto, gobernanza comunitaria, métricas de impacto ecológico');
  } else {
    recommendedOrientations.push('Bloqueo: auditoría neoludista requerida (Glendinning)');
    recommendedOrientations.push('Reorientación completa o moratoria');
  }

  return {
    score,
    canReorient: score > 0.3,
    blockers,
    enablers,
    recommendedOrientations,
  };
}

// ============================================================================
// DV-ILA-03: buildPAC
// ============================================================================

export function buildPAC(
  community: { name: string; members: string[]; values: string[]; context: string },
  values: string[],
  techOrientation?: Partial<TechOrientation>
): PAC {
  const now = Date.now();
  const pacId = `pac_${now}_${Math.random().toString(36).slice(2, 8)}`;

  // Construir "cómo" actuar para cada valor (indeterminación genética → PAC)
  const howToAct: Record<string, string> = {};
  for (const value of values) {
    howToAct[value] = generateHowToAct(value, community.context);
  }

  const orientation: TechOrientation = {
    flexibilityScore: techOrientation?.flexibilityScore ?? 0.7,
    servesLifeNotSurvival: techOrientation?.servesLifeNotSurvival ?? true,
    liberatesPhysicalLabor: techOrientation?.liberatesPhysicalLabor ?? true,
    regeneratesBiosphere: techOrientation?.regeneratesBiosphere ?? true,
    reducesAlienation: techOrientation?.reducesAlienation ?? true,
    cyberfeministNetworked: techOrientation?.cyberfeministNetworked ?? true,
    antiExtractive: techOrientation?.antiExtractive ?? true,
    culturalProgramAligned: techOrientation?.culturalProgramAligned ?? true,
  };

  // Calcular viabilidad
  const collectiveViability = calculateCollectiveViability(community, values, orientation);
  const ecosocialAlignment = calculateEcosocialAlignment(values, orientation);

  return {
    id: `pac_${now}_${Math.random().toString(36).slice(2, 8)}`,
    name: `PAC ${community.name}: ${values.slice(0, 3).join(', ')}`,
    community: community.name,
    values,
    howToAct,
    techOrientation: orientation,
    axiologicalStructure: generateAxiologicalStructure(community, values),
    collectiveViability,
    ecosocialAlignment,
    replacesNeoliberalPAC: true,
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

function generateHowToAct(value: string, context: string): string {
  const templates: Record<string, string> = {
    'solidaridad': `Practicar ayuda mutua (Malatesta) en ${context}: redes de apoyo material, emocional, técnico`,
    'autonomía': `Construir autonomía tecnológica (Bookchin): código abierto, hardware libre, soberanía energética/alimentaria`,
    'ecoanarquismo': `Regenerar biosfera en ${context}: permacultura, energía comunitaria, ciclos cerrados, tech ecológica (Bookchin)`,
    'ciberfeminismo': `Comunicación en red, no jerárquica (Plant): decisiones horizontales, código feminista, cuidados digitales`,
    'autogestión': `Autogestión real (Malatesta): asambleas, mandatos revocables, rotación cargos, transparencia radical`,
    'comunes': `Gestión de comunes (Ostrom/Bollier): reglas claras, monitoreo, sanciones graduadas, resolución conflictos`,
    'soberanía tecnológica': `Soberanía tech: hardware libre (RISC-V), software libre, datos propios, infraestructura comunitaria`,
    'regeneración': `Regeneración activa: agroforestería, energía distribuida, ciclos nutrientes, tech al servicio de la vida (Bookchin)`,
    'anti-aceleracionismo': `Reapropiación de "lo nuevo" (Bobadilla/Soler): innovación controlada, centrada en lo humano, no en lo incontrolable (Land)`,
    'tecnomutante': `Identidad híbrida asumida: implantes elegidos, soberanía datos biológicos, resistencia vigilancia algorítmica`,
  };
  return templates[value.toLowerCase()] || `Definir colectivamente el "cómo" para ${value} en ${context} (Corbí: PAC completa indeterminación genética)`;
}

function generateAxiologicalStructure(community: { name: string; context: string }, values: string[]): string {
  return `PAC ${community.name} — Estructura axiológica para ${community.context}:
Valores fundantes: ${values.join(' > ')}
Proyecto colectivo: Construir ${community.context} donde la tecnociencia sirva a la vida (Bookchin), 
la comunicación sea en red y democrática (Plant), la identidad sea fluida/hibrida (tecnomutante),
y la gobernanza sea auto-gestionada con mandatos revocables (Malatesta).
Este PAC reemplaza el PAC neoliberal de competencia, extracción, jerarquía y alienación.`;
}

function calculateCollectiveViability(
  community: { members: string[]; context: string },
  values: string[],
  orientation: TechOrientation
): number {
  let score = 50; // Base
  score += Math.min(20, community.members.length * 2); // Tamaño comunidad
  score += values.length * 5; // Coherencia valorativa
  if (orientation.servesLifeNotSurvival) score += 10;
  if (orientation.liberatesPhysicalLabor) score += 10;
  if (orientation.regeneratesBiosphere) score += 10;
  if (orientation.cyberfeministNetworked) score += 5;
  if (orientation.antiExtractive) score += 5;
  return Math.min(100, score);
}

function calculateEcosocialAlignment(values: string[], orientation: TechOrientation): number {
  const ecoValues = ['ecoanarquismo', 'regeneración', 'comunes', 'soberanía alimentaria', 'energía comunitaria', 'permacultura'];
  const socialValues = ['solidaridad', 'autogestión', 'ayuda mutua', 'ciberfeminismo', 'autonomía', 'justicia cognitiva'];
  let score = 0;
  for (const v of values) {
    if (ecoValues.includes(v.toLowerCase())) score += 10;
    if (socialValues.includes(v.toLowerCase())) score += 10;
  }
  if (orientation.regeneratesBiosphere) score += 15;
  if (orientation.reducesAlienation) score += 10;
  if (orientation.cyberfeministNetworked) score += 10;
  return Math.min(100, score);
}

// ============================================================================
// DV-ILA-04: simulateAntiAcceleration
// ============================================================================

export function simulateAntiAcceleration(
  futureScenario: {
    name: string;
    description: string;
    techAdvances: string[];
    socialChanges: string[];
    economicModel: string;
  }
): {
  landianTrajectory: { description: string; probability: number; keyRisks: string[] };
  antiAccelerationTrajectory: { description: string; probability: number; keyStrategies: string[] };
  divergencePoint: string;
  divergenceScore: number; // -100 (landiano) a 100 (anti-aceleracionismo)
  recommendation: string;
} {
  // Análisis landiano: tech advances sin control cultural → capitalismo supera humano
  const landianRisk = futureScenario.techAdvances.length > 3 &&
    futureScenario.economicModel.toLowerCase().includes('capitalist') ? 0.8 : 0.4;

  const landianTrajectory = {
    description: `Trayectoria Land/CCRU: ${futureScenario.techAdvances.join(', ')} sin programación cultural → capitalismo supera humano (Land), postcapitalismo vía lo inhumano, plasticidad infinita sin anclaje humano.`,
    probability: landianRisk,
    keyRisks: [
      'Tecnociencia sin PAC → subyugación capitalista (Mumford)',
      'Identidad fluida sin soberanía → tecnomutantes explotados',
      'Comunicación lineal/ jerárquica (Plant) → control algorítmico',
      'Aceleración sin freno cultural → colapso ecosistémico',
    ],
  };

  // Trayectoria anti-aceleracionista: reapropiación cultural de "lo nuevo"
  const antiAccelerationStrength = 0.6 + (Math.random() * 0.3); // Base fuerte

  const antiAccelerationTrajectory = {
    description: `Trayectoria Anti-Aceleracionismo (Bobadilla/Soler): Reapropiación cultural de ${futureScenario.techAdvances.join(', ')} via PAC comunitario. Tech programada por valores: solidaridad, ecoanarquismo, ciberfeminismo. "Lo nuevo" puesto al servicio de lo humano.`,
    probability: antiAccelerationStrength,
    keyStrategies: [
      'Construir PAC (Corbí) que oriente cada avance tecnológico',
      'Comunicación en red, feminista, democrática (Plant/Bañón)',
      'Tech al servicio de la vida, no supervivencia (Bookchin)',
      'Identidad híbrida soberana: implantes elegidos, datos propios',
      'Gobernanza auto-gestionada: mandatos revocables, asambleas',
      'Auditoría neoludista continua (Glendinning) de cada despliegue',
    ],
  };

  // Punto de divergencia
  const divergencePoint = `Punto de divergencia: ¿Quién programa la cultura que orienta ${futureScenario.techAdvances[0]}? 
  - Land: El capital/mercado programa (inevitabilidad)
  - Anti-aceleracionismo: La comunidad via PAC programa (autonomía cultural)`;

  const divergenceScore = Math.round((antiAccelerationStrength - landianRisk) * 100);

  return {
    landianTrajectory,
    antiAccelerationTrajectory,
    divergencePoint,
    divergenceScore,
    recommendation: divergenceScore > 0
      ? 'Invertir en construcción de PAC comunitario y soberanía tecnológica ANTES de desplegar tech avanzada'
      : 'ALERTA: Contexto favorece trayectoria landiana. Requerido: construcción urgente de PAC + auditoría neoludista',
  };
}

// ============================================================================
// DV-ILA-05: assessEcoAnarchistTech
// ============================================================================

export function assessEcoAnarchistTech(tech: {
  name: string;
  description: string;
  purpose: string;
  controlStructure: 'corporate' | 'state' | 'community' | 'commons' | 'open-source';
  liberatesLabor: boolean;
  ecologicalImpact: 'regenerative' | 'neutral' | 'degenerative' | 'unknown';
  democraticGovernance: boolean;
  accessModel: 'proprietary' | 'freemium' | 'open-access' | 'commons-based';
}): EcoAnarchistTech {
  const techId = `tech_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const now = Date.now();

  // Evaluación Bookchin
  const liberatesPhysicalLabor = tech.liberatesLabor;
  const servesLifeNotSurvival = tech.purpose.includes('vida') || tech.purpose.includes('bienestar') || tech.purpose.includes('calidad');
  const regeneratesBiosphere = tech.ecologicalImpact === 'regenerative';
  const reducesAlienation = tech.controlStructure === 'community' || tech.controlStructure === 'commons';
  const democraticControl = tech.democraticGovernance;
  const communityOwned = tech.controlStructure === 'community' || tech.controlStructure === 'commons';
  const antiAuthoritarian = tech.controlStructure !== 'corporate' && tech.controlStructure !== 'state';

  // Huella ecológica inversa (menor = mejor)
  let ecologicalFootprint = 50;
  if (tech.ecologicalImpact === 'regenerative') ecologicalFootprint = 10;
  else if (tech.ecologicalImpact === 'neutral') ecologicalFootprint = 40;
  else if (tech.ecologicalImpact === 'degenerative') ecologicalFootprint = 80;

  // Clasificación
  let assessment: EcoAnarchistTech['assessment'];
  if (liberatesPhysicalLabor && regeneratesBiosphere && democraticControl && communityOwned) {
    assessment = 'liberadora';
  } else if (!liberatesPhysicalLabor && tech.ecologicalImpact === 'degenerative' && tech.controlStructure === 'corporate') {
    assessment = 'extractiva';
  } else if (liberatesPhysicalLabor || regeneratesBiosphere || democraticControl) {
    assessment = 'mixta';
  } else {
    assessment = 'neutra';
  }

  return {
    techId,
    name: tech.name,
    category: categorizeTech(tech.name, tech.description),
    liberatesPhysicalLabor,
    regeneratesBiosphere,
    reducesAlienation,
    servesLifeNotSurvival,
    ecologicalFootprint,
    democraticControl,
    antiAuthoritarian,
    communityOwned,
    assessedAt: now,
    assessment,
  };
}

function categorizeTech(name: string, description: string): EcoAnarchistTech['category'] {
  const lower = (name + ' ' + description).toLowerCase();
  if (lower.includes('energ') || lower.includes('solar') || lower.includes('eólic') || lower.includes('batería') || lower.includes('microgrid')) return 'energy';
  if (lower.includes('aliment') || lower.includes('agro') || lower.includes('permacu') || lower.includes('hidropón') || lower.includes('carne') || lower.includes('proteín')) return 'food';
  if (lower.includes('fabric') || lower.includes('manufact') || lower.includes('impresi') || lower.includes('hardware') || lower.includes('risc-v')) return 'manufacturing';
  if (lower.includes('comunic') || lower.includes('red') || lower.includes('internet') || lower.includes('mesh') || lower.includes('p2p')) return 'communication';
  if (lower.includes('transport') || lower.includes('movil') || lower.includes('bici') || lower.includes('vehícul')) return 'transport';
  if (lower.includes('salud') || lower.includes('médic') || lower.includes('implante') || lower.includes('prótesis') || lower.includes('bio')) return 'health';
  if (lower.includes('educ') || lower.includes('aprend') || lower.includes('curso') || lower.includes('plataforma')) return 'education';
  return 'other';
}

// ============================================================================
// DV-ILA-06: verifyHumanHybridIdentity
// ============================================================================

export function verifyHumanHybridIdentity(agent: {
  agentId: string;
  carbonTraits: string[];
  siliconTraits: string[];
  mandatoryImplants: string[];
  chosenAugmentations: string[];
  surveillanceExposure: number;
  pohVerification?: { verified: boolean; type: string; score: number };
}): HumanHybridIdentity {
  const carbonPercentage = Math.max(0, 100 - agent.siliconTraits.length * 10 - agent.mandatoryImplants.length * 5);
  const siliconPercentage = 100 - carbonPercentage;

  const autonomyScore = Math.max(0, 100 - agent.surveillanceExposure - agent.mandatoryImplants.length * 10);
  const resistanceToCapitalistRealism = agent.chosenAugmentations.length * 10 + (agent.carbonTraits.includes('critical_thinking') ? 20 : 0);

  return {
    agentId: agent.agentId,
    identityType: carbonPercentage > 70 ? 'carbon' : siliconPercentage > 50 ? 'silicon' : siliconPercentage > 30 ? 'hybrid' : 'tecnomutant',
    carbonPercentage,
    siliconPercentage,
    mandatoryImplants: agent.mandatoryImplants,
    chosenAugmentations: agent.chosenAugmentations,
    surveillanceExposure: agent.surveillanceExposure,
    autonomyScore,
    resistanceToCapitalistRealism: Math.min(100, resistanceToCapitalistRealism),
    pohVerification: {
      verified: agent.pohVerification?.verified ?? false,
      verificationType: agent.pohVerification?.type ?? 'hybrid',
      humanityScore: agent.pohVerification?.score ?? Math.round((carbonPercentage + autonomyScore) / 2),
    },
    lastUpdated: Date.now(),
  };
}

// ============================================================================
// DV-ILA-07: extractPostcapitalistDesire
// ============================================================================

export function extractPostcapitalistDesire(
  artifact: {
    id: string;
    type: 'film' | 'series' | 'book' | 'game' | 'toy' | 'meme' | 'other';
    title: string;
    year: number;
    creators: string[];
    description: string;
    themes: string[];
  }
): PostcapitalistDesire {
  // Buscar en base de conocimiento
  const known = KNOWN_CULTURAL_ARTIFACTS[artifact.id.toLowerCase().replace(/[^a-z0-9]/g, '-')];
  if (known) return known;

  // Análisis heurístico
  const lowerDesc = artifact.description.toLowerCase();
  const lowerThemes = artifact.themes.map(t => t.toLowerCase());

  const hiddenDesires: string[] = [];
  let capitalistRealismSubverted = false;
  let bodyTechBoundaryExplored = false;
  let empathyAsResistance = false;
  let monopolyCritique = false;
  let posthumanConditioning = false;
  let culturalProgrammingVisible = false;

  // Detección de temas
  if (lowerThemes.some(t => t.includes('cuerpo') || t.includes('tech') || t.includes('híbrid') || t.includes('cyborg') || t.includes('implante'))) {
    bodyTechBoundaryExplored = true;
    hiddenDesires.push('Exploración frontera cuerpo-tecnología');
  }
  if (lowerThemes.some(t => t.includes('empati') || t.includes('replicant') || t.includes('androide') || t.includes('sintétic'))) {
    empathyAsResistance = true;
    hiddenDesires.push('Empatía como resistencia/frontera (Blade Runner)');
  }
  if (lowerThemes.some(t => t.includes('monopol') || t.includes('corporación') || t.includes('globotech') || t.includes('megacorp'))) {
    monopolyCritique = true;
    hiddenDesires.push('Crítica monopolio tech/corporativo (Small Soldiers)');
  }
  if (lowerThemes.some(t => t.includes('posthuman') || t.includes('transhuman') || t.includes('post-human') || t.includes('mejora human'))) {
    posthumanConditioning = true;
    hiddenDesires.push('Condicionamiento posthumano/transhumanista visible');
  }
  if (lowerDesc.includes('capitalismo') || lowerDesc.includes('neoliberal') || lowerDesc.includes('mercado') || lowerDesc.includes('realismo capitalista')) {
    capitalistRealismSubverted = true;
    hiddenDesires.push('Subversión realismo capitalista (Fisher)');
  }
  if (lowerDesc.includes('programa cultural') || lowerDesc.includes('cultura') || lowerDesc.includes('ideolog') || lowerDesc.includes('valores')) {
    culturalProgrammingVisible = true;
    hiddenDesires.push('Programación cultural de la tecnología visible (Mumford/Ortega)');
  }
  if (lowerDesc.includes('deseo') || lowerDesc.includes('anhelo') || lowerDesc.includes('anhela')) {
    hiddenDesires.push('Deseo postcapitalista latente detectado en narrativa');
  }

  // Potencial de extracción para PAC
  let extractionPotential = 0;
  extractionPotential += bodyTechBoundaryExplored ? 20 : 0;
  extractionPotential += empathyAsResistance ? 15 : 0;
  extractionPotential += monopolyCritique ? 15 : 0;
  extractionPotential += posthumanConditioning ? 10 : 0;
  extractionPotential += capitalistRealismSubverted ? 20 : 0;
  extractionPotential += culturalProgrammingVisible ? 10 : 0;
  extractionPotential += artifact.themes.length * 2;

  return {
    artifactId: artifact.id,
    artifactType: artifact.type,
    title: artifact.title,
    year: artifact.year,
    creators: artifact.creators,
    hiddenDesires,
    capitalistRealismSubverted,
    bodyTechBoundaryExplored,
    empathyAsResistance,
    monopolyCritique,
    posthumanConditioning,
    culturalProgrammingVisible,
    extractionPotential: Math.min(100, extractionPotential),
    analyzedAt: Date.now(),
  };
}

// ============================================================================
// DV-ILA-08: auditNeoludditeTrigger
// ============================================================================

export function auditNeoludditeTrigger(deployment: {
  techDeploymentId: string;
  techName: string;
  description: string;
  context: 'neoliberal' | 'cooperative' | 'public' | 'commons' | 'military';
  controlStructure: string;
  purpose: string;
  ecologicalImpact: string;
  criticalVoicesAllowed: boolean;
}): NeoludditeAudit {
  const now = Date.now();

  // Evaluación criterios Glendinning
  let destructivePower = 50;
  if (deployment.context === 'military') destructivePower += 30;
  if (deployment.context === 'neoliberal') destructivePower += 20;
  if (deployment.ecologicalImpact.includes('degenerative') || deployment.ecologicalImpact.includes('negativo')) destructivePower += 25;
  if (deployment.controlStructure.includes('corporate') || deployment.controlStructure.includes('propietario')) destructivePower += 15;

  const criticalVoiceSuppressed = !deployment.criticalVoicesAllowed;
  const appropriationNonCapitalist = deployment.context === 'cooperative' || deployment.context === 'commons';
  const criticalAuditTriggered = destructivePower > 70 || criticalVoiceSuppressed;

  // Clasificación
  let classification: NeoludditeAudit['classification'];
  if (destructivePower > 80 && deployment.context === 'neoliberal') classification = 'peligrosa';
  else if (destructivePower > 60 && deployment.context === 'neoliberal') classification = 'extractiva';
  else if (appropriationNonCapitalist && deployment.criticalVoicesAllowed) classification = 'liberadora';
  else classification = 'ambigua';

  const recommendations: string[] = [];
  if (destructivePower > 70) recommendations.push('MORATORIA INMEDIATA: Poder destructivo inaceptable (Glendinning)');
  if (criticalVoiceSuppressed) recommendations.push('Garantizar voces críticas independientes (neoludismo)');
  if (!appropriationNonCapitalist) recommendations.push('Requerir apropiación no capitalista: código abierto, gobernanza comunitaria, licencias copyfarleft');
  if (deployment.context === 'military') recommendations.push('Separación estricta tech militar/civil; conversión a usos civiles liberadores (Bookchin)');
  if (deployment.controlStructure.includes('corporate')) recommendations.push('Transición a propiedad comunitaria/commons; licencias copyfarleft/peer production');

  return {
    auditId: `audit_${now}_${Math.random().toString(36).slice(2, 8)}`,
    techDeploymentId: deployment.techDeploymentId,
    techName: deployment.techName,
    deploymentContext: deployment.context,
    destructivePower: Math.min(100, destructivePower),
    criticalVoiceSuppressed,
    appropriationNonCapitalist,
    criticalAuditTriggered,
    classification,
    recommendations,
    auditedAt: now,
    auditor: 'ilargiakaos-neoluddite-engine',
  };
}

// ============================================================================
// DV-ILA-09: measureCyberfeministComms
// ============================================================================

export function measureCyberfeministComms(network: {
  networkId: string;
  networkName: string;
  topology: 'hierarchical' | 'flat' | 'mesh' | 'federated' | 'hybrid';
  decisionMaking: 'top-down' | 'consensus' | 'consent' | 'voting' | 'algorithmic';
  participationRate: number; // 0-100
  feministModeration: boolean;
  patriarchalPatterns: string[]; // ej: 'mansplaining', 'interrupción', 'apropiación crédito'
  neoliberalMetrics: boolean; // KPIs de engagement, growth, retention vs cuidado
}): CyberfeministComms {
  // Plant: lineal (masculina, jerárquica) vs red (femenina, democrática)
  let linearCommunicationScore = 50;
  let networkedCommunicationScore = 50;

  // Topología
  if (network.topology === 'hierarchical') linearCommunicationScore += 30;
  if (network.topology === 'flat' || network.topology === 'mesh') networkedCommunicationScore += 25;
  if (network.topology === 'federated') networkedCommunicationScore += 15;

  // Toma de decisiones
  if (network.decisionMaking === 'top-down') linearCommunicationScore += 25;
  if (network.decisionMaking === 'consensus' || network.decisionMaking === 'consent') networkedCommunicationScore += 25;
  if (network.decisionMaking === 'algorithmic') linearCommunicationScore += 20; // Algoritmos = jerarquía opaca

  // Participación
  networkedCommunicationScore += Math.min(20, network.participationRate / 5);

  // Moderación feminista
  if (network.feministModeration) networkedCommunicationScore += 15;
  else linearCommunicationScore += 10;

  // Patrones patriarcales
  linearCommunicationScore += Math.min(20, network.patriarchalPatterns.length * 5);

  // Métricas neoliberales
  if (network.neoliberalMetrics) linearCommunicationScore += 15;
  else networkedCommunicationScore += 10;

  // Normalizar
  linearCommunicationScore = Math.min(100, linearCommunicationScore);
  networkedCommunicationScore = Math.min(100, networkedCommunicationScore);

  const hierarchicalDepth = network.topology === 'hierarchical' ? 4 : network.topology === 'federated' ? 2 : 1;
  const feministParticipationRate = network.participationRate;
  const patriarchyResistance = Math.max(0, 100 - linearCommunicationScore);
  const neoliberalResistance = network.neoliberalMetrics ? 30 : 80;

  return {
    networkId: network.networkId,
    networkName: network.networkName,
    linearCommunicationScore,
    networkedCommunicationScore,
    hierarchicalDepth,
    feministParticipationRate,
    patriarchyResistance,
    neoliberalResistance,
    assessedAt: Date.now(),
  };
}

// ============================================================================
// DV-ILA-10: simulatePostApocalypticDayAfter
// ============================================================================

export function simulatePostApocalypticDayAfter(scenario: {
  scenarioId: string;
  scenarioName: string;
  triggerEvent: 'nuclear' | 'pandemic' | 'climate' | 'meteor' | 'war' | 'zombie' | 'economic_collapse';
  initialPopulation: number;
  availableTech: string[];
  socialCohesion: number; // 0-100
  ecologicalDamage: number; // 0-100
}): PostApocalypticGovernance {
  // Malatesta: "día después de la revolución" — no fin, sino inicio
  // Bookchin: ecoanarquismo, tech liberadora, municipalismo libertario

  const mutualAidNetworks = scenario.socialCohesion > 40;
  const horizontalDecisionMaking = scenario.socialCohesion > 50 && scenario.availableTech.some(t => t.includes('comunic') || t.includes('mesh') || t.includes('p2p'));
  const resourceCommons = scenario.availableTech.some(t => t.includes('comunes') || t.includes('cooperativ') || t.includes('autogestión'));
  const technologyReappropriated = scenario.availableTech.some(t => t.includes('código abierto') || t.includes('open source') || t.includes('hardware libre') || t.includes('apropiación'));
  const ecologicalRegeneration = scenario.ecologicalDamage < 70 && scenario.availableTech.some(t => t.includes('regenera') || t.includes('permacult') || t.includes('agroecolog') || t.includes('ecoanarquismo'));
  const solidarityOverCompetition = scenario.socialCohesion > 45;

  // Viabilidad
  let viabilityScore = 0;
  if (mutualAidNetworks) viabilityScore += 20;
  if (horizontalDecisionMaking) viabilityScore += 20;
  if (resourceCommons) viabilityScore += 15;
  if (technologyReappropriated) viabilityScore += 15;
  if (ecologicalRegeneration) viabilityScore += 15;
  if (solidarityOverCompetition) viabilityScore += 15;

  // Alineación Bookchin
  let bookchinAlignment = 0;
  if (technologyReappropriated) bookchinAlignment += 25; // Tech liberadora
  if (ecologicalRegeneration) bookchinAlignment += 25; // Ecología profunda
  if (horizontalDecisionMaking) bookchinAlignment += 25; // Municipalismo libertario
  if (resourceCommons) bookchinAlignment += 25; // Comunes

  return {
    scenarioId: scenario.scenarioId,
    scenarioName: scenario.scenarioName,
    triggerEvent: scenario.triggerEvent,
    mutualAidNetworks,
    horizontalDecisionMaking,
    resourceCommons,
    technologyReappropriated,
    ecologicalRegeneration,
    solidarityOverCompetition,
    viabilityScore: Math.min(100, viabilityScore),
    bookchinAlignment: Math.min(100, bookchinAlignment),
    assessedAt: Date.now(),
  };
}

// ============================================================================
// FUNCIONES AUXILIARES Y ESTADO INICIAL
// ============================================================================

export function createInitialIlargiakaosState(): IlargiakaosState {
  const now = Date.now();
  return {
    activePAC: null,
    pacHistory: [],
    capitalistRealism: {
      atmosphereDetected: false,
      noAlternativeBelief: 0,
      cultureProductionConditioned: false,
      workRegulationInternalized: false,
      educationRegulationInternalized: false,
      genuineThoughtBlocked: false,
      consciousnessRetreated: false,
      malaiseIndividualized: false,
      detectionPatterns: [],
      severity: 'low',
      lastScan: now,
    },
    realismScans: [],
    agentIdentities: {},
    extractedDesires: [],
    accelerationismAnalysis: {
      landianAccelerationism: {
        detected: false,
        capitalismSurpassesHuman: false,
        postcapitalismViaInhuman: false,
        uncontrolledBecoming: false,
        infinitePlasticity: false,
      },
      antiAccelerationism: {
        reapropriationOfNew: true,
        humanCentricFuture: true,
        controlledInnovation: true,
        culturalProgrammingOfTech: true,
      },
      divergenceScore: 0,
      lastAnalysis: now,
    },
    assessedTechnologies: {},
    neoludditeAudits: [],
    commsAnalyses: {},
    postApocalypticModels: {},
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

// Re-export types for convenience
export type {
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
  IlargiakaosState,
} from '@core/lib/ilargiakaos-types';