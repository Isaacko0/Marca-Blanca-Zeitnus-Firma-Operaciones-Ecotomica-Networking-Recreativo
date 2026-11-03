// IEAIAgentPanel.tsx — Facilitador IA para consenso (adaptado de AgentPanel.tsx WhatMatters)
// Human-in-the-loop: IA propone, personas deciden

import React, { useState } from 'react';
import { Button } from '@core/ui/Button';
import { Badge } from '@core/ui/Badge';
import { Icon } from '@core/ui/Icon';
import { t } from '@core/lib/i18n';

interface IESynthesisResult {
  summary: string;
  recommendation: 'approve' | 'revise' | 'reject';
  rationale: string;
  openQuestions: string[];
  stub?: boolean;
}

interface IEReportResult {
  report: string;
  stub?: boolean;
}

interface MilestoneLite {
  title: string;
  released: boolean;
  approvals: number;
  approvalsRequired: number;
}

const REC_LABEL: Record<string, string> = {
  approve: t('ie.approveMilestone'),
  revise: t('ie.reviseBeforeApprove'),
  reject: t('ie.doNotApprove'),
};

const REC_BADGE: Record<string, 'success' | 'warning' | 'danger'> = {
  approve: 'success',
  revise: 'warning',
  reject: 'danger',
};

export interface IEAIAgentPanelProps {
  challengeTitle: string;
  milestoneTitle: string;
  milestones: MilestoneLite[];
}

export const IEAIAgentPanel: React.FC<IEAIAgentPanelProps> = ({
  challengeTitle,
  milestoneTitle,
  milestones,
}) => {
  const [contributions, setContributions] = useState('');
  const [loading, setLoading] = useState<'synth' | 'report' | null>(null);
  const [synthesis, setSynthesis] = useState<IESynthesisResult | null>(null);
  const [report, setReport] = useState<IEReportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const synthesize = async () => {
    setLoading('synth');
    setError(null);
    setSynthesis(null);
    try {
      const result = await useIEProtocolStore.getState().synthesizeConsensus({
        challengeTitle,
        milestoneTitle,
        contributions,
      });
      setSynthesis(result);
    } catch (e: any) {
      setError(e?.message ?? t('ie.agentError'));
    } finally {
      setLoading(null);
    }
  };

  const makeReport = async () => {
    setLoading('report');
    setError(null);
    setReport(null);
    try {
      const result = await useIEProtocolStore.getState().generateFunderReport({
        challengeTitle,
        milestones,
        contributions,
      });
      setReport(result);
    } catch (e: any) {
      setError(e?.message ?? t('ie.agentError'));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="ie-ai-panel">
      <div className="ie-ai-header">
        <h3>
          <Icon name="Bot" size={20} /> {t('ie.aiFacilitator')}
        </h3>
        <p className="ie-ai-description">
          {t('ie.aiDescription', { milestoneTitle })}
        </p>
      </div>

      <label className="ie-ai-field">
        {t('ie.groupContributions')}
      </label>
      <textarea
        rows={5}
        placeholder={t('ie.contributionsPlaceholder')}
        value={contributions}
        onChange={e => setContributions(e.target.value)}
        className="ie-ai-textarea"
      />

      <div className="ie-ai-actions">
        <Button
          variant="primary"
          onClick={synthesize}
          disabled={loading !== null || contributions.trim().length < 10}
          className={loading === 'synth' ? 'ie-loading' : ''}
        >
          {loading === 'synth' ? t('ie.synthesizing') : t('ie.synthesizeConsensus')}
        </Button>
        <Button
          variant="secondary"
          onClick={makeReport}
          disabled={loading !== null || contributions.trim().length < 10}
          className={loading === 'report' ? 'ie-loading' : ''}
        >
          {loading === 'report' ? t('ie.generatingReport') : t('ie.funderReport')}
        </Button>
      </div>

      {error && (
        <div className="ie-ai-error">{error}</div>
      )}

      {synthesis && (
        <div className="ie-ai-result">
          {synthesis.stub && (
            <div className="ie-ai-stub">
              <Icon name="AlertTriangle" size={16} />
              {t('ie.stubMode')}
            </div>
          )}
          <div className="ie-ai-recommendation">
            <Badge variant={REC_BADGE[synthesis.recommendation]}>
              {REC_LABEL[synthesis.recommendation] ?? synthesis.recommendation}
            </Badge>
          </div>
          <div className="ie-ai-section">
            <h4>{t('ie.synthesis')}</h4>
            <p>{synthesis.summary}</p>
          </div>
          <div className="ie-ai-section">
            <h4>{t('ie.rationale')}</h4>
            <p className="ie-ai-rationale">{synthesis.rationale}</p>
          </div>
          {synthesis.openQuestions?.length > 0 && (
            <div className="ie-ai-section">
              <h4>{t('ie.openQuestions')}</h4>
              <ul>
                {synthesis.openQuestions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {report && (
        <div className="ie-ai-report">
          {report.stub && (
            <div className="ie-ai-stub">
              <Icon name="AlertTriangle" size={16} />
              {t('ie.stubModeReport')}
            </div>
          )}
          <div className="ie-ai-report-content" style={{ whiteSpace: 'pre-wrap' }}>
            {report.report}
          </div>
        </div>
      )}
    </div>
  );
};

// Import store hook
import { useIEProtocolStore } from '@core/state/hooks/ie-protocol';

export default IEAIAgentPanel;