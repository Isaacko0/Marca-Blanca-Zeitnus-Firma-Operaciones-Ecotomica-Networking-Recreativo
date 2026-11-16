// Brand Voice — Lógica Pura
// Funciones puras para voz: filtro vocabulario, check tono, render quotes

import type { BrandVoiceState, VocabularyRule, VoiceQuote, DoDontPair, VoiceArchetype, AudienceProfile, VoiceTraitDetail } from '@core/state/brand-voice';
import {
  DEFAULT_VOICE_ARCHETYPE,
  DEFAULT_AUDIENCE,
  DEFAULT_TRAITS,
  DEFAULT_VOCABULARY,
  DEFAULT_DO_DONT,
  DEFAULT_QUOTES,
  DEFAULT_AUDIENCE_VOCAB,
} from '@core/state/brand-voice';

/**
 * Filtra vocabulario prohibido y sugiere reemplazos
 */
export function filterVocabulary(
  state: BrandVoiceState,
  text: string
): { clean: string; flags: Array<{ forbidden: string; replacement: string; index: number }> } {
  let clean = text;
  const flags: Array<{ forbidden: string; replacement: string; index: number }> = [];

  for (const rule of state.vocabulary) {
    const regex = new RegExp(rule.forbidden.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      flags.push({
        forbidden: rule.forbidden,
        replacement: rule.replacement,
        index: match.index,
      });
      // Reemplaza en clean
      clean = clean.replace(regex, rule.replacement);
    }
  }

  return { clean, flags };
}

/**
 * Verifica tono del texto (score 0-100)
 */
export function checkTone(
  state: BrandVoiceState,
  text: string
): { score: number; flags: string[] } {
  let score = 100;
  const flags: string[] = [];

  // Verifica vocabulario prohibido
  const { flags: vocabFlags } = filterVocabulary(state, text);
  if (vocabFlags.length > 0) {
    score -= vocabFlags.length * 10;
    vocabFlags.forEach(f => flags.push(`Vocabulario: "${f.forbidden}" → "${f.replacement}"`));
  }

  // Verifica longitud de oraciones (afirma = frases cortas)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgWords = sentences.reduce((sum, s) => sum + s.trim().split(/\s+/).length, 0) / (sentences.length || 1);
  if (avgWords > 20) {
    score -= 10;
    flags.push('Oraciones muy largas (promedio >20 palabras). Afirma con frases cortas.');
  }

  // Verifica uso de "tú" vs "usted" (cercano = tú)
  const ustedCount = (text.match(/\busted\b/gi) || []).length;
  const tuCount = (text.match(/\bt[uú]\b/gi) || []).length;
  if (ustedCount > tuCount) {
    score -= 5;
    flags.push('Usa "tú" en lugar de "usted" (cercano, no condescendiente).');
  }

  // Verifica signos de exclamación (filoso = humor, no exclamaciones genéricas)
  const exclCount = (text.match(/!/g) || []).length;
  if (exclCount > 2) {
    score -= 5;
    flags.push('Demasiadas exclamaciones. El humor existe para que el punto se quede, no para llenar espacio.');
  }

  // Verifica palabras de "promesa" vs "afirmación"
  const promiseWords = ['vas a lograr', 'vas a conseguir', 'transformarás', 'descubrirás', 'desbloquearás'];
  const promiseCount = promiseWords.reduce((count, w) => count + (text.toLowerCase().match(new RegExp(w, 'g')) || []).length, 0);
  if (promiseCount > 0) {
    score -= promiseCount * 15;
    flags.push('Lenguaje de promesa detectado. Afirma hechos, no prometas resultados.');
  }

  return { score: Math.max(0, score), flags };
}

/**
 * Renderiza una cita de firma
 */
export function renderQuote(quote: VoiceQuote): React.ReactNode {
  return (
    <blockquote style={{ margin: 0, fontStyle: 'italic', fontSize: '18px', lineHeight: '1.4', color: 'var(--text-primary)' }}>
      {quote.text}
      <footer style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-tertiary)', fontStyle: 'normal' }}>
        {quote.tag} {quote.views && `· ${quote.views}`}
      </footer>
    </blockquote>
  );
}

/**
 * Obtiene arquetipo por defecto
 */
export function getDefaultArchetype(): VoiceArchetype {
  return {
    name: 'El Decano que no le teme a incomodar',
    backstory: '30+ empresas construidas hasta encontrar la primera que no le costó el alma, 1000+ conferencias en 8 países, 4 TEDx, certificación Business Made Simple de Donald Miller. Personalidad: contraintuitiva y provocadora — pero siempre con evidencia detrás, nunca solo opinión.',
    personality: 'Contraintuitivo, provocador, con evidencia — nunca solo opinión. Habla como quien ya pasó por lo mismo.',
    authority: ['Happpy: 200+ graduados en <1 año, negocio millonario', '4 TEDx', '1000+ conferencias en 8 países', 'Certificación Business Made Simple (Donald Miller)'],
    empathy: 'Ya vivió el mismo sacrificio 30+ veces. No le explica al lector como si fuera nuevo en esto.',
  };
}

/**
 * Verifica si un texto usa vocabulario de audiencia correcto
 */
export function checkAudienceVocab(text: string): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const forbidden = ['emprendedor', 'empresario'];
  const required = ['soulpreneur'];

  for (const word of forbidden) {
    if (new RegExp(`\\b${word}\\b`, 'i').test(text)) {
      issues.push(`"${word}" → usar "soulpreneur"`);
    }
  }

  return { valid: issues.length === 0, issues };
}

/**
 * Genera prompt completo de marca para Claude
 */
export function generateBrandPrompt(state: {
  archetype: any;
  traits: any;
  vocabulary: any[];
  doDont: any[];
  quotes: any[];
  audienceVocab: any;
}): string {
  return `# VOZ DE MARCA — SOUL.MBA (Decano)

## ARQUETIPO
${JSON.stringify(state.archetype, null, 2)}

## 5 RASGOS TONALES
${Object.entries(state.traits).map(([k, v]) => `### ${k.toUpperCase()}\n${v.description}\n✅ ${v.example}\n❌ ${v.antiExample}`).join('\n\n')}

## VOCABULARIO ESTRICTO (NUNCA ROMPER)
${state.vocabulary.map(v => `- "${v.forbidden}" → "${v.replacement}" (${v.severity})`).join('\n')}

## ASÍ / ASÍ NO
${state.doDont.map(d => `✅ ${d.do}\n❌ ${d.dont}`).join('\n\n')}

## FRASES DE FIRMA (CANON)
${state.quotes.map(q => `"${q.text}" — ${q.tag}`).join('\n')}

## VOCABULARIO DE AUDIENCIA
Héroe: ${state.audienceVocab.hero}
No héroe: ${state.audienceVocab.notHero.join(', ')}
Problema: ${state.audienceVocab.problem}
Villano: ${state.audienceVocab.villano}
Guía: ${state.audienceVocab.guide}
Plan: ${state.audienceVocab.plan}
Éxito: ${state.audienceVocab.success}
Fracaso: ${state.audienceVocab.failure}

---
COPIA ESTE BLOQUE Y PÉGALO AL INICIO DE CUALQUIER CHAT DE CLAUDE.
PÍDELE: "Escribe en la voz de Soul.MBA usando este canon."
`;
}

/**
 * Genera grid Así/Así no para UI
 */
export function generateDoDontGrid(pairs: DoDontPair[]): string {
  return pairs.map(p => `✅ ${p.do}\n❌ ${p.dont}`).join('\n\n');
}

/**
 * Obtiene todas las frases de firma
 */
export function getSignatureQuotes(): string[] {
  return [
    '"A Batman le valen madre los niños de África. Solo le importan los de Ciudad Gótica."',
    '"El tema no solo es qué dices ni cómo lo dices, sino cómo lo dices de forma que nadie más nunca lo pueda decir porque te lo dañaste tú."',
    '"La pasión es para perdedores. No se puede descubrir porque no está fuera, está adentro."',
    '"Con una gran responsabilidad viene un gran poder."',
    '"Entre más vidas cambias, más cambia tu vida."',
    '"Ellos son los héroes de esta historia — yo solo subo al escenario a darles el mensaje que los pone en acción."',
  ];
}

/**
 * Verifica consistencia de voz en un texto largo
 */
export function auditVoiceConsistency(text: string, state: any): {
  score: number;
  breakdown: {
    vocabulary: number;
    sentenceLength: number;
    pronouns: number;
    promises: number;
    exclamations: number;
  };
  recommendations: string[];
} {
  const { clean, flags } = filterVocabulary({ vocabulary: [] }, text); // placeholder
  // Implementación completa requeriría state completo
  return {
    score: 100,
    breakdown: { vocabulary: 100, sentenceLength: 100, pronouns: 100, promises: 100, exclamations: 100 },
    recommendations: [],
  };
}