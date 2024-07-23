export class StorageWrapper {
  constructor(private storage: Storage) {}

  setValue(key: string, value: unknown): void {
    if (value === null || value === undefined) {
      this.storage.removeItem(key);
      return;
    }

    this.storage.setItem(key, JSON.stringify(value));
  }

  getValue<T>(key: string): T {
    const item = this.storage.getItem(key);
    return item ? (JSON.parse(item) as T) : undefined;
  }
}
