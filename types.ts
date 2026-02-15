
export enum FitnessLevel {
  VERY_HIGH = 1,
  HIGH = 2,
  MEDIUM = 3,
  LOW = 4
}

export interface Role {
  id: number;
  name: string;
  type: string;
  note?: string;
  rank: number;
  minProfile: number;
  minDapr: number;
  tags: string; // e.g., "altsfmg2"
  fitnessRequired: FitnessLevel;
}

export interface CourseStage {
  title: string;
  duration?: string;
  description: string;
}

export interface SelectionPath {
  name: string; // שם המסלול (למשל "דרך יום סיירות" או "דרך איתור קדם צבאי")
  steps: string[]; // רשימת שלבים, למשל ["מיון מקוון", "יום סיירות", "גיבוש"]
}

export interface YomHameaRequirement {
  label: string;
  score: number;
}

export interface RoleExtendedDetails {
  description: string;
  shortDescription?: string;
  importantNote?: string; // הערה חשובה (כמו חסימת מיונים או ויתור)
  selectionPaths: SelectionPath[]; // דרכי הגעה ליחידה
  trainingProcess: CourseStage[]; // שלבי המסלול ביחידה
  yomHameaRequirements?: YomHameaRequirement[]; // דרישות יום המא"ה
  stats?: {
    serviceLength: string; // זמן שירות כולל
    selectionCount?: string; // מספר שלבי מיון
    teamSize?: string;
  };
}

export type TagPreference = 'very_no' | 'no' | 'neutral' | 'yes' | 'very_yes';

export type InterviewScore = 'high' | 'medium' | 'low';

export interface UserAnswers {
  gender: 'male' | 'female';
  profile: number;
  dapr: number;
  interviewScore: InterviewScore; // התרשמות מראיון אישי
  runTime: number; // 1-4 points
  pullUpsOrPushUps: number; // 1-4 points
  mentalApproach: 'poison' | 'neutral' | 'tech';
  tags: Record<string, TagPreference>;
}

export interface MatchResult extends Role {
  matchPercentage: number;
  reasons: string[];
}
