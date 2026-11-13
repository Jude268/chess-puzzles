import express from 'express';
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

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));

await initializeDatabase();

app.use('/api/auth', authRoutes);
app.use('/api/puzzles', puzzleRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const publicPath = path.join(__dirname, '../../client/build');

app.use(express.static(publicPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
