import { JournalType } from "../serverApi/JournalType";
import { BarChartSharp } from "@mui/icons-material";
import { IJournalType } from "./IJournalType";
import { IEntry } from "../serverApi/IEntry";
import { IEntriesTableColumnDefinition } from "../components/details/entriesTable/IEntriesTableColumnDefinition";
import { getValue } from "../components/details/chart/consolidation/consolidate";
import { IEntriesTableGroup } from "../components/details/entriesTable/IEntriesTableGroup";
import { IJournal } from "../serverApi/IJournal";
import React from "react";
import { ActivityWithValue } from "./ActivityWithValue";
import { IGaugeEntry } from "../serverApi/IGaugeEntry";

export class GaugeJournalType implements IJournalType {
  type = JournalType.Gauge;

  isGroupable = true;

  getIcon() {
    return <BarChartSharp style={{ backgroundColor: "#FFFFDF" }} />;
  }

  getActivity(metric: IJournal, measurement: IEntry): React.ReactNode {
    return (
      <ActivityWithValue
        value={(measurement as IGaugeEntry).value}
        journal={metric}
        entry={measurement}
      />
    );
  }

  getEntriesTableColumns(): IEntriesTableColumnDefinition[] {
    return [
      {
        key: "_value",
        getHeaderReactNode: () => "Value",
        isSummable: true,
        getRawValue: (measurement: IEntry) => getValue(measurement),
        getValueReactNode: (_: IEntriesTableGroup, measurement: IEntry) =>
          getValue(measurement),
        getGroupReactNode: (group) => group.totalString,
      },
    ];
  }

  getValue(measurement: IEntry): number {
    return (measurement as IGaugeEntry).value;
  }

  getYAxisLabel(): string {
    return "Unit [todo]";
  }
}
