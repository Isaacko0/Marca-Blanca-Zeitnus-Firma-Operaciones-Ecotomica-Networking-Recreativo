// ALRAC Screen - Consorcio de Transducción Soberana
// Federar proyectos afines sin fusionarlos

import React, { useState } from 'react';
import {
  GitBranch,
  Scale,
  BookOpen,
  Shield,
  Zap,
  Users,
  Banknote,
  FileText,
  Target,
  ArrowRightLeft,
  Layers,
  Network,
  Landmark,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MessageSquare,
  Lightbulb,
  Key,
} from 'lucide-react';
import { Card } from '@components/ui'
import { Stat } from '@components/ui'
import { Btn } from '@components/ui'
import { Badge } from '@components/ui'
import { useAppStore } from '@core/state/store';
import { useALRAC, useEpistemicLayer, useAccountingLayer, useInteropLayer, useFiatLayer, useGovernance, useRevenueSplit, useProductLines } from '@core/state/hooks/alrac';
import { t } from '@core/lib/i18n';

const LAYER_ICONS = {
  epistemic: BookOpen,
  normative: Scale,
  accounting: Zap,
  interop: Network,
  fiat: Landmark,
};

const LAYER_COLORS = {
  epistemic: 'text-purple-400',
  normative: 'text-blue-400',
  accounting: 'text-yellow-400',
  interop: 'text-green-400',
  fiat: 'text-orange-400',
};

const PRODUCT_COLORS = {
  A: 'text-red-400',
  B: 'text-blue-400',
  C: 'text-green-400',
  D: 'text-purple-400',
  E: 'text-orange-400',
};

const STATUS_BADGES = {
  planned: 'outline',
  pilot: 'default',
  active: 'default',
  scaling: 'default',
} as const;

export const ALRAC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'governance' | 'revenue' | 'products' | 'convergence'>('architecture');
  const [expandedLayers, setExpandedLayers] = useState<string[]>(['epistemic', 'accounting']);
  
  const alrac = useALRAC();
  const epistemic = useEpistemicLayer();
  const accounting = useAccountingLayer();
  const interop = useInteropLayer();
  const fiat = useFiatLayer();
  const governance = useGovernance();
  const revenue = useRevenueSplit();
  const products = useProductLines();
  
  const { updateALRAC, resetALRAC } = useAppStore((state) => ({
    updateALRAC: state.updateALRAC,
    resetALRAC: state.resetALRAC,
  }));

  const layers = [
    {
      key: 'epistemic',
      label: t('alrac.layer.epistemic'),
      icon: BookOpen,
      color: 'text-purple-400',
      content: epistemic,
      details: [
        { label: 'Amid Register', value: 'PI, 𝕮, γ-CARMIS, Triaxial, AEI, 20 Límites', license: 'CC0' },
        { label: 'Yoka Register', value: 'Fricción, Presencia, 6 campos, Sin deuda, Convergencia, Separación', license: 'Custom' },
        { label: 'Convergencia verificada', value: epistemic?.convergenceVerified ? 'Sí' : 'Pendiente' },
      ],
    },
    {
      key: 'normative',
      label: t('alrac.layer.normative'),
      icon: Scale,
      color: 'text-blue-400',
      content: alrac?.normativeLayer,
      details: [
        { label: '7 Principios (Javier)', value: alrac?.normativeLayer?.sevenPrinciples?.length || 0 },
        { label: '5 Anti-reglas', value: alrac?.normativeLayer?.fiveAntiRules?.length || 0 },
        { label: '𝕮-Atlas modelos', value: alrac?.normativeLayer?.catlasModels?.length || 0 },
      ],
    },
    {
      key: 'accounting',
      label: t('alrac.layer.accounting'),
      icon: Zap,
      color: 'text-yellow-400',
      content: accounting,
      details: [
        { label: 'Unidad', value: 'TQ (1 TQ = 1 kWh)' },
        { label: 'Límite simétrico', value: '±500 TQ (anti-acaparamiento)' },
        { label: 'Catálogo energético', value: 'ICE Database + Ecoinvent' },
        { label: 'NFC Offline', value: 'ESP32 habilitado' },
        { label: 'Prohibición cambiaria', value: 'TQ ≠ Fiat/Cripto (arquitectura)' },
      ],
    },
    {
      key: 'interop',
      label: t('alrac.layer.interop'),
      icon: Network,
      color: 'text-green-400',
      content: interop,
      details: [
        { label: 'CaaS', value: 'Vectores de contribución' },
        { label: 'AUT', value: 'Vectores de soberanía' },
        { label: 'RAO', value: 'Identidad + Emisor + Procedencia + Permisos + Estado' },
        { label: 'Autómata', value: 'v0.1 + auto-mejora + git auditado' },
        { label: 'Federación nodos', value: 'Autonomía total / normas propias / cultura propia' },
      ],
    },
    {
      key: 'fiat',
      label: t('alrac.layer.fiat'),
      icon: Landmark,
      color: 'text-orange-400',
      content: fiat,
      details: [
        { label: 'Entidad legal', value: 'Cooperativa de trabajo asociado' },
        { label: 'Jurisdicción', value: fiat?.jurisdiction || 'México/Venezuela' },
        { label: '1 asociado = 1 voto', value: fiat?.oneMemberOneVote ? 'Sí' : 'No' },
        { label: 'Respaldado por producción real', value: fiat?.realProductionBacked ? 'Sí' : 'No' },
        { label: 'Puente bancario', value: fiat?.bankingBridge ? 'Sí' : 'No' },
        { label: 'NO captar ahorro', value: `${fiat?.timeline?.yearsBeforeSavings || 3} años + auditoría` },
      ],
    },
  ];

  const handleLayerToggle = (key: string) => {
    setExpandedLayers(prev => prev.includes(key) 
      ? prev.filter(k => k !== key) 
      : [...prev, key]);
  };

  const tabs = [
    { key: 'architecture', label: t('alrac.tab.architecture'), icon: Layers },
    { key: 'governance', label: t('alrac.tab.governance'), icon: Shield },
    { key: 'revenue', label: t('alrac.tab.revenue'), icon: Banknote },
    { key: 'products', label: t('alrac.tab.products'), icon: Target },
    { key: 'convergence', label: t('alrac.tab.convergence'), icon: GitBranch },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('alrac.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('alrac.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Btn variant="outline" onClick={() => resetALRAC?.()}>
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            {t('alrac.reset')}
          </Btn>
          <Btn onClick={() => updateALRAC?.({ status: 'active' })}>
            <CheckCircle className="w-4 h-4 mr-2" />
            {t('alrac.activate')}
          </Btn>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Stat 
          label={t('alrac.status')} 
          value={alrac?.status || 'forming'} 
          icon={GitBranch}
          trend={alrac?.status === 'active' ? 'up' : 'neutral'}
        />
        <Stat 
          label={t('alrac.licenseAudit')} 
          value={governance?.licenseAudit?.status || 'pending'} 
          icon={FileText}
          trend={governance?.licenseAudit?.status === 'completed' ? 'up' : 'neutral'}
        />
        <Stat 
          label={t('alrac.yokaConversation')} 
          value={t('alrac.pending')} 
          icon={MessageSquare}
          trend="neutral"
        />
        <Stat 
          label={t('alrac.pilotActive')} 
          value={products?.some(p => p.status === 'pilot') ? t('alrac.yes') : t('alrac.no')} 
          icon={Lightbulb}
          trend={products?.some(p => p.status === 'pilot') ? 'up' : 'neutral'}
        />
        <Stat 
          label={t('alrac.legalEntity')} 
          value={t('alrac.pending')} 
          icon={Landmark}
          trend="neutral"
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex gap-1 overflow-x-auto" role="tablist">
          {tabs.map(tab => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'architecture' && (
        <div className="space-y-4">
          {/* Capas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {layers.map(layer => {
              const Icon = layer.icon;
              const isExpanded = expandedLayers.includes(layer.key);
              return (
                <Card key={layer.key} className="overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-muted ${layer.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{layer.label}</h3>
                          <p className="text-xs text-muted-foreground">{t(`alrac.layer.${layer.key}.desc`)}</p>
                        </div>
                      </div>
                      <Btn
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLayerToggle(layer.key)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Btn>
                    </div>
                    
                    {isExpanded && (
                      <div className="space-y-2 pt-3 border-t border-border">
                        {layer.details.map((detail, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{detail.label}</span>
                            <span className="text-foreground font-medium">{detail.value}</span>
                          </div>
                        ))}
                        {layer.key === 'epistemic' && layer.content && (
                          <div className="mt-3 p-3 bg-muted rounded-lg">
                            <h4 className="font-medium text-foreground mb-2">{t('alrac.epistemic.convergence')}</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                                <span>{t('alrac.epistemic.samePattern')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span>{t('alrac.epistemic.verified')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-400" />
                                <span>{t('alrac.epistemic.urgent')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Key className="w-4 h-4 text-blue-400" />
                                <span>{t('alrac.epistemic.action')}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Anti-absorción */}
          <Card>
            <div className="p-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                {t('alrac.antiAbsorption')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">{t('alrac.noAbsorptionContract')}</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• {t('alrac.noAbsorption.1')}</li>
                    <li>• {t('alrac.noAbsorption.2')}</li>
                    <li>• {t('alrac.noAbsorption.3')}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">{t('alrac.tqZnuSeparation')}</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• TQ: {t('alrac.tqFunction')}</li>
                    <li>• ZNU: {t('alrac.znuFunction')}</li>
                    <li>• {t('alrac.contradictionResolved')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'governance' && (
        <div className="space-y-4">
          {/* Gobernanza de paz */}
          <Card>
            <div className="p-4">
              <h3 className="font-semibold text-foreground mb-4">{t('alrac.governance.title')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>{t('alrac.governance.noAbsorption')}</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>{t('alrac.governance.triaxialArbitration')}</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>{t('alrac.governance.gammaCARMIS')}</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>{t('alrac.governance.totalConsent')}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-3">{t('alrac.governance.decisionLadder')}</h4>
                  <ol className="space-y-2">
                    {governance?.decisionLadder?.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">{step.step}</span>
                        <div>
                          <p className="font-medium text-foreground">{step.action}</p>
                          <p className="text-muted-foreground">{step.description}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </Card>

          {/* Auditoría de licencias */}
          <Card>
            <div className="p-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                {t('alrac.licenseAudit.title')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Stat label={t('alrac.licenseAudit.totalBackups')} value={governance?.licenseAudit?.backupsTotal || 84} icon={FileText} />
                <Stat label={t('alrac.licenseAudit.withLicense')} value={governance?.licenseAudit?.withDeclaredLicense || 25} icon={CheckCircle} />
                <Stat label={t('alrac.licenseAudit.conflicts')} value={governance?.licenseAudit?.conflicts?.length || 0} icon={AlertTriangle} trend="down" />
              </div>
              {governance?.licenseAudit?.yokaFabioBalbiConflict && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {t('alrac.licenseAudit.yokaConflict')}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'revenue' && (
        <div className="space-y-4">
          {/* Fórmula Amid */}
          <Card>
            <div className="p-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Banknote className="w-5 h-5 text-yellow-400" />
                {t('alrac.revenue.formula')}
              </h3>
              <div className="font-mono text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                <p>ω⁽ᵏ⁾ = ½ · θ_generado⁽ᵏ⁾ · (1 + ι) · φʰ⁽ᵏ⁾</p>
                <p>φʰ⁽ᵏ⁾ = (0.95)ᵏ · (1 + αʰ⁽ᵏ⁾ / 10)</p>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-muted-foreground mb-1">{t('alrac.revenue.halfToGenerator')}</p>
                  <p className="font-medium text-foreground">50% → generador</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-muted-foreground mb-1">{t('alrac.revenue.restByHarmony')}</p>
                  <p className="font-medium text-foreground">50% → capas por αʰ</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-muted-foreground mb-1">{t('alrac.revenue.ppeClause')}</p>
                  <p className="font-medium text-foreground">γ_ind ≈ ½θ_generado</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Capas de reparto */}
          <Card>
            <div className="p-4">
              <h3 className="font-semibold text-foreground mb-4">{t('alrac.revenue.layers')}</h3>
              <div className="space-y-2">
                {revenue?.layers?.map((layer, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${LAYER_COLORS[layer.id.split('-')[1] as keyof typeof LAYER_COLORS] || 'bg-gray-500'}`} />
                      <span className="font-medium text-foreground">{layer.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">{layer.used ? t('alrac.yes') : t('alrac.no')}</span>
                      <span className="text-foreground">{layer.harmonyContribution} αʰ</span>
                      <span className="font-medium text-accent">{layer.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Cláusulas de protección */}
          <Card>
            <div className="p-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-400" />
                {t('alrac.revenue.protection')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium text-foreground mb-1">{t('alrac.revenue.ppe')}</p>
                  <p className="text-sm text-muted-foreground">{t('alrac.revenue.ppeDesc')}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium text-foreground mb-1">{t('alrac.revenue.betaCrit')}</p>
                  <p className="text-sm text-muted-foreground">{t('alrac.revenue.betaCritDesc')}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-4">
          {products?.map(product => {
            const Color = PRODUCT_COLORS[product.id as keyof typeof PRODUCT_COLORS] || 'text-gray-400';
            return (
              <Card key={product.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-muted ${Color}`}>
                        <Target className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{product.name}</h3>
                        <Badge variant={STATUS_BADGES[product.status] as any} className={Color}>
                          {t(`alrac.product.status.${product.status}`)}
                        </Badge>
                      </div>
                    </div>
                    {product.pilot && (
                      <Badge variant="default" className="text-green-400 bg-green-400/10">
                        <Lightbulb className="w-3 h-3 mr-1" />
                        {t('alrac.product.pilot')}
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-3">{product.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">{t('alrac.product.deliverables')}</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {product.deliverables.map((d, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-400" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">{t('alrac.product.fundedBy')}</h4>
                      <div className="flex flex-wrap gap-1">
                        {product.fundedBy.map((f, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{f}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {product.pilot && (
                    <div className="p-3 bg-green-400/10 border border-green-400/20 rounded-lg">
                      <h4 className="font-medium text-green-400 mb-1 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        {product.pilot.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">{product.pilot.description}</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <Badge variant="outline">{t('alrac.product.externalDefined')}: {product.pilot.externalDefined ? t('alrac.yes') : t('alrac.no')}</Badge>
                        <Badge variant="outline">{product.pilot.client || t('alrac.product.noClient')}</Badge>
                        <Badge variant="outline">{product.pilot.timeline.start} - {product.pilot.timeline.end}</Badge>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'convergence' && (
        <div className="space-y-4">
          {/* Hallazgo §3.5 */}
          <Card className="border-yellow-400/30 bg-yellow-400/5">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{t('alrac.convergence.title')}</h3>
                  <p className="text-muted-foreground mb-3">{t('alrac.convergence.description')}</p>
                  <div className="bg-yellow-400/10 p-3 rounded-lg">
                    <p className="font-medium text-yellow-400 mb-2">{t('alrac.convergence.urgent')}</p>
                    <p className="text-sm text-muted-foreground">{t('alrac.convergence.actionRequired')}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabla de convergencia */}
          <Card>
            <div className="p-4">
              <h3 className="font-semibold text-foreground mb-4">{t('alrac.convergence.mapping')}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="pb-2 pr-4">{t('alrac.convergence.problem')}</th>
                      <th className="pb-2 pr-4">{t('alrac.convergence.alracSolution')}</th>
                      <th className="pb-2 pr-4">{t('alrac.convergence.nexoSolution')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4 text-foreground">{t('alrac.convergence.problems.noAbsorption')}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{t('alrac.convergence.alrac.noAbsorption')}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{t('alrac.convergence.nexo.noAbsorption')}</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4 text-foreground">{t('alrac.convergence.problems.arbitration')}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{t('alrac.convergence.alrac.arbitration')}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{t('alrac.convergence.nexo.arbitration')}</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4 text-foreground">{t('alrac.convergence.problems.reconfig')}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{t('alrac.convergence.alrac.reconfig')}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{t('alrac.convergence.nexo.reconfig')}</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 text-foreground">{t('alrac.convergence.problems.separation')}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{t('alrac.convergence.alrac.separation')}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{t('alrac.convergence.nexo.separation')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          {/* Acciones requeridas */}
          <Card>
            <div className="p-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-400" />
                {t('alrac.convergence.nextSteps')}
              </h3>
              <ol className="space-y-3">
                <li className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">0</span>
                  <div>
                    <p className="font-medium text-foreground">{t('alrac.convergence.steps.0')}</p>
                    <p className="text-sm text-muted-foreground">{t('alrac.convergence.steps.0Desc')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">1</span>
                  <div>
                    <p className="font-medium text-foreground">{t('alrac.convergence.steps.1')}</p>
                    <p className="text-sm text-muted-foreground">{t('alrac.convergence.steps.1Desc')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">2</span>
                  <div>
                    <p className="font-medium text-foreground">{t('alrac.convergence.steps.2')}</p>
                    <p className="text-sm text-muted-foreground">{t('alrac.convergence.steps.2Desc')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">3</span>
                  <div>
                    <p className="font-medium text-foreground">{t('alrac.convergence.steps.3')}</p>
                    <p className="text-sm text-muted-foreground">{t('alrac.convergence.steps.3Desc')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">4</span>
                  <div>
                    <p className="font-medium text-foreground">{t('alrac.convergence.steps.4')}</p>
                    <p className="text-sm text-muted-foreground">{t('alrac.convergence.steps.4Desc')}</p>
                  </div>
                </li>
              </ol>
            </div>
          </Card>

          {/* Riesgos */}
          <Card>
            <div className="p-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                {t('alrac.convergence.risks')}
              </h3>
              <ul className="space-y-2">
                {[
                  'convergence.risks.duplication',
                  'convergence.risks.layer3',
                  'convergence.risks.tqValidation',
                  'convergence.risks.hscsgIntegration',
                  'convergence.risks.architecture',
                ].map((risk, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{t(`alrac.${risk}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      )}

      {/* Footer actions */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
        <Btn onClick={() => updateALRAC?.({ status: 'active', lastAudit: Date.now() })}>
          <CheckCircle className="w-4 h-4 mr-2" />
          {t('alrac.markActive')}
        </Btn>
        <Btn variant="outline" onClick={() => updateALRAC?.({ governance: { ...governance!, licenseAudit: { ...governance!.licenseAudit, status: 'completed' } } })}>
          <FileText className="w-4 h-4 mr-2" />
          {t('alrac.completeAudit')}
        </Btn>
        <Btn variant="outline" onClick={() => updateALRAC?.({ productLines: products?.map(p => p.id === 'C' ? { ...p, status: 'active' } : p) })}>
          <Lightbulb className="w-4 h-4 mr-2" />
          {t('alrac.launchPilot')}
        </Btn>
        <Btn variant="ghost">
          <ExternalLink className="w-4 h-4 mr-2" />
          {t('alrac.viewOnGitHub')}
        </Btn>
      </div>
    </div>
  );
};

export default ALRAC;