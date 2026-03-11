import { useEffect, useRef, useState } from 'react';
import { pathways, reactionMap, metaboliteMap } from '../../data';
import type { MetabolicPathId, OverviewState } from '../../types';
import styles from './OverviewPanel.module.css';

interface OverviewPanelProps {
  state: OverviewState;
  onPathwaySelect: (id: MetabolicPathId) => void;
  onStepChange: (index: number) => void;
  onPlayToggle: () => void;
  teacherMode?: boolean;
}

export function OverviewPanel({
  state,
  onPathwaySelect,
  onStepChange,
  onPlayToggle,
  teacherMode = false,
}: OverviewPanelProps) {
  const intervalRef = useRef<number | null>(null);
  const [showClinical, setShowClinical] = useState(false);

  const selectedPathway = state.selectedPathwayId
    ? pathways.find((p) => p.id === state.selectedPathwayId)
    : null;

  const totalSteps = selectedPathway ? selectedPathway.reactionIds.length : 0;

  // Reset clinical panel on step change
  useEffect(() => { setShowClinical(false); }, [state.currentStepIndex]);

  // Auto-advance
  useEffect(() => {
    if (!state.isPlaying || !selectedPathway) return;
    intervalRef.current = window.setInterval(() => {
      onStepChange(state.currentStepIndex < totalSteps - 1 ? state.currentStepIndex + 1 : 0);
    }, 2400);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.isPlaying, state.currentStepIndex, totalSteps, selectedPathway, onStepChange]);

  const currentReactionId = selectedPathway?.reactionIds[state.currentStepIndex];
  const currentReaction = currentReactionId ? reactionMap.get(currentReactionId) : null;
  const fromMet = currentReaction ? metaboliteMap.get(currentReaction.fromMetaboliteId) : null;
  const toMet = currentReaction ? metaboliteMap.get(currentReaction.toMetaboliteId) : null;

  return (
    <div className={styles.panel} data-teacher={teacherMode ? 'true' : undefined}>
      {/* Pathway selector */}
      <div className={styles.selectorSection}>
        <div className={styles.sectionTitle}>Выберите метаболический путь</div>
        <div className={styles.pathwayList}>
          {pathways.map((p) => (
            <button
              key={p.id}
              className={`${styles.pathwayBtn} ${state.selectedPathwayId === p.id ? styles.pathwayActive : ''}`}
              style={state.selectedPathwayId === p.id ? { borderColor: p.color, color: p.color } : {}}
              onClick={() => onPathwaySelect(p.id as MetabolicPathId)}
            >
              <span className={styles.pathwayDot} style={{ background: p.color }} />
              {p.shortName}
            </button>
          ))}
        </div>
      </div>

      {selectedPathway && (
        <>
          {/* Goal */}
          <div className={styles.goalBox}>
            <div className={styles.goalLabel}>Цель обзора</div>
            <p className={styles.goalText}>{selectedPathway.educationalGoal}</p>
            <div className={styles.locationTag}>
              <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
                <path d="M8 0C5.791 0 4 1.791 4 4c0 3 4 8 4 8s4-5 4-8c0-2.209-1.791-4-4-4zm0 5.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/>
              </svg>
              {selectedPathway.location}
            </div>
          </div>

          {/* Progress */}
          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <span>Шаг {state.currentStepIndex + 1} из {totalSteps}</span>
              <div className={styles.playerControls}>
                <button
                  className={styles.playerBtn}
                  onClick={() => onStepChange(Math.max(0, state.currentStepIndex - 1))}
                  disabled={state.currentStepIndex === 0}
                  aria-label="Предыдущий шаг"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                    <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                  </svg>
                </button>
                <button className={styles.playerBtn} onClick={onPlayToggle} aria-label={state.isPlaying ? 'Пауза' : 'Воспроизвести'}>
                  {state.isPlaying ? (
                    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <button
                  className={styles.playerBtn}
                  onClick={() => onStepChange(Math.min(totalSteps - 1, state.currentStepIndex + 1))}
                  disabled={state.currentStepIndex === totalSteps - 1}
                  aria-label="Следующий шаг"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                    <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798L4.555 5.168z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${((state.currentStepIndex + 1) / totalSteps) * 100}%`,
                  background: selectedPathway.color,
                }}
              />
            </div>
            {/* Step dots */}
            <div className={styles.stepDots}>
              {selectedPathway.reactionIds.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === state.currentStepIndex ? styles.dotActive : i < state.currentStepIndex ? styles.dotDone : ''}`}
                  onClick={() => onStepChange(i)}
                  aria-label={`Перейти к шагу ${i + 1}`}
                  style={i === state.currentStepIndex ? { background: selectedPathway.color, borderColor: selectedPathway.color } : {}}
                />
              ))}
            </div>
          </div>

          {/* Current step card */}
          {currentReaction && (
            <div className={styles.stepCard} key={currentReaction.id}>
              <div className={styles.stepNum}>
                Шаг {state.currentStepIndex + 1} · <span className={styles.reactionTypeBadge}>{currentReaction.reactionType}</span>
              </div>
              <div className={styles.stepFlow}>
                <span className={styles.metabolitePill}>{fromMet?.name ?? '?'}</span>
                <span className={styles.arrow}>→</span>
                <span className={styles.metabolitePill}>{toMet?.name ?? '?'}</span>
              </div>
              <div className={styles.enzymeRow}>
                <span className={styles.enzymeIcon}>⚗</span>
                <strong className={styles.enzymeName}>{currentReaction.enzymeName}</strong>
                {currentReaction.isReversible && <span className={styles.reversibleBadge}>↔ обратима</span>}
              </div>
              <p className={styles.stepDesc}>{currentReaction.description}</p>
              <div className={styles.metaRow}>
                {currentReaction.cofactors && currentReaction.cofactors.length > 0 && (
                  <div className={styles.cofactorRow}>
                    <span className={styles.cofactorLabel}>Кофакторы:</span>
                    {currentReaction.cofactors.map((c) => (
                      <span key={c} className={styles.cofactorTag}>{c}</span>
                    ))}
                  </div>
                )}
                {currentReaction.energyYield && (
                  <div className={styles.energyRow}>
                    <span className={styles.cofactorLabel}>Энергетика:</span>
                    <span className={styles.energyValue}>{currentReaction.energyYield}</span>
                  </div>
                )}
              </div>

              {/* Clinical notes toggle */}
              {currentReaction.clinicalNotes && currentReaction.clinicalNotes.length > 0 && (
                <div className={styles.clinicalSection}>
                  <button
                    className={styles.clinicalToggle}
                    onClick={() => setShowClinical((v) => !v)}
                  >
                    <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
                      <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm.75 10.5h-1.5v-4.5h1.5v4.5zm0-6h-1.5V4h1.5v1.5z"/>
                    </svg>
                    {showClinical ? 'Скрыть клинику' : 'Клиническое значение'}
                  </button>
                  {showClinical && currentReaction.clinicalNotes.map((cn) => (
                    <div key={cn.id} className={styles.clinicalCard}>
                      <div className={styles.clinicalTitle}>{cn.title}</div>
                      {cn.disease && <div className={styles.clinicalDisease}>Нозология: {cn.disease}</div>}
                      <div className={styles.clinicalRow}>
                        <span className={styles.clinicalLabel}>Биохим. последствия</span>
                        <span className={styles.clinicalText}>{cn.biochemicalConsequences}</span>
                      </div>
                      <div className={styles.clinicalRow}>
                        <span className={styles.clinicalLabel}>Клиника</span>
                        <span className={styles.clinicalText}>{cn.clinicalManifestations}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {!selectedPathway && (
        <div className={styles.placeholder}>
          <p>Выберите путь выше, чтобы начать пошаговый обзор с образовательными карточками.</p>
        </div>
      )}
    </div>
  );
}
