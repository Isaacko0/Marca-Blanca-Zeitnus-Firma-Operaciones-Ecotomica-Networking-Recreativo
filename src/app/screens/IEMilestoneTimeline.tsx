// IEMilestoneTimeline.tsx — Línea de tiempo de hitos con progreso de consenso
// Adaptado de MilestoneTimeline.tsx WhatMatters

import React from 'react';
import { IEMilestone, IEPosition } from '@core/lib/ie-types';
import { ieFormatUSDC, ieFormatBigInt } from '@core/lib/ie-rce-math';
import { Button } from '@core/ui/Button';
import { Badge } from '@core/ui/Badge';
import { Progress } from '@core/ui/Progress';
import { Icon } from '@core/ui/Icon';
import { t } from '@core/lib/i18n';

interface IEMilestoneTimelineProps {
  challengeId: string;
  milestones: IEMilestone[];
  positions: IEPosition[];
  onApprove: (milestoneId: string) => void;
  onRelease: (milestoneId: string) => void;
  busy: string | null;
}

export const IEMilestoneTimeline: React.FC<IEMilestoneTimelineProps> = ({
  challengeId,
  milestones,
  positions,
  onApprove,
  onRelease,
  busy,
}) => {
  const a3 = positions.reduce((sum, p) => sum + p.effectiveWeight, 0n);

  return (
    <div className="ie-milestone-timeline">
      <h3>
        <Icon name="Flag" size={18} /> {t('ie.milestones')}
      </h3>
      
      {milestones.length === 0 ? (
        <p className="ie-no-milestones">{t('ie.noMilestones')}</p>
      ) : (
        <div className="ie-milestone-list">
          {milestones.map((milestone, idx) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              index={idx}
              a3={a3}
              positions={positions}
              onApprove={onApprove}
              onRelease={onRelease}
              busy={busy}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const MilestoneCard: React.FC<{
  milestone: IEMilestone;
  index: number;
  a3: bigint;
  positions: IEPosition[];
  onApprove: (milestoneId: string) => void;
  onRelease: (milestoneId: string) => void;
  busy: string | null;
}> = ({ milestone, index, a3, positions, onApprove, onRelease, busy }) => {
  const isReleased = milestone.released;
  const progress = milestone.approvalsRequired > 0 
    ? Math.min(100, (milestone.approvals / milestone.approvalsRequired) * 100)
    : 0;

  // Calcular proyección por clase de peso
  const projectedFull = milestone.amount * 3n / (a3 || 1n);
  const projectedLow = milestone.amount * 2n / (a3 || 1n);
  const projectedMid = milestone.amount * 1n / (a3 || 1n);

  return (
    <div className={`ie-milestone-card ${isReleased ? 'ie-released' : ''} ${milestone.approvals >= milestone.approvalsRequired && !isReleased ? 'ie-ready' : ''}`}>
      <div className="ie-milestone-header">
        <div className="ie-milestone-title-row">
          <span className="ie-milestone-number">{index + 1}</span>
          <h4>{milestone.title}</h4>
          <Badge variant={isReleased ? 'success' : milestone.approvals >= milestone.approvalsRequired ? 'warning' : 'secondary'}>
            {isReleased ? t('ie.released') : milestone.approvals >= milestone.approvalsRequired ? t('ie.readyToRelease') : t('ie.pending')}
          </Badge>
        </div>
        <div className="ie-milestone-amount">
          {ieFormatUSDC(milestone.amount)}
        </div>
      </div>

      {!isReleased && (
        <div className="ie-milestone-progress">
          <div className="ie-progress-row">
            <span>{t('ie.consensus')}: {milestone.approvals}/{milestone.approvalsRequired}</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} max={100} className="ie-milestone-progress-bar" />
        </div>
      )}

      <div className="ie-milestone-projection">
        <h5>{t('ie.projectedPayouts')}</h5>
        <div className="ie-projection-grid">
          <ProjectionItem 
            label={t('ie.weightClass.full')} 
            value={ieFormatUSDC(projectedFull)} 
            color="var(--full)" 
          />
          <ProjectionItem 
            label={t('ie.weightClass.low')} 
            value={ieFormatUSDC(projectedLow)} 
            color="var(--low)" 
          />
          <ProjectionItem 
            label={t('ie.weightClass.mid')} 
            value={ieFormatUSDC(projectedMid)} 
            color="var(--mid)" 
          />
        </div>
      </div>

      <div className="ie-milestone-actions">
        {!isReleased && milestone.approvals < milestone.approvalsRequired && (
          <Button
            variant="secondary"
            size="sm"
            disabled={busy !== null}
            onClick={() => onApprove(milestone.id)}
          >
            <Icon name="Check" size={14} /> {t('ie.approve')}
          </Button>
        )}
        {!isReleased && milestone.approvals >= milestone.approvalsRequired && (
          <Button
            variant="primary"
            size="sm"
            disabled={busy !== null}
            onClick={() => onRelease(milestone.id)}
          >
            <Icon name="Unlock" size={14} /> {t('ie.releaseAndDistribute')}
          </Button>
        )}
        {isReleased && (
          <Badge variant="success">
            <Icon name="CheckCircle" size={14} /> {t('ie.releasedAt')} {milestone.releasedAt ? new Date(milestone.releasedAt).toLocaleString() : ''}
          </Badge>
        )}
      </div>

      {milestone.a3AtRelease && (
        <div className="ie-milestone-a3">
          {t('ie.a3AtRelease')}: {ieFormatBigInt(milestone.a3AtRelease)}
        </div>
      )}
    </div>
  );
};

const ProjectionItem: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="ie-projection-item">
    <span className="ie-projection-label" style={{ borderLeftColor: color }}>{label}</span>
    <span className="ie-projection-value" style={{ color }}>{value}</span>
  </div>
);

export default IEMilestoneTimeline;