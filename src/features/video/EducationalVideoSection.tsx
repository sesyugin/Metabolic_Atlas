import { useState } from 'react';
import { Modal } from '../../components/Modal/Modal';
import styles from './EducationalVideoSection.module.css';

/**
 * EducationalVideoSection
 *
 * HOW TO ADD A REAL VIDEO:
 * 1. Generate a video lecture in NotebookLM using the scenario described below.
 * 2. Upload the video to YouTube or any platform that provides an embed URL.
 * 3. Replace VIDEO_EMBED_URL with the actual embed URL, e.g.:
 *    const VIDEO_EMBED_URL = 'https://www.youtube.com/embed/YOUR_VIDEO_ID';
 * 4. Set HAS_VIDEO = true.
 *
 * NotebookLM Video Script Outline (8–10 min):
 * 1. Why does a doctor need a metabolic pathway map? Clinical-biochemical thinking.
 * 2. Glycolysis example: glucose → pyruvate, key regulatory enzymes, energy yield.
 * 3. TCA cycle as the central hub for acetyl-CoA processing; link to the respiratory chain.
 * 4. β-Oxidation and fasting: metabolic fuel switch, what happens when it fails.
 * 5. Clinical cases: enzyme deficiency → metabolic block → symptoms.
 * 6. How to use the Interactive Atlas:
 *    – Overview mode for understanding structure;
 *    – Practice mode for consolidation;
 *    – Teacher Mode for classroom use.
 */

const HAS_VIDEO = false;
const VIDEO_EMBED_URL = ''; // TODO: replace with real embed URL

export function EducationalVideoSection({ teacherMode = false }: { teacherMode?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className={`${styles.videoBtn} ${teacherMode ? styles.teacherBtn : ''}`}
        onClick={() => setOpen(true)}
        title="Открыть видео-лекцию"
      >
        <span className={styles.icon}>
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
        </span>
        <span>Видео-лекция</span>
      </button>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Видео-лекция: Введение в метаболические пути">
        <div className={styles.modalContent}>
          {HAS_VIDEO ? (
            <div className={styles.videoWrapper}>
              <iframe
                src={VIDEO_EMBED_URL}
                title="Видео-лекция по метаболическим путям"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={styles.iframe}
              />
            </div>
          ) : (
            <div className={styles.placeholder}>
              <div className={styles.placeholderIcon}>
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" width="56" height="56">
                  <circle cx="24" cy="24" r="20" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 16l12 8-12 8V16z" />
                </svg>
              </div>
              <h3>Видео-лекция ещё не добавлена</h3>
              <p>
                Здесь будет размещена видео-лекция (8–10 мин), созданная в{' '}
                <strong>NotebookLM</strong> по следующему плану:
              </p>
              <ol className={styles.outlineList}>
                <li>Зачем врачу карта метаболических путей — клинико-биохимическое мышление.</li>
                <li>Гликолиз: от глюкозы до пирувата, ключевые регуляторные ферменты, выход энергии.</li>
                <li>Цикл Кребса — центральный узел переработки ацетил-КоА; связь с дыхательной цепью.</li>
                <li>β-Окисление и голодание: переключение на жиры; что происходит при нарушении.</li>
                <li>Клинические кейсы: дефицит фермента → метаболический блок → симптомы.</li>
                <li>
                  Как работать с Интерактивным атласом: Обзор → Практика → Режим преподавателя.
                </li>
              </ol>
              <p className={styles.devNote}>
                <em>
                  Разработчику: замените константу <code>VIDEO_EMBED_URL</code> в файле{' '}
                  <code>EducationalVideoSection.tsx</code> на ссылку для встраивания видео и
                  установите <code>HAS_VIDEO = true</code>.
                </em>
              </p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
