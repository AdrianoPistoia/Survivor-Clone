import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import leaderboardRouter from './routes/leaderboard.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json({ limit: '1kb' }));

// Rate limit POST to leaderboard (max 10 per minute per IP)
const postLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many requests, try again later' },
});
app.use('/api/leaderboard', (req, res, next) => {
  if (req.method === 'POST') return postLimiter(req, res, next);
  next();
});

// API routes
app.use('/api/leaderboard', leaderboardRouter);

// Serve static frontend (production build)
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
