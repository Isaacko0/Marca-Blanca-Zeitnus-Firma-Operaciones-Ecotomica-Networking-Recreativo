// offer-designer.ts — Lógica pura anfibia para Offfer Designer (8 niveles)
// Principio Anfibio: misma lógica opera en modo 'postmonetario' (ZNU/CaaS) o 'conectado' (USD/USDC vía priceParity)

export type OfferMode = 'postmonetario' | 'conectado';

export interface PriceParityOracle {
  znuPerUsd: number;           // 1 USD = X ZNU (actualizable vía oráculo ReFi Nivel 3)
  lastUpdated: number;         // timestamp ms
  source: 'local' | 'oracle';
}

export interface OfferLevelConfig {
  id: string;
  order: number;
  title: { es: string; en: string; pt: string };
  description: { es: string; en: string; pt: string };
  requiredFields: string[];           // claves de campos obligatorios
  optionalFields: string[];           // claves de campos opcionales
  heuristics: HeuristicRule[];        // reglas para calcular calidad (+5 c/u)
  minChars?: Record<string, number>;  // longitud mínima por campo
  dependsOn?: string[];               // niveles previos requeridos
}

export interface HeuristicRule {
  field: string;
  type: 'length' | 'specificity' | 'evidence' | 'structure' | 'differentiation';
  minThreshold: number;
  maxPoints: number;                  // máx 5 pts por heurística
  evaluator: (value: string, allData: Record<string, string>) => number; // 0-1
}

export interface OfferData {
  version: number;
  mode: OfferMode;
  priceParity?: PriceParityOracle;
  power: number;                      // 0-100
  currentLevel: string;
  completedLevels: string[];
  levels: Record<string, LevelData>;
  timestamps: Record<string, number>;
  exportHistory: ExportRecord[];
  achievements: string[];
  metadata: {
    createdAt: number;
    updatedAt: number;
    source: 'offerDesigner-v1' | 'hscsg-native' | 'imported';
    language: 'es' | 'en' | 'pt';
  };
}

export interface LevelData {
  fields: Record<string, string>;     // campo -> valor
  completed: boolean;
  powerContribution: number;          // 0-100 (aporte de este nivel al power total)
  qualityScore: number;               // 0-100 (calidad heurística)
  lastEdited: number;
}

export interface ExportRecord {
  timestamp: number;
  power: number;
  text: string;
  mode: OfferMode;
}

export interface PowerBreakdown {
  total: number;
  byLevel: Record<string, { required: number; heuristics: number; total: number }>;
  thresholds: { draft: number; progress: number; solid: number; ready: number };
  label: 'draft' | 'progress' | 'solid' | 'ready';
}

export interface EvaluationResult {
  scores: {
    clarity: number;      // 0-100
    desire: number;       // 0-100
    proof: number;        // 0-100
    urgency: number;      // 0-100
  };
  overall: number;        // promedio ponderado
  feedback: {
    clarity: string[];
    desire: string[];
    proof: string[];
    urgency: string[];
    priority: string[];   // top 3 acciones recomendadas
  };
  evaluatedAt: number;
  mode: OfferMode;
}

// ============================================================================
// CONFIGURACIÓN DE LOS 8 NIVELES
// ============================================================================

export const OFFER_LEVELS: OfferLevelConfig[] = [
  {
    id: 'base',
    order: 1,
    title: { es: 'Base', en: 'Foundation', pt: 'Base' },
    description: {
      es: 'Fundación de tu oferta: qué vendes, formato y promesa núcleo',
      en: 'Foundation of your offer: what you sell, format and core promise',
      pt: 'Fundação da sua oferta: o que vende, formato e promessa central'
    },
    requiredFields: ['whatYouSell', 'format', 'corePromise'],
    optionalFields: ['targetMarket', 'uniqueMechanism'],
    dependsOn: [],
    minChars: { whatYouSell: 20, format: 10, corePromise: 30 },
    heuristics: [
      { field: 'whatYouSell', type: 'specificity', minThreshold: 50, maxPoints: 5,
        evaluator: (v) => Math.min(1, v.length / 200) * (v.split(' ').length > 10 ? 1 : 0.6) },
      { field: 'corePromise', type: 'differentiation', minThreshold: 50, maxPoints: 5,
        evaluator: (v) => /(único|exclusivo|primero|solo|diferente|revolucionario|nuevo)/i.test(v) ? 1 : 0.4 },
      { field: 'format', type: 'structure', minThreshold: 30, maxPoints: 5,
        evaluator: (v) => /(curso|programa|mentoría|consultoría|servicio|producto|comunidad|app|software)/i.test(v) ? 1 : 0.5 }
    ]
  },
  {
    id: 'soulmate',
    order: 2,
    title: { es: 'Soulmate', en: 'Soulmate', pt: 'Alma Gêmea' },
    description: {
      es: 'Tu cliente ideal: quién es, su dolor, deseo y objeciones',
      en: 'Your ideal client: who they are, their pain, desire and objections',
      pt: 'Seu cliente ideal: quem é, sua dor, desejo e objeções'
    },
    requiredFields: ['who', 'pain', 'desire', 'objections'],
    optionalFields: ['demographics', 'psychographics', 'currentSolutions'],
    dependsOn: ['base'],
    minChars: { who: 30, pain: 30, desire: 30, objections: 20 },
    heuristics: [
      { field: 'who', type: 'specificity', minThreshold: 50, maxPoints: 5,
        evaluator: (v) => Math.min(1, v.length / 300) * (v.includes('años') || v.includes('years') ? 1 : 0.7) },
      { field: 'pain', type: 'evidence', minThreshold: 60, maxPoints: 5,
        evaluator: (v) => /(frustra|agota|pierde|gasta|no logra|estancado|miedo|ansiedad)/i.test(v) ? 1 : 0.4 },
      { field: 'desire', type: 'differentiation', minThreshold: 50, maxPoints: 5,
        evaluator: (v) => /(lograr|conseguir|transformar|libertad|tiempo|dinero|paz|crecer)/i.test(v) ? 1 : 0.5 },
      { field: 'objections', type: 'structure', minThreshold: 30, maxPoints: 5,
        evaluator: (v) => v.split(/[,.]/).filter(s => s.trim().length > 10).length >= 3 ? 1 : 0.4 }
    ]
  },
  {
    id: 'promesa',
    order: 3,
    title: { es: 'Promesa', en: 'Promise', pt: 'Promessa' },
    description: {
      es: 'Transformación prometida: antes/después, prueba y timeline',
      en: 'Promised transformation: before/after, proof and timeline',
      pt: 'Transformação prometida: antes/depois, prova e cronograma'
    },
    requiredFields: ['beforeState', 'afterState', 'proof', 'timeline'],
    optionalFields: ['milestones', 'measurements', 'guarantee'],
    dependsOn: ['base', 'soulmate'],
    minChars: { beforeState: 30, afterState: 30, proof: 40, timeline: 20 },
    heuristics: [
      { field: 'beforeState', type: 'evidence', minThreshold: 50, maxPoints: 5,
        evaluator: (v) => /(estaba|tenía|sufría|luchaba|perdía|frustrado)/i.test(v) ? 1 : 0.5 },
      { field: 'afterState', type: 'differentiation', minThreshold: 50, maxPoints: 5,
        evaluator: (v) => /(ahora|logró|consiguió|transformó|libre|gana|disfruta|escala)/i.test(v) ? 1 : 0.5 },
      { field: 'proof', type: 'evidence', minThreshold: 70, maxPoints: 5,
        evaluator: (v) => /(caso|testimonio|resultado|métrica|dato|número|%\$|antes|después)/i.test(v) ? 1 : 0.3 },
      { field: 'timeline', type: 'structure', minThreshold: 20, maxPoints: 5,
        evaluator: (v) => /(día|semana|mes|año|30|60|90|120)/i.test(v) ? 1 : 0.4 }
    ]
  },
  {
    id: 'valor',
    order: 4,
    title: { es: 'Valor', en: 'Value', pt: 'Valor' },
    description: {
      es: 'Entregables: módulos, bonos, formato, soporte y experiencia',
      en: 'Deliverables: modules, bonuses, format, support and experience',
      pt: 'Entregáveis: módulos, bônus, formato, suporte e experiência'
    },
    requiredFields: ['modules', 'format', 'support', 'experience'],
    optionalFields: ['bonuses', 'community', 'tools', 'templates'],
    dependsOn: ['base', 'soulmate', 'promesa'],
    minChars: { modules: 50, format: 20, support: 30, experience: 30 },
    heuristics: [
      { field: 'modules', type: 'structure', minThreshold: 80, maxPoints: 5,
        evaluator: (v) => v.split(/\n|;/).filter(s => s.trim().length > 5).length >= 4 ? 1 : 0.4 },
      { field: 'support', type: 'specificity', minThreshold: 50, maxPoints: 5,
        evaluator: (v) => /(semanal|quincenal|mensual|directo|grupal|individual|acceso|respuesta|24h|48h)/i.test(v) ? 1 : 0.5 },
      { field: 'experience', type: 'differentiation', minThreshold: 40, maxPoints: 5,
        evaluator: (v) => /(comunidad|networking|evento|retiro|mastermind|certificación|acceso vitalicio)/i.test(v) ? 1 : 0.5 }
    ]
  },
  {
    id: 'bonos',
    order: 5,
    title: { es: 'Bonos', en: 'Bonuses', pt: 'Bônus' },
    description: {
      es: 'Stack de bonos: urgencia, escasez, complementariedad',
      en: 'Bonus stack: urgency, scarcity, complementarity',
      pt: 'Stack de bônus: urgência, escassez, complementaridade'
    },
    requiredFields: ['bonusList', 'urgency', 'scarcity'],
    optionalFields: ['stackOrder', 'bonusValue', 'expiration'],
    dependsOn: ['base', 'soulmate', 'promesa', 'valor'],
    minChars: { bonusList: 60, urgency: 20, scarcity: 20 },
    heuristics: [
      { field: 'bonusList', type: 'structure', minThreshold: 80, maxPoints: 5,
        evaluator: (v) => v.split(/\n|;/).filter(s => s.trim().length > 10).length >= 3 ? 1 : 0.4 },
      { field: 'urgency', type: 'differentiation', minThreshold: 30, maxPoints: 5,
        evaluator: (v) => /(solo|limitado|primeros|expira|hoy|ahora|cupo|plazas)/i.test(v) ? 1 : 0.4 },
      { field: 'scarcity', type: 'evidence', minThreshold: 30, maxPoints: 5,
        evaluator: (v) => /(\d+\s*(personas|cupos|plazas|días|horas)|restan|quedan|últim)/i.test(v) ? 1 : 0.4 }
    ]
  },
  {
    id: 'precio',
    order: 6,
    title: { es: 'Precio', en: 'Price', pt: 'Preço' },
    description: {
      es: 'Estructura de precios: base, planes, garantía, formas de pago',
      en: 'Price structure: base, plans, guarantee, payment methods',
      pt: 'Estrutura de preços: base, planos, garantia, formas de pagamento'
    },
    requiredFields: ['basePrice', 'pricingModel', 'guarantee', 'paymentOptions'],
    optionalFields: ['discounts', 'paymentPlans', 'earlyBird', 'vipTier'],
    dependsOn: ['base', 'soulmate', 'promesa', 'valor', 'bonos'],
    minChars: { basePrice: 10, pricingModel: 20, guarantee: 30, paymentOptions: 20 },
    heuristics: [
      { field: 'basePrice', type: 'specificity', minThreshold: 10, maxPoints: 5,
        evaluator: (v) => /^\d+(\.\d+)?\s*(USD|EUR|ZNU|USDC|ARS|MXN|COP|BRL)?/i.test(v) ? 1 : 0.5 },
      { field: 'guarantee', type: 'evidence', minThreshold: 50, maxPoints: 5,
        evaluator: (v) => /(garantía|garantia|devolución|reembolso|riesgo|confía|prueba|días)/i.test(v) ? 1 : 0.4 },
      { field: 'paymentOptions', type: 'structure', minThreshold: 30, maxPoints: 5,
        evaluator: (v) => /(tarjeta|transferencia|paypal|stripe|cuotas|mensual|trimestral|anual|cripto|usdc)/i.test(v) ? 1 : 0.5 }
    ]
  },
  {
    id: 'blindaje',
    order: 7,
    title: { es: 'Blindaje', en: 'Bulletproof', pt: 'Blindagem' },
    description: {
      es: 'Objecciones: FAQ, garantías, prueba social, reversión de riesgo',
      en: 'Objections: FAQ, guarantees, social proof, risk reversal',
      pt: 'Objeções: FAQ, garantias, prova social, reversão de risco'
    },
    requiredFields: ['faqs', 'riskReversal', 'socialProof', 'objectionHandling'],
    optionalFields: ['caseStudies', 'demoVideo', 'trialPeriod'],
    dependsOn: ['base', 'soulmate', 'promesa', 'valor', 'bonos', 'precio'],
    minChars: { faqs: 80, riskReversal: 40, socialProof: 40, objectionHandling: 50 },
    heuristics: [
      { field: 'faqs', type: 'structure', minThreshold: 100, maxPoints: 5,
        evaluator: (v) => v.split(/\?/).filter(s => s.trim().length > 15).length >= 5 ? 1 : 0.4 },
      { field: 'riskReversal', type: 'differentiation', minThreshold: 50, maxPoints: 5,
        evaluator: (v) => /(asumo|riesgo|mío|garantizo|si no|devolvemos|pago|resultados)/i.test(v) ? 1 : 0.5 },
      { field: 'socialProof', type: 'evidence', minThreshold: 60, maxPoints: 5,
        evaluator: (v) => /(testimonio|caso|resultado|cliente|empresa|logo|video|antes|después|\d+\%|\d+x)/i.test(v) ? 1 : 0.4 },
      { field: 'objectionHandling', type: 'structure', minThreshold: 60, maxPoints: 5,
        evaluator: (v) => /(objeción|preocupa|duda|costoso|tiempo|funciona|garantía|confío)/i.test(v) ? 1 : 0.5 }
    ]
  },
  {
    id: 'carta',
    order: 8,
    title: { es: 'Tu Oferta', en: 'Your Offer', pt: 'Sua Oferta' },
    description: {
      es: 'Carta de venta final: headline, gancho, cuerpo, prueba, oferta, CTA',
      en: 'Final sales letter: headline, hook, body, proof, offer, CTA',
      pt: 'Carta de venda final: manchete, gancho, corpo, prova, oferta, CTA'
    },
    requiredFields: ['headline', 'hook', 'body', 'offer', 'cta'],
    optionalFields: ['ps', 'videoScript', 'emailSequence', 'adCopy'],
    dependsOn: ['base', 'soulmate', 'promesa', 'valor', 'bonos', 'precio', 'blindaje'],
    minChars: { headline: 20, hook: 50, body: 200, offer: 100, cta: 20 },
    heuristics: [
      { field: 'headline', type: 'differentiation', minThreshold: 30, maxPoints: 5,
        evaluator: (v) => /(cómo|como|descubre|consigue|logra|transforma|sin|garantizado|probado)/i.test(v) ? 1 : 0.5 },
      { field: 'hook', type: 'evidence', minThreshold: 60, maxPoints: 5,
        evaluator: (v) => /(historia|caso|dato|investigación|estudio|descubrí|me di cuenta|secret)/i.test(v) ? 1 : 0.4 },
      { field: 'body', type: 'structure', minThreshold: 300, maxPoints: 5,
        evaluator: (v) => v.split('\n').filter(s => s.trim().length > 20).length >= 5 ? 1 : 0.4 },
      { field: 'offer', type: 'specificity', minThreshold: 80, maxPoints: 5,
        evaluator: (v) => /(incluye|obtienes|recibes|acceso|bono|valor|precio|ahorro|total)/i.test(v) ? 1 : 0.5 },
      { field: 'cta', type: 'differentiation', minThreshold: 20, maxPoints: 5,
        evaluator: (v) => /(aplica|inscríbete|comienza|empieza|haz clic|reserva|ahora|hoy|cupo)/i.test(v) ? 1 : 0.5 }
    ]
  }
];

// ============================================================================
// FUNCIONES PURAS — CÁLCULO POWER
// ============================================================================

export function calculateLevelPower(
  levelId: string,
  levelData: LevelData,
  allLevels: Record<string, LevelData>,
  config: OfferLevelConfig
): { required: number; heuristics: number; total: number } {
  const requiredFields = config.requiredFields;
  const completedRequired = requiredFields.filter(f => levelData.fields[f]?.trim().length > 0).length;
  const requiredScore = requiredFields.length > 0 ? (completedRequired / requiredFields.length) * 70 : 0;

  let heuristicsScore = 0;
  for (const h of config.heuristics) {
    const value = levelData.fields[h.field] || '';
    const score = h.evaluator(value, levelData.fields);
    heuristicsScore += score * h.maxPoints;
  }
  const maxHeuristics = config.heuristics.reduce((sum, h) => sum + h.maxPoints, 0);
  const heuristicsPct = maxHeuristics > 0 ? (heuristicsScore / maxHeuristics) * 30 : 0;

  const total = Math.round(Math.min(100, requiredScore + heuristicsPct));
  return { required: Math.round(requiredScore), heuristics: Math.round(heuristicsPct), total };
}

export function calculateTotalPower(
  levels: Record<string, LevelData>,
  mode: OfferMode = 'postmonetario'
): PowerBreakdown {
  const byLevel: PowerBreakdown['byLevel'] = {};
  let total = 0;

  for (const config of OFFER_LEVELS) {
    const levelData = levels[config.id];
    if (levelData) {
      const breakdown = calculateLevelPower(config.id, levelData, levels, config);
      byLevel[config.id] = breakdown;
      total += breakdown.total;
    } else {
      byLevel[config.id] = { required: 0, heuristics: 0, total: 0 };
    }
  }

  // Promedio ponderado por orden (niveles posteriores pesan más si previos completos)
  const completedCount = Object.values(levels).filter(l => l.completed).length;
  const weightFactor = completedCount > 0 ? (completedCount / OFFER_LEVELS.length) : 0;
  const adjustedTotal = Math.round(total * (0.5 + 0.5 * weightFactor));

  const thresholds = { draft: 30, progress: 60, solid: 85, ready: 100 };
  let label: PowerBreakdown['label'] = 'draft';
  if (adjustedTotal >= thresholds.ready) label = 'ready';
  else if (adjustedTotal >= thresholds.solid) label = 'solid';
  else if (adjustedTotal >= thresholds.progress) label = 'progress';

  return {
    total: Math.min(100, adjustedTotal),
    byLevel,
    thresholds,
    label
  };
}

export function validateLevel(levelId: string, data: Record<string, string>): { valid: boolean; missing: string[]; warnings: string[] } {
  const config = OFFER_LEVELS.find(l => l.id === levelId);
  if (!config) return { valid: false, missing: ['unknown_level'], warnings: [] };

  const missing = config.requiredFields.filter(f => !data[f]?.trim());
  const warnings: string[] = [];

  for (const field of config.requiredFields) {
    const minChars = config.minChars?.[field] || 0;
    const value = data[field] || '';
    if (value.trim().length > 0 && value.trim().length < minChars) {
      warnings.push(`${field}: mínimo ${minChars} caracteres (actual: ${value.trim().length})`);
    }
  }

  // Verificar dependencias
  const depsMissing = config.dependsOn?.filter(d => !levelsCompleted(allLevels, d)) || [];

  return { valid: missing.length === 0 && depsMissing.length === 0, missing: [...missing, ...depsMissing], warnings };
}

// Helper para validación
function levelsCompleted(levels: Record<string, LevelData>, levelId: string): boolean {
  return levels[levelId]?.completed === true;
}

export function getNextIncompleteLevel(levels: Record<string, LevelData>): string | null {
  for (const config of OFFER_LEVELS) {
    if (!levels[config.id]?.completed) return config.id;
  }
  return null;
}

export function canAdvanceTo(levelId: string, levels: Record<string, LevelData>): boolean {
  const config = OFFER_LEVELS.find(l => l.id === levelId);
  if (!config) return false;
  return config.dependsOn?.every(d => levels[d]?.completed) ?? true;
}

// ============================================================================
// GENERACIÓN DE CARTA DE VENTA
// ============================================================================

export function generateSalesLetter(
  levels: Record<string, LevelData>,
  mode: OfferMode = 'postmonetario',
  priceParity?: PriceParityOracle
): string {
  const base = levels.base?.fields || {};
  const soulmate = levels.soulmate?.fields || {};
  const promesa = levels.promesa?.fields || {};
  const valor = levels.valor?.fields || {};
  const bonos = levels.bonos?.fields || {};
  const precio = levels.precio?.fields || {};
  const blindaje = levels.blindaje?.fields || {};
  const carta = levels.carta?.fields || {};

  const currencySymbol = mode === 'conectado' ? '$' : 'ZNU';
  const priceDisplay = precio.basePrice || (mode === 'conectado' ? '997 USD' : '10,000 ZNU');

  const sections = [
    `=== ${carta.headline || `Cómo ${base.corePromise || 'transformar tu realidad'} en ${promesa.timeline || '90 días'} (Garantizado)`} ===`,
    '',
    carta.hook || `Imagina por un momento... ${soulmate.desire || 'lograr ese cambio que tanto anhelas'} sin ${soulmate.pain || 'el dolor que te frena'}.`,
    '',
    '---',
    '',
    '## TU SITUACIÓN ACTUAL (ANTES)',
    promesa.beforeState || `Estás ${soulmate.pain?.toLowerCase() || 'estancado'}, probando ${soulmate.currentSolutions || 'soluciones que no funcionan'} y sintiendo que ${soulmate.objections?.split('.')[0] || 'nada cambia'}.`,
    '',
    '## TU FUTURO POSIBLE (DESPUÉS)',
    promesa.afterState || `En ${promesa.timeline || '90 días'}, ${promesa.proof?.split('.')[0] || 'habrás transformado tu realidad completamente'}.`,
    '',
    '---',
    '',
    '## LA PRUEBA',
    promesa.proof || 'Mira lo que lograron otros como tú: [insertar caso de estudio o métrica real]',
    '',
    '---',
    '',
    '## LO QUE RECIBES',
    valor.modules?.split('\n').map(m => `✅ ${m.trim()}`).filter(m => m.length > 2).join('\n') || '• Módulo 1: Fundación\n• Módulo 2: Implementación\n• Módulo 3: Escalamiento\n• Módulo 4: Maestría',
    '',
    '## BONOS EXCLUSIVOS (SOLO HOY)',
    bonos.bonusList?.split('\n').map(b => `🎁 ${b.trim()}`).filter(b => b.length > 2).join('\n') || '🎁 Bono 1: Plantillas listas para usar\n🎁 Bono 2: Acceso a comunidad privada\n🎁 Bono 3: Sesión de implementación 1:1',
    '',
    '---',
    '',
    '## INVERSIÓN',
    `**${priceDisplay}** — ${precio.pricingModel || 'Pago único con garantía de resultados'}`,
    '',
    precio.guarantee || `🛡️ Garantía: Si no ves resultados en ${promesa.timeline || '90 días'}, te devolvemos tu inversión. El riesgo es 100% mío.`,
    '',
    '## PREGUNTAS FRECUENTES',
    blindaje.faqs?.split('?').filter(f => f.trim().length > 10).slice(0, 5).map(f => `**P:** ${f.trim()}?\n**R:** [Respuesta basada en tu blindaje]`).join('\n\n') || '**P:** ¿Funciona para mi caso?\n**R:** Sí, está diseñado para [tu avatar].\n\n**P:** ¿Cuánto tiempo requiere?\n**R:** [Según tu promesa].\n\n**P:** ¿Qué pasa si no tengo resultados?\n**R:** [Según tu garantía].',
    '',
    '---',
    '',
    carta.cta || `👉 **${precio.paymentOptions?.includes('cuota') ? 'Reserva tu plaza' : 'Accede ahora'} por ${priceDisplay} ${bonos.urgency ? `— ${bonos.urgency}` : ''}${bonos.scarcity ? ` (${bonos.scarcity})` : ''}`,
    '',
    carta.ps || `P.D. ${bonos.scarcity || 'Los cupos son limitados'}. ${bonos.urgency || 'La oferta expira pronto.'} Tu ${soulmate.desire?.toLowerCase() || 'transformación'} comienza hoy.`
  ];

  return sections.join('\n');
}

// ============================================================================
// EVALUADOR IA (PROMPT TEMPLATE)
// ============================================================================

export const EVALUATOR_PROMPT_TEMPLATE = `
Eres un evaluador experto de ofertas high-ticket. Analiza la siguiente carta de venta y puntúa cada dimensión 0-100.

CARTA A EVALUAR:
{{carta}}

CRITERIOS:
1. CLARIDAD (0-100): ¿Se entiende QUÉ se vende, PARA QUIÉN y QUÉ TRANSFORMACIÓN entrega en <10 seg?
   - Headline claro y específico
   - Avatar definido
   - Promesa concreta y medible

2. DESEO (0-100): ¿Genera deseo genuino de comprar?
   - Dolor bien articulado
   - Deseo visceral (no lógico)
   - Gap antes/después emocionante

3. PRUEBA (0-100): ¿Hay evidencia creíble de que funciona?
   - Casos de estudio con métricas
   - Testimonios específicos
   - Mecanismo único explicado
   - Garantía de riesgo revertido

4. URGENCIA (0-100): ¿Hay razón real para actuar AHORA?
   - Escasez genuina (cupos, tiempo, bonos)
   - Costo de inacción claro
   - CTA directo y sin fricción

FORMATO DE RESPUESTA (JSON estricto):
{
  "scores": {"clarity": 0, "desire": 0, "proof": 0, "urgency": 0},
  "overall": 0,
  "feedback": {
    "clarity": ["fortaleza", "mejora"],
    "desire": ["fortaleza", "mejora"],
    "proof": ["fortaleza", "mejora"],
    "urgency": ["fortaleza", "mejora"],
    "priority": ["acción 1", "acción 2", "acción 3"]
  }
}
`.trim();

export function parseEvaluationResponse(response: string): EvaluationResult | null {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]);

    // Validar estructura
    if (!parsed.scores || typeof parsed.overall !== 'number') return null;

    return {
      scores: {
        clarity: Math.max(0, Math.min(100, parsed.scores.clarity || 0)),
        desire: Math.max(0, Math.min(100, parsed.scores.desire || 0)),
        proof: Math.max(0, Math.min(100, parsed.scores.proof || 0)),
        urgency: Math.max(0, Math.min(100, parsed.scores.urgency || 0))
      },
      overall: Math.max(0, Math.min(100, parsed.overall)),
      feedback: {
        clarity: Array.isArray(parsed.feedback?.clarity) ? parsed.feedback.clarity : [],
        desire: Array.isArray(parsed.feedback?.desire) ? parsed.feedback.desire : [],
        proof: Array.isArray(parsed.feedback?.proof) ? parsed.feedback.proof : [],
        urgency: Array.isArray(parsed.feedback?.urgency) ? parsed.feedback.urgency : [],
        priority: Array.isArray(parsed.feedback?.priority) ? parsed.feedback.priority : []
      },
      evaluatedAt: Date.now(),
      mode: 'postmonetario' // se sobrescribe al llamar
    };
  } catch {
    return null;
  }
}

// ============================================================================
// MIGRACIÓN v1 → v2 (Anfibio)
// ============================================================================

export interface V1LocalStorageData {
  version: 1;
  power: number;
  screens: Record<string, { fields: Record<string, string> }>;
  timestamps: Record<string, number>;
  exportHistory: Array<{ timestamp: number; power: number; text: string }>;
}

export function migrateV1toV2(v1Data: V1LocalStorageData, userId: string, mode: OfferMode = 'postmonetario'): OfferData {
  const levels: Record<string, LevelData> = {};

  for (const [levelId, screenData] of Object.entries(v1Data.screens)) {
    const config = OFFER_LEVELS.find(l => l.id === levelId);
    if (!config) continue;

    const breakdown = calculateLevelPower(levelId, { fields: screenData.fields, completed: false, powerContribution: 0, qualityScore: 0, lastEdited: 0 }, v1Data.screens as any, config);

    levels[levelId] = {
      fields: screenData.fields,
      completed: breakdown.total >= 70, // umbral completado
      powerContribution: breakdown.total,
      qualityScore: breakdown.heuristics,
      lastEdited: v1Data.timestamps[levelId] || Date.now()
    };
  }

  return {
    version: 2,
    mode,
    power: v1Data.power,
    currentLevel: getNextIncompleteLevel(levels) || 'carta',
    completedLevels: Object.entries(levels).filter(([,v]) => v.completed).map(([k]) => k),
    levels,
    timestamps: v1Data.timestamps,
    exportHistory: v1Data.exportHistory.map(e => ({ ...e, mode })),
    achievements: [],
    metadata: {
      createdAt: Math.min(...Object.values(v1Data.timestamps)),
      updatedAt: Date.now(),
      source: 'offerDesigner-v1',
      language: 'es'
    }
  };
}

// ============================================================================
// UTILIDADES EXPORT/IMPORT
// ============================================================================

export function exportToJSON(offer: OfferData): string {
  return JSON.stringify(offer, null, 2);
}

export function importFromJSON(json: string): OfferData | null {
  try {
    const data = JSON.parse(json);
    // Validación básica
    if (!data.version || !data.levels) return null;
    return data as OfferData;
  } catch {
    return null;
  }
}

export function convertCurrency(amount: number, from: 'USD' | 'ZNU', priceParity: PriceParityOracle): number {
  if (from === 'USD') return Math.round(amount * priceParity.znuPerUsd);
  if (from === 'ZNU') return Math.round(amount / priceParity.znuPerUsd);
  return amount;
}