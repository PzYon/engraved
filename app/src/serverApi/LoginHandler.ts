export class LoginHandler {
  constructor(private login: () => Promise<void>) {}

  private loginInProcess = false;

  private callServerFns: {
    fn: () => Promise<unknown>;
    callback: (result: unknown) => void;
    callbackError: (error: unknown) => void;
  }[] = [];

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
        for (const callServerFn of this.callServerFns) {
          try {
            console.log("LOGIN: Calling serverFn during login");
            const result = await callServerFn.fn();

            callServerFn.callback(result);
          } catch (e) {
            callServerFn.callbackError(e);
          }
        }

        return await callServer();
      })
      .catch((e) => {
        console.log("ERROR: Error on login serverFn");

        return new Promise<T>((_, reject) => {
          reject(e);
          //return null as T;
        });
      })
      .finally(() => {
        this.loginInProcess = false;
        this.callServerFns = [];
      });
  }
}
