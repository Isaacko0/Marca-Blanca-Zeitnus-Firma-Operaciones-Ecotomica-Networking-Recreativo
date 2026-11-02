// ZeitnusCooperativeDashboard.tsx — Dashboard principal del Ecosistema Cooperativo ZEITNUS
// Principio Anfibio: funciona offline-first, modo postmonetario/conectado vía priceParity

import React, { useEffect, useMemo } from 'react';
import {
  useZeitnusCooperativeStore,
  useCooperativeCapital,
  useSavings,
  useCreditPortfolio,
  useSurplus,
  useRiskProfile,
  useRegulatoryRegime,
  useProgressivePhase,
  usePhaseCompleted,
  usePhaseMetrics,
  useCircularProjects,
  useCircularMetrics,
  useSocialCapital,
  useTransparencyIndex,
  useTransparencyMechanisms,
  useEducationPrograms,
  useFinancialLiteracyIndex,
  useGovernance,
  useTotalAssets,
  useLiquidityRatio,
  useNPLRatio,
  usePhaseProgress,
  useCircularEconomyHealth,
  useSocialCapitalHealth,
  useTransparencyHealth,
  useEducationHealth,
} from '@core/state/hooks/zeitnus-cooperative';
import {
  calculateCooperativeCapital,
  simulateCompoundInterest,
  assessRiskProfile,
  verifyRegulatoryRegime,
  designProgressiveModel,
  measureCircularEconomy,
  buildSocialCapital,
  ensureTransparency,
} from '@core/lib/zeitnus-cooperative';
import { Icon } from '@core/ui/Icon';
import { Button } from '@core/ui/Button';
import { Card } from '@core/ui/Card';
import { Progress } from '@core/ui/Progress';
import { Badge } from '@core/ui/Badge';
import { Tooltip } from '@core/ui/Tooltip';
import { t } from '@core/lib/i18n';

export const ZeitnusCooperativeDashboard: React.FC = () => {
  const store = useZeitnusCooperativeStore();
  const capital = useCooperativeCapital();
  const savings = useSavings();
  const credit = useCreditPortfolio();
  const surplus = useSurplus();
  const risk = useRiskProfile();
  const regimes = useRegulatoryRegime();
  const phase = useProgressivePhase();
  const completedPhases = usePhaseCompleted();
  const phaseMetrics = usePhaseMetrics();
  const circularProjects = useCircularProjects();
  const circularMetrics = useCircularMetrics();
  const socialCapital = useSocialCapital();
  const transparencyIndex = useTransparencyIndex();
  const transparencyMechanisms = useTransparencyMechanisms();
  const educationPrograms = useEducationPrograms();
  const financialLiteracy = useFinancialLiteracyIndex();
  const governance = useGovernance();
  const totalAssets = useTotalAssets();
  const liquidityRatio = useLiquidityRatio();
  const nplRatio = useNPLRatio();
  const phaseProgress = usePhaseProgress();
  const circularHealth = useCircularEconomyHealth();
  const socialHealth = useSocialCapitalHealth();
  const transparencyHealth = useTransparencyHealth();
  const educationHealth = useEducationHealth();

  const actions = store;

  // Auto-save effect
  useEffect(() => {
    const timer = setTimeout(() => actions.saveToStorage(), 5000);
    return () => clearTimeout(timer);
  }, [actions]);

  // Detect V1 data on mount
  useEffect(() => {
    if (actions.detectV1Data()) {
      // Could trigger migration modal
      console.log('[ZeitnusCooperative] Datos v1 detectados');
    }
  }, []);

  const currentPhaseMeta = PHASE_META[phase];
  const riskLevelColor = risk.level === 'critico' ? 'var(--haiti)' :
    risk.level === 'alto' ? 'var(--haiti)' :
    risk.level === 'medio' ? 'var(--acero)' : 'var(--genio)';

  const regimeLabels = regimes.map(r => REGULATORY_REGIME_LABELS[r] || r).join(', ');

  return (
    <div className="zeitnus-coop-dashboard">
      {/* Header con Power Bar */}
      <header className="zeitnus-header">
        <div className="zeitnus-header-left">
          <Icon name="Users" size={32} style={{ color: 'var(--genio)' }} />
          <div>
            <h1>{t('zeitnusCooperative.dashboard.title')}</h1>
            <p className="zeitnus-subtitle">{t('zeitnusCooperative.dashboard.subtitle')}</p>
          </div>
        </div>
        <div className="zeitnus-header-right">
          <div className="zeitnus-power-bar-container">
            <div className="zeitnus-power-bar-wrapper">
              <span className="zeitnus-power-label">{t('zeitnusCooperative.power')}: </span>
              <div className="zeitnus-power-bar">
                <div
                  className="zeitnus-power-fill"
                  style={{
                    width: `${phaseProgress.percentage}%`,
                    background: phaseProgress.percentage >= 80 ? 'var(--limon)' :
                      phaseProgress.percentage >= 50 ? 'var(--genio)' :
                      phaseProgress.percentage >= 20 ? 'var(--acero)' : 'var(--muted)'
                  }}
                ></div>
              </div>
              <span className="zeitnus-power-value">{phaseProgress.percentage}%</span>
              <span className={`zeitnus-power-status ${phaseProgress.percentage >= 80 ? 'ready' : phaseProgress.percentage >= 50 ? 'solid' : 'progress'}`}>
                {phaseProgress.completed}/{phaseProgress.total} fases
              </span>
            </div>
          </div>
          <Badge variant={risk.level === 'critico' ? 'danger' : risk.level === 'alto' ? 'warning' : risk.level === 'medio' ? 'info' : 'success'}>
            {RISK_LEVEL_LABELS[risk.level]}
          </Badge>
        </div>
      </header>

      <div className="zeitnus-main-layout">
        {/* Sidebar izquierdo: Fases y Navegación */}
        <aside className="zeitnus-sidebar-left" aria-label="Fases ZEITNUS">
          <nav className="zeitnus-phases-nav" aria-label="Fases progresivas ZEITNUS">
            {PROGRESSIVE_PHASE_ORDER.slice(0, 10).map((phaseKey, index) => {
              const isCompleted = completedPhases.includes(phaseKey);
              const isCurrent = phase === phaseKey;
              const metrics = phaseMetrics[phaseKey];
              const gatePassed = metrics?.gatePassed;

              return (
                <button
                  key={phaseKey}
                  className={`zeitnus-phase ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${!gatePassed && !isCompleted ? 'locked' : ''}`}
                  onClick={() => gatePassed || isCompleted ? actions.setProgressivePhase(phaseKey) : undefined}
                  disabled={!gatePassed && !isCompleted}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-disabled={!gatePassed && !isCompleted}
                  title={PHASE_NAMES[phaseKey]}
                >
                  <span className="zeitnus-phase-number">{index + 1}</span>
                  <Icon name={PHASE_ICONS[phaseKey]} className="zeitnus-phase-icon" size={18} />
                  <span className="zeitnus-phase-title">{PHASE_LABELS[phaseKey]}</span>
                  {isCompleted && <span className="zeitnus-phase-check">✓</span>}
                  {gatePassed && !isCompleted && <span className="zeitnus-phase-gate">🔓</span>}
                  {!gatePassed && !isCompleted && <span className="zeitnus-phase-lock">🔒</span>}
                </button>
              );
            })}
          </nav>

          <div className="zeitnus-progress-summary">
            <div className="zeitnus-progress-bar">
              <div className="zeitnus-progress-fill" style={{ width: `${phaseProgress.percentage}%` }}></div>
            </div>
            <span className="zeitnus-progress-text">{phaseProgress.completed}/{phaseProgress.total} fases</span>
            <span className="zeitnus-current-phase">{PHASE_NAMES[phase]}</span>
          </div>

          {/* Regímenes regulatorios activos */}
          <div className="zeitnus-regimes">
            <h4>{t('zeitnusCooperative.dashboard.regulatoryRegimes')}</h4>
            <div className="zeitnus-regime-tags">
              {regimes.map(r => (
                <Badge key={r} variant="info" className="zeitnus-regime-badge">
                  {REGULATORY_REGIME_LABELS[r as RegulatoryRegime] || r}
                </Badge>
              ))}
            </div>
          </div>
        </aside>

        {/* Contenido principal: Grid de métricas */}
        <main className="zeitnus-main-content" role="main">
          <div className="zeitnus-metrics-grid">
            {/* Tarjetas principales */}
            <MetricCard
              title={t('zeitnusCooperative.dashboard.totalAssets')}
              value={formatCurrency(totalAssets)}
              icon="Wallet"
              color="var(--genio)"
              trend={calculateAssetTrend()}
              subtitle={t('zeitnusCooperative.dashboard.capital')}: {formatCurrency(capital)}
            />
            <MetricCard
              title={t('zeitnusCooperative.dashboard.liquidity')}
              value={`${(liquidityRatio * 100).toFixed(1)}%`}
              icon="Droplets"
              color={liquidityRatio > 1 ? 'var(--genio)' : liquidityRatio > 0.5 ? 'var(--acero)' : 'var(--haiti)'}
              trend={liquidityRatio > 1 ? 'up' : liquidityRatio > 0.5 ? 'neutral' : 'down'}
              subtitle={t('zeitnusCooperative.dashboard.ratio')}: {liquidityRatio.toFixed(2)}x
            />
            <MetricCard
              title={t('zeitnusCooperative.dashboard.nplRatio')}
              value={`${(nplRatio * 100).toFixed(2)}%`}
              icon="AlertTriangle"
              color={nplRatio < 0.03 ? 'var(--genio)' : nplRatio < 0.08 ? 'var(--acero)' : 'var(--haiti)'}
              trend={nplRatio < 0.03 ? 'up' : nplRatio < 0.08 ? 'neutral' : 'down'}
              subtitle={t('zeitnusCooperative.dashboard.npl')}: {(nplRatio * 100).toFixed(2)}%
            />
            <MetricCard
              title={t('zeitnusCooperative.dashboard.surplus')}
              value={formatCurrency(surplus)}
              icon="TrendingUp"
              color={surplus >= 0 ? 'var(--limon)' : 'var(--haiti)'}
              trend={surplus >= 0 ? 'up' : 'down'}
              subtitle={t('zeitnusCooperative.dashboard.excedentes')}
            />

            {/* Tarjetas de fase y riesgo */}
            <PhaseCard phase={phase} progress={phaseProgress} />
            <RiskCard risk={risk} regimes={regimes} />
            <CircularEconomyCard health={circularHealth} projects={circularProjects.length} />
            <SocialCapitalCard health={socialHealth} />
            <TransparencyCard health={transparencyHealth} />
            <EducationCard health={educationHealth} />
            <GovernanceCard governance={governance} />
            <RegulatoryCard regimes={regimes} />
          </div>

          {/* Gráficos y detalles */}
          <div className="zeitnus-charts-section">
            <AssetCompositionChart capital={capital} savings={savings} credit={credit} surplus={surplus} />
            <RiskBreakdownChart risk={risk} />
            <PhaseTimeline phases={PROGRESSIVE_PHASE_ORDER.slice(0, 10)} currentPhase={phase} completed={completedPhases} metrics={phaseMetrics} />
            <CircularProjectsChart projects={circularProjects} metrics={circularMetrics} />
          </div>
        </main>

        {/* Sidebar derecho: Acciones rápidas y alertas */}
        <aside className="zeitnus-sidebar-right" aria-label="Acciones rápidas">
          <div className="zeitnus-sidebar-section">
            <h3>⚡ {t('zeitnusCooperative.dashboard.quickActions')}</h3>
            <div className="zeitnus-quick-actions">
              <Button variant="primary" onClick={() => actions.setProgressivePhase(getNextIncompletePhase())} className="zeitnus-action-btn">
                ➡️ {t('zeitnusCooperative.dashboard.nextPhase')}
              </Button>
              <Button variant="secondary" onClick={() => actions.addEducationProgram({ name: 'Glosario Interactivo', type: 'glosario', targetAudience: 'asociados_nuevos', status: 'planificado', participants: 0, completedCount: 0, financialLiteracyGain: 0, startDate: Date.now() })} className="zeitnus-action-btn">
                📚 {t('zeitnusCooperative.dashboard.addEducation')}
              </Button>
              <Button variant="secondary" onClick={() => actions.addCircularProject({ name: 'Nuevo Proyecto Circular', type: 'reciclaje', status: 'planificacion', inputs: {}, outputs: {}, metrics: { residuosRecuperados: 0, materialesReutilizados: 0, empleosGenerados: 0, proyectosDesarrollados: 0, impactoEconomico: 0, participacionComunitaria: 0, transparenciaInstitucional: 0, recursosNaturalesProtegidos: 0 }, startDate: Date.now(), budget: 0, actualCost: 0, revenue: 0 })} className="zeitnus-action-btn">
                ♻️ {t('zeitnusCooperative.dashboard.addCircularProject')}
              </Button>
              <Button variant="ghost" onClick={() => actions.saveToStorage()} className="zeitnus-action-btn">
                💾 {t('zeitnusCooperative.dashboard.saveNow')}
              </Button>
              <Button variant="ghost" onClick={() => actions.exportToJSON()} className="zeitnus-action-btn">
                📄 {t('zeitnusCooperative.dashboard.export')}
              </Button>
            </div>
          </div>

          <div className="zeitnus-sidebar-section">
            <h3>🔔 {t('zeitnusCooperative.dashboard.alerts')}</h3>
            <AlertList
              risk={risk}
              liquidityRatio={liquidityRatio}
              nplRatio={nplRatio}
              transparencyIndex={transparencyIndex}
              financialLiteracy={financialLiteracy}
              phase={phase}
              completedPhases={completedPhases}
            />
          </div>

          <div className="zeitnus-sidebar-section">
            <h3>📊 {t('zeitnusCooperative.dashboard.keyMetrics')}</h3>
            <KeyMetricsList
              capital={capital}
              savings={savings}
              credit={credit}
              surplus={surplus}
              totalAssets={totalAssets}
              liquidityRatio={liquidityRatio}
              nplRatio={nplRatio}
              phaseProgress={phaseProgress}
            />
          </div>

          {/* Modo monetario */}
          <div className="zeitnus-sidebar-section">
            <h3>💱 {t('zeitnusCooperative.dashboard.monetaryMode')}</h3>
            <MonetaryModeSelector />
          </div>
        </aside>
      </div>

      {/* Modales */}
      {store.ui?.showMigrationModal && (
        <MigrationModal
          onClose={() => actions.dismissMigration()}
          onMigrate={(userId) => actions.migrateV1ToV2(userId)}
        />
      )}

      {/* Toasts */}
      <div className="zeitnus-toasts" role="region" aria-live="polite">
        {store.ui?.toasts?.map((toast: any) => (
          <Toast key={toast.id} toast={toast} onClose={() => actions.removeToast(toast.id)} />
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENTES AUXILIARES
// ============================================================================

const MetricCard: React.FC<{
  title: string;
  value: string;
  icon: string;
  color: string;
  trend: 'up' | 'down' | 'neutral';
  subtitle: string;
}> = ({ title, value, icon, color, trend, subtitle }) => (
  <Card className="zeitnus-metric-card">
    <div className="zeitnus-metric-header">
      <Icon name={icon} size={24} style={{ color }} />
      <span className="zeitnus-metric-trend zeitnus-trend-{trend}">
        {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
      </span>
    </div>
    <div className="zeitnus-metric-value" style={{ color }}>{value}</div>
    <div className="zeitnus-metric-title">{title}</div>
    <div className="zeitnus-metric-subtitle">{subtitle}</div>
  </Card>
);

const PhaseCard: React.FC<{ phase: ProgressivePhase; progress: { completed: number; total: number; percentage: number } }> = ({ phase, progress }) => (
  <Card className="zeitnus-phase-card">
    <div className="zeitnus-phase-card-header">
      <Icon name={PHASE_ICONS[phase]} size={28} style={{ color: 'var(--genio)' }} />
      <div>
        <div className="zeitnus-phase-card-title">{PHASE_NAMES[phase]}</div>
        <div className="zeitnus-phase-card-progress">{progress.completed}/10 fases completadas</div>
      </div>
    </div>
    <Progress value={progress.percentage} max={100} showLabel />
    <div className="zeitnus-phase-card-status">
      {PROGRESSIVE_PHASE_ORDER.slice(0, 10).map((p, i) => (
        <span key={p} className={`zeitnus-mini-phase ${i < 10 ? (i < PROGRESSIVE_PHASE_ORDER.indexOf('fase_1_vision') ? 'completed' : 'pending') : ''}`}>
          {i + 1}
        </span>
      ))}
    </div>
  </Card>
);

const RiskCard: React.FC<{ risk: any; regimes: RegulatoryRegime[] }> = ({ risk, regimes }) => (
  <Card className="zeitnus-risk-card" style={{ borderLeft: `4px solid ${risk.level === 'critico' ? 'var(--haiti)' : risk.level === 'alto' ? 'var(--haiti)' : risk.level === 'medio' ? 'var(--acero)' : 'var(--genio)'}` }}>
    <div className="zeitnus-risk-header">
      <Badge variant={risk.level === 'critico' ? 'danger' : risk.level === 'alto' ? 'warning' : risk.level === 'medio' ? 'info' : 'success'}>
        {RISK_LEVEL_LABELS[risk.level]}
      </Badge>
      <span className="zeitnus-risk-score">{risk.overall}/100</span>
    </div>
    <div className="zeitnus-risk-breakdown">
      {[
        { key: 'crediticio', label: t('zeitnusCooperative.risk.crediticio'), color: 'var(--genio)' },
        { key: 'liquidez', label: t('zeitnusCooperative.risk.liquidez'), color: 'var(--acero)' },
        { key: 'tasaInteres', label: t('zeitnusCooperative.risk.tasaInteres'), color: 'var(--limon)' },
        { key: 'operativo', label: t('zeitnusCooperative.risk.operativo'), color: 'var(--haiti)' },
        { key: 'gobiernoCorporativo', label: t('zeitnusCooperative.risk.gobierno'), color: 'var(--genio)' },
        { key: 'fraude', label: t('zeitnusCooperative.risk.fraude'), color: 'var(--haiti)' },
        { key: 'perdidaCapital', label: t('zeitnusCooperative.risk.perdidaCapital'), color: 'var(--acero)' },
      ].map(r => (
        <div key={r.key} className="zeitnus-risk-bar">
          <span className="zeitnus-risk-label" style={{ color: r.color }}>{r.label}</span>
          <div className="zeitnus-risk-bar-track">
            <div className="zeitnus-risk-bar-fill" style={{ width: `${risk[r.key]}%`, background: r.color }}></div>
          </div>
          <span className="zeitnus-risk-value">{risk[r.key]}%</span>
        </div>
      ))}
    </div>
    <div className="zeitnus-risk-regimes">
      <small>{t('zeitnusCooperative.dashboard.regulatoryRegimes')}: {regimes.map(r => REGULATORY_REGIME_LABELS[r as RegulatoryRegime] || r).join(', ')}</small>
    </div>
    {risk.mitigations.length > 0 && (
      <div className="zeitnus-risk-mitigations">
        <strong>{t('zeitnusCooperative.risk.mitigations')}:</strong>
        <ul>{risk.mitigations.map((m, i) => <li key={i}>{m}</li>)}</ul>
      </div>
    )}
  </Card>
);

const CircularEconomyCard: React.FC<{ health: any; projects: number }> = ({ health, projects }) => (
  <Card className="zeitnus-circular-card">
    <div className="zeitnus-circular-header">
      <Icon name="Recycle" size={24} style={{ color: 'var(--genio)' }} />
      <span>{t('zeitnusCooperative.dashboard.circularEconomy')}</span>
    </div>
    <div className="zeitnus-circular-metrics">
      <div className="zeitnus-circular-metric">
        <span className="zeitnus-circular-value">{health.activeProjects}</span>
        <span className="zeitnus-circular-label">{t('zeitnusCooperative.dashboard.activeProjects')}</span>
      </div>
      <div className="zeitnus-circular-metric">
        <span className="zeitnus-circular-value">{health.completedProjects}</span>
        <span className="zeitnus-circular-label">{t('zeitnusCooperative.dashboard.completedProjects')}</span>
      </div>
      <div className="zeitnus-circular-metric">
        <span className="zeitnus-circular-value">{health.wasteRecoveryRate}%</span>
        <span className="zeitnus-circular-label">{t('zeitnusCooperative.circular.materiales')}</span>
      </div>
      <div className="zeitnus-circular-metric">
        <span className="zeitnus-circular-value">{health.netImpact >= 0 ? '+' : ''}{formatCurrency(health.netImpact)}</span>
        <span className="zeitnus-circular-label">{t('zeitnusCooperative.dashboard.netImpact')}</span>
      </div>
    </div>
  </Card>
);

const SocialCapitalCard: React.FC<{ health: any }> = ({ health }) => (
  <Card className="zeitnus-social-card">
    <div className="zeitnus-social-header">
      <Icon name="Users" size={24} style={{ color: 'var(--limon)' }} />
      <span>{t('zeitnusCooperative.dashboard.socialCapital')}</span>
    </div>
    <div className="zeitnus-social-metrics">
      <div className="zeitnus-social-metric">
        <span className="zeitnus-social-value">{health.score}%</span>
        <span className="zeitnus-social-label">{t('zeitnusCooperative.social.capacidad')}</span>
      </div>
      <div className="zeitnus-social-metric">
        <span className="zeitnus-social-value">{health.trust}%</span>
        <span className="zeitnus-social-label">{t('zeitnusCooperative.social.confianza')}</span>
      </div>
      <div className="zeitnus-social-metric">
        <span className="zeitnus-social-value">{health.collaboration}%</span>
        <span className="zeitnus-social-label">{t('zeitnusCooperative.social.cooperacion')}</span>
      </div>
    </div>
    <Badge variant={health.level === 'alto' ? 'success' : health.level === 'solido' ? 'info' : health.level === 'en_desarrollo' ? 'warning' : 'danger'}>
      {health.level}
    </Badge>
  </Card>
);

const TransparencyCard: React.FC<{ health: any }> = ({ health }) => (
  <Card className="zeitnus-transparency-card">
    <div className="zeitnus-transparency-header">
      <Icon name="Eye" size={24} style={{ color: 'var(--acero)' }} />
      <span>{t('zeitnusCooperative.dashboard.transparency')}</span>
    </div>
    <Progress value={health.index} max={100} showLabel />
    <div className="zeitnus-transparency-details">
      <span>{health.activeMechanisms}/{health.totalMechanisms} {t('zeitnusCooperative.dashboard.mechanismsActive')}</span>
      {health.gaps && <span className="zeitnus-transparency-gap">⚠ {health.gaps}</span>}
    </div>
  </Card>
);

const EducationCard: React.FC<{ health: any }> = ({ health }) => (
  <Card className="zeitnus-education-card">
    <div className="zeitnus-education-header">
      <Icon name="BookOpen" size={24} style={{ color: 'var(--genio)' }} />
      <span>{t('zeitnusCooperative.dashboard.education')}</span>
    </div>
    <Progress value={health.literacyIndex} max={100} showLabel label={t('zeitnusCooperative.education.financialLiteracy')} />
    <div className="zeitnus-education-details">
      <span>{health.activePrograms} {t('zeitnusCooperative.dashboard.activePrograms')}</span>
      <span>{health.completedPrograms} {t('zeitnusCooperative.dashboard.completedPrograms')}</span>
      <span>{health.totalParticipants} {t('zeitnusCooperative.dashboard.participants')}</span>
    </div>
  </Card>
);

const GovernanceCard: React.FC<{ governance: any }> = ({ governance }) => (
  <Card className="zeitnus-governance-card">
    <div className="zeitnus-governance-header">
      <Icon name="Gavel" size={24} style={{ color: 'var(--haiti)' }} />
      <span>{t('zeitnusCooperative.dashboard.governance')}</span>
    </div>
    <div className="zeitnus-governance-grid">
      <div className="zeitnus-gov-item">
        <Icon name="Users" size={20} />
        <span>{governance.assembly.attendanceRate}% {t('zeitnusCooperative.dashboard.assemblyAttendance')}</span>
      </div>
      <div className="zeitnus-gov-item">
        <Icon name="Shield" size={20} />
        <span>{governance.board.independentMembers}/{governance.board.members} {t('zeitnusCooperative.dashboard.independentDirectors')}</span>
      </div>
      <div className="zeitnus-gov-item">
        <Icon name="FileCheck" size={20} />
        <span>{governance.committees.audit ? t('zeitnusCooperative.dashboard.auditActive') : t('zeitnusCooperative.dashboard.auditInactive')}</span>
      </div>
      <div className="zeitnus-gov-item">
        <Icon name="Gavel" size={20} />
        <span>{governance.conflictResolution.casesResolved} {t('zeitnusCooperative.dashboard.resolvedCases')}</span>
      </div>
    </div>
  </Card>
);

const RegulatoryCard: React.FC<{ regimes: RegulatoryRegime[] }> = ({ regimes }) => (
  <Card className="zeitnus-regulatory-card">
    <div className="zeitnus-regulatory-header">
      <Icon name="Scale" size={24} style={{ color: 'var(--haiti)' }} />
      <span>{t('zeitnusCooperative.dashboard.regulatoryRegimes')}</span>
    </div>
    <div className="zeitnus-regulatory-tags">
      {regimes.map(r => (
        <Badge key={r} variant="info" className="zeitnus-regime-badge">
          {REGULATORY_REGIME_LABELS[r as RegulatoryRegime] || r}
        </Badge>
      ))}
    </div>
    <div className="zeitnus-regulatory-note">
      <small>{t('zeitnusCooperative.dashboard.regulatoryNote')}</small>
    </div>
  </Card>
);

// Gráficos (placeholders para implementación con Recharts/Chart.js)
const AssetCompositionChart: React.FC<any> = ({ capital, savings, credit, surplus }) => (
  <Card className="zeitnus-chart-card">
    <h4>{t('zeitnusCooperative.dashboard.assetComposition')}</h4>
    <div className="zeitnus-chart-placeholder">
      <Icon name="PieChart" size={48} style={{ color: 'var(--muted)', opacity: 0.5 }} />
      <p>{t('zeitnusCooperative.dashboard.chartPlaceholder')}</p>
      <small>Capital: {formatCurrency(capital)} | Ahorros: {formatCurrency(Object.values(savings).reduce((a,b)=>a+b,0))} | Cartera: {formatCurrency(credit.totalOutstanding)} | Excedentes: {formatCurrency(surplus)}</small>
    </div>
  </Card>
);

const RiskBreakdownChart: React.FC<{ risk: any }> = ({ risk }) => (
  <Card className="zeitnus-chart-card">
    <h4>{t('zeitnusCooperative.dashboard.riskBreakdown')}</h4>
    <div className="zeitnus-chart-placeholder">
      <Icon name="BarChart2" size={48} style={{ color: 'var(--muted)', opacity: 0.5 }} />
      <p>{t('zeitnusCooperative.dashboard.chartPlaceholder')}</p>
      <div className="zeitnus-risk-mini-bars">
        {[
          { key: 'crediticio', label: 'Crediticio', color: 'var(--genio)' },
          { key: 'liquidez', label: 'Liquidez', color: 'var(--acero)' },
          { key: 'tasaInteres', label: 'Tasa Interés', color: 'var(--limon)' },
          { key: 'operativo', label: 'Operativo', color: 'var(--haiti)' },
          { key: 'gobiernoCorporativo', label: 'Gobierno', color: 'var(--genio)' },
          { key: 'fraude', label: 'Fraude', color: 'var(--haiti)' },
          { key: 'perdidaCapital', label: 'Pérdida Capital', color: 'var(--acero)' },
        ].map(r => (
          <div key={r.key} className="zeitnus-mini-risk-bar">
            <span className="zeitnus-mini-risk-label">{r.label}</span>
            <div className="zeitnus-mini-risk-track">
              <div className="zeitnus-mini-risk-fill" style={{ width: '50%', background: r.color }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Card>
);

const PhaseTimeline: React.FC<{ phases: ProgressivePhase[]; currentPhase: ProgressivePhase; completed: ProgressivePhase[]; metrics: any }> = ({ phases, currentPhase, completed, metrics }) => (
  <Card className="zeitnus-chart-card">
    <h4>{t('zeitnusCooperative.dashboard.phaseTimeline')}</h4>
    <div className="zeitnus-phase-timeline">
      {phases.slice(0, 10).map((phase, index) => {
        const isCompleted = completed.includes(phase);
        const isCurrent = phase === currentPhase;
        return (
          <div key={phase} className={`zeitnus-timeline-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
            <div className="zeitnus-timeline-marker">{index + 1}</div>
            <div className="zeitnus-timeline-content">
              <div className="zeitnus-timeline-title">{PHASE_NAMES[phase]}</div>
              <div className="zeitnus-timeline-status">
                {isCompleted ? '✅ Completada' : isCurrent ? '🔄 En curso' : '⏳ Pendiente'}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </Card>
);

const CircularProjectsChart: React.FC<{ projects: any[]; metrics: any }> = ({ projects, metrics }) => (
  <Card className="zeitnus-chart-card">
    <h4>{t('zeitnusCooperative.dashboard.circularProjects')}</h4>
    <div className="zeitnus-chart-placeholder">
      <Icon name="Recycle" size={48} style={{ color: 'var(--muted)', opacity: 0.5 }} />
      <p>{t('zeitnusCooperative.dashboard.chartPlaceholder')}</p>
      <div className="zeitnus-projects-list">
        {projects.slice(0, 5).map(p => (
          <div key={p.id} className="zeitnus-project-item">
            <span className="zeitnus-project-name">{p.name}</span>
            <span className="zeitnus-project-status">{p.status}</span>
            <span className="zeitnus-project-type">{p.type}</span>
          </div>
        ))}
      </div>
    </div>
  </Card>
);

// Componentes de lista y alertas
const AlertList: React.FC<{
  risk: any;
  liquidityRatio: number;
  nplRatio: number;
  transparencyIndex: number;
  financialLiteracy: number;
  phase: ProgressivePhase;
  completedPhases: ProgressivePhase[];
}> = ({ risk, liquidityRatio, nplRatio, transparencyIndex, financialLiteracy, phase, completedPhases }) => {
  const alerts: { type: 'danger' | 'warning' | 'info' | 'success'; message: string }[] = [];

  if (risk.level === 'critico' || risk.level === 'alto') {
    alerts.push({ type: 'danger', message: `Riesgo ${risk.level}: ${risk.overall}/100 - Requiere atención inmediata` });
  }
  if (liquidityRatio < 0.5) {
    alerts.push({ type: 'warning', message: `Liquidez baja: ${(liquidityRatio * 100).toFixed(1)}% - Reforzar reservas` });
  }
  if (nplRatio > 0.08) {
    alerts.push({ type: 'warning', message: `NPL alto: ${(nplRatio * 100).toFixed(2)}% - Revisar cartera` });
  }
  if (transparencyIndex < 60) {
    alerts.push({ type: 'info', message: `Transparencia: ${transparencyIndex}% - Añadir más mecanismos` });
  }
  if (financialLiteracy < 50) {
    alerts.push({ type: 'info', message: `Alfabetización financiera: ${financialLiteracy}% - Priorizar educación` });
  }
  if (completedPhases.length === 0) {
    alerts.push({ type: 'info', message: 'Comenzar Fase 1: Definir visión y metas' });
  }

  if (alerts.length === 0) {
    return <div className="zeitnus-no-alerts">✅ {t('zeitnusCooperative.dashboard.noAlerts')}</div>;
  }

  return (
    <div className="zeitnus-alert-list">
      {alerts.map((alert, i) => (
        <div key={i} className={`zeitnus-alert zeitnus-alert-${alert.type}`}>
          <Icon name={alert.type === 'danger' ? 'AlertCircle' : alert.type === 'warning' ? 'AlertTriangle' : alert.type === 'info' ? 'Info' : 'CheckCircle'} size={16} />
          <span>{alert.message}</span>
        </div>
      ))}
    </div>
  );
};

const KeyMetricsList: React.FC<{
  capital: number;
  savings: any;
  credit: any;
  surplus: number;
  totalAssets: number;
  liquidityRatio: number;
  nplRatio: number;
  phaseProgress: any;
}> = ({ capital, savings, credit, surplus, totalAssets, liquidityRatio, nplRatio, phaseProgress }) => (
  <ul className="zeitnus-key-metrics">
    <li><strong>{t('zeitnusCooperative.dashboard.totalAssets')}:</strong> {formatCurrency(totalAssets)}</li>
    <li><strong>{t('zeitnusCooperative.dashboard.capital')}</strong> {formatCurrency(capital)}</li>
    <li><strong>{t('zeitnusCooperative.dashboard.savings')}:</strong> {formatCurrency(Object.values(savings).reduce((a,b)=>a+b,0))}</li>
    <li><strong>{t('zeitnusCooperative.dashboard.creditPortfolio')}:</strong> {formatCurrency(credit.totalOutstanding)}</li>
    <li><strong>{t('zeitnusCooperative.dashboard.surplus')}:</strong> {formatCurrency(surplus)}</li>
    <li><strong>{t('zeitnusCooperative.dashboard.liquidity')}:</strong> {(liquidityRatio * 100).toFixed(1)}%</li>
    <li><strong>{t('zeitnusCooperative.dashboard.npl')}:</strong> {(nplRatio * 100).toFixed(2)}%</li>
    <li><strong>{t('zeitnusCooperative.dashboard.phaseProgress')}:</strong> {phaseProgress.percentage}%</li>
  </ul>
);

const MonetaryModeSelector: React.FC = () => {
  const mode = useZeitnusCooperativeStore(s => s.monetaryMode || 'postmonetario');
  const setMode = useZeitnusCooperativeStore(s => s.setMonetaryMode);
  const priceParity = useZeitnusCooperativeStore(s => s.priceParity || 1);

  return (
    <div className="zeitnus-mode-selector">
      <label>
        <input type="radio" name="monetary-mode" value="postmonetario" checked={mode === 'postmonetario'} onChange={() => setMode('postmonetario')} />
        <span>🌿 {t('zeitnusCooperative.modes.postmonetario')}</span>
      </label>
      <label>
        <input type="radio" name="monetary-mode" value="conectado" checked={mode === 'conectado'} onChange={() => setMode('conectado')} />
        <span>💰 {t('zeitnusCooperative.modes.conectado')}</span>
      </label>
      {mode === 'conectado' && (
        <div className="zeitnus-price-parity">
          <label>{t('zeitnusCooperative.priceParity')}: </label>
          <input type="number" step="0.0001" value={priceParity} onChange={(e) => useZeitnusCooperativeStore.getState().setPriceParity(parseFloat(e.target.value))} />
          <small>USD/ZNU</small>
        </div>
      )}
    </div>
  );
};

const MigrationModal: React.FC<{ onClose: () => void; onMigrate: (userId: string) => Promise<boolean> }> = ({ onClose, onMigrate }) => {
  const [userId, setUserId] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleMigrate = async () => {
    if (!userId.trim()) return;
    setLoading(true);
    setError('');
    try {
      const success = await onMigrate(userId.trim());
      if (success) onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error en migración');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="zeitnus-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="migration-title">
      <div className="zeitnus-modal" onClick={e => e.stopPropagation()}>
        <header>
          <h2 id="migration-title">🔄 {t('zeitnusCooperative.migration.title')}</h2>
          <button className="zeitnus-modal-close" onClick={onClose} aria-label="Cerrar">×</button>
        </header>
        <div className="zeitnus-modal-body">
          <p>{t('zeitnusCooperative.migration.desc')}</p>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder={t('zeitnusCooperative.migration.userId')}
            className="zeitnus-input"
          />
          {error && <p className="zeitnus-error">{error}</p>}
          <p className="zeitnus-hint">{t('zeitnusCooperative.migration.dismissHint')} <button onClick={onClose}>{t('zeitnusCooperative.migration.dismiss')}</button></p>
        </div>
        <footer>
          <button className="zeitnus-btn secondary" onClick={onClose}>{t('zeitnusCooperative.migration.cancel')}</button>
          <button className="zeitnus-btn primary" onClick={handleMigrate} disabled={loading || !userId.trim()}>
            {loading ? t('zeitnusCooperative.migration.running') : t('zeitnusCooperative.migration.migrate')}
          </button>
        </footer>
      </div>
    </div>
  );
};

const Toast: React.FC<{ toast: any; onClose: (id: string) => void }> = ({ toast, onClose }) => (
  <div className={`zeitnus-toast ${toast.type}`} role="alert">
    <div className="zeitnus-toast-content">
      <span className="zeitnus-toast-title">{toast.title}</span>
      <span className="zeitnus-toast-message">{toast.message}</span>
    </div>
    <button className="zeitnus-toast-close" onClick={() => onClose(toast.id)} aria-label="Cerrar">×</button>
  </div>
);

// ============================================================================
// UTILIDADES Y CONSTANTES LOCALES
// ============================================================================

function formatCurrency(value: number): string {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

function calculateAssetTrend(): 'up' | 'down' | 'neutral' {
  // Placeholder - en implementación real compararía con periodo anterior
  return 'neutral';
}

function getNextIncompletePhase(): ProgressivePhase {
  const completed = useZeitnusCooperativeStore.getState().phaseCompleted;
  for (const phase of PROGRESSIVE_PHASE_ORDER.slice(0, 10)) {
    if (!completed.includes(phase)) return phase;
  }
  return 'fase_1_vision';
}

const PHASE_ICONS: Record<ProgressivePhase, string> = {
  fase_1_vision: 'Target',
  fase_2_comunidad: 'Users',
  fase_3_necesidades: 'Search',
  fase_4_viabilidad: 'BarChart2',
  fase_5_estructura: 'Building2',
  fase_6_gobierno: 'Gavel',
  fase_7_transparencia: 'Eye',
  fase_8_proyectos: 'Factory',
  fase_9_evaluar_financiera: 'Banknote',
  fase_10_escalar: 'TrendingUp',
  completa: 'CheckCircle',
};

const REGULATORY_REGIME_LABELS: Record<string, string> = {
  infocoop_fomento: 'INFOCOOP - Fomento',
  sugef_supervision: 'SUGEF - Supervisión',
  conassif_normas: 'CONASSIF - Normas',
  banco_central_entorno: 'Banco Central - Entorno',
  sugeval_valores: 'SUGEVAL - Valores',
  ninguno: 'Sin régimen financiero',
  mixto: 'Múltiples regímenes',
};

const RISK_LEVEL_LABELS: Record<string, string> = {
  bajo: '🟢 Bajo',
  medio: '🟡 Medio',
  alto: '🟠 Alto',
  critico: '🔴 Crítico',
};

const REGULATORY_REGIME_LABELS_FULL: Record<RegulatoryRegime, string> = {
  infocoop_fomento: 'INFOCOOP - Fomento/Promoción/Educación',
  sugef_supervision: 'SUGEF - Supervisión Prudencial',
  conassif_normas: 'CONASSIF - Normas Sistema Financiero',
  banco_central_entorno: 'Banco Central - Entorno Macro',
  sugeval_valores: 'SUGEVAL - Mercado de Valores',
  ninguno: 'Sin régimen financiero (actividad no financiera)',
  mixto: 'Múltiples regímenes',
};

const PROGRESSIVE_PHASE_ORDER = [
  'fase_1_vision',
  'fase_2_comunidad',
  'fase_3_necesidades',
  'fase_4_viabilidad',
  'fase_5_estructura',
  'fase_6_gobierno',
  'fase_7_transparencia',
  'fase_8_proyectos',
  'fase_9_evaluar_financiera',
  'fase_10_escalar',
  'completa',
];

const PHASE_NAMES: Record<ProgressivePhase, string> = {
  'fase_1_vision': 'Definir Visión Económica y Social',
  'fase_2_comunidad': 'Construir Comunidad Informada',
  'fase_3_necesidades': 'Identificar Necesidades Reales',
  'fase_4_viabilidad': 'Estudio de Viabilidad',
  'fase_5_estructura': 'Elegir Estructura Adecuada',
  'fase_6_gobierno': 'Diseñar Modelo de Gobierno',
  'fase_7_transparencia': 'Crear Sistemas de Transparencia',
  'fase_8_proyectos': 'Desarrollar Proyectos Económicos Reales',
  'fase_9_evaluar_financiera': 'Evaluar Estructura Financiera',
  'fase_10_escalar': 'Escalar de Forma Responsable',
  'completa': 'Completa',
};

const PHASE_LABELS: Record<ProgressivePhase, string> = {
  fase_1_vision: '1️⃣ Visión',
  fase_2_comunidad: '2️⃣ Comunidad',
  fase_3_necesidades: '3️⃣ Necesidades',
  fase_4_viabilidad: '4️⃣ Viabilidad',
  fase_5_estructura: '5️⃣ Estructura',
  fase_6_gobierno: '6️⃣ Gobierno',
  fase_7_transparencia: '7️⃣ Transparencia',
  fase_8_proyectos: '8️⃣ Proyectos',
  fase_9_evaluar_financiera: '9️⃣ Evaluar Financiera',
  fase_10_escalar: '🔟 Escalar',
  completa: '✅ Completa',
};

const RISK_LEVEL_LABELS_FULL: Record<string, string> = {
  bajo: '🟢 Bajo',
  medio: '🟡 Medio',
  alto: '🟠 Alto',
  critico: '🔴 Crítico',
};

export default ZeitnusCooperativeDashboard;