import { useEffect, useState } from 'react';
import styles from './WelcomeModal.module.css';

const STORAGE_KEY = 'ma-welcome-seen';

interface WelcomeModalProps {
  onClose: () => void;
}

const tips = [
  {
    icon: '🗺',
    title: 'Интерактивная карта',
    text: 'Нажимайте на метаболиты (круги) и реакции (стрелки), чтобы видеть детальную информацию. Масштабируйте колёсиком мыши, тяните для панорамирования.',
  },
  {
    icon: '📚',
    title: 'Режим «Обзор»',
    text: 'Выберите метаболический путь и пройдите его пошагово: ферменты, кофакторы, энергетика, клинические связи.',
  },
  {
    icon: '🩺',
    title: 'Режим «Практика»',
    text: 'Решайте клинические задачи: постройте путь биосинтеза, найдите поражённые реакции при ферментопатии, определите пересечение путей.',
  },
  {
    icon: '🖥',
    title: 'Режим «Преподаватель»',
    text: 'Защищён паролем. Оптимизирован для экранов 70"+: крупный шрифт, пошаговые сценарии урока с вопросами для обсуждения.',
  },
];

export function WelcomeModal({ onClose }: WelcomeModalProps) {
  const [step, setStep] = useState(0);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    onClose();
  };

  const handleNext = () => {
    if (step < tips.length - 1) setStep((s) => s + 1);
    else handleClose();
  };

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tip = tips[step];

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Добро пожаловать">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logo}>
            <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
              <circle cx="16" cy="16" r="15" stroke="var(--accent)" strokeWidth="2"/>
              <circle cx="16" cy="10" r="3" fill="var(--accent)"/>
              <circle cx="8"  cy="22" r="3" fill="var(--accent)" opacity="0.6"/>
              <circle cx="24" cy="22" r="3" fill="var(--accent)" opacity="0.6"/>
              <line x1="16" y1="13" x2="8"  y2="19" stroke="var(--accent)" strokeWidth="1.5"/>
              <line x1="16" y1="13" x2="24" y2="19" stroke="var(--accent)" strokeWidth="1.5"/>
              <line x1="8"  y1="22" x2="24" y2="22" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="3 2"/>
            </svg>
          </div>
          <div>
            <div className={styles.title}>Добро пожаловать!</div>
            <div className={styles.subtitle}>Интерактивный атлас метаболических путей</div>
          </div>
          <button className={styles.closeBtn} onClick={handleClose} aria-label="Закрыть">
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>

        {/* Tip card */}
        <div className={styles.tipCard} key={step}>
          <div className={styles.tipIcon}>{tip.icon}</div>
          <div className={styles.tipTitle}>{tip.title}</div>
          <p className={styles.tipText}>{tip.text}</p>
        </div>

        {/* Step dots */}
        <div className={styles.dots}>
          {tips.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === step ? styles.dotActive : i < step ? styles.dotDone : ''}`}
              onClick={() => setStep(i)}
              aria-label={`Подсказка ${i + 1}`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.skipBtn} onClick={handleClose}>Пропустить</button>
          <button className={styles.nextBtn} onClick={handleNext}>
            {step < tips.length - 1 ? 'Далее →' : 'Начать работу →'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function useWelcomeModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      // Small delay to let the app render first
      const t = setTimeout(() => setShow(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  return { show, close: () => setShow(false) };
}
