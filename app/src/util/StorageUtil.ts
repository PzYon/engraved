export class StorageUtil {
  constructor(private storage: Storage) {}

  public setValue(key: string, value: unknown): void {
    this.storage.setItem(key, JSON.stringify(value));
  }

  public getValue<T>(key: string): T {
    return JSON.parse(this.storage.getItem(key)) as T;
  }
}
