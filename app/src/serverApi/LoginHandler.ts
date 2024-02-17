export interface ICallbackServerFunction {
  fn: () => Promise<unknown>;
  callback: (result: unknown) => void;
  callbackError: (error: unknown) => void;
}

export class LoginHandler {
  constructor(private login: () => Promise<void>) {}

  private loginInProcess = false;

  private callServerFns: ICallbackServerFunction[] = [];

  async loginAndRetry<T>(callServer: () => Promise<T>): Promise<T> {
    if (this.loginInProcess) {
      return new Promise<T>((resolve, reject) => {
        this.callServerFns.push({
          fn: callServer,
          callback: (value: unknown) => resolve(value as T),
          callbackError: (e) => reject(e),
        });
      });
    }

    this.loginInProcess = true;

    return this.login()
      .then(async () => {
        const foo = await callServer();

        for (const callServerFn of this.callServerFns) {
          try {
            const result = await callServerFn.fn();
            callServerFn.callback(result);
          } catch (e) {
            callServerFn.callbackError(e);
          }
        }

        return foo;
      })
      .catch((e) => {
        return new Promise<T>((_, reject) => reject(e));
      })
      .finally(() => {
        this.loginInProcess = false;
        this.callServerFns = [];
      });
  }
}
