import { Bot, MessageSquare, Zap, Shield, Plus, ToggleLeft, ToggleRight } from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '@core/state/store'
import { Card, Stat, Btn } from '@components/ui'
import { getEnabledStrategies, getEnabledVenues, addChatMessage, setActiveStrategy, toggleVenue, toggleDryRun, executeStrategy } from '@core/lib/clodds'

export function Clodds() {
  const { clodds, addCloddsChatMessage, setCloddsActiveStrategy, setCloddsActiveVenue, toggleCloddsDryRun, executeCloddsStrategy } = useAppStore()
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg = input
    setInput('')
    addCloddsChatMessage(userMsg)
    // Simple bot response
    setTimeout(() => {
      addCloddsChatMessage(`Received: "${userMsg}". Type "help" for commands.`)
    }, 500)
  }

  const enabledStrategies = getEnabledStrategies(clodds)
  const enabledVenues = getEnabledVenues(clodds)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-jost text-2xl md:text-3xl font-semibold flex items-center gap-2">
          <Bot className="w-6 h-6 text-chispa" />
          Clodds Terminal · AI Trading
        </h1>
        <p className="text-[var(--dim)] mt-1">Strategy console for Polymarket · 118+ strategies · dry-run safe</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Estrategias" value={String(enabledStrategies.length)} sub={`de ${clodds.strategies.length} total`} />
        <Stat label="Venues" value={String(enabledVenues.length)} sub="Conectados" />
        <Stat label="Modo" value={clodds.dryRun ? 'DRY-RUN' : 'LIVE'} color={clodds.dryRun ? 'text-emerald-400' : 'text-red-400'} />
        <Stat label="PnL Total" value={`${clodds.pnl.total >= 0 ? '+' : ''}${clodds.pnl.total.toFixed(2)}`} sub="USD" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Chat Terminal">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {clodds.chatHistory.length === 0 && (
              <p className="text-[var(--dim)] text-sm text-center py-8">
                Bienvenido a Clodds Terminal. Escribe un comando o "help".
              </p>
            )}
            {clodds.chatHistory.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-chispa text-black' 
                    : msg.role === 'system' 
                      ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30'
                      : 'bg-[var(--surf2)] border border-[var(--line)]'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Escribe un comando..."
              className="flex-1 px-3 py-2 bg-[var(--surf2)] border border-[var(--line)] rounded-xl text-sm"
            />
            <Btn onClick={handleSend}><MessageSquare className="w-4 h-4" /></Btn>
          </div>
        </Card>

        <Card title="Estrategias Activas">
          <div className="space-y-2">
            {enabledStrategies.map(s => (
              <div key={s.id} className="p-2 bg-[var(--surf2)] border border-[var(--line)] rounded-lg flex items-center gap-2">
                <Zap className="w-4 h-4 text-chispa" />
                <span className="text-sm font-medium">{s.name}</span>
                <span className="text-xs text-[var(--dim)] ml-auto">{s.category}</span>
              </div>
            ))}
            {enabledStrategies.length === 0 && (
              <p className="text-[var(--dim)] text-sm">Ninguna estrategia activa</p>
            )}
            <Btn onClick={() => setCloddsActiveStrategy('dca_bot')}>
              <Plus className="w-4 h-4" /> Activar DCA
            </Btn>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card title="Venues">
          <div className="space-y-2">
            {clodds.venues.map(v => (
              <div key={v.id} className="flex items-center justify-between p-2 bg-[var(--surf2)] border border-[var(--line)] rounded-lg">
                <div className="flex items-center gap-2">
                  <span className={v.enabled ? 'text-emerald-400' : 'text-[var(--dim)]'}>
                    {v.enabled ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  </span>
                  <span className="font-medium">{v.name}</span>
                </div>
                <span className="text-xs text-[var(--dim)]">{v.markets} mercados</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Posiciones">
          <div className="space-y-2">
            {clodds.positions.length === 0 ? (
              <p className="text-[var(--dim)] text-sm">Sin posiciones abiertas</p>
            ) : (
              clodds.positions.map(p => (
                <div key={p.market} className="p-2 bg-[var(--surf2)] border border-[var(--line)] rounded-lg text-xs">
                  <div className="flex justify-between">
                    <span>{p.market}</span>
                    <span className={p.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                      {p.pnl >= 0 ? '+' : ''}{p.pnl.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[var(--dim)]">
                    <span>{p.side} @ {p.entryPrice}</span>
                    <span>Size: {p.size}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card title="Controles">
          <div className="space-y-3">
            <Btn onClick={() => toggleCloddsDryRun()} variant={clodds.dryRun ? 'primary' : 'ghost'}>
              {clodds.dryRun ? <Shield className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
              {clodds.dryRun ? 'DRY-RUN ACTIVO' : 'MODO LIVE'}
            </Btn>
            <Btn variant="ghost" onClick={() => executeCloddsStrategy('binance_poly_latency')}>
              <Zap className="w-4 h-4" /> Run Latency Arb
            </Btn>
            <Btn variant="ghost" onClick={() => executeCloddsStrategy('whale_tracker')}>
              <Bot className="w-4 h-4" /> Scan Whales
            </Btn>
            <Btn variant="ghost" onClick={() => executeCloddsStrategy('copy_trading')}>
              <MessageSquare className="w-4 h-4" /> Copy Trade
            </Btn>
          </div>
        </Card>
      </div>
    </div>
  )
}
