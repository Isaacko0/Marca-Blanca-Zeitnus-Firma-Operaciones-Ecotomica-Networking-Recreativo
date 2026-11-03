// UrbanGreenDashboard.tsx — Dashboard principal SBN + Gobernanza Suelo
// Principio Anfibio: offline-first, modo postmonetario/conectado vía priceParity

import React, { useEffect, useMemo } from 'react';
import {
  useUrbanGreenStore,
  useSBNProjectList,
  useTotalSBNArea,
  useTotalEcosystemValue,
  useTotalROI,
  useAvgTempReduction,
  useCoordinationScore,
  useTotalCapturedValue,
  useInstrumentCount,
  useActiveStrategies,
} from '@core/state/hooks/urban-green-governance';
import { calculateEcosystemServices, simulateGreenROI, modelUrbanMicroclimate, assessGovernanceCoordination, calculateLandValueCapture, designGovernanceInstruments, simulateSharedStrategy } from '@core/lib/urban-green-governance';
import { Icon } from '@core/ui/Icon';
import { Button } from '@core/ui/Button';
import { Card } from '@core/ui/Card';
import { Progress } from '@core/ui/Progress';
import { Badge } from '@core/ui/Badge';
import { Tabs } from '@core/ui/Tabs';
import { Tooltip } from '@core/ui/Tooltip';
import { t } from '@core/lib/i18n';

export const UrbanGreenDashboard: React.FC = () => {
  const store = useUrbanGreenStore();
  const projects = useSBNProjectList();
  const totalArea = useTotalSBNArea();
  const totalEcoValue = useTotalEcosystemValue();
  const avgROI = useTotalROI();
  const avgTempReduction = useAvgTempReduction();
  const coordinationScore = useCoordinationScore();
  const totalCaptured = useTotalCapturedValue();
  const instrumentCount = useInstrumentCount();
  const activeStrategies = useActiveStrategies();

  const actions = store;

  // Auto-save
  useEffect(() => {
    const timer = setTimeout(() => actions.saveToStorage(), 5000);
    return () => clearTimeout(timer);
  }, [actions]);

  // Detect V1 data
  useEffect(() => {
    if (actions.detectV1Data()) {
      console.log('[UrbanGreen] Datos v1 detectados');
    }
  }, []);

  // Estadísticas por tipo SBN
  const projectsByType = useMemo(() => {
    const counts: Record<string, number> = {};
    store.sbnProjects && Object.values(store.sbnProjects).forEach(p => {
      counts[p.type] = (counts[p.type] || 0) + 1;
    });
    return counts;
  }, [store.sbnProjects]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    store.sbnProjects && Object.values(store.sbnProjects).forEach(p => {
      counts[p.status] = (counts[p.status] || 0) + 1;
    });
    return counts;
  }, [store.sbnProjects]);

  return (
    <div className="urban-green-dashboard">
      {/* Header */}
      <header className="urban-green-header">
        <div className="urban-green-header-left">
          <Icon name="TreePine" size={32} style={{ color: 'var(--genio)' }} />
          <div>
            <h1>{t('urbanGreen.dashboard.title')}</h1>
            <p className="urban-green-subtitle">{t('urbanGreen.dashboard.subtitle')}</p>
          </div>
        </div>
        <div className="urban-green-header-right">
          <div className="urban-green-mode-badge">
            <Badge variant="info">{t('urbanGreen.modes.postmonetario')}</Badge>
            <Badge variant="secondary">{t('urbanGreen.modes.conectado')}</Badge>
          </div>
        </div>
      </header>

      <div className="urban-green-main-layout">
        {/* Sidebar izquierdo: Navegación y Filtros */}
        <aside className="urban-green-sidebar-left" aria-label="Navegación SBN">
          <nav className="urban-green-types-nav" aria-label="Tipos SBN">
            <h3>🌳 {t('urbanGreen.dashboard.sbnTypes')}</h3>
            {Object.entries(SBN_TYPE_LABELS).map(([key, label]) => (
              <button
                key={key}
                className={`urban-green-type-btn ${projectsByType[key] > 0 ? 'has-projects' : ''}`}
                onClick={() => { /* filtrar por tipo */ }}
              >
                <span className="urban-green-type-count">{projectsByType[key] || 0}</span>
                <span className="urban-green-type-label">{label}</span>
              </button>
            ))}
          </nav>

          <div className="urban-green-status-filter">
            <h3>📊 {t('urbanGreen.dashboard.projectStatus')}</h3>
            {Object.entries(PROJECT_STATUS_LABELS).map(([key, label]) => (
              <button key={key} className="urban-green-status-btn">
                <span className="urban-green-status-count">{statusCounts[key] || 0}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="urban-green-quick-stats">
            <h3>⚡ {t('urbanGreen.dashboard.quickStats')}</h3>
            <div className="urban-green-stat-row">
              <span>{t('urbanGreen.dashboard.totalProjects')}</span>
              <strong>{store.sbnProjects ? Object.keys(store.sbnProjects).length : 0}</strong>
            </div>
            <div className="urban-green-stat-row">
              <span>{t('urbanGreen.dashboard.totalArea')}</span>
              <strong>{totalArea.toFixed(1)} ha</strong>
            </div>
            <div className="urban-green-stat-row">
              <span>{t('urbanGreen.dashboard.totalEcoValue')}</span>
              <strong>${(totalEcoValue / 1e6).toFixed(1)}M/año</strong>
            </div>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="urban-green-main-content" role="main">
          {/* Tarjetas KPI principales */}
          <div className="urban-green-kpi-grid">
            <KPICard
              title={t('urbanGreen.dashboard.totalArea')}
              value={`${totalArea.toFixed(1)} ha`}
              icon="TreePine"
              color="var(--genio)"
              trend="up"
              subtitle={t('urbanGreen.dashboard.hectaresSBN')}
            />
            <KPICard
              title={t('urbanGreen.dashboard.annualEcoValue')}
              value={`$${(totalEcoValue / 1e6).toFixed(1)}M`}
              icon="DollarSign"
              color="var(--limon)"
              trend="up"
              subtitle={t('urbanGreen.dashboard.perYear')}
            />
            <KPICard
              title={t('urbanGreen.dashboard.avgROI')}
              value={`$${(avgROI / 1e6).toFixed(1)}M`}
              icon="TrendingUp"
              color={avgROI > 0 ? 'var(--genio)' : 'var(--haiti)'}
              trend={avgROI > 0 ? 'up' : 'down'}
              subtitle={t('urbanGreen.dashboard.avgNPV')}
            />
            <KPICard
              title={t('urbanGreen.dashboard.tempReduction')}
              value={`${avgTempReduction.toFixed(1)}°C`}
              icon="Thermometer"
              color={avgTempReduction > 1 ? 'var(--genio)' : 'var(--acero)'}
              trend={avgTempReduction > 1 ? 'up' : 'neutral'}
              subtitle={t('urbanGreen.dashboard.heatIslandMitigation')}
            />
            <KPICard
              title={t('urbanGreen.dashboard.coordinationScore')}
              value={`${Math.round(coordinationScore)}%`}
              icon="Users"
              color={coordinationScore > 70 ? 'var(--genio)' : coordinationScore > 40 ? 'var(--acero)' : 'var(--haiti)'}
              trend={coordinationScore > 70 ? 'up' : coordinationScore > 40 ? 'neutral' : 'down'}
              subtitle={t('urbanGreen.dashboard.governanceCoordination')}
            />
            <KPICard
              title={t('urbanGreen.dashboard.capturedValue')}
              value={`$${(totalCaptured / 1e6).toFixed(1)}M`}
              icon="Coins"
              color="var(--cyan-400)"
              trend="up"
              subtitle={t('urbanGreen.dashboard.landValueCapture')}
            />
            <KPICard
              title={t('urbanGreen.dashboard.instruments')}
              value={instrumentCount}
              icon="FileText"
              color="var(--cian-400)"
              trend={instrumentCount > 0 ? 'up' : 'neutral'}
              subtitle={t('urbanGreen.dashboard.governanceInstruments')}
            />
            <KPICard
              title={t('urbanGreen.dashboard.sharedStrategies')}
              value={activeStrategies}
              icon="Target"
              color={activeStrategies > 0 ? 'var(--genio)' : 'var(--haiti)'}
              trend={activeStrategies > 0 ? 'up' : 'down'}
              subtitle={t('urbanGreen.dashboard.sharedStrategyActive')}
            />
          </div>

          {/* Gráficos y Tabs */}
          <Tabs defaultValue="projects" className="urban-green-tabs">
            <Tabs.List>
              <Tabs.Trigger value="projects">🌳 {t('urbanGreen.dashboard.projects')}</Tabs.Trigger>
              <Tabs.Trigger value="ecosystem">🌿 {t('urbanGreen.dashboard.ecosystemServices')}</Tabs.Trigger>
              <Tabs.Trigger value="roi">📈 {t('urbanGreen.dashboard.roiAnalysis')}</Tabs.Trigger>
              <Tabs.Trigger value="microclimate">🌡️ {t('urbanGreen.dashboard.microclimate')}</Tabs.Trigger>
              <Tabs.Trigger value="governance">🤝 {t('urbanGreen.dashboard.governance')}</Tabs.Trigger>
              <Tabs.Trigger value="landvalue">💰 {t('urbanGreen.dashboard.landValueCapture')}</Tabs.Trigger>
              <Tabs.Trigger value="instruments">📜 {t('urbanGreen.dashboard.instruments')}</Tabs.Trigger>
              <Tabs.Trigger value="strategy">🎯 {t('urbanGreen.dashboard.strategy')}</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="projects">
              <ProjectsTab projects={Object.values(store.sbnProjects || {})} actions={store} />
            </Tabs.Content>

            <Tabs.Content value="ecosystem">
              <EcosystemTab services={Object.values(store.ecosystemServices || {})} projects={Object.values(store.sbnProjects || {})} />
            </Tabs.Content>

            <Tabs.Content value="roi">
              <ROITab roiData={Object.values(store.greenROI || {})} projects={Object.values(store.sbnProjects || {})} />
            </Tabs.Content>

            <Tabs.Content value="microclimate">
              <MicroclimateTab microclimates={Object.values(store.urbanMicroclimate || {})} projects={Object.values(store.sbnProjects || {})} />
            </Tabs.Content>

            <Tabs.Content value="governance">
              <GovernanceTab coordination={Object.values(store.governanceCoordination || {})} instruments={Object.values(store.governanceInstruments || {})} />
            </Tabs.Content>

            <Tabs.Content value="landvalue">
              <LandValueTab captures={Object.values(store.landValueCapture || {})} />
            </Tabs.Content>

            <Tabs.Content value="instruments">
              <InstrumentsTab instruments={Object.values(store.governanceInstruments || {})} />
            </Tabs.Content>

            <Tabs.Content value="strategy">
              <StrategyTab strategies={Object.values(store.sharedStrategies || {})} />
            </Tabs.Content>
          </Tabs>
        </main>

        {/* Sidebar derecho: Acciones rápidas */}
        <aside className="urban-green-sidebar-right" aria-label="Acciones rápidas">
          <div className="urban-green-sidebar-section">
            <h3>⚡ {t('urbanGreen.dashboard.quickActions')}</h3>
            <div className="urban-green-quick-actions">
              <Button variant="primary" onClick={() => actions.setScreen('urbanGreenPlanner')} className="urban-green-action-btn">
                ➕ {t('urbanGreen.dashboard.newProject')}
              </Button>
              <Button variant="secondary" onClick={() => actions.setScreen('soilGovernance')} className="urban-green-action-btn">
                🏛️ {t('urbanGreen.dashboard.soilGovernance')}
              </Button>
              <Button variant="secondary" onClick={() => actions.setScreen('urbanResilienceSimulator')} className="urban-green-action-btn">
                🌡️ {t('urbanGreen.dashboard.simulator')}
              </Button>
              <Button variant="ghost" onClick={() => actions.saveToStorage()} className="urban-green-action-btn">
                💾 {t('urbanGreen.dashboard.saveNow')}
              </Button>
              <Button variant="ghost" onClick={() => { /* export */ }} className="urban-green-action-btn">
                📄 {t('urbanGreen.dashboard.export')}
              </Button>
            </div>
          </div>

          <div className="urban-green-sidebar-section">
            <h3>🔔 {t('urbanGreen.dashboard.alerts')}</h3>
            <AlertList
              projects={Object.values(store.sbnProjects || {})}
              coordinationScore={coordinationScore}
              totalCaptured={totalCaptured}
              instrumentCount={instrumentCount}
              activeStrategies={activeStrategies}
            />
          </div>

          <div className="urban-green-sidebar-section">
            <h3>📊 {t('urbanGreen.dashboard.keyMetrics')}</h3>
            <KeyMetricsList
              totalProjects={store.sbnProjects ? Object.keys(store.sbnProjects).length : 0}
              totalArea={totalArea}
              totalEcoValue={totalEcoValue}
              avgROI={avgROI}
              avgTempReduction={avgTempReduction}
              coordinationScore={coordinationScore}
              totalCaptured={totalCaptured}
            />
          </div>

          <div className="urban-green-sidebar-section">
            <h3>💱 {t('urbanGreen.dashboard.monetaryMode')}</h3>
            <MonetaryModeSelector />
          </div>
        </aside>
      </div>

      {/* Toasts */}
      <div className="urban-green-toasts" role="region" aria-live="polite">
        {store.ui?.toasts?.map((toast: any) => (
          <Toast key={toast.id} toast={toast} onClose={() => actions.removeToast(toast.id)} />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTES
// ============================================================================

const KPICard: React.FC<{
  title: string;
  value: string;
  icon: string;
  color: string;
  trend: 'up' | 'down' | 'neutral';
  subtitle: string;
}> = ({ title, value, icon, color, trend, subtitle }) => (
  <Card className="urban-green-kpi-card">
    <div className="urban-green-kpi-header">
      <Icon name={icon} size={24} style={{ color }} />
      <span className={`urban-green-kpi-trend urban-green-trend-${trend}`}>
        {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
      </span>
    </div>
    <div className="urban-green-kpi-value" style={{ color }}>{value}</div>
    <div className="urban-green-kpi-title">{title}</div>
    <div className="urban-green-kpi-subtitle">{subtitle}</div>
  </Card>
);

const ProjectsTab: React.FC<{ projects: any[]; actions: any }> = ({ projects, actions }) => (
  <div className="urban-green-projects-tab">
    <div className="urban-green-tab-header">
      <h3>🌳 {t('urbanGreen.dashboard.projects')}</h3>
      <Button variant="primary" onClick={() => actions.setScreen('urbanGreenPlanner')}>
        ➕ {t('urbanGreen.dashboard.newProject')}
      </Button>
    </div>

    {projects.length === 0 ? (
      <div className="urban-green-empty-state">
        <Icon name="TreePine" size={64} style={{ color: 'var(--muted)', opacity: 0.5 }} />
        <h3>{t('urbanGreen.dashboard.noProjects')}</h3>
        <p>{t('urbanGreen.dashboard.createFirstProject')}</p>
        <Button variant="primary" onClick={() => actions.setScreen('urbanGreenPlanner')}>
          ➕ {t('urbanGreen.dashboard.createProject')}
        </Button>
      </div>
    ) : (
      <div className="urban-green-projects-grid">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    )}
  </div>
);

const ProjectCard: React.FC<{ project: any }> = ({ project }) => (
  <Card className="urban-green-project-card">
    <div className="urban-green-project-header">
      <div className="urban-green-project-type">
        <Icon name={SBN_TYPE_ICONS[project.type] || 'TreePine'} size={24} />
        <span>{SBN_TYPE_LABELS[project.type] || project.type}</span>
      </div>
      <Badge variant={
        project.status === 'completed' ? 'success' :
        project.status === 'implementation' ? 'info' :
        project.status === 'planning' ? 'secondary' :
        project.status === 'maintenance' ? 'warning' : 'secondary'
      }>{PROJECT_STATUS_LABELS[project.status] || project.status}</Badge>
    </div>
    <h4>{project.name}</h4>
    <p className="urban-green-project-location">📍 {project.location.city} · {project.location.area_hectares} ha</p>
    <div className="urban-green-project-metrics">
      <div className="urban-green-metric">
        <span className="urban-green-metric-value">${(project.ecosystemServices?.economicValue_usd_per_year || 0 / 1e6).toFixed(1)}M</span>
        <span className="urban-green-metric-label">{t('urbanGreen.dashboard.ecoValueYear')}</span>
      </div>
      <div className="urban-green-metric">
        <span className="urban-green-metric-value">{project.roi?.netPresentValue_usd ? (project.roi.netPresentValue_usd / 1e6).toFixed(1) + 'M' : '—'}</span>
        <span className="urban-green-metric-label">{t('urbanGreen.dashboard.npv')}</span>
      </div>
      <div className="urban-green-metric">
        <span className="urban-green-metric-value">{project.microclimateImpact?.temperatureReduction_celsius?.toFixed(1) || '—'}°C</span>
        <span className="urban-green-metric-label">{t('urbanGreen.dashboard.tempReduction')}</span>
      </div>
    </div>
    <div className="urban-green-project-actions">
      <Button variant="ghost" size="sm" onClick={() => { /* editar */ }}>
        ✏️ {t('urbanGreen.dashboard.edit')}
      </Button>
      <Button variant="ghost" size="sm" onClick={() => { /* simular */ }}>
        🌡️ {t('urbanGreen.dashboard.simulate')}
      </Button>
    </div>
  </Card>
);

const EcosystemTab: React.FC<{ services: any[]; projects: any[] }> = ({ services, projects }) => (
  <div className="urban-green-ecosystem-tab">
    <div className="urban-green-ecosystem-summary">
      <EcosystemMetricCard
        title={t('urbanGreen.dashboard.co2Sequestration')}
        value={services.reduce((sum, s) => sum + (s.co2Sequestration_tonnes_per_year || 0), 0).toFixed(1)}
        unit={t('urbanGreen.dashboard.tonnesYear')}
        icon="Cloud"
        color="var(--genio)"
      />
      <EcosystemMetricCard
        title={t('urbanGreen.dashboard.waterRetention')}
        value={services.reduce((sum, s) => sum + (s.waterRetention_m3_per_year || 0), 0).toLocaleString()}
        unit={t('urbanGreen.dashboard.m3Year')}
        icon="Droplets"
        color="var(--cyan-400)"
      />
      <EcosystemMetricCard
        title={t('urbanGreen.dashboard.pollutionRemoval')}
        value={services.reduce((sum, s) => sum + (s.pollutionRemoval_kg_per_year || 0), 0).toLocaleString()}
        unit={t('urbanGreen.dashboard.kgYear')}
        icon="Wind"
        color="var(--acero)"
      />
      <EcosystemMetricCard
        title={t('urbanGreen.dashboard.energySavings')}
        value={(services.reduce((sum, s) => sum + (s.energySavings_kwh_per_year || 0), 0) / 1e6).toFixed(1)}
        unit={t('urbanGreen.dashboard.gwhYear')}
        icon="Zap"
        color="var(--limon)"
      />
      <EcosystemMetricCard
        title={t('urbanGreen.dashboard.biodiversityIndex')}
        value={services.length > 0 ? (services.reduce((sum, s) => sum + (s.biodiversityIndex || 0), 0) / services.length).toFixed(0) : '0'}
        unit={t('urbanGreen.dashboard.percent')}
        icon="Leaf"
        color="var(--genio)"
      />
      <EcosystemMetricCard
        title={t('urbanGreen.dashboard.airQuality')}
        value={services.length > 0 ? (services.reduce((sum, s) => sum + (s.airQualityImprovement || 0), 0) / services.length).toFixed(0) : '0'}
        unit={t('urbanGreen.dashboard.percent')}
        icon="Wind"
        color="var(--acero)"
      />
    </div>

    <div className="urban-green-ecosystem-breakdown">
      <h4>📊 {t('urbanGreen.dashboard.byProject')}</h4>
      <div className="urban-green-breakdown-table">
        <table>
          <thead>
            <tr>
              <th>{t('urbanGreen.dashboard.project')}</th>
              <th>{t('urbanGreen.dashboard.type')}</th>
              <th>{t('urbanGreen.dashboard.area')}</th>
              <th>CO₂ (t/año)</th>
              <th>H₂O (m³/año)</th>
              <th>Contaminación (kg/año)</th>
              <th>Energía (kWh/año)</th>
              <th>Valor Eco ($/año)</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => {
              const s = p.ecosystemServices;
              return (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td><Badge variant="secondary">{SBN_TYPE_LABELS[p.type] || p.type}</Badge></td>
                  <td>{p.location.area_hectares} ha</td>
                  <td>{s?.co2Sequestration_tonnes_per_year?.toFixed(1) || 0}</td>
                  <td>{s?.waterRetention_m3_per_year?.toLocaleString() || 0}</td>
                  <td>{s?.pollutionRemoval_kg_per_year?.toLocaleString() || 0}</td>
                  <td>{s?.energySavings_kwh_per_year?.toLocaleString() || 0}</td>
                  <td>${(s?.economicValue_usd_per_year || 0 / 1e6).toFixed(1)}M</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const EcosystemMetricCard: React.FC<{ title: string; value: string; unit: string; icon: string; color: string }> = ({ title, value, unit, icon, color }) => (
  <Card className="urban-green-ecosystem-metric">
    <div className="urban-green-metric-header">
      <Icon name={icon} size={24} style={{ color }} />
    </div>
    <div className="urban-green-metric-main">
      <span className="urban-green-metric-value" style={{ color }}>{value}</span>
      <span className="urban-green-metric-unit">{unit}</span>
    </div>
    <div className="urban-green-metric-title">{title}</div>
  </Card>
);

const ROITab: React.FC<{ roiData: any[]; projects: any[] }> = ({ roiData, projects }) => (
  <div className="urban-green-roi-tab">
    <div className="urban-green-roi-summary">
      {roiData.map(roi => {
        const project = projects.find(p => p.id === Object.keys({}).find(k => k.includes(roi.initialInvestment_usd.toString())));
        return (
          <Card key={roi.initialInvestment_usd} className="urban-green-roi-card">
            <div className="urban-green-roi-header">
              <h4>{project?.name || 'Proyecto'}</h4>
              <Badge variant={roi.benefitCostRatio > 1 ? 'success' : 'warning'}>
                BCR: {roi.benefitCostRatio?.toFixed(2) || 0}
              </Badge>
            </div>
            <div className="urban-green-roi-metrics">
              <div className="urban-green-roi-metric">
                <span className="urban-green-roi-value">${(roi.netPresentValue_usd / 1e6).toFixed(1)}M</span>
                <span className="urban-green-roi-label">{t('urbanGreen.dashboard.npv')}</span>
              </div>
              <div className="urban-green-roi-metric">
                <span className="urban-green-roi-value">{roi.internalRateOfReturn?.toFixed(1) || 0}%</span>
                <span className="urban-green-roi-label">{t('urbanGreen.dashboard.irr')}</span>
              </div>
              <div className="urban-green-roi-metric">
                <span className="urban-green-roi-value">{roi.paybackPeriod_years?.toFixed(1) || 0}</span>
                <span className="urban-green-roi-label">{t('urbanGreen.dashboard.payback')}</span>
              </div>
              <div className="urban-green-roi-metric">
                <span className="urban-green-roi-value">{roi.benefitCostRatio?.toFixed(2) || 0}</span>
                <span className="urban-green-roi-label">{t('urbanGreen.dashboard.bcr')}</span>
              </div>
            </div>
            <div className="urban-green-roi-breakdown">
              <h5>{t('urbanGreen.dashboard.returnsBreakdown')}</h5>
              <div className="urban-green-breakdown-bars">
                {roi.returnsBreakdown && Object.entries(roi.returnsBreakdown).map(([key, value]) => (
                  <div key={key} className="urban-green-breakdown-bar">
                    <span className="urban-green-breakdown-label">{key.toUpperCase()}</span>
                    <div className="urban-green-breakdown-track">
                      <div className="urban-green-breakdown-fill" style={{ width: `${roi.annualReturns_usd > 0 ? (value / roi.annualReturns_usd) * 100 : 0}%` }}></div>
                    </div>
                    <span className="urban-green-breakdown-value">${(value / 1e6).toFixed(1)}M</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  </div>
);

const MicroclimateTab: React.FC<{ microclimates: any[]; projects: any[] }> = ({ microclimates, projects }) => (
  <div className="urban-green-microclimate-tab">
    <div className="urban-green-microclimate-summary">
      <MicroclimateMetricCard
        title={t('urbanGreen.dashboard.tempReduction')}
        value={microclimates.length > 0 ? (microclimates.reduce((sum, m) => sum + (m.temperatureReduction_celsius || 0), 0) / microclimates.length).toFixed(1) : '0'}
        unit="°C"
        icon="Thermometer"
        color="var(--haiti)"
      />
      <MicroclimateMetricCard
        title={t('urbanGreen.dashboard.heatIslandMitigation')}
        value={microclimates.length > 0 ? (microclimates.reduce((sum, m) => sum + (m.heatIslandMitigation || 0), 0) / microclimates.length).toFixed(0) : '0'}
        unit="%"
        icon="Sun"
        color="var(--haiti)"
      />
      <MicroclimateMetricCard
        title={t('urbanGreen.dashboard.floodRiskReduction')}
        value={microclimates.length > 0 ? (microclimates.reduce((sum, m) => sum + (m.floodRiskReduction || 0), 0) / microclimates.length).toFixed(0) : '0'}
        unit="%"
        icon="Droplets"
        color="var(--cyan-400)"
      />
      <MicroclimateMetricCard
        title={t('urbanGreen.dashboard.thermalComfort')}
        value={microclimates.length > 0 ? (microclimates.reduce((sum, m) => sum + (m.thermalComfortIndex || 0), 0) / microclimates.length).toFixed(0) : '0'}
        unit="%"
        icon="Thermometer"
        color="var(--genio)"
      />
    </div>

    <div className="urban-green-microclimate-scenarios">
      <h4>🌡️ {t('urbanGreen.dashboard.scenarios')}</h4>
      {projects.map(p => {
        const m = p.microclimateImpact;
        return m && m.scenarios && (
          <Card key={p.id} className="urban-green-scenario-card">
            <h4>{p.name}</h4>
            <div className="urban-green-scenario-grid">
              {m.scenarios.map(s => (
                <div key={s.id} className="urban-green-scenario-item">
                  <h5>{s.name} ({s.probability * 100}%)</h5>
                  <div className="urban-green-scenario-metrics">
                    <span>🌡️ {s.projectedTempReduction?.toFixed(1)}°C</span>
                    <span>🌊 {s.projectedFloodReduction?.toFixed(0)}%</span>
                    <span>⚡ {s.projectedEnergySavings?.toLocaleString()} kWh</span>
                    <Badge variant={s.probability > 0.5 ? 'success' : s.probability > 0.2 ? 'info' : 'secondary'}>
                      {Math.round(s.probability * 100)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  </div>
);

const MicroclimateMetricCard: React.FC<{ title: string; value: string; unit: string; icon: string; color: string }> = ({ title, value, unit, icon, color }) => (
  <Card className="urban-green-microclimate-metric">
    <div className="urban-green-metric-header">
      <Icon name={icon} size={24} style={{ color }} />
    </div>
    <div className="urban-green-metric-main">
      <span className="urban-green-metric-value" style={{ color }}>{value}</span>
      <span className="urban-green-metric-unit">{unit}</span>
    </div>
    <div className="urban-green-metric-title">{title}</div>
  </Card>
);

const GovernanceTab: React.FC<{ coordination: any[]; instruments: any[] }> = ({ coordination, instruments }) => (
  <div className="urban-green-governance-tab">
    <div className="urban-green-governance-summary">
      <GovernanceMetricCard
        title={t('urbanGreen.dashboard.coordinationScore')}
        value={coordination.length > 0 ? (coordination.reduce((sum, c) => sum + (c.coordinationScore || 0), 0) / coordination.length).toFixed(0) : '0'}
        unit="%"
        icon="Users"
        color="var(--genio)"
      />
      <GovernanceMetricCard
        title={t('urbanGreen.dashboard.contradictions')}
        value={coordination.reduce((sum, c) => sum + (c.contradictions?.length || 0), 0)}
        unit={t('urbanGreen.dashboard.detected')}
        icon="AlertTriangle"
        color="var(--haiti)"
      />
      <GovernanceMetricCard
        title={t('urbanGreen.dashboard.sharedStrategies')}
        value={coordination.filter(c => c.sharedStrategy).length}
        unit={t('urbanGreen.dashboard.active')}
        icon="Target"
        color="var(--genio)"
      />
      <GovernanceMetricCard
        title={t('urbanGreen.dashboard.instruments')}
        value={instruments.length}
        unit={t('urbanGreen.dashboard.proposed')}
        icon="FileText"
        color="var(--cian-400)"
      />
    </div>

    <div className="urban-green-governance-detail">
      <h4>🤝 {t('urbanGreen.dashboard.coordinationDetails')}</h4>
      {coordination.map(c => (
        <Card key={c.scenarioId} className="urban-green-coord-card">
          <div className="urban-green-coord-header">
            <span className="urban-green-coord-score" style={{ color: c.coordinationScore > 70 ? 'var(--genio)' : c.coordinationScore > 40 ? 'var(--acero)' : 'var(--haiti)' }}>
              {c.coordinationScore}%
            </span>
            <Badge variant={c.sharedStrategy ? 'success' : 'secondary'}>
              {c.sharedStrategy ? '✅ Estrategia' : '❌ Fragmentada'}
            </Badge>
          </div>
          <p>{c.strategyDescription}</p>
          <div className="urban-green-contradictions">
            <strong>{t('urbanGreen.dashboard.contradictions')} ({c.contradictions?.length || 0}):</strong>
            <ul>{c.contradictions?.map((contr: any) => (
              <li key={contr.id}><Badge variant={contr.severity === 'critical' ? 'danger' : contr.severity === 'high' ? 'warning' : 'info'}>{contr.severity}</Badge> {contr.description}</li>
            ))}</ul>
          </div>
        </Card>
      ))}
    </div>

    <h4>📜 {t('urbanGreen.dashboard.instruments')}</h4>
    <div className="urban-green-instruments-grid">
      {instruments.map(inst => (
        <Card key={inst.id} className="urban-green-instrument-card">
          <div className="urban-green-instrument-header">
            <h4>{inst.name}</h4>
            <Badge variant={inst.type === 'regulatory' ? 'danger' : inst.type === 'economic' ? 'warning' : inst.type === 'informational' ? 'info' : inst.type === 'participatory' ? 'success' : 'secondary'}>
              {inst.type}
            </Badge>
          </div>
          <p>{inst.description}</p>
          <div className="urban-green-instrument-connections">
            {Object.entries(inst.connectedTo).map(([req, met]) => (
              <Badge key={req} variant={met ? 'success' : 'secondary'} size="sm">
                {req}: {met ? '✅' : '❌'}
              </Badge>
            ))}
          </div>
          <Badge variant={inst.status === 'implemented' ? 'success' : inst.status === 'approved' ? 'info' : 'secondary'}>{inst.status}</Badge>
        </Card>
      ))}
    </div>
  </div>
);

const GovernanceMetricCard: React.FC<{ title: string; value: string; unit: string; icon: string; color: string }> = ({ title, value, unit, icon, color }) => (
  <Card className="urban-green-governance-metric">
    <div className="urban-green-metric-header">
      <Icon name={icon} size={24} style={{ color }} />
    </div>
    <div className="urban-green-metric-main">
      <span className="urban-green-metric-value" style={{ color }}>{value}</span>
      <span className="urban-green-metric-unit">{unit}</span>
    </div>
    <div className="urban-green-metric-title">{title}</div>
  </Card>
);

const LandValueTab: React.FC<{ captures: any[] }> = ({ captures }) => (
  <div className="urban-green-landvalue-tab">
    <div className="urban-green-landvalue-summary">
      <LandValueMetricCard
        title={t('urbanGreen.dashboard.totalCaptured')}
        value={`$${(captures.reduce((sum, c) => sum + (c.capturedValue_usd || 0), 0) / 1e6).toFixed(1)}M`}
        icon="Coins"
        color="var(--cyan-400)"
      />
      <LandValueMetricCard
        title={t('urbanGreen.dashboard.avgCaptureRate')}
        value={captures.length > 0 ? (captures.reduce((sum, c) => sum + (c.captureRate || 0), 0) / captures.length * 100).toFixed(1) : '0'}
        unit="%"
        icon="Percent"
        color="var(--genio)"
      />
      <LandValueMetricCard
        title={t('urbanGreen.dashboard.antiDisplacementFund')}
        value={`$${(captures.reduce((sum, c) => sum + (c.distribution?.antiDisplacementFund_usd || 0), 0) / 1e6).toFixed(1)}M`}
        icon="Shield"
        color="var(--genio)"
      />
      <LandValueMetricCard
        title={t('urbanGreen.dashboard.displacedHouseholds')}
        value={captures.reduce((sum, c) => sum + (c.displacedHouseholds || 0), 0)}
        unit={t('urbanGreen.dashboard.households')}
        icon="Users"
        color="var(--haiti)"
      />
    </div>

    <div className="urban-green-landvalue-list">
      {captures.map(c => (
        <Card key={c.projectId} className="urban-green-capture-card">
          <div className="urban-green-capture-header">
            <h4>{c.projectName}</h4>
            <Badge variant={c.displacementRisk === 'critical' ? 'danger' : c.displacementRisk === 'high' ? 'warning' : 'info'}>{c.displacementRisk}</Badge>
          </div>
          <div className="urban-green-capture-metrics">
            <div className="urban-green-capture-metric">
              <span className="urban-green-capture-value">${(c.capturedValue_usd / 1e6).toFixed(1)}M</span>
              <span className="urban-green-capture-label">{t('urbanGreen.dashboard.capturedValue')}</span>
            </div>
            <div className="urban-green-capture-metric">
              <span className="urban-green-capture-value">{(c.captureRate * 100).toFixed(1)}%</span>
              <span className="urban-green-capture-label">{t('urbanGreen.dashboard.captureRate')}</span>
            </div>
            <div className="urban-green-capture-metric">
              <span className="urban-green-capture-value">${(c.distribution?.antiDisplacementFund_usd / 1e6).toFixed(1)}M</span>
              <span className="urban-green-capture-label">{t('urbanGreen.dashboard.antiDisplacementFund')}</span>
            </div>
            <div className="urban-green-capture-metric">
              <span className="urban-green-capture-value">{c.displacedHouseholds}</span>
              <span className="urban-green-capture-label">{t('urbanGreen.dashboard.displacedHouseholds')}</span>
            </div>
          </div>
          <div className="urban-green-capture-distribution">
            <strong>{t('urbanGreen.dashboard.distribution')}:</strong>
            <div className="urban-green-distribution-bars">
              {c.distribution && Object.entries(c.distribution).map(([key, value]) => (
                <div key={key} className="urban-green-dist-bar">
                  <span>{key}</span>
                  <div className="urban-green-dist-track">
                    <div className="urban-green-dist-fill" style={{ width: `${c.totalCapturedValue_usd > 0 ? (value / c.totalCapturedValue_usd) * 100 : 0}%` }}></div>
                  </div>
                  <span>${(value / 1e6).toFixed(1)}M</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const LandValueMetricCard: React.FC<{ title: string; value: string; icon: string; color: string }> = ({ title, value, icon, color }) => (
  <Card className="urban-green-landvalue-metric">
    <div className="urban-green-metric-header">
      <Icon name={icon} size={24} style={{ color }} />
    </div>
    <div className="urban-green-metric-value" style={{ color }}>{value}</div>
    <div className="urban-green-metric-title">{title}</div>
  </Card>
);

const InstrumentsTab: React.FC<{ instruments: any[] }> = ({ instruments }) => (
  <div className="urban-green-instruments-tab">
    <div className="urban-green-instruments-header">
      <h3>📜 {t('urbanGreen.dashboard.instruments')}</h3>
      <span>{instruments.length} {t('urbanGreen.dashboard.proposed')}</span>
    </div>

    <div className="urban-green-instruments-grid">
      {instruments.map(inst => (
        <Card key={inst.id} className="urban-green-instrument-card">
          <div className="urban-green-instrument-header">
            <h4>{inst.name}</h4>
            <Badge variant={inst.type === 'regulatory' ? 'danger' : inst.type === 'economic' ? 'warning' : inst.type === 'informational' ? 'info' : inst.type === 'participatory' ? 'success' : 'secondary'}>
              {inst.type}
            </Badge>
          </div>
          <p>{inst.description}</p>
          <div className="urban-green-instrument-connections">
            {Object.entries(inst.connectedTo).map(([req, met]) => (
              <Badge key={req} variant={met ? 'success' : 'secondary'} size="sm">
                {req}: {met ? '✅' : '❌'}
              </Badge>
            ))}
          </div>
          <div className="urban-green-instrument-meta">
            <span>Actores: {inst.applicableActors?.join(', ')}</span>
            <Badge variant={inst.status === 'implemented' ? 'success' : inst.status === 'approved' ? 'info' : 'secondary'}>{inst.status}</Badge>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const StrategyTab: React.FC<{ strategies: any[] }> = ({ strategies }) => (
  <div className="urban-green-strategy-tab">
    <div className="urban-green-strategy-summary">
      <StrategyMetricCard
        title={t('urbanGreen.dashboard.totalStrategies')}
        value={strategies.length}
        icon="Target"
        color="var(--cyan-400)"
      />
      <StrategyMetricCard
        title={t('urbanGreen.dashboard.activeShared')}
        value={strategies.filter(s => s.hasSharedStrategy).length}
        icon="CheckCircle"
        color="var(--genio)"
      />
      <StrategyMetricCard
        title={t('urbanGreen.dashboard.contradictionsResolved')}
        value={strategies.reduce((sum, s) => sum + (s.contradictionsResolved || 0), 0)}
        icon="Check"
        color="var(--genio)"
      />
      <StrategyMetricCard
        title={t('urbanGreen.dashboard.contradictionsRemaining')}
        value={strategies.reduce((sum, s) => sum + (s.contradictionsRemaining || 0), 0)}
        icon="AlertTriangle"
        color="var(--haiti)"
      />
    </div>

    <div className="urban-green-strategy-list">
      {strategies.map(strategy => (
        <Card key={strategy.implementationPlan?.[0]?.id || strategy.commonGoals?.[0]} className="urban-green-strategy-card">
          <div className="urban-green-strategy-header">
            <h4>{strategy.strategyDocument || 'Estrategia'}</h4>
            <Badge variant={strategy.hasSharedStrategy ? 'success' : 'secondary'}>
              {strategy.hasSharedStrategy ? '✅ Compartida' : '❌ Fragmentada'}
            </Badge>
          </div>
          <div className="urban-green-strategy-goals">
            <strong>{t('urbanGreen.dashboard.commonGoals')}:</strong>
            <ul>{strategy.commonGoals?.map((g: string, i: number) => <li key={i}>{g}</li>)}</ul>
          </div>
          <div className="urban-green-strategy-plan">
            <strong>{t('urbanGreen.dashboard.implementationPlan')}:</strong>
            {strategy.implementationPlan?.map((step: any, i: number) => (
              <div key={i} className="urban-green-plan-step">
                <span className="urban-green-step-number">{i + 1}</span>
                <span>{step.description}</span>
                <Badge variant={step.status === 'completed' ? 'success' : step.status === 'in_progress' ? 'info' : 'secondary'}>{step.status}</Badge>
              </div>
            ))}
          </div>
          <div className="urban-green-strategy-monitoring">
            <strong>{t('urbanGreen.dashboard.monitoring')}: {strategy.monitoringFramework?.length || 0} indicadores</strong>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const StrategyMetricCard: React.FC<{ title: string; value: number; icon: string; color: string }> = ({ title, value, icon, color }) => (
  <Card className="urban-green-strategy-metric">
    <Icon name={icon} size={24} style={{ color }} />
    <div className="urban-green-metric-value" style={{ color }}>{value}</div>
    <div className="urban-green-metric-title">{title}</div>
  </Card>
);

// Componentes auxiliares
const AlertList: React.FC<{ projects: any[]; coordinationScore: number; totalCaptured: number; instrumentCount: number; activeStrategies: number }> = ({ projects, coordinationScore, totalCaptured, instrumentCount, activeStrategies }) => {
  const alerts: { type: 'danger' | 'warning' | 'info' | 'success'; message: string }[] = [];

  if (coordinationScore < 40) {
    alerts.push({ type: 'danger', message: `Coordinación gobernanza baja (${Math.round(coordinationScore)}%): riesgo ciudad contradictoria` });
  }
  if (projects.length === 0) {
    alerts.push({ type: 'info', message: 'Sin proyectos SBN registrados. Crear primer proyecto.' });
  }
  if (instrumentCount === 0) {
    alerts.push({ type: 'warning', message: 'Sin instrumentos gobernanza diseñados. Usar diseñador instrumentos.' });
  }
  if (activeStrategies === 0) {
    alerts.push({ type: 'info', message: 'Sin estrategias compartidas activas. Simular estrategia gobernanza.' });
  }
  if (totalCaptured === 0) {
    alerts.push({ type: 'info', message: 'Plusvalía no capturada. Configurar captura plusvalía en proyectos.' });
  }

  if (alerts.length === 0) {
    return <div className="urban-green-no-alerts">✅ {t('urbanGreen.dashboard.noAlerts')}</div>;
  }

  return (
    <div className="urban-green-alert-list">
      {alerts.map((alert, i) => (
        <div key={i} className={`urban-green-alert urban-green-alert-${alert.type}`}>
          <Icon name={alert.type === 'danger' ? 'AlertCircle' : alert.type === 'warning' ? 'AlertTriangle' : 'Info'} size={16} />
          <span>{alert.message}</span>
        </div>
      ))}
    </div>
  );
};

const KeyMetricsList: React.FC<{ totalProjects: number; totalArea: number; totalEcoValue: number; avgROI: number; avgTempReduction: number; coordinationScore: number; totalCaptured: number }> = ({ totalProjects, totalArea, totalEcoValue, avgROI, avgTempReduction, coordinationScore, totalCaptured }) => (
  <ul className="urban-green-key-metrics">
    <li><strong>{t('urbanGreen.dashboard.totalProjects')}:</strong> {totalProjects}</li>
    <li><strong>{t('urbanGreen.dashboard.totalArea')}:</strong> {totalArea.toFixed(1)} ha</li>
    <li><strong>{t('urbanGreen.dashboard.annualEcoValue')}:</strong> ${(totalEcoValue / 1e6).toFixed(1)}M/año</li>
    <li><strong>{t('urbanGreen.dashboard.avgNPV')}:</strong> ${(avgROI / 1e6).toFixed(1)}M</li>
    <li><strong>{t('urbanGreen.dashboard.avgTempReduction')}:</strong> {avgTempReduction.toFixed(1)}°C</li>
    <li><strong>{t('urbanGreen.dashboard.coordinationScore')}:</strong> {Math.round(coordinationScore)}%</li>
    <li><strong>{t('urbanGreen.dashboard.capturedValue')}:</strong> ${(totalCaptured / 1e6).toFixed(1)}M</li>
  </ul>
);

const MonetaryModeSelector: React.FC = () => {
  const mode = useUrbanGreenStore(s => s.monetaryMode || 'postmonetario');
  const setMode = useUrbanGreenStore(s => s.setMonetaryMode);
  const priceParity = useUrbanGreenStore(s => s.priceParity || 1);

  return (
    <div className="urban-green-mode-selector">
      <label>
        <input type="radio" name="monetary-mode" value="postmonetario" checked={mode === 'postmonetario'} onChange={() => setMode('postmonetario')} />
        <span>🌿 {t('urbanGreen.modes.postmonetario')}</span>
      </label>
      <label>
        <input type="radio" name="monetary-mode" value="conectado" checked={mode === 'conectado'} onChange={() => setMode('conectado')} />
        <span>💰 {t('urbanGreen.modes.conectado')}</span>
      </label>
      {mode === 'conectado' && (
        <div className="urban-green-price-parity">
          <label>{t('urbanGreen.priceParity')}: </label>
          <input type="number" step="0.0001" value={priceParity} onChange={(e) => useUrbanGreenStore.getState().setPriceParity(parseFloat(e.target.value))} />
          <small>USD/ZNU</small>
        </div>
      )}
    </div>
  );
};

const Toast: React.FC<{ toast: any; onClose: (id: string) => void }> = ({ toast, onClose }) => (
  <div className={`urban-green-toast ${toast.type}`} role="alert">
    <div className="urban-green-toast-content">
      <span className="urban-green-toast-title">{toast.title}</span>
      <span className="urban-green-toast-message">{toast.message}</span>
    </div>
    <button className="urban-green-toast-close" onClick={() => onClose(toast.id)} aria-label="Cerrar">×</button>
  </div>
);

export default UrbanGreenDashboard;