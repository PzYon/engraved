export interface ICallbackServerFunction {
  fn: () => Promise<unknown>;
  callback: (result: unknown) => void;
  callbackError: (error: Error) => void;
}

export class LoginHandler {
  private loginInProcess = false;
  private callServerFns: ICallbackServerFunction[] = [];

  constructor(private login: () => Promise<void>) {}

  async loginAndRetry<T>(callServer: () => Promise<T>): Promise<T> {
    if (this.loginInProcess) {
      return new Promise<T>((resolve, reject) => {
        this.addCallbackFn(callServer, resolve, reject);
      });
    }

    this.loginInProcess = true;

    return this.login()
      .then(async () => {
        const result = await callServer();

        for (const callServerFn of this.callServerFns) {
          try {
            const result = await callServerFn.fn();
            callServerFn.callback(result);
          } catch (e) {
            callServerFn.callbackError(e as Error);
          }
        }

        return result;
      })
      .finally(() => {
        this.loginInProcess = false;
        this.callServerFns = [];
      });
  }

  private addCallbackFn<T>(
    callServer: () => Promise<T>,
    resolve: (value: T) => void,
    reject: (reason?: Error) => void,
  ) {
    this.callServerFns.push({
      fn: callServer,
      callback: (value: unknown) => resolve(value as T),
      callbackError: (e) => reject(e),
    });
  }
}
