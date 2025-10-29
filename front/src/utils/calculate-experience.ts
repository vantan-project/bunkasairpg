export function calculateExperience(level: number): number {
  if (level <= 1) return 0;
  return Math.ceil((2.3 * level) ** 2 - 1);
}
