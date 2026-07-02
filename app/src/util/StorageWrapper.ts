export class StorageWrapper {
  constructor(private storage: Storage) {}

  setValue(key: string, value: unknown): void {
    if (value === null || value === undefined) {
      this.storage.removeItem(key);
      return;
    }

    this.storage.setItem(key, JSON.stringify(value));
  }

  getValue<T>(key: string): T | undefined {
    const item = this.storage.getItem(key);
    if (!item) {
      return undefined;
    }

    try {
      return JSON.parse(item) as T;
    } catch {
      // A corrupted / non-JSON value would otherwise throw here - and this runs
      // during ServerApi's static initialization. Drop the bad entry and behave
      // as if it were absent.
      this.storage.removeItem(key);
      return undefined;
    }
  }
}
