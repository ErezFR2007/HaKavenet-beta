
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
