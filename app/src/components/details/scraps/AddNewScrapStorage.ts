import { StorageWrapper } from "../../../util/StorageWrapper";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";

export class AddNewScrapStorage {
  private static readonly key_prefix = "engraved::add-new-scrap::journalId=";
  private static readonly storageUtil = new StorageWrapper(window.localStorage);

  // Debounce timers keyed by cache key, so concurrent editors (e.g. quick-add
  // and a journal editor active at the same time) each debounce independently
  // instead of sharing - and cancelling - a single timer.
  private static readonly timers = new Map<string, number>();

  static getForJournal(cacheKey: string): IScrapEntry | undefined {
    return AddNewScrapStorage.storageUtil.getValue<IScrapEntry>(
      AddNewScrapStorage.key_prefix + cacheKey,
    );
  }

  static setForJournal(cacheKey: string, scrapEntry: IScrapEntry) {
    AddNewScrapStorage.clearTimer(cacheKey);

    const timer = window.setTimeout(() => {
      AddNewScrapStorage.timers.delete(cacheKey);
      AddNewScrapStorage.storageUtil.setValue(
        AddNewScrapStorage.key_prefix + cacheKey,
        scrapEntry,
      );
    }, 1000);

    AddNewScrapStorage.timers.set(cacheKey, timer);
  }

  static clearForJournal(cacheKey: string) {
    AddNewScrapStorage.clearTimer(cacheKey);

    AddNewScrapStorage.storageUtil.setValue(
      AddNewScrapStorage.key_prefix + cacheKey,
      null,
    );
  }

  private static clearTimer(cacheKey: string) {
    const timer = AddNewScrapStorage.timers.get(cacheKey);
    if (timer !== undefined) {
      window.clearTimeout(timer);
      AddNewScrapStorage.timers.delete(cacheKey);
    }
  }
}
