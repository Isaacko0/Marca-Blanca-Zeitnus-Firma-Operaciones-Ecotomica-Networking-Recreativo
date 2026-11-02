/**
 * Aging Control Screen — 5 Tabs
 * HSCSG v15 OS — Pantalla principal para Control Laws in Aging
 */

import {
  LucideIcon,
  Brain,
  Zap,
  FlaskConical,
  LineChart,
  Settings,
  Target,
  RefreshCw,
  HelpCircle,
  Check,
} from 'lucide-react';
import { useStore } from '@core/state/store';
import {
  useAgingControlConfig,
  useAgingControlMode,
  useSelectedInterventions,
  useInitialState,
  useTrajectory,
  useOptimalControls,
  useCaseStudies,
  useLastCost,
  useLifespanMetrics,
  useAgingControlActions,
} from '@core/state/hooks/aging-control';
import type { Intervention, CaseStudyResult, ControlCost, AgingControlMode } from '@core/state/aging-control';
import { AGING_CONTROL_PRESETS, CANONICAL_INTERVENTIONS } from '@core/state/aging-control';

// ============================================================================
// Types & Constants
// ============================================================================

interface TabConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  component: React.FC;
}

const TABS: TabConfig[] = [
  { id: 'configure', label: 'Configurar', icon: Settings, component: ConfigureTab },
  { id: 'interventions', label: 'Intervenciones', icon: FlaskConical, component: InterventionsTab },
  { id: 'simulate', label: 'Simular', icon: LineChart, component: SimulateTab },
  { id: 'optimize', label: 'Optimizar', icon: Target, component: OptimizeTab },
  { id: 'studies', label: 'Casos', icon: Brain, component: CaseStudiesTab },
];

const STATE_LABELS = [
  { key: 'age', label: 'Edad cronológica', unit: 'años', index: 0, color: 'text-blue-400' },
  { key: 'bioAge', label: 'Edad biológica', unit: 'años', index: 1, color: 'text-red-400' },
  { key: 'healthCapital', label: 'Capital de salud', unit: '[0-1]', index: 2, color: 'text-green-400' },
  { key: 'damageLoad', label: 'Carga de daño', unit: 'u.a.', index: 3, color: 'text-orange-400' },
  { key: 'interventionCapacity', label: 'Capacidad intervención', unit: '[0-1]', index: 4, color: 'text-purple-400' },
];

const INTERVENTION_TYPES: Record<string, { label: string; color: string; icon: LucideIcon }> = {
  pharmacological: { label: 'Farmacológica', color: 'bg-blue-500/20 text-blue-400', icon: FlaskConical },
  lifestyle: { label: 'Estilo de vida', color: 'bg-green-500/20 text-green-400', icon: Zap },
  gene: { label: 'Genética', color: 'bg-purple-500/20 text-purple-400', icon: Brain },
  senolytic: { label: 'Senolítica', color: 'bg-orange-500/20 text-orange-400', icon: Target },
  metabolic: { label: 'Metabólica', color: 'bg-cyan-500/20 text-cyan-400', icon: FlaskConical },
  combination: { label: 'Combinación', color: 'bg-pink-500/20 text-pink-400', icon: Zap },
};

// ============================================================================
// Utility Components
// ============================================================================

const MetricCard: React.FC<{
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}> = ({ label, value, unit, trend, color }) => (
  <div className="bg-card border border-border rounded-xl p-4">
    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</div>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-mono font-bold" style={{ color }}>{value}</span>
      {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      {trend && (
        <span className={`ml-2 text-xs ${trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-muted-foreground'}`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
        </span>
      )}
    </div>
  </div>
);

const CostBreakdown: React.FC<{ cost: ControlCost | null; mode: AgingControlMode }> = ({ cost, mode }) => {
  if (!cost) return <div className="text-muted-foreground text-center py-8">Sin datos de costo</div>;

  const total = cost.total || 1;
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Económico</span>
        <span className="font-mono">{cost.economic.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Biológico</span>
        <span className="font-mono">{cost.biological.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Entrópico</span>
        <span className="font-mono">{cost.entropic.toFixed(2)}</span>
      </div>
      <div className="border-t border-border pt-3 flex justify-between font-bold">
        <span>Total</span>
        <span className="font-mono">{total.toFixed(2)} {mode === 'conectado' ? 'ZNU' : 'uds'}</span>
      </div>
      <div className="w-full bg-border/20 rounded-full h-2 overflow-hidden">
        <div
          className="bg-blue-500 h-full rounded-full transition-all"
          style={{ width: `${(cost.economic / total) * 100}%` }}
        />
      </div>
      <div className="w-full bg-border/20 rounded-full h-2 overflow-hidden">
        <div
          className="bg-red-500 h-full rounded-full transition-all"
          style={{ width: `${(cost.biological / total) * 100}%` }}
        />
      </div>
      <div className="w-full bg-border/20 rounded-full h-2 overflow-hidden">
        <div
          className="bg-purple-500 h-full rounded-full transition-all"
          style={{ width: `${(cost.entropic / total) * 100}%` }}
        />
      </div>
    </div>
  );
};

const StateVectorDisplay: React.FC<{ state: number[] | null; label?: string }> = ({ state, label }) => {
  if (!state) return <div className="text-muted-foreground text-center py-8">Sin datos</div>;

  return (
    <div className="space-y-2">
      {label && <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>}
      <div className="grid grid-cols-5 gap-2 text-xs">
        {STATE_LABELS.map(s => (
          <div
            key={s.key}
            className={`text-center p-2 rounded-lg border border-border/50 ${s.color}`}
          >
            <div className="font-mono font-bold">{state[s.index].toFixed(2)}</div>
            <div className="text-[10px] text-muted-foreground">{s.unit}</div>
            <div className="text-[10px]">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// Tab Components
// ============================================================================

function ConfigureTab() {
  const config = useStore(useAgingControlConfig);
  const mode = useStore(useAgingControlMode);
  const { setConfig, setMode, applyPreset } = useStore(useAgingControlActions);

  const handlePriceParityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 100;
    setMode('conectado', val);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Configuración del Control</h2>
        <div className="flex gap-2">
          {(['conservative', 'aggressive', 'conectado'] as const).map(p => (
            <button
              key={p}
              onClick={() => applyPreset(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                JSON.stringify(config) === JSON.stringify(
                  AGING_CONTROL_PRESETS[p]
                ) ? 'bg-accent text-accent-foreground' : 'bg-card border border-border hover:bg-accent/10'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Parámetros de Simulación
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Horizonte temporal (años)</label>
              <input
                type="number"
                min="5"
                max="60"
                value={config.horizon}
                onChange={e => setConfig({ horizon: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Tasa de descuento</label>
              <input
                type="number"
                min="0"
                max="0.2"
                step="0.01"
                value={config.discountRate}
                onChange={e => setConfig({ discountRate: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Tolerancia viabilidad</label>
              <input
                type="number"
                min="0.001"
                max="0.1"
                step="0.001"
                value={config.viabilityTol}
                onChange={e => setConfig({ viabilityTol: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Precisión corchete Lie</label>
              <input
                type="number"
                min="1e-7"
                max="1e-3"
                step="1e-6"
                value={config.liePrecision}
                onChange={e => setConfig({ liePrecision: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Modo Anfibio
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  checked={mode === 'postmonetario'}
                  onChange={() => setMode('postmonetario')}
                  className="w-4 h-4 accent-accent"
                />
                <span className="font-medium">Postmonetario</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  checked={mode === 'conectado'}
                  onChange={() => setMode('conectado', config.priceParity)}
                  className="w-4 h-4 accent-accent"
                />
                <span className="font-medium">Conectado (USD/ZNU)</span>
              </label>
            </div>

            {mode === 'conectado' && (
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Price Parity (ZNU por USD): {config.priceParity}
                </label>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={config.priceParity || 100}
                  onChange={handlePriceParityChange}
                  className="w-full h-2 bg-background rounded-lg appearance-none accent-accent"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  1 USD = {config.priceParity} ZNU (oráculo externo)
                </div>
              </div>
            )}

            <div className="p-3 bg-muted/50 rounded-lg text-sm">
              <HelpCircle className="w-4 h-4 inline-block mr-1" />
              <strong>Principio Anfibio:</strong> La lógica de control es idéntica; solo cambia la
              unidad de coste económico. Postmonetario = unidades abstractas; Conectado = ZNU vía priceParity.
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Estado Inicial (vector 5D)
        </h3>
        <StateVectorDisplay state={useStore(useInitialState)} />
        <div className="mt-4 grid grid-cols-5 gap-2">
          {STATE_LABELS.map(s => (
            <div key={s.key} className="bg-background border border-border rounded-lg p-3">
              <label className="block text-xs text-muted-foreground mb-1">{s.label}</label>
              <input
                type="number"
                step="0.01"
                defaultValue={useStore(useInitialState)[s.index]}
                onChange={e => {
                  const newState = [...useStore(useInitialState)];
                  newState[s.index] = parseFloat(e.target.value);
                  useStore.getState().setInitialState(newState);
                }}
                className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:ring-2 focus:ring-accent"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InterventionsTab() {
  const interventions = useStore(useSelectedInterventions);
  const { setSelectedInterventions, addCustomIntervention } = useStore(useAgingControlActions);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    type: 'pharmacological' as any,
    controlVector: [0, -0.01, 0.01, -0.01, 0.01],
    costParams: { economicWeight: 0.1, biologicalWeight: 0.2, entropicWeight: 0.1, scalingExponent: 1.1 },
    decayRate: 0.05,
    minIntensity: 0,
    maxIntensity: 10,
  });

  const allInterventions = CANONICAL_INTERVENTIONS;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomIntervention(formData as any);
    setShowForm(false);
    setFormData({
      id: '',
      name: '',
      type: 'pharmacological',
      controlVector: [0, -0.01, 0.01, -0.01, 0.01],
      costParams: { economicWeight: 0.1, biologicalWeight: 0.2, entropicWeight: 0.1, scalingExponent: 1.1 },
      decayRate: 0.05,
      minIntensity: 0,
      maxIntensity: 10,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Intervenciones</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 flex items-center gap-2"
        >
          <Zap className="w-4 h-4" /> Nueva intervención
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold">Nueva Intervención Personalizada</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">ID</label>
              <input
                value={formData.id}
                onChange={e => setFormData({ ...formData, id: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Nombre</label>
              <input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Tipo</label>
            <select
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg"
            >
              {Object.entries(INTERVENTION_TYPES).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {STATE_LABELS.slice(1).map(s => (
              <div key={s.key}>
                <label className="block text-xs text-muted-foreground mb-1">
                  {s.label} (g[{s.index}])
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={formData.controlVector[s.index]}
                  onChange={e => {
                    const v = [...formData.controlVector];
                    v[s.index] = parseFloat(e.target.value);
                    setFormData({ ...formData, controlVector: v });
                  }}
                  className="w-full px-2 py-1 bg-background border border-border rounded text-sm"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-accent text-accent-foreground rounded-lg">
              Guardar
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-card border border-border rounded-lg">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {allInterventions.map((intervention: Intervention) => {
          const isSelected = interventions.some((i: Intervention) => i.id === intervention.id);
          const typeInfo = INTERVENTION_TYPES[intervention.type];

          return (
            <div
              key={intervention.id}
              className={`bg-card border border-border rounded-xl p-4 transition-all ${
                isSelected ? 'ring-2 ring-accent bg-accent/5' : 'hover:border-accent/50'
              }`}
              onClick={() => setSelectedInterventions(
                isSelected
                  ? interventions.filter((i: Intervention) => i.id !== intervention.id)
                  : [...interventions, intervention]
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <typeInfo.icon className={`w-5 h-5 ${typeInfo.color.replace('bg-', 'text-')}`} />
                  <div>
                    <div className="font-medium">{intervention.name}</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                  </div>
                </div>
                {isSelected && <Check className="w-5 h-5 text-accent" />}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">BioAge</span>
                  <span className="font-mono">{intervention.controlVector[1].toFixed(3)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Health</span>
                  <span className="font-mono">{intervention.controlVector[2].toFixed(3)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Damage</span>
                  <span className="font-mono">{intervention.controlVector[3].toFixed(3)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="font-mono">{intervention.controlVector[4].toFixed(3)}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between text-xs">
                  <span className="text-muted-foreground">Decay</span>
                  <span className="font-mono">{intervention.decayRate}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 border border-border rounded-xl p-4 text-sm">
        <strong>Seleccionadas: </strong>
        {interventions.map((i: Intervention) => (
          <span key={i.id} className="ml-2 px-2 py-0.5 bg-accent/10 text-accent rounded text-xs">
            {i.name}
          </span>
        ))}
        {interventions.length === 0 && <span className="ml-2 text-muted-foreground">Ninguna</span>}
      </div>
    </div>
  );
}

function SimulateTab() {
  const trajectory = useStore(useTrajectory);
  const initialState = useStore(useInitialState);
  const lifespanMetrics = useStore(useLifespanMetrics);
  const lastCost = useStore(useLastCost);
  const mode = useStore(useAgingControlMode);
  const { computeTrajectory, reset } = useStore(useAgingControlActions);
  const [running, setRunning] = useState(false);

  const handleSimulate = async () => {
    setRunning(true);
    await computeTrajectory();
    setRunning(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Simulación de Trayectoria</h2>
        <div className="flex gap-2">
          <button
            onClick={handleSimulate}
            disabled={running}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${running ? 'animate-spin' : ''}`} />
            {running ? 'Simulando...' : 'Simular'}
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 bg-card border border-border rounded-lg"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <StateVectorDisplay state={initialState} label="Estado Inicial" />

          {lifespanMetrics && (
            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                label="Vida total"
                value={lifespanMetrics.lifespan.toFixed(1)}
                unit="años"
                trend="up"
                color="#22c55e"
              />
              <MetricCard
                label="Vida saludable"
                value={lifespanMetrics.healthspan.toFixed(1)}
                unit="años"
                trend="up"
                color="#16a34a"
              />
              <MetricCard
                label="Ganancia vida"
                value={lifespanMetrics.lifespanGain.toFixed(1)}
                unit="años"
                trend="up"
                color="#3b82f6"
              />
              <MetricCard
                label="Ganancia salud"
                value={lifespanMetrics.healthspanGain.toFixed(1)}
                unit="años"
                trend="up"
                color="#2563eb"
              />
            </div>
          )}

          <CostBreakdown cost={lastCost} mode={mode} />
        </div>

        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-4 min-h-[400px]">
          {trajectory ? (
            <TrajectoryChart trajectory={trajectory} />
          ) : (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Ejecute una simulación para ver la trayectoria</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OptimizeTab() {
  const optimalControls = useStore(useOptimalControls);
  const trajectory = useStore(useTrajectory);
  const lifespanMetrics = useStore(useLifespanMetrics);
  const lastCost = useStore(useLastCost);
  const mode = useStore(useAgingControlMode);
  const { computeOptimal, reset } = useStore(useAgingControlActions);
  const [running, setRunning] = useState(false);

  const handleOptimize = async () => {
    setRunning(true);
    await computeOptimal();
    setRunning(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Control Óptimo (PMP)</h2>
        <div className="flex gap-2">
          <button
            onClick={handleOptimize}
            disabled={running}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            {running ? 'Optimizando...' : 'Optimizar'}
          </button>
          <button onClick={reset} className="px-4 py-2 bg-card border border-border rounded-lg">
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {lifespanMetrics && (
            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                label="Vida total"
                value={lifespanMetrics.lifespan.toFixed(1)}
                unit="años"
                trend="up"
                color="#22c55e"
              />
              <MetricCard
                label="Vida saludable"
                value={lifespanMetrics.healthspan.toFixed(1)}
                unit="años"
                trend="up"
                color="#16a34a"
              />
              <MetricCard
                label="Ganancia vida"
                value={lifespanMetrics.lifespanGain.toFixed(1)}
                unit="años"
                trend="up"
                color="#3b82f6"
              />
              <MetricCard
                label="Ganancia salud"
                value={lifespanMetrics.healthspanGain.toFixed(1)}
                unit="años"
                trend="up"
                color="#2563eb"
              />
            </div>
          )}

          <CostBreakdown cost={lastCost} mode={mode} />

          {optimalControls && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h4 className="font-semibold mb-3">Perfil de Control Óptimo</h4>
              <div className="space-y-2 text-sm max-h-64 overflow-y-auto">
                {optimalControls.slice(0, 20).map((ctrl, step) => (
                  <div key={step} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">t={step * 0.1}y</span>
                    <span className="font-mono">
                      {ctrl.map((u, i) => `${require('../../lib/aging-control').CANONICAL_INTERVENTIONS[i]?.id}:${u.toFixed(2)}`).join(' | ')}
                    </span>
                  </div>
                ))}
                {optimalControls.length > 20 && (
                  <div className="text-xs text-muted-foreground text-center">
                    ... y {optimalControls.length - 20} pasos más
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-4 min-h-[400px]">
          {trajectory ? (
            <TrajectoryChart trajectory={trajectory} showControls={optimalControls} />
          ) : (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Ejecute optimización para ver la trayectoria óptima</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CaseStudiesTab() {
  const caseStudies = useStore(useCaseStudies);
  const { runCaseStudies } = useStore(useAgingControlActions);
  const [running, setRunning] = useState(false);

  const handleRun = async () => {
    setRunning(true);
    await runCaseStudies();
    setRunning(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Casos de Estudio Canónicos</h2>
        <button
          onClick={handleRun}
          disabled={running}
          className="px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${running ? 'animate-spin' : ''}`} />
          {running ? 'Ejecutando...' : 'Ejecutar 3 Casos'}
        </button>
      </div>

      {caseStudies ? (
        <div className="grid gap-4 md:grid-cols-3">
          {caseStudies.map((study: CaseStudyResult) => (
            <CaseStudyCard study={study} />
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Casos de estudio del paper</h3>
          <p className="text-muted-foreground mb-6">
            3 escenarios del paper Zhavoronkov & Mishra (2025):\n
            1. Saludable 40 años — Combo estándar\n
            2. Pre-frágil 60 años — Combo agresivo\n
            3. Preventivo 30 años — Solo estilo de vida
          </p>
          <button
            onClick={handleRun}
            className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium"
          >
            Ejecutar todos
          </button>
        </div>
      )}
    </div>
  );
}

function CaseStudyCard({ study }: { study: CaseStudyResult }) {
  const feasible = study.feasible.economic && study.feasible.biological && study.feasible.entropic;

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-accent/50 transition-all">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold">{study.name}</h4>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          feasible ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {feasible ? 'Factible' : 'Limitado'}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Estado inicial</span>
          <span className="font-mono">[{study.x0.map(v => v.toFixed(1)).join(', ')}]</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Costo total</span>
          <span className="font-mono">{study.totalCost.toFixed(1)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Ganancia vida</span>
          <span className="font-mono text-green-400">+{study.lifespanGain.toFixed(1)} años</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Ganancia salud</span>
          <span className="font-mono text-green-400">+{study.healthspanGain.toFixed(1)} años</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border grid grid-cols-3 gap-2 text-xs">
        <div className={`text-center ${study.feasible.economic ? 'text-green-400' : 'text-red-400'}`}>
          <div className="font-bold">{study.feasible.economic ? '✓' : '✗'}</div>
          <div className="text-muted-foreground">Económico</div>
        </div>
        <div className={`text-center ${study.feasible.biological ? 'text-green-400' : 'text-red-400'}`}>
          <div className="font-bold">{study.feasible.biological ? '✓' : '✗'}</div>
          <div className="text-muted-foreground">Biológico</div>
        </div>
        <div className={`text-center ${study.feasible.entropic ? 'text-green-400' : 'text-red-400'}`}>
          <div className="font-bold">{study.feasible.entropic ? '✓' : '✗'}</div>
          <div className="text-muted-foreground">Entropía</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Trajectory Chart (SVG-based, no external deps)
// ============================================================================

interface TrajectoryChartProps {
  trajectory: { state: number[]; controls: number[] }[];
  showControls?: number[][];
}

function TrajectoryChart({ trajectory, showControls }: TrajectoryChartProps) {
  const width = 700;
  const height = 350;
  const margin = { top: 20, right: 120, bottom: 40, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Extract data series
  const steps = trajectory.length;
  const timeSeries = trajectory.map((_, i) => i * 0.1);
  const stateSeries = STATE_LABELS.map(s => ({
    label: s.label,
    color: s.color.replace('text-', ''),
    data: trajectory.map(t => t.state[s.index]),
  }));

  // Compute scales
  const xScale = (t: number) => margin.left + (t / (timeSeries[timeSeries.length - 1] || 1)) * innerWidth;
  const yScales = stateSeries.map(s => {
    const values = s.data;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    return (v: number) => margin.top + innerHeight - ((v - min) / range) * innerHeight;
  });

  // Control series
  const controlSeries = showControls ? showControls[0]?.map((_, i) => ({
    label: `Control ${i}`,
    data: showControls.map(c => c[i] || 0),
  })) : [];

  return (
    <div className="relative">
      <svg width={width} height={height} className="w-full h-full">
        <defs>
          <linearGradient id="gridGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.05" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid */}
        <g stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5">
          {[0, 0.25, 0.5, 0.75, 1].forEach(f => (
            <line
              key={f}
              x1={margin.left}
              x2={width - margin.right}
              y1={margin.top + f * innerHeight}
              y2={margin.top + f * innerHeight}
            />
          ))}
          {[0, 0.2, 0.4, 0.6, 0.8, 1].forEach(f => (
            <line
              key={f}
              x1={margin.left + f * innerWidth}
              x2={margin.left + f * innerWidth}
              y1={margin.top}
              y2={height - margin.bottom}
            />
          ))}
        </g>

        {/* Axes */}
        <g stroke="currentColor" strokeOpacity="0.3" strokeWidth="1">
          <line x1={margin.left} x2={margin.left} y1={margin.top} y2={height - margin.bottom} />
          <line x1={margin.left} x2={width - margin.right} y1={height - margin.bottom} y2={height - margin.bottom} />
        </g>

        {/* State trajectories */}
        <g strokeWidth="2" fill="none">
          {stateSeries.map((s, si) => (
            <path
              key={s.label}
              d={trajectory.map((_, i) => {
                const x = xScale(timeSeries[i]);
                const y = yScales[si](s.data[i]);
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ')}
              stroke={s.color}
              strokeOpacity="0.8"
            />
          ))}
        </g>

        {/* Control trajectories (if shown) */}
        {controlSeries.length > 0 && (
          <g strokeWidth="1.5" fill="none" strokeDasharray="4,4" opacity="0.6">
            {controlSeries.map((s, si) => (
              <path
                key={s.label}
                d={showControls!.map((_, i) => {
                  const x = xScale(timeSeries[i]);
                  const y = margin.top + innerHeight - (s.data[i] / Math.max(...s.data, 1)) * innerHeight;
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                stroke={`hsl(${si * 60 + 200}, 70%, 50%)`}
              />
            ))}
          </g>
        )}

        {/* Legend */}
        <g fontSize="11" fontFamily="monospace">
          {stateSeries.map((s, i) => (
            <g key={s.label} transform={`translate(${width - margin.right + 10}, ${margin.top + i * 20})`}>
              <line x1={0} x2={20} y1={8} y2={8} stroke={s.color} strokeWidth="3" />
              <text x={25} y={12} fill={s.color}>{s.label}</text>
            </g>
          ))}
          {controlSeries.map((s, i) => (
            <g key={s.label} transform={`translate(${width - margin.right + 10}, ${margin.top + (stateSeries.length + i) * 20})`}>
              <line x1={0} x2={20} y1={8} y2={8} stroke={`hsl(${i * 60 + 200}, 70%, 50%)`} strokeWidth="2" strokeDasharray="4,4" />
              <text x={25} y={12} fill={`hsl(${i * 60 + 200}, 70%, 50%)`}>{s.label}</text>
            </g>
          ))}
        </g>

        {/* X axis labels */}
        <g fontSize="10" fill="currentColor" fillOpacity="0.5" textAnchor="middle">
          {[0, 0.25, 0.5, 0.75, 1].map(f => (
            <text
              key={f}
              x={margin.left + f * innerWidth}
              y={height - margin.bottom + 20}
            >
              {(timeSeries[timeSeries.length - 1] * f).toFixed(1)}y
            </text>
          ))}
        </g>
      </svg>

      {/* Current state tooltip */}
      <div className="absolute bottom-4 right-4 bg-card border border-border rounded-lg p-3 text-xs max-w-xs">
        <div className="font-semibold mb-2">Estado actual (t={trajectory[trajectory.length - 1]?.state[0]?.toFixed(1) || 0}y)</div>
        <StateVectorDisplay state={trajectory[trajectory.length - 1]?.state || null} />
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function AgingControlScreen() {
  const [activeTab, setActiveTab] = useState('configure');

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Tab Bar */}
      <div className="flex border-b border-border bg-card/50 px-4 sticky top-0 z-10">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative ${
              activeTab === tab.id
                ? 'text-accent border-b-2 border-accent'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {TABS.find(t => t.id === activeTab)?.component}
      </div>
    </div>
  );
}

// ============================================================================
// Missing Icon Import
// ============================================================================
import { Check } from 'lucide-react';