import { Bot, Plus, Activity, Clock } from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '@core/state/store'
import { Card, Stat, Btn } from '@components/ui'

export function AgentCanvas() {
  const { canvas, addCanvasAgent, toggleCanvasAgentStatus, addCanvasAutomation, logCanvasAction } = useAppStore()
  const [agentName, setAgentName] = useState('')
  const [autoName, setAutoName] = useState('')

  const activeAgents = canvas.agents.filter(a => a.status === 'running').length
  const recentLogs = canvas.logs.slice(-5).reverse()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-jost text-2xl md:text-3xl font-semibold flex items-center gap-2">
          <Bot className="w-6 h-6 text-chispa" />
          Agent Canvas · OpenHands
        </h1>
        <p className="text-[var(--dim)] mt-1">Centro de control multi-agente · automaciones · audit trail</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Agentes" value={String(canvas.agents.length)} sub={`${activeAgents} corriendo`} />
        <Stat label="Automations" value={String(canvas.automations.length)} sub="Flujos programados" />
        <Stat label="Logs" value={String(canvas.logs.length)} sub="Audit trail (Ley III)" />
        <Stat label="Activos" value={`${activeAgents}/${canvas.agents.length}`} sub="Ratio" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Agentes autónomos">
          <div className="space-y-3">
            {canvas.agents.length === 0 && (
              <p className="text-[var(--dim)] text-sm">Registra agentes del colectivo: revisor, traductor, analista.</p>
            )}
            {canvas.agents.map(agent => (
              <div key={agent.id} className="p-3 bg-[var(--surf2)] border border-[var(--line)] rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-[var(--dim)] text-xs">{agent.backend} · {agent.capabilities.join(', ')}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    agent.status === 'running' ? 'bg-emerald-400/20 text-emerald-400' :
                    agent.status === 'error' ? 'bg-red-400/20 text-red-400' :
                    'bg-[var(--line)] text-[var(--mut)]'
                  }`}>
                    {agent.status}
                  </span>
                </div>
                <div className="mt-2 flex gap-2">
                  <Btn onClick={() => toggleCanvasAgentStatus(agent.id)}>
                    <Activity className="w-3 h-3" /> {agent.status === 'running' ? 'Pausar' : 'Activar'}
                  </Btn>
                  <Btn onClick={() => logCanvasAction(agent.id, 'test', 'success')}>
                    Test
                  </Btn>
                </div>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Nombre del agente"
                className="flex-1 px-3 py-2 bg-[var(--surf2)] border border-[var(--line)] rounded-xl text-sm"
              />
              <Btn onClick={() => {
                if (agentName.trim()) {
                  addCanvasAgent(agentName.trim(), 'local', ['read', 'write'])
                  setAgentName('')
                }
              }}>
                <Plus className="w-4 h-4" /> Agregar
              </Btn>
            </div>
          </div>
        </Card>

        <Card title="Automations + Audit Log">
          <div className="space-y-3">
            {canvas.automations.map(auto => (
              <div key={auto.id} className="p-2 bg-[var(--surf2)] border border-[var(--line)] rounded-lg">
                <p className="text-sm font-medium">{auto.name}</p>
                <p className="text-xs text-[var(--dim)]">schedule: {auto.schedule}</p>
              </div>
            ))}
            <div className="flex gap-2 pt-2 border-t border-[var(--line)]">
              <input
                value={autoName}
                onChange={(e) => setAutoName(e.target.value)}
                placeholder="Nombre automation"
                className="flex-1 px-3 py-2 bg-[var(--surf2)] border border-[var(--line)] rounded-xl text-sm"
              />
              <Btn onClick={() => {
                if (autoName.trim() && canvas.agents[0]) {
                  addCanvasAutomation(autoName.trim(), 'min:1440', canvas.agents[0].id, 'heartbeat')
                  setAutoName('')
                }
              }}>
                <Clock className="w-4 h-4" /> Auto
              </Btn>
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--line)]">
              <p className="text-xs uppercase tracking-wide text-[var(--dim)] mb-2">Audit Log (últimos 5)</p>
              {recentLogs.length === 0 && <p className="text-[var(--dim)] text-sm">Sin logs</p>}
              {recentLogs.map(log => (
                <div key={log.id} className="text-xs py-1 border-b border-[var(--line)] flex gap-2">
                  <span className={log.status === 'success' ? 'text-emerald-400' : 'text-red-400'}>{log.status}</span>
                  <span className="text-[var(--muted-foreground)]">{log.action}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
