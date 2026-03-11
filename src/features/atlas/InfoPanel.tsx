import type { ReactNode } from 'react';
import { metaboliteMap, reactionMap, pathwayMap } from '../../data';
import type { ClinicalNote, SelectionState } from '../../types';
import styles from './InfoPanel.module.css';

interface InfoPanelProps {
  selection: SelectionState;
  teacherMode?: boolean;
  children?: ReactNode;
}

function ClinicalNoteCard({ note }: { note: ClinicalNote }) {
  return (
    <div className={styles.clinicalCard}>
      <div className={styles.clinicalHeader}>
        <span className={styles.clinicalIcon}>⚕</span>
        <strong>{note.title}</strong>
      </div>
      {note.deficiencyOf && (
        <p className={styles.clinicalRow}>
          <span className={styles.clinicalLabel}>Дефицит:</span> {note.deficiencyOf}
        </p>
      )}
      {note.disease && (
        <p className={styles.clinicalRow}>
          <span className={styles.clinicalLabel}>Заболевание:</span> {note.disease}
        </p>
      )}
      <p className={styles.clinicalRow}>
        <span className={styles.clinicalLabel}>Биохимия:</span> {note.biochemicalConsequences}
      </p>
      <p className={styles.clinicalRow}>
        <span className={styles.clinicalLabel}>Клиника:</span> {note.clinicalManifestations}
      </p>
    </div>
  );
}

function MetaboliteCard({ id }: { id: string }) {
  const met = metaboliteMap.get(id);
  if (!met) return null;
  const pathNames = met.pathIds.map((pid) => pathwayMap.get(pid)?.name ?? pid);

  return (
    <div className={styles.card}>
      <div className={styles.cardType}>Метаболит</div>
      <h3 className={styles.cardTitle}>{met.name}</h3>
      {met.formula && <p className={styles.formula}>{met.formula}</p>}
      {met.description && <p className={styles.cardDesc}>{met.description}</p>}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>Участвует в путях</div>
        <div className={styles.tagList}>
          {pathNames.map((n) => <span key={n} className={styles.tag}>{n}</span>)}
        </div>
      </div>
      {met.isKeyNode && (
        <div className={styles.keyNodeBadge}>
          Ключевой узел метаболизма
        </div>
      )}
    </div>
  );
}

function ReactionCard({ id }: { id: string }) {
  const rxn = reactionMap.get(id);
  if (!rxn) return null;
  const pathway = pathwayMap.get(rxn.pathId);

  return (
    <div className={styles.card}>
      <div className={styles.cardType} style={{ color: pathway?.color }}>
        {rxn.reactionType} · {pathway?.shortName}
      </div>
      <h3 className={styles.cardTitle}>{rxn.enzymeName}</h3>
      {rxn.enzymeShortName && (
        <p className={styles.shortName}>Сокр.: {rxn.enzymeShortName}</p>
      )}
      <p className={styles.cardDesc}>{rxn.description}</p>

      <div className={styles.metaRow}>
        {rxn.cofactors && rxn.cofactors.length > 0 && (
          <div>
            <div className={styles.sectionLabel}>Кофакторы</div>
            <div className={styles.tagList}>
              {rxn.cofactors.map((c) => <span key={c} className={styles.tag}>{c}</span>)}
            </div>
          </div>
        )}
        {rxn.energyYield && (
          <div>
            <div className={styles.sectionLabel}>Энергетика</div>
            <span className={styles.energyTag}>{rxn.energyYield}</span>
          </div>
        )}
      </div>

      {rxn.clinicalNotes && rxn.clinicalNotes.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Клинические ситуации</div>
          {rxn.clinicalNotes.map((n) => (
            <ClinicalNoteCard key={n.id} note={n} />
          ))}
        </div>
      )}
    </div>
  );
}

export function InfoPanel({ selection, teacherMode = false, children }: InfoPanelProps) {
  return (
    <div className={styles.panel} data-teacher={teacherMode ? 'true' : undefined}>
      {children && <div className={styles.top}>{children}</div>}
      <div className={styles.content}>
        {!selection.metaboliteId && !selection.reactionId && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.773 4.773zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p>Нажмите на метаболит или реакцию на карте, чтобы увидеть подробную информацию.</p>
          </div>
        )}
        {selection.metaboliteId && <MetaboliteCard id={selection.metaboliteId} />}
        {selection.reactionId && !selection.metaboliteId && <ReactionCard id={selection.reactionId} />}
      </div>
    </div>
  );
}
