// ZeitnusCooperativeEducation.tsx — Pantalla de Educación Financiera y Glosario
// Principio Anfibio: educación central, no complemento

import React, { useState, useMemo } from 'react';
import { useZeitnusCooperativeStore } from '@core/state/hooks/zeitnus-cooperative';
import {
  GLOSSARY_TERMS,
  simulateCompoundInterest,
  calculateCooperativeCapital,
} from '@core/lib/zeitnus-cooperative';
import { Icon } from '@core/ui/Icon';
import { Button } from '@core/ui/Button';
import { Card } from '@core/ui/Card';
import { Input } from '@core/ui/Input';
import { Select } from '@core/ui/Select';
import { Tabs } from '@core/ui/Tabs';
import { Progress } from '@core/ui/Progress';
import { Tooltip } from '@core/ui/Tooltip';
import { t } from '@core/lib/i18n';

export const ZeitnusCooperativeEducation: React.FC = () => {
  const store = useZeitnusCooperativeStore();
  const programs = store.educationPrograms;
  const financialLiteracy = store.financialLiteracyIndex;
  const actions = store;

  const [activeTab, setActiveTab] = useState<'glosario' | 'simulador' | 'checklist' | 'programas' | 'principios'>('glosario');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTerms = useMemo(() => {
    if (!searchTerm) return GLOSSARY_TERMS;
    return GLOSSARY_TERMS.filter(term =>
      term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const [simulatorParams, setSimulatorParams] = useState({
    initialCapital: 1000,
    annualRate: 5,
    periods: 10,
    inflationRate: 4,
    taxRate: 15,
    commissionRate: 1,
    compoundFrequency: 1,
  });

  const simulatorResult = useMemo(() =>
    simulateCompoundInterest({
      initialCapital: simulatorParams.initialCapital,
      annualRate: simulatorParams.annualRate / 100,
      periods: simulatorParams.periods,
      inflationRate: simulatorParams.inflationRate / 100,
      taxRate: simulatorParams.taxRate / 100,
      commissionRate: simulatorParams.commissionRate / 100,
      compoundFrequency: simulatorParams.compoundFrequency,
    }), [simulatorParams]);

  const capitalCalculation = useMemo(() => {
    // Placeholder - en implementación real usaría datos del store
    return calculateCooperativeCapital([]);
  }, []);

  return (
    <div className="zeitnus-education-screen">
      <header className="zeitnus-education-header">
        <div className="zeitnus-education-title">
          <Icon name="BookOpen" size={28} style={{ color: 'var(--genio)' }} />
          <h1>{t('zeitnusCooperative.education.title')}</h1>
        </div>
        <div className="zeitnus-education-literacy">
          <Progress value={financialLiteracy} max={100} showLabel label={t('zeitnusCooperative.education.financialLiteracy')} />
        </div>
      </header>

      <Tabs value={activeTab} onChange={setActiveTab} className="zeitnus-education-tabs">
        <Tabs.List>
          <Tabs.Trigger value="glosario">📖 {t('zeitnusCooperative.education.glossary')}</Tabs.Trigger>
          <Tabs.Trigger value="simulador">📊 {t('zeitnusCooperative.education.simulator')}</Tabs.Trigger>
          <Tabs.Trigger value="checklist">✅ {t('zeitnusCooperative.education.checklist')}</Tabs.Trigger>
          <Tabs.Trigger value="programas">📚 {t('zeitnusCooperative.education.programs')}</Tabs.Trigger>
          <Tabs.Trigger value="principios">🤝 {t('zeitnusCooperative.education.principles')}</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="glosario">
          <GlossaryTab terms={GLOSSARY_TERMS} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </Tabs.Content>

        <Tabs.Content value="simulador">
          <SimulatorTab params={simulatorParams} setParams={setSimulatorParams} result={simulatorResult} />
        </Tabs.Content>

        <Tabs.Content value="checklist">
          <ChecklistTab />
        </Tabs.Content>

        <Tabs.Content value="programas">
          <ProgramsTab programs={store.educationPrograms} actions={store} financialLiteracy={store.financialLiteracyIndex} />
        </Tabs.Content>

        <Tabs.Content value="principios">
          <PrinciplesTab />
        </Tabs.Content>
      </Tabs>
    </div>
  );
};

// ============================================================================
// SUB-COMPONENTES
// ============================================================================

const GlossaryTab: React.FC<{ terms: typeof GLOSSARY_TERMS; searchTerm: string; setSearchTerm: (s: string) => void }> = ({ terms, searchTerm, setSearchTerm }) => (
  <div className="zeitnus-glossary-tab">
    <div className="zeitnus-glossary-search">
      <Icon name="Search" size={20} />
      <Input
        placeholder={t('zeitnusCooperative.education.searchPlaceholder')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="zeitnus-glossary-input"
      />
      <span className="zeitnus-glossary-count">{terms.length} {t('zeitnusCooperative.education.termsFound')}</span>
    </div>

    <div className="zeitnus-glossary-categories">
      {[
        { id: 'all', label: t('zeitnusCooperative.education.allCategories') },
        { id: 'legal', label: '⚖️ Legal/Regulatorio' },
        { id: 'financiero', label: '💰 Financiero' },
        { id: 'riesgo', label: '⚠️ Riesgo' },
        { id: 'gobernanza', label: '🏛️ Gobernanza' },
        { id: 'cooperativo', label: '🤝 Cooperativo' },
      ].map(cat => (
        <button key={cat.id} className={`zeitnus-category-btn ${cat.id === 'all' ? 'active' : ''}`}>
          {cat.label}
        </button>
      ))}
    </div>

    <div className="zeitnus-glossary-list">
      {terms.map((term, index) => (
        <details key={index} className="zeitnus-glossary-item">
          <summary className="zeitnus-glossary-term">
            <span className="zeitnus-term-name">{term.term}</span>
            <span className="zeitnus-term-category">{term.category}</span>
            <Icon name="ChevronDown" size={16} />
          </summary>
          <div className="zeitnus-glossary-definition">
            <p>{term.definition}</p>
            {term.examples && term.examples.length > 0 && (
              <div className="zeitnus-term-examples">
                <strong>{t('zeitnusCooperative.education.examples')}:</strong>
                <ul>{term.examples.map((ex, i) => <li key={i}>{ex}</li>)}</ul>
              </div>
            )}
            {term.related && term.related.length > 0 && (
              <div className="zeitnus-term-related">
                <strong>{t('zeitnusCooperative.education.related')}:</strong>
                <span>{term.related.join(', ')}</span>
              </div>
            )}
            {term.zeitnusApplication && (
              <div className="zeitnus-term-application">
                <Icon name="Zap" size={14} style={{ color: 'var(--genio)' }} />
                <span>{t('zeitnusCooperative.education.zeitnusApplication')}: {term.zeitnusApplication}</span>
              </div>
            )}
          </div>
        </details>
      ))}
    </div>
  </div>
);

const SimulatorTab: React.FC<{
  params: any;
  setParams: (p: any) => void;
  result: ReturnType<typeof simulateCompoundInterest>;
}> = ({ params, setParams, result }) => (
  <div className="zeitnus-simulator-tab">
    <div className="zeitnus-simulator-header">
      <h3>📊 {t('zeitnusCooperative.education.compoundInterestSimulator')}</h3>
      <p className="zeitnus-simulator-desc">{t('zeitnusCooperative.education.simulatorDesc')}</p>
    </div>

    <div className="zeitnus-simulator-grid">
      <Card className="zeitnus-simulator-inputs">
        <h4>{t('zeitnusCooperative.education.parameters')}</h4>
        <div className="zeitnus-param">
          <label>{t('zeitnusCooperative.education.initialCapital')}</label>
          <Input type="number" value={params.initialCapital} onChange={(e) => setParams({ ...params, initialCapital: parseFloat(e.target.value) })} step="100" min="0" />
        </div>
        <div className="zeitnus-param">
          <label>{t('zeitnusCooperative.education.annualRate')} (%)</label>
          <Input type="number" value={params.annualRate} onChange={(e) => setParams({ ...params, annualRate: parseFloat(e.target.value) })} step="0.1" min="0" max="50" />
        </div>
        <div className="zeitnus-param">
          <label>{t('zeitnusCooperative.education.periods')} ({t('zeitnusCooperative.education.years')})</label>
          <Input type="number" value={params.periods} onChange={(e) => setParams({ ...params, periods: parseInt(e.target.value) })} min="1" max="50" />
        </div>
        <div className="zeitnus-param">
          <label>{t('zeitnusCooperative.education.inflationRate')} (%)</label>
          <Input type="number" value={params.inflationRate} onChange={(e) => setParams({ ...params, inflationRate: parseFloat(e.target.value) })} step="0.1" min="0" max="20" />
        </div>
        <div className="zeitnus-param">
          <label>{t('zeitnusCooperative.education.taxRate')} (%)</label>
          <Input type="number" value={params.taxRate} onChange={(e) => setParams({ ...params, taxRate: parseFloat(e.target.value) })} step="0.1" min="0" max="50" />
        </div>
        <div className="zeitnus-param">
          <label>{t('zeitnusCooperative.education.commissionRate')} (%)</label>
          <Input type="number" value={params.commissionRate} onChange={(e) => setParams({ ...params, commissionRate: parseFloat(e.target.value) })} step="0.01" min="0" max="10" />
        </div>
        <div className="zeitnus-param">
          <label>{t('zeitnusCooperative.education.compoundFrequency')}</label>
          <Select value={params.compoundFrequency} onChange={(e) => setParams({ ...params, compoundFrequency: parseInt(e.target.value) })} options={[
            { value: 1, label: t('zeitnusCooperative.education.annual') },
            { value: 2, label: t('zeitnusCooperative.education.semiAnnual') },
            { value: 4, label: t('zeitnusCooperative.education.quarterly') },
            { value: 12, label: t('zeitnusCooperative.education.monthly') },
            { value: 365, label: t('zeitnusCooperative.education.daily') },
          ]} />
        </div>
      </Card>

      <Card className="zeitnus-simulator-results">
        <h4>{t('zeitnusCooperative.education.results')}</h4>
        <div className="zeitnus-result-cards">
          <div className="zeitnus-result-card nominal">
            <span className="zeitnus-result-label">{t('zeitnusCooperative.education.nominalValue')}</span>
            <span className="zeitnus-result-value">${result.nominalFutureValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            <span className="zeitnus-result-return">{t('zeitnusCooperative.education.totalReturn')}: ${result.totalNominalReturn.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="zeitnus-result-card real">
            <span className="zeitnus-result-label">{t('zeitnusCooperative.education.realValue')}</span>
            <span className="zeitnus-result-value">${result.realFutureValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            <span className="zeitnus-result-return">{t('zeitnusCooperative.education.totalReturn')}: ${result.totalRealReturn.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="zeitnus-result-card net">
            <span className="zeitnus-result-label">{t('zeitnusCooperative.education.netValue')}</span>
            <span className="zeitnus-result-value">${result.netFutureValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            <span className="zeitnus-result-return">{t('zeitnusCooperative.education.totalReturn')}: ${result.totalNetReturn.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="zeitnus-yearly-breakdown">
          <h5>{t('zeitnusCooperative.education.yearlyBreakdown')}</h5>
          <table className="zeitnus-breakdown-table">
            <thead>
              <tr>
                <th>{t('zeitnusCooperative.education.year')}</th>
                <th>{t('zeitnusCooperative.education.nominalValue')}</th>
                <th>{t('zeitnusCooperative.education.realValue')}</th>
                <th>{t('zeitnusCooperative.education.netValue')}</th>
                <th>{t('zeitnusCooperative.education.nominalReturn')}</th>
                <th>{t('zeitnusCooperative.education.realReturn')}</th>
                <th>{t('zeitnusCooperative.education.netReturn')}</th>
              </tr>
            </thead>
            <tbody>
              {result.yearlyBreakdown.map((row, i) => (
                <tr key={i}>
                  <td>Año {row.year}</td>
                  <td>${row.nominalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td>${row.realValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td>${row.netValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td>${row.nominalReturn.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td>${row.realReturn.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td>${row.netReturn.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="zeitnus-simulator-warnings">
          <h5>⚠️ {t('zeitnusCooperative.education.warnings')}</h5>
          <ul>
            <li>{t('zeitnusCooperative.education.warningHypothetical')}</li>
            <li>{t('zeitnusCooperative.education.warningNotGuaranteed')}</li>
            <li>{t('zeitnusCooperative.education.warningNoTaxes')}</li>
            <li>{t('zeitnusCooperative.education.warningNoCommissions')}</li>
            <li>{t('zeitnusCooperative.education.warningNoInflation')}</li>
            <li>{t('zeitnusCooperative.education.warningNoNegativeYears')}</li>
            <li>{t('zeitnusCooperative.education.warningNotRecommendation')}</li>
          </ul>
        </div>
      </Card>
    </div>
  </div>
);

const ChecklistTab: React.FC = () => {
  const checklistItems = [
    { category: t('zeitnusCooperative.checklist.documents'), items: [
      t('zeitnusCooperative.checklist.legalInfo'),
      t('zeitnusCooperative.checklist.officialName'),
      t('zeitnusCooperative.checklist.registryNumber'),
      t('zeitnusCooperative.checklist.statutes'),
      t('zeitnusCooperative.checklist.regulations'),
      t('zeitnusCooperative.checklist.governanceInfo'),
      t('zeitnusCooperative.checklist.financialStatements'),
      t('zeitnusCooperative.checklist.auditReports'),
      t('zeitnusCooperative.checklist.productsInfo'),
      t('zeitnusCooperative.checklist.contractConditions'),
      t('zeitnusCooperative.checklist.dataPolicy'),
      t('zeitnusCooperative.checklist.riskInfo'),
    ]},
    { category: t('zeitnusCooperative.checklist.moneyQuestions'), items: [
      t('zeitnusCooperative.checklist.capitalAport'),
      t('zeitnusCooperative.checklist.savingsDeposit'),
      t('zeitnusCooperative.checklist.financialProduct'),
      t('zeitnusCooperative.checklist.investment'),
      t('zeitnusCooperative.checklist.loan'),
      t('zeitnusCooperative.checklist.productiveProject'),
    ]},
    { category: t('zeitnusCooperative.checklist.adminQuestions'), items: [
      t('zeitnusCooperative.checklist.resourceUse'),
      t('zeitnusCooperative.checklist.decisionMakers'),
      t('zeitnusCooperative.checklist.controls'),
      t('zeitnusCooperative.checklist.riskEvaluation'),
      t('zeitnusCooperative.checklist.conflictPrevention'),
      t('zeitnusCooperative.checklist.audit'),
      t('zeitnusCooperative.checklist.infoToAssociates'),
    ]},
    { category: t('zeitnusCooperative.checklist.benefitQuestions'), items: [
      t('zeitnusCooperative.checklist.expectedBenefits'),
      t('zeitnusCooperative.checklist.guaranteedOrResults'),
      t('zeitnusCooperative.checklist.associatedCosts'),
      t('zeitnusCooperative.checklist.conditions'),
      t('zeitnusCooperative.checklist.surplusPossibility'),
      t('zeitnusCooperative.checklist.surplusCalculation'),
      t('zeitnusCooperative.checklist.lossScenario'),
    ]},
    { category: t('zeitnusCooperative.checklist.alertSignals'), items: [
      t('zeitnusCooperative.checklist.highGuaranteedReturns'),
      t('zeitnusCooperative.checklist.noFinancialInfo'),
      t('zeitnusCooperative.checklist.pressureForMoney'),
      t('zeitnusCooperative.checklist.unclearModel'),
      t('zeitnusCooperative.checklist.confusingLanguage'),
      t('zeitnusCooperative.checklist.noLegalDocs'),
      t('zeitnusCooperative.checklist.noControls'),
      t('zeitnusCooperative.checklist.refusalToAnswer'),
    ]},
  ];

  const [completed, setCompleted] = React.useState<Record<string, boolean>>({});

  const toggle = (key: string) => setCompleted(prev => ({ ...prev, [key]: !prev[key] }));

  const totalItems = checklistItems.reduce((sum, cat) => sum + cat.items.length, 0);
  const completedCount = Object.values(completed).filter(v => v).length;

  return (
    <div className="zeitnus-checklist-tab">
      <div className="zeitnus-checklist-header">
        <h3>✅ {t('zeitnusCooperative.checklist.title')}</h3>
        <Progress value={completedCount} max={checklistItems.reduce((s, c) => s + c.items.length, 0)} showLabel />
        <p>{completedCount} de {checklistItems.reduce((s, c) => s + c.items.length, 0)} {t('zeitnusCooperative.checklist.itemsCompleted')}</p>
      </div>

      {checklistItems.map((category, catIndex) => (
        <Card key={catIndex} className="zeitnus-checklist-category">
          <h4>{category.category}</h4>
          <ul className="zeitnus-checklist-items">
            {category.items.map((item, itemIndex) => {
              const key = `${catIndex}-${itemIndex}`;
              return (
                <li key={itemIndex} className="zeitnus-checklist-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={completed[key] || false}
                      onChange={() => toggle(key)}
                    />
                    <span>{item}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </Card>
      ))}
    </div>
  );
};

const ProgramsTab: React.FC<{ programs: any[]; actions: any; financialLiteracy: number }> = ({ programs, actions, financialLiteracy }) => {
  const [showModal, setShowModal] = React.useState(false);
  const [newProgram, setNewProgram] = React.useState({ name: '', type: 'glosario', targetAudience: 'asociados_nuevos', status: 'planificado' });

  const programTypes = [
    { value: 'glosario', label: '📖 Glosario Interactivo' },
    { value: 'simulador_interes_compuesto', label: '📊 Simulador Interés Compuesto' },
    { value: 'checklist_verificacion', label: '✅ Checklist Verificación' },
    { value: 'educacion_financiera_basica', label: '💰 Educación Financiera Básica' },
    { value: 'principios_cooperativos', label: '🤝 Principios Cooperativos' },
    { value: 'gestion_riesgos', label: '⚠️ Gestión de Riesgos' },
    { value: 'gobernanza_cooperativa', label: '🏛️ Gobernanza Cooperativa' },
    { value: 'economia_circular', label: '♻️ Economía Circular' },
  ];

  const handleSubmit = () => {
    if (!newProgram.name.trim()) return;
    actions.addEducationProgram({
      ...newProgram,
      participants: 0,
      completedCount: 0,
      financialLiteracyGain: 0,
      startDate: Date.now(),
    });
    setNewProgram({ name: '', type: 'glosario', targetAudience: 'asociados_nuevos', status: 'planificado' });
    setShowModal(false);
  };

  return (
    <div className="zeitnus-programs-tab">
      <div className="zeitnus-programs-header">
        <h3>📚 {t('zeitnusCooperative.education.programs')}</h3>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          ➕ {t('zeitnusCooperative.education.addProgram')}
        </Button>
      </div>

      <div className="zeitnus-programs-stats">
        <div className="zeitnus-stat">
          <span className="zeitnus-stat-value">{programs.length}</span>
          <span className="zeitnus-stat-label">{t('zeitnusCooperative.education.totalPrograms')}</span>
        </div>
        <div className="zeitnus-stat">
          <span className="zeitnus-stat-value">{programs.filter(p => p.status === 'en_curso').length}</span>
          <span className="zeitnus-stat-label">{t('zeitnusCooperative.education.active')}</span>
        </div>
        <div className="zeitnus-stat">
          <span className="zeitnus-stat-value">{programs.filter(p => p.status === 'completado').length}</span>
          <span className="zeitnus-stat-label">{t('zeitnusCooperative.education.completed')}</span>
        </div>
        <div className="zeitnus-stat">
          <span className="zeitnus-stat-value">{financialLiteracy}%</span>
          <span className="zeitnus-stat-label">{t('zeitnusCooperative.education.financialLiteracy')}</span>
        </div>
      </div>

      <div className="zeitnus-programs-list">
        {programs.map(program => (
          <Card key={program.id} className="zeitnus-program-card">
            <div className="zeitnus-program-header">
              <h4>{program.name}</h4>
              <Badge variant={program.status === 'completado' ? 'success' : program.status === 'en_curso' ? 'info' : 'secondary'}>
                {program.status}
              </Badge>
            </div>
            <div className="zeitnus-program-details">
              <span>🎯 {program.type}</span>
              <span>👥 {program.targetAudience}</span>
              <span>👤 {program.participants} {t('zeitnusCooperative.education.participants')}</span>
              <span>✅ {program.completedCount} {t('zeitnusCooperative.education.completed')}</span>
              <span>📈 +{program.financialLiteracyGain}% {t('zeitnusCooperative.education.literacyGain')}</span>
            </div>
            <div className="zeitnus-program-actions">
              <Button variant="ghost" size="sm" onClick={() => actions.updateEducationProgram(program.id, { status: program.status === 'completado' ? 'planificado' : 'completado' })}>
                {program.status === 'completado' ? '↩️ Reabrir' : '✅ Completar'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => actions.removeEducationProgram(program.id)}>
                🗑️ Eliminar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {showModal && (
        <div className="zeitnus-modal-overlay" onClick={() => setShowModal(false)} role="dialog" aria-modal="true">
          <div className="zeitnus-modal" onClick={e => e.stopPropagation()}>
            <header>
              <h2>➕ {t('zeitnusCooperative.education.addProgram')}</h2>
              <button className="zeitnus-modal-close" onClick={() => setShowModal(false)}>×</button>
            </header>
            <div className="zeitnus-modal-body">
              <div className="zeitnus-form-field">
                <label>{t('zeitnusCooperative.education.programName')}</label>
                <Input value={newProgram.name} onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })} placeholder={t('zeitnusCooperative.education.programNamePlaceholder')} />
              </div>
              <div className="zeitnus-form-field">
                <label>{t('zeitnusCooperative.education.programType')}</label>
                <Select value={newProgram.type} onChange={(e) => setNewProgram({ ...newProgram, type: e.target.value })} options={programTypes} />
              </div>
              <div className="zeitnus-form-field">
                <label>{t('zeitnusCooperative.education.targetAudience')}</label>
                <Select value={newProgram.targetAudience} onChange={(e) => setNewProgram({ ...newProgram, targetAudience: e.target.value })} options={[
                  { value: 'asociados_nuevos', label: '👋 Asociados Nuevos' },
                  { value: 'asociados_activos', label: '👥 Asociados Activos' },
                  { value: 'dirigentes', label: '🎩 Dirigentes' },
                  { value: 'personal', label: '👔 Personal' },
                  { value: 'comunidad_externa', label: '🌐 Comunidad Externa' },
                ]} />
              </div>
              <div className="zeitnus-form-field">
                <label>{t('zeitnusCooperative.education.initialStatus')}</label>
                <Select value={newProgram.status} onChange={(e) => setNewProgram({ ...newProgram, status: e.target.value })} options={[
                  { value: 'planificado', label: '📋 Planificado' },
                  { value: 'en_curso', label: '🔄 En Curso' },
                ]} />
              </div>
            </div>
            <footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>{t('zeitnusCooperative.education.cancel')}</Button>
              <Button variant="primary" onClick={handleMigrate}>{t('zeitnusCooperative.education.create')}</Button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

const PrinciplesTab: React.FC = () => (
  <div className="zeitnus-principles-tab">
    <div className="zeitnus-principles-header">
      <h3>🤝 {t('zeitnusCooperative.education.principles')}</h3>
      <p>{t('zeitnusCooperative.education.principlesDesc')}</p>
    </div>

    <div className="zeitnus-principles-grid">
      {COOPERATIVE_PRINCIPLES.map((principle, index) => (
        <Card key={index} className="zeitnus-principle-card">
          <div className="zeitnus-principle-number">{index + 1}</div>
          <h4>{principle.name}</h4>
          <p>{principle.description}</p>
          <div className="zeitnus-principle-application">
            <Icon name="Zap" size={14} style={{ color: 'var(--genio)' }} />
            <span>{t('zeitnusCooperative.education.zeitnusApplication')}: {PRINCIPLE_APPLICATIONS[index]}</span>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const PRINCIPLE_APPLICATIONS = [
  'Membresía abierta y voluntaria en la comunidad ZEITNUS; ingreso progresivo por fases',
  '1 asociado = 1 voto en asambleas; gobernanza democrática en cada fase del roadmap',
  'Aportes de capital = patrimonio cooperativo; excedentes reinvertidos en comunidad/educación',
  'Autonomía frente a reguladores; alianzas con INFOCOOP/SUGEF sin perder decisión propia',
  'Educación financiera = pilar central (glosario, simulador, checklist, programas)',
  'Alianzas con otras coops/empresas sociales; red ZEITNUS interconectada',
  'Proyectos circulares (reciclaje, agri regenerativa); medición impacto ambiental/social',
];

export default ZeitnusCooperativeEducation;