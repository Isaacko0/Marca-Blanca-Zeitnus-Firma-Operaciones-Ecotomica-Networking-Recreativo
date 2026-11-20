// src/core/lib/rnmd-humanware.ts
// Marco modular RNMD — capa humanware.
// Arquetipos de participación, bienestar individual/colectivo, Ikigai (propósito).
// Lógica pura en TypeScript. No copia código ni assets de RegenTribe.

export type ArchetypeKey =
  | 'vision-holder'
  | 'community-member'
  | 'service-provider'
  | 'resource-holder'
  | 'land-guardian'
  | 'collaborator';

export interface Archetype {
  key: ArchetypeKey;
  label: string;
  role: string;
  requirements: string[];
  canVote: boolean;
  canPropose: boolean;
}

export interface WellbeingAssessment {
  individual: number;   // 0-1: salud, seguridad, aceptación, felicidad, creación, realización
  collective: number;   // 0-1: conexión social, propósito compartido
  nature: number;       // 0-1: conexión con naturaleza
  purpose: number;      // 0-1: Ikigai, camino al propósito
  score: number;        // promedio 0-1
  level: 'bajo' | 'medio' | 'alto';
}

/**
 * Los 6 arquetipos RNMD con roles y permisos base.
 */
export const RNMD_ARCHETYPES: Archetype[] = [
  {
    key: 'vision-holder',
    label: 'Vision Holder',
    role: 'Lidera la creación de un barrio regenerativo',
    requirements: ['visión clara', 'compromiso intergeneracional'],
    canVote: true,
    canPropose: true,
  },
  {
    key: 'community-member',
    label: 'Community Member',
    role: 'Vive en el barrio regenerativo',
    requirements: ['residencia o intención de residir'],
    canVote: true,
    canPropose: false,
  },
  {
    key: 'service-provider',
    label: 'Service Provider',
    role: 'Ofrece habilidades y servicios para construir el barrio',
    requirements: ['habilidad verificable'],
    canVote: true,
    canPropose: false,
  },
  {
    key: 'resource-holder',
    label: 'Resource Holder',
    role: 'Ofrece inversión para crear el barrio',
    requirements: ['recursos asignables'],
    canVote: false,
    canPropose: false,
  },
  {
    key: 'land-guardian',
    label: 'Land Guardian',
    role: 'Ofrece tierra para crear el barrio',
    requirements: ['tenencia o custodia de tierra'],
    canVote: false,
    canPropose: true,
  },
  {
    key: 'collaborator',
    label: 'Collaborator',
    role: 'Ayuda a expandir el blueprint',
    requirements: ['voluntad de contribuir'],
    canVote: false,
    canPropose: true,
  },
] as const;

/**
 * Obtiene un arquetipo por su clave.
 */
export function getArchetype(key: ArchetypeKey): Archetype | undefined {
  return RNMD_ARCHETYPES.find((a) => a.key === key);
}

/**
 * Evalúa bienestar en 4 dimensiones: individual, colectivo, naturaleza, propósito.
 * Cada una en escala 0-1. Score = promedio. Nivel: bajo (<0.4), medio (0.4-0.7), alto (>0.7).
 */
export function assessWellbeing(
  individual: number,
  collective: number,
  nature: number,
  purpose: number,
): WellbeingAssessment {
  const clamp = (v: number) => Math.min(Math.max(v, 0), 1);
  const i = clamp(individual);
  const c = clamp(collective);
  const n = clamp(nature);
  const p = clamp(purpose);
  const score = (i + c + n + p) / 4;
  const level = score < 0.4 ? 'bajo' : score < 0.7 ? 'medio' : 'alto';
  return { individual: i, collective: c, nature: n, purpose: p, score, level };
}
