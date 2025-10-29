export function calculateLevel(experiencePoint: number): number {
  return Math.floor(Math.sqrt(experiencePoint + 1) / 2.3) || 1;
}
