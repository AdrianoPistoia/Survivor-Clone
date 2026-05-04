import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'data', 'leaderboard.json');

function ensureDB() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, '[]', 'utf-8');
}

function readScores() {
  ensureDB();
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeScores(scores) {
  ensureDB();
  fs.writeFileSync(DB_PATH, JSON.stringify(scores, null, 2), 'utf-8');
}

export function getTopScores(limit = 10) {
  const scores = readScores();
  return scores
    .sort((a, b) => b.timeSurvived - a.timeSurvived)
    .slice(0, limit);
}

export function insertScore({ name, kills, timeSurvived, level }) {
  const scores = readScores();
  scores.push({
    id: Date.now(),
    name,
    kills,
    timeSurvived,
    level,
    createdAt: new Date().toISOString(),
  });
  writeScores(scores);
}
