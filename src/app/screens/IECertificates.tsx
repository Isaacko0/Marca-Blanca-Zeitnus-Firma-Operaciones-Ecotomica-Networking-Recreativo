// IECertificates.tsx — Certificados de impacto + Reputación (atestaciones soulbound)

import React, { useMemo } from 'react';
import { useIEProtocolStore, useIEGlobalMetrics } from '@core/state/hooks/ie-protocol';
import { IMImpactCert, IEAttestation } from '@core/lib/ie-types';
import { ieFormatUSDC, ieFormatBigInt } from '@core/lib/ie-rce-math';
import { Card } from '@core/ui/Card';
import { Badge } from '@core/ui/Badge';
import { Icon } from '@core/ui/Icon';
import { Tabs } from '@core/ui/Tabs';
import { t } from '@core/lib/i18n';

export const IECertificates: React.FC = () => {
  const impactCerts = useIEProtocolStore(s => s.impactCerts);
  const certsOfChallenge = useIEProtocolStore(s => s.certsOfChallenge);
  const challenges = useIEProtocolStore(s => s.challenges);
  const attestations = useIEProtocolStore(s => s.attestations);
  const receivedAttestations = useIEProtocolStore(s => s.receivedAttestations);
  const getAttestations = useIEProtocolStore(s => s.getAttestations);
  const reputationScore = useIEProtocolStore(s => s.getReputation('current-user-did')); // TODO: holder actual

  // Mis certificados
  const myCerts = useMemo(() => impactCerts.filter(c => 
    // TODO: filtrar por holder actual
    true
  ), [impactCerts]);

  // Mis atestaciones por schema
  const myContributions = useMemo(() => getAttestations('current-user-did', 'contribution'), [getAttestations]);
  const myConsensus = useMemo(() => getAttestations('current-user-did', 'consensus'), [getAttestations]);
  const myRoles = useMemo(() => getAttestations('current-user-did', 'role'), [getAttestations]);
  const myImpacts = useMemo(() => getAttestations('current-user-did', 'impact'), [getAttestations]);

  return (
    <div className="ie-certificates">
      <header className="ie-certificates-header">
        <div>
          <h2>
            <Icon name="Award" size={28} style={{ color: 'var(--amber)' }} />
            {t('title.ieCertificates')}
          </h2>
          <p className="ie-certificates-subtitle">{t('ie.certificatesSubtitle')}</p>
        </div>
        <div className="ie-reputation-summary">
          <div className="ie-rep-score">
            <span className="ie-rep-value">{reputationScore}</span>
            <span className="ie-rep-label">{t('ie.reputationScore')}</span>
          </div>
        </div>
      </header>

      <Tabs defaultValue="impact" className="ie-cert-tabs">
        <Tabs.List>
          <Tabs.Trigger value="impact">
            <Icon name="Award" size={16} /> {t('ie.impactCertificates')} ({impactCerts.length})
          </Tabs.Trigger>
          <Tabs.Trigger value="contributions">
            <Icon name="FileText" size={16} /> {t('ie.contributions')} ({myContributions.length})
          </Tabs.Trigger>
          <Tabs.Trigger value="consensus">
            <Icon name="CheckCircle" size={16} /> {t('ie.consensusAttestations')} ({myConsensus.length})
          </Tabs.Trigger>
          <Tabs.Trigger value="roles">
            <Icon name="UserCog" size={16} /> {t('ie.roles')} ({myRoles.length})
          </Tabs.Trigger>
        </Tabs.List>

        {/* Impact Certificates */}
        <Tabs.Content value="impact">
          <div className="ie-certs-grid">
            {impactCerts.length === 0 ? (
              <div className="ie-empty-state">
                <Icon name="Award" size={64} style={{ opacity: 0.3 }} />
                <h3>{t('ie.noImpactCerts')}</h3>
                <p>{t('ie.earnByCompleting')}</p>
              </div>
            ) : (
              impactCerts.map(cert => (
                <ImpactCertCard key={cert.id} cert={cert} challenge={challenges[cert.challengeId]} />
              ))
            )}
          </div>
        </Tabs.Content>

        {/* Contributions */}
        <Tabs.Content value="contributions">
          <AttestationList attestations={myContributions} schema="contribution" />
        </Tabs.Content>

        {/* Consensus */}
        <Tabs.Content value="consensus">
          <AttestationList attestations={myConsensus} schema="consensus" />
        </Tabs.Content>

        {/* Roles */}
        <Tabs.Content value="roles">
          <AttestationList attestations={myRoles} schema="role" />
        </Tabs.Content>
      </Tabs>
    </div>
  );
};

const ImpactCertCard: React.FC<{ cert: IMImpactCert; challenge?: any }> = ({ cert, challenge }) => (
  <Card className="ie-impact-cert-card">
    <div className="ie-cert-header">
      <div className="ie-cert-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </div>
      <Badge variant="success">{t('ie.verified')}</Badge>
    </div>
    <h4>{cert.uri}</h4>
    <div className="ie-cert-meta">
      <div className="ie-cert-field">
        <span className="ie-cert-label">{t('ie.impact')}</span>
        <span className="ie-cert-value">{ieFormatUSDC(cert.impact)}</span>
      </div>
      <div className="ie-cert-field">
        <span className="ie-cert-label">{t('ie.contributors')}</span>
        <span className="ie-cert-value">{cert.contributors}</span>
      </div>
      <div className="ie-cert-field">
        <span className="ie-cert-label">{t('ie.date')}</span>
        <span className="ie-cert-value">{new Date(cert.time).toLocaleDateString()}</span>
      </div>
      {challenge && (
        <div className="ie-cert-field">
          <span className="ie-cert-label">{t('ie.challenge')}</span>
          <span className="ie-cert-value">{challenge.metaURI.slice(0, 50)}...</span>
        </div>
      )}
    </div>
    <div className="ie-cert-footer">
      <span className="ie-cert-id">#{cert.id.slice(0, 12)}...</span>
    </div>
  </Card>
);

const AttestationList: React.FC<{ attestations: IEAttestation[]; schema: string }> = ({ attestations, schema }) => {
  if (attestations.length === 0) {
    return (
      <div className="ie-empty-state">
        <Icon name="FileText" size={64} style={{ opacity: 0.3 }} />
        <h3>{t('ie.noAttestations', { schema })}</h3>
      </div>
    );
  }

  return (
    <div className="ie-attestation-list">
      {attestations.map(att => {
        let data: any = {};
        try { data = JSON.parse(att.data); } catch {}
        
        return (
          <Card key={att.uid} className="ie-attestation-card">
            <div className="ie-att-header">
              <Badge variant={att.revoked ? 'secondary' : 'success'}>
                {att.revoked ? t('ie.revoked') : t('ie.valid')}
              </Badge>
              <span className="ie-att-date">{new Date(att.time).toLocaleString()}</span>
            </div>
            <div className="ie-att-data">
              {data.workURI && <div><strong>{t('ie.workURI')}:</strong> {data.workURI}</div>}
              {data.challengeId && <div><strong>{t('ie.challenge')}:</strong> {data.challengeId}</div>}
              {data.milestoneTitle && <div><strong>{t('ie.milestone')}:</strong> {data.milestoneTitle}</div>}
              {data.role && <div><strong>{t('ie.role')}:</strong> {data.role}</div>}
            </div>
            <div className="ie-att-footer">
              <span className="ie-att-uid">{att.uid.slice(0, 20)}...</span>
              <span className="ie-att-schema">{schema}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default IECertificates;