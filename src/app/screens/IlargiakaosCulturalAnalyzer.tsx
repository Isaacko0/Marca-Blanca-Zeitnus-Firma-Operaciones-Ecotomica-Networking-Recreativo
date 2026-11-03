// IlargiakaosCulturalAnalyzer.tsx — Analizador Cultural: Cine, Ficción, Cultura Pop
// Principio Anfibio: análisis estructural de deseos postcapitalistas latentes

import React, { useState, useMemo } from 'react';
import { useIlargiakaosStore } from '@core/state/hooks/ilargiakaos';
import { extractPostcapitalistDesire, KNOWN_CULTURAL_ARTIFACTS } from '@core/lib/ilargiakaos-theory';
import { Icon } from '@core/ui/Icon';
import { Button } from '@core/ui/Button';
import { Card } from '@core/ui/Card';
import { Input } from '@core/ui/Input';
import { Textarea } from '@core/ui/Textarea';
import { Select } from '@core/ui/Select';
import { Tabs } from '@core/ui/Tabs';
import { Badge } from '@core/ui/Badge';
import { Progress } from '@core/ui/Progress';
import { t } from '@core/lib/i18n';

export const IlargiakaosCulturalAnalyzer: React.FC = () => {
  const store = useIlargiakaosStore();
  const desires = store.extractedDesires;
  const actions = store;

  const [activeTab, setActiveTab] = useState<'analyze' | 'database' | 'cronenberg' | 'bladerunner' | 'small-soldiers' | 'postapocalyptic'>('analyze');
  const [customArtifact, setCustomArtifact] = useState({
    id: '',
    type: 'film' as const,
    title: '',
    year: new Date().getFullYear(),
    creators: '',
    description: '',
    themes: '',
  });

  const knownArtifacts = useMemo(() => Object.values(KNOWN_CULTURAL_ARTIFACTS), []);

  const handleAnalyze = () => {
    if (!customArtifact.title.trim()) return;
    const artifact = {
      id: customArtifact.id || `custom_${Date.now()}`,
      type: customArtifact.type,
      title: customArtifact.title,
      year: customArtifact.year,
      creators: customArtifact.creators.split(',').map(c => c.trim()).filter(Boolean),
      description: customArtifact.description,
      themes: customArtifact.themes.split(',').map(t => t.trim()).filter(Boolean),
    };
    actions.analyzeArtifact(artifact);
    // Reset form
    setCustomArtifact({ id: '', type: 'film', title: '', year: new Date().getFullYear(), creators: '', description: '', themes: '' });
  };

  return (
    <div className="ilargiakaos-cultural-analyzer">
      <header className="ilargiakaos-cultural-header">
        <div className="ilargiakaos-cultural-title">
          <Icon name="Film" size={28} style={{ color: 'var(--cyan-400)' }} />
          <h1>{t('ilargiakaos.cultural.title')}</h1>
        </div>
        <p className="ilargiakaos-cultural-subtitle">{t('ilargiakaos.cultural.subtitle')}</p>
      </header>

      <Tabs value={activeTab} onChange={setActiveTab} className="ilargiakaos-cultural-tabs">
        <Tabs.List>
          <Tabs.Trigger value="analyze">🔬 {t('ilargiakaos.cultural.analyzeNew')}</Tabs.Trigger>
          <Tabs.Trigger value="database">📚 {t('ilargiakaos.cultural.database')}</Tabs.Trigger>
          <Tabs.Trigger value="cronenberg">🎬 {t('ilargiakaos.cultural.cronenberg')}</Tabs.Trigger>
          <Tabs.Trigger value="bladerunner">🤖 {t('ilargiakaos.cultural.bladerunner')}</Tabs.Trigger>
          <Tabs.Trigger value="small-soldiers">🪖 {t('ilargiakaos.cultural.smallSoldiers')}</Tabs.Trigger>
          <Tabs.Trigger value="postapocalyptic">🌪️ {t('ilargiakaos.cultural.postapocalyptic')}</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="analyze">
          <AnalyzeTab artifact={customArtifact} setArtifact={setCustomArtifact} onAnalyze={handleAnalyze} />
        </Tabs.Content>

        <Tabs.Content value="database">
          <DatabaseTab artifacts={knownArtifacts} />
        </Tabs.Content>

        <Tabs.Content value="cronenberg">
          <CronenbergTab />
        </Tabs.Content>

        <Tabs.Content value="bladerunner">
          <BladeRunnerTab />
        </Tabs.Content>

        <Tabs.Content value="small-soldiers">
          <SmallSoldiersTab />
        </Tabs.Content>

        <Tabs.Content value="postapocalyptic">
          <PostApocalypticTab />
        </Tabs.Content>
      </Tabs>

      {/* Resultados recientes */}
      {desires.length > 0 && (
        <section className="ilargiakaos-recent-results">
          <h3>💭 {t('ilargiakaos.cultural.recentExtractions')}</h3>
          <div className="ilargiakaos-results-grid">
            {desires.slice(0, 6).map(desire => (
              <ResultCard key={desire.artifactId} desire={desire} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

// ============================================================================
// SUB-COMPONENTES
// ============================================================================

const AnalyzeTab: React.FC<{ artifact: any; setArtifact: (a: any) => void; onAnalyze: () => void }> = ({ artifact, setArtifact, onAnalyze }) => (
  <div className="ilargiakaos-analyze-tab">
    <Card className="ilargiakaos-analyze-form">
      <h3>🔬 {t('ilargiakaos.cultural.analyzeForm')}</h3>
      <div className="ilargiakaos-form-grid">
        <div className="ilargiakaos-form-field">
          <label>{t('ilargiakaos.cultural.artifactId')}</label>
          <Input value={artifact.id} onChange={(e) => setArtifact({ ...artifact, id: e.target.value })} placeholder={t('ilargiakaos.cultural.artifactIdPlaceholder')} />
        </div>
        <div className="ilargiakaos-form-field">
          <label>{t('ilargiakaos.cultural.type')}</label>
          <Select value={artifact.type} onChange={(e) => setArtifact({ ...artifact, type: e.target.value })} options={[
            { value: 'film', label: '🎬 Film' },
            { value: 'series', label: '📺 Series' },
            { value: 'book', label: '📖 Book' },
            { value: 'game', label: '🎮 Game' },
            { value: 'toy', label: '🧸 Toy' },
            { value: 'meme', label: '😂 Meme' },
            { value: 'other', label: '📦 Other' },
          ]} />
        </div>
        <div className="ilargiakaos-form-field">
          <label>{t('ilargiakaos.cultural.title')}</label>
          <Input value={artifact.title} onChange={(e) => setArtifact({ ...artifact, title: e.target.value })} placeholder={t('ilargiakaos.cultural.titlePlaceholder')} />
        </div>
        <div className="ilargiakaos-form-field">
          <label>{t('ilargiakaos.cultural.year')}</label>
          <Input type="number" value={artifact.year} onChange={(e) => setArtifact({ ...artifact, year: parseInt(e.target.value) })} min={1900} max={2030} />
        </div>
        <div className="ilargiakaos-form-field">
          <label>{t('ilargiakaos.cultural.creators')}</label>
          <Input value={artifact.creators} onChange={(e) => setArtifact({ ...artifact, creators: e.target.value })} placeholder={t('ilargiakaos.cultural.creatorsPlaceholder')} />
        </div>
        <div className="ilargiakaos-form-field">
          <label>{t('ilargiakaos.cultural.description')}</label>
          <Textarea value={artifact.description} onChange={(e) => setArtifact({ ...artifact, description: e.target.value })} placeholder={t('ilargiakaos.cultural.descriptionPlaceholder')} rows={4} />
        </div>
        <div className="ilargiakaos-form-field">
          <label>{t('ilargiakaos.cultural.themes')}</label>
          <Input value={artifact.themes} onChange={(e) => setArtifact({ ...artifact, themes: e.target.value })} placeholder={t('ilargiakaos.cultural.themesPlaceholder')} />
        </div>
      </div>
      <Button variant="primary" onClick={onAnalyze} className="ilargiakaos-analyze-btn">
        🔬 {t('ilargiakaos.cultural.analyze')}
      </Button>
    </Card>

    <Card className="ilargiakaos-analyze-guide">
      <h4>📋 {t('ilargiakaos.cultural.analysisGuide')}</h4>
      <ul>
        <li><strong>{t('ilargiakaos.cultural.bodyTech')}:</strong> {t('ilargiakaos.cultural.bodyTechDesc')}</li>
        <li><strong>{t('ilargiakaos.cultural.empathyResistance')}:</strong> {t('ilargiakaos.cultural.empathyResistanceDesc')}</li>
        <li><strong>{t('ilargiakaos.cultural.monopolyCritique')}:</strong> {t('ilargiakaos.cultural.monopolyCritiqueDesc')}</li>
        <li><strong>{t('ilargiakaos.cultural.posthuman')}:</strong> {t('ilargiakaos.cultural.posthumanDesc')}</li>
        <li><strong>{t('ilargiakaos.cultural.capitalistRealism')}:</strong> {t('ilargiakaos.cultural.capitalistRealismDesc')}</li>
        <li><strong>{t('ilargiakaos.cultural.culturalProgramming')}:</strong> {t('ilargiakaos.cultural.culturalProgrammingDesc')}</li>
      </ul>
    </Card>
  </div>
);

const DatabaseTab: React.FC<{ artifacts: any[] }> = ({ artifacts }) => (
  <div className="ilargiakaos-database-tab">
    <div className="ilargiakaos-database-header">
      <h3>📚 {t('ilargiakaos.cultural.knownArtifacts')}</h3>
      <span>{artifacts.length} {t('ilargiakaos.cultural.artifactsLoaded')}</span>
    </div>
    <div className="ilargiakaos-database-grid">
      {artifacts.map(artifact => (
        <Card key={artifact.artifactId} className="ilargiakaos-database-card">
          <div className="ilargiakaos-db-card-header">
            <h4>{artifact.title} ({artifact.year})</h4>
            <Badge variant={artifact.capitalistRealismSubverted ? 'success' : 'secondary'}>
              {artifact.capitalistRealismSubverted ? '🔓' : '🔒'}
            </Badge>
          </div>
          <p className="ilargiakaos-db-creators">{artifact.creators.join(', ')}</p>
          <div className="ilargiakaos-db-flags">
            {artifact.bodyTechBoundaryExplored && <Badge variant="info">🧬</Badge>}
            {artifact.empathyAsResistance && <Badge variant="success">💚</Badge>}
            {artifact.monopolyCritique && <Badge variant="warning">🏢</Badge>}
            {artifact.posthumanConditioning && <Badge variant="info">🤖</Badge>}
            {artifact.culturalProgrammingVisible && <Badge variant="secondary">🎭</Badge>}
          </div>
          <Progress value={artifact.extractionPotential} max={100} showLabel label={t('ilargiakaos.cultural.extractionPotential')} />
          <div className="ilargiakaos-db-hidden">
            <strong>{t('ilargiakaos.cultural.hiddenDesires')}:</strong>
            <ul>{artifact.hiddenDesires.map((d, i) => <li key={i}>{d}</li>)}</ul>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const CronenbergTab: React.FC = () => (
  <div className="ilargiakaos-cronenberg-tab">
    <Card className="ilargiakaos-cronenberg-header">
      <h3>🎬 {t('ilargiakaos.cultural.cronenbergTitle')}</h3>
      <p>{t('ilargiakaos.cultural.cronenbergDesc')}</p>
    </Card>

    <div className="ilargiakaos-cronenberg-grid">
      <Card className="ilargiakaos-cronenberg-film">
        <h4>🎬 Crimes of the Future (2022)</h4>
        <p>{t('ilargiakaos.cultural.cronenbergCrimesDesc')}</p>
        <div className="ilargiakaos-cronenberg-analysis">
          <h5>{t('ilargiakaos.cultural.structuralAnalysis')}</h5>
          <ul>
            <li>{t('ilargiakaos.cultural.bodyAsPorous')}</li>
            <li>{t('ilargiakaos.cultural.techReconfiguresDesire')}</li>
            <li>{t('ilargiakaos.cultural.oldFleshVsNewFlesh')}</li>
            <li>{t('ilargiakaos.cultural.lateCapitalism')}</li>
          </ul>
        </div>
        <div className="ilargiakaos-cronenberg-desires">
          <strong>{t('ilargiakaos.cultural.extractedDesires')}:</strong>
          <ul>
            <li>{t('ilargiakaos.cultural.desireBodyRedesignable')}</li>
            <li>{t('ilargiakaos.cultural.desireTechReconfiguresExistence')}</li>
            <li>{t('ilargiakaos.cultural.desireTranscendBioNoCapitalism')}</li>
          </ul>
        </div>
      </Card>

      <Card className="ilargiakaos-cronenberg-film">
        <h4>🎬 Videodrome (1983)</h4>
        <p>{t('ilargiakaos.cultural.cronenbergVideodromeDesc')}</p>
        <div className="ilargiakaos-cronenberg-analysis">
          <h5>{t('ilargiakaos.cultural.structuralAnalysis')}</h5>
          <ul>
            <li>{t('ilargiakaos.cultural.mediaAsFlesh')}</li>
            <li>{t('ilargiakaos.cultural.hallucinationAsReality')}</li>
            <li>{t('ilargiakaos.cultural.tumorAsNewOrgan')}</li>
          </ul>
        </div>
      </Card>

      <Card className="ilargiakaos-cronenberg-film">
        <h4>🎬 Crash (1996)</h4>
        <p>{t('ilargiakaos.cultural.cronenbergCrashDesc')}</p>
        <div className="ilargiakaos-cronenberg-analysis">
          <h5>{t('ilargiakaos.cultural.structuralAnalysis')}</h5>
          <ul>
            <li>{t('ilargiakaos.cultural.carAsProsthesis')}</li>
            <li>{t('ilargiakaos.cultural.woundAsErotic')}</li>
            <li>{t('ilargiakaos.cultural.techAsEroticExtension')}</li>
          </ul>
        </div>
      </Card>

      <Card className="ilargiakaos-cronenberg-film">
        <h4>🎬 eXistenZ (1999)</h4>
        <p>{t('ilargiakaos.cultural.cronenbergExistenzDesc')}</p>
        <div className="ilargiakaos-cronenberg-analysis">
          <h5>{t('ilargiakaos.cultural.structuralAnalysis')}</h5>
          <ul>
            <li>{t('ilargiakaos.cultural.gameAsReality')}</li>
            <li>{t('ilargiakaos.cultural.biopodAsOrgan')}</li>
            <li>{t('ilargiakaos.cultural.realityLayers')}</li>
          </ul>
        </div>
      </Card>
    </div>

    <Card className="ilargiakaos-cronenberg-synthesis">
      <h4>🧠 {t('ilargiakaos.cultural.synthesis')}</h4>
      <p>{t('ilargiakaos.cultural.cronenbergSynthesis')}</p>
      <div className="ilargiakaos-synthesis-points">
        <div className="ilargiakaos-synthesis-point">
          <Icon name="Brain" size={20} style={{ color: 'var(--cyan-400)' }} />
          <span>{t('ilargiakaos.cultural.bodyAsSite')}</span>
        </div>
        <div className="ilargiakaos-synthesis-point">
          <Icon name="Zap" size={20} style={{ color: 'var(--cyan-400)' }} />
          <span>{t('ilargiakaos.cultural.techAsDesire')}</span>
        </div>
        <div className="ilargiakaos-synthesis-point">
          <Icon name="AlertTriangle" size={20} style={{ color: 'var(--haiti)' }} />
          <span>{t('ilargiakaos.cultural.capitalismLate')}</span>
        </div>
      </div>
    </Card>
  </div>
);

const BladeRunnerTab: React.FC = () => (
  <div className="ilargiakaos-bladerunner-tab">
    <Card className="ilargiakaos-bladerunner-header">
      <h3>🤖 {t('ilargiakaos.cultural.bladerunnerTitle')}</h3>
      <p>{t('ilargiakaos.cultural.bladerunnerDesc')}</p>
    </Card>

    <div className="ilargiakaos-bladerunner-grid">
      <Card className="ilargiakaos-bladerunner-film">
        <h4>🤖 Blade Runner (1982) / ¿Sueñan los androides? (1968)</h4>
        <div className="ilargiakaos-bladerunner-analysis">
          <h5>{t('ilargiakaos.cultural.coreConcepts')}</h5>
          <ul>
            <li><strong>{t('ilargiakaos.cultural.empathyBorder')}:</strong> {t('ilargiakaos.cultural.empathyBorderDesc')}</li>
            <li><strong>{t('ilargiakaos.cultural.electricAnimals')}:</strong> {t('ilargiakaos.cultural.electricAnimalsDesc')}</li>
            <li><strong>{t('ilargiakaos.cultural.realVsFelt')}:</strong> {t('ilargiakaos.cultural.realVsFeltDesc')}</li>
            <li><strong>{t('ilargiakaos.cultural.replicantAsMirror')}:</strong> {t('ilargiakaos.cultural.replicantAsMirrorDesc')}</li>
          </ul>
        </div>
        <div className="ilargiakaos-bladerunner-desires">
          <strong>{t('ilargiakaos.cultural.extractedDesires')}:</strong>
          <ul>
            <li>{t('ilargiakaos.cultural.desireEmpathyAsResistance')}</li>
            <li>{t('ilargiakaos.cultural.desireHumanityBeyondBiology')}</li>
            <li>{t('ilargiakaos.cultural.desireCareAsFaith')}</li>
          </ul>
        </div>
      </Card>

      <Card className="ilargiakaos-bladerunner-film">
        <h4>🤖 Blade Runner 2049 (2017)</h4>
        <div className="ilargiakaos-bladerunner-analysis">
          <h5>{t('ilargiakaos.cultural.coreConcepts')}</h5>
          <ul>
            <li><strong>{t('ilargiakaos.cultural.replicantsReproduce')}:</strong> {t('ilargiakaos.cultural.replicantsReproduceDesc')}</li>
            <li><strong>{t('ilargiakaos.cultural.memoriesImplanted')}:</strong> {t('ilargiakaos.cultural.memoriesImplantedDesc')}</li>
            <li><strong>{t('ilargiakaos.cultural.joiAsDesire')}:</strong> {t('ilargiakaos.cultural.joiAsDesireDesc')}</li>
            <li><strong>{t('ilargiakaos.cultural.wallaceAsMonopoly')}:</strong> {t('ilargiakaos.cultural.wallaceAsMonopolyDesc')}</li>
          </ul>
        </div>
        <div className="ilargiakaos-bladerunner-desires">
          <strong>{t('ilargiakaos.cultural.extractedDesires')}:</strong>
          <ul>
            <li>{t('ilargiakaos.cultural.desireAuthenticityInSynthetic')}</li>
            <li>{t('ilargiakaos.cultural.desireCompanionshipPostCapitalism')}</li>
            <li>{t('ilargiakaos.cultural.desireOntologicalBreakthrough')}</li>
          </ul>
        </div>
      </Card>

      <Card className="ilargiakaos-bladerunner-film">
        <h4>🤖 Ghost in the Shell (1995)</h4>
        <div className="ilargiakaos-bladerunner-analysis">
          <h5>{t('ilargiakaos.cultural.coreConcepts')}</h5>
          <ul>
            <li><strong>{t('ilargiakaos.cultural.ghostInShell')}:</strong> {t('ilargiakaos.cultural.ghostInShellDesc')}</li>
            <li><strong>{t('ilargiakaos.cultural.identityAsInfo')}:</strong> {t('ilargiakaos.cultural.identityAsInfoDesc')}</li>
            <li><strong>{t('ilargiakaos.cultural.puppetMaster')}:</strong> {t('ilargiakaos.cultural.puppetMasterDesc')}</li>
            <li><strong>{t('ilargiakaos.cultural.netAsFreedom')}:</strong> {t('ilargiakaos.cultural.netAsFreedomDesc')}</li>
          </ul>
        </div>
      </Card>
    </div>

    <Card className="ilargiakaos-bladerunner-synthesis">
      <h4>🧠 {t('ilargiakaos.cultural.synthesis')}</h4>
      <p>{t('ilargiakaos.cultural.bladerunnerSynthesis')}</p>
      <div className="ilargiakaos-synthesis-points">
        <div className="ilargiakaos-synthesis-point">
          <Icon name="Heart" size={20} style={{ color: 'var(--haiti)' }} />
          <span>{t('ilargiakaos.cultural.empathyAsResistance')}</span>
        </div>
        <div className="ilargiakaos-synthesis-point">
          <Icon name="Zap" size={20} style={{ color: 'var(--cyan-400)' }} />
          <span>{t('ilargiakaos.cultural.identityAsPattern')}</span>
        </div>
        <div className="ilargiakaos-synthesis-point">
          <Icon name="Shield" size={20} style={{ color: 'var(--genio)' }} />
          <span>{t('ilargiakaos.cultural.careAsFaith')}</span>
        </div>
      </div>
    </Card>
  </div>
);

const SmallSoldiersTab: React.FC = () => (
  <div className="ilargiakaos-smallsoldiers-tab">
    <Card className="ilargiakaos-smallsoldiers-header">
      <h3>🪖 {t('ilargiakaos.cultural.smallSoldiersTitle')}</h3>
      <p>{t('ilargiakaos.cultural.smallSoldiersDesc')}</p>
    </Card>

    <Card className="ilargiakaos-smallsoldiers-analysis">
      <h4>🪖 {t('ilargiakaos.cultural.plotSummary')}</h4>
      <p>{t('ilargiakaos.cultural.smallSoldiersPlot')}</p>

      <h4>🔍 {t('ilargiakaos.cultural.structuralAnalysis')}</h4>
      <div className="ilargiakaos-smallsoldiers-points">
        <div className="ilargiakaos-point">
          <Icon name="Building2" size={20} style={{ color: 'var(--haiti)' }} />
          <div>
            <strong>{t('ilargiakaos.cultural.globotechMonopoly')}</strong>
            <p>{t('ilargiakaos.cultural.globotechMonopolyDesc')}</p>
          </div>
        </div>
        <div className="ilargiakaos-point">
          <Icon name="Cpu" size={20} style={{ color: 'var(--cyan-400)' }} />
          <div>
            <strong>{t('ilargiakaos.cultural.militaryChipsInToys')}</strong>
            <p>{t('ilargiakaos.cultural.militaryChipsDesc')}</p>
          </div>
        </div>
        <div className="ilargiakaos-point">
          <Icon name="Shield" size={20} style={{ color: 'var(--genio)' }} />
          <div>
            <strong>{t('ilargiakaos.cultural.realisticAsMilitary')}</strong>
            <p>{t('ilargiakaos.cultural.realisticDesc')}</p>
          </div>
        </div>
        <div className="ilargiakaos-point">
          <Icon name="Users" size={20} style={{ color: 'var(--genio)' }} />
          <div>
            <strong>{t('ilargiakaos.cultural.childResistance')}</strong>
            <p>{t('ilargiakaos.cultural.childResistanceDesc')}</p>
          </div>
        </div>
      </div>

      <h4>💭 {t('ilargiakaos.cultural.extractedDesires')}</h4>
      <ul className="ilargiakaos-desires-list">
        <li>{t('ilargiakaos.cultural.desireToysNotWeapons')}</li>
        <li>{t('ilargiakaos.cultural.desireAutonomyVsCorporate')}</li>
        <li>{t('ilargiakaos.cultural.desirePlayNotWar')}</li>
        <li>{t('ilargiakaos.cultural.desireTechForPlayNotControl')}</li>
      </ul>
    </Card>

    <Card className="ilargiakaos-smallsoldiers-synthesis">
      <h4>🧠 {t('ilargiakaos.cultural.synthesis')}</h4>
      <p>{t('ilargiakaos.cultural.smallSoldiersSynthesis')}</p>
      <div className="ilargiakaos-synthesis-points">
        <div className="ilargiakaos-synthesis-point">
          <Icon name="Building2" size={20} style={{ color: 'var(--haiti)' }} />
          <span>{t('ilargiakaos.cultural.monopolyAbsorbsAll')}</span>
        </div>
        <div className="ilargiakaos-synthesis-point">
          <Icon name="Cpu" size={20} style={{ color: 'var(--cyan-400)' }} />
          <span>{t('ilargiakaos.cultural.militarizationOfDaily')}</span>
        </div>
        <div className="ilargiakaos-synthesis-point">
          <Icon name="Shield" size={20} style={{ color: 'var(--genio)' }} />
          <span>{t('ilargiakaos.cultural.resistanceFromMargins')}</span>
        </div>
      </div>
    </Card>
  </div>
);

const PostApocalypticTab: React.FC = () => (
  <div className="ilargiakaos-postapocalyptic-tab">
    <Card className="ilargiakaos-postapocalyptic-header">
      <h3>🌪️ {t('ilargiakaos.cultural.postapocalypticTitle')}</h3>
      <p>{t('ilargiakaos.cultural.postapocalypticDesc')}</p>
    </Card>

    <Card className="ilargiakaos-postapocalyptic-theory">
      <h4>📚 {t('ilargiakaos.cultural.malatestaConcept')}</h4>
      <p>{t('ilargiakaos.cultural.malatestaQuote')}</p>
      <blockquote>{t('ilargiakaos.cultural.dayAfterRevolution')}</blockquote>
    </Card>

    <div className="ilargiakaos-postapocalyptic-grid">
      <Card className="ilargiakaos-postapocalyptic-film">
        <h4>🧟 The Walking Dead</h4>
        <p>{t('ilargiakaos.cultural.twdDesc')}</p>
        <ul>
          <li>{t('ilargiakaos.cultural.twdHorizontal')}</li>
          <li>{t('ilargiakaos.cultural.twdTechReappropriated')}</li>
          <li>{t('ilargiakaos.cultural.twdSolidarity')}</li>
        </ul>
      </Card>

      <Card className="ilargiakaos-postapocalyptic-film">
        <h4>📖 The Road / El Camino</h4>
        <p>{t('ilargiakaos.cultural.roadDesc')}</p>
        <ul>
          <li>{t('ilargiakaos.cultural.roadBareLife')}</li>
          <li>{t('ilargiakaos.cultural.roadNoAlternatives')}</li>
          <li>{t('ilargiakaos.cultural.roadDespair')}</li>
        </ul>
      </Card>

      <Card className="ilargiakaos-postapocalyptic-film">
        <h4>🏜️ Mad Max / El Libro de Eli</h4>
        <p>{t('ilargiakaos.cultural.madmaxDesc')}</p>
        <ul>
          <li>{t('ilargiakaos.cultural.madmaxScarcity')}</li>
          <li>{t('ilargiakaos.cultural.madmaxWarlords')}</li>
          <li>{t('ilargiakaos.cultural.madmaxAtomPunk')}</li>
        </ul>
      </Card>
    </div>

    <Card className="ilargiakaos-postapocalyptic-synthesis">
      <h4>🧠 {t('ilargiakaos.cultural.synthesis')}</h4>
      <p>{t('ilargiakaos.cultural.postapocalypticSynthesis')}</p>
      <div className="ilargiakaos-synthesis-points">
        <div className="ilargiakaos-synthesis-point">
          <Icon name="Users" size={20} style={{ color: 'var(--genio)' }} />
          <span>{t('ilargiakaos.cultural.dayAfterRevolution')}</span>
        </div>
        <div className="ilargiakaos-synthesis-point">
          <Icon name="Zap" size={20} style={{ color: 'var(--cyan-400)' }} />
          <span>{t('ilargiakaos.cultural.techReappropriated')}</span>
        </div>
        <div className="ilargiakaos-synthesis-point">
          <Icon name="Leaf" size={20} style={{ color: 'var(--genio)' }} />
          <span>{t('ilargiakaos.cultural.ecologicalRegeneration')}</span>
        </div>
        <div className="ilargiakaos-synthesis-point">
          <Icon name="Heart" size={20} style={{ color: 'var(--haiti)' }} />
          <span>{t('ilargiakaos.cultural.solidarityOverCompetition')}</span>
        </div>
      </div>
    </Card>
  </div>
);

const ResultCard: React.FC<{ desire: any }> = ({ desire }) => (
  <Card className="ilargiakaos-result-card">
    <div className="ilargiakaos-result-header">
      <h4>{desire.title} ({desire.year})</h4>
      <Badge variant={desire.capitalistRealismSubverted ? 'success' : 'secondary'}>
        {desire.capitalistRealismSubverted ? '🔓' : '🔒'}
      </Badge>
    </div>
    <p className="ilargiakaos-result-creators">{desire.creators.join(', ')}</p>
    <div className="ilargiakaos-result-flags">
      {desire.bodyTechBoundaryExplored && <Badge variant="info">🧬</Badge>}
      {desire.empathyAsResistance && <Badge variant="success">💚</Badge>}
      {desire.monopolyCritique && <Badge variant="warning">🏢</Badge>}
      {desire.posthumanConditioning && <Badge variant="info">🤖</Badge>}
      {desire.culturalProgrammingVisible && <Badge variant="secondary">🎭</Badge>}
    </div>
    <Progress value={desire.extractionPotential} max={100} showLabel label={t('ilargiakaos.cultural.extractionPotential')} />
  </Card>
);

export default IlargiakaosCulturalAnalyzer;