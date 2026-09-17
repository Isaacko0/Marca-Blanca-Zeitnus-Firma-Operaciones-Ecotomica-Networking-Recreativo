import { Cloud, Thermometer, BarChart2, RefreshCw, Zap, Settings } from 'lucide-react'
import { useAppStore } from '@core/state/store'
import { Card, Stat, Btn } from '@components/ui'
import { ingestObservations, generateForecasts, computeDEBConsensus, computeProbabilityBuckets, scanMarkets, refreshAll, toggleAutoRefresh, setRefreshInterval } from '@core/lib/polyweather'

export function PolyWeather() {
  const { polyweather, setPolyweatherAutoRefresh, setPolyweatherRefreshInterval, refreshPolyweather } = useAppStore()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-jost text-2xl md:text-3xl font-semibold flex items-center gap-2">
          <Cloud className="w-6 h-6 text-chispa" />
          PolyWeather Oracle · Temperature Markets
        </h1>
        <p className="text-[var(--dim)] mt-1">DEB consensus → calibrated probability → market edge detection</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Ciudades" value={String(polyweather.cities.length)} sub="Monitoreadas" />
        <Stat label="Observaciones" value={String(polyweather.observations.length)} sub="Recientes" />
        <Stat label="Consenso DEB" value={String(polyweather.debConsensus.length)} sub="Ciudades con consenso" />
        <Stat label="Auto-refresh" value={polyweather.autoRefresh ? 'ON' : 'OFF'} color={polyweather.autoRefresh ? 'text-emerald-400' : 'text-orange-400'} sub={polyweather.refreshInterval + " min"} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card title="DEB Consensus (Peak Window)">
          <div className="space-y-2">
            {polyweather.debConsensus.length === 0 ? (
              <p className="text-[var(--dim)] text-sm">Ejecuta refresh para generar consenso DEB</p>
            ) : (
              polyweather.debConsensus.map(c => (
                <div key={c.city} className="p-3 bg-[var(--surf2)] border border-[var(--line)] rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{c.city}</span>
                    <span className="text-chispa">{c.confidence * 100}% conf.</span>
                  </div>
                  <div className="text-sm text-[var(--dim)] mt-1">
                    Peak: {c.peakWindow.maxTemp.toFixed(1)}°C @ hour {c.peakWindow.start}-{c.peakWindow.end}
                    <br />Hourly path: {c.hourlyPath.length} points
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card title="Probability Buckets (DEB Normal)">
          <div className="space-y-2">
            {polyweather.probabilities.length === 0 ? (
              <p className="text-[var(--dim)] text-sm">Calcula probabilidades calibradas</p>
            ) : (
              polyweather.probabilities.map(p => (
                <div key={p.city} className="p-3 bg-[var(--surf2)] border border-[var(--line)] rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{p.city} · {p.date}</span>
                    <span className="text-xs text-chispa">{p.model} · calibrated</span>
                  </div>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {p.buckets.slice(0, 8).map(b => (
                      <span key={b.temp} className="px-2 py-1 bg-[var(--accent)]/20 text-[var(--accent)] rounded text-xs">
                        {b.temp}°C: {(b.probability * 100).toFixed(1)}%
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Market Signals (Edge Detection)">
          <div className="space-y-2">
            {polyweather.marketSignals.length === 0 ? (
              <p className="text-[var(--dim)] text-sm">Escanea mercados para detectar edge</p>
            ) : (
              polyweather.marketSignals.map(m => (
                <div key={m.city} className="p-3 bg-[var(--surf2)] border border-[var(--line)] rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{m.city}</span>
                    <span className={m.edge > 0 ? 'text-emerald-400' : 'text-red-400'}>
                      Edge: {(m.edge * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-[var(--dim)] mt-1">{m.question}</p>
                  <div className="flex gap-2 mt-2 text-xs">
                    <span>Model: {(m.modelProb * 100).toFixed(1)}%</span>
                    <span>Market: {(m.marketProb * 100).toFixed(1)}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card title="Controles">
          <div className="space-y-3">
            <Btn onClick={() => refreshPolyweather()}>
              <RefreshCw className="w-4 h-4" /> Full Refresh (All Cities)
            </Btn>
            <Btn onClick={() => toggleAutoRefresh()} variant={polyweather.autoRefresh ? 'primary' : 'ghost'}>
              <Zap className="w-4 h-4" /> {polyweather.autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
            </Btn>
            <div className="flex items-center gap-2">
              <span className="text-sm">Interval: {polyweather.refreshInterval} min</span>
              <select
                value={polyweather.refreshInterval}
                onChange={e => setPolyweatherRefreshInterval(Number(e.target.value))}
                className="px-3 py-2 bg-[var(--surf2)] border border-[var(--line)] rounded-xl text-sm"
              >
                <option value={1}>1 min</option>
                <option value={5}>5 min</option>
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
              </select>
            </div>
            <Btn variant="ghost" onClick={() => {
              // Simulate single city refresh
              refreshPolyweather()
            }}>
              <BarChart2 className="w-4 h-4" /> View Charts
            </Btn>
          </div>
        </Card>
      </div>
    </div>
  )
}
