// OfferDesignerCarta.tsx — Pantalla de Carta de Venta Final (editable, exportable)
// Principio Anfibio: genera carta en modo postmonetario (ZNU) o conectado (USD)

import React, { useMemo } from 'react';
import { useOfferDesigner, useOfferDesignerActions, useSalesLetter } from '@core/state/hooks/offer-designer';
import { generateSalesLetter } from '@core/lib/offer-designer';
import { Button } from '@core/ui/Button';
import { Icon } from '@core/ui/Icon';
import { t } from '@core/lib/i18n';

export const OfferDesignerCarta: React.FC = () => {
  const offer = useOfferDesigner();
  const actions = useOfferDesignerActions();
  const salesLetter = useSalesLetter();

  const cartaCompleta = useMemo(() => generateSalesLetter(offer.levels, offer.offer.mode, offer.offer.priceParity), [offer.levels, offer.offer.mode, offer.offer.priceParity]);

  const power = offer.offer.power;
  const isReady = power >= 85;

  return (
    <div className="offerDesigner-carta-screen">
      <header className="offerDesigner-carta-header">
        <div className="offerDesigner-carta-title">
          <Icon name="FileText" size={28} style={{ color: 'var(--genio)' }} />
          <h1>{t('offerDesigner.carta.title')}</h1>
        </div>
        <div className="offerDesigner-carta-status">
          <span className={`offerDesigner-power-badge ${power >= 85 ? 'ready' : power >= 60 ? 'solid' : power >= 30 ? 'progress' : 'draft'}`}>
            Poder: {power}%
          </span>
        </div>
      </header>

      <div className="offerDesigner-carta-layout">
        {/* Panel izquierdo - Editor de carta */}
        <main className="offerDesigner-carta-editor">
          <div className="offerDesigner-carta-toolbar">
            <div className="offerDesigner-toolbar-group">
              <button className="offerDesigner-btn secondary" onClick={() => actions.copySalesLetter()}>
                <Icon name="Copy" size={16} /> {t('offerDesigner.carta.copy')}
              </button>
              <button className="offerDesigner-btn secondary" onClick={() => {
                const blob = new Blob([cartaCompleta], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `oferta-offerDesigner-${Date.now()}.md`;
                a.click();
                URL.revokeObjectURL(url);
              }}>
                <Icon name="Download" size={16} /> {t('offerDesigner.carta.download')}
              </button>
              <button className="offerDesigner-btn secondary" onClick={() => {
                const blob = new Blob([cartaCompleta], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `oferta-offerDesigner-${Date.now()}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}>
                <Icon name="FileJson" size={16} /> {t('offerDesigner.carta.exportJson')}
              </button>
            </div>
            <div className="offerDesigner-toolbar-group">
              <select 
                value={offer.offer.mode}
                onChange={(e) => actions.setMode(e.target.value as any)}
                className="offerDesigner-mode-select"
                aria-label="Modo monetario"
              >
                <option value="postmonetario">🌿 Postmonetario (ZNU)</option>
                <option value="conectado">💰 Conectado (USD/USDC)</option>
              </select>
            </div>
          </div>

          <div className="offerDesigner-carta-content-wrapper">
            <div className="offerDesigner-carta-preview" contentEditable suppressContentEditableWarning={true}>
              <pre className="offerDesigner-carta-text" spellCheck={false}>{cartaCompleta}</pre>
            </div>
          </div>

          {!isReady && (
            <div className="offerDesigner-carta-warning">
              <Icon name="AlertTriangle" size={20} />
              <span>{power >= 60 ? 'Tu oferta está sólida pero le faltan detalles para estar lista.' : 'Tu oferta necesita más trabajo. Completa los niveles pendientes.'}</span>
              <button className="offerDesigner-btn primary" onClick={() => { /* navigate to offer */ }}>
                Ir a completar niveles
              </button>
            </div>
          )}
        </main>

        {/* Panel derecho - Checklist de validación */}
        <aside className="offerDesigner-carta-sidebar">
          <div className="offerDesigner-sidebar-section">
            <h3>✅ Checklist de Validación</h3>
            <ValidationChecklist offer={offer.offer} />
          </div>

          <div className="offerDesigner-sidebar-section">
            <h3>📊 Métricas de la Carta</h3>
            <LetterMetrics carta={cartaCompleta} />
          </div>

          <div className="offerDesigner-sidebar-section">
            <h3>🚀 Próximos Pasos</h3>
            <NextSteps offer={offer.offer} />
          </div>
        </aside>
      </div>
    </div>
  );
};

// ============================================================================
// SUB-COMPONENTES
// ============================================================================

const ValidationChecklist: React.FC<{ offer: any }> = ({ offer }) => {
  const checks = [
    { id: 'headline', label: 'Headline con promesa + plazo + mecanismo', check: () => offer.levels.carta?.fields.headline?.length > 20 },
    { id: 'avatar', label: 'Avatar (Soulmate) definido', check: () => offer.levels.soulmate?.completed },
    { id: 'promise', label: 'Promesa medible (antes/después + métricas)', check: () => offer.levels.promesa?.completed && (offer.levels.promesa?.fields.proof?.length > 50) },
    { id: 'proof', label: 'Prueba social / casos de estudio', check: () => offer.levels.blindaje?.completed && (offer.levels.blindaje?.fields.socialProof?.length > 50) },
    { id: 'offer', label: 'Oferta clara (qué incluye, precio, garantía)', check: () => offer.levels.carta?.fields.offer?.length > 100 },
    { id: 'cta', label: 'CTA claro con urgencia real', check: () => offer.levels.carta?.fields.cta?.length > 10 },
    { id: 'guarantee', label: 'Garantía de riesgo revertido', check: () => offer.levels.precio?.fields.guarantee?.length > 30 },
    { id: 'bonuses', label: 'Bonos con urgencia/escasez reales', check: () => offer.levels.bonos?.completed },
  ];

  return (
    <ul className="offerDesigner-checklist">
      {checks.map(item => (
        <li key={item.id} className={`offerDesigner-check-item ${item.check() ? 'pass' : 'fail'}`}>
          <span className="offerDesigner-check-icon">{item.check() ? '✅' : '❌'}</span>
          <span className="offerDesigner-check-label">{item.label}</span>
        </li>
      ))}
    </ul>
  );
};

const LetterMetrics: React.FC<{ carta: string }> = ({ carta }) => {
  const words = carta.trim().split(/\s+/).length;
  const chars = carta.length;
  const lines = carta.split('\n').length;
  const hasHeadline = /^(#|\*).{20,}/m.test(carta);
  const hasCTA = /(aplica|inscr|comienza|empieza|clic|reserva|ahora|hoy)/i.test(carta);
  const hasProof = /\d+%|\d+x|\d+\s*(clientes|casos|resultados)/i.test(carta);
  const hasGuarantee = /(garant|devol|riesgo|100%)/i.test(carta);
  const hasUrgency = /(cupo|limitad|expira|hoy|ahora|48h|24h)/i.test(carta);

  return (
    <div className="offerDesigner-metrics">
      <div className="offerDesigner-metric"><span>{words}</span><label>Palabras</label></div>
      <div className="offerDesigner-metric"><span>{chars}</span><label>Caracteres</label></div>
      <div className="offerDesigner-metric"><span>{lines}</span><label>Líneas</label></div>
      <div className="offerDesigner-metric"><span>{hasHeadline ? '✅' : '❌'}</span><label>Headline</label></div>
      <div className="offerDesigner-metric"><span>{hasCTA ? '✅' : '❌'}</span><label>CTA</label></div>
      <div className="offerDesigner-metric"><span>{hasProof ? '✅' : '❌'}</span><label>Prueba</label></div>
      <div className="offerDesigner-metric"><span>{hasGuarantee ? '✅' : '❌'}</span><label>Garantía</label></div>
      <div className="offerDesigner-metric"><span>{hasUrgency ? '✅' : '❌'}</span><label>Urgencia</label></div>
    </div>
  );
};

const NextSteps: React.FC<{ offer: any }> = ({ offer }) => {
  const incompleteLevels = Object.entries(offer.levels)
    .filter(([_, v]: any) => !v.completed)
    .map(([k]) => k);

  if (incompleteLevels.length === 0) {
    return (
      <div className="offerDesigner-next-steps ready">
        <p>🎉 ¡Todos los niveles completados!</p>
        <ul>
          <li>Exporta la carta (Markdown/JSON)</li>
          <li>Pásala por el Evaluador IA</li>
          <li>Lanza tu oferta</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="offerDesigner-next-steps">
      <p>Quedan {incompleteLevels.length} niveles por completar:</p>
      <ol>
        {incompleteLevels.slice(0, 3).map(level => (
          <li key={level}>{level}</li>
        ))}
      </ol>
      <button className="offerDesigner-btn primary" onClick={() => { /* navigate */ }}>
        Ir al siguiente: {incompleteLevels[0]}
      </button>
    </div>
  );
};

export default OfferDesignerCarta;