import { query } from '../db.js';

export const initializeDatabase = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS puzzles (
        id SERIAL PRIMARY KEY,
        puzzle_id VARCHAR(255) UNIQUE NOT NULL,
        fen TEXT NOT NULL,
        moves TEXT NOT NULL,
        rating INTEGER,
        rating_deviation INTEGER,
        popularity INTEGER,
        themes TEXT,
        game_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS puzzle_attempts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        puzzle_id INTEGER NOT NULL REFERENCES puzzles(id) ON DELETE CASCADE,
        solved BOOLEAN DEFAULT FALSE,
        time_spent_ms INTEGER,
        user_move VARCHAR(20),
        failure_reason VARCHAR(255),
        ai_analysis TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_puzzle_attempts_user_id 
      ON puzzle_attempts(user_id)
    `);

    await query(`
      CREATE INDEX IF NOT EXISTS idx_puzzle_attempts_puzzle_id 
      ON puzzle_attempts(puzzle_id)
    `);

    await query(`
      CREATE INDEX IF NOT EXISTS idx_puzzle_attempts_user_puzzle 
      ON puzzle_attempts(user_id, puzzle_id)
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};
