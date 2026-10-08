import React, { useState } from 'react';
import { Scale, Zap, Activity, Heart, Brain, Eye, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppStore } from '@core/state/store';
import { Card, Stat, Btn, Badge, EmptyState, Field, Bar } from '@components/ui';
import { useEV } from '@core/state/hooks/ev';

export const EV = () => {
  const {
    ev,
    energyToEfficiency,
    lifeToVirtue,
    detectFriction,
    detectCoherence,
    calculateMargin,
    updateDataRoot,
    integrateExperience,
    recognizeError,
    distinguishErrorFromEvasion,
    calculateAutonomyCost,
    calculateCDS,
    verifyPresence,
    registerHuella,
    generateRastro,
    updateMapaVivo,
    convergeMaps,
    verifyCompatibility,
    legitimateSeparation,
    zeroOrigin,
  } = useEV();

  const [activeTab, setActiveTab] = useState<'cycle' | 'margin' | 'presence' | 'truth' | 'records' | 'method'>('cycle');
  const [showMethod, setShowMethod] = useState(false);

  const friction = detectFriction(ev);
  const coherence = detectCoherence(ev);
  const margin = calculateMargin(
    ev.dataRoot[0] || { content: '', verified: false, timestamp: Date.now() },
    ev.presence[0] || { active: true, bodySignal: { type: 'fluidity', location: 'chest', intensity: 0.8 }, attention: { state: 'directed', timestamp: Date.now() }, timestamp: Date.now() },
    ev.attention[0] || { state: 'directed', timestamp: Date.now() },
    ev.evasions,
    ev.interference
  );

  const tabs = [
    { key: 'cycle', label: 'Ciclo E→V', icon: Zap },
    { key: 'margin', label: 'Margen', icon: Activity },
    { key: 'presence', label: 'Presencia', icon: Heart },
    { key: 'truth', label: 'Verdad', icon: Brain },
    { key: 'records', label: 'Registros', icon: Eye },
    { key: 'method', label: 'Método', icon: AlertTriangle },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">E→V</h1>
          <p className="text-muted-foreground mt-1">
            Patrón de la experiencia humana consciente: Energía → Experiencia → Eficiencia
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-amber-600 border-amber-600">
            Anfibio: ZNU/CaaS ↔ USD/USDC
          </Badge>
          <button
            onClick={() => setShowMethod(!showMethod)}
            className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
          >
            {showMethod ? 'Ocultar' : 'Mostrar'} Método
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex gap-1 px-1" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.key
                  ? 'bg-background text-foreground border-b-2 border-amber-500'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'cycle' && <CycleTab ev={ev} energyToEfficiency={energyToEfficiency} lifeToVirtue={lifeToVirtue} friction={friction} coherence={coherence} />}
      {activeTab === 'margin' && <MarginTab margin={margin} />}
      {activeTab === 'presence' && <PresenceTab ev={ev} verifyPresence={verifyPresence} />}
      {activeTab === 'truth' && <TruthTab ev={ev} />}
      {activeTab === 'records' && <RecordsTab ev={ev} />}
      {activeTab === 'method' && <MethodTab ev={ev} zeroOrigin={zeroOrigin} />}

      {showMethod && <MethodDetail ev={ev} zeroOrigin={zeroOrigin} />}
    </div>
  );
};

// ============================================================================
// Tab Components
// ============================================================================

const CycleTab = ({ ev, energyToEfficiency, lifeToVirtue, friction, coherence }) => (
  <div className="space-y-6">
    {/* Core Cycle Visualization */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-amber-600">
          <Zap className="w-5 h-5" /> E — Energía / Vida
        </h3>
        <div className="space-y-3">
          {ev.energy.slice(-3).map(e => (
            <div key={e.timestamp} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex justify-between text-sm">
                <span>{e.direction}</span>
                <span className="font-mono">{e.amount.toFixed(1)}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {e.narrative || 'Sin narrativa'}
              </div>
            </div>
          ))}
          {ev.energy.length === 0 && (
            <EmptyState
              icon={Zap}
              title="Sin energía registrada"
              description="Registra energía gastada (tiempo vital, atención, esfuerzo)"
            />
          )}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-blue-600">
          <Activity className="w-5 h-5" /> → — Experiencia / Verdad
        </h3>
        <div className="space-y-3">
          {ev.experience.slice(-3).map(exp => (
            <div key={exp.timestamp} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-between text-sm">
                <span>{exp.truth.content}</span>
                <Badge variant={exp.integrated ? 'default' : 'outline'}>
                  {exp.integrated ? 'Integrada' : 'Pendiente'}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Verificada: {exp.truth.verified ? 'Sí' : 'No'}
              </div>
            </div>
          ))}
          {ev.experience.length === 0 && (
            <EmptyState
              icon={Activity}
              title="Sin experiencias"
              description="Atraviesa la experiencia para transformar energía en eficiencia"
            />
          )}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-green-600">
          <Heart className="w-5 h-5" /> V — Eficiencia / Virtud
        </h3>
        <div className="space-y-3">
          {ev.efficiency.slice(-3).map(eff => (
            <div key={eff.timestamp} className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex justify-between text-sm">
                <span>{eff.direction}</span>
                <span className="font-mono">{eff.amount.toFixed(2)}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Desperdicio: {(eff.waste * 100).toFixed(1)}%
              </div>
            </div>
          ))}
          {ev.efficiency.length === 0 && (
            <EmptyState
              icon={Heart}
              title="Sin eficiencia"
              description="Cuando el pasaje se completa, hay coherencia"
            />
          )}
        </div>
      </Card>
    </div>

    {/* Friction & Coherence Indicators */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4 border-red-200">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-red-600">
          <AlertTriangle className="w-5 h-5" /> Fricción ({friction.length})
        </h3>
        <div className="space-y-2">
          {friction.length > 0 ? (
            friction.map(f => (
              <Badge key={f.timestamp} variant="destructive" className="gap-2">
                <AlertTriangle className="w-3 h-3" />
                <span>{f.source}</span>
                <span className="font-mono">Intensidad: {(f.intensity * 100).toFixed(0)}%</span>
                <span className="text-xs text-muted-foreground">{f.location}</span>
                {f.deferred && <span className="text-amber-600">Diferida</span>}
              </Badge>
            ))
          ) : (
            <EmptyState
              icon={AlertTriangle}
              title="Sin fricción detectada"
              description="El pasaje E→V fluye sin obstáculos"
            />
          )}
        </div>
      </Card>

      <Card className="p-4 border-green-200">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-green-600">
          <CheckCircle className="w-5 h-5" /> Coherencia ({coherence.length})
        </h3>
        <div className="space-y-2">
          {coherence.length > 0 ? (
            coherence.map(c => (
              <Badge key={c.efficiency.timestamp} variant="default" className="gap-2">
                <CheckCircle className="w-3 h-3" />
                <span>Coherencia activa</span>
                <span className="font-mono">Eficiencia: {(c.efficiency.amount * 100).toFixed(1)}%</span>
              </Badge>
            ))
          ) : (
            <EmptyState
              icon={CheckCircle}
              title="Sin coherencia activa"
              description="Cuando el pasaje E→V se completa, aparece coherencia"
            />
          )}
        </div>
      </Card>
    </div>

    {/* Dual Triad Visualization */}
    <Card className="p-4">
      <h3 className="font-semibold text-lg mb-4">Tríadas Duales E→V</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-amber-50 rounded-lg">
          <h4 className="font-semibold text-amber-800 mb-2">Primera Tríada</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>E</span><span className="font-semibold">Energía</span></div>
            <div className="flex justify-between"><span>→</span><span className="font-semibold">Experiencia</span></div>
            <div className="flex justify-between"><span>V</span><span className="font-semibold">Eficiencia</span></div>
          </div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">Segunda Tríada</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>E</span><span className="font-semibold">Vida</span></div>
            <div className="flex justify-between"><span>→</span><span className="font-semibold">Verdad</span></div>
            <div className="flex justify-between"><span>V</span><span className="font-semibold">Virtud</span></div>
          </div>
        </div>
      </div>
    </Card>
  </div>
);

const MarginTab = ({ margin }) => (
  <div className="space-y-6">
    <Card className="p-4">
      <h3 className="font-semibold text-lg mb-4">Margen Real</h3>
      <p className="text-muted-foreground mb-4">
        Espacio real de trayectorias disponibles para el operador en un momento dado.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat
          label="Trayectorias disponibles"
          value={margin.trajectories.filter(t => t.available).length}
          total={margin.trajectories.length}
          icon={Activity}
        />
        <Stat
          label="Restricciones activas"
          value={margin.restrictions.length}
          icon={AlertTriangle}
        />
        <Stat
          label="Umbrales pendientes"
          value={margin.thresholds.length}
          icon={AlertTriangle}
        />
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Trayectorias</h4>
          <div className="space-y-2">
            {margin.trajectories.map(t => (
              <Badge key={t.id} variant={t.available ? 'default' : 'outline'} className="gap-2">
                <span>{t.direction}</span>
                <span className="font-mono">Costo: {t.cost}</span>
                <Badge variant={t.available ? 'default' : 'secondary'}>{t.available ? 'Disponible' : 'No disponible'}</Badge>
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Restricciones ({margin.restrictions.length})</h4>
          <div className="space-y-2">
            {margin.restrictions.map(r => (
              <Badge key={r.domain} variant="destructive" className="gap-2">
                <AlertTriangle className="w-3 h-3" />
                <span>{r.domain}</span>
                <span className="text-xs">{r.description}</span>
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Umbrales ({margin.thresholds.length})</h4>
          <div className="space-y-2">
            {margin.thresholds.map(th => (
              <Badge key={th.description} variant="outline" className="gap-2">
                <span>{th.description}</span>
                <span className="text-xs text-muted-foreground">{th.infoMissing}</span>
              </Badge>
            ))}
            {margin.thresholds.length === 0 && (
              <EmptyState icon={AlertTriangle} title="Sin umbrales" description="No hay límites de información insuficiente" />
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Desfases ({margin.gaps.length})</h4>
          <div className="space-y-2">
            {margin.gaps.map(g => (
              <Badge key={g.type} variant={g.painful ? 'destructive' : 'outline'} className="gap-2">
                <span>{g.type === 'awareness_ahead' ? 'Conciencia adelantada' : 'Capacidad detrás'}</span>
                <span className="text-xs">{g.description}</span>
                {g.painful && <span className="text-red-600">Duele</span>}
              </Badge>
            ))}
            {margin.gaps.length === 0 && <EmptyState icon={Activity} title="Sin desfases" />}
          </div>
        </div>
      </div>
    </Card>
  </div>
);

const PresenceTab = ({ ev, verifyPresence }) => (
  <div className="space-y-6">
    <Card className="p-4">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Heart className="w-5 h-5 text-red-500" /> Presencia
      </h3>
      <p className="text-muted-foreground mb-4">
        Función que se ejecuta en cada micro-momento. Condición previa para ver el dato raíz.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h4 className="font-semibold mb-3">Estado Actual</h4>
          <div className="space-y-3">
            {ev.presence.slice(-1).map(p => (
              <div key={p.timestamp} className="space-y-2">
                <Badge variant={p.active ? 'default' : 'secondary'} className="gap-2">
                  <Heart className="w-3 h-3" />
                  <span>{p.active ? 'Presente' : 'Ausente'}</span>
                </Badge>
                <div className="text-sm">
                  <span className="font-medium">Señal corporal: </span>
                  <span className="text-muted-foreground">{p.bodySignal.type}</span>
                  <span className="text-muted-foreground ml-2">({p.bodySignal.location})</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Atención: </span>
                  <Badge variant={p.attention.state === 'directed' ? 'default' : 'secondary'}>
                    {p.attention.state}
                  </Badge>
                  {p.attention.target && <span className="ml-2 text-xs text-muted-foreground">→ {p.attention.target}</span>}
                </div>
              </div>
            ))}
            {ev.presence.length === 0 && <EmptyState icon={Heart} title="Sin presencia registrada" />}
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="font-semibold mb-3">Verificar Presencia</h4>
          <button
            onClick={() => {
              const presence = verifyPresence('operator');
              alert(JSON.stringify(presence, null, 2));
            }}
            className="w-full px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors"
          >
            Verificar Presencia Ahora
          </button>
          <p className="text-xs text-muted-foreground mt-2">
            Verifica: señal corporal, atención, presencia relacional
          </p>
        </Card>
      </div>

      <Card className="p-4">
        <h4 className="font-semibold mb-3">Historial de Señales Corporales</h4>
        <div className="space-y-2">
          {ev.bodySignals.slice(-5).map(s => (
            <Badge key={s.timestamp} variant="outline" className="gap-2">
              <span>{s.type}</span>
              <span className="text-muted-foreground">{s.location}</span>
              <span className="font-mono">Intensidad: {(s.intensity * 100).toFixed(0)}%</span>
            </Badge>
          ))}
          {ev.bodySignals.length === 0 && <EmptyState icon={Heart} title="Sin señales registradas" />}
        </div>
      </Card>

      <Card className="p-4">
        <h4 className="font-semibold mb-3">Atención Reciente</h4>
        <div className="space-y-2">
          {ev.attention.slice(-5).map(a => (
            <Badge key={a.timestamp} variant={a.state === 'directed' ? 'default' : 'secondary'} className="gap-2">
              <span>{a.state}</span>
              {a.target && <span className="text-muted-foreground ml-2">→ {a.target}</span>}
              {a.source && <span className="text-red-600 ml-2">⚠ {a.source}</span>}
            </Badge>
          ))}
          {ev.attention.length === 0 && <EmptyState icon={Eye} title="Sin historial de atención" />}
        </div>
      </Card>
  </Card>
    </div>
);

const TruthTab = ({ ev }) => (
  <div className="space-y-6">
    <Card className="p-4">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Brain className="w-5 h-5 text-blue-600" /> Verdad
      </h3>
      <p className="text-muted-foreground mb-4">
        La verdad no se posee. Se atraviesa. Es la experiencia misma.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h4 className="font-semibold text-blue-800 mb-3">Verdad Propia</h4>
          <div className="space-y-3">
            {ev.truthOwn.slice(-3).map(t => (
              <div key={t.timestamp} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between text-sm">
                  <span>{t.content}</span>
                  <Badge variant={t.correspondence ? 'default' : 'secondary'}>
                    {t.correspondence ? 'Corresponde' : 'No corresponde'}
                  </Badge>
                </div>
              </div>
            ))}
            {ev.truthOwn.length === 0 && <EmptyState icon={Brain} title="Sin verdad propia registrada" />}
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="font-semibold text-purple-800 mb-3">Verdad Ontológica</h4>
          <div className="space-y-3">
            {ev.truthOntological.slice(-3).map(t => (
              <div key={t.timestamp} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex justify-between text-sm">
                  <span>{t.structure}</span>
                  <Badge variant={t.demonstratesCompatibility ? 'default' : 'secondary'}>
                    {t.demonstratesCompatibility ? 'Compatible' : 'Incompatible'}
                  </Badge>
                </div>
              </div>
            ))}
            {ev.truthOntological.length === 0 && <EmptyState icon={Brain} title="Sin verdad ontológica registrada" />}
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h4 className="font-semibold text-amber-800 mb-3">Soberanía de la Evaluación</h4>
        <div className="space-y-3">
          {ev.sovereignty.slice(-3).map(s => (
            <Badge key={s.timestamp} variant={s.evaluationInstance === 'operator' ? 'default' : 'secondary'} className="gap-2">
                          <span>Instancia: {s.evaluationInstance}</span>
                          <Badge variant={s.validationRequired ? 'secondary' : 'default'}>
                            {s.validationRequired ? 'Requiere validación' : 'Autovalidación'}
                          </Badge>
                        </Badge>
                      ))}
          {ev.sovereignty.length === 0 && <EmptyState icon={ShieldHalf} title="Sin registros de soberanía" />}
        </div>
      </Card>
  </Card>
    </div>
);

const RecordsTab = ({ ev }) => (
  <div className="space-y-6">
    <Card className="p-4">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Eye className="w-5 h-5" /> Registros E→V
      </h3>
      <p className="text-muted-foreground mb-4">
        Formato mínimo de registro: 6 campos para verificar sin exponer intimidad.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Categoría</th>
              <th className="text-left p-2">Costos (I/T/E)</th>
              <th className="text-left p-2">Horizonte</th>
              <th className="text-left p-2">Rastro Corporal</th>
              <th className="text-left p-2">Resultado</th>
              <th className="text-left p-2">Reapertura</th>
            </tr>
          </thead>
          <tbody>
            {ev.records.slice(-10).map(r => (
              <tr key={r.id} className="border-t border-border/50">
                <td className="p-2 font-mono text-xs">{r.id.slice(0, 12)}...</td>
                <td className="p-2"><Badge variant="outline">{r.category}</Badge></td>
                <td className="p-2">
                  <div className="flex gap-1">
                    {r.costs.internal && <Badge variant="default" className="text-xs">Interno</Badge>}
                    {r.costs.transition && <Badge variant="secondary" className="text-xs">Transición</Badge>}
                    {r.costs.external && <Badge variant="destructive" className="text-xs">Externo</Badge>}
                  </div>
                </td>
                <td className="p-2">{r.timeHorizon}</td>
                <td className="p-2">{r.bodyTrace}</td>
                <td className="p-2">
                  <Badge variant={r.result === 'relief' ? 'default' : r.result === 'chaos' ? 'destructive' : 'secondary'}>
                    {r.result}
                  </Badge>
                </td>
                <td className="p-2">
                  {r.reopening.happened ? (
                    <Badge variant="secondary" className="gap-1">
                      <span>Reabierto</span>
                      <Badge variant="outline" className="text-xs">{r.reopening.reason}</Badge>
                    </Badge>
                  ) : (
                    <Badge variant="default">Cerrado</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ev.records.length === 0 && (
        <EmptyState
          icon={Eye}
          title="Sin registros E→V"
          description="Usa el formato de 6 campos para registrar verificaciones"
        />
      )}

      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="font-semibold mb-3">Nuevo Registro</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Formato: Categoría | Costos (I/T/E) | Horizonte | Rastro Corporal | Resultado | Reapertura
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
          <select className="px-3 py-2 border border-border rounded-lg">
            <option value="">Categoría</option>
            <option value="work">Trabajo</option>
            <option value="relationships">Vínculos</option>
            <option value="body">Cuerpo</option>
            <option value="past">Pasado</option>
            <option value="expectation">Expectativa</option>
            <option value="other">Otro</option>
          </select>
          <select className="px-3 py-2 border border-border rounded-lg">
            <option value="">Costos</option>
            <option value="internal">Interno</option>
            <option value="transition">Transición</option>
            <option value="external">Externo</option>
          </select>
          <select className="px-3 py-2 border border-border rounded-lg">
            <option value="">Horizonte</option>
            <option value="1 día">1 día</option>
            <option value="1 semana">1 semana</option>
            <option value="1 mes">1 mes</option>
          </select>
          <select className="px-3 py-2 border border-border rounded-lg">
            <option value="">Rastro Corporal</option>
            <option value="chest">Pecho</option>
            <option value="stomach">Estómago</option>
            <option value="breath">Respiración</option>
            <option value="sleep">Sueño</option>
            <option value="energy">Energía</option>
          </select>
          <select className="px-3 py-2 border border-border rounded-lg">
            <option value="">Resultado</option>
            <option value="relief">Alivio</option>
            <option value="chaos">Caos</option>
            <option value="ambiguous">Ambiguo</option>
          </select>
          <select className="px-3 py-2 border border-border rounded-lg">
            <option value="">Reapertura</option>
            <option value="choice">Por elección</option>
            <option value="habit">Por hábito</option>
            <option value="external_pressure">Presión externa</option>
          </select>
        </div>
        <button className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
          Registrar Verificación
        </button>
      </div>
    </Card>
  </div>
);

const MethodTab = ({ ev }) => (
  <div className="space-y-6">
    <Card className="p-4">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-amber-600" /> Método E→V
      </h3>
      <p className="text-muted-foreground mb-4">
        E→V no se verifica con experimento externo. Se habita con la propia vida.
      </p>

      <div className="space-y-6">
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h4 className="font-semibold text-amber-800 mb-3">Paso 1: Mirar la vida</h4>
          <p className="text-sm text-muted-foreground mb-2">No la que se cuenta. La que se vive.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {[
              'Sostener ante otros que un vínculo o trabajo está bien, cuando internamente ya se sabe que no',
              'Mantener en pie una explicación que ya se retiró por dentro',
              'Permanecer en una estructura cuya incompatibilidad ya se reconoció, y seguir explicando por qué se permanece'
            ].map((ex, i) => (
              <Card key={i} className="p-3 bg-amber-50 border-amber-200">
                <p className="text-sm text-amber-800">{ex}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-3">Paso 2: Identificar narrativa falsa</h4>
          <p className="text-sm text-muted-foreground mb-2">¿Dónde hay energía gastada en sostener algo que no es verdad?</p>
          <div className="space-y-2 text-sm mt-4">
            <Badge variant="outline" className="gap-2">Trabajo <span className="ml-2">✓</span></Badge>
            <Badge variant="outline" className="gap-2">Vínculos <span className="ml-2">✓</span></Badge>
            <Badge variant="outline" className="gap-2">Cuerpo <span className="ml-2">✓</span></Badge>
            <Badge variant="outline" className="gap-2">Pasado <span className="ml-2">✓</span></Badge>
            <Badge variant="outline" className="gap-2">Expectativa <span className="ml-2">✓</span></Badge>
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-800 mb-3">Paso 3: Dejar de sostenerlo</h4>
          <p className="text-sm text-muted-foreground mb-2">Aunque sea por un día. Aunque sea por una hora.</p>
          <div className="space-y-2 text-sm mt-4">
            <Badge variant="outline" className="gap-2">Por un día <span className="ml-2">✓</span></Badge>
            <Badge variant="outline" className="gap-2">Por una hora <span className="ml-2">✓</span></Badge>
            <Badge variant="outline" className="gap-2">Por un momento <span className="ml-2">✓</span></Badge>
          </div>
        </div>

        <div className="p-4 bg-red-50 border-red-200">
          <h4 className="font-semibold text-red-800 mb-3">Paso 4: Observar qué pasa</h4>
          <p className="text-sm text-muted-foreground mb-2">No en la cabeza. En el cuerpo. En la vida.</p>
          <div className="space-y-2 text-sm mt-4">
            <Badge variant="default" className="gap-2">Alivio <span className="ml-2">✓</span></Badge>
            <Badge variant="destructive" className="gap-2">Caos <span className="ml-2">✓</span></Badge>
            <Badge variant="secondary" className="gap-2">Ambiguo <span className="ml-2">✓</span></Badge>
            <p className="text-xs text-muted-foreground mt-2">
              El caos no es fracaso. Es dato. El alivio indica E→V funcionando.
            </p>
          </div>
        </div>
      </div>
    </Card>

    <Card className="p-4">
      <h3 className="font-semibold text-lg mb-4">Formato de Registro (6 campos)</h3>
      <p className="text-muted-foreground mb-4">Captura la estructura, no el contenido de la experiencia.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { num: 1, label: 'Categoría', desc: 'Trabajo, vínculos, cuerpo, pasado, expectativa, otro' },
          { num: 2, label: 'Costos', desc: 'Interno, transición, externo' },
          { num: 3, label: 'Horizonte', desc: '1 día, 1 semana, 1 mes' },
          { num: 4, label: 'Rastro corporal', desc: 'Pecho, estómago, respiración, sueño, energía' },
          { num: 5, label: 'Resultado', desc: 'Alivio, caos, ambiguo' },
          { num: 6, label: 'Reapertura', desc: 'Elección, hábito, presión externa' },
        ].map((f, i) => (
          <Card key={i} className="p-3">
            <div className="flex items-start gap-2">
              <span className="w-6 h-6 flex items-center justify-center bg-amber-100 text-amber-700 rounded-full text-sm font-bold">
                {f.num}
              </span>
              <div>
                <p className="font-semibold">{f.label}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>

    <Card className="p-4">
      <h3 className="font-semibold text-lg mb-4">Qué cambia al habitarlo</h3>
      <div className="space-y-3 text-sm">
        <p>E→V no promete que la vida vaya a ir bien. No es una promesa.</p>
        <p className="text-green-700 font-medium">Lo que describe es un efecto consistente: cuando la energía deja de gastarse en justificar la propia existencia, esa energía queda disponible.</p>
        <p className="text-muted-foreground">
          Buena parte del peso que muchos sienten por estar vivos no viene de la vida. Viene del gasto continuo de justificarla.
        </p>
        <p className="text-green-700 font-medium">Cuando deja de hacerse, aparece alivio. No euforia. No sentido. No respuestas. Alivio: menos carga en el día a día. Claridad existencial.</p>
      </div>
    </Card>
  </div>
);

const MethodDetail = ({ ev, zeroOrigin }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-background rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Método E→V — Detalle Completo</h2>
          <button onClick={() => setShowMethod(false)} className="p-2 hover:bg-accent rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Zero Origin */}
          <Card className="p-4 border-amber-200 bg-amber-50">
            <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5" /> Nacemos en Cero
            </h4>
            <div className="space-y-2 text-sm">
              {[
                'No elegimos venir',
                'No hay contrato',
                'No hay deuda original',
                'No hay pecado original',
                'La existencia no nos debe nada',
                'Tampoco nosotros le debemos nada',
                'Una vez que se acepta ese cero, empieza la vida en E→V'
              ].map((item, i) => (
                <Badge key={i} variant="outline" className="gap-2">
                  <CheckCircle className="w-3 h-3" />
                  <span>{item}</span>
                </Badge>
              ))}
            </div>
          </Card>

          {/* Leyes MJ */}
          <Card className="p-4">
            <h4 className="font-semibold mb-4">Leyes del Materialismo Jerárquico (Filtro Isomórfico)</h4>
            <div className="space-y-3">
              {[
                { num: 'I', title: 'No dañar base material / personas', desc: 'Energía vital no dañable → mapea contratos/prod/recursos', color: 'red' },
                { num: 'II', title: 'Ganarse la vida soberanizando (AUT×CDS)', desc: 'Experiencia = trabajo soberano → mapea trabajo/contribución/crédito', color: 'blue' },
                { num: 'III', title: 'Lucidez, nunca engañar', desc: 'Lucidez = no engaño → mapea transparencia/append-only/verificación', color: 'green' },
              ].map((law, i) => (
                <Card key={i} className={`p-3 border-l-4 border-${law.color}-500 bg-${law.color}-50`}>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-lg text-{law.color}-700">Ley {law.num}</span>
                    <div>
                      <p className="font-semibold text-{law.color}-800">{law.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{law.desc}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-semibold mb-4">CaaS — Comunidad como Servicio</h4>
            <p className="text-sm text-muted-foreground mb-4">Acceso por contribución real, no por dinero.</p>
            <div className="space-y-2 text-sm">
              <Badge variant="outline" className="gap-2">Acceso por contribución real <span className="ml-2">✓</span></Badge>
              <Badge variant="outline" className="gap-2">No por dinero <span className="ml-2">✓</span></Badge>
              <Badge variant="outline" className="gap-2">CaaS = acceso por contribución real <span className="ml-2">✓</span></Badge>
            </div>
          </Card>

          {/* Principio Anfibio */}
          <Card className="p-4 border-amber-200 bg-amber-50">
            <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5" /> Principio Anfibio
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Misma lógica de cálculo opera en modo 'postmonetario' (ZNU/CaaS, default offline) 
              o 'conectado' (USD/USDC vía oráculo priceParity, Nivel 3 ReFi); el render decide la etiqueta, la lógica es agnóstica a la unidad.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Card className="p-3 bg-green-50 border-green-200">
                <h5 className="font-semibold text-green-800 mb-2">Postmonetario (Default)</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Offline-first</li>
                  <li>ZNU / CaaS</li>
                  <li>Local-first</li>
                  <li>Etiqueta: ZNU</li>
                </ul>
              </Card>
              <Card className="p-3 bg-blue-50 border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-2">Conectado (Nivel 3 ReFi)</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>USD/USDC vía oráculo priceParity</li>
                  <li>1 ZNU ≈ 1 USD vía oracle</li>
                  <li>Nivel 3 ReFi</li>
                  <li>Etiqueta: USD</li>
                </ul>
              </Card>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Extirpar SOLO la INFRA ajena (cloud, blockchain, USD payments, analytics), 
              conservar la LÓGICA (signal detection, attention allocation, coherence/friction, presence, truth cycles).
            </p>
          </Card>

          {/* Extirpación vs Conservación */}
          <Card className="p-4">
            <h4 className="font-semibold mb-4">Extirpar vs Conservar (Principio Anfibio aplicado)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-3 bg-red-50 border-red-200">
                <h5 className="font-semibold text-red-800 mb-2">✂️ Extirpar (Infra Ajena)</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Cloud infrastructure (AWS, GCP, Azure)</li>
                  <li>Blockchain (EVM, Solana, etc.)</li>
                  <li>USD payments (Stripe, banking)</li>
                  <li>Analytics (Mixpanel, GA, etc.)</li>
                  <li>Heavy SDKs (anthropic, tokenizers, Rust)</li>
                  <li>Telegram bots, WebSocket daemons</li>
                  <li>Electron, ACP, Lambda, Mediabunny</li>
                  <li>Three.js, HyperSync API, 21 platforms</li>
                </ul>
              </Card>
              <Card className="p-3 bg-green-50 border-green-200">
                <h5 className="font-semibold text-green-800 mb-2">💚 Conservar (Lógica Pura)</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Ciclo E→V (energy→experience→efficiency)</li>
                  <li>Detector de fricción / coherencia</li>
                  <li>Verificador de presencia</li>
                  <li>Mapa vivo (huella → rastro → mapa)</li>
                  <li>Ciclos de verdad (experiencia → integración)</li>
                  <li>Detector de error vs evasión</li>
                  <li>Verificador de presencia</li>
                  <li>Lógica de cálculo anfibia (unit-agnostic)</li>
                </ul>
              </Card>
            </div>
          </Card>

          {/* Zero Origin Detail */}
          <Card className="p-4">
            <h4 className="font-semibold mb-4">Nacemos en Cero — Detalle</h4>
            <div className="space-y-2 text-sm">
              {[
                'No elegimos venir',
                'No hay contrato',
                'No hay deuda original',
                'No hay pecado original',
                'La existencia no nos debe nada',
                'Tampoco nosotros le debemos nada',
                'Una vez que se acepta ese cero, empieza la vida en E→V'
              ].map((item, i) => (
                <Badge key={i} variant="outline" className="gap-2">
                  <CheckCircle className="w-3 h-3" />
                  <span>{item}</span>
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
);

export default EV;