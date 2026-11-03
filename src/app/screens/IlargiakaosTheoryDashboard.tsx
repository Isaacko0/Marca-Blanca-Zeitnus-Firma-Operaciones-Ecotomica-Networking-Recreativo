// IlargiakaosTheoryDashboard.tsx — Dashboard principal de Teoría Cyberpunk/Postcapitalismo
// Principio Anfibio: offline-first, modo postmonetario/conectado vía priceParity

import React, { useEffect, useMemo } from 'react';
import {
  useIlargiakaosStore,
  useActivePAC,
  useCapitalistRealism,
  useRealismSeverity,
  useRealismDetected,
  useExtractedDesires,
  useAccelerationismAnalysis,
  useDivergenceScore,
  useAssessedTechnologies,
  useLiberatingTechCount,
  useExtractiveTechCount,
  useNeoludditeAudits,
  useCriticalAuditCount,
  useCommsAnalyses,
  useNetworkedCommsAvg,
  usePostApocalypticModels,
  usePostApocalypticViability,
  useActivePAC,
  useActivePACViability,
  useActivePACEcosocial,
  usePAChistory,
} from '@core/state/hooks/ilargiakaos';
import {
  detectCapitalistRealism,
  buildPAC,
  simulateAntiAcceleration,
  assessEcoAnarchistTech,
  verifyHumanHybridIdentity,
  extractPostcapitalistDesire,
  auditNeoludditeTrigger,
  measureCyberfeministComms,
  simulatePostApocalypticDayAfter,
} from '@core/lib/ilargiakaos-theory';
import { Icon } from '@core/ui/Icon';
import { Button } from '@core/ui/Button';
import { Card } from '@core/ui/Card';
import { Progress } from '@core/ui/Progress';
import { Badge } from '@core/ui/Badge';
import { Tabs } from '@core/ui/Tabs';
import { Input } from '@core/ui/Input';
import { Textarea } from '@core/ui/Textarea';
import { Select } from '@core/ui/Select';
import { Tooltip } from '@core/ui/Tooltip';
import { t } from '@core/lib/i18n';

export const IlargiakaosTheoryDashboard: React.FC = () => {
  const store = useIlargiakaosStore();
  const activePAC = useActivePAC();
  const realism = useCapitalistRealism();
  const realismSeverity = useRealismSeverity();
  const realismDetected = useRealismDetected();
  const extractedDesires = useExtractedDesires();
  const accelerationism = useAccelerationismAnalysis();
  const divergenceScore = useDivergenceScore();
  const assessedTechs = useAssessedTechnologies();
  const liberatingCount = useLiberatingTechCount();
  const extractiveCount = useExtractiveTechCount();
  const audits = useNeoludditeAudits();
  const criticalAudits = useCriticalAuditCount();
  const commsAnalyses = useCommsAnalyses();
  const networkedAvg = useNetworkedCommsAvg();
  const postApocalypticModels = usePostApocalypticModels();
  const avgViability = usePostApocalypticViability();
  const pacHistory = usePAChistory();
  const pacViability = useActivePACViability();
  const pacEcosocial = useActivePACEcosocial();

  const actions = store;

  // Auto-save
  useEffect(() => {
    const timer = setTimeout(() => actions.saveToStorage(), 5000);
    return () => clearTimeout(timer);
  }, [actions]);

  const severityColor = realismSeverity === 'critical' ? 'var(--haiti)' :
    realismSeverity === 'high' ? 'var(--haiti)' :
    realismSeverity === 'medium' ? 'var(--acero)' : 'var(--genio)';

  const divergenceColor = divergenceScore > 20 ? 'var(--genio)' :
    divergenceScore > -20 ? 'var(--acero)' : 'var(--haiti)';

  return (
    <div className="ilargiakaos-dashboard">
      {/* Header */}
      <header className="ilargiakaos-header">
        <div className="ilargiakaos-header-left">
          <Icon name="Brain" size={32} style={{ color: 'var(--cyan-400)' }} />
          <div>
            <h1>{t('ilargiakaos.dashboard.title')}</h1>
            <p className="ilargiakaos-subtitle">{t('ilargiakaos.dashboard.subtitle')}</p>
          </div>
        </div>
        <div className="ilargiakaos-header-right">
          <div className="ilargiakaos-realism-badge">
            <Badge variant={realismDetected ? (realismSeverity === 'critical' ? 'danger' : realismSeverity === 'high' ? 'warning' : 'info') : 'success'}>
              {realismDetected ? `🧠 ${t('ilargiakaos.dashboard.realismDetected')} (${realismSeverity})` : '✅ Realismo capitalista no detectado'}
            </Badge>
          </div>
          <div className="ilargiakaos-divergence">
            <span style={{ color: divergenceColor }}>
              {divergenceScore > 0 ? '⬆️ Anti-Aceleracionismo' : divergenceScore < 0 ? '⬇️ Aceleracionismo Landiano' : '⚖️ Equilibrio'}
            </span>
            <span> ({divergenceScore})</span>
          </div>
        </div>
      </header>

      <div className="ilargiakaos-main-layout">
        {/* Sidebar: PAC y Escaneos */}
        <aside className="ilargiakaos-sidebar-left" aria-label="PAC y Realismo">
          <section className="ilargiakaos-sidebar-section">
            <h3>📜 {t('ilargiakaos.dashboard.activePAC')}</h3>
            {activePAC ? (
              <div className="ilargiakaos-pac-card">
                <h4>{activePAC.name}</h4>
                <div className="ilargiakaos-pac-metrics">
                  <Progress value={activePAC.collectiveViability} max={100} showLabel label={t('ilargiakaos.dashboard.viability')} />
                  <Progress value={activePAC.ecosocialAlignment} max={100} showLabel label={t('ilargiakaos.dashboard.ecosocial')} />
                </div>
                <div className="ilargiakaos-pac-values">
                  {activePAC.values.map(v => <Badge key={v} variant="info" className="ilargiakaos-value-badge">{v}</Badge>)}
                </div>
                <Button variant="ghost" size="sm" onClick={() => actions.setActivePAC(null)}>
                  {t('ilargiakaos.dashboard.archivePAC')}
                </Button>
              </div>
            ) : (
              <Button variant="primary" className="ilargiakaos-create-pac-btn" onClick={() => actions.setScreen('ilargiakaos-governance')}>
                ➕ {t('ilargiakaos.dashboard.createPAC')}
              </Button>
            )}
            <div className="ilargiakaos-pac-history">
              <h4>{t('ilargiakaos.dashboard.pacHistory')}</h4>
              {pacHistory.slice(0, 5).map(pac => (
                <div key={pac.id} className="ilargiakaos-pac-history-item">
                  <span>{pac.name}</span>
                  <Badge variant="secondary">{pac.collectiveViability}%</Badge>
                </div>
              ))}
            </div>
          </section>

          <section className="ilargiakaos-sidebar-section">
            <h3>🧠 {t('ilargiakaos.dashboard.realismScans')}</h3>
            <div className="ilargiakaos-scan-history">
              {store.realismScans.slice(0, 5).map((scan, i) => (
                <div key={i} className={`ilargiakaos-scan-item ${scan.severity}`}>
                  <span className="ilargiakaos-scan-severity">{scan.severity}</span>
                  <span className="ilargiakaos-scan-patterns">{scan.detectionPatterns.slice(0, 3).join(', ')}</span>
                </div>
              ))}
            </div>
            <Button variant="secondary" size="sm" onClick={() => actions.setScreen('ilargiakaos-cultural')}>
              📄 {t('ilargiakaos.dashboard.analyzeText')}
            </Button>
          </section>
        </aside>

        {/* Main Content: Grid de métricas */}
        <main className="ilargiakaos-main-content" role="main">
          <div className="ilargiakaos-metrics-grid">
            {/* Realismo Capitalista */}
            <MetricCard
              title={t('ilargiakaos.dashboard.capitalistRealism')}
              value={realismDetected ? 'DETECTADO' : 'LIMPIO'}
              icon="AlertTriangle"
              color={realismDetected ? severityColor : 'var(--genio)'}
              trend={realismDetected ? 'down' : 'up'}
              subtitle={t('ilargiakaos.dashboard.severity')}: {realismSeverity}
            />

            {/* PAC Activo */}
            <MetricCard
              title={t('ilargiakaos.dashboard.activePAC')}
              value={activePAC ? 'ACTIVO' : 'NINGUNO'}
              icon="ScrollText"
              color={activePAC ? 'var(--genio)' : 'var(--muted)'}
              trend={activePAC ? 'up' : 'neutral'}
              subtitle={activePAC ? `${activePAC.values.length} valores` : t('ilargiakaos.dashboard.noPAC')}
            />

            {/* Divergencia Aceleracionismo */}
            <MetricCard
              title={t('ilargiakaos.dashboard.accelerationismDivergence')}
              value={divergenceScore > 0 ? `+${divergenceScore}` : `${divergenceScore}`}
              icon="Zap"
              color={divergenceColor}
              trend={divergenceScore > 0 ? 'up' : divergenceScore < 0 ? 'down' : 'neutral'}
              subtitle={divergenceScore > 0 ? 'Anti-Aceleracionismo' : divergenceScore < 0 ? 'Landiano' : 'Equilibrio'}
            />

            {/* Tech Assessment */}
            <MetricCard
              title={t('ilargiakaos.dashboard.techAssessed')}
              value={Object.keys(assessedTechs).length}
              icon="Microscope"
              color={liberatingCount > extractiveCount ? 'var(--genio)' : extractiveCount > liberatingCount ? 'var(--haiti)' : 'var(--acero)'}
              trend={liberatingCount > extractiveCount ? 'up' : extractiveCount > liberatingCount ? 'down' : 'neutral'}
              subtitle={t('ilargiakaos.dashboard.liberating')}: {liberatingCount} | {t('ilargiakaos.dashboard.extractive')}: {extractiveCount}
            />

            {/* Audits */}
            <MetricCard
              title={t('ilargiakaos.dashboard.neoludditeAudits')}
              value={audits.length}
              icon="ShieldAlert"
              color={criticalAudits > 0 ? 'var(--haiti)' : 'var(--genio)'}
              trend={criticalAudits > 0 ? 'down' : 'up'}
              subtitle={t('ilargiakaos.dashboard.critical')}: {criticalAudits}
            />

            {/* Comms */}
            <MetricCard
              title={t('ilargiakaos.dashboard.cyberfeministComms')}
              value={`${Math.round(networkedAvg)}%`}
              icon="Share2"
              color={networkedAvg > 60 ? 'var(--genio)' : networkedAvg > 30 ? 'var(--acero)' : 'var(--haiti)'}
              trend={networkedAvg > 60 ? 'up' : networkedAvg > 30 ? 'neutral' : 'down'}
              subtitle={t('ilargiakaos.dashboard.networkedScore')}
            />

            {/* Post-Apocalyptic */}
            <MetricCard
              title={t('ilargiakaos.dashboard.postApocalypticModels')}
              value={postApocalypticModels.length}
              icon="Sunrise"
              color={avgViability > 60 ? 'var(--genio)' : avgViability > 30 ? 'var(--acero)' : 'var(--haiti)'}
              trend={avgViability > 60 ? 'up' : avgViability > 30 ? 'neutral' : 'down'}
              subtitle={t('ilargiakaos.dashboard.avgViability')}: ${Math.round(avgViability)}%
            />

            {/* Identity */}
            <MetricCard
              title={t('ilargiakaos.dashboard.hybridIdentities')}
              value={Object.keys(store.agentIdentities).length}
              icon="Users"
              color="var(--cyan-400)"
              trend="up"
              subtitle={t('ilargiakaos.dashboard.tecnomutants')}
            />
          </div>

          {/* Tabs de detalle */}
          <Tabs defaultValue="realism" className="ilargiakaos-detail-tabs">
            <Tabs.List>
              <Tabs.Trigger value="realism">🧠 {t('ilargiakaos.dashboard.realismDetail')}</Tabs.Trigger>
              <Tabs.Trigger value="pac">📜 {t('ilargiakaos.dashboard.pacDetail')}</Tabs.Trigger>
              <Tabs.Trigger value="acceleration">⚡ {t('ilargiakaos.dashboard.accelerationDetail')}</Tabs.Trigger>
              <Tabs.Trigger value="tech">🔬 {t('ilargiakaos.dashboard.techDetail')}</Tabs.Trigger>
              <Tabs.Trigger value="audits">🔍 {t('ilargiakaos.dashboard.auditsDetail')}</Tabs.Trigger>
              <Tabs.Trigger value="comms">🕸️ {t('ilargiakaos.dashboard.commsDetail')}</Tabs.Trigger>
              <Tabs.Trigger value="futures">🌅 {t('ilargiakaos.dashboard.futuresDetail')}</Tabs.Trigger>
              <Tabs.Trigger value="identity">🧬 {t('ilargiakaos.dashboard.identityDetail')}</Tabs.Trigger>
              <Tabs.Trigger value="desires">💭 {t('ilargiakaos.dashboard.desiresDetail')}</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="realism">
              <RealismDetail realism={realism} scans={store.realismScans} actions={actions} />
            </Tabs.Content>

            <Tabs.Content value="pac">
              <PACDetail activePAC={activePAC} history={pacHistory} actions={actions} />
            </Tabs.Content>

            <Tabs.Content value="acceleration">
              <AccelerationDetail accelerationism={accelerationism} divergenceScore={divergenceScore} actions={actions} />
            </Tabs.Content>

            <Tabs.Content value="tech">
              <TechDetail assessedTechs={Object.values(assessedTechs)} actions={actions} />
            </Tabs.Content>

            <Tabs.Content value="audits">
              <AuditsDetail audits={audits} actions={actions} />
            </Tabs.Content>

            <Tabs.Content value="comms">
              <CommsDetail comms={Object.values(commsAnalyses)} actions={actions} />
            </Tabs.Content>

            <Tabs.Content value="futures">
              <FuturesDetail models={Object.values(postApocalypticModels)} actions={actions} />
            </Tabs.Content>

            <Tabs.Content value="identity">
              <IdentityDetail identities={Object.values(store.agentIdentities)} actions={actions} />
            </Tabs.Content>

            <Tabs.Content value="desires">
              <DesiresDetail desires={extractedDesires} actions={actions} />
            </Tabs.Content>
          </Tabs>
        </main>

        {/* Sidebar derecho: Acciones rápidas */}
        <aside className="ilargiakaos-sidebar-right" aria-label="Acciones rápidas">
          <section className="ilargiakaos-sidebar-section">
            <h3>⚡ {t('ilargiakaos.dashboard.quickActions')}</h3>
            <div className="ilargiakaos-quick-actions">
              <Button variant="primary" onClick={() => actions.setScreen('ilargiakaos-cultural')} className="ilargiakaos-action-btn">
                🧠 {t('ilargiakaos.dashboard.scanRealism')}
              </Button>
              <Button variant="secondary" onClick={() => actions.setScreen('ilargiakaos-governance')} className="ilargiakaos-action-btn">
                📜 {t('ilargiakaos.dashboard.buildPAC')}
              </Button>
              <Button variant="secondary" onClick={() => actions.setScreen('ilargiakaos-cultural')} className="ilargiakaos-action-btn">
                🎬 {t('ilargiakaos.dashboard.analyzeArtifact')}
              </Button>
              <Button variant="secondary" onClick={() => actions.setScreen('ilargiakaos-futures')} className="ilargiakaos-action-btn">
                🌅 {t('ilargiakaos.dashboard.modelFuture')}
              </Button>
              <Button variant="ghost" onClick={() => actions.saveToStorage()} className="ilargiakaos-action-btn">
                💾 {t('ilargiakaos.dashboard.save')}
              </Button>
            </div>
          </section>

          <section className="ilargiakaos-sidebar-section">
            <h3>🔔 {t('ilargiakaos.dashboard.alerts')}</h3>
            <AlertList
              realismDetected={realismDetected}
              realismSeverity={realismSeverity}
              criticalAudits={criticalAudits}
              extractiveCount={extractiveCount}
              divergenceScore={divergenceScore}
              networkedAvg={networkedAvg}
              avgViability={avgViability}
            />
          </section>

          <section className="ilargiakaos-sidebar-section">
            <h3>📊 {t('ilargiakaos.dashboard.keyMetrics')}</h3>
            <KeyMetricsList
              realismDetected={realismDetected}
              realismSeverity={realismSeverity}
              activePAC={activePAC}
              assessedCount={Object.keys(assessedTechs).length}
              liberatingCount={liberatingCount}
              extractiveCount={extractiveCount}
              auditCount={audits.length}
              criticalAudits={criticalAudits}
              divergenceScore={divergenceScore}
              networkedAvg={networkedAvg}
              identityCount={Object.keys(store.agentIdentities).length}
              desireCount={store.extractedDesires.length}
              modelCount={Object.keys(store.postApocalypticModels).length}
            />
          </section>

          <section className="ilargiakaos-sidebar-section">
            <h3>💱 {t('ilargiakaos.dashboard.monetaryMode')}</h3>
            <MonetaryModeSelector />
          </section>
        </aside>
      </div>

      {/* Toasts */}
      <div className="ilargiakaos-toasts" role="region" aria-live="polite">
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

const MetricCard: React.FC<{
  title: string;
  value: string;
  icon: string;
  color: string;
  trend: 'up' | 'down' | 'neutral';
  subtitle: string;
}> = ({ title, value, icon, color, trend, subtitle }) => (
  <Card className="ilargiakaos-metric-card">
    <div className="ilargiakaos-metric-header">
      <Icon name={icon} size={24} style={{ color }} />
      <span className={`ilargiakaos-metric-trend ilargiakaos-trend-${trend}`}>
        {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
      </span>
    </div>
    <div className="ilargiakaos-metric-value" style={{ color }}>{value}</div>
    <div className="ilargiakaos-metric-title">{title}</div>
    <div className="ilargiakaos-metric-subtitle">{subtitle}</div>
  </Card>
);

const RealismDetail: React.FC<{ realism: CapitalistRealism; scans: CapitalistRealism[]; actions: any }> = ({ realism, scans, actions }) => (
  <div className="ilargiakaos-detail-panel">
    <div className="ilargiakaos-detail-header">
      <h3>🧠 {t('ilargiakaos.dashboard.realismDetail')}</h3>
      <Badge variant={realism.atmosphereDetected ? (realism.severity === 'critical' ? 'danger' : realism.severity === 'high' ? 'warning' : 'info') : 'success'}>
        {realism.atmosphereDetected ? `${t('ilargiakaos.dashboard.detected')} (${realism.severity})` : t('ilargiakaos.dashboard.clean')}
      </Badge>
    </div>

    <div className="ilargiakaos-realism-metrics">
      <div className="ilargiakaos-metric-row">
        <span>{t('ilargiakaos.dashboard.noAlternativeBelief')}</span>
        <Progress value={realism.noAlternativeBelief} max={100} showLabel />
      </div>
      <div className="ilargiakaos-metric-row">
        <span>{t('ilargiakaos.dashboard.genuineThoughtBlocked')}</span>
        <Badge variant={realism.genuineThoughtBlocked ? 'danger' : 'success'}>{realism.genuineThoughtBlocked ? t('ilargiakaos.dashboard.yes') : t('ilargiakaos.dashboard.no')}</Badge>
      </div>
      <div className="ilargiakaos-metric-row">
        <span>{t('ilargiakaos.dashboard.consciousnessRetreated')}</span>
        <Badge variant={realism.consciousnessRetreated ? 'warning' : 'success'}>{realism.consciousnessRetreated ? t('ilargiakaos.dashboard.yes') : t('ilargiakaos.dashboard.no')}</Badge>
      </div>
      <div className="ilargiakaos-metric-row">
        <span>{t('ilargiakaos.dashboard.malaiseIndividualized')}</span>
        <Badge variant={realism.malaiseIndividualized ? 'warning' : 'success'}>{realism.malaiseIndividualized ? t('ilargiakaos.dashboard.yes') : t('ilargiakaos.dashboard.no')}</Badge>
      </div>
    </div>

    <div className="ilargiakaos-patterns">
      <h4>🔍 {t('ilargiakaos.dashboard.detectedPatterns')}</h4>
      <div className="ilargiakaos-pattern-tags">
        {realism.detectionPatterns.map((p, i) => (
          <Badge key={i} variant="secondary">{p}</Badge>
        ))}
      </div>
    </div>

    <Card className="ilargiakaos-scan-action">
      <h4>🔍 {t('ilargiakaos.dashboard.newScan')}</h4>
      <Textarea
        placeholder={t('ilargiakaos.dashboard.scanPlaceholder')}
        onBlur={(e) => actions.scanRealism(e.target.value)}
        rows={4}
      />
    </Card>
  </div>
);

const PACDetail: React.FC<{ activePAC: any; history: any[]; actions: any }> = ({ activePAC, history, actions }) => (
  <div className="ilargiakaos-detail-panel">
    {activePAC ? (
      <>
        <div className="ilargiakaos-detail-header">
          <h3>📜 {t('ilargiakaos.dashboard.activePAC')}</h3>
          <Badge variant="success">{t('ilargiakaos.dashboard.active')}</Badge>
        </div>
        <div className="ilargiakaos-pac-full">
          <h4>{activePAC.name}</h4>
          <div className="ilargiakaos-pac-metrics-full">
            <Progress value={activePAC.collectiveViability} max={100} showLabel label={t('ilargiakaos.dashboard.viability')} />
            <Progress value={activePAC.ecosocialAlignment} max={100} showLabel label={t('ilargiakaos.dashboard.ecosocial')} />
          </div>
          <div className="ilargiakaos-pac-values-full">
            {activePAC.values.map(v => <Badge key={v} variant="info">{v}</Badge>)}
          </div>
          <div className="ilargiakaos-pac-howtoact">
            <h5>{t('ilargiakaos.dashboard.howToAct')}</h5>
            {Object.entries(activePAC.howToAct).map(([value, how]) => (
              <div key={value} className="ilargiakaos-howtoact-item">
                <strong>{value}:</strong> {how}
              </div>
            ))}
          </div>
          <div className="ilargiakaos-pac-orientation">
            <h5>{t('ilargiakaos.dashboard.techOrientation')}</h5>
            <div className="ilargiakaos-orientation-grid">
              {Object.entries(activePAC.techOrientation).map(([key, value]) => (
                <div key={key} className="ilargiakaos-orientation-item">
                  <span>{key}</span>
                  <Badge variant={value ? 'success' : 'secondary'}>{value ? t('ilargiakaos.dashboard.yes') : t('ilargiakaos.dashboard.no')}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    ) : (
      <div className="ilargiakaos-empty-state">
        <Icon name="ScrollText" size={48} style={{ color: 'var(--muted)', opacity: 0.5 }} />
        <h3>{t('ilargiakaos.dashboard.noActivePAC')}</h3>
        <p>{t('ilargiakaos.dashboard.createPACFirst')}</p>
      </div>
    )}
    <div className="ilargiakaos-pac-history-full">
      <h4>{t('ilargiakaos.dashboard.history')}</h4>
      {history.map(pac => (
        <Card key={pac.id} className="ilargiakaos-history-pac">
          <div className="ilargiakaos-history-pac-header">
            <span>{pac.name}</span>
            <Badge variant="secondary">{pac.collectiveViability}%</Badge>
          </div>
          <div className="ilargiakaos-history-pac-values">
            {pac.values.map(v => <Badge key={v} variant="secondary">{v}</Badge>)}
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const AccelerationDetail: React.FC<{ accelerationism: any; divergenceScore: number; actions: any }> = ({ accelerationism, divergenceScore, actions }) => (
  <div className="ilargiakaos-detail-panel">
    <div className="ilargiakaos-detail-header">
      <h3>⚡ {t('ilargiakaos.dashboard.accelerationDetail')}</h3>
      <div className="ilargiakaos-divergence-display" style={{ color: divergenceScore > 0 ? 'var(--genio)' : divergenceScore < 0 ? 'var(--haiti)' : 'var(--acero)' }}>
        {divergenceScore > 0 ? '⬆️' : divergenceScore < 0 ? '⬇️' : '⚖️'} {divergenceScore}
      </div>
    </div>

    <div className="ilargiakaos-acceleration-grid">
      <Card className="ilargiakaos-landian-card">
        <h4>🏎️ {t('ilargiakaos.dashboard.landianTrajectory')}</h4>
        <div className="ilargiakaos-trajectory">
          <div className="ilargiakaos-trajectory-item">
            <strong>{t('ilargiakaos.dashboard.detected')}:</strong>
            <Badge variant={accelerationism.landianAccelerationism.detected ? 'danger' : 'success'}>
              {accelerationism.landianAccelerationism.detected ? t('ilargiakaos.dashboard.yes') : t('ilargiakaos.dashboard.no')}
            </Badge>
          </div>
          <div className="ilargiakaos-trajectory-item">
            <strong>{t('ilargiakaos.dashboard.capitalismSurpassesHuman')}:</strong>
            <Badge variant={accelerationism.landianAccelerationism.capitalismSurpassesHuman ? 'danger' : 'success'}>
              {accelerationism.landianAccelerationism.capitalismSurpassesHuman ? t('ilargiakaos.dashboard.yes') : t('ilargiakaos.dashboard.no')}
            </Badge>
          </div>
          <div className="ilargiakaos-trajectory-item">
            <strong>{t('ilargiakaos.dashboard.uncontrolledBecoming')}:</strong>
            <Badge variant={accelerationism.landianAccelerationism.uncontrolledBecoming ? 'danger' : 'success'}>
              {accelerationism.landianAccelerationism.uncontrolledBecoming ? t('ilargiakaos.dashboard.yes') : t('ilargiakaos.dashboard.no')}
            </Badge>
          </div>
          <div className="ilargiakaos-trajectory-item">
            <strong>{t('ilargiakaos.dashboard.infinitePlasticity')}:</strong>
            <Badge variant={accelerationism.landianAccelerationism.infinitePlasticity ? 'warning' : 'success'}>
              {accelerationism.landianAccelerationism.infinitePlasticity ? t('ilargiakaos.dashboard.yes') : t('ilargiakaos.dashboard.no')}
            </Badge>
          </div>
        </div>
      </Card>

      <Card className="ilargiakaos-antiaccel-card">
        <h4>🛡️ {t('ilargiakaos.dashboard.antiAccelerationTrajectory')}</h4>
        <div className="ilargiakaos-trajectory">
          <div className="ilargiakaos-trajectory-item">
            <strong>{t('ilargiakaos.dashboard.reappropriationOfNew')}:</strong>
            <Badge variant="success">{t('ilargiakaos.dashboard.yes')}</Badge>
          </div>
          <div className="ilargiakaos-trajectory-item">
            <strong>{t('ilargiakaos.dashboard.humanCentricFuture')}:</strong>
            <Badge variant="success">{t('ilargiakaos.dashboard.yes')}</Badge>
          </div>
          <div className="ilargiakaos-trajectory-item">
            <strong>{t('ilargiakaos.dashboard.controlledInnovation')}:</strong>
            <Badge variant="success">{t('ilargiakaos.dashboard.yes')}</Badge>
          </div>
          <div className="ilargiakaos-trajectory-item">
            <strong>{t('ilargiakaos.dashboard.culturalProgrammingOfTech')}:</strong>
            <Badge variant="success">{t('ilargiakaos.dashboard.yes')}</Badge>
          </div>
        </div>
      </Card>
    </div>

    <Card className="ilargiakaos-simulation-card">
      <h4>🧪 {t('ilargiakaos.dashboard.runSimulation')}</h4>
      <Textarea
        placeholder={t('ilargiakaos.dashboard.simulationPlaceholder')}
        onBlur={(e) => {
          try {
            const scenario = JSON.parse(e.target.value);
            actions.analyzeAccelerationism(scenario);
          } catch {}
        }}
        rows={6}
        defaultValue={JSON.stringify({
          name: 'Escenario 2030',
          description: 'Despliegue masivo de IA generativa + neuroimplantes obligatorios',
          techAdvances: ['IA generativa omnipresente', 'Neuroimplantes laborales', 'Monitoreo algorítmico total', 'Automatización total'],
          socialChanges: ['Precariedad extrema', 'Resistencia tecnomutante', 'Comunidades autogestionadas'],
          economicModel: 'capitalist_neoliberal'
        }, null, 2)}
        rows={8}
      />
    </Card>
  </div>
);

const TechDetail: React.FC<{ assessedTechs: any[]; actions: any }> = ({ assessedTechs, actions }) => (
  <div className="ilargiakaos-detail-panel">
    <div className="ilargiakaos-detail-header">
      <h3>🔬 {t('ilargiakaos.dashboard.techDetail')}</h3>
      <span>{assessedTechs.length} {t('ilargiakaos.dashboard.technologiesAssessed')}</span>
    </div>

    <div className="ilargiakaos-tech-grid">
      {assessedTechs.map(tech => (
        <Card key={tech.techId} className={`ilargiakaos-tech-card ${tech.assessment}`}>
          <div className="ilargiakaos-tech-header">
            <h4>{tech.name}</h4>
            <Badge variant={
              tech.assessment === 'liberadora' ? 'success' :
              tech.assessment === 'extractiva' ? 'danger' :
              tech.assessment === 'mixta' ? 'warning' : 'secondary'
            }>{tech.assessment}</Badge>
          </div>
          <p className="ilargiakaos-tech-desc">{tech.description}</p>
          <div className="ilargiakaos-tech-metrics">
            <div className="ilargiakaos-tech-metric">
              <Badge variant={tech.liberatesPhysicalLabor ? 'success' : 'secondary'}>
                {tech.liberatesPhysicalLabor ? '🟢 Libera trabajo' : '🔴 No libera'}
              </Badge>
            </div>
            <div className="ilargiakaos-tech-metric">
              <Badge variant={tech.regeneratesBiosphere ? 'success' : 'secondary'}>
                {tech.regeneratesBiosphere ? '🟢 Regenera' : '🔴 No regenera'}
              </Badge>
            </div>
            <div className="ilargiakaos-tech-metric">
              <Badge variant={tech.democraticControl ? 'success' : 'secondary'}>
                {tech.democraticControl ? '🟢 Democrática' : '🔴 No democrática'}
              </Badge>
            </div>
            <div className="ilargiakaos-tech-metric">
              <Badge variant={tech.communityOwned ? 'success' : 'secondary'}>
                {tech.communityOwned ? '🟢 Comunitaria' : '🔴 Propietaria'}
              </Badge>
            </div>
          </div>
        </Card>
      ))}
    </div>

    <Card className="ilargiakaos-assess-action">
      <h4>🔬 {t('ilargiakaos.dashboard.assessNewTech')}</h4>
      <Textarea
        placeholder={t('ilargiakaos.dashboard.assessPlaceholder')}
        onBlur={(e) => {
          try {
            const tech = JSON.parse(e.target.value);
            actions.assessTechnology(tech);
          } catch {}
        }}
        rows={6}
        defaultValue={JSON.stringify({
          name: 'Red mesh comunitaria',
          description: 'Red de comunicación descentralizada, hardware libre, gobernanza comunitaria',
          purpose: 'Comunicación democrática y soberana',
          controlStructure: 'commons',
          liberatesLabor: true,
          ecologicalImpact: 'regenerative',
          democraticGovernance: true,
          accessModel: 'commons-based'
        }, null, 2)}
        rows={6}
      />
    </Card>
  </div>
);

const AuditsDetail: React.FC<{ audits: any[]; actions: any }> = ({ audits, actions }) => (
  <div className="ilargiakaos-detail-panel">
    <div className="ilargiakaos-detail-header">
      <h3>🔍 {t('ilargiakaos.dashboard.auditsDetail')}</h3>
      <span>{audits.length} {t('ilargiakaos.dashboard.auditsCompleted')}</span>
    </div>

    <div className="ilargiakaos-audits-list">
      {audits.map(audit => (
        <Card key={audit.auditId} className={`ilargiakaos-audit-card ${audit.classification}`}>
          <div className="ilargiakaos-audit-header">
            <h4>{audit.techName}</h4>
            <Badge variant={
              audit.classification === 'peligrosa' ? 'danger' :
              audit.classification === 'extractiva' ? 'warning' :
              audit.classification === 'liberadora' ? 'success' : 'secondary'
            }>{audit.classification}</Badge>
          </div>
          <div className="ilargiakaos-audit-meta">
            <span>Contexto: {audit.deploymentContext}</span>
            <span>Poder destructivo: {audit.destructivePower}/100</span>
            <span>Voces críticas: {audit.criticalVoiceSuppressed ? 'Suprimidas' : 'Permitidas'}</span>
            <span>Apropiación no capitalista: {audit.appropriationNonCapitalist ? 'Sí' : 'No'}</span>
          </div>
          {audit.criticalAuditTriggered && (
            <Badge variant="danger" className="ilargiakaos-critical-badge">⚠️ AUDITORÍA CRÍTICA TRIGGERED</Badge>
          )}
          <div className="ilargiakaos-audit-recommendations">
            <h5>{t('ilargiakaos.dashboard.recommendations')}</h5>
            <ul>{audit.recommendations.map((r, i) => <li key={i}>{r}</li>)}</ul>
          </div>
        </Card>
      ))}
    </div>

    <Card className="ilargiakaos-audit-action">
      <h4>🔍 {t('ilargiakaos.dashboard.newAudit')}</h4>
      <Textarea
        placeholder={t('ilargiakaos.dashboard.auditPlaceholder')}
        onBlur={(e) => {
          try {
            const deployment = JSON.parse(e.target.value);
            actions.auditDeployment(deployment);
          } catch {}
        }}
        rows={6}
        defaultValue={JSON.stringify({
          techDeploymentId: 'deploy_001',
          techName: 'Sistema de neuroimplantes obligatorios',
          description: 'Implantes cerebrales obligatorios para trabajadores de plataforma',
          context: 'neoliberal',
          controlStructure: 'corporate',
          purpose: 'Productividad y monitoreo',
          ecologicalImpact: 'neutral',
          criticalVoicesAllowed: false
        }, null, 2)}
        rows={6}
      />
    </Card>
  </div>
);

const CommsDetail: React.FC<{ comms: any[]; actions: any }> = ({ comms, actions }) => (
  <div className="ilargiakaos-detail-panel">
    <div className="ilargiakaos-detail-header">
      <h3>🕸️ {t('ilargiakaos.dashboard.commsDetail')}</h3>
      <span>{comms.length} {t('ilargiakaos.dashboard.networksAnalyzed')}</span>
    </div>

    <div className="ilargiakaos-comms-grid">
      {comms.map(comm => (
        <Card key={comm.networkId} className="ilargiakaos-comm-card">
          <div className="ilargiakaos-comm-header">
            <h4>{comm.networkName}</h4>
            <Badge variant={comm.networkedCommunicationScore > comm.linearCommunicationScore ? 'success' : 'warning'}>
              {comm.networkedCommunicationScore > comm.linearCommunicationScore ? '🕸️ Red' : '📏 Lineal'}
            </Badge>
          </div>
          <div className="ilargiakaos-comm-scores">
            <Progress value={comm.networkedCommunicationScore} max={100} showLabel label={t('ilargiakaos.dashboard.networked')} />
            <Progress value={comm.linearCommunicationScore} max={100} showLabel label={t('ilargiakaos.dashboard.linear')} />
          </div>
          <div className="ilargiakaos-comm-meta">
            <span>Topología: {comm.hierarchicalDepth === 1 ? 'Plana/Red' : comm.hierarchicalDepth === 2 ? 'Federada' : 'Jerárquica'}</span>
            <span>Resistencia patriarcal: {comm.patriarchyResistance}%</span>
            <span>Resistencia neoliberal: {comm.neoliberalResistance}%</span>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const FuturesDetail: React.FC<{ models: any[]; actions: any }> = ({ models, actions }) => (
  <div className="ilargiakaos-detail-panel">
    <div className="ilargiakaos-detail-header">
      <h3>🌅 {t('ilargiakaos.dashboard.futuresDetail')}</h3>
      <span>{models.length} {t('ilargiakaos.dashboard.scenariosModeled')}</span>
    </div>

    <div className="ilargiakaos-futures-grid">
      {models.map(model => (
        <Card key={model.scenarioId} className="ilargiakaos-future-card">
          <div className="ilargiakaos-future-header">
            <h4>{model.scenarioName}</h4>
            <Badge variant={model.triggerEvent === 'economic_collapse' ? 'warning' : model.triggerEvent === 'climate' ? 'info' : 'secondary'}>
              {model.triggerEvent}
            </Badge>
          </div>
          <div className="ilargiakaos-future-metrics">
            <Progress value={model.viabilityScore} max={100} showLabel label={t('ilargiakaos.dashboard.viability')} />
            <Progress value={model.bookchinAlignment} max={100} showLabel label={t('ilargiakaos.dashboard.bookchinAlignment')} />
          </div>
          <div className="ilargiakaos-future-flags">
            {model.mutualAidNetworks && <Badge variant="success">🤝 Apoyo mutuo</Badge>}
            {model.horizontalDecisionMaking && <Badge variant="success">⚖️ Horizontal</Badge>}
            {model.resourceCommons && <Badge variant="success">🌍 Comunes</Badge>}
            {model.technologyReappropriated && <Badge variant="success">🔧 Tech reapropiada</Badge>}
            {model.ecologicalRegeneration && <Badge variant="success">🌿 Regeneración</Badge>}
            {model.solidarityOverCompetition && <Badge variant="success">🤲 Solidaridad</Badge>}
          </div>
        </Card>
      ))}
    </div>

    <Card className="ilargiakaos-model-action">
      <h4>🌅 {t('ilargiakaos.dashboard.newModel')}</h4>
      <Textarea
        placeholder={t('ilargiakaos.dashboard.modelPlaceholder')}
        onBlur={(e) => {
          try {
            const scenario = JSON.parse(e.target.value);
            actions.modelPostApocalyptic(scenario);
          } catch {}
        }}
        rows={6}
        defaultValue={JSON.stringify({
          scenarioId: 'scenario_2030_collapse',
          scenarioName: 'Colapso económico 2030',
          triggerEvent: 'economic_collapse',
          initialPopulation: 8000000000,
          availableTech: ['redes mesh', 'energía solar comunitaria', 'agroecología', 'impresoras 3D', 'codigo abierto'],
          socialCohesion: 60,
          ecologicalDamage: 40
        }, null, 2)}
        rows={6}
      />
    </Card>
  </div>
);

const IdentityDetail: React.FC<{ identities: any[]; actions: any }> = ({ identities, actions }) => (
  <div className="ilargiakaos-detail-panel">
    <div className="ilargiakaos-detail-header">
      <h3>🧬 {t('ilargiakaos.dashboard.identityDetail')}</h3>
      <span>{identities.length} {t('ilargiakaos.dashboard.identitiesRegistered')}</span>
    </div>

    <div className="ilargiakaos-identity-grid">
      {identities.map(id => (
        <Card key={id.agentId} className="ilargiakaos-identity-card">
          <div className="ilargiakaos-identity-header">
            <h4>{id.agentId}</h4>
            <Badge variant={
              id.identityType === 'tecnomutant' ? 'warning' :
              id.identityType === 'hybrid' ? 'info' :
              id.identityType === 'carbon' ? 'success' : 'secondary'
            }>{id.identityType}</Badge>
          </div>
          <div className="ilargiakaos-identity-metrics">
            <div className="ilargiakaos-identity-metric">
              <span>Carbono: {id.carbonPercentage}%</span>
              <span>Silicio: {id.siliconPercentage}%</span>
            </div>
            <div className="ilargiakaos-identity-metric">
              <span>Autonomía: {id.autonomyScore}/100</span>
              <span>Resistencia: {id.resistanceToCapitalistRealism}/100</span>
            </div>
            <div className="ilargiakaos-identity-metric">
              <span>Vigilancia: {id.surveillanceExposure}%</span>
              <span>Poh: {id.pohVerification.humanityScore}/100</span>
            </div>
            <div className="ilargiakaos-identity-metric">
              <span>Implantes obligatorios: {id.mandatoryImplants.length}</span>
              <span>Elegidos: {id.chosenAugmentations.length}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const DesiresDetail: React.FC<{ desires: any[]; actions: any }> = ({ desires, actions }) => (
  <div className="ilargiakaos-detail-panel">
    <div className="ilargiakaos-detail-header">
      <h3>💭 {t('ilargiakaos.dashboard.desiresDetail')}</h3>
      <span>{desires.length} {t('ilargiakaos.dashboard.desiresExtracted')}</span>
    </div>

    <div className="ilargiakaos-desires-list">
      {desires.map(desire => (
        <Card key={desire.artifactId} className="ilargiakaos-desire-card">
          <div className="ilargiakaos-desire-header">
            <h4>{desire.title} ({desire.year})</h4>
            <Badge variant={desire.capitalistRealismSubverted ? 'success' : 'secondary'}>
              {desire.capitalistRealismSubverted ? '🔓 Subvierte realismo' : '🔒 No subvierte'}
            </Badge>
          </div>
          <p className="ilargiakaos-desire-creators">{desire.creators.join(', ')}</p>
          <div className="ilargiakaos-desire-flags">
            {desire.bodyTechBoundaryExplored && <Badge variant="info">🧬 Cuerpo-Tech</Badge>}
            {desire.empathyAsResistance && <Badge variant="success">💚 Empatía resistencia</Badge>}
            {desire.monopolyCritique && <Badge variant="warning">🏢 Crítica monopolio</Badge>}
            {desire.posthumanConditioning && <Badge variant="info">🤖 Posthumano</Badge>}
            {desire.culturalProgrammingVisible && <Badge variant="secondary">🎭 Programación cultural</Badge>}
          </div>
          <div className="ilargiakaos-desire-extraction">
            <strong>{t('ilargiakaos.dashboard.extractionPotential')}: {desire.extractionPotential}%</strong>
          </div>
          <div className="ilargiakaos-desire-hidden">
            <h5>{t('ilargiakaos.dashboard.hiddenDesires')}</h5>
            <ul>{desire.hiddenDesires.map((d, i) => <li key={i}>{d}</li>)}</ul>
          </div>
        </Card>
      ))}
    </div>

    <Card className="ilargiakaos-analyze-action">
      <h4>🎬 {t('ilargiakaos.dashboard.analyzeNewArtifact')}</h4>
      <Textarea
        placeholder={t('ilargiakaos.dashboard.artifactPlaceholder')}
        onBlur={(e) => {
          try {
            const artifact = JSON.parse(e.target.value);
            actions.analyzeArtifact(artifact);
          } catch {}
        }}
        rows={6}
        defaultValue={JSON.stringify({
          id: 'artifact_new',
          type: 'film',
          title: 'Nuevo análisis',
          year: 2024,
          creators: ['Director'],
          description: 'Descripción de la obra...',
          themes: ['cuerpo-tecnología', 'resistencia', 'monopolio']
        }, null, 2)}
        rows={6}
      />
    </Card>
  </div>
);

// Componentes auxiliares
const AlertList: React.FC<{
  realismDetected: boolean;
  realismSeverity: string;
  criticalAudits: number;
  extractiveCount: number;
  divergenceScore: number;
  networkedAvg: number;
  avgViability: number;
}> = ({ realismDetected, realismSeverity, criticalAudits, extractiveCount, divergenceScore, networkedAvg, avgViability }) => {
  const alerts: { type: 'danger' | 'warning' | 'info' | 'success'; message: string }[] = [];

  if (realismDetected && (realismSeverity === 'critical' || realismSeverity === 'high')) {
    alerts.push({ type: 'danger', message: `Realismo capitalista ${realismSeverity}: ${t('ilargiakaos.dashboard.requiresAction')}` });
  }
  if (criticalAudits > 0) {
    alerts.push({ type: 'danger', message: `${criticalAudits} ${t('ilargiakaos.dashboard.criticalAudits')} - ${t('ilargiakaos.dashboard.immediateMoratorium')}` });
  }
  if (extractiveCount > 0) {
    alerts.push({ type: 'warning', message: `${extractiveCount} ${t('ilargiakaos.dashboard.extractiveTechs')} - ${t('ilargiakaos.dashboard.neoludditeAuditRequired')}` });
  }
  if (divergenceScore < -20) {
    alerts.push({ type: 'warning', message: `${t('ilargiakaos.dashboard.landianTrajectoryDominant')} - ${t('ilargiakaos.dashboard.strengthenPAC')}` });
  }
  if (networkedAvg < 40) {
    alerts.push({ type: 'info', message: `${t('ilargiakaos.dashboard.lowNetworkedComms')} - ${t('ilargiakaos.dashboard.promoteCyberfeminist')}` });
  }
  if (avgViability < 50) {
    alerts.push({ type: 'info', message: `${t('ilargiakaos.dashboard.lowPostApocalypticViability')} - ${t('ilargiakaos.dashboard.strengthenMutualAid')}` });
  }

  if (alerts.length === 0) {
    return <div className="ilargiakaos-no-alerts">✅ {t('ilargiakaos.dashboard.noAlerts')}</div>;
  }

  return (
    <div className="ilargiakaos-alert-list">
      {alerts.map((alert, i) => (
        <div key={i} className={`ilargiakaos-alert ilargiakaos-alert-${alert.type}`}>
          <Icon name={alert.type === 'danger' ? 'AlertCircle' : alert.type === 'warning' ? 'AlertTriangle' : 'Info'} size={16} />
          <span>{alert.message}</span>
        </div>
      ))}
    </div>
  );
};

const KeyMetricsList: React.FC<{
  realismDetected: boolean;
  realismSeverity: string;
  activePAC: any;
  assessedCount: number;
  liberatingCount: number;
  extractiveCount: number;
  auditCount: number;
  criticalAudits: number;
  divergenceScore: number;
  networkedAvg: number;
  identityCount: number;
  desireCount: number;
  modelCount: number;
}> = ({ realismDetected, realismSeverity, activePAC, assessedCount, liberatingCount, extractiveCount, auditCount, criticalAudits, divergenceScore, networkedAvg, identityCount, desireCount, modelCount }) => (
  <ul className="ilargiakaos-key-metrics">
    <li><strong>{t('ilargiakaos.dashboard.realismStatus')}:</strong> {realismDetected ? `${realismSeverity}` : t('ilargiakaos.dashboard.clean')}</li>
    <li><strong>{t('ilargiakaos.dashboard.activePAC')}:</strong> {activePAC ? activePAC.name : t('ilargiakaos.dashboard.none')}</li>
    <li><strong>{t('ilargiakaos.dashboard.techAssessed')}:</strong> {assessedCount} ({liberatingCount} 🟢 | {extractiveCount} 🔴)</li>
    <li><strong>{t('ilargiakaos.dashboard.audits')}:</strong> {auditCount} ({criticalAudits} ⚠️)</li>
    <li><strong>{t('ilargiakaos.dashboard.divergence')}:</strong> {divergenceScore > 0 ? '+' : ''}{divergenceScore}</li>
    <li><strong>{t('ilargiakaos.dashboard.networkedComms')}:</strong> {Math.round(networkedAvg)}%</li>
    <li><strong>{t('ilargiakaos.dashboard.identities')}:</strong> {identityCount}</li>
    <li><strong>{t('ilargiakaos.dashboard.desires')}:</strong> {desireCount}</li>
    <li><strong>{t('ilargiakaos.dashboard.futureModels')}:</strong> {modelCount}</li>
  </ul>
);

const MonetaryModeSelector: React.FC = () => {
  const mode = useIlargiakaosStore(s => s.monetaryMode || 'postmonetario');
  const setMode = useIlargiakaosStore(s => s.setMonetaryMode);
  const priceParity = useIlargiakaosStore(s => s.priceParity || 1);

  return (
    <div className="ilargiakaos-mode-selector">
      <label>
        <input type="radio" name="monetary-mode" value="postmonetario" checked={mode === 'postmonetario'} onChange={() => setMode('postmonetario')} />
        <span>🌿 {t('ilargiakaos.modes.postmonetario')}</span>
      </label>
      <label>
        <input type="radio" name="monetary-mode" value="conectado" checked={mode === 'conectado'} onChange={() => setMode('conectado')} />
        <span>💰 {t('ilargiakaos.modes.conectado')}</span>
      </label>
      {mode === 'conectado' && (
        <div className="ilargiakaos-price-parity">
          <label>{t('ilargiakaos.priceParity')}: </label>
          <input type="number" step="0.0001" value={priceParity} onChange={(e) => useIlargiakaosStore.getState().setPriceParity(parseFloat(e.target.value))} />
          <small>USD/ZNU</small>
        </div>
      )}
    </div>
  );
};

const Toast: React.FC<{ toast: any; onClose: (id: string) => void }> = ({ toast, onClose }) => (
  <div className={`ilargiakaos-toast ${toast.type}`} role="alert">
    <div className="ilargiakaos-toast-content">
      <span className="ilargiakaos-toast-title">{toast.title}</span>
      <span className="ilargiakaos-toast-message">{toast.message}</span>
    </div>
    <button className="ilargiakaos-toast-close" onClick={() => onClose(toast.id)} aria-label="Cerrar">×</button>
  </div>
);

export default IlargiakaosTheoryDashboard;