import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import puzzleRoutes from './routes/puzzles.js';
import { initializeDatabase } from './database/migrations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  })
);

// Initialize database
await initializeDatabase();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/puzzles', puzzleRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../../public')));

// Fallback to index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
