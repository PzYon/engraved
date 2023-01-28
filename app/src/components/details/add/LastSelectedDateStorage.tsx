import { StorageUtil } from "../../../util/StorageUtil";

export class LastSelectedDateStorage {
  private static key = "engraved::lastSelectedDate";

  private storageUtil = new StorageUtil(sessionStorage);

  getLastSelectedDate(): Date {
    const value = this.storageUtil.getValue<string>(
      LastSelectedDateStorage.key
    );

    return value ? new Date(value) : new Date();
  }

  setLastSelectedDate(date: Date) {
    this.storageUtil.setValue(LastSelectedDateStorage.key, date);
  }
}
