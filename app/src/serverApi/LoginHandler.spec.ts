import { LoginHandler } from "./LoginHandler";

function getPromise<T>(delayMs: number, returnValue: T) {
  return new Promise<T>((resolve) => {
    setTimeout(() => {
      console.log("resolving: " + returnValue);
      resolve(returnValue);
    }, delayMs);
  });
}

describe("LoginHandler", () => {
  describe("addItem", () => {
    test("xxx", (done) => {
      let loginCount = 0;

      const login = () => {
        loginCount++;
        return getPromise(1000, undefined);
      };

      const results: string[] = [];

      const loginHandler = new LoginHandler(login);

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
  });
});
