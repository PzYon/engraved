import { StorageUtil } from "../../../util/StorageUtil";

export class QuickNotificationStorage {
  private static key = "engraved::quick-notification-journal-id";

  private storageUtil = new StorageUtil(localStorage);

  getJournalId(): string {
    return this.storageUtil.getValue(QuickNotificationStorage.key);
  }

  setJournalId(journalId: string): void {
    this.storageUtil.setValue(QuickNotificationStorage.key, journalId);
  }
}
