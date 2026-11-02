// OfferDesigner.tsx — Pantalla principal del Diseñador de Ofertas (8 niveles)
// Principio Anfibio: funciona offline-first, modo postmonetario/conectado vía priceParity

import React, { useEffect, useMemo } from 'react';
import { useOfferDesigner, useOfferDesignerUI, useOfferDesignerActions, useCurrentLevel, usePowerBreakdown, useProgress, useUnlockedLevels, useSalesLetter } from '@core/state/hooks/offer-designer';
import { OFFER_LEVELS, LEVEL_RENDER_META, validateLevelData } from '@core/lib/offer-designer-levels';
import { Icon } from '@core/ui/Icon';
import { Button } from '@core/ui/Button';
import { Card } from '@core/ui/Card';
import { Textarea } from '@core/ui/Textarea';
import { Input } from '@core/ui/Input';
import { Switch } from '@core/ui/Switch';
import { toast } from '@core/ui/toast';
import { t } from '@core/lib/i18n';

export const OfferDesigner: React.FC = () => {
  const offer = useOfferDesigner();
  const ui = useOfferDesignerUI();
  const actions = useOfferDesignerActions();
  const currentLevelData = useCurrentLevel();
  const power = usePowerBreakdown();
  const progress = useProgress();
  const unlockedLevels = useUnlockedLevels();
  const salesLetter = useSalesLetter();

  const currentLevelId = offer.currentLevel;
  const currentLevelConfig = OFFER_LEVELS.find(l => l.id === currentLevelId);
  const currentMeta = currentLevelConfig ? LEVEL_RENDER_META[currentLevelId] : null;

  // Auto-save effect
  useEffect(() => {
    if (offer.config.autoSave) {
      const timer = setTimeout(() => actions.saveToStorage(), offer.config.autoSaveInterval);
      return () => clearTimeout(timer);
    }
  }, [offer]);

  // Detect v1 data on mount
  useEffect(() => {
    actions.detectV1Data();
  }, []);

  if (!currentLevelConfig) return null;

  const levelValidation = currentLevelData ? validateLevelData(currentLevelId, currentLevelData.fields) : { isValid: false, errors: [], warnings: [], suggestions: [] };

  const renderField = (fieldId: string, label: string, placeholder: string, multiline = true, minChars = 0) => {
    const value = currentLevelData?.fields[fieldId] || '';
    const error = levelValidation.errors.includes(fieldId);
    const warning = levelValidation.warnings.some(w => w.startsWith(fieldId));

    return (
      <div key={fieldId} className="offerDesigner-field">
        <label className="offerDesigner-label" htmlFor={`offerDesigner-${fieldId}`}>
          {label} {minChars > 0 && <span className="offerDesigner-min-chars">(mín {minChars} chars)</span>}
        </label>
        {multiline ? (
          <Textarea
            id={`offerDesigner-${fieldId}`}
            value={value}
            onChange={(e) => actions.updateLevelField(currentLevelId, fieldId, e.target.value)}
            placeholder={placeholder}
            rows={minChars > 100 ? 6 : 4}
            className={error ? 'error' : warning ? 'warning' : ''}
            aria-invalid={error}
            aria-describedby={error ? `${fieldId}-error` : warning ? `${fieldId}-warning` : undefined}
          />
        ) : (
          <Input
            id={`offerDesigner-${fieldId}`}
            value={value}
            onChange={(e) => actions.updateLevelField(currentLevelId, fieldId, e.target.value)}
            placeholder={placeholder}
            className={error ? 'error' : warning ? 'warning' : ''}
            aria-invalid={error}
            aria-describedby={error ? `${fieldId}-error` : warning ? `${fieldId}-warning` : undefined}
          />
        )}
        {error && <span id={`${fieldId}-error`} className="offerDesigner-error">Campo requerido</span>}
        {warning && levelValidation.warnings.filter(w => w.startsWith(fieldId)).map((w, i) => (
          <span key={i} id={`${fieldId}-warning`} className="offerDesigner-warning">⚠ {w}</span>
        ))}
        {levelValidation.suggestions.filter(s => s.includes(fieldId)).map((s, i) => (
          <span key={i} className="offerDesigner-suggestion">💡 {s}</span>
        ))}
      </div>
    );
  };

  const renderLevelFields = () => {
    if (!currentLevelConfig) return null;

    const config = currentLevelConfig;
    const meta = currentMeta;
    const fields = currentLevelData?.fields || {};

    return (
      <div className="offerDesigner-level-content">
        {meta && (
          <div className="offerDesigner-level-header">
            <Icon name={meta.icon} className="offerDesigner-level-icon" style={{ color: meta.color }} size={32} />
            <div className="offerDesigner-level-info">
              <h2>{config.title[t('lang') as keyof typeof config.title] || config.title.es}</h2>
              <p className="offerDesigner-description">{config.description[t('lang') as keyof typeof config.description] || config.description.es}</p>
              <div className="offerDesigner-meta">
                <span className="offerDesigner-difficulty">{meta.difficulty === 'easy' ? '🟢 Fácil' : meta.difficulty === 'medium' ? '🟡 Medio' : '🔴 Difícil'}</span>
                <span className="offerDesigner-time">⏱ ~{meta.estimatedMinutes} min</span>
              </div>
            </div>
          </div>
        )}

        {meta?.tips && meta.tips.length > 0 && (
          <div className="offerDesigner-tips">
            <h4>💡 Consejos</h4>
            <ul>
              {meta.tips.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
          </div>
        )}

        <div className="offerDesigner-fields-grid">
          {config.requiredFields.map(fieldId => {
            const meta = LEVEL_RENDER_META[currentLevelId];
            const example = meta?.examples[fieldId];
            const minChars = config.minChars?.[fieldId] || 0;
            const isMultiline = minChars > 50 || fieldId.includes('State') || fieldId.includes('modules') || fieldId.includes('List') || fieldId.includes('faqs');
            
            return renderField(
              fieldId,
              fieldId.charAt(0).toUpperCase() + fieldId.slice(1).replace(/([A-Z])/g, ' $1'),
              example || `Escribe tu ${fieldId}...`,
              isMultiline,
              minChars
            );
          })}
          
          {config.optionalFields.map(fieldId => {
            const meta = LEVEL_RENDER_META[currentLevelId];
            const example = meta?.examples[fieldId];
            const minChars = config.minChars?.[fieldId] || 0;
            const isMultiline = minChars > 50;
            
            return (
              <div key={fieldId} className="offerDesigner-field offerDesigner-optional">
                <label className="offerDesigner-label" htmlFor={`offerDesigner-${fieldId}`}>
                  {fieldId.charAt(0).toUpperCase() + fieldId.slice(1).replace(/([A-Z])/g, ' $1')} <span className="offerDesigner-optional-badge">(opcional)</span>
                </label>
                <Textarea
                  id={`offerDesigner-${fieldId}`}
                  value={fields[fieldId] || ''}
                  onChange={(e) => actions.updateLevelField(currentLevelId, fieldId, e.target.value)}
                  placeholder={example || `Opcional: ${fieldId}...`}
                  rows={4}
                />
              </div>
            );
          })}
        </div>

        <div className="offerDesigner-level-actions">
          <Button
            variant={levelValidation.isValid ? 'primary' : 'secondary'}
            onClick={() => actions.validateAndCompleteLevel(currentLevelId)}
            disabled={!levelValidation.isValid}
            className="offerDesigner-complete-btn"
          >
            {currentLevelData?.completed ? '✅ Nivel completado' : '✅ Completar nivel'}
          </Button>
          
          {currentLevelData?.completed && (
            <Button variant="ghost" onClick={() => actions.resetLevel(currentLevelId)} className="offerDesigner-reset-btn">
              🔄 Reiniciar nivel
            </Button>
          )}
        </div>

        {levelValidation.warnings.length > 0 && (
          <div className="offerDesigner-warnings">
            <h4>⚠ Advertencias</h4>
            <ul>{levelValidation.warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
          </div>
        )}

        {levelValidation.suggestions.length > 0 && (
          <div className="offerDesigner-suggestions">
            <h4>💡 Sugerencias</h4>
            <ul>{levelValidation.suggestions.map((s, i) => <li key={i}>{s}</li>)}</ul>
          </div>
        )}

        {meta?.examples && (
          <details className="offerDesigner-examples">
            <summary>📝 Ver ejemplos</summary>
            <div className="offerDesigner-examples-grid">
              {Object.entries(meta.examples).map(([field, example]) => (
                <div key={field} className="offerDesigner-example-item">
                  <strong>{field}:</strong>
                  <pre>{example}</pre>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    );
  };

  return (
    <div className="offer-designer-screen">
      {/* Power Bar Superior */}
      <div className="offerDesigner-power-bar-container">
        <div className="offerDesigner-power-bar-wrapper">
          <div className="offerDesigner-power-label">{t('offerDesigner.power')}: </div>
          <div className="offerDesigner-power-bar">
            <div 
              className="offerDesigner-power-fill" 
              style={{ width: `${power.total}%`, background: power.total >= 85 ? 'var(--limon)' : power.total >= 60 ? 'var(--genio)' : power.total >= 30 ? 'var(--acero)' : 'var(--muted)' }}
            ></div>
          </div>
          <div className="offerDesigner-power-value">{power.total}%</div>
          <div className={`offerDesigner-power-status ${power.label}`}>{t(`offerDesigner.power.${power.label}`)}</div>
        </div>
      </div>

      {/* Stepper lateral + Contenido principal */}
      <div className="offerDesigner-main-layout">
        {/* Stepper lateral */}
        <aside className="offerDesigner-stepper" aria-label="Niveles de la oferta">
          <nav className="offer-designer-levels-nav">
            {OFFER_LEVELS.map((config, index) => {
              const levelData = offer.levels[config.id];
              const isCompleted = levelData?.completed;
              const isCurrent = config.id === currentLevelId;
              const isUnlocked = unlockedLevels.includes(config.id);
              const meta = LEVEL_RENDER_META[config.id];
              
              return (
                <button
                  key={config.id}
                  className={`offerDesigner-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${!isUnlocked ? 'locked' : ''}`}
                  onClick={() => isUnlocked && actions.setLevel(config.id)}
                  disabled={!isUnlocked}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-disabled={!isUnlocked}
                  title={config.title.es}
                >
                  <span className="offerDesigner-step-number">{index + 1}</span>
                  <Icon name={meta?.icon || 'Circle'} className="offerDesigner-step-icon" size={18} />
                  <span className="offerDesigner-step-title">{config.title.es}</span>
                  {isCompleted && <span className="offerDesigner-step-check">✓</span>}
                  {!isUnlocked && <span className="offerDesigner-step-lock">🔒</span>}
                </button>
              );
            })}
          </nav>
          
          <div className="offerDesigner-progress-summary">
            <div className="offerDesigner-progress-bar">
              <div className="offerDesigner-progress-fill" style={{ width: `${progress.percentage}%` }}></div>
            </div>
            <span className="offerDesigner-progress-text">{progress.completed}/{progress.total} niveles</span>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="offerDesigner-main-content" role="main">
          {renderLevelFields()}
        </main>

        {/* Panel lateral derecho - Power breakdown + Acciones rápidas */}
        <aside className="offerDesigner-sidebar" aria-label="Detalles de poder y acciones">
          <div className="offerDesigner-sidebar-section">
            <h3>📊 Desglose de Poder</h3>
            <div className="offerDesigner-breakdown">
              {Object.entries(power.byLevel).map(([levelId, breakdown]) => (
                <div key={levelId} className={`offerDesigner-breakdown-item ${breakdown.total >= 70 ? 'good' : breakdown.total > 0 ? 'partial' : 'empty'}`}>
                  <span className="offerDesigner-breakdown-label">{OFFER_LEVELS.find(l => l.id === levelId)?.title.es || levelId}</span>
                  <div className="offerDesigner-breakdown-bar">
                    <div className="offerDesigner-breakdown-fill" style={{ width: `${breakdown.total}%` }}></div>
                  </div>
                  <span className="offerDesigner-breakdown-value">{breakdown.total}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="offerDesigner-sidebar-section">
            <h3>⚡ Acciones Rápidas</h3>
            <div className="offerDesigner-quick-actions">
              <Button variant="primary" onClick={() => actions.runEvaluation()} disabled={actions.evaluation.loading}>
                {actions.evaluation.loading ? '🔄 Evaluando...' : '🤖 Evaluar con IA'}
              </Button>
              <Button variant="secondary" onClick={() => actions.openExportModal()}>
                📄 Exportar Carta
              </Button>
              <Button variant="ghost" onClick={() => actions.setMode(offer.offer.mode === 'postmonetario' ? 'conectado' : 'postmonetario')}>
                🔄 Modo: {offer.offer.mode === 'postmonetario' ? 'Postmonetario (ZNU)' : 'Conectado (USD)'}
              </Button>
              <Button variant="ghost" onClick={() => actions.saveToStorage()}>
                💾 Guardar ahora
              </Button>
            </div>
          </div>

          {power.total >= 85 && (
            <div className="offerDesigner-ready-banner">
              <span>🎉</span>
              <strong>¡Oferta lista para lanzar!</strong>
              <p>Tu oferta tiene {power.total}% de poder. Puedes exportar la carta y empezar a vender.</p>
            </div>
          )}
        </aside>
      </div>

      {/* Modales */}
      {ui.showExportModal && (
        <ExportModal 
          salesLetter={salesLetter} 
          onClose={() => actions.closeExportModal()} 
          onCopy={() => actions.copySalesLetter()}
        />
      )}

      {ui.showEvaluatorModal && (
        <EvaluatorModal 
          onClose={() => actions.closeEvaluatorModal()} 
        />
      )}

      {ui.showMigrationModal && (
        <MigrationModal 
          onClose={() => actions.closeMigrationModal()} 
          onMigrate={(userId) => actions.migrateV1ToV2(userId)}
          onDismiss={actions.dismissMigration}
        />
      )}

      {/* Toasts */}
      <div className="offerDesigner-toasts" role="region" aria-live="polite">
        {ui.toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onClose={() => actions.removeToast(toast.id)} />
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// SUB-COMPONENTES
// ============================================================================

const ExportModal: React.FC<{ salesLetter: string; onClose: () => void; onCopy: () => void }> = ({ salesLetter, onClose, onCopy }) => (
  <div className="offerDesigner-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="export-modal-title">
    <div className="offerDesigner-modal" onClick={e => e.stopPropagation()}>
      <header>
        <h2 id="export-modal-title">📄 Exportar Carta de Venta</h2>
        <button className="offerDesigner-modal-close" onClick={onClose} aria-label="Cerrar">×</button>
      </header>
      <div className="offerDesigner-modal-body">
        <div className="offerDesigner-export-options">
          <label>
            <input type="radio" name="export-format" value="markdown" defaultChecked />
            <span>📝 Markdown (recomendado para IA)</span>
          </label>
          <label>
            <input type="radio" name="export-format" value="text" />
            <span>📄 Texto plano</span>
          </label>
          <label>
            <input type="radio" name="export-format" value="json" />
            <span>📦 JSON (para importar)</span>
          </label>
        </div>
        <div className="offerDesigner-export-preview">
          <pre>{salesLetter}</pre>
        </div>
      </div>
      <footer>
        <button className="offerDesigner-btn secondary" onClick={onClose}>Cerrar</button>
        <button className="offerDesigner-btn primary" onClick={onCopy}>📋 Copiar al portapapeles</button>
      </footer>
    </div>
  </div>
);

const EvaluatorModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="offerDesigner-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="evaluator-modal-title">
    <div className="offerDesigner-modal offerDesigner-modal-large" onClick={e => e.stopPropagation()}>
      <header>
        <h2 id="evaluator-modal-title">🤖 Evaluador IA de Ofertas</h2>
        <button className="offerDesigner-modal-close" onClick={onClose} aria-label="Cerrar">×</button>
      </header>
      <div className="offerDesigner-modal-body">
        <p>El evaluador analiza tu carta en 4 dimensiones: Claridad, Deseo, Prueba, Urgencia.</p>
        <Button variant="primary" onClick={() => { /* actions.runEvaluation() */ }}>
          🤖 Evaluar mi oferta ahora
        </Button>
        <div className="offerDesigner-evaluation-dimensions">
          <div className="offerDesigner-dimension">🎯 <strong>Claridad</strong> - ¿Se entiende qué vendes y a quién?</div>
          <div className="offerDesigner-dimension">💖 <strong>Deseo</strong> - ¿Genera deseo visceral?</div>
          <div className="offerDesigner-dimension">📊 <strong>Prueba</strong> - ¿Hay evidencia creíble?</div>
          <div className="offerDesigner-dimension">⚡ <strong>Urgencia</strong> - ¿Hay razón para actuar ya?</div>
        </div>
      </div>
      <footer>
        <button className="offerDesigner-btn secondary" onClick={onClose}>Cerrar</button>
      </footer>
    </div>
  </div>
);

const MigrationModal: React.FC<{ onClose: () => void; onMigrate: (userId: string) => Promise<boolean>; onDismiss: () => void }> = ({ onClose, onMigrate, onDismiss }) => {
  const [userId, setUserId] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleMigrate = async () => {
    if (!userId.trim()) return;
    setLoading(true);
    setError('');
    try {
      const success = await onMigrate(userId.trim());
      if (success) onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error en migración');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="offerDesigner-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="migration-modal-title">
      <div className="offerDesigner-modal" onClick={e => e.stopPropagation()}>
        <header>
          <h2 id="migration-modal-title">🔄 Migración v1 → v2</h2>
          <button className="offerDesigner-modal-close" onClick={onClose} aria-label="Cerrar">×</button>
        </header>
        <div className="offerDesigner-modal-body">
          <p>Se detectó una oferta guardada en la versión 1 (localStorage del navegador).</p>
          <p>Ingresa tu ID de usuario para migrarla a la versión 2 (cuenta HSCSG):</p>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Tu user ID (ej: isaacko0)"
            className="offerDesigner-input"
          />
          {error && <p className="offerDesigner-error">{error}</p>}
          <p className="offerDesigner-hint">¿No quieres migrar ahora? <button onClick={onDismiss}>Descartar migración</button></p>
        </div>
        <footer>
          <button className="offerDesigner-btn secondary" onClick={onClose}>Cancelar</button>
          <button className="offerDesigner-btn primary" onClick={handleMigrate} disabled={loading || !userId.trim()}>
            {loading ? '🔄 Migrando...' : '🔄 Migrar a v2'}
          </button>
        </footer>
      </div>
    </div>
  );
};

const Toast: React.FC<{ toast: any; onClose: (id: string) => void }> = ({ toast, onClose }) => (
  <div className={`offerDesigner-toast ${toast.type}`} role="alert">
    <div className="offerDesigner-toast-content">
      <span className="offerDesigner-toast-title">{toast.title}</span>
      <span className="offerDesigner-toast-message">{toast.message}</span>
    </div>
    <button className="offerDesigner-toast-close" onClick={() => onClose(toast.id)} aria-label="Cerrar">×</button>
  </div>
);

export default OfferDesigner;