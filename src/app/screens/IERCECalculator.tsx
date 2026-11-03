// IERCECalculator.tsx — Calculadora RCE inversa (client-side, offline-first)
// Reproduce EXACTAMENTE el prototipo Excel WhatMatters: $288,008 → 1 RCE = $1,000.03 en L5

import React, { useMemo, useState } from 'react';
import { ieRCETable, ieFormatUSDC, ieFormatBigInt, iePhysicalPersons, iePositionsTotal, ieCoefficient } from '@core/lib/ie-rce-math';
import { IE_MAX_LEVEL, IE_RCE_PRESETS, IE_WEIGHT_LABEL, IE_WEIGHT_RCE_RATIO } from '@core/lib/ie-constants';
import { Button } from '@core/ui/Button';
import { Card } from '@core/ui/Card';
import { Badge } from '@core/ui/Badge';
import { Icon } from '@core/ui/Icon';
import { t } from '@core/lib/i18n';

export const IERCECalculator: React.FC = () => {
  const [fundUsd, setFundUsd] = useState<number>(288008);
  const [maxLevel, setMaxLevel] = useState<number>(10);
  const [showFullTable, setShowFullTable] = useState(false);

  const rows = useMemo(() => {
    const fund = BigInt(Math.round(fundUsd * 1_000_000));
    return ieRCETable(fund, maxLevel);
  }, [fundUsd, maxLevel]);

  const totalParticipants = useMemo(() => {
    return rows[rows.length - 1]?.persons || 0n;
  }, [rows]);

  const totalPositions = useMemo(() => {
    return rows[rows.length - 1]?.positions || 0n;
  }, [rows]);

  return (
    <div className="ie-calculator">
      <div className="ie-calculator-header">
        <div>
          <h2>
            <Icon name="Calculator" size={24} style={{ color: 'var(--accent-emerald)' }} />
            {t('title.ieCalculator')}
          </h2>
          <p className="ie-calculator-description">
            {t('ie.calculatorDescription')}
          </p>
        </div>
      </div>

      {/* Controles */}
      <Card className="ie-calculator-controls">
        <div className="ie-control-row">
          <div className="ie-control-group">
            <label className="ie-control-label">{t('ie.totalFund')}</label>
            <div className="ie-input-with-presets">
              <input
                type="number"
                value={fundUsd}
                min={1}
                onChange={e => setFundUsd(Math.max(1, Number(e.target.value) || 1))}
                className="ie-fund-input"
              />
              <span className="ie-currency-suffix">USD</span>
            </div>
            <div className="ie-presets">
              {IE_RCE_PRESETS.map(preset => (
                <Button
                  key={preset.value}
                  variant={fundUsd === preset.value ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setFundUsd(preset.value)}
                >
                  ${ieFormatBigInt(BigInt(preset.value))}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="ie-control-group">
            <label className="ie-control-label">
              {t('ie.levelsToShow')}: {maxLevel}
            </label>
            <input
              type="range"
              min={1}
              max={IE_MAX_LEVEL}
              value={maxLevel}
              onChange={e => setMaxLevel(Number(e.target.value))}
              className="ie-level-slider"
            />
            <div className="ie-level-markers">
              {[1, 5, 10, 15, 20, IE_MAX_LEVEL].map(l => (
                <span key={l} style={{ left: `${(l - 1) / (IE_MAX_LEVEL - 1) * 100}%` }}>
                  {l}{l === 5 && '★'}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Resumen Rápido */}
      <div className="ie-quick-summary">
        <QuickStat
          label={t('ie.oneRCEAtL5')}
          value={rows.find(r => r.level === 5) ? ieFormatUSDC(rows.find(r => r.level === 5)!.full) : '—'}
          color="var(--accent-emerald)"
        />
        <QuickStat
          label={t('ie.totalParticipantsAtMax')}
          value={ieFormatBigInt(totalParticipants)}
          color="var(--accent-cyan)"
        />
        <QuickStat
          label={t('ie.totalPositionsAtMax')}
          value={ieFormatBigInt(totalPositions)}
          color="var(--amber)"
        />
        <QuickStat
          label={t('ie.coefficientL5')}
          value={ieFormatBigInt(ieCoefficient(5))}
          color="var(--violet)"
        />
      </div>

      {/* Tabla RCE */}
      <Card className="ie-calculator-table">
        <div className="ie-table-header">
          <h3>{t('ie.rceTable')}</h3>
          <Button variant="ghost" size="sm" onClick={() => setShowFullTable(!showFullTable)}>
            {showFullTable ? t('ie.showLess') : t('ie.showAll')} ({IE_MAX_LEVEL} {t('ie.levels')})
          </Button>
        </div>
        
        <div className="ie-table-wrapper">
          <table className="ie-rce-table">
            <thead>
              <tr>
                <th>{t('ie.level')}</th>
                <th>{t('ie.personsBase')}</th>
                <th>{t('ie.positionsTotal')}</th>
                <th>{t('ie.coefficient')}</th>
                <th className="ie-weight-col">
                  <span className="ie-weight-badge ie-weight-full">
                    <span className="ie-weight-dot" style={{ background: 'var(--full)' }}></span>
                    {IE_WEIGHT_RCE_RATIO.full}
                  </span>
                </th>
                <th className="ie-weight-col">
                  <span className="ie-weight-badge ie-weight-low">
                    <span className="ie-weight-dot" style={{ background: 'var(--low)' }}></span>
                    {IE_WEIGHT_RCE_RATIO.low}
                  </span>
                </th>
                <th className="ie-weight-col">
                  <span className="ie-weight-badge ie-weight-mid">
                    <span className="ie-weight-dot" style={{ background: 'var(--mid)' }}></span>
                    {IE_WEIGHT_RCE_RATIO.mid}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.level} className={row.level === 5 ? 'ie-highlight' : ''}>
                  <td className="ie-level-cell">
                    <span className={row.level === 5 ? 'ie-level-badge' : ''}>{row.level}</span>
                  </td>
                  <td>{ieFormatBigInt(row.persons)}</td>
                  <td>{ieFormatBigInt(row.positions)}</td>
                  <td>{ieFormatBigInt(row.coefficient)}</td>
                  <td className="ie-rce-cell">
                    <span className="ie-rce-value ie-rce-full">${ieFormatUSDC(row.full)}</span>
                  </td>
                  <td className="ie-rce-cell">
                    <span className="ie-rce-value ie-rce-low">${ieFormatUSDC(row.low)}</span>
                  </td>
                  <td className="ie-rce-cell">
                    <span className="ie-rce-value ie-rce-mid">${ieFormatUSDC(row.mid)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ie-table-legend">
          <p><strong>{t('ie.calibrationNote')}</strong></p>
          <p>{t('ie.calibrationDetail')}</p>
          <div className="ie-weight-legend">
            <span className="ie-legend-item">
              <span className="ie-weight-dot" style={{ background: 'var(--full)' }}></span>
              {IE_WEIGHT_LABEL.full} = 1 RCE
            </span>
            <span className="ie-legend-item">
              <span className="ie-weight-dot" style={{ background: 'var(--low)' }}></span>
              {IE_WEIGHT_LABEL.low} = 2/3 RCE
            </span>
            <span className="ie-legend-item">
              <span className="ie-weight-dot" style={{ background: 'var(--mid)' }}></span>
              {IE_WEIGHT_LABEL.mid} = 1/3 RCE
            </span>
          </div>
        </div>
      </Card>

      {/* Escala Exponencial */}
      <Card className="ie-scale-info">
        <h3>{t('ie.exponentialScale')}</h3>
        <div className="ie-scale-stats">
          <ScaleStat level={5} label={t('ie.neighborhood')} persons={iePhysicalPersons(5)} />
          <ScaleStat level={10} label={t('ie.city')} persons={iePhysicalPersons(10)} />
          <ScaleStat level={15} label={t('ie.country')} persons={iePhysicalPersons(15)} />
          <ScaleStat level={20} label={t('ie.planetary')} persons={iePhysicalPersons(20)} />
        </div>
        <p className="ie-scale-note">{t('ie.scaleNote')}</p>
      </Card>
    </div>
  );
};

// ============================================================================
// SUB-COMPONENTES
// ============================================================================

const QuickStat: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="ie-quick-stat">
    <div className="ie-quick-value" style={{ color }}>{value}</div>
    <div className="ie-quick-label">{label}</div>
  </div>
);

const ScaleStat: React.FC<{ level: number; label: string; persons: bigint }> = ({ level, label, persons }) => (
  <div className="ie-scale-stat">
    <div className="ie-scale-level">L{level}</div>
    <div className="ie-scale-label">{label}</div>
    <div className="ie-scale-persons">{ieFormatBigInt(persons)}</div>
  </div>
);

// Re-export formatting
import { ieFormatBigInt } from '@core/lib/ie-rce-math';

export default IERCECalculator;