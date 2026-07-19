import { JournalType } from "../serverApi/JournalType";
import { IScrapEntry, ScrapType } from "../serverApi/IScrapEntry";
import { ILogBookJournal } from "../serverApi/ILogBookJournal";
import { dateOnlyToUtc } from "../util/utils";
import { BaseScrapJournalType } from "./BaseScrapJournalType";

export class LogBookJournalType extends BaseScrapJournalType {
  type = JournalType.LogBook;

  constructor() {
    super("LogBooks");
  }

  static createBlank(journal: ILogBookJournal): IScrapEntry {
    return {
      id: undefined,
      dateTime: dateOnlyToUtc(new Date()).toJSON(),
      parentId: journal.id,
      notes: (journal.customProps?.template ?? "") as string,
      title: "",
      scrapType: ScrapType.Markdown,
    };
  }
}
