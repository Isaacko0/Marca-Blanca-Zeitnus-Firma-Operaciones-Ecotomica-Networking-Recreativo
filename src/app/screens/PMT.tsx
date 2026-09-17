import { Cpu, Shield, Zap, Play, Pause, RotateCcw, Settings, BarChart2 } from 'lucide-react'
import { useAppStore } from '@core/state/store'
import { Card, Stat, Btn } from '@components/ui'
import { getEnabledAdapters, getEnabledStrategies, addLog, setEngineConfig, toggleAdapter, toggleStrategy, updateStrategyParams, toggleDryRun, startEngine, stopEngine, checkRisk } from '@core/lib/pmt'

export function PMT() {
  const { pmt, setPmtEngineConfig, addPmtLog, setPmtActiveStrategy, togglePmtAdapter, togglePmtStrategy, updatePmtStrategyParams, togglePmtDryRun, startPmtEngine, stopPmtEngine } = useAppStore()

  const enabledAdapters = getEnabledAdapters(pmt)
  const enabledStrategies = getEnabledStrategies(pmt)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-jost text-2xl md:text-3xl font-semibold flex items-center gap-2">
          <Cpu className="w-6 h-6 text-chispa" />
          PMT Engine · Multi-Venue Trading
        </h1>
        <p className="text-[var(--dim)] mt-1">Venue-agnostic engine + risk layer + 10 strategy bots</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Adapters" value={String(enabledAdapters.length)} sub={enabledAdapters.length + " de " + pmt.adapters.length} />
        <Stat label="Strategies" value={String(enabledStrategies.length)} sub="Activas" />
        <Stat label="Estado" value={pmt.running ? 'RUNNING' : 'STOPPED'} color={pmt.running ? 'text-emerald-400' : 'text-orange-400'} />
        <Stat label="Modo" value={pmt.dryRun ? 'DRY-RUN' : 'LIVE'} color={pmt.dryRun ? 'text-emerald-400' : 'text-red-400'} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Adapters (Venue Interfaces)">
          <div className="space-y-2">
            {pmt.adapters.map(a => (
              <div key={a.id} className="p-2 bg-[var(--surf2)] border border-[var(--line)] rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={a.enabled ? 'text-emerald-400' : 'text-[var(--dim)]'}>●</span>
                  <span className="font-medium">{a.name}</span>
                  <span className="text-xs text-[var(--dim)]">{a.venue}</span>
                </div>
                <span className="text-xs text-[var(--dim)]">{a.markets.length} mercados</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Strategy Bots">
          <div className="space-y-2">
            {pmt.strategies.map(s => (
              <div key={s.id} className="p-2 bg-[var(--surf2)] border border-[var(--line)] rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={s.enabled ? 'text-emerald-400' : 'text-[var(--dim)]'}>●</span>
                    <span className="font-medium">{s.name}</span>
                    <span className="text-xs text-[var(--dim)] bg-[var(--accent)]/20 text-[var(--accent)] px-1.5 py-0.5 rounded">{s.type}</span>
                  </div>
                  <div className="text-xs text-[var(--dim)]">
                    PnL: {s.performance.pnl >= 0 ? '+' : ''}{s.performance.pnl.toFixed(2)} | WR: {(s.performance.winRate * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card title="Risk Layer">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-[var(--dim)]">Max Position</span><br /><span className="font-medium">{pmt.engineConfig.riskLayer.maxPositionSize}</span></div>
              <div><span className="text-[var(--dim)]">Max Daily Loss</span><br /><span className="font-medium">{(pmt.engineConfig.riskLayer.maxDailyLoss * 100).toFixed(0)}%</span></div>
              <div><span className="text-[var(--dim)]">Max Drawdown</span><br /><span className="font-medium">{(pmt.engineConfig.riskLayer.maxDrawdown * 100).toFixed(0)}%</span></div>
              <div><span className="text-[var(--dim)]">Exposure Cap</span><br /><span className="font-medium">{(pmt.engineConfig.riskLayer.exposureCap * 100).toFixed(0)}%</span></div>
            </div>
            <Btn onClick={() => setPmtEngineConfig({ riskLayer: { ...pmt.engineConfig.riskLayer, maxDailyLoss: 0.1 } })}>
              <Settings className="w-4 h-4" /> Adjust Risk
            </Btn>
          </div>
        </Card>

        <Card title="Execution Config">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Dry Run</span>
              <Btn onClick={() => togglePmtDryRun()} variant={pmt.dryRun ? 'primary' : 'ghost'} size="sm">
                {pmt.dryRun ? 'ON' : 'OFF'}
              </Btn>
            </div>
            <div className="flex items-center justify-between">
              <span>Slippage Tolerance</span>
              <span className="font-medium">{(pmt.engineConfig.execution.slippageTolerance * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Gas Limit</span>
              <span className="font-medium">{pmt.engineConfig.execution.gasLimit.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        <Card title="Engine Controls">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Btn onClick={() => startPmtEngine()} disabled={pmt.running}>
                <Play className="w-4 h-4" /> Start
              </Btn>
              <Btn onClick={() => stopPmtEngine()} disabled={!pmt.running} variant="ghost">
                <Pause className="w-4 h-4" /> Stop
              </Btn>
            </div>
            <Btn variant="ghost" onClick={() => addPmtLog('info', 'Manual health check')}>
              <BarChart2 className="w-4 h-4" /> Health Check
            </Btn>
            <Btn variant="ghost" onClick={() => togglePmtStrategy('copy_trading')}>
              <Zap className="w-4 h-4" /> Toggle Copy Trading
            </Btn>
          </div>
        </Card>
      </div>

      <Card title="Logs">
        <div className="font-mono text-xs bg-[var(--surf2)] p-3 rounded-lg max-h-64 overflow-y-auto">
          {pmt.logs.length === 0 ? <span className="text-[var(--dim)]">No logs</span> : pmt.logs.slice(-20).map((log, i) => (
            <div key={i} className="text-[var(--muted-foreground)]">
              [{new Date(log.timestamp).toLocaleTimeString()}] {log.level.toUpperCase()}: {log.message}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
