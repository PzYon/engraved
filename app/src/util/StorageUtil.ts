export class StorageUtil {
  constructor(private storage: Storage) {}

  setValue(key: string, value: unknown): void {
    this.storage.setItem(key, JSON.stringify(value));
  }

  getValue<T>(key: string): T {
    const item = this.storage.getItem(key);
    return item ? (JSON.parse(item) as T) : undefined;
  }
}
