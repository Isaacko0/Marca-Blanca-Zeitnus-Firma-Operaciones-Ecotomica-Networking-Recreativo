// StoryBrand Engine — Lógica Pura
// 7 pasos StoryBrand + Alternativas + One-liners + Roadmap + Competencia

import type {
  StoryBrandState,
  StoryBrandStepData,
  Alternative,
  DistinctiveCapability,
  OneLiner,
  RoadmapAsset,
  CompetitorIntel,
  BuyerJourneyStage,
  CredibilityCase,
} from '@core/state/storybrand-engine';
import {
  DEFAULT_BRAND_SCRIPT,
  DEFAULT_ALTERNATIVES,
  DEFAULT_CAPABILITIES,
  DEFAULT_ONE_LINERS,
  DEFAULT_ROADMAP,
  DEFAULT_MISSING,
} from '@core/state/storybrand-engine';

/**
 * Valida un paso del BrandScript
 */
export function validateScriptStep(step: number, data: Partial<any>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (step < 1 || step > 7) {
    errors.push('Paso debe estar entre 1 y 7');
    return { valid: false, errors };
  }

  const requiredByStep: Record<number, string[]> = {
    1: ['characterWants'],
    2: ['problemExternal', 'problemInternal', 'problemPhilosophical'],
    3: ['guideEmpathy', 'guideAuthority'],
    4: ['planSteps'],
    5: ['ctaPrimary'],
    6: ['failureAvoided'],
    7: ['successAchieved'],
  };

  const required = requiredByStep[step] || [];
  for (const field of required) {
    if (!data[field] || (Array.isArray(data[field]) && data[field].length === 0)) {
      errors.push(`Paso ${step}: campo "${field}" requerido`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Construye BrandScript completo desde pasos
 */
export function buildBrandScript(steps: Record<number, any>): typeof DEFAULT_BRAND_SCRIPT {
  return {
    character: steps[1]?.characterWants || '',
    problem: {
      external: steps[2]?.problemExternal || '',
      internal: steps[2]?.problemInternal || '',
      philosophical: steps[2]?.problemPhilosophical || '',
    },
    guide: {
      empathy: steps[3]?.guideEmpathy || '',
      authority: steps[3]?.guideAuthority || '',
    },
    plan: steps[4]?.planSteps || [],
    cta: {
      primary: steps[5]?.ctaPrimary || '',
      secondary: steps[5]?.ctaSecondary || '',
    },
    failure: steps[6]?.failureAvoided || '',
    success: steps[7]?.successAchieved || '',
  };
}

/**
 * Valida alternativa
 */
export function validateAlternative(alt: Partial<Alternative>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!alt.name?.trim()) errors.push('Nombre requerido');
  if (!alt.description?.trim()) errors.push('Descripción requerida');
  if (!['hustle_course', 'spiritual_community', 'traditional_mba', 'trial_error'].includes(alt.category || '')) {
    errors.push('Categoría inválida');
  }
  if (!alt.price?.trim()) errors.push('Precio requerido');
  if (!alt.duration?.trim()) errors.push('Duración requerida');
  if (!alt.promise?.trim()) errors.push('Promesa requerida');
  if (!alt.reality?.trim()) errors.push('Realidad requerida');

  return { valid: errors.length === 0, errors };
}

/**
 * Valida capacidad distintiva
 */
export function validateCapability(cap: Partial<DistinctiveCapability>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!cap.name?.trim()) errors.push('Nombre requerido');
  if (!cap.description?.trim()) errors.push('Descripción requerida');
  if (!cap.evidence?.trim()) errors.push('Evidencia requerida (cómo se demuestra)');

  return { valid: errors.length === 0, errors };
}

/**
 * Valida one-liner
 */
export function validateOneLiner(liner: Partial<OneLiner>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!liner.text?.trim()) errors.push('Texto requerido');
  if (!liner.tag?.trim()) errors.push('Tag requerido');
  if (liner.score !== undefined && (liner.score < 0 || liner.score > 100)) {
    errors.push('Score debe estar entre 0 y 100');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Valida asset de roadmap
 */
export function validateRoadmapAsset(asset: Partial<RoadmapAsset>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!asset.name?.trim()) errors.push('Nombre requerido');
  if (asset.priority !== undefined && (asset.priority < 1 || asset.priority > 20)) {
    errors.push('Prioridad debe estar entre 1 y 20');
  }
  if (asset.deadline && isNaN(Date.parse(asset.deadline))) {
    errors.push('Fecha límite inválida');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Valida competidor
 */
export function validateCompetitor(comp: Partial<CompetitorIntel>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!comp.name?.trim()) errors.push('Nombre requerido');
  if (!comp.price?.trim()) errors.push('Precio requerido');
  if (!comp.messaging?.trim()) errors.push('Mensaje requerido');
  if (!comp.language?.trim()) errors.push('Lenguaje requerido');
  if (!comp.archetype?.trim()) errors.push('Arquetipo requerido');
  if (!comp.buyerJourney?.trim()) errors.push('Buyer journey requerido');
  if (!comp.experience?.trim()) errors.push('Experiencia requerida');

  return { valid: errors.length === 0, errors };
}

/**
 * Valida etapa buyer journey
 */
export function validateBuyerJourneyStage(stage: Partial<BuyerJourneyStage>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!['discovery', 'trust', 'consideration', 'conversion', 'retention'].includes(stage.stage || '')) {
    errors.push('Etapa inválida');
  }
  if (!stage.description?.trim()) errors.push('Descripción requerida');
  if (!Array.isArray(stage.touchpoints) || stage.touchpoints.length === 0) {
    errors.push('Touchpoints requeridos (array no vacío)');
  }
  if (!Array.isArray(stage.frictionPoints) || stage.frictionPoints.length === 0) {
    errors.push('Puntos de fricción requeridos (array no vacío)');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Valida caso de credibilidad
 */
export function validateCredibilityCase(caseData: Partial<CredibilityCase>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!caseData.graduateName?.trim()) errors.push('Nombre del graduado requerido');
  if (!caseData.result?.trim()) errors.push('Resultado concreto requerido');

  return { valid: errors.length === 0, errors };
}

/**
 * Genera resumen ejecutivo copiable
 */
export function generateExecutiveSummary(state: {
  brandScript: any;
  bigIdea: any;
  alternatives: any[];
  capabilities: any[];
  oneLiners: any[];
  roadmap: any[];
  competitors: any[];
  buyerJourney: any[];
  credibilityCases: any[];
  missing: any;
}): string {
  const { brandScript, bigIdea, alternatives, capabilities, oneLiners, roadmap, competitors, buyerJourney, credibilityCases, missing } = state;

  return `
# SOUL.MBA — Executive Summary

## Big Idea
**${bigIdea.title}**
${bigIdea.description}

**Backstory:** ${bigIdea.backstory}
**Personalidad:** ${bigIdea.personality}
**Autoridad:** ${bigIdea.authority.join(', ')}
**Empatía:** ${bigIdea.empathy}

## BrandScript (7 pasos)
1. **Personaje quiere:** ${brandScript.character}
2. **Problema:**
   - Externo: ${brandScript.problem.external}
   - Interno: ${brandScript.problem.internal}
   - Filosófico: ${brandScript.problem.philosophical}
3. **Guía:**
   - Empatía: ${brandScript.guide.empathy}
   - Autoridad: ${brandScript.guide.authority}
4. **Plan:** ${brandScript.plan.join(' → ')}
5. **CTA:** ${brandScript.cta.primary} | ${brandScript.cta.secondary}
6. **Evita (fracaso):** ${brandScript.failure}
7. **Se convierte en (éxito):** ${brandScript.success}

## Alternativas vs SOUL.MBA
${alternatives.map((a, i) => `${i + 1}. **${a.name}** (${a.category}) — ${a.price} / ${a.duration}
   Promesa: ${a.promise}
   Realidad: ${a.reality}`).join('\n\n')}

## Capacidades Distintivas
${capabilities.map((c, i) => `${i + 1}. **${c.name}** — ${c.description} (Evidencia: ${c.evidence})`).join('\n')}

## One-liners Candidatos
${oneLiners.map(l => `• "${l.text}" — ${l.tag} (Score: ${l.score})`).join('\n')}

## Roadmap Assets (${roadmap.length} items)
${roadmap.map(r => `- [${r.done ? 'x' : ' '}] **${r.name}** (Prioridad: ${r.priority})${r.deadline ? ` — Para: ${r.deadline}` : ''}${r.assignee ? ` — ${r.assignee}` : ''}`).join('\n')}

## Competencia (${competitors.length} registrados)
${competitors.length === 0 ? '(Pendiente: completa el quiz de competencia)' : competitors.map(c => `- **${c.name}** (${c.price}) — ${c.messaging}`).join('\n')}

## Buyer Journey
${buyerJourney.length === 0 ? '(Pendiente: completa el quiz de buyer journey)' : buyerJourney.map(b => `- **${b.stage}:** ${b.description} | Touchpoints: ${b.touchpoints.join(', ')} | Fricción: ${b.frictionPoints.join(', ')}`).join('\n')}

## Credibility Bank
${credibilityCases.length === 0 ? '(Pendiente crítico: completa el quiz de casos)' : credibilityCases.map(c => `- **${c.graduateName}:** ${c.result}${c.quote ? ` — "${c.quote}"` : ''}${c.verified ? ' ✓' : ''}`).join('\n')}

## Lo que falta (completa en los quiz)
- **Competencia real:** ${missing.competitors || '(pendiente)'}
- **Buyer journey:** ${missing.buyerJourney || '(pendiente)'}
- **Casos de credibilidad:** ${missing.credibilityCases || '(pendiente)'}
`;
}

/**
 * Genera prompt de marca para Claude
 */
export function generateClaudePrompt(state: any): string {
  return `# VOZ DE MARCA — SOUL.MBA (Decano)

## BIG IDEA
${JSON.stringify(state.bigIdea, null, 2)}

## BRANDSCRIPT (7 PASOS)
${JSON.stringify(state.brandScript, null, 2)}

## ALTERNATIVAS REALES
${JSON.stringify(state.alternatives, null, 2)}

## CAPACIDADES DISTINTIVAS
${JSON.stringify(state.capabilities, null, 2)}

## ONE-LINERS
${JSON.stringify(state.oneLiners, null, 2)}

## ROADMAP
${JSON.stringify(state.roadmap, null, 2)}

## COMPETENCIA
${JSON.stringify(state.competitors, null, 2)}

## BUYER JOURNEY
${JSON.stringify(state.buyerJourney, null, 2)}

## CREDIBILITY CASES
${JSON.stringify(state.credibilityCases, null, 2)}

## MISSING (COMPLETA EN QUIZ)
${JSON.stringify(state.missing, null, 2)}

---
COPIA ESTE BLOQUE Y PÉGALO AL INICIO DE CUALQUIER CHAT DE CLAUDE.
PÍDELE: "Escribe en la voz de Soul.MBA usando este canon."
`;
}

/**
 * Calcula score de completitud del BrandScript
 */
export function calculateCompleteness(state: {
  brandScript: any;
  alternatives: any[];
  capabilities: any[];
  oneLiners: any[];
  roadmap: any[];
  competitors: any[];
  buyerJourney: any[];
  credibilityCases: any[];
}): number {
  let score = 0;
  let maxScore = 0;

  // BrandScript (7 pasos) - 30%
  const scriptFields = [
    'character',
    'problem.external', 'problem.internal', 'problem.philosophical',
    'guide.empathy', 'guide.authority',
    'plan', 'cta.primary', 'cta.secondary',
    'failure', 'success'
  ];
  let scriptScore = 0;
  for (const field of scriptFields) {
    const value = field.split('.').reduce((obj, key) => obj?.[key], state.brandScript);
    if (value && (Array.isArray(value) ? value.length > 0 : value.trim())) scriptScore++;
  }
  score += (scriptScore / scriptFields.length) * 30;

  // Alternativas (4 mínimas) - 15%
  score += Math.min(state.alternatives.length / 4, 1) * 15;

  // Capacidades (4 mínimas) - 15%
  score += Math.min(state.capabilities.length / 4, 1) * 15;

  // One-liners (4 candidatos) - 10%
  score += Math.min(state.oneLiners.length / 4, 1) * 10;

  // Roadmap (18 items) - 10%
  score += Math.min(state.roadmap.length / 18, 1) * 10;

  // Competencia (3+ reales) - 10%
  score += Math.min(state.competitors.length / 3, 1) * 10;

  // Buyer Journey (5 etapas) - 5%
  score += Math.min(state.buyerJourney.length / 5, 1) * 5;

  // Credibility Cases (3+ casos) - 5%
  score += Math.min(state.credibilityCases.length / 3, 1) * 5;

  return Math.round(score);
}

/**
 * Exporta resumen a texto plano para copiar
 */
export function copySummary(state: any): string {
  return generateExecutiveSummary(state);
}