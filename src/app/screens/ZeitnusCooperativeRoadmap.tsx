// ZeitnusCooperativeRoadmap.tsx — Pantalla de Roadmap 10 Fases ZEITNUS
// Principio Anfibio: roadmap progresivo con gates de validación

import React, { useState, useMemo } from 'react';
import { useZeitnusCooperativeStore } from '@core/state/hooks/zeitnus-cooperative';
import { designProgressiveModel } from '@core/lib/zeitnus-cooperative';
import { Icon } from '@core/ui/Icon';
import { Button } from '@core/ui/Button';
import { Card } from '@core/ui/Card';
import { Progress } from '@core/ui/Progress';
import { Badge } from '@core/ui/Badge';
import { Tabs } from '@core/ui/Tabs';
import { Tooltip } from '@core/ui/Tooltip';
import { t } from '@core/lib/i18n';

export const ZeitnusCooperativeRoadmap: React.FC = () => {
  const store = useZeitnusCooperativeStore();
  const phase = store.progressivePhase;
  const completedPhases = store.phaseCompleted;
  const phaseMetrics = store.phaseMetrics;
  const circularProjects = store.circularProjects;
  const circularMetrics = store.circularMetrics;
  const socialCapital = store.socialCapital;
  const transparencyIndex = store.transparencyIndex;
  const actions = store;

  const roadmap = useMemo(() => designProgressiveModel({
    vision: store.name || 'ZEITNUS Cooperative',
    targetCommunity: 'Comunidad ZEITNUS',
    initialCapital: store.cooperativeCapital,
    hasLegalAdvice: false,
    hasAccounting: false,
    hasTechTeam: false,
    targetActivities: [],
  }), [store.name, store.cooperativeCapital]);

  const [activeView, setActiveView] = useState<'timeline' | 'detail' | 'metrics' | 'gates'>('timeline');
  const [selectedPhase, setSelectedPhase] = useState<ProgressivePhase | null>(null);

  const totalPhases = 10;
  const completedCount = completedPhases.filter(p => p !== 'completa').length;
  const overallProgress = (completedCount / 10) * 100;

  return (
    <div className="zeitnus-roadmap-screen">
      <header className="zeitnus-roadmap-header">
        <div className="zeitnus-roadmap-title">
          <Icon name="Map" size={28} style={{ color: 'var(--genio)' }} />
          <h1>{t('zeitnusCooperative.roadmap.title')}</h1>
        </div>
        <div className="zeitnus-roadmap-progress">
          <Progress value={overallProgress} max={100} showLabel label={t('zeitnusCooperative.roadmap.overallProgress')} />
          <div className="zeitnus-roadmap-stats">
            <span>{completedCount}/10 {t('zeitnusCooperative.roadmap.phasesCompleted')}</span>
            <span>{t('zeitnusCooperative.roadmap.currentPhase')}: {PHASE_NAMES[phase]}</span>
          </div>
        </div>
      </header>

      <div className="zeitnus-roadmap-layout">
        {/* Sidebar: Vista general de fases */}
        <aside className="zeitnus-roadmap-sidebar">
          <nav className="zeitnus-roadmap-phases" aria-label="Fases del roadmap">
            {PROGRESSIVE_PHASE_ORDER.slice(0, 10).map((phaseKey, index) => {
              const isCompleted = completedPhases.includes(phaseKey);
              const isCurrent = phase === phaseKey;
              const metrics = phaseMetrics[phaseKey];
              const gatePassed = metrics?.gatePassed;
              const timeline = roadmap.estimatedTimeline[phaseKey];
              const gates = roadmap.gates[phaseKey];

              return (
                <button
                  key={phaseKey}
                  className={`zeitnus-roadmap-phase ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${!gatePassed && !isCompleted ? 'locked' : ''}`}
                  onClick={() => (gatePassed || isCompleted) ? setSelectedPhase(phaseKey) : undefined}
                  disabled={!gatePassed && !isCompleted}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-disabled={!gatePassed && !isCompleted}
                >
                  <div className="zeitnus-roadmap-phase-header">
                    <span className="zeitnus-roadmap-phase-number">{index + 1}</span>
                    <span className="zeitnus-roadmap-phase-title">{PHASE_LABELS[phaseKey]}</span>
                    {isCompleted && <Badge variant="success">✓</Badge>}
                    {gatePassed && !isCompleted && <Badge variant="info">{t('zeitnusCooperative.roadmap.gatePassed')}</Badge>}
                    {!gatePassed && !isCompleted && <span className="zeitnus-phase-lock">🔒</span>}
                  </div>
                  <div className="zeitnus-roadmap-phase-meta">
                    <span className="zeitnus-phase-duration">{timeline.minMonths}-{timeline.maxMonths} {t('zeitnusCooperative.roadmap.months')}</span>
                    {gatePassed && <span className="zeitnus-gate-status">🔓 {t('zeitnusCooperative.roadmap.gateUnlocked')}</span>}
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="zeitnus-roadmap-summary">
            <div className="zeitnus-summary-stat">
              <span className="zeitnus-summary-value">{overallProgress.toFixed(0)}%</span>
              <span className="zeitnus-summary-label">{t('zeitnusCooperative.roadmap.overallProgress')}</span>
            </div>
            <div className="zeitnus-summary-stat">
              <span className="zeitnus-summary-value">{roadmap.estimatedTotalMonths}</span>
              <span className="zeitnus-summary-label">{t('zeitnusCooperative.roadmap.estimatedMonths')}</span>
            </div>
            <div className="zeitnus-summary-stat">
              <span className="zeitnus-summary-value">{roadmap.phases.indexOf(phase) + 1}</span>
              <span className="zeitnus-summary-label">{t('zeitnusCooperative.roadmap.currentPhaseNum')}</span>
            </div>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="zeitnus-roadmap-main" role="main">
          <Tabs value={activeView} onChange={setActiveView} className="zeitnus-roadmap-tabs">
            <Tabs.List>
              <Tabs.Trigger value="timeline">📅 {t('zeitnusCooperative.roadmap.timeline')}</Tabs.Trigger>
              <Tabs.Trigger value="detail">🔍 {t('zeitnusCooperative.roadmap.detail')}</Tabs.Trigger>
              <Tabs.Trigger value="metrics">📊 {t('zeitnusCooperative.roadmap.metrics')}</Tabs.Trigger>
              <Tabs.Trigger value="gates">🔓 {t('zeitnusCooperative.roadmap.gates')}</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="timeline">
              <TimelineView phases={PROGRESSIVE_PHASE_ORDER.slice(0, 10)} currentPhase={phase} completedPhases={completedPhases} phaseMetrics={phaseMetrics} roadmap={roadmap} onSelectPhase={setSelectedPhase} />
            </Tabs.Content>

            <Tabs.Content value="detail">
              {selectedPhase ? (
                <DetailView phase={selectedPhase} metrics={phaseMetrics[selectedPhase]} roadmap={roadmap} actions={store} />
              ) : (
                <div className="zeitnus-empty-detail">
                  <Icon name="MousePointer2" size={48} style={{ color: 'var(--muted)', opacity: 0.5 }} />
                  <h3>{t('zeitnusCooperative.roadmap.selectPhase')}</h3>
                  <p>{t('zeitnusCooperative.roadmap.selectPhaseDesc')}</p>
                </div>
              )}
            </Tabs.Content>

            <Tabs.Content value="metrics">
              <MetricsView phaseMetrics={phaseMetrics} circularMetrics={store.circularMetrics} socialCapital={store.socialCapital} transparencyIndex={store.transparencyIndex} financialLiteracy={store.financialLiteracyIndex} />
            </Tabs.Content>

            <Tabs.Content value="gates">
              <GatesView phaseMetrics={phaseMetrics} roadmap={roadmap} completedPhases={completedPhases} />
            </Tabs.Content>
          </Tabs>
        </main>

        {/* Sidebar derecho: Acciones y siguiente fase */}
        <aside className="zeitnus-roadmap-sidebar-right">
          <div className="zeitnus-roadmap-next-phase">
            <h3>➡️ {t('zeitnusCooperative.roadmap.nextSteps')}</h3>
            <NextPhaseCard phase={phase} completedPhases={completedPhases} phaseMetrics={phaseMetrics} roadmap={roadmap} actions={store} />
          </div>

          <div className="zeitnus-roadmap-actions">
            <h3>⚡ {t('zeitnusCooperative.roadmap.quickActions')}</h3>
            <div className="zeitnus-quick-actions">
              <Button variant="primary" onClick={() => actions.setProgressivePhase(getNextIncompletePhase())} className="zeitnus-action-btn">
                ➡️ {t('zeitnusCooperative.roadmap.advancePhase')}
              </Button>
              <Button variant="secondary" onClick={() => { /* crear proyecto */ }} className="zeitnus-action-btn">
                ➕ {t('zeitnusCooperative.roadmap.addProject')}
              </Button>
              <Button variant="secondary" onClick={() => { /* añadir mecanismo transparencia */ }} className="zeitnus-action-btn">
                🔍 {t('zeitnusCooperative.roadmap.addTransparency')}
              </Button>
              <Button variant="ghost" onClick={() => store.saveToStorage()} className="zeitnus-action-btn">
                💾 {t('zeitnusCooperative.roadmap.save')}
              </Button>
            </div>
          </div>

          <div className="zeitnus-roadmap-milestones">
            <h3>🎯 {t('zeitnusCooperative.roadmap.milestones')}</h3>
            <MilestoneList completedPhases={completedPhases} phaseMetrics={phaseMetrics} />
          </div>
        </aside>
      </div>
    </div>
  );
};

// ============================================================================
// SUB-COMPONENTES
// ============================================================================

const TimelineView: React.FC<{
  phases: ProgressivePhase[];
  currentPhase: ProgressivePhase;
  completedPhases: ProgressivePhase[];
  phaseMetrics: any;
  roadmap: any;
  onSelectPhase: (phase: ProgressivePhase) => void;
}> = ({ phases, currentPhase, completedPhases, phaseMetrics, roadmap, onSelectPhase }) => (
  <div className="zeitnus-timeline-view">
    <div className="zeitnus-timeline-header">
      <h3>📅 {t('zeitnusCooperative.roadmap.timeline')}</h3>
      <p>{t('zeitnusCooperative.roadmap.timelineDesc')}</p>
    </div>

    <div className="zeitnus-timeline">
      {phases.slice(0, 10).map((phaseKey, index) => {
        const isCompleted = completedPhases.includes(phaseKey);
        const isCurrent = phaseKey === phase;
        const metrics = phaseMetrics[phaseKey];
        const gatePassed = metrics?.gatePassed;
        const timeline = roadmap.estimatedTimeline[phaseKey];
        const gates = roadmap.gates[phaseKey];

        return (
          <div key={phaseKey} className={`zeitnus-timeline-item ${isCompleted ? 'completed' : ''} ${phaseKey === phase ? 'current' : ''} ${!gatePassed && !isCompleted ? 'locked' : ''}`} onClick={() => (gatePassed || isCompleted) ? onSelectPhase(phaseKey) : undefined}>
            <div className="zeitnus-timeline-marker">
              <span className="zeitnus-timeline-number">{index + 1}</span>
              {isCompleted && <span className="zeitnus-timeline-check">✓</span>}
              {gatePassed && !isCompleted && <span className="zeitnus-timeline-unlocked">🔓</span>}
              {!gatePassed && !isCompleted && <span className="zeitnus-timeline-locked">🔒</span>}
            </div>
            <div className="zeitnus-timeline-content">
              <div className="zeitnus-timeline-header">
                <span className="zeitnus-timeline-phase-label">{PHASE_LABELS[phaseKey]}</span>
                <span className="zeitnus-timeline-phase-name">{PHASE_NAMES[phaseKey]}</span>
              </div>
              <div className="zeitnus-timeline-meta">
                <span className="zeitnus-timeline-duration">⏱ {roadmap.estimatedTimeline[phaseKey].minMonths}-{roadmap.estimatedTimeline[phaseKey].maxMonths} {t('zeitnusCooperative.roadmap.months')}</span>
                {gatePassed && <span className="zeitnus-gate-badge">🔓 {t('zeitnusCooperative.roadmap.gatePassed')}</span>}
              </div>
              <div className="zeitnus-timeline-progress">
                <Progress value={gatePassed ? 100 : isCurrent ? 50 : 0} max={100} showLabel />
              </div>
              <div className="zeitnus-timeline-gates">
                <strong>{t('zeitnusCooperative.roadmap.gateCriteria')}:</strong>
                <ul>
                  {roadmap.gates[phaseKey].criteria.map((criterion, i) => (
                    <li key={i}>{criterion}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const DetailView: React.FC<{ phase: ProgressivePhase; metrics: any; roadmap: any; actions: any }> = ({ phase, metrics, roadmap, actions }) => {
  const gate = roadmap.gates[phase];
  const timeline = roadmap.estimatedTimeline[phase];
  const isCompleted = metrics?.gatePassed;

  return (
    <div className="zeitnus-detail-view">
      <div className="zeitnus-detail-header">
        <div className="zeitnus-detail-phase-info">
          <span className="zeitnus-detail-phase-label">{PHASE_LABELS[phase]}</span>
          <h2>{PHASE_NAMES[phase]}</h2>
          <div className="zeitnus-detail-phase-meta">
            <span className="zeitnus-detail-duration">⏱ {timeline.minMonths}-{timeline.maxMonths} {t('zeitnusCooperative.roadmap.months')}</span>
            <Badge variant={isCompleted ? 'success' : 'info'}>{isCompleted ? t('zeitnusCooperative.roadmap.completed') : t('zeitnusCooperative.roadmap.inProgress')}</Badge>
          </div>
        </div>
        <div className="zeitnus-detail-actions">
          {metrics?.gatePassed ? (
            <Button variant="ghost" onClick={() => { /* reabrir fase */ }}>
              🔄 {t('zeitnusCooperative.roadmap.reopenPhase')}
            </Button>
          ) : (
            <Button variant="primary" onClick={() => { /* completar fase */ }}>
              ✅ {t('zeitnusCooperative.roadmap.completePhase')}
            </Button>
          )}
        </div>
      </div>

      <div className="zeitnus-detail-content">
        <Card className="zeitnus-detail-card">
          <h4>📋 {t('zeitnusCooperative.roadmap.gateCriteria')}</h4>
          <ul className="zeitnus-gate-criteria">
            {gate.criteria.map((criterion, i) => (
              <li key={i}>
                <input type="checkbox" readOnly checked={metrics?.gatePassed} />
                <span>{criterion}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="zeitnus-detail-card">
          <h4>⏱ {t('zeitnusCooperative.roadmap.timeline')}</h4>
          <div className="zeitnus-timeline-info">
            <div className="zeitnus-timeline-item">
              <strong>{t('zeitnusCooperative.roadmap.minDuration')}: </strong>
              <span>{timeline.minMonths} {t('zeitnusCooperative.roadmap.months')}</span>
            </div>
            <div className="zeitnus-timeline-item">
              <strong>{t('zeitnusCooperative.roadmap.maxDuration')}: </strong>
              <span>{timeline.maxMonths} {t('zeitnusCooperative.roadmap.months')}</span>
            </div>
            <div className="zeitnus-timeline-item">
              <strong>{t('zeitnusCooperative.roadmap.required')}: </strong>
              <span>{gate.required ? t('zeitnusCooperative.roadmap.yes') : t('zeitnusCooperative.roadmap.no')}</span>
            </div>
          </div>
        </Card>

        <Card className="zeitnus-detail-card-full">
          <h4>📝 {t('zeitnusCooperative.roadmap.phaseDescription')}</h4>
          <p>{PHASE_DESCRIPTIONS[phase]}</p>
        </Card>

        {metrics?.startedAt && (
          <Card className="zeitnus-detail-card-full">
            <h4>📊 {t('zeitnusCooperative.roadmap.phaseMetrics')}</h4>
            <div className="zeitnus-metrics-display">
              {metrics.startedAt && <div><strong>{t('zeitnusCooperative.roadmap.startedAt')}: </strong>{new Date(metrics.startedAt).toLocaleDateString()}</div>}
              {metrics.completedAt && <div><strong>{t('zeitnusCooperative.roadmap.completedAt')}: </strong>{new Date(metrics.completedAt).toLocaleDateString()}</div>}
              {metrics.indicators && Object.entries(metrics.indicators).map(([key, value]) => (
                <div key={key}><strong>{key}: </strong>{value}</div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

const MetricsView: React.FC<{ phaseMetrics: any; circularMetrics: any; socialCapital: any; transparencyIndex: number; financialLiteracy: number }> = ({ phaseMetrics, circularMetrics, socialCapital, transparencyIndex, financialLiteracy }) => (
  <div className="zeitnus-metrics-view">
    <h3>📊 {t('zeitnusCooperative.roadmap.globalMetrics')}</h3>

    <div className="zeitnus-metrics-grid">
      <MetricCard title={t('zeitnusCooperative.roadmap.overallProgress')} value={`${Object.values(phaseMetrics).filter(m => m.gatePassed).length}/10`} icon="Target" color="var(--genio)" subtitle={t('zeitnusCooperative.roadmap.phasesCompleted')} />
      <MetricCard title={t('zeitnusCooperative.roadmap.transparencyIndex')} value={`${transparencyIndex}%`} icon="Eye" color="var(--acero)" subtitle={t('zeitnusCooperative.roadmap.transparencyScore')} />
      <MetricCard title={t('zeitnusCooperative.roadmap.financialLiteracy')} value={`${financialLiteracy}%`} icon="BookOpen" color="var(--genio)" subtitle={t('zeitnusCooperative.roadmap.literacyScore')} />
      <MetricCard title={t('zeitnusCooperative.roadmap.socialCapital')} value={`${socialCapital.overall}%`} icon="Users" color="var(--limon)" subtitle={t('zeitnusCooperative.roadmap.socialCapitalScore')} />
      <MetricCard title={t('zeitnusCooperative.roadmap.circularProjects')} value={circularMetrics.proyectosDesarrollados} icon="Recycle" color="var(--genio)" subtitle={t('zeitnusCooperative.roadmap.projectsCompleted')} />
      <MetricCard title={t('zeitnusCooperative.roadmap.circularImpact')} value={`${circularMetrics.materialesReutilizados}%`} icon="Recycle" color="var(--genio)" subtitle={t('zeitnusCooperative.roadmap.materialsReused')} />
      <MetricCard title={t('zeitnusCooperative.roadmap.jobsCreated')} value={circularMetrics.empleosGenerados} icon="Users" color="var(--limon)" subtitle={t('zeitnusCooperative.roadmap.jobsGenerated')} />
      <MetricCard title={t('zeitnusCooperative.roadmap.netEconomicImpact')} value={`${circularMetrics.impactoEconomico >= 0 ? '+' : ''}${circularMetrics.impactoEconomico}`} icon="TrendingUp" color={circularMetrics.impactoEconomico >= 0 ? 'var(--limon)' : 'var(--haiti)'} subtitle={t('zeitnusCooperative.roadmap.economicImpact')} />
    </div>

    <div className="zeitnus-phase-metrics-detail">
      <h4>📈 {t('zeitnusCooperative.roadmap.phaseMetricsDetail')}</h4>
      <div className="zeitnus-phase-metrics-grid">
        {PROGRESSIVE_PHASE_ORDER.slice(0, 10).map((phaseKey, index) => {
          const metrics = phaseMetrics[phaseKey];
          return (
            <Card key={phaseKey} className="zeitnus-phase-metric-card">
              <div className="zeitnus-phase-metric-header">
                <span className="zeitnus-phase-metric-label">{PHASE_LABELS[phaseKey]}</span>
                <Badge variant={metrics?.gatePassed ? 'success' : 'secondary'}>{metrics?.gatePassed ? '✓' : '○'}</Badge>
              </div>
              {metrics?.startedAt && <div><strong>{t('zeitnusCooperative.roadmap.started')}: </strong>{new Date(metrics.startedAt).toLocaleDateString()}</div>}
              {metrics?.completedAt && <div><strong>{t('zeitnusCooperative.roadmap.completed')}: </strong>{new Date(metrics.completedAt).toLocaleDateString()}</div>}
              {metrics?.indicators && Object.entries(metrics.indicators).map(([key, value]) => (
                <div key={key}><strong>{key}: </strong>{value}</div>
              ))}
            </Card>
          );
        })}
      </div>
    </div>
  </div>
);

const GatesView: React.FC<{ phaseMetrics: any; roadmap: any; completedPhases: ProgressivePhase[] }> = ({ phaseMetrics, roadmap, completedPhases }) => (
  <div className="zeitnus-gates-view">
    <h3>🔓 {t('zeitnusCooperative.roadmap.gatesOverview')}</h3>

    <div className="zeitnus-gates-grid">
      {PROGRESSIVE_PHASE_ORDER.slice(0, 10).map((phaseKey, index) => {
        const metrics = phaseMetrics[phaseKey];
        const gate = roadmap.gates[phaseKey];
        const isCompleted = completedPhases.includes(phaseKey);
        const gatePassed = metrics?.gatePassed;

        return (
          <Card key={phaseKey} className={`zeitnus-gate-card ${gatePassed ? 'passed' : ''} ${isCompleted ? 'completed' : ''}`}>
            <div className="zeitnus-gate-header">
              <span className="zeitnus-gate-phase-label">{PHASE_LABELS[phaseKey]}</span>
              <Badge variant={gatePassed ? 'success' : isCompleted ? 'success' : 'secondary'}>{gatePassed ? '✅' : isCompleted ? '✅' : '⏳'}</Badge>
            </div>
            <div className="zeitnus-gate-criteria">
              {gate.criteria.map((criterion, i) => (
                <div key={i} className="zeitnus-gate-criterion">
                  <input type="checkbox" readOnly checked={gatePassed} />
                  <span>{criterion}</span>
                </div>
              ))}
            </div>
            <div className="zeitnus-gate-status">
              <span className={`zeitnus-gate-status-badge ${gatePassed ? 'passed' : 'pending'}`}>
                {gatePassed ? '✅ PASSED' : '⏳ PENDING'}
              </span>
              <span className="zeitnus-gate-required">{gate.required ? '🔴 REQUIRED' : '⚪ OPTIONAL'}</span>
            </div>
          </Card>
        );
      })}
    </div>
  </div>
);

// Componentes auxiliares
const MetricCard: React.FC<{ title: string; value: string; icon: string; color: string; subtitle: string }> = ({ title, value, icon, color, subtitle }) => (
  <Card className="zeitnus-metric-card">
    <div className="zeitnus-metric-header">
      <Icon name={icon} size={24} style={{ color }} />
    </div>
    <div className="zeitnus-metric-value" style={{ color }}>{value}</div>
    <div className="zeitnus-metric-title">{title}</div>
    <div className="zeitnus-metric-subtitle">{subtitle}</div>
  </Card>
);

const NextPhaseCard: React.FC<{ phase: ProgressivePhase; completedPhases: ProgressivePhase[]; phaseMetrics: any; roadmap: any; actions: any }> = ({ phase, completedPhases, phaseMetrics, roadmap, actions }) => {
  const nextPhase = PROGRESSIVE_PHASE_ORDER.slice(0, 10).find(p => !completedPhases.includes(p));
  const gate = nextPhase ? roadmap.gates[nextPhase] : null;
  const metrics = nextPhase ? phaseMetrics[nextPhase] : null;
  const timeline = nextPhase ? roadmap.estimatedTimeline[nextPhase] : null;

  if (!nextPhase) {
    return (
      <Card className="zeitnus-complete-card">
        <h4>🎉 {t('zeitnusCooperative.roadmap.allPhasesComplete')}</h4>
        <p>{t('zeitnusCooperative.roadmap.allCompleteDesc')}</p>
        <Badge variant="success">🎉 {t('zeitnusCooperative.roadmap.journeyComplete')}</Badge>
      </Card>
    );
  }

  return (
    <Card className="zeitnus-next-phase-card">
      <div className="zeitnus-next-phase-header">
        <span className="zeitnus-next-phase-label">{PHASE_LABELS[nextPhase]}</span>
        <h4>{PHASE_NAMES[nextPhase]}</h4>
      </div>
      <div className="zeitnus-next-phase-meta">
        <span>⏱ {timeline?.minMonths}-{timeline?.maxMonths} {t('zeitnusCooperative.roadmap.months')}</span>
        <Badge variant="info">{gate?.required ? t('zeitnusCooperative.roadmap.required') : t('zeitnusCooperative.roadmap.optional')}</Badge>
      </div>
      <div className="zeitnus-next-phase-criteria">
        <strong>{t('zeitnusCooperative.roadmap.gateCriteria')}:</strong>
        <ul>{gate?.criteria.map((c, i) => <li key={i}>{c}</li>)}</ul>
      </div>
      <Button variant="primary" onClick={() => actions.setProgressivePhase(nextPhase)} className="zeitnus-advance-btn">
        ➡️ {t('zeitnusCooperative.roadmap.advanceTo')} {PHASE_NAMES[nextPhase]}
      </Button>
    </Card>
  );
};

const MilestoneList: React.FC<{ completedPhases: ProgressivePhase[]; phaseMetrics: any }> = ({ completedPhases, phaseMetrics }) => (
  <ul className="zeitnus-milestone-list">
    {completedPhases.filter(p => p !== 'completa').map((phaseKey, index) => {
      const metrics = phaseMetrics[phaseKey];
      return (
        <li key={phaseKey} className="zeitnus-milestone-item">
          <span className="zeitnus-milestone-number">{index + 1}</span>
          <div className="zeitnus-milestone-info">
            <strong>{PHASE_NAMES[phaseKey]}</strong>
            <span>{metrics?.completedAt ? new Date(metrics.completedAt).toLocaleDateString() : t('zeitnusCooperative.roadmap.completed')}</span>
          </div>
          <Badge variant="success">✓</Badge>
        </li>
      );
    })}
    {completedPhases.length === 0 && (
      <li className="zeitnus-milestone-empty">
        <Icon name="Target" size={24} style={{ color: 'var(--muted)' }} />
        <span>{t('zeitnusCooperative.roadmap.noMilestonesYet')}</span>
      </li>
    )}
  </ul>
);

// ============================================================================
// CONSTANTES LOCALES
// ============================================================================

const PHASE_DESCRIPTIONS: Record<ProgressivePhase, string> = {
  fase_1_vision: 'Definir el problema a resolver y convertir la visión amplia de ZEITNUS en metas concretas y medibles con indicadores y estrategias distintas.',
  fase_2_comunidad: 'Preparar una comunidad informada que entienda qué es una cooperativa, qué implica ser asociado, responsabilidades, economía del proyecto y riesgos.',
  fase_3_necesidades: 'Identificar necesidades concretas de los participantes (financiamiento, vivienda, empleo, producción, reciclaje, educación, tecnología) para elegir la estructura adecuada.',
  fase_4_viabilidad: 'Evaluar si el proyecto es viable económicamente: comunidad potencial, inversión inicial, costos operativos, ingresos, mercado, competencia, riesgos, legalidad, capacidad administrativa.',
  fase_5_estructura: 'Elegir la estructura jurídica adecuada (cooperativa, empresa privada, sin fines de lucro, alianza público-privada, empresa social, ecosistema mixto) según el objetivo.',
  fase_6_gobierno: 'Establecer cómo funcionará la organización: quién decide, participación, órganos, funciones, control de recursos, resolución de conflictos.',
  fase_7_transparencia: 'Diseñar sistemas de transparencia desde el inicio: información financiera clara, reportes periódicos, comunicación abierta, auditorías, registro de decisiones, participación.',
  fase_8_proyectos: 'Desarrollar proyectos económicos reales con demanda real, capacidad técnica, modelo financiero viable e impacto medible (economía circular, reciclaje, tech ambientales, construcción sostenible, agri regenerativa, servicios digitales, educación).',
  fase_9_evaluar_financiera: 'Evaluar estructura financiera cooperativa SOLO si existe comunidad estable, gobierno corporativo desarrollado, capital suficiente, profesionales especializados, tech segura, controles internos y cumplimiento regulatorio.',
  fase_10_escalar: 'Escalar responsablemente: medir resultados, corregir errores, fortalecer sistemas, capacitar personas, adaptarse al entorno. Velocidad no siempre = progreso.',
  completa: 'Roadmap completado. Institución madura y sostenible.',
};

function getNextIncompletePhase(): ProgressivePhase {
  // Esta función se usa en el componente principal, no aquí
  return 'fase_1_vision';
}

export default ZeitnusCooperativeRoadmap;