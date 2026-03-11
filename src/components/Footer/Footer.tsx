import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.projectName}>
          <span className={styles.accent}>⬡</span>
          {' '}Интерактивный атлас метаболических путей
        </span>
        <span className={styles.sep}>·</span>
        <span className={styles.author}>
          Сесюгин З.Д., 2026
        </span>
        <span className={styles.sep}>·</span>
        <a
          className={styles.link}
          href="https://sesyugin.github.io/Resume_SesyuginZD"
          target="_blank"
          rel="noopener noreferrer"
        >
          Резюме ↗
        </a>
      </div>
    </footer>
  );
}
