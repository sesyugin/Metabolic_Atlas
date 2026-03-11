import { useTheme } from '../../theme/ThemeContext';
import type { AppMode } from '../../types';
import styles from './Header.module.css';

interface HeaderProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  teacherMode: boolean;
  onTeacherToggle: () => void;
}

const modeLabels: Record<AppMode, string> = {
  overview: 'Обзор',
  practice: 'Практика',
  exam: 'Экзамен',
  teacher: 'Преподаватель',
};

export function Header({ mode, onModeChange, teacherMode, onTeacherToggle }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header} data-teacher={teacherMode ? 'true' : undefined}>
      <div className={styles.inner}>
        <div className={styles.title}>
          <span className={styles.accent}>Интерактивный атлас</span>
          <span className={styles.sub}> метаболических путей</span>
        </div>

        <nav className={styles.nav} aria-label="Режимы">
          {(['overview', 'practice', 'exam'] as AppMode[]).map((m) => (
            <button
              key={m}
              className={`${styles.modeBtn} ${mode === m && !teacherMode ? styles.active : ''}`}
              onClick={() => {
                onModeChange(m);
                if (teacherMode) onTeacherToggle();
              }}
              aria-current={mode === m && !teacherMode ? 'page' : undefined}
            >
              {modeLabels[m]}
            </button>
          ))}
        </nav>

        <div className={styles.controls}>
          <button
            className={`${styles.teacherBtn} ${teacherMode ? styles.teacherActive : ''}`}
            onClick={onTeacherToggle}
            title="Режим преподавателя"
            aria-pressed={teacherMode}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
              <path d="M10 2a4 4 0 100 8 4 4 0 000-8zM2 18a8 8 0 1116 0H2z" />
            </svg>
            <span>Преподаватель</span>
          </button>

          <button
            className={styles.themeBtn}
            onClick={toggleTheme}
            title={theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'}
            aria-label={theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
          >
            {theme === 'light' ? (
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
