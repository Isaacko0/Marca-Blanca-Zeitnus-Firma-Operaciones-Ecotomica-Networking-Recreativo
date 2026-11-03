// IESimulation.tsx — Simulador de crecimiento IE + proyección RCE
// 3^n exponencial, factor de reclutamiento realista, tabla + gráficos

import React, { useMemo, useState } from 'react';
import { ieSimulateGrowth, ieProjectRCE, IEGrowthStep, IERCEProjectionRow } from '@core/lib/ie-protocol';
import { ieFormatUSDC, ieFormatBigInt } from '@core/lib/ie-rce-math';
import { IE_MAX_LEVEL, IE_RCE_PRESETS } from '@core/lib/ie-constants';
import { Card } from '@core/ui/Card';
import { Button } from '@core/ui/Button';
import { Progress } from '@core/ui/Progress';
import { Icon } from '@core/ui/Icon';
import { t } from '@core/lib/i18n';

export const IESimulation: React.FC = () => {
  const [initialSeeds, setInitialSeeds] = useState(1);
  const [maxLevel, setMaxLevel] = useState(10);
  const [fundUsd, setFundUsd] = useState(288008);
  const [recruitmentFactor, setRecruitmentFactor] = useState(2.0);
  const [showChart, setShowChart] = useState(false);

  const growth = useMemo(() => ieSimulateGrowth(initialSeeds, maxLevel), [initialSeeds, maxLevel]);
  const rceProjection = useMemo(() => ieProjectRCE(BigInt(Math.round(fundUsd * 1_000_000)), maxLevel), [fundUsd, maxLevel]);

  // Ajustar por factor de reclutamiento realista
  const adjustedGrowth = useMemo(() => {
    if (recruitmentFactor >= 2.9) return growth; // teórico
    return growth.map((step, i) => {
      if (i === 0) return step;
      const theoreticalNew = step.newPositions;
      const actualNew = BigInt(Math.floor(Number(theoreticalNew) * (recruitmentFactor / 3)));
      const prevCumulative = i > 0 ? adjustedGrowth[i - 1].cumulative : step.cumulative;
      const newCumulative = prevCumulative + actualNew;
      const newCoordinators = i > 0 ? adjustedGrowth[i - 1].coordinators + actualNew / 3n : 0n;
      return { ...step, newPositions: actualNew, cumulative: newCumulative, coordinators: newCoordinators };
    });
  }, [growth, recruitmentFactor]);

  const finalCumulative = adjustedGrowth[adjustedGrowth.length - 1]?.cumulative || 0n;
  const finalCoordinators = adjustedGrowth[adjustedGrowth.length - 1]?.coordinators || 0n;

  return (
    <div className="ie-simulation">
      <header className="ie-sim-header">
        <div>
          <h2>
            <Icon name="TrendingUp" size={28} style={{ color: 'var(--accent-cyan)' }} />
            {t('title.ieSimulation')}
          </h2>
          <p className="ie-sim-subtitle">{t('ie.simulationSubtitle')}</p>
        </div>
      </header>

      {/* Controles */}
      <Card className="ie-sim-controls">
        <div className="ie-sim-control-row">
          <div className="ie-control-group">
            <label>{t('ie.initialSeeds')}</label>
            <div className="ie-seed-buttons">
              {[1, 2, 3].map(s => (
                <Button
                  key={s}
                  variant={initialSeeds === s ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setInitialSeeds(s)}
                >
                  {s} {t('ie.seed')}
                </Button>
              ))}
            </div>
          </div>

          <div className="ie-control-group">
            <label>{t('ie.maxLevel')}: {maxLevel}</label>
            <input
              type="range"
              min={1}
              max={IE_MAX_LEVEL}
              value={maxLevel}
              onChange={e => setMaxLevel(Number(e.target.value))}
            />
            <div className="ie-level-markers">
              {[1, 5, 10, 15, 20, IE_MAX_LEVEL].map(l => (
                <span key={l} style={{ left: `${(l - 1) / (IE_MAX_LEVEL - 1) * 100}%` }}>
                  L{l}{l === 5 && '★'}
                </span>
              ))}
            </div>
          </div>

          <div className="ie-control-group">
            <label>{t('ie.estimatedFund')}</label>
            <div className="ie-fund-input-row">
              <input
                type="number"
                value={fundUsd}
                min={1}
                onChange={e => setFundUsd(Math.max(1, Number(e.target.value) || 1))}
              />
              <span>USD</span>
            </div>
            <div className="ie-presets">
              {IE_RCE_PRESETS.map(p => (
                <Button key={p.value} variant={fundUsd === p.value ? 'primary' : 'secondary'} size="sm" onClick={() => setFundUsd(p.value)}>
                  ${ieFormatBigInt(BigInt(p.value))}
                </Button>
              ))}
            </div>
          </div>

          <div className="ie-control-group">
            <label>
              {t('ie.recruitmentFactor')}: {recruitmentFactor.toFixed(1)}x
              <span className="ie-factor-hint">({t('ie.theoretical')} = 3x)</span>
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={recruitmentFactor}
              onChange={e => setRecruitmentFactor(Number(e.target.value))}
            />
            <div className="ie-factor-markers">
              <span>1.0x</span>
              <span>2.0x</span>
              <span>3.0x {t('ie.theoretical')}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Resumen KPIs */}
      <div className="ie-sim-kpis">
        <SimKPI label={t('ie.finalParticipants')} value={ieFormatBigInt(finalCumulative)} icon="Users" color="var(--accent-cyan)" />
        <SimKPI label={t('ie.finalCoordinators')} value={ieFormatBigInt(finalCoordinators)} icon="Target" color="var(--amber)" />
        <SimKPI label={t('ie.oneRCEAtL5')} value={rceProjection.find(r => r.level === 5) ? ieFormatUSDC(rceProjection.find(r => r.level === 5)!.full) : '—'} icon="Coins" color="var(--genio)" />
        <SimKPI label={t('ie.recruitmentFactor')} value={`${recruitmentFactor.toFixed(1)}x`} icon="TrendingUp" color="var(--violet)" />
      </div>

      {/* Tabla Crecimiento */}
      <Card className="ie-sim-table-card">
        <div className="ie-card-header-row">
          <h3>{t('ie.growthTable')}</h3>
          <Button variant="ghost" size="sm" onClick={() => setShowChart(!showChart)}>
            <Icon name={showChart ? 'Table' : 'BarChart'} size={16} />
            {showChart ? t('ie.showTable') : t('ie.showChart')}
          </Button>
        </div>

        {!showChart ? (
          <div className="ie-table-wrapper">
            <table className="ie-sim-table">
              <thead>
                <tr>
                  <th>{t('ie.level')}</th>
                  <th>{t('ie.newPositions')}</th>
                  <th>{t('ie.cumulative')}</th>
                  <th>{t('ie.coordinators')}</th>
                  <th>{t('ie.growthRate')}</th>
                </tr>
              </thead>
              <tbody>
                {adjustedGrowth.map((step, i) => (
                  <tr key={step.level} className={step.level === 5 ? 'ie-highlight' : ''}>
                    <td className="ie-level-cell">
                      <span className={step.level === 5 ? 'ie-level-badge' : ''}>L{step.level}</span>
                    </td>
                    <td>{ieFormatBigInt(step.newPositions)}</td>
                    <td>{ieFormatBigInt(step.cumulative)}</td>
                    <td>{ieFormatBigInt(step.coordinators)}</td>
                    <td>
                      {i > 0 && (
                        <span className="ie-growth-rate">
                          {((Number(step.newPositions) / Number(adjustedGrowth[i - 1].newPositions)) * 100).toFixed(0)}%
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="ie-chart-container">
            <GrowthChart data={adjustedGrowth} />
          </div>
        )}
      </Card>

      {/* Proyección RCE */}
      <Card className="ie-sim-rce-card">
        <h3>{t('ie.rceProjection')}</h3>
        <div className="ie-table-wrapper">
          <table className="ie-rce-projection-table">
            <thead>
              <tr>
                <th>{t('ie.level')}</th>
                <th>{t('ie.oneRCE')}</th>
                <th className="ie-weight-col">
                  <span className="ie-weight-badge ie-weight-full">
                    <span className="ie-weight-dot" style={{ background: 'var(--full)' }}></span>
                    1 RCE
                  </span>
                </th>
                <th className="ie-weight-col">
                  <span className="ie-weight-badge ie-weight-low">
                    <span className="ie-weight-dot" style={{ background: 'var(--low)' }}></span>
                    2/3 RCE
                  </span>
                </th>
                <th className="ie-weight-col">
                  <span className="ie-weight-badge ie-weight-mid">
                    <span className="ie-weight-dot" style={{ background: 'var(--mid)' }}></span>
                    1/3 RCE
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rceProjection.map(row => (
                <tr key={row.level} className={row.level === 5 ? 'ie-highlight' : ''}>
                  <td className="ie-level-cell">
                    <span className={row.level === 5 ? 'ie-level-badge' : ''}>L{row.level}</span>
                  </td>
                  <td>${ieFormatUSDC(row.oneRCE)}</td>
                  <td className="ie-rce-cell"><span className="ie-rce-full">${ieFormatUSDC(row.fullRCE)}</span></td>
                  <td className="ie-rce-cell"><span className="ie-rce-low">${ieFormatUSDC(row.lowRCE)}</span></td>
                  <td className="ie-rce-cell"><span className="ie-rce-mid">${ieFormatUSDC(row.midRCE)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="ie-rce-legend">
          <span className="ie-legend-item"><span className="ie-weight-dot" style={{ background: 'var(--full)' }}></span> 1 RCE</span>
          <span className="ie-legend-item"><span className="ie-weight-dot" style={{ background: 'var(--low)' }}></span> 2/3 RCE</span>
          <span className="ie-legend-item"><span className="ie-weight-dot" style={{ background: 'var(--mid)' }}></span> 1/3 RCE</span>
        </div>
      </Card>

      {/* Escala Exponencial */}
      <Card className="ie-scale-card">
        <h3>{t('ie.exponentialScaleTitle')}</h3>
        <div className="ie-scale-grid">
          <ScaleCard level={5} label={t('ie.neighborhood')} persons={adjustedGrowth.find(s => s.level === 5)?.cumulative || 0n} />
          <ScaleCard level={10} label={t('ie.city')} persons={adjustedGrowth.find(s => s.level === 10)?.cumulative || 0n} />
          <ScaleCard level={15} label={t('ie.country')} persons={adjustedGrowth.find(s => s.level === 15)?.cumulative || 0n} />
          <ScaleCard level={20} label={t('ie.planetary')} persons={adjustedGrowth.find(s => s.level === 20)?.cumulative || 0n} />
        </div>
        <p className="ie-scale-note">{t('ie.scaleNote')}</p>
      </Card>
    </div>
  );
};

// ============================================================================
// SUB-COMPONENTES
// ============================================================================

const SimKPI: React.FC<{ label: string; value: string; icon: string; color: string }> = ({ label, value, icon, color }) => (
  <div className="ie-sim-kpi">
    <div className="ie-sim-kpi-icon" style={{ background: color }}><Icon name={icon} size={20} /></div>
    <div className="ie-sim-kpi-value" style={{ color }}>{value}</div>
    <div className="ie-sim-kpi-label">{label}</div>
  </div>
);

const ScaleCard: React.FC<{ level: number; label: string; persons: bigint }> = ({ level, label, persons }) => (
  <div className="ie-scale-card-item">
    <div className="ie-scale-level">L{level}</div>
    <div className="ie-scale-label">{label}</div>
    <div className="ie-scale-persons">{ieFormatBigInt(persons)}</div>
  </div>
);

const GrowthChart: React.FC<{ data: IEGrowthStep[] }> = ({ data }) => {
  const maxCumulative = Math.max(...data.map(d => Number(d.cumulative)));
  const height = 300;
  const width = data.length * 80;
  
  return (
    <svg width={width + 40} height={height + 40} viewBox={`0 0 ${width + 40} ${height + 40}`} className="ie-growth-chart">
      {/* Ejes */}
      <line x1={40} y1={20} x2={40} y2={height + 20} stroke="var(--border)" />
      <line x1={40} y1={height + 20} x2={width + 40} y2={height + 20} stroke="var(--border)" />
      
      {/* Área acumulada */}
      <path
        d={data.map((d, i) => {
          const x = 40 + i * 80;
          const y = height + 20 - (Number(d.cumulative) / maxCumulative) * height;
          return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ')} L${width + 40} ${height + 20} L40 ${height + 20} Z
        fill="var(--accent-cyan)"
        fillOpacity={0.15}
      />
      
      {/* Línea acumulada */}
      <path
        d={data.map((d, i) => {
          const x = 40 + i * 80;
          const y = height + 20 - (Number(d.cumulative) / maxCumulative) * height;
          return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ')}
        stroke="var(--accent-cyan)"
        strokeWidth={2}
        fill="none"
      />
      
      {/* Puntos */}
      {data.map((d, i) => (
        <circle
          key={d.level}
          cx={40 + i * 80}
          cy={height + 20 - (Number(d.cumulative) / maxCumulative) * height}
          r={4}
          fill="var(--accent-cyan)"
        />
      ))}
      
      {/* Etiquetas X */}
      {data.map((d, i) => (
        <text key={d.level} x={40 + i * 80} y={height + 35} textAnchor="middle" fontSize={11} fill="var(--muted)">
          L{d.level}
        </text>
      ))}
    </svg>
  );
};

export default IESimulation;