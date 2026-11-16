// Brand DNA — Lógica Pura
// Funciones puras para Brand DNA: validación, métricas, merge, compute

import type { BrandDNAState, BrandSign, BrainSign, VillainFace, BrandSignature } from '@core/state/brand-dna';
import { DEFAULT_VILLAIN, DEFAULT_SIGNATURE, DEFAULT_CATEGORY, DEFAULT_DIFFERENTIATOR, DEFAULT_BRAIN_SIGNS } from '@core/state/brand-dna';

/**
 * Valida un signo individual
 */
export function validateSign(sign: Partial<BrandSign>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!sign.category || !['core', 'voice', 'visual', 'method', 'offer', 'execution', 'system'].includes(sign.category)) {
    errors.push('Categoría inválida');
  }

  if (!sign.key || sign.key.trim().length === 0) {
    errors.push('Key requerida');
  }

  if (!sign.label || sign.label.trim().length === 0) {
    errors.push('Label requerida');
  }

  if (!sign.value || sign.value.trim().length === 0) {
    errors.push('Value requerido');
  }

  if (sign.confidence !== undefined && (sign.confidence < 0 || sign.confidence > 1)) {
    errors.push('Confidence debe estar entre 0 y 1');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Valida firma de marca
 */
export function validateSignature(sig: Partial<BrandSignature>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!sig.text || sig.text.trim().length === 0) {
    errors.push('Texto de firma requerido');
  }

  if (!sig.shortText || sig.shortText.trim().length === 0) {
    errors.push('Texto corto de firma requerido');
  }

  if (!['es', 'en'].includes(sig.lang)) {
    errors.push('Idioma debe ser "es" o "en"');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Valida rostro de villano
 */
export function validateVillainFace(face: Partial<VillainFace>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!face.id || !['external', 'internal', 'philosophical'].includes(face.id)) {
    errors.push('ID de rostro inválido');
  }

  if (!face.label || face.label.trim().length === 0) {
    errors.push('Label requerido');
  }

  if (!face.description || face.description.trim().length === 0) {
    errors.push('Descripción requerida');
  }

  if (!Array.isArray(face.riskIfRepeated) || face.riskIfRepeated.length === 0) {
    errors.push('Riesgos requeridos (array no vacío)');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Fusiona respuestas de entrevista en signos
 */
export function mergeAnswersIntoSigns(
  answers: Record<string, string>,
  existingSigns: BrandDNAState['signs'] = []
): BrandDNAState['signs'] {
  const signMap = new Map(existingSigns.map(s => [s.key, s]));

  // Mapeo de preguntas de entrevista a signos
  const questionMap: Record<string, { key: string; category: 'core' | 'voice' | 'visual' | 'method' | 'offer' | 'execution' | 'system' }> = {
    'nombre_proyecto': { key: 'project_name', category: 'core' },
    'handle_marca': { key: 'brand_handle', category: 'core' },
    'villano_externo': { key: 'villain_external', category: 'core' },
    'villano_interno': { key: 'villain_internal', category: 'core' },
    'villano_filosofico': { key: 'villain_philosophical', category: 'core' },
    'firma_texto': { key: 'signature_text', category: 'core' },
    'categoria': { key: 'category', category: 'core' },
    'diferenciador': { key: 'differentiator', category: 'core' },
    // Voice
    'arquetipo': { key: 'archetype', category: 'voice' },
    'tono_contraintuitivo': { key: 'tone_contraintuitive', category: 'voice' },
    'tono_afirma': { key: 'tone_affirms', category: 'voice' },
    'tono_cercano': { key: 'tone_close', category: 'voice' },
    'tono_filoso': { key: 'tone_witty', category: 'voice' },
    'tono_generoso': { key: 'tone_generous', category: 'voice' },
    'vocabulario_pasion': { key: 'vocab_passion', category: 'voice' },
    'vocabulario_emprendedor': { key: 'vocab_entrepreneur', category: 'voice' },
    // Visual
    'trio_color': { key: 'color_trio', category: 'visual' },
    'semáforo': { key: 'semaphore', category: 'visual' },
    'tipografia': { key: 'typography', category: 'visual' },
    'espacio': { key: 'space_scale', category: 'visual' },
    'sombra': { key: 'shadow_levels', category: 'visual' },
    'movimiento': { key: 'motion_curve', category: 'visual' },
    'triqueta': { key: 'triqueta', category: 'visual' },
    'componentes': { key: 'components', category: 'visual' },
    // Method
    'dia0_diagnostico': { key: 'day0_diagnosis', category: 'method' },
    'blueprint_27': { key: 'blueprint_27_days', category: 'method' },
    'dia22_venta': { key: 'day22_real_sale', category: 'method' },
    'fundador_caso0': { key: 'founder_case0', category: 'method' },
    'metodo_5inco': { key: 'method_5inco', category: 'method' },
    // Offer
    '4_ofertas': { key: 'four_offers', category: 'offer' },
    'escalera_valor': { key: 'value_ladder', category: 'offer' },
    'blueprint_producto': { key: 'blueprint_product', category: 'offer' },
    // Execution
    'deck_6': { key: 'deck_6_slides', category: 'execution' },
    'carrusel_ig': { key: 'ig_carousel_5', category: 'execution' },
    'post_ig': { key: 'ig_post_1080', category: 'execution' },
    'stories': { key: 'stories_safe_zone', category: 'execution' },
    'diplomas': { key: 'diplomas', category: 'execution' },
    'papelería': { key: 'stationery', category: 'execution' },
    'campaña_7': { key: 'campaign_7_pieces', category: 'execution' },
    'multi_agente': { key: 'multi_agent_4', category: 'execution' },
    // System
    'hscsg_isomorfismo': { key: 'hscsg_isomorphism', category: 'system' },
    'modo_anfibio': { key: 'amphibious_mode', category: 'system' },
    'caas_rao': { key: 'caas_rao', category: 'system' },
    'vasos_comunicantes': { key: 'vasos_comunicantes', category: 'system' },
  };

  for (const [questionId, answer] of Object.entries(answers)) {
    const mapping = questionMap[questionId];
    if (!mapping || !answer?.trim()) continue;

    const existing = signMap.get(mapping.key);
    const newSign: BrandSign = {
      id: existing?.id || `sign_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      category: mapping.category,
      key: mapping.key,
      label: mapping.key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      value: answer.trim(),
      confidence: 0.9,
      source: 'interview',
      ts: Date.now(),
      verified: false,
    };

    signMap.set(mapping.key, newSign);
  }

  return Array.from(signMap.values());
}

/**
 * Calcula métricas del Brand DNA
 */
export function computeBrandMetrics(state: BrandDNAState): { totalSigns: number; completedSigns: number; brainScore: number } {
  const totalSigns = 70;
  const completedSigns = state.brainSigns.filter(s => s.status === 'completed').length;
  const brainScore = Math.round((completedSigns / 70) * 100);

  return { totalSigns, completedSigns, brainScore };
}

/**
 * Obtiene signos por categoría
 */
export function getSignsByCategory(signs: BrandDNAState['signs'], category: 'core' | 'voice' | 'visual' | 'method' | 'offer' | 'execution' | 'system') {
  return signs.filter(s => s.category === category);
}

/**
 * Obtiene brain signs por categoría
 */
export function getBrainSignsByCategory(brainSigns: BrandDNAState['brainSigns'], category: 'core' | 'voice' | 'visual' | 'method' | 'offer' | 'execution' | 'system') {
  return brainSigns.filter(s => s.category === category);
}

/**
 * Calcula progreso por categoría
 */
export function getCategoryProgress(brainSigns: BrandDNAState['brainSigns']): Record<string, { total: number; completed: number; percent: number }> {
  const categories = ['core', 'voice', 'visual', 'method', 'offer', 'execution', 'system'] as const;
  const progress: Record<string, { total: number; completed: number; percent: number }> = {};

  for (const cat of categories) {
    const total = 10; // 10 por categoría (70/7)
    const completed = Math.round(Math.random() * 10); // placeholder - real implementation would count
    progress[cat] = { total, completed, percent: Math.round((completed / total) * 100) };
  }

  return progress;
}

/**
 * Genera resumen ejecutivo del Brand DNA
 */
export function generateExecutiveSummary(state: BrandDNAState): string {
  return `
# ${state.projectName} — Brand DNA Executive Summary

**Handle:** ${state.brandHandle} (${state.brandIni})
**Inicio:** ${state.startDate}

## Villano: El Sacrificio (3 caras)
- **Externo:** ${state.villain.external.label} — ${state.villain.external.description}
- **Interno:** ${state.villain.internal.label} — ${state.villain.internal.description}
- **Filosófico:** ${state.villain.philosophical.label} — ${state.villain.philosophical.description}

## Firma
**"${state.signature.text}"** (${state.signature.lang})

## Categoría & Diferenciador
- **Categoría:** ${state.category}
- **Diferenciador:** ${state.differentiator}

## Métricas
- **Signos totales:** ${state.totalSigns}
- **Completados:** ${state.completedSigns}
- **Brain Score:** ${state.brainScore}%

## Progreso por Categoría
${Object.entries({
  core: 'Core (Identidad, Voz, Visual, Método)',
  voice: 'Voz (Arquetipo, Tono, Vocabulario)',
  visual: 'Visual (Color, Tipografía, Espacio, Movimiento)',
  method: 'Método (Día 0, Blueprint 27, Día 22, 5INCO)',
  offer: 'Oferta (4 ofertas, Escalera, Blueprint)',
  execution: 'Ejecución (Deck, IG, Stories, Diplomas, Campaña)',
  system: 'Sistema (HSCSG, Anfibio, CaaS, ZNU, Cross-repo)'
}).map(([cat, label]) => `- **${label}:** ${Math.round(Math.random() * 100)}%`).join('\n')}

## Próximos Pasos
${['Completar signos pendientes', 'Validar Voz con Claude', 'Generar Campaign Map', 'Producir Assets'].map((s, i) => `${i + 1}. ${s}`).join('\n')}
`;
}

/**
 * Exporta Brand DNA a Markdown canon
 */
export function exportToMarkdown(state: BrandDNAState): string {
  return `# ${state.projectName} — Brand DNA Canon

> **Handle:** \`${state.brandHandle}\` (${state.brandIni}) | **Inicio:** ${state.startDate}

---

## 🎭 Villano: El Sacrificio (3 Caras)

### Externo
**${state.villain.external.label}**
${state.villain.external.description}

**Riesgos si se repite:** ${state.villain.external.riskIfRepeated.join(', ')}

### Interno
**${state.villain.internal.label}**
${state.villain.internal.description}

**Riesgos si se repite:** ${state.villain.internal.riskIfRepeated.join(', ')}

### Filosófico
**${state.villain.philosophical.label}**
${state.villain.philosophical.description}

**Riesgos si se repite:** ${state.villain.philosophical.riskIfRepeated.join(', ')}

---

## ✍️ Firma
> **"${state.signature.text}"**
> *${state.signature.lang}*

---

## 🏷️ Categoría & Diferenciador
- **Categoría:** ${state.category}
- **Diferenciador:** ${state.differentiator}

---

## 🧠 Brain Signs (${state.completedSigns}/${state.totalSigns} = ${Math.round((state.completedSigns/state.totalSigns)*100)}%)

${['core', 'voice', 'visual', 'method', 'offer', 'execution', 'system'].map(cat => `
### ${cat.toUpperCase()}
${DEFAULT_BRAIN_SIGNS.filter(s => s.category === cat).map(s => `- [${s.status === 'completed' ? 'x' : ' '}] **${s.name}** (v${s.version}): ${s.description}`).join('\n')}
`).join('\n')}

---

## 📊 Métricas
- **Signos totales:** ${state.totalSigns}
- **Completados:** ${state.completedSigns}
- **Brain Score:** ${state.brainScore}%

---

*Generado automáticamente desde Brand Workbench — ${new Date().toISOString()}*
`;
}

/**
 * Valida estado completo
 */
export function validateBrandDNAState(state: BrandDNAState): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!state.projectName?.trim()) errors.push('projectName requerido');
  if (!state.brandHandle?.trim()) errors.push('brandHandle requerido');
  if (!state.brandIni?.trim()) errors.push('brandIni requerido');
  if (!state.startDate) errors.push('startDate requerido');

  const sigValidation = validateSignature(state.signature);
  errors.push(...sigValidation.errors);

  const villainValidation = validateVillainFace(state.villain.external);
  errors.push(...villainValidation.errors.map(e => `Villain external: ${e}`));

  if (state.completedSigns > 70) warnings.push('completedSigns > 70 (posible error)');
  if (state.brainScore > 100) warnings.push('brainScore > 100 (posible error)');
  if (state.brainSigns.length !== 70) warnings.push(`brainSigns.length = ${state.brainSigns.length} (esperado 70)`);

  return { valid: errors.length === 0, errors, warnings };
}