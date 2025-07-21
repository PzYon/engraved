import { LoginHandler } from "./LoginHandler";

describe("LoginHandler", () => {
  describe("loginAndRetry", () => {
    it("should execute all methods once logged in", async () => {
      let loginCount = 0;
      const results: string[] = [];

      const loginHandler = new LoginHandler(() => {
        loginCount++;
        return delayAndReturn(1000, undefined);
      });

      loginHandler.loginAndRetry(() =>
        delayAndReturn(100, "first").then((x) => results.push(x)),
      );

      loginHandler.loginAndRetry(() =>
        delayAndReturn(200, "second").then((x) => results.push(x)),
      );

      loginHandler.loginAndRetry(() =>
        delayAndReturn(300, "third").then((x) => results.push(x)),
      );

      await delayAndReturn(2000);

      expect(loginCount).toBe(1);

      expect(results.length).toBe(3);
      expect(results[0]).toBe("first");
      expect(results[1]).toBe("second");
      expect(results[2]).toBe("third");
    });

    it("should clear 'functions to call' after login", async () => {
      let loginCount = 0;
      const results: string[] = [];

      const loginHandler = new LoginHandler(() => {
        loginCount++;
        return delayAndReturn(500, undefined);
      });

      loginHandler.loginAndRetry(() =>
        delayAndReturn(100, "first").then((x) => results.push(x)),
      );

      await delayAndReturn(1000);

      expect(loginCount).toBe(1);
      expect(results.length).toBe(1);
      expect(results[0]).toBe("first");

      loginHandler.loginAndRetry(() =>
        delayAndReturn(100, "second").then((x) => results.push(x)),
      );

      await delayAndReturn(1000);

      expect(loginCount).toBe(2);
      expect(results.length).toBe(2);
      expect(results[1]).toBe("second");
    });
  });
});

function delayAndReturn<T>(delayMs: number, returnValue?: T) {
  return new Promise<T>((resolve) => {
    setTimeout(() => {
      resolve(returnValue);
    }, delayMs);
  });
}
