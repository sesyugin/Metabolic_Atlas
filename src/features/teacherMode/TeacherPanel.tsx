import { teacherScenarios } from '../../data';
import type { TeacherState } from '../../types';
import styles from './TeacherPanel.module.css';

interface TeacherPanelProps {
  state: TeacherState;
  onScenarioSelect: (id: string) => void;
  onStepChange: (index: number) => void;
}

export function TeacherPanel({ state, onScenarioSelect, onStepChange }: TeacherPanelProps) {
  const scenario = state.selectedScenarioId
    ? teacherScenarios.find((s) => s.id === state.selectedScenarioId)
    : null;

  const currentStep = scenario?.steps[state.currentStepIndex];

  return (
    <div className={styles.panel}>
      {/* Scenario selector */}
      {!scenario && (
        <div className={styles.scenarioList}>
          <div className={styles.title}>Выберите сценарий урока</div>
          {teacherScenarios.map((s) => (
            <button
              key={s.id}
              className={styles.scenarioCard}
              onClick={() => onScenarioSelect(s.id)}
            >
              <div className={styles.scenarioTitle}>{s.title}</div>
              {s.subtitle && <div className={styles.scenarioSub}>{s.subtitle}</div>}
              <div className={styles.scenarioMeta}>
                <span>⏱ ~{s.estimatedMinutes} мин</span>
                <span>· {s.steps.length} шагов</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Active scenario */}
      {scenario && (
        <div className={styles.activeScenario}>
          {/* Top bar */}
          <div className={styles.controlBar}>
            <button className={styles.backBtn} onClick={() => onScenarioSelect('')}>
              ← Сценарии
            </button>
            <div className={styles.stepDots}>
              {scenario.steps.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === state.currentStepIndex ? styles.dotActive : i < state.currentStepIndex ? styles.dotDone : ''}`}
                  onClick={() => onStepChange(i)}
                  aria-label={`Шаг ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Visual progress bar */}
          <div className={styles.progressBarWrap}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${((state.currentStepIndex + 1) / scenario.steps.length) * 100}%` }}
            />
          </div>

          {/* Scenario header with big slide counter */}
          <div className={styles.scenarioHeader}>
            <div className={styles.scenarioHeaderTitle}>{scenario.title}</div>
            <div className={styles.slideCounter}>
              <span className={styles.slideNum}>{state.currentStepIndex + 1}</span>
              <span className={styles.slideTotal}> / {scenario.steps.length}</span>
            </div>
          </div>

          {/* Current step */}
          {currentStep && (
            <div className={styles.stepCard} key={currentStep.id}>
              <div className={styles.stepTitle}>{currentStep.title}</div>
              <p className={styles.stepDesc}>{currentStep.description}</p>

              {currentStep.discussionQuestions && currentStep.discussionQuestions.length > 0 && (
                <div className={styles.questionsSection}>
                  <div className={styles.questionsLabel}>
                    <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12" style={{ marginRight: 5 }}>
                      <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM7.25 5.5a.75.75 0 011.5 0v.25c1.1.28 2 1.26 2 2.5 0 1.38-1.12 2.5-2.5 2.5a2.5 2.5 0 01-2.5-2.5.75.75 0 011.5 0c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1H7.25V5.5zM7.25 12a.75.75 0 011.5 0v.25a.75.75 0 01-1.5 0V12z"/>
                    </svg>
                    Вопросы для обсуждения
                  </div>
                  <ul className={styles.questionsList}>
                    {currentStep.discussionQuestions.map((q, i) => (
                      <li key={i} className={styles.questionItem}>
                        <span className={styles.questionNum}>{i + 1}</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Navigation buttons — large for 70" screens */}
          <div className={styles.navBtns}>
            <button
              className={styles.navBtn}
              onClick={() => onStepChange(Math.max(0, state.currentStepIndex - 1))}
              disabled={state.currentStepIndex === 0}
              aria-label="Предыдущий шаг"
            >
              ← Назад
            </button>
            <button
              className={`${styles.navBtn} ${styles.navBtnPrimary}`}
              onClick={() => onStepChange(Math.min(scenario.steps.length - 1, state.currentStepIndex + 1))}
              disabled={state.currentStepIndex === scenario.steps.length - 1}
              aria-label="Следующий шаг"
            >
              Следующий шаг →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
