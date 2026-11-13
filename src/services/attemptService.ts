import { query } from '../db.js';

export const recordPuzzleAttempt = async (
  userId: number,
  puzzleId: number,
  solved: boolean,
  timeSpentMs: number,
  userMove: string,
  failureReason: string,
  aiAnalysis: string
) => {
  try {
    const result = await query(`
      INSERT INTO puzzle_attempts (user_id, puzzle_id, solved, time_spent_ms, user_move, failure_reason, ai_analysis)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, [userId, puzzleId, solved, timeSpentMs, userMove, failureReason, aiAnalysis]);

    return result.rows[0].id;
  } catch (error) {
    console.error('Error recording puzzle attempt:', error);
    throw error;
  }
};

export const getUserStats = async (userId: number) => {
  try {
    const result = await query(`
      SELECT 
        COUNT(*) as total_attempts,
        SUM(CASE WHEN solved THEN 1 ELSE 0 END) as puzzles_solved,
        SUM(CASE WHEN NOT solved THEN 1 ELSE 0 END) as puzzles_failed,
        ROUND(100.0 * SUM(CASE WHEN solved THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate,
        AVG(CASE WHEN solved THEN time_spent_ms END) as avg_time_solved_ms
      FROM puzzle_attempts
      WHERE user_id = $1
    `, [userId]);

    return result.rows[0];
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
};

export const getFailureStats = async (userId: number) => {
  try {
    const result = await query(`
      SELECT 
        failure_reason,
        COUNT(*) as count,
        ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 2) as percentage
      FROM puzzle_attempts
      WHERE user_id = $1 AND NOT solved
      GROUP BY failure_reason
      ORDER BY count DESC
    `, [userId]);

    return result.rows;
  } catch (error) {
    console.error('Error getting failure stats:', error);
    throw error;
  }
};

export const getPuzzleHistory = async (userId: number, limit: number = 50, offset: number = 0) => {
  try {
    const result = await query(`
      SELECT 
        pa.id,
        pa.puzzle_id,
        pa.solved,
        pa.failure_reason,
        pa.ai_analysis,
        pa.time_spent_ms,
        pa.created_at,
        p.puzzle_id as puzzle_code,
        p.fen,
        p.rating
      FROM puzzle_attempts pa
      JOIN puzzles p ON pa.puzzle_id = p.id
      WHERE pa.user_id = $1
      ORDER BY pa.created_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, limit, offset]);

    return result.rows;
  } catch (error) {
    console.error('Error getting puzzle history:', error);
    throw error;
  }
};
