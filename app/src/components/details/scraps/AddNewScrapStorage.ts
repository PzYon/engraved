import { StorageUtil } from "../../../util/StorageUtil";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";

export class AddNewScrapStorage {
  private static key_prefix = "engraved::add-new-scrap::journalId=";

  private static readonly storageUtil = new StorageUtil(window.localStorage);

  static getForJournal(cacheKey: string): IScrapEntry {
    return AddNewScrapStorage.storageUtil.getValue(
      AddNewScrapStorage.key_prefix + cacheKey,
    );
  }

  static setForJournal(cacheKey: string, scrapEntry: IScrapEntry) {
    this.storageUtil.setValue(
      AddNewScrapStorage.key_prefix + cacheKey,
      scrapEntry,
    );
  }

  static clearForJournal(cacheKey: string) {
    AddNewScrapStorage.storageUtil.setValue(
      AddNewScrapStorage.key_prefix + cacheKey,
      null,
    );
  }
}
