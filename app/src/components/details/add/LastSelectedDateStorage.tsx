import { StorageUtil } from "../../../util/StorageUtil";

export class LastSelectedDateStorage {
  private static key = "engraved::lastSelectedDate";

  private _storageUtil: StorageUtil = null;

  // lazy load in order to avoid "sessionStorage is not defined" in jest tests
  private get storageUtil() {
    if (!this._storageUtil) {
      this._storageUtil = new StorageUtil(sessionStorage);
    }
    return this._storageUtil;
  }

  getLastSelectedDate(): Date {
    const value = this.storageUtil.getValue<string>(
      LastSelectedDateStorage.key,
    );

    return value ? new Date(value) : new Date();
  }

  setLastSelectedDate(date: Date) {
    this.storageUtil.setValue(LastSelectedDateStorage.key, date);
  }
}
