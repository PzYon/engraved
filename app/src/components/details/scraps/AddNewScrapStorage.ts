import { StorageWrapper } from "../../../util/StorageWrapper";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";

export class AddNewScrapStorage {
  private static readonly key_prefix = "engraved::add-new-scrap::journalId=";
  private static readonly storageUtil = new StorageWrapper(window.localStorage);

  private static timer: number;

  static getForJournal(cacheKey: string): IScrapEntry {
    return AddNewScrapStorage.storageUtil.getValue(
      AddNewScrapStorage.key_prefix + cacheKey,
    );
  }

  static setForJournal(cacheKey: string, scrapEntry: IScrapEntry) {
    window.clearTimeout(AddNewScrapStorage.timer);

    AddNewScrapStorage.timer = window.setTimeout(() => {
      this.storageUtil.setValue(
        AddNewScrapStorage.key_prefix + cacheKey,
        scrapEntry,
      );
    }, 500);
  }

  static clearForJournal(cacheKey: string) {
    AddNewScrapStorage.storageUtil.setValue(
      AddNewScrapStorage.key_prefix + cacheKey,
      null,
    );
  }
}
