import { useCallback, useEffect, useRef, useState } from 'react';
import { examQuestions } from '../../data';
import type { ExamQuestion } from '../../types';
import styles from './ExamPanel.module.css';

interface ExamPanelProps {
  teacherMode?: boolean;
}

type Phase = 'menu' | 'playing' | 'result';

const TOTAL_QUESTIONS = 10;
const TIMER_SECONDS = 20;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickQuestions(): ExamQuestion[] {
  // Ensure variety: at least 1 from each difficulty
  const easy   = examQuestions.filter((q) => q.difficulty === 'easy');
  const medium = examQuestions.filter((q) => q.difficulty === 'medium');
  const hard   = examQuestions.filter((q) => q.difficulty === 'hard');

  const picked: ExamQuestion[] = [
    ...shuffle(easy).slice(0, 3),
    ...shuffle(medium).slice(0, 4),
    ...shuffle(hard).slice(0, 3),
  ];
  return shuffle(picked);
}

function diffLabel(d: ExamQuestion['difficulty']) {
  return d === 'easy' ? 'Лёгкий' : d === 'medium' ? 'Средний' : 'Сложный';
}

function calcScore(correct: number, timeLeft: number, streak: number): number {
  const base = 100;
  const timeBonus = Math.round((timeLeft / TIMER_SECONDS) * 50);
  const streakBonus = Math.min(streak * 10, 50);
  return correct > 0 ? base + timeBonus + streakBonus : 0;
}

function starsForScore(score: number, total: number): string {
  const pct = score / total;
  if (pct >= 0.85) return '⭐⭐⭐';
  if (pct >= 0.60) return '⭐⭐';
  if (pct >= 0.30) return '⭐';
  return '😔';
}

export function ExamPanel({ teacherMode = false }: ExamPanelProps) {
  const [phase, setPhase] = useState<Phase>('menu');
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [streakPop, setStreakPop] = useState(false);
  const [bestScore, setBestScore] = useState<number>(() => {
    try { return parseInt(localStorage.getItem('ma-exam-best') ?? '0', 10) || 0; }
    catch { return 0; }
  });
  const [totalPlayed, setTotalPlayed] = useState<number>(() => {
    try { return parseInt(localStorage.getItem('ma-exam-played') ?? '0', 10) || 0; }
    catch { return 0; }
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          stopTimer();
          // Auto-submit timeout — trigger timeout answer
          setChosen(-1); // -1 = timeout
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [stopTimer]);

  // When a question becomes active, reset timer
  useEffect(() => {
    if (phase !== 'playing') return;
    setTimeLeft(TIMER_SECONDS);
    setChosen(null);
    startTimer();
    return stopTimer;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qIndex, phase]);

  // Cleanup on unmount
  useEffect(() => () => stopTimer(), [stopTimer]);

  const handleStart = () => {
    const qs = pickQuestions();
    setQuestions(qs);
    setQIndex(0);
    setScore(0);
    setCorrectCount(0);
    setStreak(0);
    setMaxStreak(0);
    setChosen(null);
    setPhase('playing');
  };

  const handleAnswer = useCallback((idx: number) => {
    if (chosen !== null) return;
    stopTimer();
    setChosen(idx);

    const q = questions[qIndex];
    const isCorrect = idx === q.correctIndex;

    if (isCorrect) {
      const newStreak = streak + 1;
      const newMax = Math.max(maxStreak, newStreak);
      setStreak(newStreak);
      setMaxStreak(newMax);
      setCorrectCount((c) => c + 1);
      const gained = calcScore(1, timeLeft, streak);
      setScore((s) => s + gained);
      setStreakPop(true);
      setTimeout(() => setStreakPop(false), 350);
    } else {
      setStreak(0);
    }
  }, [chosen, questions, qIndex, streak, maxStreak, timeLeft, stopTimer]);

  // Handle timeout (chosen === -1)
  useEffect(() => {
    if (chosen === -1) {
      stopTimer();
      setStreak(0);
    }
  }, [chosen, stopTimer]);

  const handleNext = useCallback(() => {
    const next = qIndex + 1;
    if (next >= TOTAL_QUESTIONS) {
      // End of quiz
      setPhase('result');
      setTotalPlayed((p) => {
        const np = p + 1;
        try { localStorage.setItem('ma-exam-played', String(np)); } catch {}
        return np;
      });
      if (score > bestScore) {
        setBestScore(score);
        try { localStorage.setItem('ma-exam-best', String(score)); } catch {}
      }
    } else {
      setQIndex(next);
    }
  }, [qIndex, score, bestScore]);

  const maxPossibleScore = TOTAL_QUESTIONS * (100 + 50 + 50);

  // ── RENDER MENU ────────────────────────────────────────────────────────────
  if (phase === 'menu') {
    return (
      <div className={styles.panel} data-teacher={teacherMode ? 'true' : undefined}>
        <div className={styles.menu}>
          <div className={styles.menuIcon}>🧬</div>
          <h2 className={styles.menuTitle}>Экзамен по метаболизму</h2>
          <p className={styles.menuSub}>
            10 случайных вопросов · 20 сек. на каждый<br />
            База: {examQuestions.length} вопросов · бонусы за скорость и серии
          </p>
          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <span className={styles.statNum}>{totalPlayed}</span>
              <span className={styles.statLabel}>Попыток</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNum}>{bestScore}</span>
              <span className={styles.statLabel}>Лучший счёт</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNum}>{examQuestions.length}</span>
              <span className={styles.statLabel}>Вопросов</span>
            </div>
          </div>
          <button className={styles.startBtn} onClick={handleStart}>
            Начать экзамен →
          </button>
        </div>
      </div>
    );
  }

  // ── RENDER RESULT ──────────────────────────────────────────────────────────
  if (phase === 'result') {
    const pct = Math.round((correctCount / TOTAL_QUESTIONS) * 100);
    const titleMap = [
      { min: 90, text: 'Блестяще! Отличник 🎓' },
      { min: 70, text: 'Хорошая работа! 👍' },
      { min: 50, text: 'Неплохо, но есть резервы 📖' },
      { min: 0,  text: 'Не сдался — уже хорошо 💪' },
    ];
    const resultTitle = titleMap.find((t) => pct >= t.min)?.text ?? '';

    return (
      <div className={styles.panel} data-teacher={teacherMode ? 'true' : undefined}>
        <div className={styles.result}>
          <div className={styles.stars}>{starsForScore(score, maxPossibleScore)}</div>
          <h2 className={styles.resultTitle}>{resultTitle}</h2>
          <p className={styles.resultSub}>
            Правильных ответов: {correctCount} / {TOTAL_QUESTIONS} ({pct}%)
          </p>
          <div className={styles.resultGrid}>
            <div className={styles.resultStat}>
              <span className={styles.resultStatNum}>{score}</span>
              <span className={styles.resultStatLabel}>Очки</span>
            </div>
            <div className={styles.resultStat}>
              <span className={styles.resultStatNum}>{maxStreak}</span>
              <span className={styles.resultStatLabel}>Макс. серия</span>
            </div>
            <div className={styles.resultStat}>
              <span className={styles.resultStatNum}>{bestScore}</span>
              <span className={styles.resultStatLabel}>Рекорд</span>
            </div>
          </div>
          <button className={styles.retryBtn} onClick={handleStart}>
            Пройти ещё раз
          </button>
          <button
            className={styles.retryBtn}
            style={{ background: 'var(--bg-alt)', color: 'var(--text-secondary)', border: '1px solid var(--line-strong)', marginTop: -10 }}
            onClick={() => setPhase('menu')}
          >
            В меню
          </button>
        </div>
      </div>
    );
  }

  // ── RENDER PLAYING ─────────────────────────────────────────────────────────
  const q = questions[qIndex];
  if (!q) return null;

  const answered = chosen !== null;
  const timerPct = (timeLeft / TIMER_SECONDS) * 100;
  const timerClass = timeLeft <= 5
    ? styles.critical
    : timeLeft <= 10
    ? styles.warning
    : '';

  return (
    <div className={styles.panel} data-teacher={teacherMode ? 'true' : undefined}>
      <div className={styles.playing}>
        {/* HUD */}
        <div className={styles.hud}>
          <div className={styles.hudItem}>
            <span className={styles.hudValue}>{score}</span>
            <span className={styles.hudLabel}>Очки</span>
          </div>

          <div className={styles.hudCenter}>
            <div className={styles.timerBar}>
              <div
                className={`${styles.timerFill} ${timerClass}`}
                style={{ width: `${timerPct}%` }}
              />
            </div>
            <span className={styles.timerNum}>{timeLeft}с</span>
          </div>

          <div className={styles.hudItem}>
            <span className={styles.hudValue}>
              {qIndex + 1}<span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>/{TOTAL_QUESTIONS}</span>
            </span>
            <span className={styles.hudLabel}>Вопрос</span>
          </div>
        </div>

        {/* Streak */}
        {streak >= 2 && (
          <div style={{ padding: '4px 14px 0', display: 'flex', justifyContent: 'flex-end' }}>
            <span className={`${styles.streakBadge} ${streakPop ? styles.pop : ''}`}>
              🔥 ×{streak} серия
            </span>
          </div>
        )}

        {/* Question */}
        <div className={styles.questionArea}>
          <div className={styles.qMeta}>
            <span className={`${styles.qMetaBadge} ${styles[q.difficulty]}`}>
              {diffLabel(q.difficulty)}
            </span>
            <span>{q.pathway}</span>
          </div>

          <p className={styles.questionText}>{q.text}</p>

          <div className={styles.options}>
            {q.options.map((opt, i) => {
              let cls = styles.optionBtn;
              if (answered) {
                if (i === q.correctIndex) cls += ' ' + styles.correct;
                else if (i === chosen)    cls += ' ' + styles.wrong;
              }
              return (
                <button
                  key={i}
                  className={cls}
                  onClick={() => handleAnswer(i)}
                  disabled={answered}
                >
                  <strong style={{ marginRight: 6, opacity: 0.5 }}>
                    {String.fromCharCode(65 + i)}.
                  </strong>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Timeout notice */}
          {chosen === -1 && !answered && (
            <div className={styles.explanation}>⏱ Время вышло! Правильный ответ выделен зелёным.</div>
          )}

          {/* Explanation */}
          {answered && (
            <div className={styles.explanation}>
              {chosen === q.correctIndex
                ? '✅ '
                : chosen === -1
                ? '⏱ '
                : '❌ '}
              {q.explanation}
            </div>
          )}
        </div>

        {/* Next button */}
        {answered && (
          <button className={styles.nextBtn} onClick={handleNext}>
            {qIndex + 1 < TOTAL_QUESTIONS ? 'Следующий вопрос →' : 'Посмотреть результаты →'}
          </button>
        )}
      </div>
    </div>
  );
}
