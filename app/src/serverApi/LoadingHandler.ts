export class LoadingHandler {
  delayMs = 700;

  private _loadingCounter = 0;
  private _currentState: "first" | "last" | "other";

  private handlers: Record<string, (isLoading: boolean) => void> = {};

  oneMore() {
    this.updateCounter("oneMore");
  }

  oneLess() {
    this.updateCounter("oneLess");
  }

  registerHandler(key: string, handler: (isLoading: boolean) => void): void {
    this.handlers[key] = handler;
  }

  unregisterHandler(key: string): void {
    delete this.handlers[key];
  }

  private callHandlers(loading: boolean) {
    for (const key in this.handlers) {
      this.handlers[key](loading);
    }
  }

  private updateCounter(direction: "oneMore" | "oneLess") {
    const diff = direction == "oneMore" ? 1 : -1;
    this._loadingCounter = this._loadingCounter + diff;

    this._currentState = this.getCurrentState(direction);

    if (this._currentState !== "first") {
      return;
    }

    this.callHandlers(true);

    const interval = window.setInterval(() => {
      if (this._currentState !== "last") {
        return;
      }

      window.clearInterval(interval);
      this.callHandlers(false);
    }, this.delayMs);
  }

  private getCurrentState(direction: "oneMore" | "oneLess") {
    if (this._loadingCounter === 1 && direction === "oneMore") {
      return "first";
    }

    if (this._loadingCounter === 0 && direction === "oneLess") {
      return "last";
    }

    return "other";
  }
}
