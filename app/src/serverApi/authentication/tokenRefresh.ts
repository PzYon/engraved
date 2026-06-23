const REFRESH_BUFFER_MS = 2 * 60 * 1000;
const MIN_DELAY_MS = 5 * 1000;

export function getMillisecondsUntilRefresh(
  expiresAt: string,
  nowMs: number = Date.now(),
): number {
  const remainingMs = new Date(expiresAt).getTime() - nowMs;
  const buffer = Math.min(REFRESH_BUFFER_MS, remainingMs / 2);
  return Math.max(remainingMs - buffer, MIN_DELAY_MS);
}
