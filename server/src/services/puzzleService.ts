import axios from 'axios';
import { query } from '../db.js';
import { Puzzle } from '../types/index.js';

const CHESS_COM_API = 'https://api.chess.com/pub';

export const fetchPuzzlesFromChessCom = async (count: number = 20): Promise<Puzzle[]> => {
  try {
    // Chess.com doesn't have a direct puzzle API, but we can use the daily puzzle
    // and puzzle rush. For this MVP, we'll seed with sample puzzles
    // In production, consider using Lichess.org API which has better puzzle support
    
    const response = await axios.get(`${CHESS_COM_API}/puzzle`);
    
    if (response.data && response.data.puzzle) {
      const puzzle = response.data.puzzle;
      return [{
        puzzle_id: puzzle.puzzle_id,
        fen: puzzle.fen,
        moves: puzzle.moves,
        rating: puzzle.rating || 1500,
        rating_deviation: puzzle.rating_deviation || 100,
        popularity: puzzle.popularity || 50,
        themes: puzzle.themes || [],
        game_url: puzzle.game_url || '',
      } as Puzzle];
    }

    return [];
  } catch (error) {
    console.error('Error fetching puzzles from Chess.com:', error);
    return [];
  }
};

export const getPuzzleForUser = async (userId: number): Promise<Puzzle | null> => {
  try {
    // Get a random puzzle that the user hasn't solved yet
    const result = await query(`
      SELECT p.* FROM puzzles p
      WHERE p.id NOT IN (
        SELECT DISTINCT puzzle_id FROM puzzle_attempts 
        WHERE user_id = $1 AND solved = true
      )
      ORDER BY RANDOM()
      LIMIT 1
    `, [userId]);

    if (result.rows.length > 0) {
      return result.rows[0];
    }

    return null;
  } catch (error) {
    console.error('Error getting puzzle for user:', error);
    return null;
  }
};

export const savePuzzle = async (puzzle: Puzzle): Promise<number> => {
  try {
    const result = await query(`
      INSERT INTO puzzles (puzzle_id, fen, moves, rating, rating_deviation, popularity, themes, game_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (puzzle_id) DO UPDATE SET
        popularity = EXCLUDED.popularity
      RETURNING id
    `, [
      puzzle.puzzle_id,
      puzzle.fen,
      JSON.stringify(puzzle.moves),
      puzzle.rating,
      puzzle.rating_deviation,
      puzzle.popularity,
      JSON.stringify(puzzle.themes),
      puzzle.game_url,
    ]);

    return result.rows[0].id;
  } catch (error) {
    console.error('Error saving puzzle:', error);
    throw error;
  }
};
