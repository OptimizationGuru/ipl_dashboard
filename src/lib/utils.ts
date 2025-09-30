/**
 * Format balls into proper cricket overs notation
 * @param balls - Number of balls bowled
 * @returns Formatted overs string (e.g., "2.3" for 2 overs and 3 balls)
 */
export function formatOvers(balls: number): string {
  const overs = Math.floor(balls / 6);
  const remainingBalls = balls % 6;
  return `${overs}.${remainingBalls}`;
}
