// IlargiakaosGovernance.tsx — Gobernanza Neo-Anarquista: PAC, Ecoanarquismo, Ciberfeminismo
// Principio Anfibio: gobernanza auto-gestionada, mandatos revocables, tech liberadora

import React, { useState, useMemo } from 'react';
import { useIlargiakaosStore } from '@core/state/hooks/ilargiakaos';
import { buildPAC, assessEcoAnarchistTech, measureCyberfeministComms } from '@core/lib/ilargiakaos-theory';
import { Icon } from '@core/ui/Icon';
import { Button } from '@core/ui/Button';
import { Card } from '@core/ui/Card';
import { Input } from '@core/ui/Input';
import { Textarea } from '@core/ui/Textarea'
import { Select } from '@core/ui/Select'
import { Tabs } from '@core/ui/Tabs'
import { Progress } from '@core/ui/Progress'
import { Badge } from '@core/ui/Badge'
import { t } from '@core/lib/i18n'

export const IlargiakaosGovernance: React.FC = () => {
  const store = useIlargiakaosStore()
  const activePAC = store.activePAC
  const pacHistory = store.pacHistory
  const assessedTechs = Object.values(store.assessedTechnologies)
  const commsAnalyses = Object.values(store.commsAnalyses)
  const actions = store

  const [activeTab, setActiveTab] = useState<'pac' | 'ecoanarchism' | 'cyberfeminism' | 'mutualaid' | 'bookchin' | 'malatesta'>('pac')
  const [newCommunity, setNewCommunity] = useState({ name: '', members: '', values: '', context: '' })
  const [pacValues, setPacValues] = useState('')
  const [techOrientation, setTechOrientation] = useState({
    flexibilityScore: 0.7,
    servesLifeNotSurvival: true,
    liberatesPhysicalLabor: true,
    regeneratesBiosphere: true,
    reducesAlienation: true,
    cyberfeministNetworked: true,
    antiExtractive: true,
    culturalProgramAligned: true,
  })
  const [newTech, setNewTech] = useState({ name: '', description: '', purpose: '', controlStructure: 'commons' as const, liberatesLabor: true, ecologicalImpact: 'regenerative' as const, democraticGovernance: true, accessModel: 'commons-based' as const })
  const [newNetwork, setNewNetwork] = useState({ networkId: '', networkName: '', topology: 'mesh' as const, decisionMaking: 'consensus' as const, participationRate: 50, feministModeration: true, patriarchalPatterns: '', neoliberalMetrics: false })

  return (
    <div className="ilargiakaos-governance">
      <header className="ilargiakaos-governance-header">
        <div className="ilargiakaos-governance-title">
          <Icon name="Users" size={28} style={{ color: 'var(--genio)' }} />
          <h1>{t('ilargiakaos.governance.title')}</h1>
        </div>
        <div className="ilargiakaos-governance-pac">
          {activePAC ? (
            <div className="ilargiakaos-governance-pac-active">
              <Badge variant="success">📜 {activePAC.name}</Badge>
              <Progress value={activePAC.collectiveViability} max={100} showLabel label={t('ilargiakaos.governance.viability')} size="sm" />
              <Progress value={activePAC.ecosocialAlignment} max={100} showLabel label={t('ilargiakaos.governance.ecosocial')} size="sm" />
            </div>
          ) : (
            <Badge variant="secondary">📜 {t('ilargiakaos.governance.noActivePAC')}</Badge>
          )}
        </div>
      </header>

      <Tabs value={activeTab} onChange={setActiveTab} className="ilargiakaos-governance-tabs">
        <Tabs.List>
          <Tabs.Trigger value="pac">📜 {t('ilargiakaos.governance.pacBuilder')}</Tabs.Trigger>
          <Tabs.Trigger value="ecoanarchism">🌿 {t('ilargiakaos.governance.ecoanarchism')}</Tabs.Trigger>
          <Tabs.Trigger value="cyberfeminism">🕸️ {t('ilargiakaos.governance.cyberfeminism')}</Tabs.Trigger>
          <Tabs.Trigger value="mutualaid">🤝 {t('ilargiakaos.governance.mutualAid')}</Tabs.Trigger>
          <Tabs.Trigger value="bookchin">📚 {t('ilargiakaos.governance.bookchin')}</Tabs.Trigger>
          <Tabs.Trigger value="malatesta">⚖️ {t('ilargiakaos.governance.malatesta')}</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="pac">
          <PACBuilderTab
            activePAC={activePAC}
            pacHistory={pacHistory}
            newCommunity={newCommunity}
            setNewCommunity={setNewCommunity}
            pacValues={pacValues}
            setPacValues={setPacValues}
            techOrientation={techOrientation}
            setTechOrientation={setTechOrientation}
            actions={actions}
          />
        </Tabs.Content>

        <Tabs.Content value="ecoanarchism">
          <EcoAnarchismTab assessedTechs={assessedTechs} newTech={newTech} setNewTech={setNewTech} actions={actions} />
        </Tabs.Content>

        <Tabs.Content value="cyberfeminism">
          <CyberfeminismTab commsAnalyses={commsAnalyses} newNetwork={newNetwork} setNewNetwork={setNewNetwork} actions={actions} />
        </Tabs.Content>

        <Tabs.Content value="mutualaid">
          <MutualAidTab />
        </Tabs.Content>

        <Tabs.Content value="bookchin">
          <BookchinTab />
        </Tabs.Content>

        <Tabs.Content value="malatesta">
          <MalatestaTab />
        </Tabs.Content>
      </Tabs>
    </div>
  )
}

// ============================================================================
// SUB-COMPONENTES
// ============================================================================

const PACBuilderTab: React.FC<{
  activePAC: any
  pacHistory: any[]
  newCommunity: any
  setNewCommunity: (c: any) => void
  pacValues: string
  setPacValues: (v: string) => void
  techOrientation: any
  setTechOrientation: (t: any) => void
  actions: any
}> = ({ activePAC, pacHistory, newCommunity, setNewCommunity, pacValues, setPacValues, techOrientation, setTechOrientation, actions }) => (
  <div className="ilargiakaos-pac-builder">
    <section className="ilargiakaos-pac-section">
      <h3>👥 {t('ilargiakaos.governance.communityDefinition')}</h3>
      <Card className="ilargiakaos-community-form">
        <div className="ilargiakaos-form-grid">
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.governance.communityName')}</label>
            <Input value={newCommunity.name} onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })} placeholder={t('ilargiakaos.governance.communityNamePlaceholder')} />
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.governance.members')}</label>
            <Input value={newCommunity.members} onChange={(e) => setNewCommunity({ ...newCommunity, members: e.target.value })} placeholder={t('ilargiakaos.governance.membersPlaceholder')} />
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.governance.context')}</label>
            <Input value={newCommunity.context} onChange={(e) => setNewCommunity({ ...newCommunity, context: e.target.value })} placeholder={t('ilargiakaos.governance.contextPlaceholder')} />
          </div>
        </div>
      </Card>
    </section>

    <section className="ilargiakaos-pac-section">
      <h3>📜 {t('ilargiakaos.governance.pacValues')}</h3>
      <Card className="ilargiakaos-pac-values-form">
        <Textarea
          value={pacValues}
          onChange={(e) => setPacValues(e.target.value)}
          placeholder={t('ilargiakaos.governance.pacValuesPlaceholder')}
          rows={4}
        />
        <div className="ilargiakaos-value-suggestions">
          <strong>{t('ilargiakaos.governance.suggestedValues')}:</strong>
          <div className="ilargiakaos-value-chips">
            {['solidaridad', 'autonomía', 'ecoanarquismo', 'ciberfeminismo', 'autogestión', 'comunes', 'soberanía tecnológica', 'regeneración', 'anti-aceleracionismo', 'tecnomutante'].map(v => (
              <Badge key={v} variant="secondary" onClick={() => setPacValues(pacValues + (pacValues ? ', ' : '') + v)}>{v}</Badge>
            ))}
          </div>
        </div>
      </Card>
    </section>

    <section className="ilargiakaos-pac-section">
      <h3>⚙️ {t('ilargiakaos.governance.techOrientation')}</h3>
      <Card className="ilargiakaos-tech-orientation-form">
        <div className="ilargiakaos-orientation-grid">
          {Object.entries(techOrientation).map(([key, value]) => (
            <div key={key} className="ilargiakaos-orientation-item">
              <label>
                <input type="checkbox" checked={value} onChange={(e) => setTechOrientation({ ...techOrientation, [key]: e.target.checked })} />
                <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase())}</span>
              </label>
            </div>
          ))}
        </div>
      </Card>
    </section>

    <section className="ilargiakaos-pac-section">
      <Button variant="primary" className="ilargiakaos-create-pac-btn" onClick={() => {
        if (!newCommunity.name.trim() || !pacValues.trim()) return
        const community = {
          name: newCommunity.name,
          members: newCommunity.members.split(',').map(m => m.trim()).filter(Boolean),
          values: pacValues.split(',').map(v => v.trim()).filter(Boolean),
          context: newCommunity.context,
        }
        const values = pacValues.split(',').map(v => v.trim()).filter(Boolean)
        actions.createPAC(community, values, techOrientation)
      }}>
        📜 {t('ilargiakaos.governance.createPAC')}
      </Button>
    </section>

    {activePAC && (
      <section className="ilargiakaos-pac-section">
        <h3>📜 {t('ilargiakaos.governance.activePAC')}</h3>
        <PACDetailCard pac={activePAC} />
      </section>
    )}

    <section className="ilargiakaos-pac-section">
      <h3>📜 {t('ilargiakaos.governance.pacHistory')}</h3>
      <div className="ilargiakaos-pac-history">
        {pacHistory.map(pac => (
          <PACHistoryCard key={pac.id} pac={pac} />
        ))}
      </div>
    </section>
  </div>
)

const EcoAnarchismTab: React.FC<{ assessedTechs: any[]; newTech: any; setNewTech: (t: any) => void; actions: any }> = ({ assessedTechs, newTech, setNewTech, actions }) => (
  <div className="ilargiakaos-ecoanarchism-tab">
    <section className="ilargiakaos-ecoanarchism-section">
      <h3>🔬 {t('ilargiakaos.governance.assessTech')}</h3>
      <Card className="ilargiakaos-tech-assess-form">
        <h4>{t('ilargiakaos.governance.newTechAssessment')}</h4>
        <div className="ilargiakaos-form-grid">
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.governance.techName')}</label>
            <Input value={newTech.name} onChange={(e) => setNewTech({ ...newTech, name: e.target.value })} placeholder={t('ilargiakaos.governance.techNamePlaceholder')} />
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.governance.techDescription')}</label>
            <Textarea value={newTech.description} onChange={(e) => setNewTech({ ...newTech, description: e.target.value })} placeholder={t('ilargiakaos.governance.techDescPlaceholder')} rows={3} />
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.governance.techPurpose')}</label>
            <Input value={newTech.purpose} onChange={(e) => setNewTech({ ...newTech, purpose: e.target.value })} placeholder={t('ilargiakaos.governance.techPurposePlaceholder')} />
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.governance.controlStructure')}</label>
            <Select value={newTech.controlStructure} onChange={(e) => setNewTech({ ...newTech, controlStructure: e.target.value })} options={[
              { value: 'corporate', label: '🏢 Corporativa' },
              { value: 'state', label: '🏛️ Estatal' },
              { value: 'community', label: '👥 Comunitaria' },
              { value: 'commons', label: '🌍 Comunes' },
              { value: 'open-source', label: '💻 Open Source' },
            ]} />
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.governance.liberatesLabor')}</label>
            <select value={newTech.liberatesLabor.toString()} onChange={(e) => setNewTech({ ...newTech, liberatesLabor: e.target.value === 'true' })}>
              <option value="true">✅ {t('ilargiakaos.governance.yes')}</option>
              <option value="false">❌ {t('ilargiakaos.governance.no')}</option>
            </select>
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.governance.ecologicalImpact')}</label>
            <Select value={newTech.ecologicalImpact} onChange={(e) => setNewTech({ ...newTech, ecologicalImpact: e.target.value })} options={[
              { value: 'regenerative', label: '🌿 Regenerativa' },
              { value: 'neutral', label: '⚪ Neutra' },
              { value: 'degenerative', label: '🔴 Degenerativa' },
              { value: 'unknown', label: '❓ Desconocida' },
            ]} />
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.governance.democraticGovernance')}</label>
            <select value={newTech.democraticGovernance.toString()} onChange={(e) => setNewTech({ ...newTech, democraticGovernance: e.target.value === 'true' })}>
              <option value="true">✅ {t('ilargiakaos.governance.yes')}</option>
              <option value="false">❌ {t('ilargiakaos.governance.no')}</option>
            </select>
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.governance.accessModel')}</label>
            <Select value={newTech.accessModel} onChange={(e) => setNewTech({ ...newTech, accessModel: e.target.value })} options={[
              { value: 'proprietary', label: '🔒 Propietario' },
              { value: 'freemium', label: '💰 Freemium' },
              { value: 'open-access', label: '🔓 Acceso Abierto' },
              { value: 'commons-based', label: '🌍 Basado en Comunes' },
            ]} />
          </div>
        </div>
        <Button variant="primary" onClick={() => actions.assessTechnology(newTech)}>
          🔬 {t('ilargiakaos.governance.assess')}
        </Button>
      </Card>
    </section>

    <section className="ilargiakaos-ecoanarchism-section">
      <h3>📊 {t('ilargiakaos.governance.assessedTechnologies')}</h3>
      <div className="ilargiakaos-tech-grid">
        {Object.values(assessedTechs).map(tech => (
          <TechAssessmentCard key={tech.techId} tech={tech} />
        ))}
      </div>
    </section>

    <section className="ilargiakaos-ecoanarchism-section">
      <h3>📚 {t('ilargiakaos.governance.bookchinPrinciples')}</h3>
      <div className="ilargiakaos-bookchin-grid">
        {BOOKCHIN_PRINCIPLES.map((p, i) => (
          <Card key={i} className="ilargiakaos-bookchin-card">
            <Icon name={p.icon} size={24} style={{ color: p.color }} />
            <h4>{p.title}</h4>
            <p>{p.description}</p>
          </Card>
        ))}
      </div>
    </section>
  </div>
)

const CyberfeminismTab: React.FC<{ commsAnalyses: any[]; newNetwork: any; setNewNetwork: (n: any) => void; actions: any }> = ({ commsAnalyses, newNetwork, setNewNetwork, actions }) => (
  <div className="ilargiakaos-cyberfeminism-tab">
    <section className="ilargiakaos-cyberfeminism-section">
      <h3>🕸️ {t('ilargiakaos.governance.plantTheory')}</h3>
      <Card className="ilargiakaos-plant-theory">
        <h4>🕸️ {t('ilargiakaos.governance.plantQuote')}</h4>
        <blockquote>{t('ilargiakaos.governance.plantQuoteText')}</blockquote>
        <p>{t('ilargiakaos.governance.plantExplanation')}</p>
      </Card>
    </section>

    <section className="ilargiakaos-cyberfeminism-section">
      <h3>📊 {t('ilargiakaos.governance.measureComms')}</h3>
      <Card className="ilargiakaos-comms-measure-form">
        <h4>{t('ilargiakaos.governance.newNetworkMeasurement')}</h4>
        <div className="ilargiakaos-form-grid">
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.governance.networkId')}</label>
            <Input value={newNetwork.networkId} onChange={(e) => setNewNetwork({ ...newNetwork, networkId: e.target.value })} placeholder={t('ilargiakaos.governance.networkIdPlaceholder')} />
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.governance.networkName')}</label>
            <Input value={newNetwork.networkName} onChange={(e) => setNewNetwork({ ...newNetwork, networkName: e.target.value })} placeholder={t('ilargiakaos.governance.networkNamePlaceholder')} />
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.governance.topology')}</label>
            <Select value={newNetwork.topology} onChange={(e) => setNewNetwork({ ...newNetwork, topology: e.target.value })} options={[
              { value: 'hierarchical', label: '📏 Jerárquica' },
              { value: 'flat', label: '📏 Plana' },
              { value: 'mesh', label: '🕸️ Malla' },
              { value: 'federated', label: '🔗 Federada' },
              { value: 'hybrid', label: '🔀 Híbrida' },
            ]} />
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.governance.decisionMaking')}</label>
            <Select value={newNetwork.decisionMaking} onChange={(e) => setNewNetwork({ ...newNetwork, decisionMaking: e.target.value })} options={[
              { value: 'top-down', label: '📏 Top-Down' },
              { value: 'consensus', label: '🤝 Consenso' },
              { value: 'consent', label: '✅ Consentimiento' },
              { value: 'voting', label: '🗳️ Votación' },
              { value: 'algorithmic', label: '🤖 Algorítmica' },
            ]} />
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.governance.participationRate')}</label>
            <input type="range" min="0" max="100" value={newNetwork.participationRate} onChange={(e) => setNewNetwork({ ...newNetwork, participationRate: parseInt(e.target.value) })} />
            <span>{newNetwork.participationRate}%</span>
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.governance.feministModeration')}</label>
            <select value={newNetwork.feministModeration.toString()} onChange={(e) => setNewNetwork({ ...newNetwork, feministModeration: e.target.value === 'true' })}>
              <option value="true">✅ {t('ilargiakaos.governance.yes')}</option>
              <option value="false">❌ {t('ilargiakaos.governance.no')}</option>
            </select>
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.governance.patriarchalPatterns')}</label>
            <Input value={newNetwork.patriarchalPatterns} onChange={(e) => setNewNetwork({ ...newNetwork, patriarchalPatterns: e.target.value })} placeholder={t('ilargiakaos.governance.patriarchalPatternsPlaceholder')} />
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.governance.neoliberalMetrics')}</label>
            <select value={newNetwork.neoliberalMetrics.toString()} onChange={(e) => setNewNetwork({ ...newNetwork, neoliberalMetrics: e.target.value === 'true' })}>
              <option value="true">✅ {t('ilargiakaos.governance.yes')}</option>
              <option value="false">❌ {t('ilargiakaos.governance.no')}</option>
            </select>
          </div>
        </div>
        <Button variant="primary" onClick={() => actions.measureComms(newNetwork)}>
          📊 {t('ilargiakaos.governance.measure')}
        </Button>
      </Card>
    </section>

    <section className="ilargiakaos-cyberfeminism-section">
      <h3>📊 {t('ilargiakaos.governance.measuredNetworks')}</h3>
      <div className="ilargiakaos-comms-grid">
        {commsAnalyses.map(comm => (
          <CommMeasurementCard key={comm.networkId} comm={comm} />
        ))}
      </div>
    </section>

    <section className="ilargiakaos-cyberfeminism-section">
      <h3>📖 {t('ilargiakaos.governance.banonReflections')}</h3>
      <Card className="ilargiakaos-banon-reflections">
        <blockquote>{t('ilargiakaos.governance.banonQuote')}</blockquote>
        <p>{t('ilargiakaos.governance.banonExplanation')}</p>
      </Card>
    </section>
  </div>
)

const MutualAidTab: React.FC = () => (
  <div className="ilargiakaos-mutualaid-tab">
    <section className="ilargiakaos-mutualaid-section">
      <h3>🤝 {t('ilargiakaos.governance.malatestaConcept')}</h3>
      <Card className="ilargiakaos-malatesta-theory">
        <blockquote>{t('ilargiakaos.governance.malatestaQuote')}</blockquote>
        <p>{t('ilargiakaos.governance.malatestaExplanation')}</p>
      </Card>
    </section>

    <section className="ilargiakaos-mutualaid-section">
      <h3>🤝 {t('ilargiakaos.governance.mutualAidPrinciples')}</h3>
      <div className="ilargiakaos-mutualaid-grid">
        {MUTUAL_AID_PRINCIPLES.map((p, i) => (
          <Card key={i} className="ilargiakaos-principle-card">
            <Icon name={p.icon} size={24} style={{ color: p.color }} />
            <h4>{p.title}</h4>
            <p>{p.description}</p>
          </Card>
        ))}
      </div>
    </section>

    <section className="ilargiakaos-mutualaid-section">
      <h3>🛠️ {t('ilargiakaos.governance.implementation')}</h3>
      <Card className="ilargiakaos-implementation-card">
        <h4>{t('ilargiakaos.governance.practicalSteps')}</h4>
        <ol>
          {MUTUAL_AID_STEPS.map((step, i) => <li key={i}>{step}</li>)}
        </ol>
      </Card>
    </section>
  </div>
)

const BookchinTab: React.FC = () => (
  <div className="ilargiakaos-bookchin-tab">
    <section className="ilargiakaos-bookchin-section">
      <h3>📚 {t('ilargiakaos.governance.bookchinTitle')}</h3>
      <Card className="ilargiakaos-bookchin-intro">
        <h4>{t('ilargiakaos.governance.bookchinIntro')}</h4>
        <p>{t('ilargiakaos.governance.bookchinBio')}</p>
      </Card>
    </section>

    <section className="ilargiakaos-bookchin-section">
      <h3>🌿 {t('ilargiakaos.governance.keyConcepts')}</h3>
      <div className="ilargiakaos-bookchin-grid">
        {BOOKCHIN_CONCEPTS.map((c, i) => (
          <Card key={i} className="ilargiakaos-concept-card">
            <Icon name={c.icon} size={24} style={{ color: c.color }} />
            <h4>{c.title}</h4>
            <p>{c.description}</p>
          </Card>
        ))}
      </div>
    </section>

    <section className="ilargiakaos-bookchin-section">
      <h3>💬 {t('ilargiakaos.governance.bookchinQuotes')}</h3>
      <div className="ilargiakaos-quotes">
        {BOOKCHIN_QUOTES.map((q, i) => (
          <Card key={i} className="ilargiakaos-quote-card">
            <blockquote>{q.text}</blockquote>
            <cite>— {q.source}</cite>
          </Card>
        ))}
      </div>
    </section>

    <section className="ilargiakaos-bookchin-section">
      <h3>🛠️ {t('ilargiakaos.governance.practicalApplication')}</h3>
      <Card className="ilargiakaos-application-card">
        <ul>
          {BOOKCHIN_APPLICATIONS.map((a, i) => <li key={i}>{a}</li>)}
        </ul>
      </Card>
    </section>
  </div>
)

const MalatestaTab: React.FC = () => (
  <div className="ilargiakaos-malatesta-tab">
    <section className="ilargiakaos-malatesta-section">
      <h3>⚖️ {t('ilargiakaos.governance.malatestaTitle')}</h3>
      <Card className="ilargiakaos-malatesta-intro">
        <h4>{t('ilargiakaos.governance.malatestaIntro')}</h4>
        <p>{t('ilargiakaos.governance.malatestaBio')}</p>
      </Card>
    </section>

    <section className="ilargiakaos-malatesta-section">
      <h3>⚖️ {t('ilargiakaos.governance.keyConcepts')}</h3>
      <div className="ilargiakaos-malatesta-grid">
        {MALATESTA_CONCEPTS.map((c, i) => (
          <Card key={i} className="ilargiakaos-concept-card">
            <Icon name={c.icon} size={24} style={{ color: c.color }} />
            <h4>{c.title}</h4>
            <p>{c.description}</p>
          </Card>
        ))}
      </div>
    </section>

    <section className="ilargiakaos-malatesta-section">
      <h3>💬 {t('ilargiakaos.governance.malatestaQuotes')}</h3>
      <div className="ilargiakaos-quotes">
        {MALATESTA_QUOTES.map((q, i) => (
          <Card key={i} className="ilargiakaos-quote-card">
            <blockquote>{q.text}</blockquote>
            <cite>— {q.source}</cite>
          </Card>
        ))}
      </div>
    </section>

    <section className="ilargiakaos-malatesta-section">
      <h3>📜 {t('ilargiakaos.governance.dayAfterRevolution')}</h3>
      <Card className="ilargiakaos-dayafter-card">
        <h4>{t('ilargiakaos.governance.dayAfterTitle')}</h4>
        <p>{t('ilargiakaos.governance.dayAfterText')}</p>
      </Card>
    </section>
  </div>
)

// ============================================================================
// COMPONENTES AUXILIARES
// ============================================================================

const PACDetailCard: React.FC<{ pac: any }> = ({ pac }) => (
  <Card className="ilargiakaos-pac-detail-card">
    <h4>{pac.name}</h3>
    <div className="ilargiakaos-pac-metrics">
      <Progress value={pac.collectiveViability} max={100} showLabel label={t('ilargiakaos.governance.viability')} />
      <Progress value={pac.ecosocialAlignment} max={100} showLabel label={t('ilargiakaos.governance.ecosocial')} />
    </div>
    <div className="ilargiakaos-pac-values">
      {pac.values.map(v => <Badge key={v} variant="info">{v}</Badge>)}
    </div>
    <div className="ilargiakaos-pac-orientation">
      {Object.entries(pac.techOrientation).map(([key, value]) => (
        <div key={key} className="ilargiakaos-orientation-item">
          <span>{key}</span>
          <Badge variant={value ? 'success' : 'secondary'}>{value ? '✅' : '❌'}</Badge>
        </div>
      ))}
    </div>
  </Card>
)

const PACHistoryCard: React.FC<{ pac: any }> = ({ pac }) => (
  <Card className="ilargiakaos-history-pac">
    <div className="ilargiakaos-history-header">
      <span>{pac.name}</span>
      <Badge variant="secondary">{pac.collectiveViability}%</Badge>
    </div>
    <div className="ilargiakaos-history-values">
      {pac.values.map(v => <Badge key={v} variant="secondary">{v}</Badge>)}
    </div>
  </Card>
)

const TechAssessmentCard: React.FC<{ tech: any }> = ({ tech }) => (
  <Card className={`ilargiakaos-tech-assessment-card ${tech.assessment}`}>
    <div className="ilargiakaos-tech-header">
      <h4>{tech.name}</h4>
      <Badge variant={
        tech.assessment === 'liberadora' ? 'success' :
        tech.assessment === 'extractiva' ? 'danger' :
        tech.assessment === 'mixta' ? 'warning' : 'secondary'
      }>{tech.assessment}</Badge>
    </div>
    <p>{tech.description}</p>
    <div className="ilargiakaos-tech-flags">
      {tech.liberatesPhysicalLabor && <Badge variant="success">🟢 Libera trabajo</Badge>}
      {tech.regeneratesBiosphere && <Badge variant="success">🟢 Regenera</Badge>}
      {tech.reducesAlienation && <Badge variant="success">🟢 Reduce alienación</Badge>}
      {tech.democraticControl && <Badge variant="success">🟢 Democrática</Badge>}
      {tech.communityOwned && <Badge variant="success">🟢 Comunitaria</Badge>}
    </div>
  </div>
)

const CommMeasurementCard: React.FC<{ comm: any }> = ({ comm }) => (
  <Card className="ilargiakaos-comm-card">
    <div className="ilargiakaos-comm-header">
      <h4>{comm.networkName}</h4>
      <Badge variant={comm.networkedCommunicationScore > comm.linearCommunicationScore ? 'success' : 'warning'}>
        {comm.networkedCommunicationScore > comm.linearCommunicationScore ? '🕸️ Red' : '📏 Lineal'}
      </Badge>
    </div>
    <div className="ilargiakaos-comm-scores">
      <Progress value={comm.networkedCommunicationScore} max={100} showLabel label={t('ilargiakaos.governance.networked')} />
      <Progress value={comm.linearCommunicationScore} max={100} showLabel label={t('ilargiakaos.governance.linear')} />
    </div>
    <div className="ilargiakaos-comm-meta">
      <span>Topología: {comm.hierarchicalDepth === 1 ? 'Plana/Red' : comm.hierarchicalDepth === 2 ? 'Federada' : 'Jerárquica'}</span>
      <span>Resistencia patriarcal: {comm.patriarchyResistance}%</span>
      <span>Resistencia neoliberal: {comm.neoliberalResistance}%</span>
    </div>
  </div>
)

// ============================================================================
// CONSTANTES LOCALES
// ============================================================================

const BOOKCHIN_PRINCIPLES = [
  { title: t('ilargiakaos.governance.techLiberating'), description: t('ilargiakaos.governance.techLiberatingDesc'), icon: 'Zap', color: 'var(--cyan-400)' },
  { title: t('ilargiakaos.governance.ecologicalTech'), description: t('ilargiakaos.governance.ecologicalTechDesc'), icon: 'Leaf', color: 'var(--genio)' },
  { title: t('ilargiakaos.governance.municipalism'), description: t('ilargiakaos.governance.municipalismDesc'), icon: 'Building2', color: 'var(--acero)' },
  { title: t('ilargiakaos.governance.libertarianMunicipalism'), description: t('ilargiakaos.governance.libertarianMunicipalismDesc'), icon: 'Shield', color: 'var(--haiti)' },
  { title: t('ilargiakaos.governance.socialEcology'), description: t('ilargiakaos.governance.socialEcologyDesc'), icon: 'Globe', color: 'var(--cyan-400)' },
  { title: t('ilargiakaos.governance.postScarcity'), description: t('ilargiakaos.governance.postScarcityDesc'), icon: 'Infinity', color: 'var(--limon)' },
]

const BOOKCHIN_CONCEPTS = [
  { title: t('ilargiakaos.governance.socialEcology'), description: t('ilargiakaos.governance.socialEcologyDesc'), icon: 'Globe', color: 'var(--genio)' },
  { title: t('ilargiakaos.governance.libertarianMunicipalism'), description: t('ilargiakaos.governance.libertarianMunicipalismDesc'), icon: 'Building2', color: 'var(--acero)' },
  { title: t('ilargiakaos.governance.techLiberating'), description: t('ilargiakaos.governance.techLiberatingDesc'), icon: 'Zap', color: 'var(--cyan-400)' },
  { title: t('ilargiakaos.governance.postScarcity'), description: t('ilargiakaos.governance.postScarcityDesc'), icon: 'Infinity', color: 'var(--limon)' },
  { title: t('ilargiakaos.governance.directDemocracy'), description: t('ilargiakaos.governance.directDemocracyDesc'), icon: 'Users', color: 'var(--genio)' },
  { title: t('ilargiakaos.governance.confederation'), description: t('ilargiakaos.governance.confederationDesc'), icon: 'GitBranch', color: 'var(--acero)' },
]

const BOOKCHIN_QUOTES = [
  { text: t('ilargiakaos.governance.bookchinQuote1'), source: 'Murray Bookchin, The Ecology of Freedom' },
  { text: t('ilargiakaos.governance.bookchinQuote2'), source: 'Murray Bookchin, Toward an Ecological Society' },
  { text: t('ilargiakaos.governance.bookchinQuote3'), source: 'Murray Bookchin, Remaking Society' },
]

const BOOKCHIN_APPLICATIONS = [
  t('ilargiakaos.governance.application1'),
  t('ilargiakaos.governance.application2'),
  t('ilargiakaos.governance.application3'),
  t('ilargiakaos.governance.application4'),
]

const MUTUAL_AID_PRINCIPLES = [
  { title: t('ilargiakaos.governance.voluntary'), description: t('ilargiakaos.governance.voluntaryDesc'), icon: 'Heart', color: 'var(--haiti)' },
  { title: t('ilargiakaos.governance.reciprocity'), description: t('ilargiakaos.governance.reciprocityDesc'), icon: 'RefreshCw', color: 'var(--cyan-400)' },
  { title: t('ilargiakaos.governance.solidarity'), description: t('ilargiakaos.governance.solidarityDesc'), icon: 'Users', color: 'var(--genio)' },
  { title: t('ilargiakaos.governance.autonomy'), description: t('ilargiakaos.governance.autonomyDesc'), icon: 'Shield', color: 'var(--acero)' },
  { title: t('ilargiakaos.governance.horizontalism'), description: t('ilargiakaos.governance.horizontalismDesc'), icon: 'Minus', color: 'var(--acero)' },
  { title: t('ilargiakaos.governance.prefigurative'), description: t('ilargiakaos.governance.prefigurativeDesc'), icon: 'Sparkles', color: 'var(--limon)' },
]

const MUTUAL_AID_STEPS = [
  t('ilargiakaos.governance.step1'),
  t('ilargiakaos.governance.step2'),
  t('ilargiakaos.governance.step3'),
  t('ilargiakaos.governance.step4'),
  t('ilargiakaos.governance.step5'),
]

const MALATESTA_CONCEPTS = [
  { title: t('ilargiakaos.governance.individualNotAutonomous'), description: t('ilargiakaos.governance.individualNotAutonomousDesc'), icon: 'UserX', color: 'var(--haiti)' },
  { title: t('ilargiakaos.governance.societyAsProduct'), description: t('ilargiakaos.governance.societyAsProductDesc'), icon: 'Users', color: 'var(--genio)' },
  { title: t('ilargiakaos.governance.freedomInAgreement'), description: t('ilargiakaos.governance.freedomInAgreementDesc'), icon: 'Heart', color: 'var(--haiti)' },
  { title: t('ilargiakaos.governance.institutionsModifiable'), description: t('ilargiakaos.governance.institutionsModifiableDesc'), icon: 'Building2', color: 'var(--acero)' },
]

const MALATESTA_QUOTES = [
  { text: t('ilargiakaos.governance.malatestaQuote1'), source: 'Errico Malatesta, Anarchy' },
  { text: t('ilargiakaos.governance.malatestaQuote2'), source: 'Errico Malatesta, Anarchy' },
]

const MALATESTA_QUOTES_FULL = [
  { text: t('ilargiakaos.governance.malatestaQuote1'), source: 'Errico Malatesta, Anarchy' },
  { text: t('ilargiakaos.governance.malatestaQuote2'), source: 'Errico Malatesta, Anarchy' },
]

const BOOKCHIN_QUOTES_FULL = [
  { text: t('ilargiakaos.governance.bookchinQuote1'), source: 'Murray Bookchin, The Ecology of Freedom' },
  { text: t('ilargiakaos.governance.bookchinQuote2'), source: 'Murray Bookchin, Toward an Ecological Society' },
  { text: t('ilargiakaos.governance.bookchinQuote3'), source: 'Murray Bookchin, Remaking Society' },
]

export default IlargiakaosGovernance