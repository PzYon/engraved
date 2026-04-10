import { JournalType } from "../serverApi/JournalType";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import { IJournalType } from "./IJournalType";
import { IEntriesTableColumnDefinition } from "../components/details/entriesTable/IEntriesTableColumnDefinition";
import { IJournal } from "../serverApi/IJournal";
import { IEntry } from "../serverApi/IEntry";
import React from "react";
import { Scrap } from "../components/details/scraps/Scrap";
import { IScrapEntry, ScrapType } from "../serverApi/IScrapEntry";
import { ILogBookJournal } from "../serverApi/ILogBookJournal";

export class LogBookJournalType implements IJournalType {
  type = JournalType.LogBook;

  isGroupable = false;

  getIcon() {
    return <CalendarMonth style={{ backgroundColor: "#eeeeee" }} />;
  }

  getEntry(
    journal: IJournal,
    entry: IEntry,
    hasFocus?: boolean,
    giveFocus?: () => void,
  ): React.ReactNode {
    return (
      <Scrap
        hasFocus={hasFocus}
        giveFocus={giveFocus}
        scrap={entry as IScrapEntry}
        journal={journal}
        propsRenderStyle={"all"}
      />
    );
  }

  getEntriesTableColumns(): IEntriesTableColumnDefinition[] {
    throw new Error(
      "getEntriesTableColumns is currently not supported for LogBooks.",
    );
  }

  getValue(): number {
    throw new Error("getValue is currently not supported for LogBooks.");
  }

  getYAxisLabel(): string {
    throw new Error("getYAxisLabel is currently not supported for LogBooks.");
  }

  static createBlank(journal: ILogBookJournal): IScrapEntry {
    return {
      id: null,
      dateTime: new Date().toJSON(),
      parentId: journal.id,
      notes: journal.customProps.template as string,
      title: "",
      scrapType: ScrapType.Markdown,
    };
  }
}
