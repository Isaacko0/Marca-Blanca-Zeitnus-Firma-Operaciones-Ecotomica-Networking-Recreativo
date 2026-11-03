// IlargiakaosFutures.tsx — Futuros: Postapocalipsis, Postcapitalismo, Tecnomutantes
// Principio Anfibio: modelado de futuros no capitalistas, simulación anti-aceleracionista

import React, { useState, useMemo } from 'react'
import { useIlargiakaosStore } from '@core/state/hooks/ilargiakaos'
import { simulatePostApocalypticDayAfter, simulateAntiAcceleration, KNOWN_CULTURAL_ARTIFACTS } from '@core/lib/ilargiakaos-theory'
import { Icon } from '@core/ui/Icon'
import { Button } from '@core/ui/Button'
import { Card } from '@core/ui/Card'
import { Input } from '@core/ui/Input'
import { Textarea } from '@core/ui/Textarea'
import { Select } from '@core/ui/Select'
import { Tabs } from '@core/ui/Tabs'
import { Progress } from '@core/ui/Progress'
import { Badge } from '@core/ui/Badge'
import { t } from '@core/lib/i18n'

export const IlargiakaosFutures: React.FC = () => {
  const store = useIlargiakaosStore()
  const models = Object.values(store.postApocalypticModels)
  const accelerationism = store.accelerationismAnalysis
  const desires = store.extractedDesires
  const actions = store

  const [activeTab, setActiveTab] = useState<'model' | 'acceleration' | 'tecnomutant' | 'postcapitalist' | 'synthesis'>('model')
  const [newScenario, setNewScenario] = useState({
    scenarioId: '',
    scenarioName: '',
    triggerEvent: 'economic_collapse' as const,
    initialPopulation: 8000000000,
    availableTech: '',
    socialCohesion: 60,
    ecologicalDamage: 40,
  })
  const [accelScenario, setAccelScenario] = useState({
    name: '',
    description: '',
    techAdvances: '',
    socialChanges: '',
    economicModel: 'capitalist_neoliberal',
  })
  const [newTecnomutant, setNewTecnomutant] = useState({
    agentId: '',
    carbonTraits: '',
    siliconTraits: '',
    mandatoryImplants: '',
    chosenAugmentations: '',
    surveillanceExposure: 50,
  })

  return (
    <div className="ilargiakaos-futures">
      <header className="ilargiakaos-futures-header">
        <div className="ilargiakaos-futures-title">
          <Icon name="TrendingUp" size={28} style={{ color: 'var(--limon)' }} />
          <h1>{t('ilargiakaos.futures.title')}</h1>
        </div>
        <p className="ilargiakaos-futures-subtitle">{t('ilargiakaos.futures.subtitle')}</p>
      </header>

      <Tabs value={activeTab} onChange={setActiveTab} className="ilargiakaos-futures-tabs">
        <Tabs.List>
          <Tabs.Trigger value="model">🌅 {t('ilargiakaos.futures.modelPostApocalyptic')}</Tabs.Trigger>
          <Tabs.Trigger value="acceleration">⚡ {t('ilargiakaos.futures.antiAcceleration')}</Tabs.Trigger>
          <Tabs.Trigger value="tecnomutant">🧬 {t('ilargiakaos.futures.tecnomutants')}</Tabs.Trigger>
          <Tabs.Trigger value="postcapitalist">💭 {t('ilargiakaos.futures.postcapitalistDesires')}</Tabs.Trigger>
          <Tabs.Trigger value="synthesis">🧠 {t('ilargiakaos.futures.synthesis')}</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="model">
          <ModelTab newScenario={newScenario} setNewScenario={setNewScenario} models={models} actions={actions} />
        </Tabs.Content>

        <Tabs.Content value="acceleration">
          <AccelerationTab accelScenario={accelScenario} setAccelScenario={setAccelScenario} accelerationism={accelerationism} actions={actions} />
        </Tabs.Content>

        <Tabs.Content value="tecnomutant">
          <TecnomutantTab newTecnomutant={newTecnomutant} setNewTecnomutant={setNewTecnomutant} actions={actions} identities={Object.values(store.agentIdentities)} />
        </Tabs.Content>

        <Tabs.Content value="postcapitalist">
          <PostcapitalistTab desires={store.extractedDesires} />
        </Tabs.Content>

        <Tabs.Content value="synthesis">
          <SynthesisTab models={models} accelerationism={accelerationism} desires={store.extractedDesires} />
        </Tabs.Content>
      </Tabs>

      {/* Modelos existentes */}
      {models.length > 0 && (
        <section className="ilargiakaos-futures-existing">
          <h3>🌅 {t('ilargiakaos.futures.existingModels')}</h3>
          <div className="ilargiakaos-models-grid">
            {models.map(model => (
              <FutureModelCard key={model.scenarioId} model={model} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// ============================================================================
// SUB-COMPONENTES
// ============================================================================

const ModelTab: React.FC<{ newScenario: any; setNewScenario: (s: any) => void; models: any[]; actions: any }> = ({ newScenario, setNewScenario, models, actions }) => (
  <div className="ilargiakaos-model-tab">
    <section className="ilargiakaos-model-section">
      <h3>🌅 {t('ilargiakaos.futures.newScenario')}</h3>
      <Card className="ilargiakaos-scenario-form">
        <div className="ilargiakaos-form-grid">
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.futures.scenarioId')}</label>
            <Input value={newScenario.scenarioId} onChange={(e) => setNewScenario({ ...newScenario, scenarioId: e.target.value })} placeholder={t('ilargiakaos.futures.scenarioIdPlaceholder')} />
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.futures.scenarioName')}</label>
            <Input value={newScenario.scenarioName} onChange={(e) => setNewScenario({ ...newScenario, scenarioName: e.target.value })} placeholder={t('ilargiakaos.futures.scenarioNamePlaceholder')} />
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.futures.triggerEvent')}</label>
            <Select value={newScenario.triggerEvent} onChange={(e) => setNewScenario({ ...newScenario, triggerEvent: e.target.value })} options={[
              { value: 'nuclear', label: '☢️ Nuclear' },
              { value: 'pandemic', label: '🦠 Pandemia' },
              { value: 'climate', label: '🌡️ Clima' },
              { value: 'meteor', label: '☄️ Meteorito' },
              { value: 'war', label: '🌍 Guerra' },
              { value: 'zombie', label: '🧟 Zombi' },
              { value: 'economic_collapse', label: '📉 Colapso Económico' },
            ]} />
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.futures.initialPopulation')}</label>
            <Input type="number" value={newScenario.initialPopulation} onChange={(e) => setNewScenario({ ...newScenario, initialPopulation: parseInt(e.target.value) })} min={0} />
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.futures.availableTech')}</label>
            <Textarea value={newScenario.availableTech} onChange={(e) => setNewScenario({ ...newScenario, availableTech: e.target.value })} placeholder={t('ilargiakaos.futures.availableTechPlaceholder')} rows={3} />
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.futures.socialCohesion')}</label>
            <input type="range" min="0" max="100" value={newScenario.socialCohesion} onChange={(e) => setNewScenario({ ...newScenario, socialCohesion: parseInt(e.target.value) })} />
            <span>{newScenario.socialCohesion}%</span>
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.futures.ecologicalDamage')}</label>
            <input type="range" min="0" max="100" value={newScenario.ecologicalDamage} onChange={(e) => setNewScenario({ ...newScenario, ecologicalDamage: parseInt(e.target.value) })} />
            <span>{newScenario.ecologicalDamage}%</span>
          </div>
        </div>
        <Button variant="primary" onClick={() => {
          const scenario = {
            ...newScenario,
            availableTech: newScenario.availableTech.split(',').map(t => t.trim()).filter(Boolean),
          }
          actions.modelPostApocalyptic(scenario)
        }}>
          🌅 {t('ilargiakaos.futures.modelScenario')}
        </Button>
      </Card>
    </section>

    <section className="ilargiakaos-model-section">
      <h3>📋 {t('ilargiakaos.futures.scenarioTemplates')}</h3>
      <div className="ilargiakaos-template-grid">
        {SCENARIO_TEMPLATES.map((template, i) => (
          <Card key={i} className="ilargiakaos-template-card" onClick={() => setNewScenario({ ...template, scenarioId: `scenario_${Date.now()}` })}>
            <h4>{template.scenarioName}</h4>
            <Badge variant={template.triggerEvent === 'economic_collapse' ? 'warning' : template.triggerEvent === 'climate' ? 'info' : 'secondary'}>
              {template.triggerEvent}
            </Badge>
            <p>{template.description}</p>
            <div className="ilargiakaos-template-tech">
              {template.availableTech.slice(0, 5).map((t, i) => <Badge key={i} variant="secondary">{t}</Badge>)}
            </div>
          </Card>
        ))}
      </div>
    </section>
  </div>
)

const AccelerationTab: React.FC<{ accelScenario: any; setAccelScenario: (s: any) => void; accelerationism: any; actions: any }> = ({ accelScenario, setAccelScenario, accelerationism, actions }) => (
  <div className="ilargiakaos-acceleration-tab">
    <section className="ilargiakaos-acceleration-section">
      <h3>⚡ {t('ilargiakaos.futures.antiAccelerationSimulation')}</h3>
      <Card className="ilargiakaos-accel-form">
        <h4>{t('ilargiakaos.futures.newSimulation')}</h4>
        <div className="ilargiakaos-form-grid">
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.futures.scenarioName')}</label>
            <Input value={accelScenario.name} onChange={(e) => setAccelScenario({ ...accelScenario, name: e.target.value })} placeholder={t('ilargiakaos.futures.scenarioNamePlaceholder')} />
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.futures.description')}</label>
            <Textarea value={accelScenario.description} onChange={(e) => setAccelScenario({ ...accelScenario, description: e.target.value })} placeholder={t('ilargiakaos.futures.descriptionPlaceholder')} rows={3} />
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.futures.techAdvances')}</label>
            <Textarea value={accelScenario.techAdvances} onChange={(e) => setAccelScenario({ ...accelScenario, techAdvances: e.target.value })} placeholder={t('ilargiakaos.futures.techAdvancesPlaceholder')} rows={3} />
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.futures.socialChanges')}</label>
            <Textarea value={accelScenario.socialChanges} onChange={(e) => setAccelScenario({ ...accelScenario, socialChanges: e.target.value })} placeholder={t('ilargiakaos.futures.socialChangesPlaceholder')} rows={3} />
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.futures.economicModel')}</label>
            <Select value={accelScenario.economicModel} onChange={(e) => setAccelScenario({ ...accelScenario, economicModel: e.target.value })} options={[
              { value: 'capitalist_neoliberal', label: '🏢 Capitalista Neoliberal' },
              { value: 'postcapitalist_cooperative', label: '🤝 Postcapitalista Cooperativo' },
              { value: 'ecoanarchist', label: '🌿 Ecoanarquista' },
              { value: 'mixed', label: '🔀 Mixto' },
            ]} />
          </div>
        </div>
        <Button variant="primary" onClick={() => {
          const scenario = {
            name: accelScenario.name,
            description: accelScenario.description,
            techAdvances: accelScenario.techAdvances.split(',').map(t => t.trim()).filter(Boolean),
            socialChanges: accelScenario.socialChanges.split(',').map(t => t.trim()).filter(Boolean),
            economicModel: accelScenario.economicModel,
          }
          actions.analyzeAccelerationism(scenario)
        }}>
          ⚡ {t('ilargiakaos.futures.runSimulation')}
        </Button>
      </Card>
    </section>

    <section className="ilargiakaos-acceleration-section">
      <h3>⚡ {t('ilargiakaos.futures.currentAnalysis')}</h3>
      <div className="ilargiakaos-acceleration-grid">
        <AccelerationCard title={t('ilargiakaos.futures.landianTrajectory')} data={accelerationism.landianAccelerationism} variant="danger" />
        <AccelerationCard title={t('ilargiakaos.futures.antiAccelerationTrajectory')} data={accelerationism.antiAccelerationism} variant="success" />
      </div>
      <div className="ilargiakaos-divergence-display">
        <h4>{t('ilargiakaos.futures.divergenceScore')}: <span style={{ color: accelerationism.divergenceScore > 0 ? 'var(--genio)' : accelerationism.divergenceScore < 0 ? 'var(--haiti)' : 'var(--acero)' }}>{accelerationism.divergenceScore > 0 ? '+' : ''}{accelerationism.divergenceScore}</span></h4>
        <p>{accelerationism.divergenceScore > 0 ? t('ilargiakaos.futures.antiAccelDominant') : accelerationism.divergenceScore < 0 ? t('ilargiakaos.futures.landianDominant') : t('ilargiakaos.futures.equilibrium')}</p>
      </div>
    </section>

    <section className="ilargiakaos-acceleration-section">
      <h3>📋 {t('ilargiakaos.futures.landianVsAnti')}</h3>
      <div className="ilargiakaos-comparison-grid">
        <ComparisonColumn title={t('ilargiakaos.futures.landian')} items={LANDIAN_TENETS} color="var(--haiti)" />
        <ComparisonColumn title={t('ilargiakaos.futures.antiAcceleration')} items={ANTI_ACCELERATION_TENETS} color="var(--genio)" />
      </div>
    </section>
  </div>
)

const TecnomutantTab: React.FC<{ newTecnomutant: any; setNewTecnomutant: (t: any) => void; actions: any; identities: any[] }> = ({ newTecnomutant, setNewTecnomutant, actions, identities }) => (
  <div className="ilargiakaos-tecnomutant-tab">
    <section className="ilargiakaos-tecnomutant-section">
      <h3>🧬 {t('ilargiakaos.futures.registerTecnomutant')}</h3>
      <Card className="ilargiakaos-tecnomutant-form">
        <div className="ilargiakaos-form-grid">
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.futures.agentId')}</label>
            <Input value={newTecnomutant.agentId} onChange={(e) => setNewTecnomutant({ ...newTecnomutant, agentId: e.target.value })} placeholder={t('ilargiakaos.futures.agentIdPlaceholder')} />
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.futures.carbonTraits')}</label>
            <Input value={newTecnomutant.carbonTraits} onChange={(e) => setNewTecnomutant({ ...newTecnomutant, carbonTraits: e.target.value })} placeholder={t('ilargiakaos.futures.carbonTraitsPlaceholder')} />
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.futures.siliconTraits')}</label>
            <Input value={newTecnomutant.siliconTraits} onChange={(e) => setNewTecnomutant({ ...newTecnomutant, siliconTraits: e.target.value })} placeholder={t('ilargiakaos.futures.siliconTraitsPlaceholder')} />
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.futures.mandatoryImplants')}</label>
            <Input value={newTecnomutant.mandatoryImplants} onChange={(e) => setNewTecnomutant({ ...newTecnomutant, mandatoryImplants: e.target.value })} placeholder={t('ilargiakaos.futures.mandatoryImplantsPlaceholder')} />
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.futures.chosenAugmentations')}</label>
            <Input value={newTecnomutant.chosenAugmentations} onChange={(e) => setNewTecnomutant({ ...newTecnomutant, chosenAugmentations: e.target.value })} placeholder={t('ilargiakaos.futures.chosenAugmentationsPlaceholder')} />
          </div>
          <div className="ilargiakaos-form-field">
            <label>{t('ilargiakaos.futures.surveillanceExposure')}</label>
            <input type="range" min="0" max="100" value={newTecnomutant.surveillanceExposure} onChange={(e) => setNewTecnomutant({ ...newTecnomutant, surveillanceExposure: parseInt(e.target.value) })} />
            <span>{newTecnomutant.surveillanceExposure}%</span>
          </div>
        </div>
        <Button variant="primary" onClick={() => {
          const agent = {
            agentId: newTecnomutant.agentId,
            carbonTraits: newTecnomutant.carbonTraits.split(',').map(t => t.trim()).filter(Boolean),
            siliconTraits: newTecnomutant.siliconTraits.split(',').map(t => t.trim()).filter(Boolean),
            mandatoryImplants: newTecnomutant.mandatoryImplants.split(',').map(t => t.trim()).filter(Boolean),
            chosenAugmentations: newTecnomutant.chosenAugmentations.split(',').map(t => t.trim()).filter(Boolean),
            surveillanceExposure: newTecnomutant.surveillanceExposure,
          }
          actions.registerIdentity(agent)
        }}>
          🧬 {t('ilargiakaos.futures.registerTecnomutant')}
        </Button>
      </Card>
    </section>

    <section className="ilargiakaos-tecnomutant-section">
      <h3>🧬 {t('ilargiakaos.futures.registeredTecnomutants')}</h3>
      <div className="ilargiakaos-tecnomutant-grid">
        {Object.values(identities).map(id => (
          <TecnomutantCard key={id.agentId} identity={id} />
        ))}
      </div>
    </section>

    <section className="ilargiakaos-tecnomutant-section">
      <h3>📚 {t('ilargiakaos.futures.tecnomutantTheory')}</h3>
      <div className="ilargiakaos-theory-grid">
        {TECNOMUTANT_THEORY.map((t, i) => (
          <Card key={i} className="ilargiakaos-theory-card">
            <Icon name={t.icon} size={24} style={{ color: t.color }} />
            <h4>{t.title}</h4>
            <p>{t.description}</p>
          </Card>
        ))}
      </div>
    </section>
  </div>
)

const PostcapitalistTab: React.FC<{ desires: any[] }> = ({ desires }) => (
  <div className="ilargiakaos-postcapitalist-tab">
    <section className="ilargiakaos-postcapitalist-section">
      <h3>💭 {t('ilargiakaos.futures.extractedDesires')}</h3>
      <div className="ilargiakaos-desires-grid">
        {desires.map(desire => (
          <DesireCard key={desire.artifactId} desire={desire} />
        ))}
      </div>
    </section>

    <section className="ilargiakaos-postcapitalist-section">
      <h3>🧠 {t('ilargiakaos.futures.desireCategories')}</h3>
      <div className="ilargiakaos-category-grid">
        {DESIRE_CATEGORIES.map((cat, i) => (
          <Card key={i} className="ilargiakaos-category-card">
            <Icon name={cat.icon} size={24} style={{ color: cat.color }} />
            <h4>{cat.title}</h4>
            <p>{cat.description}</p>
            <Badge variant="info">{cat.count(desires)} {t('ilargiakaos.futures.artifacts')}</Badge>
          </Card>
        ))}
      </div>
    </section>

    <section className="ilargiakaos-postcapitalist-section">
      <h3>🧠 {t('ilargiakaos.futures.desireTheory')}</h3>
      <div className="ilargiakaos-theory-grid">
        {DESIRE_THEORY.map((t, i) => (
          <Card key={i} className="ilargiakaos-theory-card">
            <Icon name={t.icon} size={24} style={{ color: t.color }} />
            <h4>{t.title}</h4>
            <p>{t.description}</p>
          </Card>
        ))}
      </div>
    </section>
  </div>
)

const SynthesisTab: React.FC<{ models: any[]; accelerationism: any; desires: any[] }> = ({ models, accelerationism, desires }) => (
  <div className="ilargiakaos-synthesis-tab">
    <section className="ilargiakaos-synthesis-section">
      <h3>🧠 {t('ilargiakaos.futures.grandSynthesis')}</h3>
      <Card className="ilargiakaos-synthesis-main">
        <h4>{t('ilargiakaos.futures.synthesisTitle')}</h4>
        <p>{t('ilargiakaos.futures.synthesisText')}</p>
      </Card>
    </section>

    <section className="ilargiakaos-synthesis-section">
      <h3>📊 {t('ilargiakaos.futures.keyMetrics')}</h3>
      <div className="ilargiakaos-synthesis-metrics">
        <SynthesisMetric label={t('ilargiakaos.futures.totalModels')} value={models.length} icon="Sunrise" color="var(--limon)" />
        <SynthesisMetric label={t('ilargiakaos.futures.avgViability')} value={`${Math.round(models.reduce((s, m) => s + m.viabilityScore, 0) / Math.max(models.length, 1))}%`} icon="TrendingUp" color="var(--genio)" />
        <SynthesisMetric label={t('ilargiakaos.futures.avgBookchin')} value={`${Math.round(models.reduce((s, m) => s + m.bookchinAlignment, 0) / Math.max(models.length, 1))}%`} icon="Leaf" color="var(--genio)" />
        <SynthesisMetric label={t('ilargiakaos.futures.divergence')} value={`${accelerationism.divergenceScore > 0 ? '+' : ''}{accelerationism.divergenceScore}`} icon="Zap" color={accelerationism.divergenceScore > 0 ? 'var(--genio)' : 'var(--haiti)'} />
        <SynthesisMetric label={t('ilargiakaos.futures.totalDesires')} value={desires.length} icon="Heart" color="var(--haiti)" />
        <SynthesisMetric label={t('ilargiakaos.futures.avgExtraction')} value={`${Math.round(desires.reduce((s, d) => s + d.extractionPotential, 0) / Math.max(desires.length, 1))}%`} icon="Brain" color="var(--cyan-400)" />
      </div>
    </section>

    <section className="ilargiakaos-synthesis-section">
      <h3>🧭 {t('ilargiakaos.futures.strategicAxes')}</h3>
      <div className="ilargiakaos-axes-grid">
        {STRATEGIC_AXES.map((axis, i) => (
          <Card key={i} className="ilargiakaos-axis-card">
            <Icon name={axis.icon} size={24} style={{ color: axis.color }} />
            <h4>{axis.title}</h4>
            <p>{axis.description}</p>
            <Badge variant="info">{axis.priority}</Badge>
          </Card>
        ))}
      </div>
    </section>

    <section className="ilargiakaos-synthesis-section">
      <h3>🗺️ {t('ilargiakaos.futures.roadmap')}</h3>
      <div className="ilargiakaos-roadmap">
        {ROADMAP_STEPS.map((step, i) => (
          <div key={i} className="ilargiakaos-roadmap-step">
            <div className="ilargiakaos-roadmap-marker">{i + 1}</div>
            <div className="ilargiakaos-roadmap-content">
              <h4>{step.title}</h4>
              <p>{step.description}</p>
              <Badge variant="info">{step.timeframe}</Badge>
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
)

// ============================================================================
// COMPONENTES AUXILIARES
// ============================================================================

const FutureModelCard: React.FC<{ model: any }> = ({ model }) => (
  <Card className="ilargiakaos-future-model-card">
    <div className="ilargiakaos-model-header">
      <h4>{model.scenarioName}</h4>
      <Badge variant={model.triggerEvent === 'economic_collapse' ? 'warning' : model.triggerEvent === 'climate' ? 'info' : 'secondary'}>
        {model.triggerEvent}
      </Badge>
    </div>
    <div className="ilargiakaos-model-metrics">
      <Progress value={model.viabilityScore} max={100} showLabel label={t('ilargiakaos.futures.viability')} />
      <Progress value={model.bookchinAlignment} max={100} showLabel label={t('ilargiakaos.futures.bookchinAlignment')} />
    </div>
    <div className="ilargiakaos-model-flags">
      {model.mutualAidNetworks && <Badge variant="success">🤝</Badge>}
      {model.horizontalDecisionMaking && <Badge variant="success">⚖️</Badge>}
      {model.resourceCommons && <Badge variant="success">🌍</Badge>}
      {model.technologyReappropriated && <Badge variant="success">🔧</Badge>}
      {model.ecologicalRegeneration && <Badge variant="success">🌿</Badge>}
      {model.solidarityOverCompetition && <Badge variant="success">🤲</Badge>}
    </div>
  </Card>
)

const AccelerationCard: React.FC<{ title: string; data: any; variant: 'success' | 'danger' }> = ({ title, data, variant }) => (
  <Card className={`ilargiakaos-accel-card ${variant}`}>
    <h4>{title}</h4>
    <div className="ilargiakaos-accel-items">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="ilargiakaos-accel-item">
          <span>{key.replace(/([A-Z])/g, ' $1')}</span>
          <Badge variant={value ? 'success' : 'secondary'}>
            {value ? '✅' : '❌'}
          </Badge>
        </div>
      ))}
    </div>
  </Card>
)

const ComparisonColumn: React.FC<{ title: string; items: string[]; color: string }> = ({ title, items, color }) => (
  <Card className="ilargiakaos-comparison-column" style={{ borderLeft: `4px solid ${color}` }}>
    <h4 style={{ color }}>{title}</h4>
    <ul>{items.map((item, i) => <li key={i}>• {item}</li>)}</ul>
  </Card>
)

const TecnomutantCard: React.FC<{ identity: any }> = ({ identity }) => (
  <Card className="ilargiakaos-tecnomutant-card">
    <div className="ilargiakaos-tecnomutant-header">
      <h4>{identity.agentId}</h4>
      <Badge variant={
        identity.identityType === 'tecnomutant' ? 'warning' :
        identity.identityType === 'hybrid' ? 'info' :
        identity.identityType === 'carbon' ? 'success' : 'secondary'
      }>{identity.identityType}</Badge>
    </div>
    <div className="ilargiakaos-tecnomutant-metrics">
      <div>Carbono: {identity.carbonPercentage}% | Silicio: {identity.siliconPercentage}%</div>
      <div>Autonomía: {identity.autonomyScore}/100 | Resistencia: {identity.resistanceToCapitalistRealism}/100</div>
      <div>Vigilancia: {identity.surveillanceExposure}% | Poh: {identity.pohVerification.humanityScore}/100</div>
    </div>
  </Card>
)

const DesireCard: React.FC<{ desire: any }> = ({ desire }) => (
  <Card className="ilargiakaos-desire-card-full">
    <div className="ilargiakaos-desire-header">
      <h4>{desire.title} ({desire.year})</h4>
      <Badge variant={desire.capitalistRealismSubverted ? 'success' : 'secondary'}>
        {desire.capitalistRealismSubverted ? '🔓' : '🔒'}
      </Badge>
    </div>
    <p>{desire.creators.join(', ')}</p>
    <div className="ilargiakaos-desire-flags">
      {desire.bodyTechBoundaryExplored && <Badge variant="info">🧬</Badge>}
      {desire.empathyAsResistance && <Badge variant="success">💚</Badge>}
      {desire.monopolyCritique && <Badge variant="warning">🏢</Badge>}
      {desire.posthumanConditioning && <Badge variant="info">🤖</Badge>}
      {desire.culturalProgrammingVisible && <Badge variant="secondary">🎭</Badge>}
    </div>
    <Progress value={desire.extractionPotential} max={100} showLabel label={t('ilargiakaos.futures.extractionPotential')} />
    <ul>{desire.hiddenDesires.map((d, i) => <li key={i}>{d}</li>)}</ul>
  </Card>
)

const SynthesisMetric: React.FC<{ label: string; value: string; icon: string; color: string }> = ({ label, value, icon, color }) => (
  <Card className="ilargiakaos-synthesis-metric">
    <Icon name={icon} size={24} style={{ color }} />
    <div className="ilargiakaos-metric-value" style={{ color }}>{value}</div>
    <div className="ilargiakaos-metric-label">{label}</div>
  </Card>
)

const AccelerationItem: React.FC<{ key: string; value: boolean }> = ({ key, value }) => (
  <div className="ilargiakaos-accel-item">
    <span>{key.replace(/([A-Z])/g, ' $1')}</span>
    <Badge variant={value ? 'success' : 'secondary'}>{value ? '✅' : '❌'}</Badge>
  </div>
)

const ComparisonColumn: React.FC<{ title: string; items: string[]; color: string }> = ({ title, items, color }) => (
  <Card className="ilargiakaos-comparison-column" style={{ borderLeft: `4px solid ${color}` }}>
    <h4 style={{ color }}>{title}</h4>
    <ul>{items.map((item, i) => <li key={i}>• {item}</li>)}</ul>
  </Card>
)

const SCENARIO_TEMPLATES = [
  {
    scenarioId: '',
    scenarioName: 'Colapso Económico 2030',
    triggerEvent: 'economic_collapse',
    description: 'Colapso financiero global → comunidades autogestionadas con tech reapropiada',
    initialPopulation: 8000000000,
    availableTech: ['redes mesh', 'energía solar comunitaria', 'agroecología', 'impresoras 3D', 'código abierto'],
    socialCohesion: 60,
    ecologicalDamage: 40,
  },
  {
    scenarioId: '',
    scenarioName: 'Crisis Climática 2040',
    triggerEvent: 'climate',
    description: 'Catástrofe climática → ecoanarquismo, regeneración, municipalismo libertario',
    initialPopulation: 7500000000,
    availableTech: ['permacultura', 'energía renovable distribuida', 'agroforestería', 'captura carbono', 'tech low-tech'],
    socialCohesion: 70,
    ecologicalDamage: 80,
  },
  {
    scenarioId: '',
    scenarioName: 'Pandemia Sintética 2035',
    triggerEvent: 'pandemic',
    description: 'Pandemia diseñada → bioética, soberanía corporal, tech médica comunitaria',
    initialPopulation: 7800000000,
    availableTech: ['biotecnología abierta', 'diagnóstico distribuido', 'vacunas open source', 'soberanía datos genómicos'],
    socialCohesion: 50,
    ecologicalDamage: 30,
  },
]

const LANDIAN_TENETS = [
  'Capitalismo debe superar al humano (Nick Land)',
  'Postcapitalismo vía lo inhumano/incontrolable',
  'Plasticidad infinita sin anclaje humano',
  'Aceleración sin freno cultural = destino',
  'Tecnocapitalismo como fuerza autónoma',
  'Humano como obstáculo a superar',
]

const ANTI_ACCELERATION_TENETS = [
  'Reapropiación cultural de "lo nuevo" (Bobadilla/Soler)',
  'Futuro centrado en lo humano',
  'Innovación controlada y programada culturalmente',
  'PAC (Proyecto Axiológico Colectivo) orienta tech',
  'Tech al servicio de la vida (Bookchin)',
  'Comunicación en red, democrática (Plant)',
]

const TECNOMUTANT_THEORY = [
  { title: 'Carne vieja / Carne nueva', description: 'Sujeto cartesiano (razón/cuerpo fijo) vs Sujeto cibernético (híbrido, hackeable, fluido)', icon: 'GitBranch', color: 'var(--cyan-400)' },
  { title: 'Tecnomutantes', description: 'Sujetos híbridos carbono/silicio que resisten desde la hibridación obligada', icon: 'Zap', color: 'var(--haiti)' },
  { title: 'Identidad fluida', description: 'No binario humano/IA; Poh extendido: humanidad como score 0-100', icon: 'Shield', color: 'var(--genio)' },
  { title: 'Implantes obligatorios vs elegidos', description: 'Vigilancia algorítmica vs aumentaciones elegidas; autonomía = implantes elegidos / vigilancia', icon: 'Cpu', color: 'var(--haiti)' },
  { title: 'Resistencia tecnomutante', description: 'Comunidades híbridas auto-gestionadas; soberanía datos biológicos; redes mesh', icon: 'Users', color: 'var(--genio)' },
]

const DESIRE_CATEGORIES = [
  { title: 'Cuerpo-Tech Poroso', description: 'Frontera cuerpo-tecnología como sitio de lucha', icon: 'GitBranch', color: 'var(--cyan-400)', count: (d: any[]) => d.filter(x => x.bodyTechBoundaryExplored).length },
  { title: 'Empatía como Resistencia', description: 'Empatía hacia lo sintético/otro como acto político', icon: 'Heart', color: 'var(--haiti)', count: (d: any[]) => d.filter(x => x.empathyAsResistance).length },
  { title: 'Crítica Monopolio Tech', description: 'Resistencia a corporaciones que absorben todo (Globotech)', icon: 'Building2', color: 'var(--haiti)', count: (d: any[]) => d.filter(x => x.monopolyCritique).length },
  { title: 'Posthumanismo Crítico', description: 'Condicionamiento posthumano visible y cuestionado', icon: 'Cpu', color: 'var(--cyan-400)', count: (d: any[]) => d.filter(x => x.posthumanConditioning).length },
  { title: 'Subversión Realismo Capitalista', description: 'Obras que rompen "no hay alternativa" (Fisher)', icon: 'Unlock', color: 'var(--genio)', count: (d: any[]) => d.filter(x => x.capitalistRealismSubverted).length },
  { title: 'Programación Cultural Visible', description: 'Tecnociencia como construcción cultural, no natural', icon: 'BookOpen', color: 'var(--acero)', count: (d: any[]) => d.filter(x => x.culturalProgrammingVisible).length },
]

const DESIRE_THEORY = [
  { title: 'Deseo postcapitalista latente', description: 'La cultura pop (Small Soldiers, Cronenberg) expresa deseos reprimidos de autonomía, comunidad, tech liberadora', icon: 'Heart', color: 'var(--haiti)' },
  { title: 'Ficción como prototipado', description: 'Cine/series (Blade Runner, TWD) = simuladores de futuros a evitar/construir', icon: 'Film', color: 'var(--cyan-400)' },
  { title: 'Empatía como política', description: 'Cuidar de lo sintético/vulnerable = acto político contra realismo capitalista', icon: 'Heart', color: 'var(--haiti)' },
  { title: 'Resistencia desde márgenes', description: 'Niños, híbridos, marginados = vanguardia anti-aceleracionista', icon: 'Users', color: 'var(--genio)' },
]

const STRATEGIC_AXES = [
  { title: 'Construir PACs Comunitarios', description: 'Proyectos Axiológicos Colectivos que orienten la tecnociencia (Corbí)', icon: 'Target', color: 'var(--cyan-400)', priority: 'URGENTE' },
  { title: 'Romper Realismo Capitalista', description: 'Detectar y contrarrestar "no hay alternativa" en código, discurso, instituciones (Fisher)', icon: 'AlertTriangle', color: 'var(--haiti)', priority: 'URGENTE' },
  { title: 'Reapropiar "Lo Nuevo"', description: 'Anti-aceleracionismo: programar culturalmente la innovación (Bobadilla/Soler vs Land)', icon: 'Zap', color: 'var(--limon)', priority: 'ALTO' },
  { title: 'Tech Liberadora (Bookchin)', description: 'Solo tech que libere trabajo, regenere biosfera, reduzca alienación, sea democrática', icon: 'Leaf', color: 'var(--genio)', priority: 'ALTO' },
  { title: 'Comunicación Ciberfeminista', description: 'Redes planas, democráticas, de cuidados; no jerárquicas, algorítmicas, extractivas (Plant)', icon: 'Share2', color: 'var(--genio)', priority: 'MEDIO' },
  { title: 'Identidades Híbridas Soberanas', description: 'Tecnomutantes con implantes elegidos, datos propios, resistencia vigilancia', icon: 'Shield', color: 'var(--genio)', priority: 'MEDIO' },
  { title: 'Modelar "Día Después Revolución"', description: 'Gobernanza postapocalíptica: apoyo mutuo, horizontales, comunes, tech reapropiada (Malatesta)', icon: 'Sunrise', color: 'var(--limon)', priority: 'MEDIO' },
  { title: 'Auditoría Neoludista Continua', description: 'Glendinning: tech en manos neoliberales = destrucción; auditoría crítica obligatoria', icon: 'Search', color: 'var(--acero)', priority: 'CONTINUO' },
]

const ROADMAP_STEPS = [
  { title: 'Diagnóstico: Escanear Realismo Capitalista', description: 'Aplicar detectCapitalistRealism a código, discurso, instituciones', timeframe: 'Inmediato' },
  { title: 'Construir Primer PAC Comunitario', description: 'Definir valores, "cómo" actuar, orientación tech liberadora', timeframe: '1-3 meses' },
  { title: 'Auditoría Neoludista de Tech Existente', description: 'Evaluar tech actual: liberadora vs extractiva (Glendinning)', timeframe: '1-3 meses' },
  { title: 'Simular Anti-Aceleración', description: 'Modelar reapropiación de "lo nuevo" vs trayectoria landiana', timeframe: '3-6 meses' },
  { title: 'Registrar Identidades Híbridas', description: 'Mapear tecnomutantes: implantes obligatorios vs elegidos, vigilancia', timeframe: '3-6 meses' },
  { title: 'Extraer Deseos Postcapitalistas', description: 'Analizar cine, series, cultura pop para deseos latentes de autonomía', timeframe: '6-12 meses' },
  { title: 'Modelar Gobernanza Postapocalíptica', description: 'Diseñar "día después revolución": apoyo mutuo, horizontales, tech reapropiada', timeframe: '6-12 meses' },
  { title: 'Escalar: Federación de PACs', description: 'Confederación de comunidades auto-gestionadas (Bookchin)', timeframe: '1-3 años' },
]

export default IlargiakaosFutures