import { JournalType } from "../serverApi/JournalType";
import React from "react";
import { IJournal } from "../serverApi/IJournal";
import { IEntriesTableColumnDefinition } from "../components/details/entriesTable/IEntriesTableColumnDefinition";
import { IEntry } from "../serverApi/IEntry";

// consider: introducing generics here

export interface IJournalType {
  type: JournalType;

  isGroupable?: boolean;

  getIcon(): React.ReactNode;

  getEntry(journal: IJournal, entry: IEntry): React.ReactNode;

  getEntriesTableColumns(): IEntriesTableColumnDefinition[];

  getYAxisLabel(journal: IJournal): string;

  getValueLabel?(value: number): string;

  getValue(entry: IEntry): number;

  formatTotalValue?(totalValue: number): string;
}
