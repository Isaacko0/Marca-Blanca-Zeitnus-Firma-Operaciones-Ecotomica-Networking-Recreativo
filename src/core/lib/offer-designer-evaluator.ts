// offer-designer-evaluator.ts — Evaluador IA para ofertas (prompt template + parser + fallbacks)
// Principio Anfibio: funciona offline (mock) o conectado (Claude/OpenAI via API)

import { EvaluationResult, EVALUATOR_PROMPT_TEMPLATE, parseEvaluationResponse, generateSalesLetter } from './offer-designer';
import { OFFER_LEVELS } from './offer-designer-levels';
import type { OfferData, OfferMode } from './offer-designer';

export interface EvaluatorConfig {
  mode: 'mock' | 'claude' | 'openai' | 'local-llm';
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface EvaluationContext {
  offer: OfferData;
  salesLetter: string;
  mode: OfferMode;
  priceParity?: { znuPerUsd: number };
}

// ============================================================================
// EVALUADOR MOCK (OFFLINE-FIRST, SIN API KEYS)
// ============================================================================

const MOCK_EVALUATIONS: Record<string, EvaluationResult> = {
  // Evaluación base para testing
  default: {
    scores: { clarity: 65, desire: 58, proof: 45, urgency: 52 },
    overall: 55,
    feedback: {
      clarity: ['Headline presente', 'Falta especificar avatar en headline'],
      desire: ['Dolor identificado', 'Gap antes/después podría ser más visceral'],
      proof: ['Menciona caso María', 'Faltan métricas numéricas concretas'],
      urgency: ['Menciona cupos limitados', 'CTA presente pero genérico'],
      priority: ['Añade números a la prueba', 'Especifica avatar en headline', 'Refuerza urgencia con fecha límite']
    },
    evaluatedAt: 0,
    mode: 'postmonetario'
  },
  // Evaluación para oferta vacía
  empty: {
    scores: { clarity: 10, desire: 5, proof: 0, urgency: 5 },
    overall: 5,
    feedback: {
      clarity: ['Carta casi vacía', 'Headline genérico'],
      desire: ['Sin dolor articulado', 'Sin deseo visceral'],
      proof: ['Sin casos ni métricas', 'Sin mecanismo único'],
      urgency: ['Sin escasez real', 'CTA débil'],
      priority: ['Completa todos los 8 niveles', 'Escribe caso de estudio con números', 'Define avatar específico']
    },
    evaluatedAt: 0,
    mode: 'postmonetario'
  },
  // Evaluación para oferta completa
  complete: {
    scores: { clarity: 88, desire: 85, proof: 82, urgency: 78 },
    overall: 83,
    feedback: {
      clarity: ['Headline 4P completa', 'Avatar claro en hook', 'Promesa medible con plazo'],
      desire: ['Historia emocional fuerte', 'Dolor visceral bien articulado', 'Transformación tangible'],
      proof: ['3 casos con métricas', 'Testimonios en video', 'Garantía riesgo revertido'],
      urgency: ['Escasez real (7 cupos)', 'Bonos expiran 48h', 'CTA directo con beneficio'],
      priority: ['Añade video VSL', 'Test A/B headlines', 'Secuencia email pre-lanzamiento']
    },
    evaluatedAt: 0,
    mode: 'postmonetario'
  }
};

function selectMockEvaluation(salesLetter: string): EvaluationResult {
  const len = salesLetter.trim().length;
  if (len < 200) return { ...MOCK_EVALUATIONS.empty, evaluatedAt: Date.now() };
  if (len < 2000) return { ...MOCK_EVALUATIONS.default, evaluatedAt: Date.now() };
  return { ...MOCK_EVALUATIONS.complete, evaluatedAt: Date.now() };
}

// ============================================================================
// EVALUADOR PRINCIPAL
// ============================================================================

export class OfferDesignerEvaluator {
  private config: EvaluatorConfig;

  constructor(config: EvaluatorConfig = { mode: 'mock' }) {
    this.config = {
      mode: config.mode,
      model: config.model || 'claude-3-5-sonnet-20241022',
      temperature: config.temperature ?? 0.3,
      maxTokens: config.maxTokens ?? 2000,
      systemPrompt: config.systemPrompt || 'Eres un evaluador experto de ofertas high-ticket. Responde SOLO JSON válido.',
      apiKey: config.apiKey
    };
  }

  async evaluate(context: EvaluationContext): Promise<EvaluationResult> {
    const { offer, salesLetter, mode, priceParity } = context;

    // Modo mock (offline-first default)
    if (this.config.mode === 'mock' || !this.config.apiKey) {
      const result = selectMockEvaluation(salesLetter);
      return { ...result, mode };
    }

    // Modo conectado (requiere API key)
    try {
      const prompt = this.buildPrompt(salesLetter, offer, mode, priceParity);
      const response = await this.callLLM(prompt);
      const parsed = parseEvaluationResponse(response);

      if (parsed) {
        return { ...parsed, mode, evaluatedAt: Date.now() };
      }

      // Fallback si parsing falla
      console.warn('[OfferDesignerEvaluator] Parsing failed, using mock fallback');
      return { ...selectMockEvaluation(salesLetter), mode };
    } catch (error) {
      console.error('[OfferDesignerEvaluator] LLM call failed:', error);
      return { ...selectMockEvaluation(salesLetter), mode };
    }
  }

  private buildPrompt(
    salesLetter: string,
    offer: OfferData,
    mode: OfferMode,
    priceParity?: { znuPerUsd: number }
  ): string {
    const levelsSummary = Object.entries(offer.levels)
      .filter(([, v]) => v.completed)
      .map(([k, v]) => `${k}: ${Object.keys(v.fields).length} campos, quality=${v.qualityScore}`)
      .join('\n');

    const currencyInfo = mode === 'conectado' && priceParity
      ? `\nMODO CONECTADO: 1 USD = ${priceParity.znuPerUsd} ZNU (priceParity)`
      : '\nMODO POSTMONETARIO: unidades ZNU abstractas';

    return EVALUATOR_PROMPT_TEMPLATE
      .replace('{{carta}}', salesLetter)
      + `\n\nCONTEXTO ADICIONAL:\nNiveles completados:\n${levelsSummary}\n${currencyInfo}\nPower actual: ${offer.power}%`;
  }

  private async callLLM(prompt: string): Promise<string> {
    const { mode, apiKey, model, temperature, maxTokens, systemPrompt } = this.config;

    if (mode === 'claude') {
      return this.callClaude(prompt, apiKey!, model!, temperature!, maxTokens!, systemPrompt!);
    }
    if (mode === 'openai') {
      return this.callOpenAI(prompt, apiKey!, model!, temperature!, maxTokens!, systemPrompt!);
    }
    if (mode === 'local-llm') {
      return this.callLocalLLM(prompt, model!, temperature!, maxTokens!, systemPrompt!);
    }
    throw new Error(`Modo LLM no soportado: ${mode}`);
  }

  private async callClaude(prompt: string, apiKey: string, model: string, temperature: number, maxTokens: number, systemPrompt: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        temperature,
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) throw new Error(`Claude API error: ${response.status}`);
    const data = await response.json();
    return data.content[0]?.text || '';
  }

  private async callOpenAI(prompt: string, apiKey: string, model: string, temperature: number, maxTokens: number, systemPrompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        temperature,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`);
    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  private async callLocalLLM(prompt: string, model: string, temperature: number, maxTokens: number, systemPrompt: string): Promise<string> {
    // Para Ollama/LM Studio local
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: `${systemPrompt}\n\n${prompt}`,
        temperature,
        max_tokens: maxTokens,
        format: 'json',
        stream: false
      })
    });

    if (!response.ok) throw new Error(`Local LLM error: ${response.status}`);
    const data = await response.json();
    return data.response || '';
  }

  // Método estático para evaluación rápida sin instancia
  static async quickEvaluate(
    salesLetter: string,
    offer: OfferData,
    mode: OfferMode = 'postmonetario'
  ): Promise<EvaluationResult> {
    const evaluator = new OfferDesignerEvaluator({ mode: 'mock' });
    return evaluator.evaluate({ offer, salesLetter, mode });
  }
}

// ============================================================================
// FUNCIONES DE UTILIDAD PARA EVALUACIÓN ESTRUCTURADA
// ============================================================================

export interface DimensionScore {
  dimension: 'clarity' | 'desire' | 'proof' | 'urgency';
  score: number;
  maxScore: number;
  criteria: string[];
  evidence: string[];
}

export function evaluateDimensionsManually(salesLetter: string, offer: OfferData): DimensionScore[] {
  const letter = salesLetter.toLowerCase();

  return [
    {
      dimension: 'clarity',
      score: calculateClarityScore(letter, offer),
      maxScore: 100,
      criteria: [
        'Headline incluye: qué + para quién + transformación + plazo',
        'Avatar mencionado explícitamente',
        'Promesa medible (números + tiempo)',
        'Mecanismo único nombrado'
      ],
      evidence: extractClarityEvidence(letter)
    },
    {
      dimension: 'desire',
      score: calculateDesireScore(letter, offer),
      maxScore: 100,
      criteria: [
        'Dolor específico y visceral',
        'Deseo emocional (no solo lógico)',
        'Gap antes/después emocionante',
        'Historia/identificación presente'
      ],
      evidence: extractDesireEvidence(letter)
    },
    {
      dimension: 'proof',
      score: calculateProofScore(letter, offer),
      maxScore: 100,
      criteria: [
        'Casos de estudio con métricas',
        'Testimonios específicos (video/texto)',
        'Mecanismo único explicado',
        'Garantía de riesgo revertido'
      ],
      evidence: extractProofEvidence(letter)
    },
    {
      dimension: 'urgency',
      score: calculateUrgencyScore(letter, offer),
      maxScore: 100,
      criteria: [
        'Escasez genuina (cupos, tiempo, bonos)',
        'Costo de inacción articulado',
        'CTA directo y bajo fricción',
        'Fecha límite o contador'
      ],
      evidence: extractUrgencyEvidence(letter)
    }
  ];
}

function calculateClarityScore(letter: string, offer: OfferData): number {
  let score = 0;
  // Headline 4P
  if (/(cómo|como|qué|quién|cuándo|garantizad)/.test(letter)) score += 20;
  if (/\d+/.test(letter)) score += 15; // números en promesa
  if (/(agencia|dueño|emprendedor|coach|consultor)/.test(letter)) score += 15; // avatar
  if (/(sistema|método|framework|proceso|único)/.test(letter)) score += 15; // mecanismo
  if (/(día|semana|mes|90|60|30)/.test(letter)) score += 15; // plazo
  if (/(garantía|devolución|riesgo|resultados)/.test(letter)) score += 20; // garantía
  return Math.min(100, score);
}

function calculateDesireScore(letter: string, offer: OfferData): number {
  let score = 0;
  if (/(frustra|agota|pierde|gasta|estancad|miedo|ansiedad|sufr)/.test(letter)) score += 25; // dolor
  if (/(libertad|tiempo|dinero|paz|crecer|escala|disfrut|viaj)/.test(letter)) score += 25; // deseo
  if (/(historia|caso|maría|juan|pedro|cliente)/.test(letter)) score += 20; // historia
  if (/(antes|después|transform|logró|consiguió|cambió)/.test(letter)) score += 15; // gap
  if (/(imagin|sueña|desea|anhel)/.test(letter)) score += 15; // aspiración
  return Math.min(100, score);
}

function calculateProofScore(letter: string, offer: OfferData): number {
  let score = 0;
  if (/(caso|estudio|ejemplo|cliente).*\d+/.test(letter)) score += 30; // caso con números
  if (/(testimonio|video|entrevista|resultado|métrica)/.test(letter)) score += 25;
  if (/(sistema|método|framework|proceso|único|diferent)/.test(letter)) score += 20;
  if (/(garantía|devolución|riesgo|asumo|mío|100%)/.test(letter)) score += 25;
  return Math.min(100, score);
}

function calculateUrgencyScore(letter: string, offer: OfferData): number {
  let score = 0;
  if (/(cupo|plaza|limitado|solo|primeros|últim|quedan|restan)/.test(letter)) score += 30;
  if (/(expira|hoy|ahora|48h|24h|fecha|deadline)/.test(letter)) score += 25;
  if (/(aplica|inscríbete|comienza|empieza|haz clic|reserva|acc).*ahor)/.test(letter)) score += 25;
  if (/(cuesta|pierde|deja de|sin.*hacer|esperar)/.test(letter)) score += 20; // costo inacción
  return Math.min(100, score);
}

function extractClarityEvidence(letter: string): string[] {
  const ev: string[] = [];
  if (/(cómo|como).*\d+/.test(letter)) ev.push('Headline con promesa numérica');
  if (/(agencia|dueño|emprendedor)/.test(letter)) ev.push('Avatar identificado');
  if (/(sistema|método|único)/.test(letter)) ev.push('Mecanismo nombrado');
  if (/(garantía|devolución)/.test(letter)) ev.push('Garantía presente');
  return ev.length ? ev : ['Headline genérico o ausente'];
}

function extractDesireEvidence(letter: string): string[] {
  const ev: string[] = [];
  if (/(frustra|agota|estancad)/.test(letter)) ev.push('Dolor articulado');
  if (/(libertad|tiempo|escala)/.test(letter)) ev.push('Deseo visceral presente');
  if (/(historia|caso).*\d+/.test(letter)) ev.push('Historia con métricas');
  if (/(antes|después)/.test(letter)) ev.push('Gap antes/después');
  return ev.length ? ev : ['Sin dolor ni deseo claro'];
}

function extractProofEvidence(letter: string): string[] {
  const ev: string[] = [];
  if (/(caso|estudio).*\d+/.test(letter)) ev.push('Caso con números');
  if (/(testimonio|video)/.test(letter)) ev.push('Testimonio multimedia');
  if (/(garantía|riesgo).*100%/.test(letter)) ev.push('Garantía fuerte');
  if (/(métrica|dato|%|\$)/.test(letter)) ev.push('Métricas concretas');
  return ev.length ? ev : ['Sin prueba creíble'];
}

function extractUrgencyEvidence(letter: string): string[] {
  const ev: string[] = [];
  if (/(cupo|plaza|limitado)/.test(letter)) ev.push('Escasez de cupos');
  if (/(expira|48h|24h|fecha)/.test(letter)) ev.push('Límite temporal');
  if (/(bono).*expira/.test(letter)) ev.push('Bonos con deadline');
  if (/(aplica|inscríbete).*ahor/.test(letter)) ev.push('CTA inmediato');
  return ev.length ? ev : ['Sin urgencia real'];
}

// ============================================================================
// GENERADOR DE REPORTE DE EVALUACIÓN
// ============================================================================

export function generateEvaluationReport(result: EvaluationResult, offer: OfferData): string {
  const { scores, overall, feedback } = result;
  const grade = overall >= 90 ? 'A+' : overall >= 80 ? 'A' : overall >= 70 ? 'B' : overall >= 60 ? 'C' : 'D';

  return `
# Reporte de Evaluación — Offfer Designer

**Power actual:** ${offer.power}% | **Score evaluación:** ${overall}/100 (${grade})
**Modo:** ${result.mode} | **Evaluado:** ${new Date(result.evaluatedAt).toLocaleString()}

---

## Puntuaciones por Dimensión

| Dimensión | Score | Estado |
|-----------|-------|--------|
| Claridad  | ${scores.clarity}/100 | ${scores.clarity >= 80 ? '✅' : scores.clarity >= 60 ? '⚠️' : '❌'} |
| Deseo     | ${scores.desire}/100  | ${scores.desire >= 80 ? '✅' : scores.desire >= 60 ? '⚠️' : '❌'} |
| Prueba    | ${scores.proof}/100   | ${scores.proof >= 80 ? '✅' : scores.proof >= 60 ? '⚠️' : '❌'} |
| Urgencia  | ${scores.urgency}/100 | ${scores.urgency >= 80 ? '✅' : scores.urgency >= 60 ? '⚠️' : '❌'} |

**Promedio ponderado:** ${overall}/100

---

## Feedback Detallado

### Claridad (${scores.clarity})
${feedback.clarity.map(f => `- ${f}`).join('\n') || '- Sin feedback'}

### Deseo (${scores.desire})
${feedback.desire.map(f => `- ${f}`).join('\n') || '- Sin feedback'}

### Prueba (${scores.proof})
${feedback.proof.map(f => `- ${f}`).join('\n') || '- Sin feedback'}

### Urgencia (${scores.urgency})
${feedback.urgency.map(f => `- ${f}`).join('\n') || '- Sin feedback'}

---

## Acciones Prioritarias (Top 3)

${feedback.priority.map((p, i) => `${i + 1}. ${p}`).join('\n') || '1. Completa todos los niveles\n2. Añade caso de estudio con números\n3. Define urgencia real'}

---

## Niveles Completados

${Object.entries(offer.levels)
  .filter(([, v]) => v.completed)
  .map(([k, v]) => `- ✅ ${k}: ${v.qualityScore}% calidad`)
  .join('\n') || 'Ningún nivel completado aún'}

---

*Generado por OfferDesigner Evaluator v1.0 — ${result.mode === 'mock' ? 'Modo offline (mock)' : 'Modo IA conectado'}*
  `.trim();
}

// ============================================================================
// EXPORTACIÓN PARA HARVEY / AGENCIA
// ============================================================================

export interface HarveyEvaluationPayload {
  offerId: string;
  scores: EvaluationResult['scores'];
  overall: number;
  priorityActions: string[];
  evaluatedAt: number;
}

export function toHarveyPayload(result: EvaluationResult, offerId: string): HarveyEvaluationPayload {
  return {
    offerId,
    scores: result.scores,
    overall: result.overall,
    priorityActions: result.feedback.priority,
    evaluatedAt: result.evaluatedAt
  };
}