import { StorageUtil } from "../../../util/StorageUtil";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";

export class AddNewScrapStorage {
  private static key_prefix = "engraved::add-new-scrap::journalId=";

  private storageUtil = new StorageUtil(localStorage);

  getForJournal(journalId: string): IScrapEntry {
    return this.storageUtil.getValue(AddNewScrapStorage.key_prefix + journalId);
  }

  setForJournal(scrapEntry: IScrapEntry) {
    this.storageUtil.setValue(
      AddNewScrapStorage.key_prefix + scrapEntry.parentId,
      scrapEntry,
    );
  }

  clearForJournal(journalId: string) {
    this.storageUtil.setValue(AddNewScrapStorage.key_prefix + journalId, null);
  }
}
