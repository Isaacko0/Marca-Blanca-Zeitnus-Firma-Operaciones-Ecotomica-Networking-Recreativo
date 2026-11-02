// offer-designer-levels.ts — Definición detallada de los 8 niveles con campos, validaciones y UI hints
// Re-exporta OFFER_LEVELS y añade metadatos para renderizado

export { OFFER_LEVELS, type OfferLevelConfig, type HeuristicRule } from './offer-designer';

// ============================================================================
// METADATOS DE RENDERIZADO POR NIVEL
// ============================================================================

export interface LevelRenderMeta {
  icon: string;                    // nombre icono lucide
  color: string;                   // color acento (var CSS)
  estimatedMinutes: number;        // tiempo estimado completado
  difficulty: 'easy' | 'medium' | 'hard';
  tips: string[];                  // consejos contextuales
  examples: Record<string, string>; // ejemplos por campo
}

export const LEVEL_RENDER_META: Record<string, LevelRenderMeta> = {
  base: {
    icon: 'Package',
    color: 'var(--genio)',
    estimatedMinutes: 10,
    difficulty: 'easy',
    tips: [
      'Sé específico: "Curso de marketing para dentistas" > "Curso de marketing"',
      'Tu mecanismo único es tu diferenciador: ¿qué haces DISTINTO?',
      'El formato determina el precio: comunidad > curso > PDF'
    ],
    examples: {
      whatYouSell: 'Programa de 12 semanas para escalar agencias de 6 a 7 cifras sin contratar equipo',
      format: 'Programa híbrido: 8 módulos grabados + 12 llamadas grupales semanales + comunidad Slack',
      corePromise: 'Escalar de $50k a $100k/mes en 6 meses trabajando 20h/semana, sin contratar',
      targetMarket: 'Dueños de agencias de marketing digital facturando $30k-$80k/mes',
      uniqueMechanism: 'Sistema "Agencia Autónoma" que reemplaza contrataciones con automatización + SOPs'
    }
  },
  soulmate: {
    icon: 'Users',
    color: 'var(--haiti)',
    estimatedMinutes: 15,
    difficulty: 'medium',
    tips: [
      'Escribe como si le hablaras a UNA persona (no a "empresarios")',
      'El dolor debe doler: usa sus palabras exactas, no las tuyas',
      'Las objeciones son oro: cada una = una sección en tu blindaje'
    ],
    examples: {
      who: 'María, 34 años, dueña de agencia de SEO y ads. Factura $45k/mes. Equipo: 3 freelancers. Trabaja 60h/sem. Quiere vender pero no sabe cómo.',
      pain: 'Se ahoga en entregables. No puede salir de operativa. Cada cliente nuevo = más horas suyas. Miedo a contratar y que fallen. Ingresos topeados en $50k.',
      desire: 'Una agencia que corra sin ella. Libertad para viajar 3 meses al año. Facturar $100k+ sin estar en daily calls. Vender la agencia en 3 años por 7 cifras.',
      objections: 'No tengo tiempo para implementar. Ya probé SOPs y no funcionaron. Mi nicho es muy específico. No quiero gestionar gente. Es muy caro.',
      demographics: '30-45 años, dueños agencia, $30k-100k/mes, hispanohablantes, digital-first',
      psychographics: 'Valoran libertad > dinero. Perfeccionistas. Controladores. Aprenden rápido. Compran cursos pero no implementan.',
      currentSolutions: 'Contratar VAs (fallan), cursos de sistemas (genéricos), masterminds (caros), software de gestión (complejo)'
    }
  },
  promesa: {
    icon: 'Target',
    color: 'var(--limon)',
    estimatedMinutes: 15,
    difficulty: 'hard',
    tips: [
      'La promesa debe ser MEDIBLE y con FECHA: "en 90 días" no "rápido"',
      'La prueba es lo que vende: sin prueba = promesa vacía',
      'Timeline realista > timeline agresivo que no cumples'
    ],
    examples: {
      beforeState: 'Estaba atascada en $45k/mes, trabajando 60h/sem, sin poder desconectar ni una semana. Cada cliente nuevo era más carga, no más libertad.',
      afterState: 'A los 90 días factura $87k/mes, trabaja 25h/sem, se tomó 3 semanas de vacaciones sin teléfono. El equipo gestiona entregables sin ella.',
      proof: 'Caso María: $45k → $87k en 97 días. 3 clientes nuevos a $5k c/u. Redujo horas 58%. Equipo de 3 freelancers → 1 PM + 2 especialistas. Testimonio en video 12 min.',
      timeline: '90 días (3 fases de 30 días: Diagnóstico + Sistemas + Delegación)',
      milestones: 'Día 30: SOPs completas. Día 60: PM contratada gestionando 80% operaciones. Día 90: Dueña solo en estrategia + ventas.',
      measurements: 'Ingresos mensuales, horas semanales dueña, % entregables sin dueña, NPS equipo, churn clientes',
      guarantee: 'Si en 90 días no reduces 20h/sem y no subes 30% ingresos, te devolvemos 100% + $1k por tu tiempo'
    }
  },
  valor: {
    icon: 'Gem',
    color: 'var(--genio)',
    estimatedMinutes: 20,
    difficulty: 'medium',
    tips: [
      'Módulos = hitos del viaje, no temas sueltos',
      'El soporte define el precio: 1:1 > grupo > comunidad > solo',
      'La experiencia (comunidad, eventos) justifica 3-5x el precio base'
    ],
    examples: {
      modules: 'M1: Diagnóstico & Métricas Clave\nM2: SOPs Maestras (entrega, ventas, onboarding)\nM3: Contratación Cero-Riesgo (PM + Especialistas)\nM4: Sistema de Ventas Predecible\nM5: Escalamiento a $100k+',
      format: '8 semanas: 1 módulo/sem (video 60-90min) + llamada grupal semanal 90min + tareas implementables',
      support: 'Llamada grupal semanal (miércoles 19h CET) + Slack prioritario respuesta <24h laborables + 2 sesiones 1:1 (inicio y fin)',
      experience: 'Comunidad privada vitalicia (50+ dueños agencia) + Retiro presencial anual (incluido 1er año) + Mastermind trimestral',
      bonuses: 'Plantillas SOPs (valor $2k)\nAcceso comunidad (valor $3k/año)\nSesión 1:1 diagnóstico (valor $1.5k)',
      community: 'Slack + llamadas mensuales networking + directorio proveedores validados',
      tools: 'Notion workspace completo + Airtable CRM agencia + Calculadora pricing',
      templates: 'Propuestas, contratos, onboarding clientes, offboarding, revisiones trimestrales'
    }
  },
  bonos: {
    icon: 'Gift',
    color: 'var(--acero)',
    estimatedMinutes: 10,
    difficulty: 'easy',
    tips: [
      'Cada bono debe resolver una OBJECIÓN del soulmate',
      'Urgencia real > urgencia falsa: "primeros 10" > "oferta expira"',
      'Valor percibido de bonos > 50% precio principal'
    ],
    examples: {
      bonusList: 'Bono 1: "Contrata tu PM en 14 días" — proceso + anuncios + entrevistas + onboarding (valor $3k)\nBono 2: "Sistema de Ventas Automatizado" — funnel + emails + CRM configurado (valor $2.5k)\nBono 3: "Retiro Presencial Anual" — 3 días estrategia + networking + mastermind (valor $5k)\nBono 4: "Acceso Vitalicio a Actualizaciones" — todos los futuros módulos gratis (valor ∞)',
      urgency: 'Solo los primeros 10 inscritos acceden al Bono 1 (contratación PM) y Bono 2 (ventas automatizado)',
      scarcity: 'Quedan 7 cupos para el retiro presencial 2024. El próximo es 2025.',
      stackOrder: '1. Contratación PM (urgente) → 2. Ventas Automatizado (complementa) → 3. Retiro (experiencia) → 4. Vitalicio (retención)',
      bonusValue: 'Total bonos: $10.5k+ | Precio programa: $5k | Ratio valor/precio: 2.1x',
      expiration: 'Bonos 1 y 2 expiran 48h post-lanzamiento. Bono 3: cupos limitados 10/año.'
    }
  },
  precio: {
    icon: 'CreditCard',
    color: 'var(--haiti)',
    estimatedMinutes: 10,
    difficulty: 'medium',
    tips: [
      'Ancla alto: muestra valor total (programa + bonos) antes del precio',
      'Planes de pago reducen fricción: 3-6 cuotas sin interés',
      'Garantía fuerte = precio alto justificado'
    ],
    examples: {
      basePrice: '$4,997 USD (pago único) | 3 cuotas $1,797 | 6 cuotas $897',
      pricingModel: 'Pago único con garantía 90 días resultados. Planes 3/6 cuotas sin interés. Early bird -$500 (primeras 48h).',
      guarantee: 'Garantía "Resultados o Devolución + $1k": Si en 90 días no reduces 20h/sem Y subes 30% ingresos, te devolvemos 100% + $1,000 por tu tiempo.',
      paymentOptions: 'Tarjeta (Stripe), Transferencia bancaria, PayPal, USDC/USDT (crypto), 3/6 cuotas sin interés (Stripe)',
      discounts: 'Early bird -$500 (48h). Pago único -$300 vs cuotas. Referido -$200 (ambos).',
      paymentPlans: '3 cuotas $1,797 c/u (cada 30 días). 6 cuotas $897 c/u (cada 30 días). Sin interés.',
      earlyBird: 'Primeras 48h: -$500 + Bono "Diagnóstico Exprés 48h" (valor $1k)',
      vipTier: 'VIP $9,997: Incluye 6 sesiones 1:1 + acceso directo WhatsApp + retiro gratis de por vida'
    }
  },
  blindaje: {
    icon: 'Shield',
    color: 'var(--limon)',
    estimatedMinutes: 15,
    difficulty: 'hard',
    tips: [
      'Cada objeción del soulmate = una FAQ + una sección en carta',
      'Reversión de riesgo: tú asumes el riesgo, no el cliente',
      'Prueba social > promesas: casos > testimonios > logos'
    ],
    examples: {
      faqs: '¿Funciona si mi nicho es muy específico? Sí, el sistema es agnóstico de nicho. ¿Qué pasa si no tengo equipo? Empezamos con freelancers, luego PM. ¿Cuánto tiempo semanal? 3-4h primeras 4 semanas, luego 1-2h. ¿Puedo pagar en mi moneda? Sí, USD, EUR, MXN, ARS, COP, BRL, crypto. ¿Hay soporte técnico? Sí, Slack + email + llamadas grupales.',
      riskReversal: 'Asumo 100% del riesgo. Si no ves resultados medibles en 90 días, te devuelvo tu dinero + $1,000 por tu tiempo. No tienes que devolver nada. El riesgo es totalmente mío.',
      socialProof: '12 casos de estudio documentados (video + PDF métricas). 50+ testimonios en video. Logos: 3 agencias vendidas 7 cifras. Métricas promedio: +67% ingresos, -42% horas, 94% retención clientes.',
      objectionHandling: 'Objeción "No tengo tiempo": El programa TE AHORRA tiempo desde semana 1. Objeción "Muy caro": ROI proyectado 10x en 12 meses. Objeción "Mi nicho es distinto": 12 nichos probados. Objeción "Ya probé SOPs": Estas SOPs son probadas en 50+ agencias.',
      caseStudies: 'Caso 1: Agencia SEO $45k→$120k (8 meses). Caso 2: Ads $30k→$95k (6 meses). Caso 3: Full-service $80k→$200k (10 meses).',
      demoVideo: 'Video 15 min: "Por dentro del programa" — muestra módulos, comunidad, herramientas, llamadas.',
      trialPeriod: 'Acceso 7 días gratis al Módulo 1 + 1 llamada grupal. Sin tarjeta. Decide después.'
    }
  },
  carta: {
    icon: 'FileText',
    color: 'var(--genio)',
    estimatedMinutes: 20,
    difficulty: 'hard',
    tips: [
      'Headline = promesa + mecanismo + plazo + garantía (fórmula 4P)',
      'El cuerpo sigue: Gancho → Dolor → Agitación → Solución → Prueba → Oferta → CTA',
      'CTA único, claro, con urgencia real y bajo fricción'
    ],
    examples: {
      headline: 'Cómo escalar tu agencia de $50k a $100k/mes en 90 días trabajando 20h/sem (Garantizado: resultados o te devolvemos el 100% + $1k)',
      hook: 'María estaba a punto de cerrar su agencia. Facturaba $45k, trabajaba 70h/sem, no veía a sus hijos. 97 días después factura $87k, trabaja 25h y se fue 3 semanas a Japón sin teléfono. Esto es lo que hizo...',
      body: '[Historia completa de María — 800 palabras]\n\nEl problema no es tu habilidad. Es tu modelo.\n\nLa mayoría de dueños agencia intentan escalar contratando. Error. Contratar sin sistemas = más caos.\n\nEl sistema "Agencia Autónoma" reemplaza contrataciones con: SOPs maestras + PM fractional + Ventas automatizadas.\n\n[3 casos más resumidos — 200 palabras c/u]\n\nPor eso creé el Programa Agencia Autónoma.',
      offer: 'Incluye: 5 módulos implementables + 8 llamadas grupales + 2 sesiones 1:1 + Comunidad vitalicia + Retiro anual + Plantillas SOPs + Sistema Ventas + Calculadora Pricing + Acceso actualizaciones de por vida.\n\nValor real: $15,497 | Tu inversión: $4,997 (pago único) o 3 cuotas $1,797',
      cta: '👉 Reserva tu plaza ahora por $4,997 (solo 7 cupos para retiro 2024) — Incluye bono "Contrata tu PM en 14 días" (expira 48h)',
      ps: 'P.D. Quedan 7 cupos para el retiro presencial 2024. El próximo es 2025. Tu libertad de tiempo comienza el día que decides. ¿En qué estás esperando?',
      videoScript: 'Guion video VSL 15 min: Gancho (0-30s) → Historia María (30s-3m) → Problema real (3-5m) → Solución única (5-8m) → Pruebas (8-11m) → Oferta (11-13m) → CTA (13-15m)',
      emailSequence: '5 emails pre-lanzamiento: 1. Dolor 2. Historia 3. Mecanismo 4. Prueba 5. Urgencia + CTA',
      adCopy: 'Headline: "Agencia atascada en $50k? Escala a $100k en 90d sin contratar" | Body: 3 bullets prueba + CTA "Ver caso María"'
    }
  }
};

// ============================================================================
// VALIDACIONES ESPECÍFICAS POR NIVEL
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export function validateLevelData(levelId: string, data: Record<string, string>): ValidationResult {
  const config = OFFER_LEVELS.find(l => l.id === levelId);
  const meta = LEVEL_RENDER_META[levelId];

  if (!config) return { isValid: false, errors: ['Nivel desconocido'], warnings: [], suggestions: [] };

  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Campos requeridos
  for (const field of config.requiredFields) {
    const value = data[field]?.trim() || '';
    if (!value) {
      errors.push(`Campo requerido: ${field}`);
    } else {
      const minChars = config.minChars?.[field] || 0;
      if (value.length < minChars) {
        warnings.push(`${field}: muy corto (${value.length}/${minChars} chars mín)`);
      }
    }
  }

  // Heurísticas de calidad
  for (const h of config.heuristics) {
    const value = data[h.field]?.trim() || '';
    if (value) {
      const score = h.evaluator(value, data);
      if (score < 0.5) {
        suggestions.push(`${h.field}: ${getHeuristicSuggestion(h.type)}`);
      }
    }
  }

  // Validaciones cruzadas específicas
  if (levelId === 'promesa') {
    if (data.timeline && data.proof) {
      const hasMetric = /\d+/.test(data.proof);
      const hasTime = /\d+/.test(data.timeline);
      if (!hasMetric || !hasTime) {
        suggestions.push('Incluye métricas numéricas en prueba y timeline (ej: "90 días", "+67% ingresos")');
      }
    }
  }

  if (levelId === 'precio') {
    if (data.basePrice && !/^\d+/.test(data.basePrice)) {
      warnings.push('basePrice debería empezar con número (ej: "4997 USD")');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions
  };
}

function getHeuristicSuggestion(type: HeuristicRule['type']): string {
  const map: Record<string, string> = {
    length: 'Añade más detalle y especificidad',
    specificity: 'Sé más concreto: nombres, números, ejemplos',
    evidence: 'Añade prueba: casos, métricas, testimonios, datos',
    structure: 'Estructura en puntos/lista: módulos, pasos, fases',
    differentiation: 'Destaca qué es ÚNICO/DIFERENTE vs competencia'
  };
  return map[type] || 'Mejora la calidad de este campo';
}

// ============================================================================
// ORQUESTADOR DE FLUJO
// ============================================================================

export function getLevelProgress(levels: Record<string, LevelData>): {
  completed: number;
  total: number;
  current: string | null;
  next: string | null;
  canAdvance: boolean;
} {
  const ordered = [...OFFER_LEVELS].sort((a, b) => a.order - b.order);
  let completed = 0;
  let current: string | null = null;

  for (const config of ordered) {
    const level = levels[config.id];
    if (level?.completed) {
      completed++;
    } else if (!current) {
      current = config.id;
    }
  }

  const next = ordered.find(c => c.id === current)?.id ? ordered[ordered.findIndex(c => c.id === current) + 1]?.id || null : null;

  return {
    completed,
    total: ordered.length,
    current,
    next,
    canAdvance: current ? true : false
  };
}

export function getLevelDependencies(levelId: string): string[] {
  const config = OFFER_LEVELS.find(l => l.id === levelId);
  return config?.dependsOn || [];
}

export function isLevelUnlocked(levelId: string, levels: Record<string, LevelData>): boolean {
  const deps = getLevelDependencies(levelId);
  return deps.every(dep => levels[dep]?.completed === true);
}