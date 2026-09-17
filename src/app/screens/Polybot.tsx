import { Database, Zap, BarChart2, Search, Plus, Play, Pause } from 'lucide-react'
import { useAppStore } from '@core/state/store'
import { Card, Stat, Btn } from '@components/ui'
import { ingestTrades, addStrategy, toggleStrategy, generateSignal, executeSignal, analyzeReplication, updateReplications, toggleRunning, togglePaperMode, getEnabledStrategies, getTopReplications } from '@core/lib/polybot'

export function Polybot() {
  const { polybot, setPolybotRunning, setPolybotPaperMode, addPolybotStrategy, togglePolybotStrategy, generatePolybotSignal, executePolybotSignal, updatePolybotReplications, ingestPolybotTrades } = useAppStore()

  const enabledStrategies = getEnabledStrategies(polybot)
  const topReplications = getTopReplications(polybot, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-jost text-2xl md:text-3xl font-semibold flex items-center gap-2">
          <Database className="w-6 h-6 text-chispa" />
          Polybot · Quant Trading Platform
        </h1>
        <p className="text-[var(--dim)] mt-1">Ingest -> Strategy -> Execute -> Analyze -> Replicate</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Trades" value={String(polybot.trades.length)} sub="Ingested" />
        <Stat label="Strategies" value={String(enabledStrategies.length)} sub="Activas" />
        <Stat label="Signals" value={String(polybot.signals.length)} sub="Pendientes" />
        <Stat label="Modo" value={polybot.paperMode ? 'PAPER' : 'LIVE'} color={polybot.paperMode ? 'text-emerald-400' : 'text-red-400'} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Strategies">
          <div className="space-y-2">
            {polybot.strategies.map(s => (
              <div key={s.id} className="p-2 bg-[var(--surf2)] border border-[var(--line)] rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={s.enabled ? 'text-emerald-400' : 'text-[var(--dim)]'}>●</span>
                    <span className="font-medium">{s.name}</span>
                    <span className="text-xs text-[var(--dim)]">{s.type}</span>
                  </div>
                  <Btn size="sm" onClick={() => togglePolybotStrategy(s.id)}>
                    {s.enabled ? 'Disable' : 'Enable'}
                  </Btn>
                </div>
              </div>
            ))}
            <Btn onClick={() => addPolybotStrategy({ name: 'Custom MM', type: 'market_making', enabled: true, params: {} })}>
              <Plus className="w-4 h-4" /> Add Strategy
            </Btn>
          </div>
        </Card>

        <Card title="Smart Money Replication">
          <div className="space-y-2">
            {topReplications.length === 0 ? (
              <p className="text-[var(--dim)] text-sm">Run replication analysis</p>
            ) : (
              topReplications.map(r => (
                <div key={r.traderAddress} className="p-2 bg-[var(--surf2)] border border-[var(--line)] rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm">{r.traderAddress.slice(0, 10)}...</span>
                    <span className={r.flagged ? 'text-red-400' : 'text-emerald-400'}>
                      {r.flagged ? 'FLAGGED' : 'CLEAN'}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--dim)]">
                    WR: {(r.winRate * 100).toFixed(0)}% | PF: {r.profitFactor.toFixed(2)} | Score: {(r.score * 100).toFixed(0)}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card title="Ingestion">
          <div className="space-y-3">
            <Btn onClick={() => ingestPolybotTrades([{ timestamp: Date.now(), marketId: '1', side: 'BUY', price: 0.55, size: 100, tokenId: 'token_1', maker: '0x123', taker: '0x456', fee: 0.1 }])}>
              <Database className="w-4 h-4" /> Ingest Mock Trades
            </Btn>
            <Btn onClick={() => updatePolybotReplications()}>
              <Search className="w-4 h-4" /> Analyze Replication
            </Btn>
          </div>
        </Card>

        <Card title="Execution">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Btn onClick={() => setPolybotRunning(!polybot.running)} variant={polybot.running ? 'ghost' : 'primary'}>
                {polybot.running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {polybot.running ? 'Stop' : 'Start'}
              </Btn>
              <Btn onClick={() => setPolybotPaperMode(!polybot.paperMode)} variant={polybot.paperMode ? 'primary' : 'ghost'}>
                {polybot.paperMode ? 'PAPER' : 'LIVE'}
              </Btn>
            </div>
            <Btn onClick={() => generatePolybotSignal(polybot.strategies[0]?.id || '', 'market_1', 'LONG', 0.8)}>
              <Zap className="w-4 h-4" /> Generate Signal
            </Btn>
          </div>
        </Card>

        <Card title="Capital & PnL">
          <div className="space-y-2 text-center">
            <div className="text-3xl font-bold text-chispa">${polybot.capital.toLocaleString()}</div>
            <div className="text-sm text-[var(--dim)]">Capital</div>
            <div className="text-xl font-bold {polybot.dailyPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}">
              {polybot.dailyPnL >= 0 ? '+' : ''}{polybot.dailyPnL.toFixed(2)}
            </div>
            <div className="text-sm text-[var(--dim)]">Daily PnL</div>
          </div>
        </Card>
      </div>
    </div>
  )
}
