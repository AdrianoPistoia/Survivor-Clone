const KEY = 'leaderboard';
const MAX_ENTRIES = 20;

export function getTopScores(limit = 10) {
  try {
    const raw = localStorage.getItem(KEY);
    const entries = raw ? JSON.parse(raw) : [];
    return entries.slice(0, limit);
  } catch {
    return [];
  }
}

export function insertScore({ name, kills, timeSurvived, level, score }) {
  try {
    const raw = localStorage.getItem(KEY);
    const entries = raw ? JSON.parse(raw) : [];
    entries.push({ name, kills, timeSurvived, level, score, createdAt: new Date().toISOString() });
    entries.sort((a, b) => b.score - a.score);
    localStorage.setItem(KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch {
    // localStorage unavailable — silently skip
  }
}
