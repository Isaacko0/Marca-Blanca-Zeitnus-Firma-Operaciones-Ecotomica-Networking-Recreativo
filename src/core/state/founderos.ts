// src/core/state/founderos.ts
// Estado del módulo FounderOS Business Command Center — ALRAC/Zeitnus.

import type {
  Departamento,
  Agente,
  Tarea,
  Run,
  Cron,
  Skill,
  Workflow,
  Deal,
  Campaign,
  Drift,
  KnowledgeGraph,
  Operador,
  Dashboard,
} from '../lib/founderos';

export interface FounderosState {
  departamentos: Departamento[];
  agentes: Agente[];
  tareas: Tarea[];
  runs: Run[];
  crons: Cron[];
  skills: Skill[];
  workflows: Workflow[];
  deals: Deal[];
  campaigns: Campaign[];
  drifts: Drift[];
  knowledgeGraphs: KnowledgeGraph[];
  operador: Operador | null;
  dashboard: Dashboard | null;
}

export function makeFounderosState(): FounderosState {
  return {
    departamentos: [],
    agentes: [],
    tareas: [],
    runs: [],
    crons: [],
    skills: [],
    workflows: [],
    deals: [],
    campaigns: [],
    drifts: [],
    knowledgeGraphs: [],
    operador: null,
    dashboard: null,
  };
}
