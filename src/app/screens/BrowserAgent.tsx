import { Globe, Play, Pause, RotateCcw, Terminal, Trash2, Download } from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '@core/state/store'
import { Card, Stat, Btn } from '@components/ui'
import { actionSpace, chooseLocal, fieldTextLocal, observePage, executeAction } from '@core/lib/browserAgent'

export function BrowserAgent() {
  const { 
    browserAgent, 
    setBrowserAgentUrl, 
    setBrowserAgentGoal, 
    setBrowserAgentStatus,
    addBrowserAgentHistory,
    setBrowserAgentDecision,
    setBrowserAgentPage,
    setBrowserAgentElements,
    setBrowserAgentActions,
    setBrowserAgentTextCalls,
    setBrowserAgentStartedAt,
    setBrowserAgentElapsedMs,
    setBrowserAgentPlan
  } = useAppStore()
  
  const [urlInput, setUrlInput] = useState(browserAgent.url || 'https://google.com')
  const [goalInput, setGoalInput] = useState(browserAgent.goal || 'Search for HSCSG Zeitnus')
  const [running, setRunning] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  
  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-50), `[${new Date().toLocaleTimeString()}] ${msg}`])
  }

  const startAgent = async () => {
    if (running) return
    setRunning(true)
    addLog(`Starting agent for: ${goalInput}`)
    
    setBrowserAgentUrl(urlInput)
    setBrowserAgentGoal(goalInput)
    setBrowserAgentStatus('running')
    setBrowserAgentStartedAt(Date.now())
    setBrowserAgentPlan([goalInput])
    
    try {
      const page = await observePage(urlInput)
      setBrowserAgentPage(page)
      
      const mockActions = [
        { id: '1', kind: 'fill', label: 'Search box', node: 1 },
        { id: '2', kind: 'click', label: 'Search button', node: 2 },
        { id: '3', kind: 'click', label: 'First result', node: 3 },
      ]
      setBrowserAgentActions(mockActions)
      
      const [elements] = actionSpace(mockActions)
      setBrowserAgentElements(elements)
      
      let steps = 0
      const maxSteps = 10
      
      while (steps < maxSteps && browserAgent.status !== 'done' && browserAgent.status !== 'blocked') {
        const decision = chooseLocal(
          { ...browserAgent, actions: mockActions, page },
          goalInput,
          browserAgent.history
        )
        setBrowserAgentDecision(decision)
        addLog(`Decision: ${decision.operation} ${decision.target || ''} (${decision.confidence})`)
        
        if (decision.choice === 'DONE') {
          setBrowserAgentStatus('done')
          addLog('Goal completed')
          break
        }
        if (decision.choice === 'BLOCKED') {
          setBrowserAgentStatus('blocked')
          addLog('Blocked - no progress')
          break
        }
        
        const action = mockActions.find(a => a.id === decision.choice)
        if (!action) break
        
        let text: string | null = null
        if (action.kind === 'fill') {
          text = fieldTextLocal({
            goal: goalInput,
            field: { label: action.label, role: action.role, value: action.value },
            page: { title: page.title, text: page.text }
          })
          setBrowserAgentTextCalls(prev => [...prev, { 
            field: action.label, 
            value: text || '', 
            model: 'local-heuristic', 
            latency_ms: 1, 
            usage: {} 
          }])
          addLog(`Typing: "${text}" into ${action.label}`)
        }
        
        await executeAction(action, page, text)
        
        const historyEntry = {
          step: browserAgent.history.length + 1,
          action: action.label,
          kind: action.kind,
          choice: decision.choice,
          probability: decision.probabilities[decision.choice] || 0,
          confidence: decision.confidence,
          latency_ms: decision.latency_ms,
          text,
          text_helper: 'local-heuristic',
          text_latency_ms: 1,
          operation: decision.operation,
          target: decision.target,
          page_changed: true,
          url: page.url,
          executed_ms: Date.now(),
          elapsed_ms: Date.now() - (browserAgent.started_at || Date.now()),
        }
        addBrowserAgentHistory(historyEntry)
        addLog(`Executed: ${action.label}`)
        
        steps++
        await new Promise(r => setTimeout(r, 500))
      }
      
      setBrowserAgentElapsedMs(Date.now() - (browserAgent.started_at || Date.now()))
      
    } catch (e) {
      addLog(`Error: ${e}`)
      setBrowserAgentStatus('error')
    } finally {
      setRunning(false)
    }
  }
  
  const resetAgent = () => {
    setRunning(false)
    setLogs([])
    setBrowserAgentStatus('ready')
    setBrowserAgentDecision(null)
    setBrowserAgentPage(null)
    setBrowserAgentElements([])
    setBrowserAgentActions([])
    setBrowserAgentHistory([])
    setBrowserAgentTextCalls([])
    setBrowserAgentStartedAt(null)
    setBrowserAgentElapsedMs(0)
    setBrowserAgentPlan([])
  }

  const statusColors = {
    ready: 'text-[var(--dim)]',
    running: 'text-chispa',
    done: 'text-emerald-400',
    blocked: 'text-red-400',
    error: 'text-red-400',
    predicted: 'text-amber-400',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-jost text-2xl md:text-3xl font-semibold flex items-center gap-2">
          <Globe className="w-6 h-6 text-chispa" />
          Browser Agent · Jev Ultrafast
        </h1>
        <p className="text-[var(--dim)] mt-1">Agente web ultrafast · goal → indexed actions → execute → audit trail</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Estado" value={browserAgent.status.toUpperCase()} color={statusColors[browserAgent.status]} />
        <Stat label="Pasos" value={String(browserAgent.history.length)} sub={browserAgent.plan.length + " plan"} />
        <Stat label="Tiempo" value={Math.round(browserAgent.elapsed_ms / 1000) + "s"} sub="Transcurrido" />
        <Stat label="Text calls" value={String(browserAgent.text_calls.length)} sub="Campos llenados" />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card title="Configuración">
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-[var(--dim)] mb-1">URL inicial</label>
              <input
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surf2)] border border-[var(--line)] rounded-xl text-sm"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--dim)] mb-1">Goal (lenguaje natural)</label>
              <textarea
                value={goalInput}
                onChange={e => setGoalInput(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-[var(--surf2)] border border-[var(--line)] rounded-xl text-sm resize-none"
                placeholder="Search for flights from Zurich to London on Sep 20"
              />
            </div>
            <div className="flex gap-2">
              <Btn onClick={startAgent} disabled={running}>
                {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {running ? 'Ejecutando...' : 'Iniciar Agente'}
              </Btn>
              <Btn variant="ghost" onClick={resetAgent}>
                <RotateCcw className="w-4 h-4" /> Reset
              </Btn>
            </div>
          </div>
        </Card>

        <Card title="Elementos observados (Action Space)">
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {browserAgent.elements.length === 0 ? (
              <p className="text-[var(--dim)] text-sm">Ejecuta el agente para ver elementos indexados</p>
            ) : (
              browserAgent.elements.map(el => (
                <div key={el.index} className="p-2 bg-[var(--surf2)] border border-[var(--line)] rounded-lg text-xs">
                  <div className="flex items-center gap-2">
                    <span className="bg-chispa/20 text-chispa px-2 py-0.5 rounded text-[10px] font-mono">
                      [{el.index}]
                    </span>
                    <span className="font-medium">{el.label}</span>
                    {el.role && <span className="text-[var(--muted-foreground)]">({el.role})</span>}
                  </div>
                  <div className="flex gap-1 mt-1">
                    {el.operations.map(op => (
                      <span key={op} className="px-1.5 py-0.5 bg-[var(--accent)]/20 text-[var(--accent)] rounded text-[10px]">
                        {op}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card title="Decision & History">
          <div className="space-y-2">
            {browserAgent.decision && (
              <div className="p-3 bg-[var(--surf2)] border border-[var(--line)] rounded-lg">
                <p className="text-sm font-medium">
                  Operation: <span className="text-chispa">{browserAgent.decision.operation}</span>
                </p>
                <p className="text-xs text-[var(--dim)]">
                  Target: {browserAgent.decision.target || 'N/A'} · Confidence: {(browserAgent.decision.confidence * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Model: {browserAgent.decision.model} · {browserAgent.decision.latency_ms}ms
                </p>
              </div>
            )}
            
            <div className="max-h-64 overflow-y-auto space-y-1">
              {browserAgent.history.length === 0 ? (
                <p className="text-[var(--dim)] text-sm">Sin historial aún</p>
              ) : (
                browserAgent.history.slice(-10).map(h => (
                  <div key={h.step} className="text-xs py-1 border-b border-[var(--line)] flex gap-2">
                    <span className="font-mono text-chispa">{h.step}.</span>
                    <span className={h.page_changed ? 'text-emerald-400' : 'text-red-400'}>
                      {h.page_changed ? '✓' : '✗'}
                    </span>
                    <span>{h.action}</span>
                    <span className="text-[var(--dim)] ml-auto">{h.elapsed_ms}ms</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>
      </div>

      <Card title="Logs de ejecución">
        <div className="font-mono text-xs bg-[var(--surf2)] p-3 rounded-lg max-h-64 overflow-y-auto">
          {logs.length === 0 && <span className="text-[var(--dim)]">Ejecutar agente para ver logs...</span>}
          {logs.map((log, i) => (
            <div key={i} className="text-[var(--muted-foreground)]">{log}</div>
          ))}
        </div>
      </Card>
    </div>
  )
}
