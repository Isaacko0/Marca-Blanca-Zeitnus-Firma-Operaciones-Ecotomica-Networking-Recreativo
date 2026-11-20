// src/core/lib/rnmd-software.ts
// Marco modular RNMD — capa software / My.Co.Net.
// Aplicación con LLM integrada para gestión de barrio regenerativo.
// Lógica pura en TypeScript. La LLM es enriquecedor, nunca sustituto del juicio humano.
// No copia código ni assets de RegenTribe ni de My.Co.Net.

export interface LLMEnrichment {
  query: string;
  domain: string;
  insights: string[];
  recommendations: string[];
  humanInLoop: boolean; // siempre true: el humano valida, la LLM no decide sola
  timestamp: number;
}

export interface SoftwareModule {
  id: string;
  name: string; // ej. 'My.Co.Net'
  llmEnabled: boolean;
  humanInLoop: boolean;
  domain: string;
  raoCredentialId: string;
  isPublic: boolean;
  createdAt: number;
}

/**
 * Registra un módulo de software con LLM integrada.
 * Siempre exige humanInLoop = true.
 */
export function registerSoftwareModule(
  module: Omit<SoftwareModule, 'id' | 'createdAt'>,
): SoftwareModule {
  if (!module.humanInLoop) {
    throw new Error('rnmd-software: humanInLoop es obligatorio (LLM no autónoma)');
  }
  if (!module.raoCredentialId) {
    throw new Error('rnmd-software: raoCredentialId requerido');
  }
  return {
    ...module,
    id: `sw-${Date.now()}`,
    createdAt: Date.now(),
    isPublic: true,
  };
}

/**
 * Enriquece una consulta con LLM (estilo regenerative-agent.ts).
 * La LLM aporta insights y recomendaciones; el humano tiene la última palabra.
 */
export function llmIntegratedApp(
  query: string,
  domain: string = 'community',
  context: unknown = {},
): LLMEnrichment {
  // Enriquecimiento determinista basado en keywords (no llama a LLM externa en esta capa pura)
  const insights: string[] = [];
  const recommendations: string[] = [];

  const q = query.toLowerCase();
  if (q.includes('agua') || q.includes('water')) {
    insights.push('Gestión de agua: verificar swales, captación y almacenamiento');
    recommendations.push('Revisar nivel freático y calidad de agua antes de expandir');
  }
  if (q.includes('comida') || q.includes('food')) {
    insights.push('Producción de alimentos: verificar policultivo y agroforestería');
    recommendations.push('Mantener 5+ especies por 10m² y 20 por hectárea');
  }
  if (q.includes('energía') || q.includes('energy')) {
    insights.push('Energía: verificar fuentes renovables y almacenamiento');
    recommendations.push('Dimensionar según consumo real del barrio');
  }
  if (q.includes('gobernanza') || q.includes('governance')) {
    insights.push('Gobernanza: verificar quórum y veto ecológico de Guardians');
    recommendations.push('Asegurar participación por presencia, no solo por tenencia');
  }
  if (insights.length === 0) {
    insights.push('Consulta recibida; dominio: ' + domain);
    recommendations.push('Especificar el área de interés para enriquecimiento dirigido');
  }

  return {
    query,
    domain,
    insights,
    recommendations,
    humanInLoop: true,
    timestamp: Date.now(),
  };
}
