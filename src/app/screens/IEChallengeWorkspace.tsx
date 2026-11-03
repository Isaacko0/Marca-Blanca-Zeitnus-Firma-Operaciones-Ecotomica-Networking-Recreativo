// IEChallengeWorkspace.tsx — Vista principal de trabajo en un desafío
// Árbol triádico + hitos + panel posición + IA facilitador + mi estado

import React, { useEffect, useRef, useState } from 'react';
import { useIEProtocolStore, useIEChallenge, useIEPosition, useIEAddToast, useIERemoveToast } from '@core/state/hooks/ie-protocol';
import { ieFormatUSDC, ieFormatBigInt } from '@core/lib/ie-rce-math';
import { IETreeView } from './IETreeView';
import { IEAIAgentPanel } from './IEAIAgentPanel';
import { IEMilestoneTimeline } from './IEMilestoneTimeline';
import { Button } from '@core/ui/Button';
import { Card } from '@core/ui/Card';
import { Badge } from '@core/ui/Badge';
import { Icon } from '@core/ui/Icon';
import { t } from '@core/lib/i18n';

interface IEChallengeWorkspaceProps {
  challengeId: string;
}

export const IEChallengeWorkspace: React.FC<IEChallengeWorkspaceProps> = ({ challengeId }) => {
  const { challenge, positions, milestones, a3, loading, refresh } = useIEChallenge(challengeId);
  const addToast = useIEAddToast();
  const removeToast = useIERemoveToast();
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [stakeAmt, setStakeAmt] = useState<number>(2000);
  const [giveAmt, setGiveAmt] = useState<number>(20);
  const [busy, setBusy] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  const [myClaimable, setMyClaimable] = useState<bigint>(0n);
  const [myRep, setMyRep] = useState<bigint>(0n);
  const [myGive, setMyGive] = useState<bigint>(0n);
  const [celebrate, setCelebrate] = useState<number>(0);
  const prevReleased = useRef<number>(-1);

  // Acciones del store
  const seed = useIEProtocolStore(s => s.seed);
  const join = useIEProtocolStore(s => s.join);
  const setCoordinator = useIEProtocolStore(s => s.setCoordinator);
  const contribute = useIEProtocolStore(s => s.contribute);
  const approveMilestone = useIEProtocolStore(s => s.approveMilestone);
  const releaseMilestone = useIEProtocolStore(s => s.releaseMilestone);
  const claim = useIEProtocolStore(s => s.claim);
  const stake = useIEProtocolStore(s => s.stake);
  const unstake = useIEProtocolStore(s => s.unstake);
  const allocateGive = useIEProtocolStore(s => s.allocateGive);

  // Datos derivados
  const selected = selectedId ? positions.find(p => p.id === selectedId) || null : null;
  const activeMilestone = milestones.find(m => !m.released) ?? milestones[0];
  const isParticipant = !!challenge && positions.some(p => p.holder === 'current-user-did'); // TODO: get from Poh

  // Detectar nuevo release para celebrar
  useEffect(() => {
    const releasedCount = milestones.filter(m => m.released).length;
    if (prevReleased.current !== -1 && releasedCount > prevReleased.current) {
      setCelebrate(c => c + 1);
    }
    prevReleased.current = releasedCount;
  }, [milestones]);

  useEffect(() => {
    if (celebrate === 0) return;
    const t = setTimeout(() => setCelebrate(0), 4200);
    return () => clearTimeout(t);
  }, [celebrate]);

  // Cargar mi estado
  useEffect(() => {
    if (!challenge) return;
    // TODO: obtener holder actual de Poh
    const holder = 'current-user-did';
    setMyClaimable(useIEProtocolStore.getState().getClaimable(challengeId, holder));
    setMyRep(BigInt(useIEProtocolStore.getState().getReputation(holder)));
    setMyGive(useIEProtocolStore.getState().getGiveRemaining(challengeId, holder));
  }, [challengeId, positions, milestones]);

  async function runAction(key: string, fn: () => Promise<any>) {
    setBusy(key);
    setTxError(null);
    try {
      await fn();
      await refresh();
    } catch (e: any) {
      setTxError(e?.shortMessage ?? e?.message ?? t('ie.txError'));
      addToast({ id: `err-${key}`, type: 'error', title: t('ie.error'), message: e?.message ?? t('ie.txError'), createdAt: Date.now() });
    } finally {
      setBusy(null);
    }
  }

  if (loading && !challenge) return <div className="ie-loading">{t('ie.loading')}</div>;
  if (!challenge) return <div className="ie-not-found">{t('ie.challengeNotFound')}</div>;

  // Derivar posición seleccionada fresca
  const selectedPosition = selectedId ? positions.find(p => p.id === selectedId) ?? null : null;
  const giveInt = BigInt(Number.isFinite(giveAmt) ? Math.max(0, Math.floor(giveAmt)) : 0);

  return (
    <div className="ie-workspace">
      {/* Toast celebración */}
      {celebrate > 0 && (
        <div className="ie-celebration-toast">
          <Icon name="Coins" size={24} /> {t('ie.rceDistributed')} {positions.length} {t('ie.positions')}
        </div>
      )}

      {/* Header */}
      <div className="ie-workspace-header">
        <div>
          <div className="ie-workspace-meta">#{challengeId}</div>
          <h1>{challenge.metaURI} {challenge.closed && <Badge variant="secondary">{t('ie.closed')}</Badge>}</h1>
          <div className="ie-workspace-funder">
            {t('ie.funder')}: <span className="ie-address">{challenge.funder.slice(0, 10)}...</span>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="ie-kpis">
        <KPICard label={t('ie.escrowNet')} value={ieFormatUSDC(challenge.funded)} icon="Vault" />
        <KPICard label={t('ie.released')} value={ieFormatUSDC(challenge.released)} icon="ArrowUpRight" />
        <KPICard label={t('ie.networkLevel')} value={challenge.level.toString()} icon="Layers" />
        <KPICard label={t('ie.positionsA3')} value={`${positions.length} · ${a3.toString()}`} icon="GitBranch" />
      </div>

      {txError && <div className="ie-error-toast">{txError}</div>}

      {/* Main Grid: Tree + Panel Derecho */}
      <div className="ie-workspace-grid">
        {/* LEFT: Red + Árbol */}
        <div className="ie-workspace-left">
          <Card className="ie-network-card">
            <div className="ie-card-header">
              <h3>
                <Icon name="GitBranch" size={18} /> {t('ie.triadicNetwork')}
              </h3>
              <Button
                variant="primary"
                size="sm"
                disabled={busy !== null || (challenge?.seedCount ?? 0) >= 3}
                onClick={() => runAction('seed', () => seed(challengeId, 'current-user-did'))}
              >
                {challenge.seedCount >= 3 ? t('ie.seedsFull') : `${t('ie.seed')} (${challenge.seedCount}/3)`}
              </Button>
            </div>
            <p className="ie-card-hint">{t('ie.clickToJoin')}</p>
            
            <div className="ie-tree-wrapper">
              <IETreeView
                positions={positions}
                selectedId={selectedId}
                onSelect={p => setSelectedId(p.id)}
                pulse={celebrate}
                giveFlows={[]} // TODO: obtener de store
              />
            </div>
          </Card>
        </div>

        {/* RIGHT: Panel posición + Mi estado + Hitos + IA */}
        <div className="ie-workspace-right">
          {/* Posición seleccionada */}
          <Card className="ie-position-panel">
            <h3>{t('ie.selectedPosition')}</h3>
            {!selectedPosition ? (
              <p className="ie-no-selection">{t('ie.selectPosition')}</p>
            ) : (
              <>
                <div className="ie-position-header">
                  <span className="ie-position-id">#{selectedPosition.id}</span>
                  <Badge variant={
                    selectedPosition.weightClass === 'full' ? 'success' :
                    selectedPosition.weightClass === 'low' ? 'secondary' : 'info'
                  }>
                    {t(`ie.weightClass.${selectedPosition.weightClass}`)} ({t(`ie.weightRatio.${selectedPosition.weightClass}`)})
                  </Badge>
                </div>
                <div className="ie-position-meta">
                  <span>{t('ie.holder')}: <code>{selectedPosition.holder.slice(0, 12)}...</code></span>
                  <span>{t('ie.depth')}: {selectedPosition.depth}</span>
                  <span>{t('ie.invited')}: {selectedPosition.childCount}/3</span>
                  {selectedPosition.isCoordinator && <Badge variant="warning">{t('ie.coordinator')}</Badge>}
                </div>

                {/* Proyección RCE */}
                {activeMilestone && !activeMilestone.released && a3 > 0n && (
                  <div className="ie-projected-payout">
                    {t('ie.projectedPayout')} <strong>"{activeMilestone.title}"</strong>:
                    <span className="ie-payout-value">
                      {ieFormatUSDC((activeMilestone.amount * selectedPosition.effectiveWeight) / a3)}
                    </span>
                  </div>
                )}

                {/* Peso efectivo desglosado */}
                <div className="ie-weight-breakdown">
                  <span className="ie-breakdown-label">{t('ie.effectiveWeight')}</span>
                  <strong>
                    {selectedPosition.effectiveWeight.toString()}{' '}
                    <span className="ie-breakdown-detail">
                      = {t('ie.class')} {selectedPosition.weightClass === 'full' ? '3' : selectedPosition.weightClass === 'low' ? '2' : '1'}
                      {selectedPosition.stake > 0n && (
                        <span className="ie-bonus ie-bonus-stake">
                          +{t('ie.stakeBonus')} {ieCalculateStakeBonusDisplay(selectedPosition.stake)}
                        </span>
                      )}
                      {selectedPosition.giveReceived > 0n && (
                        <span className="ie-bonus ie-bonus-give">
                          +{t('ie.giveBonus')} {ieCalculateGiveBonusDisplay(selectedPosition.giveReceived)}
                        </span>
                      )}
                    </span>
                  </strong>
                </div>

                {(selectedPosition.stake > 0n || selectedPosition.giveReceived > 0n) && (
                  <div className="ie-stake-give-display">
                    <span>{t('ie.stake')}: {ieFormatUSDC(selectedPosition.stake)}</span>
                    <span>{t('ie.giveReceived')}: {selectedPosition.giveReceived.toString()}</span>
                  </div>
                )}

                {/* Acciones posición */}
                <div className="ie-position-actions">
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={busy !== null || selectedPosition.childCount >= 3}
                    onClick={() => runAction('join', () => join(challengeId, selectedPosition.id, 'current-user-did'))}
                  >
                    {selectedPosition.childCount >= 3 ? t('ie.full') : t('ie.joinBelow')}
                  </Button>
                  
                  {isParticipant && (
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={busy !== null}
                      onClick={() => runAction('contribute', () => contribute(challengeId, selectedPosition.id, `ipfs://aporte/${selectedPosition.id}`))}
                    >
                      {t('ie.contribute')}
                    </Button>
                  )}
                </div>
              </>
            )}
          </Card>

          {/* Mi estado */}
          <Card className="ie-my-status">
            <h3>{t('ie.myStatus')}</h3>
            <div className="ie-status-grid">
              <StatusItem label={t('ie.claimableRCE')} value={ieFormatUSDC(myClaimable)} icon="Coins" />
              <StatusItem label={t('ie.reputation')} value={myRep.toString()} icon="Award" />
              <StatusItem label={t('ie.giveRemaining')} value={myGive.toString()} icon="Heart" />
            </div>
            {myClaimable > 0n && (
              <Button
                variant="primary"
                size="sm"
                className="ie-claim-btn"
                disabled={busy !== null}
                onClick={() => runAction('claim', () => claim(challengeId, 'current-user-did'))}
              >
                {t('ie.claimRCE')}
              </Button>
            )}
          </Card>

          {/* Hitos */}
          <Card className="ie-milestones-card">
            <IEMilestoneTimeline
              challengeId={challengeId}
              milestones={milestones}
              positions={positions}
              onApprove={(milestoneId) => runAction('approve', () => approveMilestone(challengeId, milestoneId, 'current-user-did', selectedPosition?.id || ''))}
              onRelease={(milestoneId) => runAction('release', () => releaseMilestone(challengeId, milestoneId))}
              busy={busy}
            />
          </Card>

          {/* IA Facilitador */}
          {activeMilestone && (
            <Card className="ie-ai-card">
              <IEAIAgentPanel
                challengeTitle={challenge.metaURI}
                milestoneTitle={activeMilestone.title}
                milestones={milestones.map(m => ({
                  title: m.title,
                  released: m.released,
                  approvals: m.approvals,
                  approvalsRequired: m.approvalsRequired,
                }))}
              />
            </Card>
          )}
        </div>
      </div>

      {/* Toasts */}
      <div className="ie-toasts">
        {useIEProtocolStore(s => s.ui.toasts).map(toast => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// HELPERS
// ============================================================================

function ieCalculateStakeBonusDisplay(stake: bigint): number {
  return Number(stake / 1_000_000_000n) > 6 ? 6 : Number(stake / 1_000_000_000n);
}

function ieCalculateGiveBonusDisplay(give: bigint): number {
  return Number(give / 20n) > 5 ? 5 : Number(give / 20n);
}

// ============================================================================
// SUB-COMPONENTES
// ============================================================================

const KPICard: React.FC<{ label: string; value: string; icon: string }> = ({ label, value, icon }) => (
  <Card className="ie-kpi-card">
    <div className="ie-kpi-header">
      <Icon name={icon} size={20} />
    </div>
    <div className="ie-kpi-value">{value}</div>
    <div className="ie-kpi-label">{label}</div>
  </Card>
);

const StatusItem: React.FC<{ label: string; value: string; icon: string }> = ({ label, value, icon }) => (
  <div className="ie-status-item">
    <div className="ie-status-icon"><Icon name={icon} size={18} /></div>
    <div>
      <div className="ie-status-value">{value}</div>
      <div className="ie-status-label">{label}</div>
    </div>
  </div>
);

const Toast: React.FC<{ toast: any; onClose: () => void }> = ({ toast, onClose }) => (
  <div className={`ie-toast ie-toast-${toast.type}`} role="alert">
    <div className="ie-toast-content">
      <div className="ie-toast-title">{toast.title}</div>
      <div className="ie-toast-message">{toast.message}</div>
    </div>
    <button className="ie-toast-close" onClick={onClose}>×</button>
  </div>
);

export default IEChallengeWorkspace;