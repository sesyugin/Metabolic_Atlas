import { useCallback, useState } from 'react';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { PasswordGate } from './components/PasswordGate/PasswordGate';
import { WelcomeModal, useWelcomeModal } from './components/WelcomeModal/WelcomeModal';
import { MetabolicMap } from './features/atlas/MetabolicMap';
import { InfoPanel } from './features/atlas/InfoPanel';
import { OverviewPanel } from './features/atlas/OverviewPanel';
import { PracticePanel } from './features/practice/PracticePanel';
import { TeacherPanel } from './features/teacherMode/TeacherPanel';
import { ExamPanel } from './features/exam/ExamPanel';
import { EducationalVideoSection } from './features/video/EducationalVideoSection';
import { teacherScenarios, practiceCases, reactionMap, pathways } from './data';
import type {
  AppMode,
  MetabolicPathId,
  OverviewState,
  PracticeState,
  SelectionState,
  TeacherState,
} from './types';
import styles from './App.module.css';

export default function App() {
  // ─── Global UI state ───────────────────────────────────────────────────────
  const [mode, setMode] = useState<AppMode>('overview');
  const [teacherMode, setTeacherMode] = useState(false);
  const [showPasswordGate, setShowPasswordGate] = useState(false);
  const welcome = useWelcomeModal();

  // ─── Selection ─────────────────────────────────────────────────────────────
  const [selection, setSelection] = useState<SelectionState>({
    metaboliteId: null,
    reactionId: null,
    pathwayId: null,
  });

  const selectMetabolite = useCallback((id: string) => {
    setSelection({ metaboliteId: id, reactionId: null, pathwayId: null });
  }, []);

  const selectReaction = useCallback((id: string) => {
    setSelection({ metaboliteId: null, reactionId: id, pathwayId: null });
  }, []);

  // ─── Overview state ────────────────────────────────────────────────────────
  const [overview, setOverview] = useState<OverviewState>({
    selectedPathwayId: null,
    currentStepIndex: 0,
    isPlaying: false,
  });

  const handlePathwaySelect = useCallback((id: MetabolicPathId) => {
    setOverview({ selectedPathwayId: id, currentStepIndex: 0, isPlaying: false });
    setSelection({ metaboliteId: null, reactionId: null, pathwayId: id });
  }, []);

  const handleOverviewStep = useCallback((index: number) => {
    setOverview((s) => ({ ...s, currentStepIndex: index, isPlaying: false }));
  }, []);

  const handlePlayToggle = useCallback(() => {
    setOverview((s) => ({ ...s, isPlaying: !s.isPlaying }));
  }, []);

  // ─── Practice state ────────────────────────────────────────────────────────
  const [practice, setPractice] = useState<PracticeState>({
    currentCaseId: null,
    selectedReactionIds: [],
    selectedMetaboliteIds: [],
    submitted: false,
    score: null,
  });

  const handleCaseSelect = useCallback((id: string) => {
    const c = practiceCases.find((x) => x.id === id);
    if (!c) return;
    setPractice({
      currentCaseId: id,
      selectedReactionIds: [],
      selectedMetaboliteIds: [],
      submitted: false,
      score: null,
    });
    setSelection({ metaboliteId: null, reactionId: null, pathwayId: c.pathIdsInvolved[0] ?? null });
  }, []);

  const handleTogglePracticeReaction = useCallback((id: string) => {
    if (practice.submitted) return;
    setPractice((s) => ({
      ...s,
      selectedReactionIds: s.selectedReactionIds.includes(id)
        ? s.selectedReactionIds.filter((r) => r !== id)
        : [...s.selectedReactionIds, id],
    }));
  }, [practice.submitted]);

  const handleTogglePracticeMetabolite = useCallback((id: string) => {
    if (practice.submitted) return;
    setPractice((s) => ({
      ...s,
      selectedMetaboliteIds: s.selectedMetaboliteIds.includes(id)
        ? s.selectedMetaboliteIds.filter((m) => m !== id)
        : [...s.selectedMetaboliteIds, id],
    }));
    selectMetabolite(id);
  }, [practice.submitted, selectMetabolite]);

  const handlePracticeSubmit = useCallback(() => {
    const c = practiceCases.find((x) => x.id === practice.currentCaseId);
    if (!c) return;
    let score = 0;
    if (c.type === 'build_path' && c.correctReactionSequenceIds) {
      const correct = c.correctReactionSequenceIds;
      const selected = practice.selectedReactionIds;
      let hits = 0;
      correct.forEach((id) => { if (selected.includes(id)) hits++; });
      score = Math.round((hits / correct.length) * 100);
    } else if (c.type === 'affected_reactions' && c.correctAffectedReactionIds) {
      const correct = c.correctAffectedReactionIds;
      const selected = practice.selectedReactionIds;
      let hits = 0;
      correct.forEach((id) => { if (selected.includes(id)) hits++; });
      const extra = selected.filter((id) => !correct.includes(id)).length;
      score = Math.max(0, Math.round(((hits - extra) / correct.length) * 100));
    } else if (c.type === 'find_intersection' && c.intersectionMetaboliteIds) {
      const correct = c.intersectionMetaboliteIds;
      const selected = practice.selectedMetaboliteIds;
      let hits = 0;
      correct.forEach((id) => { if (selected.includes(id)) hits++; });
      score = Math.round((hits / correct.length) * 100);
    }
    setPractice((s) => ({ ...s, submitted: true, score }));
  }, [practice]);

  const handlePracticeReset = useCallback(() => {
    setPractice({ currentCaseId: null, selectedReactionIds: [], selectedMetaboliteIds: [], submitted: false, score: null });
    setSelection({ metaboliteId: null, reactionId: null, pathwayId: null });
  }, []);

  // ─── Teacher state ─────────────────────────────────────────────────────────
  const [teacher, setTeacher] = useState<TeacherState>({
    selectedScenarioId: null,
    currentStepIndex: 0,
  });

  const handleScenarioSelect = useCallback((id: string) => {
    if (!id) {
      setTeacher({ selectedScenarioId: null, currentStepIndex: 0 });
      return;
    }
    setTeacher({ selectedScenarioId: id, currentStepIndex: 0 });
    const scenario = teacherScenarios.find((s) => s.id === id);
    if (scenario?.steps[0]?.highlightPathId) {
      setSelection({ metaboliteId: null, reactionId: null, pathwayId: scenario.steps[0].highlightPathId });
    }
  }, []);

  const handleTeacherStepChange = useCallback((index: number) => {
    setTeacher((s) => ({ ...s, currentStepIndex: index }));
    const scenario = teacherScenarios.find((s) => s.id === teacher.selectedScenarioId);
    const step = scenario?.steps[index];
    if (step?.highlightPathId) {
      setSelection({ metaboliteId: null, reactionId: null, pathwayId: step.highlightPathId });
    }
  }, [teacher.selectedScenarioId]);

  const handleTeacherToggle = useCallback(() => {
    if (!teacherMode) {
      setShowPasswordGate(true);
    } else {
      setTeacherMode(false);
      setMode('overview');
    }
  }, [teacherMode]);

  // ─── Derive highlight sets ─────────────────────────────────────────────────
  const overviewHighlightReactions = (): string[] => {
    if (mode !== 'overview' || !overview.selectedPathwayId) return [];
    const pw = pathways.find((p) => p.id === overview.selectedPathwayId);
    if (!pw) return [];
    return pw.reactionIds.slice(0, overview.currentStepIndex + 1);
  };

  const overviewHighlightMetabolites = (): string[] => {
    if (mode !== 'overview' || !overview.selectedPathwayId) return [];
    const pw = pathways.find((p) => p.id === overview.selectedPathwayId);
    if (!pw) return [];
    const current = pw.reactionIds[overview.currentStepIndex];
    const rxn = current ? reactionMap.get(current) : null;
    if (!rxn) return [];
    return [rxn.fromMetaboliteId, rxn.toMetaboliteId];
  };

  const teacherHighlightMetabolites = (): string[] => {
    if (!teacherMode || !teacher.selectedScenarioId) return [];
    const scenario = teacherScenarios.find((s) => s.id === teacher.selectedScenarioId);
    return scenario?.steps[teacher.currentStepIndex]?.highlightMetaboliteIds ?? [];
  };

  const teacherHighlightReactions = (): string[] => {
    if (!teacherMode || !teacher.selectedScenarioId) return [];
    const scenario = teacherScenarios.find((s) => s.id === teacher.selectedScenarioId);
    return scenario?.steps[teacher.currentStepIndex]?.highlightReactionIds ?? [];
  };

  const teacherHighlightPathId = (): MetabolicPathId | undefined => {
    if (!teacherMode || !teacher.selectedScenarioId) return undefined;
    const scenario = teacherScenarios.find((s) => s.id === teacher.selectedScenarioId);
    return scenario?.steps[teacher.currentStepIndex]?.highlightPathId;
  };

  // ─── Compute correct/incorrect for practice visual feedback ───────────────
  const correctReactionIds: string[] = [];
  const incorrectReactionIds: string[] = [];
  if (practice.submitted && practice.currentCaseId) {
    const c = practiceCases.find((x) => x.id === practice.currentCaseId);
    if (c?.type === 'build_path' && c.correctReactionSequenceIds) {
      practice.selectedReactionIds.forEach((id) => {
        if (c.correctReactionSequenceIds!.includes(id)) correctReactionIds.push(id);
        else incorrectReactionIds.push(id);
      });
    } else if (c?.type === 'affected_reactions' && c.correctAffectedReactionIds) {
      practice.selectedReactionIds.forEach((id) => {
        if (c.correctAffectedReactionIds!.includes(id)) correctReactionIds.push(id);
        else incorrectReactionIds.push(id);
      });
    }
  }

  // ─── Right panel content ───────────────────────────────────────────────────
  const renderRightPanel = () => {
    if (teacherMode) {
      return (
        <TeacherPanel
          state={teacher}
          onScenarioSelect={handleScenarioSelect}
          onStepChange={handleTeacherStepChange}
        />
      );
    }
    if (mode === 'overview') {
      return (
        <InfoPanel selection={selection} teacherMode={teacherMode}>
          <div style={{ padding: '10px 16px' }}>
            <EducationalVideoSection teacherMode={teacherMode} />
          </div>
          <OverviewPanel
            state={overview}
            onPathwaySelect={handlePathwaySelect}
            onStepChange={handleOverviewStep}
            onPlayToggle={handlePlayToggle}
            teacherMode={teacherMode}
          />
        </InfoPanel>
      );
    }
    if (mode === 'practice') {
      return (
        <InfoPanel selection={selection} teacherMode={teacherMode}>
          <PracticePanel
            state={practice}
            onCaseSelect={handleCaseSelect}
            onToggleReaction={handleTogglePracticeReaction}
            onToggleMetabolite={handleTogglePracticeMetabolite}
            onSubmit={handlePracticeSubmit}
            onReset={handlePracticeReset}
            teacherMode={teacherMode}
          />
        </InfoPanel>
      );
    }
    if (mode === 'exam') {
      return <ExamPanel teacherMode={teacherMode} />;
    }
    return null;
  };

  return (
    <div className={styles.app} data-teacher={teacherMode ? 'true' : undefined}>
      {welcome.show && <WelcomeModal onClose={welcome.close} />}
      <PasswordGate
        isOpen={showPasswordGate}
        onSuccess={() => { setShowPasswordGate(false); setTeacherMode(true); setMode('teacher'); }}
        onCancel={() => setShowPasswordGate(false)}
      />
      <Header
        mode={mode}
        onModeChange={setMode}
        teacherMode={teacherMode}
        onTeacherToggle={handleTeacherToggle}
      />

      <main className={styles.main}>
        <div className={styles.mapArea}>
          <MetabolicMap
            selection={selection}
            onSelectMetabolite={mode === 'practice' ? handleTogglePracticeMetabolite : selectMetabolite}
            onSelectReaction={mode === 'practice' ? handleTogglePracticeReaction : selectReaction}
            highlightMetaboliteIds={
              teacherMode
                ? teacherHighlightMetabolites()
                : mode === 'overview'
                ? overviewHighlightMetabolites()
                : []
            }
            highlightReactionIds={
              teacherMode
                ? teacherHighlightReactions()
                : mode === 'overview'
                ? overviewHighlightReactions()
                : []
            }
            highlightPathId={
              teacherMode
                ? teacherHighlightPathId()
                : mode === 'overview'
                ? (overview.selectedPathwayId ?? undefined)
                : mode === 'practice' && practice.currentCaseId
                ? (practiceCases.find((c) => c.id === practice.currentCaseId)?.pathIdsInvolved[0])
                : undefined
            }
            activePathId={selection.pathwayId}
            teacherMode={teacherMode}
            practiceMode={mode === 'practice' && !practice.submitted}
            onReactionClick={mode === 'practice' ? handleTogglePracticeReaction : undefined}
            selectedReactionIds={mode === 'practice' ? practice.selectedReactionIds : []}
            correctReactionIds={correctReactionIds}
            incorrectReactionIds={incorrectReactionIds}
          />
        </div>

        <aside className={styles.panel}>
          {renderRightPanel()}
        </aside>
      </main>

      <Footer />
    </div>
  );
}
