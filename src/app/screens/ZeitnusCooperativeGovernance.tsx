// ZeitnusCooperativeGovernance.tsx — Pantalla de Gobernanza Corporativa y Transparencia
// Principio Anfibio: transparencia como ventaja competitiva, no obligación incómoda

import React, { useState, useMemo } from 'react';
import { useZeitnusCooperativeStore } from '@core/state/hooks/zeitnus-cooperative';
import { ensureTransparency } from '@core/lib/zeitnus-cooperative';
import { Icon } from '@core/ui/Icon';
import { Button } from '@core/ui/Button';
import { Card } from '@core/ui/Card';
import { Input } from '@core/ui/Input';
import { Select } from '@core/ui/Select';
import { Switch } from '@core/ui/Switch';
import { Tabs } from '@core/ui/Tabs';
import { Progress } from '@core/ui/Progress';
import { Badge } from '@core/ui/Badge';
import { Tooltip } from '@core/ui/Tooltip';
import { t } from '@core/lib/i18n';

export const ZeitnusCooperativeGovernance: React.FC = () => {
  const store = useZeitnusCooperativeStore();
  const governance = store.governance;
  const transparencyIndex = store.transparencyIndex;
  const transparencyMechanisms = store.transparencyMechanisms;
  const actions = store;

  const transparencyResult = useMemo(() =>
    ensureTransparency({
      financialInfoPublished: transparencyMechanisms.some(m => m.type === 'info_financiera' && m.status === 'activo'),
      periodicReports: transparencyMechanisms.some(m => m.type === 'reportes_periodicos' && m.status === 'activo'),
      openCommunication: transparencyMechanisms.some(m => m.type === 'comunicacion_abierta' && m.status === 'activo'),
      auditsPerformed: transparencyMechanisms.filter(m => m.type === 'auditorias' && m.status === 'activo').length,
      decisionsRecorded: transparencyMechanisms.some(m => m.type === 'registro_decisiones' && m.status === 'activo'),
      associateParticipation: store.socialCapital.relacionesHumanas,
      conflictOfInterestPolicy: governance.board.conflictOfInterestPolicy,
      whistleblowerChannel: false,
    }), [transparencyMechanisms, store.socialCapital.relacionesHumanas, governance.board.conflictOfInterestPolicy]);

  const [activeTab, setActiveTab] = useState<'asamblea' | 'consejo' | 'gerencia' | 'comites' | 'transparencia' | 'conflictos' | 'auditoria'>('asamblea');
  const [showModal, setShowModal] = useState(false);
  const [newMechanism, setNewMechanism] = useState({ name: '', type: 'info_financiera', frequency: 'trimestral', responsible: '' });

  return (
    <div className="zeitnus-governance-screen">
      <header className="zeitnus-governance-header">
        <div className="zeitnus-governance-title">
          <Icon name="Gavel" size={28} style={{ color: 'var(--haiti)' }} />
          <h1>{t('zeitnusCooperative.governance.title')}</h1>
        </div>
        <div className="zeitnus-governance-transparency">
          <Progress value={transparencyIndex} max={100} showLabel label={t('zeitnusCooperative.governance.transparencyIndex')} />
        </div>
      </header>

      <Tabs value={activeTab} onChange={setActiveTab} className="zeitnus-governance-tabs">
        <Tabs.List>
          <Tabs.Trigger value="asamblea">👥 {t('zeitnusCooperative.governance.assembly')}</Tabs.Trigger>
          <Tabs.Trigger value="consejo">🛡️ {t('zeitnusCooperative.governance.board')}</Tabs.Trigger>
          <Tabs.Trigger value="gerencia">👔 {t('zeitnusCooperative.governance.management')}</Tabs.Trigger>
          <Tabs.Trigger value="comites">📋 {t('zeitnusCooperative.governance.committees')}</Tabs.Trigger>
          <Tabs.Trigger value="transparencia">🔍 {t('zeitnusCooperative.governance.transparency')}</Tabs.Trigger>
          <Tabs.Trigger value="conflictos">⚖️ {t('zeitnusCooperative.governance.conflicts')}</Tabs.Trigger>
          <Tabs.Trigger value="auditoria">📊 {t('zeitnusCooperative.governance.audit')}</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="asamblea">
          <AssemblyTab governance={governance} actions={store} />
        </Tabs.Content>

        <Tabs.Content value="consejo">
          <BoardTab governance={governance} actions={store} />
        </Tabs.Content>

        <Tabs.Content value="gerencia">
          <ManagementTab governance={governance} actions={store} />
        </Tabs.Content>

        <Tabs.Content value="comites">
          <CommitteesTab governance={governance} actions={store} />
        </Tabs.Content>

        <Tabs.Content value="transparencia">
          <TransparencyTab transparencyIndex={transparencyIndex} mechanisms={transparencyMechanisms} result={transparencyResult} showModal={showModal} setShowModal={setShowModal} newMechanism={newMechanism} setNewMechanism={setNewMechanism} actions={store} />
        </Tabs.Content>

        <Tabs.Content value="conflictos">
          <ConflictsTab governance={governance} actions={store} />
        </Tabs.Content>

        <Tabs.Content value="auditoria">
          <AuditTab governance={governance} actions={store} />
        </Tabs.Content>
      </Tabs>
    </div>
  );
};

// ============================================================================
// SUB-COMPONENTES
// ============================================================================

const AssemblyTab: React.FC<{ governance: any; actions: any }> = ({ governance, actions }) => (
  <div className="zeitnus-governance-tab">
    <div className="zeitnus-tab-header">
      <h3>👥 {t('zeitnusCooperative.governance.assembly')}</h3>
      <p>{t('zeitnusCooperative.governance.assemblyDesc')}</p>
    </div>

    <div className="zeitnus-governance-grid">
      <Card className="zeitnus-gov-card">
        <h4>{t('zeitnusCooperative.governance.frequency')}</h4>
        <Select
          value={governance.assembly.frequency}
          onChange={(e) => actions.updateAssembly({ frequency: e.target.value as any })}
          options={[
            { value: 'mensual', label: t('zeitnusCooperative.governance.monthly') },
            { value: 'trimestral', label: t('zeitnusCooperative.governance.quarterly') },
            { value: 'semestral', label: t('zeitnusCooperative.governance.semiannual') },
            { value: 'anual', label: t('zeitnusCooperative.governance.annual') },
          ]}
        />
      </Card>

      <Card className="zeitnus-gov-card">
        <h4>{t('zeitnusCooperative.governance.lastHeld')}</h4>
        <Input type="date" value={governance.assembly.lastHeld ? new Date(governance.assembly.lastHeld).toISOString().split('T')[0] : ''} onChange={(e) => actions.updateAssembly({ lastHeld: new Date(e.target.value).getTime() })} />
      </Card>

      <Card className="zeitnus-gov-card">
        <h4>{t('zeitnusCooperative.governance.attendanceRate')} (%)</h4>
        <input type="range" min="0" max="100" value={governance.assembly.attendanceRate} onChange={(e) => actions.updateAssembly({ attendanceRate: parseInt(e.target.value) })} />
        <span>{governance.assembly.attendanceRate}%</span>
      </Card>

      <Card className="zeitnus-gov-card">
        <h4>{t('zeitnusCooperative.governance.quorumMet')}</h4>
        <Switch checked={governance.assembly.quorumMet} onChange={(checked) => actions.updateAssembly({ quorumMet: checked })} />
      </Card>

      <Card className="zeitnus-gov-card" className="zeitnus-gov-card-full">
        <h4>{t('zeitnusCooperative.governance.assemblyActions')}</h4>
        <div className="zeitnus-assembly-actions">
          <Button variant="primary" onClick={() => { /* registrar asamblea */ }}>
            📝 {t('zeitnusCooperative.governance.recordAssembly')}
          </Button>
          <Button variant="secondary" onClick={() => { /* publicar acta */ }}>
            📄 {t('zeitnusCooperative.governance.publishMinutes')}
          </Button>
          <Button variant="secondary" onClick={() => { /* convocar */ }}>
            📢 {t('zeitnusCooperative.governance.callAssembly')}
          </Button>
        </div>
      </Card>

      <Card className="zeitnus-gov-card" className="zeitnus-gov-card-full">
        <h4>{t('zeitnusCooperative.governance.participationMechanisms')}</h4>
        <ul className="zeitnus-participation-list">
          <li>🗳️ {t('zeitnusCooperative.governance.electronicVoting')}</li>
          <li>💬 {t('zeitnusCooperative.governance.openQuestions')}</li>
          <li>📊 {t('zeitnusCooperative.governance.liveResults')}</li>
          <li>📱 {t('zeitnusCooperative.governance.mobileAccess')}</li>
        </ul>
      </Card>
    </div>
  </div>
);

const BoardTab: React.FC<{ governance: any; actions: any }> = ({ governance, actions }) => (
  <div className="zeitnus-governance-tab">
    <div className="zeitnus-tab-header">
      <h3>🛡️ {t('zeitnusCooperative.governance.board')}</h3>
      <p>{t('zeitnusCooperative.governance.boardDesc')}</p>
    </div>

    <div className="zeitnus-governance-grid">
      <Card className="zeitnus-gov-card">
        <h4>{t('zeitnusCooperative.governance.members')}</h4>
        <input type="number" min="3" max="21" value={governance.board.members} onChange={(e) => actions.updateBoard({ members: parseInt(e.target.value) })} />
      </Card>

      <Card className="zeitnus-gov-card">
        <h4>{t('zeitnusCooperative.governance.independentDirectors')}</h4>
        <input type="number" min="0" max={governance.board.members} value={governance.board.independentMembers} onChange={(e) => actions.updateBoard({ independentMembers: parseInt(e.target.value) })} />
      </Card>

      <Card className="zeitnus-gov-card">
        <h4>{t('zeitnusCooperative.governance.meetingsPerYear')}</h4>
        <input type="number" min="1" max="52" value={governance.board.meetingsPerYear} onChange={(e) => actions.updateBoard({ meetingsPerYear: parseInt(e.target.value) })} />
      </Card>

      <Card className="zeitnus-gov-card">
        <h4>{t('zeitnusCooperative.governance.lastMeeting')}</h4>
        <Input type="date" value={governance.board.lastMeeting ? new Date(governance.board.lastMeeting).toISOString().split('T')[0] : ''} onChange={(e) => actions.updateBoard({ lastMeeting: new Date(e.target.value).getTime() })} />
      </Card>

      <Card className="zeitnus-gov-card">
        <h4>{t('zeitnusCooperative.governance.conflictOfInterestPolicy')}</h4>
        <Switch checked={governance.board.conflictOfInterestPolicy} onChange={(checked) => actions.updateBoard({ conflictOfInterestPolicy: checked })} />
      </Card>

      <Card className="zeitnus-gov-card-full">
        <h4>{t('zeitnusCooperative.governance.boardResponsibilities')}</h4>
        <ul className="zeitnus-responsibilities-list">
          <li>🎯 {t('zeitnusCooperative.governance.strategicDirection')}</li>
          <li>👁️ {t('zeitnusCooperative.governance.oversight')}</li>
          <li>💰 {t('zeitnusCooperative.governance.financialOversight')}</li>
          <li>⚠️ {t('zeitnusCooperative.governance.riskOversight')}</li>
          <li>🤝 {t('zeitnusCooperative.governance.stakeholderEngagement')}</li>
          <li>📈 {t('zeitnusCooperative.governance.performanceMonitoring')}</li>
        </ul>
      </Card>

      <Card className="zeitnus-gov-card-full">
        <h4>{t('zeitnusCooperative.governance.independenceRequirements')}</h4>
        <p>{t('zeitnusCooperative.governance.independenceDesc')}</p>
        <Progress value={(governance.board.independentMembers / Math.max(governance.board.members, 1)) * 100} max={100} showLabel label={t('zeitnusCooperative.governance.independenceRatio')} />
      </Card>
    </div>
  </div>
);

const ManagementTab: React.FC<{ governance: any; actions: any }> = ({ governance, actions }) => (
  <div className="zeitnus-governance-tab">
    <div className="zeitnus-tab-header">
      <h3>👔 {t('zeitnusCooperative.governance.management')}</h3>
      <p>{t('zeitnusCooperative.governance.managementDesc')}</p>
    </div>

    <div className="zeitnus-governance-grid">
      <Card className="zeitnus-gov-card-full">
        <h4>{t('zeitnusCooperative.governance.generalManager')}</h4>
        <Input value={governance.management.generalManager} onChange={(e) => actions.updateManagement({ generalManager: e.target.value })} placeholder={t('zeitnusCooperative.governance.managerNamePlaceholder')} />
      </Card>

      <Card className="zeitnus-gov-card-full">
        <h4>{t('zeitnusCooperative.governance.keyPositions')}</h4>
        <div className="zeitnus-key-positions">
          {governance.management.keyPositions.map((pos, i) => (
            <div key={i} className="zeitnus-position-row">
              <Input value={pos} onChange={(e) => {
                const newPositions = [...governance.management.keyPositions];
                newPositions[i] = e.target.value;
                actions.updateManagement({ keyPositions: newPositions });
              }} placeholder={`${t('zeitnusCooperative.governance.position')} ${i + 1}`} />
              <Button variant="ghost" size="sm" onClick={() => {
                const newPositions = governance.management.keyPositions.filter((_, idx) => idx !== i);
                actions.updateManagement({ keyPositions: newPositions });
              }}>🗑️</Button>
            </div>
          ))}
          <Button variant="secondary" size="sm" onClick={() => actions.updateManagement({ keyPositions: [...governance.management.keyPositions, ''] })}>
            ➕ {t('zeitnusCooperative.governance.addPosition')}
          </Button>
        </div>
      </Card>

      <Card className="zeitnus-gov-card-full">
        <h4>{t('zeitnusCooperative.governance.professionalCertifications')}</h4>
        <div className="zeitnus-certifications">
          {governance.management.professionalCertifications.map((cert, i) => (
            <div key={i} className="zeitnus-cert-row">
              <Input value={cert} onChange={(e) => {
                const newCerts = [...governance.management.professionalCertifications];
                newCerts[i] = e.target.value;
                actions.updateManagement({ professionalCertifications: newCerts });
              }} placeholder={`${t('zeitnusCooperative.governance.certification')} ${i + 1}`} />
              <Button variant="ghost" size="sm" onClick={() => {
                const newCerts = governance.management.professionalCertifications.filter((_, idx) => idx !== i);
                actions.updateManagement({ professionalCertifications: newCerts });
              }}>🗑️</Button>
            </div>
          ))}
          <Button variant="secondary" size="sm" onClick={() => actions.updateManagement({ professionalCertifications: [...governance.management.professionalCertifications, ''] })}>
            ➕ {t('zeitnusCooperative.governance.addCertification')}
          </Button>
        </div>
      </Card>

      <Card className="zeitnus-gov-card-full">
        <h4>{t('zeitnusCooperative.governance.managerRequirements')}</h4>
        <ul className="zeitnus-requirements-list">
          <li>🎓 {t('zeitnusCooperative.governance.financialEducation')}</li>
          <li>🏦 {t('zeitnusCooperative.governance.financialExperience')}</li>
          <li>⚖️ {t('zeitnusCooperative.governance.regulatoryKnowledge')}</li>
          <li>👥 {t('zeitnusCooperative.governance.leadershipSkills')}</li>
          <li>🤝 {t('zeitnusCooperative.governance.cooperativeValues')}</li>
          <li>💻 {t('zeitnusCooperative.governance.digitalCompetence')}</li>
        </ul>
      </Card>
    </div>
  </div>
);

const CommitteesTab: React.FC<{ governance: any; actions: any }> = ({ governance, actions }) => (
  <div className="zeitnus-governance-tab">
    <div className="zeitnus-tab-header">
      <h3>📋 {t('zeitnusCooperative.governance.committees')}</h3>
      <p>{t('zeitnusCooperative.governance.committeesDesc')}</p>
    </div>

    <div className="zeitnus-governance-grid">
      {[
        { key: 'audit', label: '📊 Auditoría', desc: t('zeitnusCooperative.governance.auditDesc') },
        { key: 'risk', label: '⚠️ Riesgos', desc: t('zeitnusCooperative.governance.riskDesc') },
        { key: 'credit', label: '💳 Crédito', desc: t('zeitnusCooperative.governance.creditDesc') },
        { key: 'governance', label: '🏛️ Gobernanza', desc: t('zeitnusCooperative.governance.governanceDesc') },
        { key: 'education', label: '📚 Educación', desc: t('zeitnusCooperative.governance.educationDesc') },
        { key: 'technology', label: '💻 Tecnología', desc: t('zeitnusCooperative.governance.techDesc') },
      ].map(committee => (
        <Card key={committee.key} className="zeitnus-committee-card">
          <div className="zeitnus-committee-header">
            <h4>{committee.label}</h4>
            <Switch checked={governance.committees[committee.key as keyof typeof governance.committees]} onChange={(checked) => actions.updateCommittees({ [committee.key]: checked })} />
          </div>
          <p>{committee.desc}</p>
          {governance.committees[committee.key as keyof typeof governance.committees] && (
            <div className="zeitnus-committee-details">
              <h5>{t('zeitnusCooperative.governance.committeeFunctions')}</h5>
              <ul>{COMMITTEE_FUNCTIONS[committee.key].map((fn, i) => <li key={i}>{fn}</li>)}</ul>
            </div>
          )}
        </Card>
      ))}
    </div>
  </div>
);

const COMMITTEE_FUNCTIONS: Record<string, string[]> = {
  audit: ['Revisar estados financieros', 'Supervisar auditoría externa', 'Evaluar controles internos', 'Reportar a asamblea'],
  risk: ['Identificar riesgos', 'Evaluar exposición', 'Definir apetito de riesgo', 'Monitorear mitigaciones'],
  credit: ['Aprobar políticas de crédito', 'Revisar cartera', 'Autorizar créditos grandes', 'Monitorear NPL'],
  governance: ['Nominaciones', 'Evaluación desempeño', 'Políticas éticas', 'Sucesión'],
  education: ['Programa educación financiera', 'Capacitación dirigentes', 'Materiales asociados', 'Alfabetización digital'],
  technology: ['Estrategia digital', 'Ciberseguridad', 'Innovación tech', 'Protección datos'],
};

const TransparencyTab: React.FC<{
  transparencyIndex: number;
  mechanisms: any[];
  result: any;
  showModal: boolean;
  setShowModal: (s: boolean) => void;
  newMechanism: any;
  setNewMechanism: (m: any) => void;
  actions: any;
}> = ({ transparencyIndex, mechanisms, result, showModal, setShowModal, newMechanism, setNewMechanism, actions }) => (
  <div className="zeitnus-governance-tab">
    <div className="zeitnus-tab-header">
      <div>
        <h3>🔍 {t('zeitnusCooperative.governance.transparency')}</h3>
        <p>{t('zeitnusCooperative.governance.transparencyDesc')}</p>
      </div>
      <Progress value={transparencyIndex} max={100} showLabel label={t('zeitnusCooperative.governance.transparencyIndex')} className="zeitnus-transparency-progress" />
    </div>

    <div className="zeitnus-transparency-grid">
      <Card className="zeitnus-transparency-score-card">
        <h4>{t('zeitnusCooperative.governance.transparencyScore')}</h4>
        <Progress value={transparencyIndex} max={100} showLabel size="lg" />
        <div className="zeitnus-score-breakdown">
          {result.mechanisms.map(m => (
            <div key={m.id} className="zeitnus-mechanism-score">
              <Icon name={MECHANISM_ICONS[m.type] || 'Check'} size={16} style={{ color: m.status === 'activo' ? 'var(--genio)' : 'var(--muted)' }} />
              <span>{m.name}</span>
              <Badge variant={m.status === 'activo' ? 'success' : 'secondary'}>{m.frequency}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card className="zeitnus-gaps-card">
        <h4>⚠️ {t('zeitnusCooperative.governance.gaps')}</h4>
        {result.gaps.length > 0 ? (
          <ul>{result.gaps.map((gap, i) => <li key={i}>⚠️ {gap}</li>)}</ul>
        ) : (
          <p className="zeitnus-no-gaps">✅ {t('zeitnusCooperative.governance.noGaps')}</p>
        )}
      </Card>

      <Card className="zeitnus-recommendations-card">
        <h4>💡 {t('zeitnusCooperative.governance.recommendations')}</h4>
        <ul>{result.recommendations.map((rec, i) => <li key={i}>💡 {rec}</li>)}</ul>
      </Card>

      <Card className="zeitnus-mechanisms-card-full">
        <div className="zeitnus-mechanisms-header">
          <h4>{t('zeitnusCooperative.governance.mechanisms')}</h4>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            ➕ {t('zeitnusCooperative.governance.addMechanism')}
          </Button>
        </div>
        <div className="zeitnus-mechanisms-list">
          {mechanisms.map(m => (
            <div key={m.id} className="zeitnus-mechanism-item">
              <div className="zeitnus-mechanism-info">
                <Icon name={MECHANISM_ICONS[m.type] || 'Check'} size={20} style={{ color: m.status === 'activo' ? 'var(--genio)' : 'var(--muted)' }} />
                <div>
                  <strong>{m.name}</strong>
                  <small>{m.type} • {m.frequency} • {m.responsible}</small>
                </div>
              </div>
              <div className="zeitnus-mechanism-actions">
                <Badge variant={m.status === 'activo' ? 'success' : m.status === 'pendiente' ? 'warning' : 'secondary'}>{m.status}</Badge>
                <Button variant="ghost" size="sm" onClick={() => actions.updateTransparencyMechanism(m.id, { status: m.status === 'activo' ? 'pendiente' : 'activo' })}>
                  {m.status === 'activo' ? '⏸️' : '▶️'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => actions.removeTransparencyMechanism(m.id)}>🗑️</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>

    {showModal && (
      <div className="zeitnus-modal-overlay" onClick={() => setShowModal(false)} role="dialog" aria-modal="true">
        <div className="zeitnus-modal" onClick={e => e.stopPropagation()}>
          <header>
            <h2>➕ {t('zeitnusCooperative.governance.addMechanism')}</h2>
            <button className="zeitnus-modal-close" onClick={() => setShowModal(false)}>×</button>
          </header>
          <div className="zeitnus-modal-body">
            <div className="zeitnus-form-field">
              <label>{t('zeitnusCooperative.governance.mechanismName')}</label>
              <Input value={newMechanism.name} onChange={(e) => setNewMechanism({ ...newMechanism, name: e.target.value })} placeholder={t('zeitnusCooperative.governance.mechanismNamePlaceholder')} />
            </div>
            <div className="zeitnus-form-field">
              <label>{t('zeitnusCooperative.governance.mechanismType')}</label>
              <Select value={newMechanism.type} onChange={(e) => setNewMechanism({ ...newMechanism, type: e.target.value })} options={[
                { value: 'info_financiera', label: '📊 Información Financiera' },
                { value: 'reportes_periodicos', label: '📄 Reportes Periódicos' },
                { value: 'comunicacion_abierta', label: '💬 Comunicación Abierta' },
                { value: 'auditorias', label: '📊 Auditorías' },
                { value: 'registro_decisiones', label: '📝 Registro Decisiones' },
                { value: 'participacion_asociados', label: '👥 Participación Asociados' },
              ]} />
            </div>
            <div className="zeitnus-form-field">
              <label>{t('zeitnusCooperative.governance.frequency')}</label>
              <Select value={newMechanism.frequency} onChange={(e) => setNewMechanism({ ...newMechanism, frequency: e.target.value })} options={[
                { value: 'tiempo_real', label: '⚡ Tiempo Real' },
                { value: 'diaria', label: '📅 Diaria' },
                { value: 'semanal', label: '📅 Semanal' },
                { value: 'mensual', label: '📅 Mensual' },
                { value: 'trimestral', label: '📅 Trimestral' },
                { value: 'anual', label: '📅 Anual' },
              ]} />
            </div>
            <div className="zeitnus-form-field">
              <label>{t('zeitnusCooperative.governance.responsible')}</label>
              <Input value={newMechanism.responsible} onChange={(e) => setNewMechanism({ ...newMechanism, responsible: e.target.value })} placeholder={t('zeitnusCooperative.governance.responsiblePlaceholder')} />
            </div>
          </div>
          <footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>{t('zeitnusCooperative.governance.cancel')}</Button>
            <Button variant="primary" onClick={() => { actions.addTransparencyMechanism(newMechanism); setNewMechanism({ name: '', type: 'info_financiera', frequency: 'trimestral', responsible: '' }); setShowModal(false); }}>{t('zeitnusCooperative.governance.add')}</Button>
          </footer>
        </div>
      </div>
    )}
    </div>
  </div>
);

const ConflictsTab: React.FC<{ governance: any; actions: any }> = ({ governance, actions }) => (
  <div className="zeitnus-governance-tab">
    <div className="zeitnus-tab-header">
      <h3>⚖️ {t('zeitnusCooperative.governance.conflicts')}</h3>
      <p>{t('zeitnusCooperative.governance.conflictsDesc')}</p>
    </div>

    <div className="zeitnus-governance-grid">
      <Card className="zeitnus-gov-card">
        <h4>{t('zeitnusCooperative.governance.mechanism')}</h4>
        <Input value={governance.conflictResolution.mechanism} onChange={(e) => actions.updateConflictResolution({ mechanism: e.target.value })} placeholder={t('zeitnusCooperative.governance.mechanismPlaceholder')} />
      </Card>

      <Card className="zeitnus-gov-card">
        <h4>{t('zeitnusCooperative.governance.casesResolved')}</h4>
        <input type="number" min="0" value={governance.conflictResolution.casesResolved} onChange={(e) => actions.updateConflictResolution({ casesResolved: parseInt(e.target.value) })} />
      </Card>

      <Card className="zeitnus-gov-card">
        <h4>{t('zeitnusCooperative.governance.avgResolutionDays')}</h4>
        <input type="number" min="0" value={governance.conflictResolution.averageResolutionDays} onChange={(e) => actions.updateConflictResolution({ averageResolutionDays: parseInt(e.target.value) })} />
      </Card>

      <Card className="zeitnus-gov-card-full">
        <h4>{t('zeitnusCooperative.governance.conflictTypes')}</h4>
        <ul className="zeitnus-conflict-types">
          <li>💰 {t('zeitnusCooperative.governance.financialConflicts')}</li>
          <li>👥 {t('zeitnusCooperative.governance.governanceConflicts')}</li>
          <li>🤝 {t('zeitnusCooperative.governance.interpersonalConflicts')}</li>
          <li>⚖️ {t('zeitnusCooperative.governance.interestConflicts')}</li>
          <li>📋 {t('zeitnusCooperative.governance.regulatoryConflicts')}</li>
        </ul>
      </Card>

      <Card className="zeitnus-gov-card-full">
        <h4>{t('zeitnusCooperative.governance.resolutionPrinciples')}</h4>
        <ul className="zeitnus-principles-list">
          <li>🤝 {t('zeitnusCooperative.governance.dialogueFirst')}</li>
          <li>🤝 {t('zeitnusCooperative.governance.mediation')}</li>
          <li>📋 {t('zeitnusCooperative.governance.arbitration')}</li>
          <li>⚖️ {t('zeitnusCooperative.governance.formalProcess')}</li>
          <li>📝 {t('zeitnusCooperative.governance.documentation')}</li>
        </ul>
      </Card>
    </div>
  </div>
);

const AuditTab: React.FC<{ governance: any; actions: any }> = ({ governance, actions }) => (
  <div className="zeitnus-governance-tab">
    <div className="zeitnus-tab-header">
      <h3>📊 {t('zeitnusCooperative.governance.audit')}</h3>
      <p>{t('zeitnusCooperative.governance.auditDesc')}</p>
    </div>

    <div className="zeitnus-governance-grid">
      <Card className="zeitnus-gov-card">
        <h4>{t('zeitnusCooperative.governance.auditCommittee')}</h4>
        <Switch checked={governance.committees.audit} onChange={(checked) => actions.updateCommittees({ audit: checked })} />
      </Card>

      <Card className="zeitnus-gov-card">
        <h4>{t('zeitnusCooperative.governance.externalAudit')}</h4>
        <Switch checked={false} onChange={() => {}} disabled />
        <small>{t('zeitnusCooperative.governance.externalAuditNote')}</small>
      </Card>

      <Card className="zeitnus-gov-card">
        <h4>{t('zeitnusCooperative.governance.internalAudit')}</h4>
        <Switch checked={false} onChange={() => {}} disabled />
        <small>{t('zeitnusCooperative.governance.internalAuditNote')}</small>
      </Card>

      <Card className="zeitnus-gov-card">
        <h4>{t('zeitnusCooperative.governance.auditFrequency')}</h4>
        <Select value="anual" onChange={() => {}} options={[
          { value: 'trimestral', label: 'Trimestral' },
          { value: 'semestral', label: 'Semestral' },
          { value: 'anual', label: 'Anual' },
        ]} />
      </Card>

      <Card className="zeitnus-gov-card-full">
        <h4>{t('zeitnusCooperative.governance.auditScope')}</h4>
        <ul className="zeitnus-audit-scope">
          <li>📊 {t('zeitnusCooperative.governance.financialStatements')}</li>
          <li>🔍 {t('zeitnusCooperative.governance.internalControls')}</li>
          <li>⚠️ {t('zeitnusCooperative.governance.riskManagement')}</li>
          <li>📋 {t('zeitnusCooperative.governance.regulatoryCompliance')}</li>
          <li>💻 {t('zeitnusCooperative.governance.itSystems')}</li>
          <li>🤝 {t('zeitnusCooperative.governance.governanceProcesses')}</li>
        </ul>
      </Card>

      <Card className="zeitnus-gov-card-full">
        <h4>{t('zeitnusCooperative.governance.auditReporting')}</h4>
        <ul className="zeitnus-audit-reporting">
          <li>📄 {t('zeitnusCooperative.governance.reportToAssembly')}</li>
          <li>📊 {t('zeitnusCooperative.governance.reportToBoard')}</li>
          <li>🌐 {t('zeitnusCooperative.governance.publicSummary')}</li>
          <li>⏰ {t('zeitnusCooperative.governance.followUp')}</li>
        </ul>
      </Card>
    </div>
  </div>
);

// ============================================================================
// CONSTANTES LOCALES
// ============================================================================

const MECHANISM_ICONS: Record<string, string> = {
  info_financiera: 'DollarSign',
  reportes_periodicos: 'FileText',
  comunicacion_abierta: 'MessageSquare',
  auditorias: 'Shield',
  registro_decisiones: 'FileCheck',
  participacion_asociados: 'Users',
};

export default ZeitnusCooperativeGovernance;