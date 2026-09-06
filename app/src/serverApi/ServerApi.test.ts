import { ServerApi } from "./ServerApi";

describe("ServerApi", () => {
  describe("tryToLoginAgain", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
      ServerApi.sessionExpiryHandler.setIsExpired(false);
    });

    // Google's One Tap prompt can silently decide not to show, in which case
    // no callback ever fires. Before the timeout the whole app just hung
    // (issue #3009); now the UI is told to offer an explicit sign-in instead.
    it("should report an expired session when the google prompt never completes", () => {
      ServerApi.setGooglePrompt(() => {
        // silently does nothing, like a suppressed One Tap prompt
      });

      void ServerApi.tryToLoginAgain();

      expect(ServerApi.sessionExpiryHandler.isExpired).toBe(false);

      vi.advanceTimersByTime(ServerApi.loginPromptTimeoutMs);

      expect(ServerApi.sessionExpiryHandler.isExpired).toBe(true);
    });

    it("should not report an expired session before the timeout has elapsed", () => {
      ServerApi.setGooglePrompt(() => {
        // silently does nothing, like a suppressed One Tap prompt
      });

      void ServerApi.tryToLoginAgain();

      vi.advanceTimersByTime(ServerApi.loginPromptTimeoutMs - 1);

      expect(ServerApi.sessionExpiryHandler.isExpired).toBe(false);
    });
  });
});
