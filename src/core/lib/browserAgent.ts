// BrowserAgent Logic — asimilado de Jev Ultrafast
// Loop: observe → action_space → choose (TypeSafe/local) → act → observe

import type { BrowserAgentState, BrowserAction, BrowserElement, BrowserDecision, BrowserHistoryEntry } from '@core/state/browserAgent'

const OPERATIONS = { click: 'CLICK', fill: 'TYPE_TEXT', select: 'SELECT' } as const

export const actionSpace = (actions: BrowserAction[]): [BrowserElement[], Record<string, Record<string, BrowserAction>>, Record<string, BrowserAction>] => {
  const elements: BrowserElement[] = []
  const indices: Record<string, string> = {}
  const targets: Record<string, Record<string, BrowserAction>> = {}
  const controls: Record<string, BrowserAction> = {}

  for (const action of actions) {
    const kind = action.kind
    if (!Object.keys(OPERATIONS).includes(kind)) {
      controls[action.id] = action
      continue
    }
    const node = action.node
    if (!(node in indices)) {
      const index = String(elements.length + 1)
      indices[String(node)] = index
      const element: BrowserElement = {
        index,
        label: action.label.split(' → ')[0],
        operations: [],
      }
      if (action.role) element.role = action.role
      if (action.value !== undefined) element.value = action.value
      if (action.checked !== undefined) element.checked = action.checked
      if (action.selected !== undefined) element.selected = action.selected
      if (action.expanded !== undefined) element.expanded = action.expanded
      if (kind === 'select') {
        element.options = []
      }
      elements.push(element)
    }
    const index = indices[String(node)]
    const operation = OPERATIONS[kind as keyof typeof OPERATIONS]
    const group = (targets[operation] = targets[operation] || {})
    const element = elements[Number(index) - 1]
    if (!element.operations.includes(operation)) {
      element.operations.push(operation)
    }
    let target = index
    if (kind === 'select') {
      target = `${index}:${element.options!.length + 1}`
      element.options!.push({ index: target, label: action.label, value: action.value || '' })
    }
    group[target] = action
  }

  return [elements, targets, controls]
}

export const chooseLocal = (
  state: BrowserAgentState,
  goal: string,
  history: BrowserHistoryEntry[]
): BrowserDecision => {
  const [elements, targets, controls] = actionSpace(state.actions)
  
  const operationCandidates: Record<string, string> = {}
  for (const [op, candidates] of Object.entries(targets)) {
    operationCandidates[op] = `Available: ${Object.keys(candidates).length} targets`
  }
  for (const [key, action] of Object.entries(controls)) {
    operationCandidates[key] = action.label
  }
  operationCandidates.DONE = 'All requirements visibly satisfied'
  operationCandidates.BLOCKED = 'No supported operation can progress'

  let operation = 'WAIT'
  let choice = 'WAIT'
  
  if (targets.TYPE_TEXT && Object.keys(targets.TYPE_TEXT).length > 0) {
    operation = 'TYPE_TEXT'
    choice = Object.keys(targets.TYPE_TEXT)[0]
  } else if (targets.CLICK && Object.keys(targets.CLICK).length > 0) {
    operation = 'CLICK'
    const clickTargets = targets.CLICK
    const preferred = Object.entries(clickTargets).find(([, a]) => 
      /submit|search|next|continue|confirm|apply|filter|go|run/i.test(a.label)
    )
    choice = preferred ? preferred[0] : Object.keys(clickTargets)[0]
  } else if (targets.SELECT && Object.keys(targets.SELECT).length > 0) {
    operation = 'SELECT'
    choice = Object.keys(targets.SELECT)[0]
  } else if (controls.WAIT) {
    operation = 'WAIT'
    choice = 'WAIT'
  }

  const recent = history.slice(-3)
  if (recent.length === 3 && recent.every(h => h.page_changed === false && h.kind !== 'wait')) {
    operation = 'BLOCKED'
    choice = 'BLOCKED'
  }

  if (state.page && /done|complete|success|confirmado|exitoso/i.test(state.page.text)) {
    operation = 'DONE'
    choice = 'DONE'
  }

  const target = operation in targets ? choice : null
  const probabilities: Record<string, number> = {}
  
  if (target && targets[operation]) {
    for (const [t] of Object.entries(targets[operation])) {
      probabilities[t] = t === target ? 0.8 : 0.2 / (Object.keys(targets[operation]).length - 1 || 1)
    }
  } else {
    probabilities[choice] = 1.0
  }

  return {
    choice,
    operation,
    target,
    confidence: 0.85,
    probabilities,
    operation_probabilities: { [operation]: 1.0 },
    target_probabilities: target ? probabilities : {},
    target_confidence: target ? 0.8 : null,
    model: 'local-heuristic',
    usage: {},
    latency_ms: 1,
    raw_answers: {},
    request: {},
  }
}

export const fieldTextLocal = (context: {
  goal: string
  field: { label: string; role?: string; value?: string }
  page: { title: string; text: string }
}): string | null => {
  const { goal, field } = context
  const label = field.label.toLowerCase()
  
  if (/where from|origin|departure|from/i.test(label)) {
    return extractLocation(goal, 'from') || 'Zürich'
  }
  if (/where to|destination|arrival|to$/i.test(label)) {
    return extractLocation(goal, 'to') || 'London'
  }
  if (/depart|date|fecha|salida/i.test(label)) {
    return extractDate(goal) || '2026-09-20'
  }
  if (/search|query|q|búsqueda/i.test(label)) {
    return goal.split(' ').slice(0, 5).join(' ')
  }
  if (/email|correo/i.test(label)) {
    return 'user@example.com'
  }
  if (/name|nombre/i.test(label)) {
    return 'Usuario'
  }
  
  return goal.split(' ').slice(0, 3).join(' ')
}

function extractLocation(goal: string, direction: 'from' | 'to'): string | null {
  const words = goal.split(' ')
  const fromIdx = words.findIndex(w => /from|de|desde/i.test(w))
  const toIdx = words.findIndex(w => /to|a|hacia/i.test(w))
  
  if (direction === 'from' && fromIdx >= 0 && fromIdx + 1 < words.length) {
    return words[fromIdx + 1].replace(/[.,]/g, '')
  }
  if (direction === 'to' && toIdx >= 0 && toIdx + 1 < words.length) {
    return words[toIdx + 1].replace(/[.,]/g, '')
  }
  return null
}

function extractDate(goal: string): string | null {
  const dateMatch = goal.match(/\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|\d{1,2}\s+de\s+\w+/i)
  return dateMatch ? dateMatch[0] : null
}

export const observePage = async (url: string): Promise<{
  url: string
  title: string
  text: string
  actions: BrowserAction[]
  scroll: number
  fingerprint: string
  page_key: string
  guards: Record<string, string>
  screenshot?: string
}> => {
  return {
    url,
    title: 'Page Title',
    text: 'Page content...',
    actions: [],
    scroll: 0,
    fingerprint: 'mock-fingerprint',
    page_key: 'mock-page-key',
    guards: {},
  }
}

export const executeAction = async (
  action: BrowserAction,
  page: BrowserAgentState['page'],
  text: string | null
): Promise<{ executed: string }> => {
  return { executed: action.id }
}
