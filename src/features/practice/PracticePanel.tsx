import { useState } from 'react';
import { practiceCases } from '../../data';
import type { PracticeState } from '../../types';
import styles from './PracticePanel.module.css';

interface PracticePanelProps {
  state: PracticeState;
  onCaseSelect: (id: string) => void;
  onToggleReaction: (id: string) => void;
  onToggleMetabolite: (id: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  teacherMode?: boolean;
}

const difficultyLabel = {
  easy: 'Лёгкий',
  medium: 'Средний',
  hard: 'Сложный',
};

const difficultyColor = {
  easy: '#22c55e',
  medium: '#f59e0b',
  hard: '#ef4444',
};

export function PracticePanel({
  state,
  onCaseSelect,
  onToggleReaction: _onToggleReaction,
  onToggleMetabolite: _onToggleMetabolite,
  onSubmit,
  onReset,
  teacherMode = false,
}: PracticePanelProps) {
  const [showHint, setShowHint] = useState(false);

  const currentCase = state.currentCaseId
    ? practiceCases.find((c) => c.id === state.currentCaseId)
    : null;

  const score = state.score;

  return (
    <div className={styles.panel} data-teacher={teacherMode ? 'true' : undefined}>
      {/* Case list */}
      {!currentCase && (
        <div className={styles.caseList}>
          <div className={styles.sectionTitle}>Практические задания</div>
          {practiceCases.map((c) => (
            <button
              key={c.id}
              className={styles.caseCard}
              onClick={() => onCaseSelect(c.id)}
            >
              <div className={styles.caseHeader}>
                <span className={styles.caseTitle}>{c.title}</span>
                <span
                  className={styles.difficulty}
                  style={{ color: difficultyColor[c.difficulty] }}
                >
                  {difficultyLabel[c.difficulty]}
                </span>
              </div>
              <p className={styles.caseDesc}>{c.description}</p>
              <div className={styles.typeTag}>{typeLabel(c.type)}</div>
            </button>
          ))}
        </div>
      )}

      {/* Active case */}
      {currentCase && (
        <div className={styles.activeCase}>
          <div className={styles.caseBreadcrumb}>
            <button className={styles.backBtn} onClick={onReset}>
              ← Все задания
            </button>
            <span
              className={styles.difficulty}
              style={{ color: difficultyColor[currentCase.difficulty] }}
            >
              {difficultyLabel[currentCase.difficulty]}
            </span>
          </div>

          <h3 className={styles.activeTitle}>{currentCase.title}</h3>
          <p className={styles.activeDesc}>{currentCase.description}</p>

          {/* Instruction by type */}
          <div className={styles.instructionBox}>
            {!state.submitted ? (
              <p className={styles.instruction}>{getInstruction(currentCase.type)}</p>
            ) : null}
          </div>

          {/* Hint */}
          {currentCase.hint && !state.submitted && (
            <div className={styles.hintSection}>
              <button className={styles.hintToggle} onClick={() => setShowHint((h) => !h)}>
                {showHint ? 'Скрыть подсказку' : 'Показать подсказку'}
              </button>
              {showHint && (
                <div className={styles.hintText}>💡 {currentCase.hint}</div>
              )}
            </div>
          )}

          {/* Selected items display */}
          {!state.submitted && (state.selectedReactionIds.length > 0 || state.selectedMetaboliteIds.length > 0) && (
            <div className={styles.selectedItems}>
              <div className={styles.sectionLabel}>Выбрано:</div>
              <div className={styles.selectedCount}>
                {state.selectedReactionIds.length > 0 && (
                  <span>{state.selectedReactionIds.length} реакций</span>
                )}
                {state.selectedMetaboliteIds.length > 0 && (
                  <span>{state.selectedMetaboliteIds.length} метаболитов</span>
                )}
              </div>
            </div>
          )}

          {/* Explanation (after submit) */}
          {state.submitted && (
            <div className={styles.result}>
              {score !== null && (
                <div
                  className={styles.scoreBox}
                  style={{ borderColor: score >= 70 ? '#22c55e' : '#f59e0b' }}
                >
                  <div className={styles.scoreLabel}>Результат</div>
                  <div
                    className={styles.scoreValue}
                    style={{ color: score >= 70 ? '#22c55e' : '#f59e0b' }}
                  >
                    {score}%
                  </div>
                </div>
              )}
              <div className={styles.explanationBox}>
                <div className={styles.explanationTitle}>Разбор задания</div>
                <p className={styles.explanationText}>{currentCase.explanation}</p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className={styles.actions}>
            {!state.submitted ? (
              <button
                className={styles.submitBtn}
                onClick={onSubmit}
                disabled={
                  state.selectedReactionIds.length === 0 &&
                  state.selectedMetaboliteIds.length === 0
                }
              >
                Проверить ответ
              </button>
            ) : (
              <button className={styles.resetBtn} onClick={onReset}>
                Следующее задание
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function typeLabel(type: string) {
  switch (type) {
    case 'build_path': return 'Восстановить путь';
    case 'affected_reactions': return 'Нарушенные реакции';
    case 'find_intersection': return 'Найти перекрёсток';
    default: return type;
  }
}

function getInstruction(type: string) {
  switch (type) {
    case 'build_path':
      return 'На карте кликайте по реакциям в правильном порядке от начального до конечного метаболита.';
    case 'affected_reactions':
      return 'Отметьте на карте все реакции, которые будут нарушены при указанном ферментном дефиците.';
    case 'find_intersection':
      return 'Нажмите на метаболит(ы), являющиеся точками пересечения указанных путей.';
    default: return '';
  }
}
