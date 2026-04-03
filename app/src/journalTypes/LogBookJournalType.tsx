import { JournalType } from "../serverApi/JournalType";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import { IJournalType } from "./IJournalType";
import { IEntriesTableColumnDefinition } from "../components/details/entriesTable/IEntriesTableColumnDefinition";
import { IJournal } from "../serverApi/IJournal";
import { IEntry } from "../serverApi/IEntry";
import React from "react";
import { Scrap } from "../components/details/scraps/Scrap";
import { IScrapEntry, ScrapType } from "../serverApi/IScrapEntry";
import { AddNewScrapStorage } from "../components/details/scraps/AddNewScrapStorage";

export class LogBookJournalType implements IJournalType {
  type = JournalType.LogBook;

  isGroupable = false;

  getIcon() {
    return <CalendarMonth style={{ backgroundColor: "#f8dfff" }} />;
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
      id: null,
      dateTime: null,
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
