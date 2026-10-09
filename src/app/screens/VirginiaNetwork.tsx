import { useState } from 'react'
import { Users, TreePine, Calculator, ShieldCheck, ShieldAlert, ArrowRightLeft } from 'lucide-react'
import { useAppStore } from '@core/state/store'
import { 
  buildVirginiaTree, 
  getVirginiaSummary, 
  checkVirginiaMJCompliance,
  virginiaAsCaaSStream,
  virginiaRevenueShare,
  formatVirginiaValue,
  makeVirginiaState,
  type VirginiaTreeState,
  type VirginiaConfig,
} from '@core/lib/virginiaNetwork'
import { Card, Stat, Btn, Badge, SectionTitle, EmptyState } from '@components/ui'
import { autFromCAC, pgsLM, population, ics } from '@core/lib/metrics'

export function VirginiaNetwork() {
  const {
    cac,
    members,
    flows,
    nodeMode,
    priceParity,
    setNodeMode,
    setPriceParity,
    caasStreams,
    addCaasStream,
    caasAudit,
    logCaasAudit,
  } = useAppStore()

  const [config, setConfig] = useState<VirginiaConfig>({
    rcePlena: 1000,
    nodeMode: nodeMode,
    priceParity: priceParity,
  })
  const [tree, setTree] = useState<VirginiaTreeState | null>(null)
  const [tab, setTab] = useState<'arbol' | 'distribucion' | 'mj' | 'caas' | 'reparto'>('arbol')
  const [memberAssignments, setMemberAssignments] = useState<Record<string, string>>({})

  // Reconstruir árbol cuando cambia config
  const rebuildTree = () => {
    const newTree = buildVirginiaTree(config)
    setTree(newTree)
    return newTree
  }

  // Inicializar árbol
  if (!tree) {
    setTree(buildVirginiaTree(config))
  }

  const summary = tree ? getVirginiaSummary(tree) : null
  const mj = tree ? checkVirginiaMJCompliance(tree, cac, members, flows) : null
  const caasStream = tree ? virginiaAsCaaSStream(tree) : null
  const payouts = (tree && mj?.overall === 'ok') ? virginiaRevenueShare(tree, cac, members, flows) : []

  const fmt = (amt: number) => formatVirginiaValue(amt, config.nodeMode, config.priceParity)
  const avgAut = (autFromCAC(cac).ALIM + autFromCAC(cac).ENER + autFromCAC(cac).SALU + autFromCAC(cac).HABI + autFromCAC(cac).PROD) / 5
  const pgs = pgsLM(autFromCAC(cac))
  const cds = ics(members, flows)

  const handleConfigChange = (key: keyof VirginiaConfig, value: number | VirginiaConfig['nodeMode']) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    setTree(buildVirginiaTree(newConfig))
    if (key === 'nodeMode') setNodeMode(value as 'postmonetario' | 'conectado')
    if (key === 'priceParity') setPriceParity(value as number)
  }

  const assignMember = (positionId: string, name: string) => {
    setMemberAssignments(prev => ({ ...prev, [positionId]: name }))
  }

  const registerAsCaaSStream = () => {
    if (!caasStream) return
    addCaasStream(caasStream)
    logCaasAudit({
      id: Math.random().toString(36).slice(2, 9),
      ts: Date.now(),
      action: 'caas.stream_register',
      detail: `Virginia Network registrado como stream CaaS: ${caasStream.name}`,
      tone: 'success',
    })
  }

  const runPayout = () => {
    if (!tree) return
    logCaasAudit({
      id: Math.random().toString(36).slice(2, 9),
      ts: Date.now(),
      action: 'virginia.payout',
      detail: `Reparto Virginia: ${payouts.length} posiciones, ${payouts.reduce((s, p) => s + p.netZNU, 0).toFixed(2)} ZNU netos`,
      tone: 'success',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-jost text-2xl md:text-3xl font-semibold flex items-center gap-2">
            <TreePine className="w-7 h-7 text-emerald-400" />
            Virginia Network Recreativo · Prototipo IE v2
          </h1>
          <p className="text-[var(--dim)] mt-1">
            Árbol Nivel 3: 3 RCE → 9 (1/3 RCE) → 27 (1 RCE) = 39 posiciones.
            Arquitectura <b className="text-fuchsia-400">anfibia</b> ZNU ↔ USD. Leyes MJ integradas.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[var(--surf2)] rounded-xl px-3 py-2">
          <span className="text-xs text-[var(--dim)]">Modo</span>
          <button
            onClick={() => handleConfigChange('nodeMode', config.nodeMode === 'conectado' ? 'postmonetario' : 'conectado')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              config.nodeMode === 'conectado' 
                ? 'bg-fuchsia-500/30 text-fuchsia-200' 
                : 'bg-emerald-500/20 text-emerald-300'
            }`}
          >
            {config.nodeMode === 'conectado' ? 'Conectado (USD/ReFi)' : 'Postmonetario (ZNU)'}
          </button>
        </div>
      </div>

      {/* Config Panel */}
      <Card title="Configuración del Árbol">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-[var(--dim)] block mb-1">RCE Plena (USD)</label>
            <input
              type="number"
              step="100"
              min="100"
              value={config.rcePlena}
              onChange={(e) => handleConfigChange('rcePlena', Number(e.target.value))}
              className="w-full px-2 py-1 bg-[var(--surf2)] border border-[var(--line)] rounded-lg text-sm"
            />
          </div>
          {config.nodeMode === 'conectado' && (
            <div>
              <label className="text-xs text-[var(--dim)] block mb-1">Paridad (1 ZNU = USD)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={config.priceParity}
                onChange={(e) => handleConfigChange('priceParity', Number(e.target.value))}
                className="w-full px-2 py-1 bg-[var(--surf2)] border border-[var(--line)] rounded-lg text-sm"
              />
            </div>
          )}
          <div>
            <label className="text-xs text-[var(--dim)] block mb-1">AUT promedio</label>
            <div className="px-2 py-1 bg-[var(--surf2)] border border-[var(--line)] rounded-lg text-sm font-mono text-emerald-400">
              {avgAut.toFixed(2)}
            </div>
          </div>
          <div>
            <label className="text-xs text-[var(--dim)] block mb-1">CDS</label>
            <div className="px-2 py-1 bg-[var(--surf2)] border border-[var(--line)] rounded-lg text-sm font-mono text-sky-400">
              {cds.toFixed(2)}
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Stat label="Nivel 1 (RCE)" value={`${summary.level1Count}`} sub="posiciones" color="text-rose-400" />
          <Stat label="Nivel 2 (1/3 RCE)" value={`${summary.level2Count}`} sub="posiciones" color="text-amber-400" />
          <Stat label="Nivel 3 (1 RCE)" value={`${summary.level3Count}`} sub="posiciones" color="text-emerald-400" />
          <Stat label="Total distribuido" value={fmt(summary.totalUSDDistributed)} sub={config.nodeMode === 'postmonetario' ? 'USD base' : 'USD'} color="text-fuchsia-400" />
          <Stat label="Total ZNU" value={fmt(summary.totalZNUDistributed)} sub="equivalente" color="text-emerald-400" />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[var(--lineq)] flex-wrap">
        {([
          ['arbol', '🌲 Árbol', TreePine],
          ['distribucion', '📊 Distribución', Calculator],
          ['mj', '⚖️ Leyes MJ', ShieldCheck],
          ['caas', '🔗 CaaS Stream', Users],
          ['reparto', '💰 Reparto AUT+CDS', ArrowRightLeft],
        ] as const).map(([k, l, Icon]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`flex items-center gap-1 px-4 py-2 font-manrope font-medium text-sm transition-colors ${
              tab === k 
                ? 'text-rose-400 border-b-2 border-rose-400' 
                : 'text-[var(--mut)] hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            {l}
          </button>
        ))}
      </div>

      {/* Tab: Árbol Visual */}
      {tab === 'arbol' && tree && (
        <Card title="Visualización del Árbol Nivel 3">
          <div className="space-y-4 overflow-x-auto">
            {tree.rootPositions.map(rootId => {
              const root = tree.positions.get(rootId)!
              return (
                <div key={rootId} className="border-l-2 border-rose-400/30 pl-4 ml-2">
                  <div className="bg-[var(--surf2)] rounded-xl p-3 mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded text-xs font-mono">N1</span>
                      <span className="font-manrope font-medium">{root.id} — RCE Plena</span>
                      <Badge color="bg-rose-500/20 text-rose-300">{fmt(root.rceAmount)}</Badge>
                      <Badge color="bg-emerald-500/20 text-emerald-300">{fmt(root.znuAmount)} ZNU</Badge>
                      <Badge color="text-emerald-400">Total: {fmt(root.totalReceived)}</Badge>
                    </div>
                    <input
                      type="text"
                      placeholder="Nombre miembro..."
                      value={memberAssignments[rootId] || ''}
                      onChange={(e) => assignMember(rootId, e.target.value)}
                      className="px-2 py-1 bg-[var(--surf)] border border-[var(--line)] rounded text-sm w-40"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3 ml-4">
                    {root.children.map(l2 => (
                      <div key={l2.id} className="border-l-2 border-amber-400/30 pl-3">
                        <div className="bg-[var(--surf2)] rounded-xl p-2 mb-1 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded text-xs font-mono">N2</span>
                            <span className="font-manrope text-sm">{l2.id}</span>
                            <Badge color="bg-amber-500/20 text-amber-300">{fmt(l2.rceAmount)}</Badge>
                            <Badge color="text-emerald-400">Tot: {fmt(l2.totalReceived)}</Badge>
                          </div>
                          <input
                            type="text"
                            placeholder="Miembro..."
                            value={memberAssignments[l2.id] || ''}
                            onChange={(e) => assignMember(l2.id, e.target.value)}
                            className="px-1.5 py-0.5 bg-[var(--surf)] border border-[var(--line)] rounded text-xs w-32"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-1 ml-2">
                          {l2.children.map(l3 => (
                            <div key={l3.id} className="bg-[var(--surf)] border border-[var(--line)] rounded p-1.5">
                              <div className="flex items-center gap-1 mb-0.5">
                                <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded text-[10px] font-mono">N3</span>
                                <span className="font-mono text-xs">{l3.id}</span>
                              </div>
                              <div className="text-[11px] text-[var(--dim)]">{fmt(l3.rceAmount)}</div>
                              <input
                                type="text"
                                placeholder="Miembro..."
                                value={memberAssignments[l3.id] || ''}
                                onChange={(e) => assignMember(l3.id, e.target.value)}
                                className="px-1.5 py-0.5 bg-[var(--surf2)] border border-[var(--line)] rounded text-[11px] w-full mt-1"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-[var(--dim)] mt-3">
            Cada RCE Plena (N1) ramifica en 3 posiciones de 1/3 RCE (N2), cada una ramifica en 3 posiciones de 1 RCE (N3).
            Total: 3 + 9 + 27 = 39 posiciones. Asigna miembros a cada posición para trazabilidad.
          </p>
        </Card>
      )}

      {/* Tab: Distribución */}
      {tab === 'distribucion' && summary && (
        <div className="space-y-4">
          <Card title="Detalle de Distribución por Nivel">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[var(--dim)] border-b border-[var(--line)]">
                    <th className="pb-2">Nivel</th>
                    <th className="pb-2">Posiciones</th>
                    <th className="pb-2">RCE c/u</th>
                    <th className="pb-2">ZNU c/u</th>
                    <th className="pb-2">Total Nivel (USD)</th>
                    <th className="pb-2">Total Nivel (ZNU)</th>
                    <th className="pb-2">% del Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--line)]">
                    <td className="py-2 font-medium text-rose-400">1 — RCE Plena</td>
                    <td className="py-2">{summary.level1Count}</td>
                    <td className="py-2">{fmt(config.rcePlena)}</td>
                    <td className="py-2">{fmt(config.rcePlena / config.priceParity)}</td>
                    <td className="py-2 font-mono">{fmt(config.rcePlena * summary.level1Count)}</td>
                    <td className="py-2 font-mono text-emerald-400">{fmt((config.rcePlena / config.priceParity) * summary.level1Count)}</td>
                    <td className="py-2">{((config.rcePlena * summary.level1Count) / summary.totalUSDDistributed * 100).toFixed(1)}%</td>
                  </tr>
                  <tr className="border-b border-[var(--line)]">
                    <td className="py-2 font-medium text-amber-400">2 — 1/3 RCE</td>
                    <td className="py-2">{summary.level2Count}</td>
                    <td className="py-2">{fmt(config.rcePlena / 3)}</td>
                    <td className="py-2">{fmt(config.rcePlena / 3 / config.priceParity)}</td>
                    <td className="py-2 font-mono">{fmt((config.rcePlena / 3) * summary.level2Count)}</td>
                    <td className="py-2 font-mono text-emerald-400">{fmt((config.rcePlena / 3 / config.priceParity) * summary.level2Count)}</td>
                    <td className="py-2">{(((config.rcePlena / 3) * summary.level2Count) / summary.totalUSDDistributed * 100).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium text-emerald-400">3 — 1 RCE</td>
                    <td className="py-2">{summary.level3Count}</td>
                    <td className="py-2">{fmt(config.rcePlena)}</td>
                    <td className="py-2">{fmt(config.rcePlena / config.priceParity)}</td>
                    <td className="py-2 font-mono">{fmt(config.rcePlena * summary.level3Count)}</td>
                    <td className="py-2 font-mono text-emerald-400">{fmt((config.rcePlena / config.priceParity) * summary.level3Count)}</td>
                    <td className="py-2">{(config.rcePlena * summary.level3Count / summary.totalUSDDistributed * 100).toFixed(1)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-3 bg-[var(--surf2)] rounded-xl">
              <div className="flex justify-between text-sm">
                <span>Total posiciones activas: <b>{summary.totalPositions}</b></span>
                <span>Promedio por posición: <b className="text-emerald-400">{fmt(summary.avgPerPositionUSD)}</b></span>
              </div>
            </div>
          </Card>

          <Card title="Flujo de Valor (ValueFlows)">
            <p className="text-[var(--dim)] text-sm mb-3">
              Cada posición genera ValueFlows tipo <code className="px-1 bg-[var(--surf2)] rounded">LaborFlow</code> (trabajo en red), 
              <code className="px-1 bg-[var(--surf2)] rounded">CareFlow</code> (soporte entre niveles), 
              y <code className="px-1 bg-[var(--surf2)] rounded">GovernanceFlow</code> (decisiones CDS).
            </p>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="p-3 bg-[var(--surf2)] rounded-xl">
                <div className="font-medium text-rose-400">LaborFlow (N3→N2→N1)</div>
                <div className="text-[var(--dim)]">Trabajo productivo base</div>
              </div>
              <div className="p-3 bg-[var(--surf2)] rounded-xl">
                <div className="font-medium text-amber-400">CareFlow (N1↔N2↔N3)</div>
                <div className="text-[var(--dim)]">Soporte mutuo inter-niveles</div>
              </div>
              <div className="p-3 bg-[var(--surf2)] rounded-xl">
                <div className="font-medium text-emerald-400">GovernanceFlow (CDS)</div>
                <div className="text-[var(--dim)]">Decisiones colectivas</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab: Leyes MJ */}
      {tab === 'mj' && mj && (
        <div className="space-y-4">
          <Card title={`Cumplimiento Leyes MJ — Estado: ${mj.overall === 'ok' ? '✅ OK' : mj.overall === 'warn' ? '⚠️ ADVERTENCIA' : '🔴 BLOQUEADO'}`}>
            <div className="grid md:grid-cols-3 gap-4">
              {/* Ley I */}
              <div className={`p-4 rounded-xl border ${mj.law1.passed ? 'border-emerald-400/30 bg-emerald-400/10' : 'border-red-400/30 bg-red-400/10'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className={`w-5 h-5 ${mj.law1.passed ? 'text-emerald-400' : 'text-red-400'}`} />
                  <span className="font-manrope font-medium">Ley I — No tocar base material</span>
                </div>
                <p className="text-sm text-[var(--mut)]">{mj.law1.reason}</p>
                <div className="mt-2 text-xs text-[var(--dim)]">
                  Virginia Network es capa de <b>distribución de excedentes</b>, no extracción. 
                  Regeneración verificada vía CaaS streams habilitados.
                </div>
              </div>

              {/* Ley II */}
              <div className={`p-4 rounded-xl border ${mj.law2.passed ? 'border-emerald-400/30 bg-emerald-400/10' : 'border-red-400/30 bg-red-400/10'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {mj.law2.passed ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-400"
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-red-400"
                  )}
                  <span className="font-manrope font-medium">Ley II — ROI Colectivo ≥ 1</span>
                </div>
                <p className="text-sm text-[var(--mut)]">{mj.law2.reason}</p>
                <div className="mt-2 text-xs text-[var(--dim)]">
                  Valor generado: {fmt(mj.law2.roi * config.rcePlena * 3)} | Inversión semilla: {fmt(config.rcePlena * 3)} | ROI: {mj.law2.roi.toFixed(2)}
                </div>
              </div>

              {/* Ley III */}
              <div className={`p-4 rounded-xl border ${mj.law3.passed ? 'border-emerald-400/30 bg-emerald-400/10' : 'border-red-400/30 bg-red-400/10'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {mj.law3.passed ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-400"
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-red-400"
                  )}
                  <span className="font-manrope font-medium">Ley III — PGS Real (Lucidez Material)</span>
                </div>
                <p className="text-sm text-[var(--mut)]">{mj.law3.reason}</p>
                <div className="mt-2 text-xs text-[var(--dim)]">
                  PGS: {mj.law3.pgs.toFixed(2)} | AUT: {avgAut.toFixed(2)} | Población: {population(members)} | CDS: {cds.toFixed(2)}
                </div>
              </div>
            </div>

            {mj.overall !== 'ok' && (
              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-400/30 rounded-xl">
                <p className="text-amber-300 text-sm">
                  <b>Acciones requeridas:</b> 
                  {!mj.law2.passed && '• Aumentar AUT/CDS o reducir RCE Plena para ROI ≥ 1. '}
                  {!mj.law3.passed && '• Generar PGS real (datos de laboratorio) para activar Ley III. '}
                </p>
              </div>
            )}
          </Card>

          <Card title="Métricas Base (para MJ)">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Stat label="AUT Promedio" value={avgAut.toFixed(2)} color="text-rose-400" />
              <Stat label="PGS" value={pgs.toFixed(2)} color="text-emerald-400" />
              <Stat label="Población" value={population(members)} />
              <Stat label="CDS" value={cds.toFixed(2)} color="text-sky-400" />
            </div>
          </Card>
        </div>
      )}

      {/* Tab: CaaS Stream */}
      {tab === 'caas' && caasStream && (
        <div className="space-y-4">
          <Card title="Virginia Network como Stream CaaS">
            <div className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Stat label="Stream" value={caasStream.key} sub="key" />
                <Stat label="USDC In (semilla)" value={fmt(caasStream.usdcIn)} sub="3 RCEs" />
                <Stat label="ZNU Out" value={fmt(caasStream.znuOut)} sub="equivalente" color="text-emerald-400" />
                <Stat label="Toca base material" value={caasStream.touchesBaseMaterial ? 'SÍ 🔴' : 'NO ✅'} color={caasStream.touchesBaseMaterial ? 'text-red-400' : 'text-emerald-400'} />
              </div>
              <p className="text-sm text-[var(--dim)]">
                El árbol Virginia se registra como <b>stream de ingresos CaaS</b>. 
                No toca base material (Ley I ok). El reparto se hace por AUT+CDS con demurrage.
              </p>
              <Btn onClick={registerAsCaaSStream} className="w-full">
                Registrar como Stream CaaS Activo
              </Btn>
            </div>
          </Card>

          <Card title="Streams CaaS Actuales">
            {caasStreams.length === 0 ? (
              <EmptyState>Sin streams. Registra Virginia Network arriba.</EmptyState>
            ) : (
              <div className="space-y-2">
                {caasStreams.map((s) => (
                  <div key={s.key} className="flex items-center justify-between p-3 bg-[var(--surf2)] rounded-xl">
                    <div>
                      <p className="font-manrope">{s.name}</p>
                      <p className="text-xs text-[var(--dim)]">{s.enabled ? 'Activo' : 'Inactivo'} • USDC In: {fmt(s.usdcIn)} • ZNU Out: {fmt(s.znuOut)}</p>
                    </div>
                    <Badge color={s.touchesBaseMaterial ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'}>
                      {s.touchesBaseMaterial ? 'Toca base 🔴' : 'Limpio ✅'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Tab: Reparto AUT+CDS */}
      {tab === 'reparto' && tree && payouts.length > 0 && (
        <div className="space-y-4">
          <Card title="Reparto de Excedente por AUT+CDS con Demurrage">
            <p className="text-sm text-[var(--dim)] mb-4">
              Peso = nivel (N3=2.0, N2=1.5, N1=1.0) × (0.5+AUT) × (0.5+CDS). 
              Demurrage 5% sobre exceso de 300 ZNU (anti-acumulación).
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[var(--dim)] border-b border-[var(--line)]">
                    <th className="pb-2">Posición</th>
                    <th className="pb-2">Nivel</th>
                    <th className="pb-2">Miembro</th>
                    <th className="pb-2">Bruto ZNU</th>
                    <th className="pb-2">Demurrage</th>
                    <th className="pb-2">Neto ZNU</th>
                    <th className="pb-2">Base</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((p) => (
                    <tr key={p.positionId} className="border-b border-[var(--line)]">
                      <td className="py-2 font-mono text-xs">{p.positionId}</td>
                      <td className="py-2">
                        <Badge color={p.level === 3 ? 'bg-emerald-500/20 text-emerald-300' : p.level === 2 ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'}>
                          N{p.level}
                        </Badge>
                      </td>
                      <td className="py-2 font-manrope text-sm">{p.memberName}</td>
                      <td className="py-2 font-mono">{p.grossZNU}</td>
                      <td className="py-2 text-red-400 font-mono">{p.demurrageApplied}</td>
                      <td className="py-2 font-mono text-emerald-400 font-medium">{p.netZNU}</td>
                      <td className="py-2 text-xs text-[var(--dim)] max-w-xs truncate">{p.basis}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-[var(--lineq)]">
                    <td className="py-2 font-medium" colSpan={3}>TOTAL</td>
                    <td className="py-2 font-mono font-medium">{payouts.reduce((s, p) => s + p.grossZNU, 0).toFixed(2)}</td>
                    <td className="py-2 font-mono font-medium text-red-400">{payouts.reduce((s, p) => s + p.demurrageApplied, 0).toFixed(2)}</td>
                    <td className="py-2 font-mono font-medium text-emerald-400">{payouts.reduce((s, p) => s + p.netZNU, 0).toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <Btn onClick={runPayout} className="mt-3 w-full">
              Ejecutar Reparto y Auditar
            </Btn>
          </Card>

          {mj?.overall !== 'ok' && (
            <Card title="⚠️ Reparto Bloqueado por Leyes MJ">
              <p className="text-amber-300">
                El reparto solo se ejecuta si <b>todas las 3 Leyes MJ pasan</b>. 
                Estado actual: {mj?.overall === 'blocked' ? 'BLOQUEADO' : 'ADVERTENCIA'}.
              </p>
              <ul className="text-sm text-[var(--mut)] mt-2 space-y-1">
                {!mj.law1.passed && <li>• Ley I: Corregir toque de base material</li>}
                {!mj.law2.passed && <li>• Ley II: Mejorar ROI colectivo (AUT/CDS, reducir RCE Plena)</li>}
                {!mj.law3.passed && <li>• Ley III: Generar PGS real (datos laboratorio)</li>}
              </ul>
            </Card>
          )}
        </div>
      )}

      {tab === 'reparto' && (!tree || payouts.length === 0) && (
        <Card title="Reparto no disponible">
          <EmptyState>
            {mj?.overall !== 'ok' 
              ? 'Leyes MJ no cumplidas. Revisa la pestaña ⚖️ Leyes MJ.' 
              : 'Construye el árbol primero en la pestaña 🌲 Árbol.'}
          </EmptyState>
        </Card>
      )}
    </div>
  )
}