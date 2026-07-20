import { JournalType } from "../serverApi/JournalType";
import { IScrapEntry, ScrapType } from "../serverApi/IScrapEntry";
import { AddNewScrapStorage } from "../components/details/scraps/AddNewScrapStorage";
import { BaseScrapJournalType } from "./BaseScrapJournalType";

export class ScrapsJournalType extends BaseScrapJournalType {
  type = JournalType.Scraps;

  constructor() {
    super("Scraps");
  }

  static createBlank(
    isQuickAdd: boolean,
    journalId: string,
    scrapType: ScrapType,
    title?: string,
    notes?: string,
  ): IScrapEntry {
    const scrapEntry = AddNewScrapStorage.getForJournal(
      isQuickAdd ? "quick-add" : journalId,
    ) ?? {
      id: undefined,
      dateTime: new Date().toJSON(),
      title: "",
      notes: "",
      scrapType: scrapType,
    };

    // in any case we want to set the journal id
    scrapEntry.parentId = journalId;

    if (title) {
      scrapEntry.title = title;
    }

    if (notes) {
      scrapEntry.notes = notes;
    }

    return scrapEntry;
  }
}
