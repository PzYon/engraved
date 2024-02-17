import { LoginHandler } from "./LoginHandler";

function getPromise<T>(delayMs: number, returnValue: T) {
  return new Promise<T>((resolve) => {
    setTimeout(() => {
      resolve(returnValue);
    }, delayMs);
  });
}

describe("LoginHandler", () => {
  describe("loginAndRetry", () => {
    it("should execute all methods once logged in", (done) => {
      let loginCount = 0;
      const results: string[] = [];

      const loginHandler = new LoginHandler(() => {
        loginCount++;
        return getPromise(1000, undefined);
      });

      loginHandler.loginAndRetry(() =>
        getPromise(100, "first").then((x) => results.push(x)),
      );

      loginHandler.loginAndRetry(() =>
        getPromise(200, "second").then((x) => results.push(x)),
      );

      loginHandler.loginAndRetry(() =>
        getPromise(300, "third").then((x) => results.push(x)),
      );

      setTimeout(() => {
        expect(loginCount).toBe(1);

        expect(results.length).toBe(3);
        expect(results[0]).toBe("first");
        expect(results[1]).toBe("second");
        expect(results[2]).toBe("third");

        done();
      }, 2000);
    });

    it("should clear 'functions to call' after login", (done) => {
      let loginCount = 0;
      const results: string[] = [];

      const loginHandler = new LoginHandler(() => {
        loginCount++;
        return getPromise(500, undefined);
      });

      loginHandler.loginAndRetry(() =>
        getPromise(100, "first").then((x) => results.push(x)),
      );

      setTimeout(() => {
        expect(loginCount).toBe(1);
        expect(results.length).toBe(1);
        expect(results[0]).toBe("first");

        loginHandler.loginAndRetry(() =>
          getPromise(100, "second").then((x) => results.push(x)),
        );

        setTimeout(() => {
          expect(loginCount).toBe(2);
          expect(results.length).toBe(2);
          expect(results[1]).toBe("second");
          done();
        }, 1000);
      }, 1000);
    });
  });
});
