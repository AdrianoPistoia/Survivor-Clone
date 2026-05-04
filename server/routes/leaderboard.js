import { Router } from 'express';
import { getTopScores, insertScore } from '../db.js';

const router = Router();

// GET /api/leaderboard — top 10 scores
router.get('/', (req, res) => {
  try {
    const scores = getTopScores(10);
    res.json(scores);
  } catch (err) {
    console.error('Failed to get scores:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/leaderboard — submit a new score
router.post('/', (req, res) => {
  try {
    const { name, kills, timeSurvived, level } = req.body;

    // Validation
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Name is required' });
    }

    const sanitizedName = name.trim().replace(/<[^>]*>/g, '').substring(0, 20);
    if (sanitizedName.length === 0) {
      return res.status(400).json({ error: 'Invalid name' });
    }

    const safeKills = Math.max(0, Math.floor(Number(kills) || 0));
    const safeTime = Math.max(0, Math.floor(Number(timeSurvived) || 0));
    const safeLevel = Math.max(1, Math.floor(Number(level) || 1));

    insertScore({
      name: sanitizedName,
      kills: safeKills,
      timeSurvived: safeTime,
      level: safeLevel,
    });

    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Failed to insert score:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
