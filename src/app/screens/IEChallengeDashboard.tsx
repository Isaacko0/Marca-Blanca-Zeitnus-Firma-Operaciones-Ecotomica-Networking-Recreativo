// IEChallengeDashboard.tsx — Dashboard principal del Protocolo IE
// Lista desafíos, KPIs, crear nuevo, navegación a workspace

import React, { useEffect, useMemo } from 'react';
import { useIEProtocolStore, useIEChallengesSummary, useIEGlobalMetrics, useIEAddToast } from '@core/state/hooks/ie-protocol';
import { ieFormatUSDC, ieFormatBigInt } from '@core/lib/ie-rce-math';
import { Button } from '@core/ui/Button';
import { Card } from '@core/ui/Card';
import { Badge } from '@core/ui/Badge';
import { Icon } from '@core/ui/Icon';
import { t } from '@core/lib/i18n';

export const IEChallengeDashboard: React.FC = () => {
  const challenges = useIEChallengesSummary();
  const metrics = useIEGlobalMetrics();
  const addToast = useIEAddToast();
  const createChallenge = useIEProtocolStore(s => s.createChallenge);
  const setScreen = useIEProtocolStore(s => s.setScreen);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [newChallengeForm, setNewChallengeForm] = React.useState({
    title: '',
    token: 'USDC',
    milestones: [{ title: '', amount: '', approvalsRequired: 1 }],
  });

  // Auto-save
  useEffect(() => {
    const timer = setTimeout(() => useIEProtocolStore.getState().saveToStorage(), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChallengeForm.title.trim()) return;
    
    const challenge = createChallenge({
      funder: 'current-user-did', // TODO: get from Poh
      token: newChallengeForm.token,
      metaURI: newChallengeForm.title,
      milestones: newChallengeForm.milestones.map(m => ({
        title: m.title,
        amount: BigInt(Math.round(parseFloat(m.amount) * 1_000_000)),
        approvalsRequired: m.approvalsRequired,
      })),
      fundingConfig: { mode: 'postmonetario', token: newChallengeForm.token },
    });
    
    setShowCreateModal(false);
    setNewChallengeForm({ title: '', token: 'USDC', milestones: [{ title: '', amount: '', approvalsRequired: 1 }] });
    addToast({ id: 'toast-create', type: 'success', title: t('ie.challengeCreated'), message: challenge.metaURI, createdAt: Date.now() });
  };

  const addMilestone = () => setNewChallengeForm(f => ({ ...f, milestones: [...f.milestones, { title: '', amount: '', approvalsRequired: 1 }] }));
  const removeMilestone = (i: number) => setNewChallengeForm(f => ({ ...f, milestones: f.milestones.filter((_, idx) => idx !== i) }));
  const updateMilestone = (i: number, field: string, value: string) => setNewChallengeForm(f => ({ ...f, milestones: f.milestones.map((m, idx) => idx === i ? { ...m, [field]: value } : m) }));

  return (
    <div className="ie-dashboard">
      {/* Header */}
      <header className="ie-dashboard-header">
        <div className="ie-dashboard-header-left">
          <Icon name="GitBranch" size={32} style={{ color: 'var(--accent-cyan)' }} />
          <div>
            <h1>{t('title.ieProtocol')}</h1>
            <p className="ie-dashboard-subtitle">{t('ie.dashboardSubtitle')}</p>
          </div>
        </div>
        <div className="ie-dashboard-header-right">
          <div className="ie-mode-badge">
            <Badge variant="info">{t('ie.modes.postmonetario')}</Badge>
            <Badge variant="secondary">{t('ie.modes.conectado')}</Badge>
          </div>
          <Button variant="primary" onClick={() => setShowCreateModal(true)} className="ie-create-btn">
            <Icon name="Plus" size={18} /> {t('ie.createChallenge')}
          </Button>
        </div>
      </header>

      {/* KPIs Globales */}
      <div className="ie-kpi-grid">
        <KPICard
          title={t('ie.totalActiveChallenges')}
          value={metrics.totalActiveChallenges}
          icon="GitBranch"
          color="var(--accent-cyan)"
        />
        <KPICard
          title={t('ie.totalParticipants')}
          value={metrics.totalParticipants}
          icon="Users"
          color="var(--genio)"
        />
        <KPICard
          title={t('ie.totalFunded')}
          value={ieFormatUSDC(metrics.totalFunded)}
          icon="DollarSign"
          color="var(--limon)"
        />
        <KPICard
          title={t('ie.totalReleased')}
          value={ieFormatUSDC(metrics.totalReleased)}
          icon="ArrowUpRight"
          color={metrics.totalReleased > 0 ? 'var(--genio)' : 'var(--muted)'}
        />
        <KPICard
          title={t('ie.totalRCEDistributed')}
          value={ieFormatUSDC(metrics.totalRCEDistributed)}
          icon="Coins"
          color="var(--amber)"
        />
        <KPICard
          title={t('ie.avgNetworkDepth')}
          value={metrics.avgNetworkDepth.toFixed(1)}
          icon="Layers"
          color="var(--accent-violet)"
        />
        <KPICard
          title={t('ie.coordinatorRatio')}
          value={`${(metrics.coordinatorRatio * 100).toFixed(1)}%`}
          icon="Target"
          color={metrics.coordinatorRatio > 0.1 ? 'var(--genio)' : 'var(--muted)'}
        />
        <KPICard
          title={t('ie.consensusRate')}
          value={`${(metrics.consensusRate * 100).toFixed(1)}%`}
          icon="CheckCircle"
          color={metrics.consensusRate > 0.5 ? 'var(--genio)' : 'var(--muted)'}
        />
      </div>

      {/* Lista de Desafíos */}
      <div className="ie-challenges-section">
        <div className="ie-section-header">
          <h2>{t('ie.challenges')}</h2>
          <div className="ie-section-actions">
            <Button variant="ghost" size="sm" onClick={() => setScreen('calculator')}>
              <Icon name="Calculator" size={16} /> {t('nav.ieCalculator')}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setScreen('certificates')}>
              <Icon name="Award" size={16} /> {t('nav.ieCertificates')}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setScreen('simulation')}>
              <Icon name="TrendingUp" size={16} /> {t('ie.simulation')}
            </Button>
          </div>
        </div>

        {challenges.length === 0 ? (
          <div className="ie-empty-state">
            <Icon name="GitBranch" size={64} style={{ color: 'var(--muted)', opacity: 0.5 }} />
            <h3>{t('ie.noChallenges')}</h3>
            <p>{t('ie.createFirstChallenge')}</p>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              <Icon name="Plus" size={18} /> {t('ie.createChallenge')}
            </Button>
          </div>
        ) : (
          <div className="ie-challenges-grid">
            {challenges.map(challenge => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        )}
      </div>

      {/* Modal Crear Desafío */}
      {showCreateModal && (
        <div className="ie-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="ie-modal" onClick={e => e.stopPropagation()}>
            <div className="ie-modal-header">
              <h3>{t('ie.createChallenge')}</h3>
              <button className="ie-modal-close" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateChallenge} className="ie-modal-form">
              <div className="ie-form-field">
                <label>{t('ie.challengeTitle')}</label>
                <input
                  type="text"
                  value={newChallengeForm.title}
                  onChange={e => setNewChallengeForm({ ...newChallengeForm, title: e.target.value })}
                  placeholder={t('ie.challengeTitlePlaceholder')}
                  required
                />
              </div>
              <div className="ie-form-field">
                <label>{t('ie.token')}</label>
                <select value={newChallengeForm.token} onChange={e => setNewChallengeForm({ ...newChallengeForm, token: e.target.value })}>
                  <option value="USDC">USDC (Conectado)</option>
                  <option value="ZNU">ZNU (Postmonetario)</option>
                </select>
              </div>
              <div className="ie-form-field">
                <label>{t('ie.milestones')}</label>
                {newChallengeForm.milestones.map((m, i) => (
                  <div key={i} className="ie-milestone-row">
                    <input
                      type="text"
                      placeholder={t('ie.milestoneTitle')}
                      value={m.title}
                      onChange={e => updateMilestone(i, 'title', e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder={t('ie.milestoneAmount')}
                      value={m.amount}
                      onChange={e => updateMilestone(i, 'amount', e.target.value)}
                      step="1000"
                    />
                    <input
                      type="number"
                      placeholder={t('ie.approvalsRequired')}
                      value={m.approvalsRequired}
                      onChange={e => updateMilestone(i, 'approvalsRequired', e.target.value)}
                      min="1"
                    />
                    {newChallengeForm.milestones.length > 1 && (
                      <button type="button" className="ie-btn-remove" onClick={() => removeMilestone(i)}>×</button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="secondary" size="sm" onClick={addMilestone}>
                  <Icon name="Plus" size={14} /> {t('ie.addMilestone')}
                </Button>
              </div>
              <div className="ie-modal-actions">
                <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>
                  {t('ie.cancel')}
                </Button>
                <Button type="submit" variant="primary">
                  {t('ie.create')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="ie-toasts">
        {useIEProtocolStore(s => s.ui.toasts).map(toast => (
          <Toast key={toast.id} toast={toast} onClose={() => useIEProtocolStore.getState().removeToast(toast.id)} />
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// SUB-COMPONENTES
// ============================================================================

const KPICard: React.FC<{ title: string; value: string | number; icon: string; color: string }> = ({ title, value, icon, color }) => (
  <Card className="ie-kpi-card">
    <div className="ie-kpi-header">
      <Icon name={icon} size={24} style={{ color }} />
    </div>
    <div className="ie-kpi-value" style={{ color }}>{value}</div>
    <div className="ie-kpi-title">{title}</div>
  </Card>
);

const ChallengeCard: React.FC<{ challenge: ReturnType<typeof ieSelectChallengesSummary>[0] }> = ({ challenge }) => {
  const navigate = () => {
    useIEProtocolStore.getState().setSelectedChallenge(challenge.id);
    useIEProtocolStore.getState().setScreen('workspace');
  };
  
  const releasedPct = challenge.milestoneCount > 0 
    ? Math.round((challenge.releasedMilestoneCount / challenge.milestoneCount) * 100) 
    : 0;

  return (
    <Card className="ie-challenge-card" onClick={navigate}>
      <div className="ie-challenge-header">
        <div>
          <h4>{challenge.title}</h4>
          <span className="ie-challenge-meta">
            <Badge variant={challenge.status === 'active' ? 'success' : challenge.status === 'completed' ? 'info' : 'secondary'}>
              {challenge.status}
            </Badge>
            <span>Lvl {challenge.level}</span>
            <span>{challenge.participantCount} {t('ie.participants')}</span>
          </span>
        </div>
      </div>
      <div className="ie-challenge-metrics">
        <div className="ie-metric">
          <span className="ie-metric-label">{t('ie.funded')}</span>
          <span className="ie-metric-value">{ieFormatUSDC(challenge.funded)}</span>
        </div>
        <div className="ie-metric">
          <span className="ie-metric-label">{t('ie.released')}</span>
          <span className="ie-metric-value">{ieFormatUSDC(challenge.released)}</span>
        </div>
        <div className="ie-metric">
          <span className="ie-metric-label">{t('ie.consensus')}</span>
          <span className="ie-metric-value">{releasedPct}%</span>
        </div>
      </div>
      <div className="ie-challenge-progress">
        <div className="ie-progress-bar">
          <div className="ie-progress-fill" style={{ width: `${releasedPct}%` }}></div>
        </div>
        <span className="ie-progress-text">{challenge.releasedMilestoneCount}/{challenge.milestoneCount} {t('ie.milestonesReleased')}</span>
      </div>
      <div className="ie-challenge-actions">
        <Button variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); navigate(); }}>
          <Icon name="ArrowRight" size={14} /> {t('ie.open')}
        </Button>
      </div>
    </Card>
  );
};

const Toast: React.FC<{ toast: any; onClose: () => void }> = ({ toast, onClose }) => (
  <div className={`ie-toast ie-toast-${toast.type}`} role="alert">
    <div className="ie-toast-content">
      <div className="ie-toast-title">{toast.title}</div>
      <div className="ie-toast-message">{toast.message}</div>
    </div>
    <button className="ie-toast-close" onClick={onClose}>×</button>
  </div>
);

export default IEChallengeDashboard;