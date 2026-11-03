// IETreeView.tsx — Visualizador árbol triádico SVG (adaptado de TreeView.tsx WhatMatters)
// Layout Reingold-Tilford, modo compacto, colores por peso, GIVE arcs, payout pulse

import React, { useMemo } from 'react';
import { IEPosition } from '@core/lib/ie-types';
import { ieFormatUSDC } from '@core/lib/ie-rce-math';

interface IETreeViewProps {
  positions: IEPosition[];
  selectedId?: string | null;
  onSelect?: (position: IEPosition) => void;
  pulse?: number;                    // trigger animación payout
  giveFlows?: Array<{ from: string; toPositionId: string; amount: bigint }>;
  showLabels?: boolean;
  compact?: boolean;
}

function weightColor(weightNum: bigint): string {
  if (weightNum === 3n) return 'var(--full)';
  if (weightNum === 2n) return 'var(--low)';
  return 'var(--mid)';
}

interface LaidNode {
  node: IEPosition;
  x: number;
  y: number;
}

interface TreeEdge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  key: string;
}

interface GiveArc {
  key: string;
  d: string;
  width: number;
  amount: bigint;
  toX: number;
  toY: number;
}

export const IETreeView: React.FC<IETreeViewProps> = ({
  positions,
  selectedId,
  onSelect,
  pulse = 0,
  giveFlows = [],
  showLabels = true,
  compact = false,
}) => {
  const { laid, edges, width, height, isCompact } = useMemo(() => {
    const n = positions.length;
    const compactMode = compact || n > 30;
    const DX = compactMode ? (n > 120 ? 7 : 16) : 74;
    const DY = compactMode ? 52 : 96;
    const MARGIN = compactMode ? 24 : 44;

    // Build children map
    const children = new Map<string, string[]>();
    positions.forEach(p => children.set(p.id, []));
    positions.forEach(p => {
      if (p.parentId !== '0' && children.has(p.parentId)) {
        children.get(p.parentId)!.push(p.id);
      }
    });

    // Roots (seeds)
    const roots = positions
      .filter(p => p.parentId === '0')
      .sort((a, b) => Number(a.id.localeCompare(b.id)))
      .map(p => p.id);

    // Reingold-Tilford x assignment
    const xOf = new Map<string, number>();
    let slot = 0;
    
    const assign = (id: string): void => {
      const ch = children.get(id) ?? [];
      if (ch.length === 0) {
        xOf.set(id, slot++);
        return;
      }
      ch.forEach(assign);
      const first = xOf.get(ch[0])!;
      const last = xOf.get(ch[ch.length - 1])!;
      xOf.set(id, (first + last) / 2);
    };
    
    roots.forEach(assign);

    let maxSlot = 0;
    let maxDepth = 1;
    const laid: LaidNode[] = positions.map(p => {
      const s = xOf.get(p.id) ?? 0;
      maxSlot = Math.max(maxSlot, s);
      maxDepth = Math.max(maxDepth, p.depth);
      return { node: p, x: MARGIN + s * DX, y: MARGIN + (p.depth - 1) * DY };
    });

    const posMap = new Map(laid.map(l => [l.node.id, l]));
    
    const treeEdges: TreeEdge[] = positions
      .filter(p => p.parentId !== '0' && posMap.has(p.parentId))
      .map(p => {
        const a = posMap.get(p.parentId)!;
        const b = posMap.get(p.id)!;
        return { x1: a.x, y1: a.y, x2: b.x, y2: b.y, key: p.id };
      });

    return { laid, edges: treeEdges, width: MARGIN * 2 + maxSlot * DX, height: MARGIN * 2 + (maxDepth - 1) * DY, isCompact: compactMode };
  }, [positions, compact]);

  // GIVE arcs (curved paths between giver and receiver)
  const giveArcs = useMemo((): GiveArc[] => {
    if (isCompact || giveFlows.length === 0) return [];
    
    const byId = new Map(laid.map(l => [l.node.id, l]));
    const byHolder = new Map<string, LaidNode>();
    laid.forEach(l => {
      const k = l.node.holder.toLowerCase();
      if (!byHolder.has(k)) byHolder.set(k, l);
    });
    
    const arcs: GiveArc[] = [];
    for (const f of giveFlows) {
      const from = byHolder.get(f.from.toLowerCase());
      const to = byId.get(f.toPositionId);
      if (!from || !to || from.node.id === to.node.id) continue;
      
      const mx = (from.x + to.x) / 2;
      const my = (from.y + to.y) / 2;
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const len = Math.max(Math.hypot(dx, dy), 1);
      const bow = Math.min(46, 18 + len * 0.18);
      const cx = mx - (dy / len) * bow;
      const cy = my + (dx / len) * bow;
      
      arcs.push({
        key: `${f.from}-${f.toPositionId}`,
        d: `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`,
        width: 1.4 + Math.min(Number(f.amount) / 25, 3),
        amount: f.amount,
        toX: to.x,
        toY: to.y,
      });
    }
    return arcs;
  }, [laid, giveFlows, isCompact]);

  if (positions.length === 0) {
    return (
      <div className="ie-tree-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ opacity: 0.3 }}>
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <p>{t('ie.treeEmpty')}</p>
      </div>
    );
  }

  return (
    <div className="ie-tree-container">
      <div className="ie-tree-svg-wrapper" style={{ padding: 8 }}>
        <svg 
          className="ie-tree-svg" 
          width={width} 
          height={height} 
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Edges (tree lines) */}
          {edges.map(e => (
            <line
              key={e.key}
              x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
              stroke="var(--border)"
              strokeWidth={isCompact ? 0.5 : 1.5}
              strokeLinecap="round"
            />
          ))}

          {/* GIVE arcs */}
          {giveArcs.map(a => (
            <g key={a.key}>
              <path
                className="ie-give-arc"
                d={a.d}
                fill="none"
                stroke="#e879f9"
                strokeWidth={a.width}
                strokeLinecap="round"
                strokeDasharray="8 4"
                style={{ animation: 'ie-give-flow 2s linear infinite' }}
              />
              <circle
                className="ie-give-arc-tip"
                cx={a.toX} cy={a.toY} r={4}
                fill="#e879f9"
              />
            </g>
          ))}

          {/* Nodes */}
          {laid.map(l => {
            const w = l.node.weightClass === 'full' ? 3n : l.node.weightClass === 'low' ? 2n : 1n;
            const bonus = Number(l.node.effectiveWeight - w);
            const baseR = w === 3n ? 17 : w === 2n ? 14 : 12;
            const r = isCompact ? (positions.length > 120 ? 3 : 5) : baseR + Math.min(bonus, 6) * 2;
            const selected = selectedId === l.node.id;
            
            return (
              <g
                key={l.node.id}
                className="ie-tree-node"
                onClick={() => onSelect?.(l.node)}
                style={{ cursor: onSelect ? 'pointer' : 'default' }}
              >
                {/* Coordinador ring */}
                {l.node.isCoordinator && !isCompact && (
                  <circle
                    cx={l.x} cy={l.y} r={r + 4}
                    fill="none" stroke="#fcd34d" strokeWidth={2}
                  />
                )}
                
                {/* Main node circle */}
                <circle
                  cx={l.x} cy={l.y} r={r}
                  fill={weightColor(w)}
                  opacity={selected ? 1 : 0.85}
                  stroke={selected ? '#fff' : '#06121f'}
                  strokeWidth={selected ? 2.5 : isCompact ? 0.4 : 1}
                  className={pulse > 0 ? 'ie-payout-pulse' : undefined}
                  style={{ 
                    animationDelay: `${(l.node.depth - 1) * 120}ms`,
                    filter: selected ? 'drop-shadow(0 0 8px var(--accent))' : 'none'
                  }}
                />
                
                {/* Label */}
                {showLabels && !isCompact && (
                  <text
                    x={l.x} y={l.y + 3}
                    textAnchor="middle"
                    fill="#06121f"
                    fontWeight={700}
                    fontSize={11}
                  >
                    {l.node.id.slice(0, 8)}
                  </text>
                )}
                
                {/* Payout pulse text */}
                {pulse > 0 && !isCompact && (
                  <text
                    className="ie-payout-fly"
                    x={l.x} y={l.y - r - 6}
                    textAnchor="middle"
                    fill={weightColor(w)}
                    fontSize={12}
                    fontWeight={600}
                  >
                    +RCE
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="ie-tree-legend">
        <span className="ie-legend-item">
          <span className="ie-legend-dot" style={{ background: 'var(--full)' }}></span>
          {t('ie.weightClass.full')} (1 RCE)
        </span>
        <span className="ie-legend-item">
          <span className="ie-legend-dot" style={{ background: 'var(--low)' }}></span>
          {t('ie.weightClass.low')} (2/3 RCE)
        </span>
        <span className="ie-legend-item">
          <span className="ie-legend-dot" style={{ background: 'var(--mid)' }}></span>
          {t('ie.weightClass.mid')} (1/3 RCE)
        </span>
        {!isCompact && (
          <span className="ie-legend-item">
            <span className="ie-legend-dot" style={{ background: '#fcd34d' }}></span>
            {t('ie.coordinator')}
          </span>
        )}
        {giveArcs.length > 0 && (
          <span className="ie-legend-item">
            <span className="ie-legend-dot" style={{ background: '#e879f9' }}></span>
            {t('ie.giveFromPeers')}
          </span>
        )}
      </div>
    </div>
  );
};

// Import t for empty state
import { t } from '@core/lib/i18n';

export default IETreeView;