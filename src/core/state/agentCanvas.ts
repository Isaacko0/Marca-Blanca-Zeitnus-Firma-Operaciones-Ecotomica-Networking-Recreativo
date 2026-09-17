// AgentCanvas State — asimilado de OpenHands (agent control center)
// Multi-agente, automations, audit trail

export interface CanvasAgent {
  id: string
  name: string
  backend: 'local' | 'docker' | 'cloud'
  status: 'idle' | 'running' | 'paused' | 'error'
  capabilities: string[]
  lastTask: string | null
  createdAt: number
}

export interface CanvasAutomation {
  id: string
  name: string
  schedule: string // cron expression
  agentId: string
  task: string
  enabled: boolean
  lastRun: number | null
}

export interface CanvasState {
  agents: CanvasAgent[]
  automations: CanvasAutomation[]
  logs: { id: string; ts: number; agentId: string; action: string; status: 'success' | 'error' }[]
}

export const makeCanvasState = (): CanvasState => ({
  agents: [],
  automations: [],
  logs: [],
})
