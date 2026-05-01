export function calculateScore(distanceKm: number): number {
  if (distanceKm < 0.05) return 5000;
  if (distanceKm >= 15000) return 0;
  return Math.round(5000 * Math.exp(-distanceKm / 2000));
}

export function scoreGrade(score: number): string {
  if (score >= 4800) return "S";
  if (score >= 4000) return "A";
  if (score >= 2500) return "B";
  if (score >= 1000) return "C";
  return "D";
}

export function scoreColorClass(score: number): string {
  if (score >= 4500) return "text-emerald-500";
  if (score >= 3000) return "text-yellow-400";
  if (score >= 1500) return "text-orange-400";
  return "text-red-400";
}
