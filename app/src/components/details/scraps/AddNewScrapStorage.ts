import { StorageUtil } from "../../../util/StorageUtil";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";

export class AddNewScrapStorage {
  private static key_prefix = "engraved::add-new-scrap::journalId=";

  private static readonly storageUtil = new StorageUtil(window.localStorage);

  static getForJournal(journalId: string): IScrapEntry {
    return AddNewScrapStorage.storageUtil.getValue(
      AddNewScrapStorage.key_prefix + journalId,
    );
  }

  static setForJournal(scrapEntry: IScrapEntry) {
    if (scrapEntry?.parentId) {
      throw new Error("Journal ID is required for cache.");
    }

    this.storageUtil.setValue(
      AddNewScrapStorage.key_prefix + scrapEntry.parentId,
      scrapEntry,
    );
  }

  static clearForJournal(journalId: string) {
    AddNewScrapStorage.storageUtil.setValue(
      AddNewScrapStorage.key_prefix + journalId,
      null,
    );
  }
}
