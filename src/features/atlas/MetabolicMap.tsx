import React, { useCallback, useEffect, useRef, useState } from 'react';
import { metabolites, reactions, pathways } from '../../data';
import { pathwayColors } from '../../theme/tokens';
import type { MetabolicPathId, SelectionState } from '../../types';
import styles from './MetabolicMap.module.css';

interface MetabolicMapProps {
  selection: SelectionState;
  onSelectMetabolite: (id: string) => void;
  onSelectReaction: (id: string) => void;
  highlightMetaboliteIds?: string[];
  highlightReactionIds?: string[];
  highlightPathId?: MetabolicPathId;
  activePathId?: MetabolicPathId | null;
  teacherMode?: boolean;
  practiceMode?: boolean;
  onReactionClick?: (id: string) => void;
  selectedReactionIds?: string[];
  correctReactionIds?: string[];
  incorrectReactionIds?: string[];
}

// SVG viewBox dimensions
const VW = 1000;
const VH = 960;

// Arrow marker defs
function ArrowDefs() {
  const colors = Object.values(pathwayColors);
  const extraColors = ['#d42020', '#888888', '#22aa55', '#ff6600'];
  const allColors = Array.from(new Set([...colors, ...extraColors]));

  return (
    <defs>
      {allColors.map((c) => {
        const id = `arrow-${c.replace('#', '')}`;
        return (
          <marker key={id} id={id} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill={c} />
          </marker>
        );
      })}
      {/* Highlighted arrows */}
      <marker id="arrow-highlight" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#f59e0b" />
      </marker>
      <marker id="arrow-selected" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#22c55e" />
      </marker>
      <marker id="arrow-incorrect" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#ef4444" />
      </marker>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

export function MetabolicMap({
  selection,
  onSelectMetabolite,
  onSelectReaction,
  highlightMetaboliteIds = [],
  highlightReactionIds = [],
  highlightPathId,
  activePathId,
  teacherMode = false,
  practiceMode = false,
  onReactionClick,
  selectedReactionIds = [],
  correctReactionIds = [],
  incorrectReactionIds = [],
}: MetabolicMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Attach wheel listener as non-passive so preventDefault() actually blocks page scroll
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((z) => Math.max(0.4, Math.min(3, z - e.deltaY * 0.001)));
    };
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
  }, []);

  const handleMouseUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Determine which path(s) to visually focus on
  const focusPathId = highlightPathId ?? activePathId ?? null;

  const getMetaboliteOpacity = (met: typeof metabolites[0]) => {
    if (!focusPathId) return 1;
    return met.pathIds.includes(focusPathId) ? 1 : 0.2;
  };

  const getReactionOpacity = (rxn: typeof reactions[0]) => {
    if (!focusPathId) return 1;
    return rxn.pathId === focusPathId ? 1 : 0.2;
  };

  const getReactionColor = (rxn: typeof reactions[0]) => {
    if (correctReactionIds.includes(rxn.id)) return '#22c55e';
    if (incorrectReactionIds.includes(rxn.id)) return '#ef4444';
    if (selectedReactionIds.includes(rxn.id)) return '#22c55e';
    if (highlightReactionIds.includes(rxn.id)) return '#f59e0b';
    if (rxn.id === selection.reactionId) return '#f59e0b';
    return pathwayColors[rxn.pathId] ?? '#888888';
  };

  const getReactionMarker = (rxn: typeof reactions[0]) => {
    if (correctReactionIds.includes(rxn.id) || selectedReactionIds.includes(rxn.id)) return 'url(#arrow-selected)';
    if (incorrectReactionIds.includes(rxn.id)) return 'url(#arrow-incorrect)';
    if (highlightReactionIds.includes(rxn.id) || rxn.id === selection.reactionId) return 'url(#arrow-highlight)';
    const c = pathwayColors[rxn.pathId] ?? '#888888';
    return `url(#arrow-${c.replace('#', '')})`;
  };

  const metaboliteMap = new Map(metabolites.map((m) => [m.id, m]));

  const nodeR = teacherMode ? 14 : 10;
  const keyNodeR = teacherMode ? 20 : 14;
  const strokeW = teacherMode ? 3 : 2;
  const fontSize = teacherMode ? 13 : 10;
  const labelOffset = teacherMode ? 26 : 20;

  // Format chemical formula with Unicode subscript digits for readability
  const fmtFormula = (f: string) => f.replace(/\d/g, (d) => '₀₁₂₃₄₅₆₇₈₉'[parseInt(d)] ?? d);

  return (
    <div className={styles.wrapper} data-teacher={teacherMode ? 'true' : undefined}>
      {/* Controls */}
      <div className={styles.controls}>
        <button className={styles.ctrl} onClick={() => setZoom((z) => Math.min(3, z + 0.2))} title="Увеличить">
          <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
        </button>
        <button className={styles.ctrl} onClick={() => setZoom((z) => Math.max(0.4, z - 0.2))} title="Уменьшить">
          <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
        </button>
        <button className={styles.ctrl} onClick={resetView} title="Сбросить вид">
          <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>
        </button>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        {pathways.map((p) => (
          <div key={p.id} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: p.color }} />
            <span>{p.shortName}</span>
          </div>
        ))}
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${VW} ${VH}`}
        className={styles.svg}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: dragging.current ? 'grabbing' : 'grab' }}
        aria-label="Карта метаболических путей"
        role="img"
      >
        <ArrowDefs />

        <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`} style={{ transformOrigin: 'center' }}>
          {/* Reaction edges */}
          {reactions.map((rxn) => {
            const from = metaboliteMap.get(rxn.fromMetaboliteId);
            const to = metaboliteMap.get(rxn.toMetaboliteId);
            if (!from || !to) return null;

            const opacity = getReactionOpacity(rxn);
            const color = getReactionColor(rxn);
            const marker = getReactionMarker(rxn);
            const isHighlighted = highlightReactionIds.includes(rxn.id) || rxn.id === selection.reactionId;
            const isSelected = selectedReactionIds.includes(rxn.id);
            const sw = isHighlighted || isSelected ? strokeW + 1.5 : strokeW;

            // Midpoint for label
            const mx = (from.x + to.x) / 2;
            const my = (from.y + to.y) / 2;

            // Offset similar arrows slightly to avoid overlap
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            const nx = -dy / len;
            const ny = dx / len;
            const offsetMag = rxn.isReversible ? 4 : 0;

            const x1 = from.x + nx * offsetMag;
            const y1 = from.y + ny * offsetMag;
            const x2 = to.x + nx * offsetMag;
            const y2 = to.y + ny * offsetMag;

            // Shorten line ends by node radius
            const fromR = from.isKeyNode ? keyNodeR : nodeR;
            const toR = to.isKeyNode ? keyNodeR : nodeR;
            const totalLen = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
            if (totalLen < 1) return null;
            const ux = (x2 - x1) / totalLen;
            const uy = (y2 - y1) / totalLen;
            const sx = x1 + ux * (fromR + 2);
            const sy = y1 + uy * (fromR + 2);
            const ex = x2 - ux * (toR + 8);
            const ey = y2 - uy * (toR + 8);

            const clickable = practiceMode && onReactionClick;

            return (
              <g
                key={rxn.id}
                opacity={opacity}
                onClick={(e) => {
                  e.stopPropagation();
                  if (clickable) onReactionClick!(rxn.id);
                  else onSelectReaction(rxn.id);
                }}
                className={`${styles.reactionGroup} ${clickable ? styles.clickable : ''}`}
                role="button"
                aria-label={`Реакция: ${rxn.enzymeName}`}
                filter={isHighlighted ? 'url(#glow)' : undefined}
              >
                <line
                  x1={sx} y1={sy} x2={ex} y2={ey}
                  stroke={color}
                  strokeWidth={sw}
                  markerEnd={marker}
                  strokeLinecap="round"
                />
                {/* Clickable hit area */}
                <line
                  x1={sx} y1={sy} x2={ex} y2={ey}
                  stroke="transparent"
                  strokeWidth={16}
                />
                {/* Reaction enzyme label with background */}
                {(isHighlighted || isSelected || opacity === 1) && (() => {
                  const label = rxn.enzymeShortName ?? rxn.enzymeName.split(' ')[0];
                  const lx = mx + nx * 16;
                  const ly = my + ny * 16;
                  const charW = (fontSize - 1) * 0.62;
                  const bw = label.length * charW + 10;
                  const bh = (fontSize - 1) + 7;
                  return (
                    <g style={{ pointerEvents: 'none' }}>
                      <rect
                        x={lx - bw / 2}
                        y={ly - bh / 2}
                        width={bw}
                        height={bh}
                        rx={3}
                        fill="var(--bg)"
                        fillOpacity={0.95}
                        stroke="var(--line)"
                        strokeWidth={0.5}
                      />
                      <text
                        x={lx}
                        y={ly}
                        fontSize={fontSize - 1}
                        fill={color}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontWeight={isHighlighted || isSelected ? '600' : '400'}
                        className={styles.reactionLabel}
                      >
                        {label}
                      </text>
                    </g>
                  );
                })()}
              </g>
            );
          })}

          {/* Metabolite nodes */}
          {metabolites.map((met) => {
            const r = met.isKeyNode ? keyNodeR : nodeR;
            const opacity = getMetaboliteOpacity(met);
            const isSelected = selection.metaboliteId === met.id;
            const isHighlighted = highlightMetaboliteIds.includes(met.id);
            const stroke = isSelected
              ? '#f59e0b'
              : isHighlighted
              ? '#f59e0b'
              : met.isKeyNode
              ? (pathwayColors[met.pathIds[0]] ?? '#888')
              : 'var(--line-strong)';
            const strokeWidth = isSelected || isHighlighted ? 3 : met.isKeyNode ? 2.5 : 1.5;
            const fill = isSelected ? 'var(--accent)' : met.isKeyNode ? (pathwayColors[met.pathIds[0]] ?? 'var(--bg-alt)') : 'var(--bg-alt)';
            const textFill = met.isKeyNode ? '#fff' : 'var(--text)';

            return (
              <g
                key={met.id}
                opacity={opacity}
                onClick={(e) => { e.stopPropagation(); onSelectMetabolite(met.id); }}
                className={styles.nodeGroup}
                role="button"
                aria-label={`Метаболит: ${met.name}`}
                filter={isHighlighted || isSelected ? 'url(#glow)' : undefined}
              >
                <circle
                  cx={met.x} cy={met.y} r={r + 6}
                  fill="transparent"
                />
                <circle
                  cx={met.x} cy={met.y} r={r}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  style={{ transition: 'fill 0.2s, stroke 0.2s' }}
                />
                {(() => {
                  const label = met.name.length > 22 ? met.name.slice(0, 20) + '…' : met.name;
                  const ly = met.y + r + labelOffset;
                  const charW = fontSize * 0.6;
                  const bw = label.length * charW + 10;
                  const bh = fontSize + 6;
                  return (
                    <g style={{ pointerEvents: 'none' }}>
                      <rect
                        x={met.x - bw / 2}
                        y={ly - bh / 2 - 1}
                        width={bw}
                        height={bh}
                        rx={3}
                        fill="var(--bg)"
                        fillOpacity={0.96}
                        stroke="var(--line)"
                        strokeWidth={0.5}
                      />
                      <text
                        x={met.x}
                        y={ly}
                        fontSize={fontSize}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={isHighlighted ? '#f59e0b' : isSelected ? 'var(--accent)' : 'var(--text)'}
                        fontWeight={isHighlighted || isSelected ? '700' : '500'}
                        className={styles.nodeLabel}
                      >
                        {label}
                      </text>
                    </g>
                  );
                })()}
                {met.formula && met.formula.length <= 10 && (
                  <text
                    x={met.x}
                    y={met.y}
                    fontSize={Math.max(fontSize - 3, 7)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={textFill}
                    fontWeight="500"
                    style={{ pointerEvents: 'none' }}
                  >
                    {fmtFormula(met.formula)}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
