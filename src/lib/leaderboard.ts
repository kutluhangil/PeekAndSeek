export interface LeaderboardEntry {
  totalScore: number;
  maxScore: number;
  rounds: number;
  region: string;
  date: string;
}

const KEY = "peek_leaderboard_v2";

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveToLeaderboard(entry: LeaderboardEntry): void {
  const board = getLeaderboard();
  board.push(entry);
  board.sort((a, b) => b.totalScore - a.totalScore);
  localStorage.setItem(KEY, JSON.stringify(board.slice(0, 10)));
}
