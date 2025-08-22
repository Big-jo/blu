import { LEARNING_STYLE } from './enum';

export type AuthUser = {
  userId: string;
  email: string;
};

export type GradeQuestion = {
  question: string;
  learningStyle: string;
};

export type LearningStyleScores = {
  [LEARNING_STYLE.VISUAL]?: number;
  [LEARNING_STYLE.AUDITORY]?: number;
  [LEARNING_STYLE.KINESTHETIC]?: number;
  [LEARNING_STYLE.READ_WRITE]?: number;
  [LEARNING_STYLE.NARRATION]?: number;
};

export const NotificationIntervals = ['daily', 'weekly'] as const;
export type NotificationInterval = (typeof NotificationIntervals)[number];

export const TransactionTypes = ['DEBIT', 'CREDIT'] as const;
export type TransactionType = (typeof TransactionTypes)[number];
