export interface User {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  created_at: Date;
}

export interface Puzzle {
  id: number;
  puzzle_id: string;
  fen: string;
  moves: string[];
  rating: number;
  rating_deviation: number;
  popularity: number;
  themes: string[];
  game_url: string;
}

export interface PuzzleAttempt {
  id: number;
  user_id: number;
  puzzle_id: number;
  solved: boolean;
  time_spent_ms: number;
  user_move: string;
  failure_reason: string;
  ai_analysis: string;
  created_at: Date;
}

export interface FailureReason {
  id: number;
  code: string;
  label: string;
  description: string;
}

export const FAILURE_REASONS = {
  WRONG_MOVE: 'wrong_move',
  TIME_EXPIRED: 'time_expired',
  INCOMPLETE_SEQUENCE: 'incomplete_sequence',
  MISSED_BEST_MOVE: 'missed_best_move',
  BLUNDERED: 'blundered',
  MISUNDERSTOOD_POSITION: 'misunderstood_position',
};
