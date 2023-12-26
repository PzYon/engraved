import { JournalType } from "../serverApi/JournalType";
import { BarChartSharp } from "@mui/icons-material";
import { IJournalType } from "./IJournalType";
import { IEntry } from "../serverApi/IEntry";
import { IEntriesTableColumnDefinition } from "../components/details/entriesTable/IEntriesTableColumnDefinition";
import { getValue } from "../components/details/chart/consolidation/consolidate";
import { IEntriesTableGroup } from "../components/details/entriesTable/IEntriesTableGroup";
import { IJournal } from "../serverApi/IJournal";
import React from "react";
import { EntryWithValue } from "../components/common/entries/EntryWithValue";
import { IGaugeEntry } from "../serverApi/IGaugeEntry";

import { AddEntryTableCell } from "../components/details/entriesTable/addEntry/AddEntryTableCell";

export class GaugeJournalType implements IJournalType {
  type = JournalType.Gauge;

  isGroupable = true;

  getIcon() {
    return <BarChartSharp style={{ backgroundColor: "#FFFFDF" }} />;
  }

  getEntry(journal: IJournal, entry: IEntry): React.ReactNode {
    return (
      <EntryWithValue
        value={(entry as IGaugeEntry).value}
        journal={journal}
        entry={entry}
      />
    );
  }

  getEntriesTableColumns(): IEntriesTableColumnDefinition[] {
    return [
      {
        key: "_value",
        width: "100px",
        getHeaderReactNode: () => "Value",
        isAggregatable: true,
        getRawValue: (entry: IEntry) => getValue(entry),
        getValueReactNode: (_: IEntriesTableGroup, entry: IEntry) =>
          getValue(entry),
        getGroupReactNode: (group) => group.totalString,
        getAddEntryReactNode: (command, updateCommand) => {
          return (
            <AddEntryTableCell
              journal={undefined}
              command={command}
              updateCommand={updateCommand}
              fieldType={"number"}
              fieldName={"value"}
            />
          );
        },
      },
    ];
  }

  getValue(entry: IEntry): number {
    return (entry as IGaugeEntry).value;
  }

  getYAxisLabel(): string {
    return "Unit [todo]";
  }
}
