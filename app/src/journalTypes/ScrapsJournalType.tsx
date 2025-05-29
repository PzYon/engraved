import { JournalType } from "../serverApi/JournalType";
import { DynamicFeedOutlined } from "@mui/icons-material";
import { IJournalType } from "./IJournalType";
import { IEntriesTableColumnDefinition } from "../components/details/entriesTable/IEntriesTableColumnDefinition";
import { IJournal } from "../serverApi/IJournal";
import { IEntry } from "../serverApi/IEntry";
import React from "react";
import { Scrap } from "../components/details/scraps/Scrap";
import { IScrapEntry, ScrapType } from "../serverApi/IScrapEntry";
import { AddNewScrapStorage } from "../components/details/scraps/AddNewScrapStorage";

export class ScrapsJournalType implements IJournalType {
  type = JournalType.Scraps;

  isGroupable = false;

  getIcon() {
    return <DynamicFeedOutlined style={{ backgroundColor: "#DFEEFF" }} />;
  }

  getEntry(
    journal: IJournal,
    entry: IEntry,
    hasFocus?: boolean,
  ): React.ReactNode {
    return (
      <Scrap
        hasFocus={hasFocus}
        scrap={entry as IScrapEntry}
        journal={journal}
        propsRenderStyle={"all"}
      />
    );
  }

  getEntriesTableColumns(): IEntriesTableColumnDefinition[] {
    throw new Error(
      "getEntriesTableColumns is currently not supported for Scraps.",
    );
  }

  getValue(): number {
    throw new Error("getValue is currently not supported for Scraps.");
  }

  getYAxisLabel(): string {
    throw new Error("getYAxisLabel is currently not supported for Scraps.");
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
