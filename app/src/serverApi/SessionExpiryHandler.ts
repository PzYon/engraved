// Broadcasts "the session could not be renewed without the user" to the UI, so
// it can offer an explicit sign-in instead of leaving requests hanging. Follows
// the same register/unregister pattern as LoadingHandler.
export class SessionExpiryHandler {
  private _isExpired = false;

  private handlers: Record<string, (isExpired: boolean) => void> = {};

  get isExpired(): boolean {
    return this._isExpired;
  }

  registerHandler(key: string, handler: (isExpired: boolean) => void): void {
    this.handlers[key] = handler;

    // Expiry can happen before the handler is registered (or while it was
    // unmounted), so hand over the current state right away.
    handler(this._isExpired);
  }

  unregisterHandler(key: string): void {
    delete this.handlers[key];
  }

  setIsExpired(isExpired: boolean): void {
    if (this._isExpired === isExpired) {
      return;
    }

    this._isExpired = isExpired;

    for (const key in this.handlers) {
      this.handlers[key](isExpired);
    }
  }
}
