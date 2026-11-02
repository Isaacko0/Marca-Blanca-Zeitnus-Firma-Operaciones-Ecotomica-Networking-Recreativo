// OfferDesignerEvaluator.tsx — Pantalla del Evaluador IA de Ofertas
// Principio Anfibio: funciona offline (mock) o conectado (Claude/OpenAI/local-LLM)

import React, { useState, useEffect } from 'react';
import { useOfferDesigner, useOfferDesignerActions, useOfferDesignerEvaluation, useSalesLetter } from '@core/state/hooks/offer-designer';
import { Button } from '@core/ui/Button';
import { Icon } from '@core/ui/Icon';
import { Card } from '@core/ui/Card';
import { Select } from '@core/ui/Select';
import { t } from '@core/lib/i18n';

export const OfferDesignerEvaluator: React.FC = () => {
  const offer = useOfferDesigner();
  const actions = useOfferDesignerActions();
  const { evaluation, loading, error } = useOfferDesignerEvaluation();
  const salesLetter = useSalesLetter();

  const [evaluatorMode, setEvaluatorMode] = useState<'mock' | 'claude' | 'openai' | 'local-llm'>('mock');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [lastEvaluated, setLastEvaluated] = useState<Date | null>(null);

  useEffect(() => {
    const savedMode = localStorage.getItem('offerDesigner_evaluator_mode') as any;
    const savedKey = localStorage.getItem('offerDesigner_evaluator_apikey');
    if (savedMode) {
      setEvaluatorMode(savedMode);
      actions.setEvaluatorMode(savedMode, savedKey || undefined);
    }
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleEvaluate = async () => {
    actions.setEvaluatorMode(evaluatorMode, apiKey || undefined);
    localStorage.setItem('offerDesigner_evaluator_mode', evaluatorMode);
    if (apiKey) localStorage.setItem('offerDesigner_evaluator_apikey', apiKey);
    await actions.runEvaluation();
    setLastEvaluated(new Date());
  };

  const evalResult = evaluation;

  return (
    <div className="offer-designer-evaluator-screen">
      <header className="offer-designer-evaluator-header">
        <div className="offer-designer-evaluator-title">
          <Icon name="Brain" size={28} style={{ color: 'var(--genio)' }} />
          <h1>{t('offerDesigner.evaluator.title')}</h1>
        </div>
        <div className="offer-designer-evaluator-status">
          {lastEvaluated && (
            <span className="offerDesigner-last-evaluated">
              Última evaluación: {lastEvaluated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </header>

      <div className="offer-designer-evaluator-layout">
        {/* Panel izquierdo - Configuración */}
        <aside className="offer-designer-evaluator-config">
          <Card className="offerDesigner-config-card">
            <h3>⚙️ Configuración del Evaluador</h3>
            
            <div className="offerDesigner-config-field">
              <label htmlFor="evaluator-mode">Modo de evaluación</label>
              <Select
                id="evaluator-mode"
                value={evaluatorMode}
                onChange={(e) => setEvaluatorMode(e.target.value as any)}
                options={[
                  { value: 'mock', label: '🧪 Mock (Offline - Sin API key)' },
                  { value: 'claude', label: '🤖 Claude (Requiere API key)' },
                  { value: 'openai', label: '🤖 OpenAI GPT-4o (Requiere API key)' },
                  { value: 'local-llm', label: '🏠 Local LLM (Ollama/LM Studio)' },
                ]}
              />
            </div>

            {(evaluatorMode === 'claude' || evaluatorMode === 'openai') && (
              <div className="offerDesigner-config-field">
                <label htmlFor="api-key">
                  API Key {showApiKey ? '(ocultar)' : '(mostrar)'}
                  <button type="button" className="offerDesigner-btn ghost offerDesigner-small" onClick={() => setShowApiKey(!showApiKey)}>
                    {showApiKey ? '🙈' : '👁️'}
                  </button>
                </label>
                <input
                  id="api-key"
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`Tu ${evaluatorMode === 'claude' ? 'Claude' : 'OpenAI'} API Key`}
                  className="offerDesigner-input"
                />
                <p className="offerDesigner-hint">La key se guarda en localStorage (solo en este navegador).</p>
              </div>
            )}

            <div className="offerDesigner-config-field">
              <label>Modo monetario de la oferta</label>
              <Select
                value={offer.offer.mode}
                onChange={(e) => actions.setMode(e.target.value as any)}
                options={[
                  { value: 'postmonetario', label: '🌿 Postmonetario (ZNU/CaaS)' },
                  { value: 'conectado', label: '💰 Conectado (USD/USDC vía priceParity)' },
                ]}
              />
            </div>

            <Button 
              variant="primary" 
              size="lg" 
              className="offerDesigner-evaluate-btn"
              onClick={handleEvaluate}
              disabled={loading || !salesLetter.trim()}
            >
              {loading ? (
                <>
                  <span className="offerDesigner-spinner"></span>
                  Evaluando...
                </>
              ) : (
                '🤖 Evaluar Oferta'
              )}
            </Button>

            {error && (
              <div className="offerDesigner-error-message">
                <Icon name="AlertCircle" size={16} />
                <span>Error: {error}</span>
              </div>
            )}
          </Card>

          <Card className="offerDesigner-config-card offerDesigner-preview-card">
            <h3>📄 Carta a evaluar (preview)</h3>
            <div className="offerDesigner-letter-preview">
              <pre>{salesLetter.slice(0, 500)}...</pre>
            </div>
            <p className="offerDesigner-hap-count">{salesLetter.length} caracteres • {salesLetter.split(/\s+/).length} palabras</p>
          </Card>
        </aside>

        {/* Panel principal - Resultados */}
        <main className="offer-designer-evaluator-results">
          {evaluation ? (
            <EvaluationResults evaluation={evaluation} offer={offer.offer} />
          ) : (
            <EmptyEvaluationState />
          )}
        </main>
      </div>
    </div>
  );
};

// ============================================================================
// SUB-COMPONENTES
// ============================================================================

const EmptyEvaluationState: React.FC = () => (
  <div className="offerDesigner-empty-state">
    <Icon name="Brain" size={64} style={{ color: 'var(--muted)', opacity: 0.5 }} />
    <h2>Sin evaluación aún</h2>
    <p>Configura el evaluador y pulsa "Evaluar Oferta" para recibir feedback detallado en 4 dimensiones.</p>
    <div className="offerDesigner-dimension-preview">
      <div className="offerDesigner-dimension-card">
        <span className="offerDesigner-dim-icon">🎯</span>
        <strong>Claridad</strong>
        <span>{'¿Se entiende qué vendes, a quién y la transformación en <10 seg?'}</span>
      </div>
      <div className="offerDesigner-dimension-card">
        <span className="offerDesigner-dim-icon">💖</span>
        <strong>Deseo</strong>
        <span>¿Genera deseo visceral? Dolor + transformación emocional.</span>
      </div>
      <div className="offerDesigner-dimension-card">
        <span className="offerDesigner-dim-icon">📊</span>
        <strong>Prueba</strong>
        <span>¿Evidencia creíble? Casos, métricas, garantía de riesgo.</span>
      </div>
      <div className="offerDesigner-dimension-card">
        <span className="offerDesigner-dim-icon">⚡</span>
        <strong>Urgencia</strong>
        <span>¿Escasez real? Cupos, deadline, costo de inacción.</span>
      </div>
    </div>
  </div>
);

const EvaluationResults: React.FC<{ evaluation: any; offer: any }> = ({ evaluation, offer }) => {
  const { scores, overall, feedback } = evaluation;
  const grade = overall >= 90 ? 'A+' : overall >= 80 ? 'A' : overall >= 70 ? 'B' : overall >= 60 ? 'C' : 'D';
  const gradeColor = overall >= 90 ? 'var(--limon)' : overall >= 80 ? 'var(--genio)' : overall >= 70 ? 'var(--acero)' : overall >= 60 ? 'var(--muted)' : 'var(--muted)';

  return (
    <div className="offerDesigner-evaluation-results">
      <div className="offerDesigner-overall-score">
        <div className="offerDesigner-score-circle" style={{ 
          background: `conic-gradient(${gradeColor} ${overall * 3.6}deg, var(--track) 0deg)` 
        }}>
          <span className="offerDesigner-score-value">{overall}</span>
          <span className="offerDesigner-score-label">/100</span>
        </div>
        <div className="offerDesigner-grade" style={{ color: gradeColor }}>{grade}</div>
        <p className="offerDesigner-score-desc">
          {overall >= 85 ? '🎉 ¡Lista para lanzar!' : overall >= 70 ? '👍 Sólida, pulir detalles' : overall >= 50 ? '⚠️ Necesita trabajo' : '🔴 Requiere revisión mayor'}
        </p>
      </div>

      <div className="offerDesigner-dimension-scores">
        <h3>Desglose por Dimensiones</h3>
        <div className="offerDesigner-score-bars">
          {[
            { key: 'clarity', label: 'Claridad', icon: '🎯', color: 'var(--genio)' },
            { key: 'desire', label: 'Deseo', icon: '💖', color: 'var(--limon)' },
            { key: 'proof', label: 'Prueba', icon: '📊', color: 'var(--acero)' },
            { key: 'urgency', label: 'Urgencia', icon: '⚡', color: 'var(--haiti)' },
          ].map(dim => (
            <div key={dim.key} className="offerDesigner-score-bar">
              <div className="offerDesigner-bar-header">
                <span className="offerDesigner-bar-icon">{dim.icon}</span>
                <span className="offerDesigner-bar-label">{dim.label}</span>
                <span className="offerDesigner-bar-value" style={{ color: dim.color }}>{scores[dim.key as keyof typeof scores]}/100</span>
              </div>
              <div className="offerDesigner-bar-track">
                <div 
                  className="offerDesigner-bar-fill" 
                  style={{ width: `${scores[dim.key as keyof typeof scores]}%`, background: dim.color }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="offerDesigner-feedback-sections">
        {[
          { key: 'clarity', label: 'Claridad 🎯', color: 'var(--genio)' },
          { key: 'desire', label: 'Deseo 💖', color: 'var(--limon)' },
          { key: 'proof', label: 'Prueba 📊', color: 'var(--acero)' },
          { key: 'urgency', label: 'Urgencia ⚡', color: 'var(--haiti)' },
        ].map(section => (
          <Card key={section.key} className="offerDesigner-feedback-card">
            <h4 style={{ color: section.color }}>{section.label}</h4>
            <ul>
              {feedback[section.key as keyof typeof feedback]?.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              )) || <li className="offerDesigner-no-feedback">Sin feedback específico</li>}
            </ul>
          </Card>
        ))}
      </div>

      <div className="offerDesigner-priority-actions">
        <h3>🎯 Acciones Prioritarias (Top 3)</h3>
        <ol>
          {feedback.priority?.map((action: string, i: number) => (
            <li key={i}><strong>{i + 1}.</strong> {action}</li>
          )) || <li>Completa todos los niveles de la oferta</li>}
        </ol>
      </div>

      <div className="offerDesigner-evaluation-actions">
        <button className="offerDesigner-btn secondary" onClick={() => { /* copy report */ }}>
          <Icon name="Copy" size={16} /> Copiar reporte
        </button>
        <button className="offerDesigner-btn secondary" onClick={() => { /* re-evaluate */ }}>
          <Icon name="RefreshCw" size={16} /> Re-evaluar
        </button>
        <button className="offerDesigner-btn primary" onClick={() => { /* go to offer */ }}>
          <Icon name="ArrowRight" size={16} /> Ir a mejorar la oferta
        </button>
      </div>

      <details className="offerDesigner-evaluation-meta">
        <summary>Detalles técnicos</summary>
        <pre>{JSON.stringify(evaluation, null, 2)}</pre>
      </details>
    </div>
  );
}
export default OfferDesignerEvaluator;