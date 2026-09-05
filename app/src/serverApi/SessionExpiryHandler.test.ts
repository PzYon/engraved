import { SessionExpiryHandler } from "./SessionExpiryHandler";

describe("SessionExpiryHandler", () => {
  it("should notify registered handlers about state changes", () => {
    const handler = new SessionExpiryHandler();

    const states: boolean[] = [];
    handler.registerHandler("test", (isExpired) => states.push(isExpired));

    handler.setIsExpired(true);
    handler.setIsExpired(false);

    expect(states).toEqual([false, true, false]);
  });

  it("should not notify handlers when the state does not change", () => {
    const handler = new SessionExpiryHandler();
    handler.setIsExpired(true);

    const states: boolean[] = [];
    handler.registerHandler("test", (isExpired) => states.push(isExpired));

    handler.setIsExpired(true);

    expect(states).toEqual([true]);
  });

  it("should give newly registered handlers the current state", () => {
    const handler = new SessionExpiryHandler();
    handler.setIsExpired(true);

    let isExpired: boolean | undefined;
    handler.registerHandler("test", (x) => (isExpired = x));

    expect(isExpired).toBe(true);
  });

  it("should not notify handlers after they have been unregistered", () => {
    const handler = new SessionExpiryHandler();

    const states: boolean[] = [];
    handler.registerHandler("test", (isExpired) => states.push(isExpired));
    handler.unregisterHandler("test");

    handler.setIsExpired(true);

    expect(states).toEqual([false]);
  });
});
