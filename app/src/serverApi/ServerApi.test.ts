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

  // The app can be on screen before the user is signed in, showing what it
  // has cached for them. Whatever it requests then must not go out without a
  // token - it has to wait for one.
  describe("requests before there is a session", () => {
    const fetchMock =
      vi.fn<(request: Request, config: RequestInit) => Promise<Response>>();

    function getRequestedPaths() {
      return fetchMock.mock.calls.map(([request]) =>
        new URL(request.url).pathname.replace(/^.*\/api/, ""),
      );
    }

    function nextTask() {
      return new Promise((resolve) => setTimeout(resolve, 0));
    }

    // Whether there is a session is static state, so every test needs a
    // ServerApi that has not seen one yet.
    async function importFreshServerApi() {
      vi.resetModules();
      return (await import("./ServerApi")).ServerApi;
    }

    beforeEach(() => {
      fetchMock.mockReset().mockImplementation(async (request: Request) => {
        const body = request.url.endsWith("/auth/google")
          ? { jwtToken: "the-token", user: { id: "user-id" } }
          : [];

        return new Response(JSON.stringify(body), { status: 200 });
      });

      vi.stubGlobal("fetch", fetchMock);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("should hold a request back until the user is signed in", async () => {
      const FreshServerApi = await importFreshServerApi();

      const journals = FreshServerApi.getJournals();
      await nextTask();

      expect(fetchMock).not.toHaveBeenCalled();

      await FreshServerApi.authenticate("google-credential");
      await journals;

      expect(getRequestedPaths()).toEqual(["/auth/google", "/journals"]);

      const [, journalsRequestConfig] = fetchMock.mock.calls[1];
      expect(journalsRequestConfig.headers).toMatchObject({
        Authorization: "Bearer the-token",
      });
    });

    it("should send the warm-up ping without waiting for a session", async () => {
      const FreshServerApi = await importFreshServerApi();

      await FreshServerApi.wakeMeUp();

      expect(getRequestedPaths()).toEqual(["/wake/me/up"]);
    });
  });
});
