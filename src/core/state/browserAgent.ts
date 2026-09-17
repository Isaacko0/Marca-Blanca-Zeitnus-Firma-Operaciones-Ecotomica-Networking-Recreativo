// BrowserAgent State — asimilado de Jev Ultrafast (browser agent ultrafast)
// Anfibio: modo offline (cached selectors) / online (fetch real)

export interface BrowserAction {
  id: string
  kind: 'click' | 'fill' | 'select' | 'scroll' | 'wait'
  label: string
  role?: string
  value?: string
  node: number
  current_value?: string
  options?: { index: string; label: string; value: string }[]
}

export interface BrowserElement {
  index: string
  label: string
  role?: string
  value?: string
  checked?: boolean
  selected?: boolean
  expanded?: boolean
  operations: string[]
  options?: { index: string; label: string; value: string }[]
}

export interface BrowserDecision {
  choice: string
  operation: string
  target: string | null
  confidence: number
  probabilities: Record<string, number>
  operation_probabilities: Record<string, number>
  target_probabilities: Record<string, number>
  target_confidence: number | null
  model: string
  usage: Record<string, number>
  latency_ms: number
}

export interface BrowserHistoryEntry {
  step: number
  action: string
  kind: string
  choice: string
  probability: number
  confidence: number
  latency_ms: number
  text: string | null
  text_helper: string | null
  text_latency_ms: number
  operation: string
  target: string | null
  page_changed: boolean
  url: string
  executed_ms: number
  elapsed_ms: number
}

export interface BrowserAgentState {
  url: string
  goal: string
  elements: BrowserElement[]
  actions: BrowserAction[]
  controls: Record<string, BrowserAction>
  decision: BrowserDecision | null
  history: BrowserHistoryEntry[]
  status: 'ready' | 'predicted' | 'running' | 'done' | 'blocked' | 'error'
  page: {
    url: string
    title: string
    text: string
    fingerprint: string
    page_key: string
    guards: Record<string, string>
    actions: BrowserAction[]
    scroll: number
    screenshot?: string
  } | null
  text_calls: { field: string; value: string; model: string; latency_ms: number; usage: Record<string, number> }[]
  pending_text: { context: object; text: string; helper: object } | null
  plan: string[]
  plan_index: number
  started_at: number | null
  elapsed_ms: number
  screenshots_enabled: boolean
  record_dir: string | null
}

export const makeBrowserAgentState = (): BrowserAgentState => ({
  url: '',
  goal: '',
  elements: [],
  actions: [],
  controls: {},
  decision: null,
  history: [],
  status: 'ready',
  page: null,
  text_calls: [],
  pending_text: null,
  plan: [],
  plan_index: 0,
  started_at: null,
  elapsed_ms: 0,
  screenshots_enabled: false,
  record_dir: null,
})
