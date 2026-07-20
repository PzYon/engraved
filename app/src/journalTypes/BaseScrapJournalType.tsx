import React from "react";
import { IJournalType } from "./IJournalType";
import { JournalType } from "../serverApi/JournalType";
import { IJournal } from "../serverApi/IJournal";
import { IEntry } from "../serverApi/IEntry";
import { IEntriesTableColumnDefinition } from "../components/details/entriesTable/IEntriesTableColumnDefinition";
import { getScrapEntryNode } from "./getScrapEntryNode";

export abstract class BaseScrapJournalType implements IJournalType {
  abstract type: JournalType;

  isGroupable = false;

  protected constructor(private readonly unsupportedLabel: string) {}

  getEntry(
    journal: IJournal,
    entry: IEntry,
    hasFocus?: boolean,
    giveFocus?: () => void,
  ): React.ReactNode {
    return getScrapEntryNode(journal, entry, hasFocus, giveFocus);
  }

  getEntriesTableColumns(): IEntriesTableColumnDefinition[] {
    throw new Error(
      `getEntriesTableColumns is currently not supported for ${this.unsupportedLabel}.`,
    );
  }

  getValue(): number {
    throw new Error(
      `getValue is currently not supported for ${this.unsupportedLabel}.`,
    );
  }

  getYAxisLabel(): string {
    throw new Error(
      `getYAxisLabel is currently not supported for ${this.unsupportedLabel}.`,
    );
  }
}
