import { JournalType } from "../serverApi/JournalType";
import { PlusOneSharp } from "@mui/icons-material";
import { IJournalType } from "./IJournalType";
import { IEntriesTableColumnDefinition } from "../components/details/entriesTable/IEntriesTableColumnDefinition";
import { IJournal } from "../serverApi/IJournal";
import { IEntry } from "../serverApi/IEntry";
import React from "react";
import { ActivityWithValue } from "./ActivityWithValue";

export class CounterJournalType implements IJournalType {
  type = JournalType.Counter;

  isGroupable = true;

  getIcon() {
    return <PlusOneSharp style={{ backgroundColor: "#DFFFE3" }} />;
  }

  getActivity(journal: IJournal, entry: IEntry): React.ReactNode {
    return <ActivityWithValue value={"+1"} journal={journal} entry={entry} />;
  }

  getEntriesTableColumns(): IEntriesTableColumnDefinition[] {
    return [];
  }

  getYAxisLabel(): string {
    return "Count";
  }

  getValue(): number {
    return 1;
  }
}
