// AgentCanvas Logic — asimilado de OpenHands

import type { CanvasAgent, CanvasAutomation, CanvasState } from '@core/state/agentCanvas'

let counter = 0
const uid = (prefix: string) => `${prefix}_${Date.now()}_${++counter}`

export const addCanvasAgent = (state: CanvasState, name: string, backend: CanvasAgent['backend'], capabilities: string[]): CanvasState => ({
  ...state,
  agents: [...state.agents, {
    id: uid('agent'),
    name,
    backend,
    status: 'idle',
    capabilities,
    lastTask: null,
    createdAt: Date.now(),
  }],
})

export const toggleAgentStatus = (state: CanvasState, agentId: string): CanvasState => ({
  ...state,
  agents: state.agents.map(a =>
    a.id === agentId
      ? { ...a, status: a.status === 'running' ? 'paused' : 'running' }
      : a
  ),
})

export const addAutomation = (state: CanvasState, name: string, schedule: string, agentId: string, task: string): CanvasState => ({
  ...state,
  automations: [...state.automations, {
    id: uid('auto'),
    name,
    schedule,
    agentId,
    task,
    enabled: true,
    lastRun: null,
  }],
})

export const logCanvasAction = (state: CanvasState, agentId: string, action: string, status: 'success' | 'error'): CanvasState => ({
  ...state,
  logs: [...state.logs, {
    id: uid('log'),
    ts: Date.now(),
    agentId,
    action,
    status,
  }],
})
