import { describe, it, expect } from "vitest";
import { getMillisecondsUntilRefresh } from "./tokenRefresh";

describe("getMillisecondsUntilRefresh", () => {
  const now = new Date("2026-06-18T12:00:00.000Z").getTime();

  it("schedules the refresh two minutes before expiry", () => {
    const expiresAt = new Date(now + 60 * 60 * 1000).toISOString(); // +60 min

    const result = getMillisecondsUntilRefresh(expiresAt, now);

    expect(result).toBe(58 * 60 * 1000);
  });

  it("clamps to the minimum delay when the token is already expired", () => {
    const expiresAt = new Date(now - 60 * 1000).toISOString(); // 1 min ago

    const result = getMillisecondsUntilRefresh(expiresAt, now);

    expect(result).toBe(5 * 1000);
  });

  it("scales the buffer down when expiry is within the buffer window", () => {
    const expiresAt = new Date(now + 30 * 1000).toISOString(); // +30s

    const result = getMillisecondsUntilRefresh(expiresAt, now);

    expect(result).toBe(15 * 1000); // half of the 30s remaining
  });

  it("scales the buffer down for a short-lived token (e.g. for manual testing)", () => {
    const expiresAt = new Date(now + 2 * 60 * 1000).toISOString(); // +2 min

    const result = getMillisecondsUntilRefresh(expiresAt, now);

    expect(result).toBe(60 * 1000); // refreshes 1 min before the 2 min expiry
  });
});
