// Refresh the access token a bit before it actually expires so a request never
// goes out with an already-expired token.
const REFRESH_BUFFER_MS = 2 * 60 * 1000;

// Never schedule a refresh in (almost) zero time, e.g. when the token is
// already expired on boot - give the rest of the bootstrapping a moment first.
const MIN_DELAY_MS = 5 * 1000;

export function getMillisecondsUntilRefresh(
  expiresAt: string,
  nowMs: number = Date.now(),
): number {
  const expiryMs = new Date(expiresAt).getTime();
  return Math.max(expiryMs - nowMs - REFRESH_BUFFER_MS, MIN_DELAY_MS);
}
