/**
 * RBE Screen — 7 Tabs
 * HSCSG v15 OS — Pantalla principal para Renta Básica Exponencial
 */

import React, { useState } from 'react';
import {
  LucideIcon,
  Layers,
  Leaf,
  Users,
  Award,
  Zap,
  PieChart,
  TrendingUp,
  Settings,
  RefreshCw,
  Calculator,
  Coins,
  Landmark,
  Brain,
  Target,
} from 'lucide-react';
import { useStore } from '@core/state/store';
import {
  useRBEConfig,
  useRBEMode,
  useLayerA,
  useLayerB,
  useLayerC,
  useLayerD,
  useLayerE,
  useBudgets,
  useGrowth,
  useTQ,
  usePohVerifiedMap,
  useLastPayoutResults,
  useRBEActions,
} from '@core/state/hooks/rbe';
import { RBE_PRESETS } from '@core/state/rbe';
import type {
  CapacityContribution,
  VerifiedContribution,
  GovernanceActivity,
  InnovationProject,
  RBEConfig,
} from '@core/state/rbe';

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
  { id: 'overview', label: 'Resumen', icon: Layers, component: OverviewTab },
  { id: 'layers', label: 'Capas (A-E)', icon: Award, component: LayersTab },
  { id: 'budgets', label: '3 Presupuestos', icon: PieChart, component: BudgetsTab },
  { id: 'growth', label: 'Control Crecimiento', icon: TrendingUp, component: GrowthTab },
  { id: 'tq', label: 'TQ Ledger', icon: Coins, component: TQTab },
  { id: 'payout', label: 'Pago Mensual', icon: Calculator, component: PayoutTab },
  { id: 'config', label: 'Configurar', icon: Settings, component: ConfigTab },
];

const LAYER_COLORS = {
  A: 'text-blue-400',
  B: 'text-green-400',
  C: 'text-purple-400',
  D: 'text-orange-400',
  E: 'text-pink-400',
};

const LAYER_ICONS = {
  A: Users,
  B: Leaf,
  C: Brain,
  D: Landmark,
  E: Zap,
};

const LAYER_LABELS = {
  A: { name: 'Capa A: Dividendo Universal Base', desc: 'Piso fijo para todos los humanos verificados' },
  B: { name: 'Capa B: Dividendo Capacidad Regenerativa', desc: 'Variable según capacidad ecológica/productiva verificada' },
  C: { name: 'Capa C: Dividendo Contribución Verificada', desc: 'Por aportes verificados de trabajo, capital, conocimiento, cuidado' },
  D: { name: 'Capa D: Dividendo Participación Gobernanza', desc: 'Por votar, proponer, jurados, delegar, auditar' },
  E: { name: 'Capa E: Dividendo Innovación/Especulativo', desc: 'Pool para proyectos de alto riesgo/retorno (quadratic funding)' },
};

const BUDGET_COLORS = {
  monetary: 'text-blue-400',
  real: 'text-green-400',
  ecological: 'text-emerald-400',
};

const BUDGET_UNITS = {
  monetary: 'ZNU',
  real: 'kWh / ha',
  ecological: 'kgCO₂ / especies',
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
  icon?: LucideIcon;
}> = ({ label, value, unit, trend, color, icon }) => (
  <div className="bg-card border border-border rounded-xl p-4">
    <div className="flex items-center justify-between mb-2">
      <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
      {icon && <icon className="w-5 h-5 text-muted-foreground" />}
    </div>
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

const BudgetCard: React.FC<{
  budget: any;
  budgetId: 'monetary' | 'real' | 'ecological';
}> = ({ budget, budgetId }) => {
  const color = BUDGET_COLORS[budgetId];
  const unit = BUDGET_UNITS[budgetId];
  const total = budget.allocated + budget.remaining;
  const spentPct = total > 0 ? (budget.spent / total) * 100 : 0;

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold capitalize">{budgetId}</h4>
        <span className={`text-xs px-2 py-0.5 rounded-full bg-muted/50 ${color}`}>{unit}</span>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Asignado</span>
          <span className="font-mono">{budget.allocated.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Gastado</span>
          <span className="font-mono">{budget.spent.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Restante</span>
          <span className="font-mono">{budget.remaining.toLocaleString()}</span>
        </div>
      </div>
      <div className="w-full bg-border/20 rounded-full h-2 overflow-hidden mt-3">
        <div
          className={`h-full rounded-full transition-all ${color.replace('text-', 'bg-')}`}
          style={{ width: `${spentPct}%` }}
        />
      </div>
      <div className="text-xs text-muted-foreground mt-1 text-right">
        {spentPct.toFixed(1)}% utilizado
      </div>
      {budget.transactions.length > 0 && (
        <details className="mt-3">
          <summary className="text-xs text-muted-foreground cursor-pointer">Transacciones ({budget.transactions.length})</summary>
          <div className="mt-2 max-h-40 overflow-y-auto space-y-1 text-xs">
            {budget.transactions.slice(-5).map((tx: any) => (
              <div key={tx.id} className="flex justify-between text-muted-foreground">
                <span>{tx.description}</span>
                <span className="font-mono">{tx.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
};

const LayerCard: React.FC<{
  layer: 'A' | 'B' | 'C' | 'D' | 'E';
  state: any;
  config: RBEConfig;
}> = ({ layer, state, config }) => {
  const color = LAYER_COLORS[layer];
  const Icon = LAYER_ICONS[layer];
  const labels = LAYER_LABELS[layer];

  const getLayerMetrics = () => {
    switch (layer) {
      case 'A':
        return [
          { label: 'Piso mensual', value: state.floor, unit: 'ZNU' },
          { label: 'Último pago', value: state.lastPayout ? new Date(state.lastPayout).toLocaleDateString() : 'Nunca', unit: '' },
          { label: 'Distribuido este mes', value: state.distributed, unit: 'ZNU' },
        ];
      case 'B':
        return [
          { label: 'Base', value: state.baseAmount, unit: 'ZNU' },
          { label: 'Multiplicador', value: state.capacityMultiplier.toFixed(2), unit: 'x' },
          { label: 'Índice capacidad', value: (state.capacityIndex * 100).toFixed(1), unit: '%' },
          { label: 'Contribuciones', value: state.contributions.length, unit: '' },
        ];
      case 'C':
        return [
          { label: 'Base', value: state.baseAmount, unit: 'ZNU' },
          { label: 'Índice contribución', value: state.contributionIndex.toFixed(2), unit: '' },
          { label: 'Umbral mínimo', value: state.minThreshold, unit: '' },
          { label: 'Contribuciones', value: state.contributions.length, unit: '' },
        ];
      case 'D':
        return [
          { label: 'Base', value: state.baseAmount, unit: 'ZNU' },
          { label: 'Score participación', value: (state.participationScore * 100).toFixed(1), unit: '%' },
          { label: 'Mín. participación', value: state.minParticipation, unit: '' },
          { label: 'Actividades', value: state.activities.length, unit: '' },
        ];
      case 'E':
        return [
          { label: 'Pool disponible', value: state.pool, unit: 'ZNU' },
          { label: 'Proyectos activos', value: state.projects.filter((p: any) => p.status === 'funded' || p.status === 'active').length, unit: '' },
          { label: 'Método asignación', value: state.allocation, unit: '' },
        ];
      default:
        return [];
    };
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:border-accent/50 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${color}`} />
          <div>
            <div className="font-medium">{labels.name}</div>
            <div className="text-xs text-muted-foreground">{labels.desc}</div>
          </div>
        </div>
        <span className={`text-xl font-mono font-bold ${color}`}>{layer}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        {getLayerMetrics().map((m, i) => (
          <div key={i} className="bg-background/50 rounded-lg p-2">
            <div className="text-xs text-muted-foreground">{m.label}</div>
            <div className="font-mono font-semibold" style={{ color: color.replace('text-', '') }}>
              {m.value} {m.unit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// Tab Components
// ============================================================================

function OverviewTab() {
  const config = useStore(useRBEConfig);
  const mode = useStore(useRBEMode);
  const layerA = useStore(useLayerA);
  const layerB = useStore(useLayerB);
  const layerC = useStore(useLayerC);
  const layerD = useStore(useLayerD);
  const layerE = useStore(useLayerE);
  const growth = useStore(useGrowth);
  const budgets = useStore(useBudgets);
  const tq = useStore(useTQ);
  const lastPayout = useStore(useLastPayoutResults);
  const { processMonthlyPayout, applyDemurrage } = useStore(useRBEActions);

  const totalDividend = layerA.floor + layerB.baseAmount * layerB.capacityMultiplier + layerC.baseAmount + layerD.baseAmount;
  const totalTQSupply = Array.from(tq.balances.values()).reduce((a, b) => a + b, 0);
  const totalBudgetAllocated = Object.values(budgets).reduce((sum, b) => sum + b.allocated, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Resumen RBE</h2>
        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-lg text-sm font-medium ${mode === 'conectado' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
            {mode === 'conectado' ? 'Conectado (USD/ZNU)' : 'Postmonetario (ZNU)'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard label="Dividendo Total Base" value={totalDividend.toFixed(0)} unit="ZNU/mes" color="#3b82f6" icon={Coins} />
        <MetricCard label="Tasa Crecimiento" value={(growth.currentRate * 100).toFixed(1)} unit="%/año" trend={growth.currentRate > growth.targetRate ? 'up' : 'neutral'} color="#22c55e" icon={TrendingUp} />
        <MetricCard label="Capacidad Regenerativa" value={(layerB.capacityIndex * 100).toFixed(1)} unit="%" color="#16a34a" icon={Leaf} />
        <MetricCard label="Supply TQ Total" value={totalTQSupply.toLocaleString()} unit="ZNU" color="#f59e0b" icon={Coins} />
        <MetricCard label="Presupuestos Totales" value={totalBudgetAllocated.toLocaleString()} unit="mixto" color="#a855f7" icon={PieChart} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="grid grid-cols-5 gap-4">
          <LayerCard layer="A" state={layerA} config={config} />
          <LayerCard layer="B" state={layerB} config={config} />
          <LayerCard layer="C" state={layerC} config={config} />
          <LayerCard layer="D" state={layerD} config={config} />
          <LayerCard layer="E" state={layerE} config={config} />
        </div>

        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Control de Crecimiento
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <MetricCard label="Tasa Actual" value={(growth.currentRate * 100).toFixed(2)} unit="%" color="#22c55e" />
              <MetricCard label="Tasa Objetivo" value={(growth.targetRate * 100).toFixed(2)} unit="%" color="#16a34a" />
              <MetricCard label="Capacidad Índice" value={(growth.capacityIndex * 100).toFixed(1)} unit="%" color="#3b82f6" />
              <MetricCard label="Verificado" value={growth.verified ? 'Sí' : 'No'} unit="" color={growth.verified ? '#22c55e' : '#ef4444'} />
            </div>
            {growth.history.length > 0 && (
              <div className="mt-3 text-xs text-muted-foreground">
                Último ajuste: {new Date(growth.lastAdjustment).toLocaleString()} — {growth.history[growth.history.length - 1]?.reason}
              </div>
            )}
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Coins className="w-5 h-5" />
              TQ Ledger
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <MetricCard label="Cuentas activas" value={tq.balances.size} unit="" color="#f59e0b" />
              <MetricCard label="Supply total" value={totalTQSupply.toLocaleString()} unit="ZNU" color="#f59e0b" />
              <MetricCard label="Transacciones" value={tq.transactions.length} unit="" color="#f59e0b" />
              <MetricCard label="Demurrage pendiente" value={tq.demurrageSchedule.filter((d: any) => !d.applied).length} unit="" color="#ef4444" />
            </div>
          </div>
        </div>
      </div>

      {lastPayout && (
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Último Pago Mensual
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <MetricCard label="Beneficiarios" value={lastPayout.size} unit="" color="#3b82f6" />
            <MetricCard label="Total distribuido" value={Array.from(lastPayout.values()).reduce((s, p) => s + p.total, 0).toLocaleString()} unit="ZNU" color="#22c55e" />
            <MetricCard label="Promedio" value={(Array.from(lastPayout.values()).reduce((s, p) => s + p.total, 0) / Math.max(1, lastPayout.size)).toFixed(1)} unit="ZNU" color="#a855f7" />
            <MetricCard label="Fecha" value={new Date().toLocaleDateString()} unit="" color="#6b7280" />
          </div>
        </div>
      )}
    </div>
  );
}

function LayersTab() {
  const layerA = useStore(useLayerA);
  const layerB = useStore(useLayerB);
  const layerC = useStore(useLayerC);
  const layerD = useStore(useLayerD);
  const layerE = useStore(useLayerE);
  const { addCapacityContribution, addVerifiedContribution, addGovernanceActivity, proposeInnovationProject, fundInnovationProject } = useStore(useRBEActions);
  const [activeLayer, setActiveLayer] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const layers = [
    { id: 'A', state: layerA, label: LAYER_LABELS.A, icon: Users, color: 'text-blue-400' },
    { id: 'B', state: layerB, label: LAYER_LABELS.B, icon: Leaf, color: 'text-green-400' },
    { id: 'C', state: layerC, label: LAYER_LABELS.C, icon: Brain, color: 'text-purple-400' },
    { id: 'D', state: layerD, label: LAYER_LABELS.D, icon: Landmark, color: 'text-orange-400' },
    { id: 'E', state: layerE, label: LAYER_LABELS.E, icon: Zap, color: 'text-pink-400' },
  ];

  const currentLayer = layers.find(l => l.id === activeLayer)!;

  const handleAddContribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeLayer === 'B') {
      addCapacityContribution(formData as CapacityContribution);
    } else if (activeLayer === 'C') {
      addVerifiedContribution(formData as VerifiedContribution);
    } else if (activeLayer === 'D') {
      addGovernanceActivity(formData as GovernanceActivity);
    } else if (activeLayer === 'E') {
      if (formData.projectId) {
        fundInnovationProject(formData.projectId, formData.amount, formData.contributor);
      } else {
        proposeInnovationProject(formData as Omit<InnovationProject, 'id' | 'status' | 'allocatedAmount'>);
      }
    }
    setShowForm(false);
    setFormData({});
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Capas del Dividendo (A → E)</h2>
        <div className="flex gap-1 bg-card border border-border rounded-lg p-1">
          {layers.map(l => (
            <button
              key={l.id}
              onClick={() => { setActiveLayer(l.id as any); setShowForm(false); }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeLayer === l.id
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <l.icon className={`w-4 h-4 inline mr-1 ${l.color}`} />
              {l.id}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <LayerCard layer={activeLayer as any} state={currentLayer.state} config={config} />
          <div className="mt-4">
            <button
              onClick={() => setShowForm(true)}
              className="w-full px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <Target className="w-4 h-4" />
              {activeLayer === 'E' && formData.projectId ? 'Financiar Proyecto' : 'Añadir Registro'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {activeLayer === 'B' && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-semibold mb-3">Contribuciones de Capacidad Regenerativa</h3>
              {currentLayer.state.contributions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Sin contribuciones registradas</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {currentLayer.state.contributions.map((c: CapacityContribution) => (
                    <div key={c.id} className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-medium">{c.type}</span>
                        <div>
                          <div className="font-medium">{c.memberId}</div>
                          <div className="text-xs text-muted-foreground">{new Date(c.timestamp).toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-green-400">{c.amount} ZNU</div>
                        <div className="text-xs text-muted-foreground">{c.verified ? 'Verificada' : 'Pendiente'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeLayer === 'C' && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-semibold mb-3">Contribuciones Verificadas</h3>
              {currentLayer.state.contributions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Sin contribuciones verificadas</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {currentLayer.state.contributions.map((c: VerifiedContribution) => (
                    <div key={c.id} className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs font-medium">{c.type}</span>
                        <div>
                          <div className="font-medium">{c.memberId}</div>
                          <div className="text-xs text-muted-foreground">Verificado por: {c.verifiedBy}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-purple-400">{c.valueZNU} ZNU</div>
                        <div className="text-xs text-muted-foreground">{c.hours ? `${c.hours}h` : 'Sin horas'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeLayer === 'D' && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-semibold mb-3">Actividades de Gobernanza</h3>
              {currentLayer.state.activities.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Sin actividades registradas</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {currentLayer.state.activities.map((a: GovernanceActivity) => (
                    <div key={a.id} className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded text-xs font-medium">{a.type}</span>
                        <div>
                          <div className="font-medium">{a.memberId}</div>
                          <div className="text-xs text-muted-foreground">{new Date(a.timestamp).toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="font-mono text-orange-400">Peso: {a.weight}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeLayer === 'E' && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-semibold mb-3">Proyectos de Innovación</h3>
              {currentLayer.state.projects.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Sin proyectos propuestos</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {currentLayer.state.projects.map((p: InnovationProject) => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{p.name}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            p.status === 'funded' ? 'bg-green-500/20 text-green-400' :
                            p.status === 'active' ? 'bg-blue-500/20 text-blue-400' :
                            p.status === 'proposed' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>{p.status}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">{p.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Solicitado: {p.requestedAmount} ZNU | Asignado: {p.allocatedAmount} ZNU | Contribuyentes: {p.contributors.length}
                        </div>
                      </div>
                      {p.status === 'proposed' && (
                        <button
                          onClick={() => { setFormData({ projectId: p.id, amount: 100, contributor: 'current_member' }); setShowForm(true); }}
                          className="px-3 py-1.5 bg-accent text-accent-foreground rounded-lg text-sm font-medium"
                        >
                          Financiar
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {showForm && (
            <form onSubmit={handleAddContribution} className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h3 className="font-semibold">Añadir a Capa {activeLayer}</h3>
              {activeLayer === 'B' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm text-muted-foreground mb-1">Member ID</label><input value={formData.memberId} onChange={e => setFormData({...formData, memberId: e.target.value})} className="w-full px-3 py-2 bg-background border border-border rounded-lg" required /></div>
                    <div><label className="block text-sm text-muted-foreground mb-1">Tipo</label><select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 bg-background border border-border rounded-lg"><option value="ecological">Ecológica</option><option value="energy">Energía</option><option value="productive">Productiva</option><option value="cooperative">Cooperativa</option><option value="knowledge">Conocimiento</option></select></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm text-muted-foreground mb-1">Monto (ZNU)</label><input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})} className="w-full px-3 py-2 bg-background border border-border rounded-lg" required /></div>
                    <div><label className="block text-sm text-muted-foreground mb-1">Verificada</label><select value={formData.verified} onChange={e => setFormData({...formData, verified: e.target.value === 'true'})} className="w-full px-3 py-2 bg-background border border-border rounded-lg"><option value="false">No</option><option value="true">Sí</option></select></div>
                  </div>
                </>
              )}
              {activeLayer === 'C' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm text-muted-foreground mb-1">Member ID</label><input value={formData.memberId} onChange={e => setFormData({...formData, memberId: e.target.value})} className="w-full px-3 py-2 bg-background border border-border rounded-lg" required /></div>
                    <div><label className="block text-sm text-muted-foreground mb-1">Tipo</label><select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 bg-background border border-border rounded-lg"><option value="labor">Trabajo</option><option value="capital">Capital</option><option value="knowledge">Conocimiento</option><option value="care">Cuidado</option><option value="governance">Gobernanza</option></select></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div><label className="block text-sm text-muted-foreground mb-1">Valor (ZNU)</label><input type="number" value={formData.valueZNU} onChange={e => setFormData({...formData, valueZNU: parseFloat(e.target.value)})} className="w-full px-3 py-2 bg-background border border-border rounded-lg" required /></div>
                    <div><label className="block text-sm text-muted-foreground mb-1">Horas</label><input type="number" value={formData.hours} onChange={e => setFormData({...formData, hours: parseFloat(e.target.value)})} className="w-full px-3 py-2 bg-background border border-border rounded-lg" /></div>
                    <div><label className="block text-sm text-muted-foreground mb-1">Verificado por</label><input value={formData.verifiedBy} onChange={e => setFormData({...formData, verifiedBy: e.target.value})} className="w-full px-3 py-2 bg-background border border-border rounded-lg" required /></div>
                  </div>
                  <div><label className="block text-sm text-muted-foreground mb-1">Proof Hash</label><input value={formData.proofHash} onChange={e => setFormData({...formData, proofHash: e.target.value})} className="w-full px-3 py-2 bg-background border border-border rounded-lg" required /></div>
                </>
              )}
              {activeLayer === 'D' && (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <div><label className="block text-sm text-muted-foreground mb-1">Member ID</label><input value={formData.memberId} onChange={e => setFormData({...formData, memberId: e.target.value})} className="w-full px-3 py-2 bg-background border border-border rounded-lg" required /></div>
                    <div><label className="block text-sm text-muted-foreground mb-1">Tipo</label><select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 bg-background border border-border rounded-lg"><option value="vote">Votar</option><option value="proposal">Proponer</option><option value="jury">Jurado</option><option value="delegation">Delegar</option><option value="audit">Auditar</option></select></div>
                    <div><label className="block text-sm text-muted-foreground mb-1">Peso</label><input type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})} className="w-full px-3 py-2 bg-background border border-border rounded-lg" required /></div>
                  </div>
                </>
              )}
              {activeLayer === 'E' && (
                <>
                  {formData.projectId ? (
                    <>
                      <input type="hidden" value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})} />
                      <div className="grid grid-cols-3 gap-4">
                        <div><label className="block text-sm text-muted-foreground mb-1">Monto (ZNU)</label><input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})} className="w-full px-3 py-2 bg-background border border-border rounded-lg" required /></div>
                        <div><label className="block text-sm text-muted-foreground mb-1">Contribuyente</label><input value={formData.contributor} onChange={e => setFormData({...formData, contributor: e.target.value})} className="w-full px-3 py-2 bg-background border border-border rounded-lg" required /></div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm text-muted-foreground mb-1">Nombre</label><input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 bg-background border border-border rounded-lg" required /></div>
                        <div><label className="block text-sm text-muted-foreground mb-1">Monto solicitado (ZNU)</label><input type="number" value={formData.requestedAmount} onChange={e => setFormData({...formData, requestedAmount: parseFloat(e.target.value)})} className="w-full px-3 py-2 bg-background border border-border rounded-lg" required /></div>
                      </div>
                      <div><label className="block text-sm text-muted-foreground mb-1">Descripción</label><textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 bg-background border border-border rounded-lg" rows={3} required /></div>
                    </>
                  )}
                </>
              )}
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-accent text-accent-foreground rounded-lg">Guardar</button>
                <button type="button" onClick={() => { setShowForm(false); setFormData({}); }} className="px-4 py-2 bg-card border border-border rounded-lg">Cancelar</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function BudgetsTab() {
  const budgets = useStore(useBudgets);
  const { transferBetweenBudgets } = useStore(useRBEActions);
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferData, setTransferData] = useState({ fromLayer: 'A', toBudget: 'monetary', amount: 0, description: '' });

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    transferBetweenBudgets(transferData.fromLayer as any, transferData.toBudget as any, transferData.amount, transferData.description);
    setShowTransfer(false);
    setTransferData({ fromLayer: 'A', toBudget: 'monetary', amount: 0, description: '' });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Tres Presupuestos (Monetario / Real / Ecológico)</h2>
        <button onClick={() => setShowTransfer(true)} className="px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium flex items-center gap-2">
          <Target className="w-4 h-4" /> Transferir entre presupuestos
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(['monetary', 'real', 'ecological'] as const).map(budgetId => (
          <BudgetCard key={budgetId} budget={budgets[budgetId]} budgetId={budgetId} />
        ))}
      </div>

      {showTransfer && (
        <form onSubmit={handleTransfer} className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold">Transferir entre Presupuestos</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">De Capa</label>
              <select value={transferData.fromLayer} onChange={e => setTransferData({...transferData, fromLayer: e.target.value})} className="w-full px-3 py-2 bg-background border border-border rounded-lg">
                <option value="A">A (Monetario)</option>
                <option value="B">B (Real)</option>
                <option value="C">C (Monetario)</option>
                <option value="D">D (Monetario)</option>
                <option value="E">E (Ecológico)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">A Presupuesto</label>
              <select value={transferData.toBudget} onChange={e => setTransferData({...transferData, toBudget: e.target.value})} className="w-full px-3 py-2 bg-background border border-border rounded-lg">
                <option value="monetary">Monetario (ZNU)</option>
                <option value="real">Real (kWh/ha)</option>
                <option value="ecological">Ecológico (kgCO₂/especies)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm text-muted-foreground mb-1">Monto</label><input type="number" step="0.01" value={transferData.amount} onChange={e => setTransferData({...transferData, amount: parseFloat(e.target.value)})} className="w-full px-3 py-2 bg-background border border-border rounded-lg" required /></div>
          </div>
          <div><label className="block text-sm text-muted-foreground mb-1">Descripción</label><input value={transferData.description} onChange={e => setTransferData({...transferData, description: e.target.value})} className="w-full px-3 py-2 bg-background border border-border rounded-lg" required /></div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-accent text-accent-foreground rounded-lg">Transferir</button>
            <button type="button" onClick={() => setShowTransfer(false)} className="px-4 py-2 bg-card border border-border rounded-lg">Cancelar</button>
          </div>
        </form>
      )}
    </div>
  );
}

function GrowthTab() {
  const growth = useStore(useGrowth);
  const config = useStore(useRBEConfig);
  const { updateGrowthController } = useStore(useRBEActions);
  const [capacityInput, setCapacityInput] = useState('0.5');

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Controlador de Crecimiento Exponencial</h2>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Parámetros del Controlador</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Tasa Base</label>
            <input type="number" step="0.001" value={config.growth.baseRate} onChange={e => { const c = {...config, growth: {...config.growth, baseRate: parseFloat(e.target.value)}}; useStore.getState().setConfig({growth: c.growth}); }} className="w-full px-3 py-2 bg-background border border-border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Tasa Máxima</label>
            <input type="number" step="0.001" value={config.growth.maxRate} onChange={e => { const c = {...config, growth: {...config.growth, maxRate: parseFloat(e.target.value)}}; useStore.getState().setConfig({growth: c.growth}); }} className="w-full px-3 py-2 bg-background border border-border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Tasa Mínima</label>
            <input type="number" step="0.001" value={config.growth.minRate} onChange={e => { const c = {...config, growth: {...config.growth, minRate: parseFloat(e.target.value)}}; useStore.getState().setConfig({growth: c.growth}); }} className="w-full px-3 py-2 bg-background border border-border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Umbral Capacidad</label>
            <input type="number" step="0.01" value={config.growth.capacityThreshold} onChange={e => { const c = {...config, growth: {...config.growth, capacityThreshold: parseFloat(e.target.value)}}; useStore.getState().setConfig({growth: c.growth}); }} className="w-full px-3 py-2 bg-background border border-border rounded-lg" />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Estado Actual</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <MetricCard label="Tasa Actual" value={(growth.currentRate * 100).toFixed(2)} unit="%/año" color="#22c55e" />
          <MetricCard label="Tasa Objetivo" value={(growth.targetRate * 100).toFixed(2)} unit="%/año" color="#16a34a" />
          <MetricCard label="Índice Capacidad" value={(growth.capacityIndex * 100).toFixed(1)} unit="%" color="#3b82f6" />
          <MetricCard label="Verificado" value={growth.verified ? 'Sí' : 'No'} color={growth.verified ? '#22c55e' : '#ef4444'} />
        </div>

        <div className="border-t border-border pt-4">
          <h4 className="font-medium mb-3">Actualizar Índice de Capacidad Regenerativa</h4>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm text-muted-foreground mb-1">Índice [0-1]</label>
              <input type="number" step="0.01" min="0" max="1" value={capacityInput} onChange={e => setCapacityInput(e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-lg" />
            </div>
            <button onClick={() => updateGrowthController(parseFloat(capacityInput))} className="px-6 py-2 bg-accent text-accent-foreground rounded-lg font-medium self-end">
              Actualizar Controlador
            </button>
          </div>
        </div>
      </div>

      {growth.history.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-3">Historial de Ajustes</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {growth.history.slice().reverse().map((h, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-background border border-border rounded-lg text-sm">
                <div>
                  <div className="font-medium">{new Date(h.timestamp).toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">{h.reason === 'capacity_excess' ? 'Exceso de capacidad → crecimiento acelerado' : 'Déficit de capacidad → crecimiento reducido'}</div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-muted-foreground">Tasa anterior: {(h.previousRate * 100).toFixed(2)}%</span>
                  <span className="font-mono text-green-400">Nueva: {(h.newRate * 100).toFixed(2)}%</span>
                  <span className="text-muted-foreground">Capacidad: {(h.capacityIndex * 100).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TQTab() {
  const tq = useStore(useTQ);
  const config = useStore(useRBEConfig);
  const { applyDemurrage, convertAmount } = useStore(useRBEActions);
  const [balanceQuery, setBalanceQuery] = useState('');

  const totalSupply = Array.from(tq.balances.values()).reduce((a, b) => a + b, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">TQ Ledger (Transducción Quántica)</h2>
        <div className="flex gap-2">
          <button onClick={applyDemurrage} className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg font-medium flex items-center gap-2 hover:bg-orange-500/30">
            <RefreshCw className="w-4 h-4" /> Aplicar Demurrage
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Supply Total" value={totalSupply.toLocaleString()} unit="ZNU" color="#f59e0b" icon={Coins} />
        <MetricCard label="Cuentas Activas" value={tq.balances.size} unit="" color="#3b82f6" icon={Users} />
        <MetricCard label="Transacciones" value={tq.transactions.length} unit="" color="#a855f7" icon={RefreshCw} />
        <MetricCard label="Demurrage Rate" value={(config.tq.demurrageRate * 100).toFixed(1)} unit="%/año" color="#ef4444" icon={Target} />
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-semibold mb-3">Convertidor Anfibio</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Monto</label>
            <input type="number" step="0.01" placeholder="100" className="w-full px-3 py-2 bg-background border border-border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">De</label>
            <select className="w-full px-3 py-2 bg-background border border-border rounded-lg">
              <option value="postmonetario">Postmonetario (ZNU)</option>
              <option value="conectado">Conectado (USD)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">A</label>
            <select className="w-full px-3 py-2 bg-background border border-border rounded-lg">
              <option value="postmonetario">Postmonetario (ZNU)</option>
              <option value="conectado">Conectado (USD)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Price Parity</label>
            <input type="number" value={config.priceParity} className="w-full px-3 py-2 bg-background border border-border rounded-lg" />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-semibold mb-3">Balances por Miembro</h3>
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="pb-2 px-2">Miembro</th>
                <th className="pb-2 px-2 text-right font-mono">Balance (ZNU)</th>
                <th className="pb-2 px-2 text-right font-mono">≈ USD</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(tq.balances.entries()).slice(0, 50).map(([member, balance]) => (
                <tr key={member} className="border-b border-border/50">
                  <td className="py-2 px-2 font-medium">{member}</td>
                  <td className="py-2 px-2 text-right font-mono">{balance.toLocaleString()}</td>
                  <td className="py-2 px-2 text-right font-mono text-muted-foreground">{(balance / config.priceParity).toFixed(2)}</td>
                </tr>
              ))}
              {tq.balances.size === 0 && (
                <tr><td colSpan={3} className="py-8 text-center text-muted-foreground">Sin balances registrados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-semibold mb-3">Transacciones Recientes</h3>
        <div className="max-h-64 overflow-y-auto">
          {tq.transactions.slice(-20).reverse().map((tx: any) => (
            <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border/50 text-xs">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs ${
                  tx.type === 'payout' ? 'bg-green-500/20 text-green-400' :
                  tx.type === 'demurrage' ? 'bg-red-500/20 text-red-400' :
                  tx.type === 'transfer' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>{tx.type}</span>
                <span className="font-mono">{tx.from} → {tx.to}</span>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="font-mono">{tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} ZNU</span>
                <span>{new Date(tx.timestamp).toLocaleString()}</span>
              </div>
            </div>
          ))}
          {tq.transactions.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Sin transacciones</p>
          )}
        </div>
      </div>
    </div>
  );
}

function PayoutTab() {
  const layerA = useStore(useLayerA);
  const layerB = useStore(useLayerB);
  const layerC = useStore(useLayerC);
  const layerD = useStore(useLayerD);
  const layerE = useStore(useLayerE);
  const config = useStore(useRBEConfig);
  const pohVerified = useStore(usePohVerifiedMap);
  const lastPayout = useStore(useLastPayoutResults);
  const { processMonthlyPayout } = useStore(useRBEActions);
  const [membersInput, setMembersInput] = useState('');
  const [running, setRunning] = useState(false);

  const handlePayout = async () => {
    const members = membersInput.split(',').map(m => m.trim()).filter(Boolean);
    if (members.length === 0) return alert('Ingresa al menos un member ID');
    setRunning(true);
    await processMonthlyPayout(members);
    setRunning(false);
    setMembersInput('');
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Pago Mensual del Dividendo</h2>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Simular Pago para Miembros</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Member IDs (separados por coma)</label>
            <textarea
              value={membersInput}
              onChange={e => setMembersInput(e.target.value)}
              placeholder="member1, member2, member3"
              rows={3}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg font-mono text-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-accent" />
              Asumir todos verificados (PoH)
            </label>
          </div>
          <button
            onClick={handlePayout}
            disabled={running || !membersInput.trim()}
            className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium flex items-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            {running ? 'Procesando...' : 'Procesar Pago Mensual'}
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Desglose del Dividendo por Capa (por miembro verificado)</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
          {(['A', 'B', 'C', 'D', 'E'] as const).map(l => (
            <div key={l} className="p-4 bg-background/50 rounded-lg border border-border">
              <div className={`text-2xl font-bold ${LAYER_COLORS[l]}`}>{l}</div>
              <div className="text-xs text-muted-foreground">{LAYER_LABELS[l].name.split(': ')[1]}</div>
              <div className="font-mono text-lg mt-1">
                {l === 'A' ? layerA.floor :
                 l === 'B' ? (layerB.baseAmount * layerB.capacityMultiplier).toFixed(1) :
                 l === 'C' ? layerC.baseAmount :
                 l === 'D' ? layerD.baseAmount :
                 'Variable'}{' '}
                <span className="text-xs text-muted-foreground">ZNU</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <span className="text-lg font-bold">Total base: </span>
          <span className="text-2xl font-mono text-green-400">
            {layerA.floor + layerB.baseAmount * layerB.capacityMultiplier + layerC.baseAmount + layerD.baseAmount} ZNU
          </span>
          <span className="text-muted-foreground ml-2">+ Capa E (variable)</span>
        </div>
      </div>

      {lastPayout && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Resultado del Último Pago</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <MetricCard label="Beneficiarios" value={lastPayout.size} unit="" color="#3b82f6" />
            <MetricCard label="Total Distribuido" value={Array.from(lastPayout.values()).reduce((s, p) => s + p.total, 0).toLocaleString()} unit="ZNU" color="#22c55e" />
            <MetricCard label="Promedio" value={(Array.from(lastPayout.values()).reduce((s, p) => s + p.total, 0) / Math.max(1, lastPayout.size)).toFixed(1)} unit="ZNU" color="#a855f7" />
            <MetricCard label="Fecha" value={new Date().toLocaleDateString()} unit="" color="#6b7280" />
          </div>
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="pb-2 px-2">Miembro</th>
                  <th className="pb-2 px-2 text-right font-mono">Total</th>
                  <th className="pb-2 px-2 text-right font-mono">A</th>
                  <th className="pb-2 px-2 text-right font-mono">B</th>
                  <th className="pb-2 px-2 text-right font-mono">C</th>
                  <th className="pb-2 px-2 text-right font-mono">D</th>
                  <th className="pb-2 px-2 text-right font-mono">E</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(lastPayout.entries()).slice(0, 50).map(([member, payout]) => (
                  <tr key={member} className="border-b border-border/50">
                    <td className="py-2 px-2 font-medium">{member}</td>
                    <td className="py-2 px-2 text-right font-mono">{payout.total.toLocaleString()}</td>
                    <td className="py-2 px-2 text-right font-mono">{payout.breakdown.A}</td>
                    <td className="py-2 px-2 text-right font-mono">{payout.breakdown.B.toFixed(1)}</td>
                    <td className="py-2 px-2 text-right font-mono">{payout.breakdown.C}</td>
                    <td className="py-2 px-2 text-right font-mono">{payout.breakdown.D}</td>
                    <td className="py-2 px-2 text-right font-mono">{payout.breakdown.E.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function ConfigTab() {
  const config = useStore(useRBEConfig);
  const mode = useStore(useRBEMode);
  const { setConfig, setMode, applyPreset } = useStore(useRBEActions);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Configuración RBE</h2>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Presets</h3>
        <div className="flex flex-wrap gap-2">
          {(['conservative', 'standard', 'aggressive', 'conectado'] as const).map(p => (
            <button
              key={p}
              onClick={() => applyPreset(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                JSON.stringify(config) === JSON.stringify(RBE_PRESETS[p])
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-card border border-border hover:bg-accent/10'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Modo Anfibio</h3>
        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="mode" checked={mode === 'postmonetario'} onChange={() => setMode('postmonetario')} className="w-4 h-4 accent-accent" />
            <span className="font-medium">Postmonetario (ZNU)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="mode" checked={mode === 'conectado'} onChange={() => setMode('conectado', config.priceParity)} className="w-4 h-4 accent-accent" />
            <span className="font-medium">Conectado (USD/ZNU)</span>
          </label>
        </div>

        {mode === 'conectado' && (
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Price Parity (ZNU por USD): {config.priceParity}</label>
            <input type="range" min="10" max="1000" step="10" value={config.priceParity || 100} onChange={e => setConfig({ priceParity: parseInt(e.target.value) })} className="w-full h-2 bg-background rounded-lg appearance-none accent-accent" />
            <div className="text-xs text-muted-foreground mt-1">1 USD = {config.priceParity} ZNU (oráculo ReFi Nivel 3)</div>
          </div>
        )}

        <div className="p-3 bg-muted/50 rounded-lg text-sm mt-4">
          <HelpCircle className="w-4 h-4 inline-block mr-1" />
          <strong>Principio Anfibio:</strong> La lógica del dividendo es idéntica; solo cambia la unidad de cuenta.
          Postmonetario = ZNU abstractos; Conectado = ZNU vía priceParity (oráculo ReFi Nivel 3).
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Parámetros de Capas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Capa A - Piso Base (ZNU/mes)</label>
            <input type="number" value={100} className="w-full px-3 py-2 bg-background border border-border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Capa B - Base (ZNU)</label>
            <input type="number" value={50} className="w-full px-3 py-2 bg-background border border-border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Capa C - Base (ZNU)</label>
            <input type="number" value={30} className="w-full px-3 py-2 bg-background border border-border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Capa D - Base (ZNU)</label>
            <input type="number" value={20} className="w-full px-3 py-2 bg-background border border-border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Capa E - Pool Inicial (ZNU)</label>
            <input type="number" value={1000} className="w-full px-3 py-2 bg-background border border-border rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function RBEScreen() {
  const [activeTab, setActiveTab] = useState('overview');

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