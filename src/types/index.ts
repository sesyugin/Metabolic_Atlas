// ─── Core domain IDs ───────────────────────────────────────────────────────

export type MetabolicPathId =
  | 'glycolysis'
  | 'tca_cycle'
  | 'beta_oxidation'
  | 'pyruvate_to_acetylcoa'
  | 'gluconeogenesis'
  | 'glycogen_metabolism';

export type AppMode = 'overview' | 'practice' | 'teacher';

export type Theme = 'light' | 'dark';

// ─── Metabolic map entities ─────────────────────────────────────────────────

export interface Metabolite {
  id: string;
  name: string;                  // Russian name
  formula?: string;              // Chemical formula
  description?: string;          // 1–2 sentences
  pathIds: MetabolicPathId[];    // Pathways involved in
  isKeyNode?: boolean;           // Major intersection node
  x: number;                     // SVG layout x position (0–1000)
  y: number;                     // SVG layout y position (0–1000)
}

export interface ClinicalNote {
  id: string;
  title: string;                 // Name of condition / enzyme deficiency
  deficiencyOf?: string;         // Which enzyme is deficient
  biochemicalConsequences: string; // Accumulation / deficit of metabolites
  clinicalManifestations: string;  // 1–3 symptoms / syndromes
  disease?: string;              // Disease name
}

export interface Reaction {
  id: string;
  fromMetaboliteId: string;
  toMetaboliteId: string;
  pathId: MetabolicPathId;
  enzymeName: string;            // Full enzyme name
  enzymeShortName?: string;      // Common short name
  reactionType: string;          // e.g. "фосфорилирование", "дегидрогенирование"
  description: string;           // What happens (1–3 sentences)
  isReversible?: boolean;
  cofactors?: string[];          // e.g. ["NAD+", "ATP"]
  energyYield?: string;          // e.g. "+2 ATP" or "-1 ATP"
  clinicalNotes?: ClinicalNote[];
  stepNumber?: number;           // Order within pathway
}

export interface MetabolicPathway {
  id: MetabolicPathId;
  name: string;                  // Russian name
  shortName: string;
  color: string;                 // Accent color for this pathway
  description: string;           // 2–3 sentences
  educationalGoal: string;       // Goal shown in Overview mode
  metaboliteIds: string[];       // Ordered list for canonical walkthrough
  reactionIds: string[];         // Ordered list for canonical walkthrough
  location: string;              // e.g. "цитоплазма", "митохондрии"
}

// ─── Practice mode ──────────────────────────────────────────────────────────

export type PracticeCaseType = 'build_path' | 'affected_reactions' | 'find_intersection';

export interface PracticeCase {
  id: string;
  title: string;
  description: string;           // Task for student
  pathIdsInvolved: MetabolicPathId[];
  type: PracticeCaseType;
  difficulty: 'easy' | 'medium' | 'hard';
  // For build_path
  startMetaboliteId?: string;
  endMetaboliteId?: string;
  correctReactionSequenceIds?: string[];
  // For affected_reactions
  deficientEnzymeName?: string;
  deficientReactionId?: string;
  correctAffectedReactionIds?: string[];
  // For find_intersection
  intersectionMetaboliteIds?: string[];
  // Explanation after answer
  explanation: string;
  hint?: string;
}

// ─── Teacher mode ───────────────────────────────────────────────────────────

export interface TeacherScenarioStep {
  id: string;
  title: string;
  description: string;           // 2–5 sentences shown large on screen
  highlightMetaboliteIds?: string[];
  highlightReactionIds?: string[];
  highlightPathId?: MetabolicPathId;
  discussionQuestions?: string[]; // Questions for group discussion
}

export interface TeacherScenario {
  id: string;
  title: string;
  subtitle?: string;
  pathIds: MetabolicPathId[];
  estimatedMinutes: number;
  steps: TeacherScenarioStep[];
}

// ─── UI state ────────────────────────────────────────────────────────────────

export interface SelectionState {
  metaboliteId: string | null;
  reactionId: string | null;
  pathwayId: MetabolicPathId | null;
}

export interface OverviewState {
  selectedPathwayId: MetabolicPathId | null;
  currentStepIndex: number;       // Index into pathway.reactionIds
  isPlaying: boolean;
}

export interface PracticeState {
  currentCaseId: string | null;
  selectedReactionIds: string[];
  selectedMetaboliteIds: string[];
  submitted: boolean;
  score: number | null;
}

export interface TeacherState {
  selectedScenarioId: string | null;
  currentStepIndex: number;
}
