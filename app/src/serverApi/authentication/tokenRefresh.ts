// Refresh the access token a bit before it actually expires so a request never
// goes out with an already-expired token. Capped at half the remaining
// lifetime, so a short-lived token (e.g. AccessTokenLifetimeMinutes lowered
// for manual testing) still gets a sensible refresh point instead of the
// buffer swallowing the whole lifetime and clamping to MIN_DELAY_MS.
const REFRESH_BUFFER_MS = 2 * 60 * 1000;

// Never schedule a refresh in (almost) zero time, e.g. when the token is
// already expired on boot - give the rest of the bootstrapping a moment first.
const MIN_DELAY_MS = 5 * 1000;

export function getMillisecondsUntilRefresh(
  expiresAt: string,
  nowMs: number = Date.now(),
): number {
  const remainingMs = new Date(expiresAt).getTime() - nowMs;
  const buffer = Math.min(REFRESH_BUFFER_MS, remainingMs / 2);
  return Math.max(remainingMs - buffer, MIN_DELAY_MS);
}
