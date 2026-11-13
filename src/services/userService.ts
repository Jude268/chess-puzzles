import { query } from '../db.js';
import { generateToken } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

export const createUser = async (email: string, username: string, password: string) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await query(
      'INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id, email, username',
      [email, username, passwordHash]
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    return { user, token };
  } catch (error: any) {
    if (error.code === '23505') {
      throw new Error('Email or username already exists');
    }
    throw error;
  }
};

export const authenticateUser = async (email: string, password: string) => {
  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token,
    };
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (userId: number) => {
  try {
    const result = await query(
      'SELECT id, email, username, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
