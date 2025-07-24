import { JournalType } from "../serverApi/JournalType";
import TimerSharp from "@mui/icons-material/TimerSharp";
import { IJournalType } from "./IJournalType";
import { ITimerEntry } from "../serverApi/ITimerEntry";
import { DateFormat } from "../components/common/dateTypes";
import { IEntry } from "../serverApi/IEntry";
import { differenceInSeconds } from "date-fns";
import { IEntriesTableColumnDefinition } from "../components/details/entriesTable/IEntriesTableColumnDefinition";
import { getDurationAsHhMmSsFromSeconds } from "../util/getDurationAsHhMmSs";
import { FormatDuration } from "../components/common/FormatDuration";
import { IEntriesTableGroup } from "../components/details/entriesTable/IEntriesTableGroup";
import { IJournal } from "../serverApi/IJournal";
import React from "react";
import { EntryWithValue } from "../components/common/entries/EntryWithValue";
import { Typography } from "@mui/material";
import { FormatDate } from "../components/common/FormatDate";

export class TimerJournalType implements IJournalType {
  type = JournalType.Timer;

  isGroupable = true;

  getIcon() {
    return <TimerSharp style={{ backgroundColor: "#FFDFEC" }} />;
  }

  getEntry(
    journal: IJournal,
    entry: IEntry,
    hasFocus?: boolean,
  ): React.ReactNode {
    return (
      <EntryWithValue
        hasFocus={hasFocus}
        value={
          <>
            <FormatDate
              value={(entry as ITimerEntry).startDate}
              dateFormat={DateFormat.timeOnly}
            />
            {" - "}
            <FormatDate
              value={(entry as ITimerEntry).endDate}
              dateFormat={DateFormat.timeOnly}
              fallbackValue={"now"}
            />{" "}
            <Typography component={"span"} sx={{ fontWeight: "lighter" }}>
              (duration: {this.getFormatDuration(entry)})
            </Typography>
          </>
        }
        journal={journal}
        entry={entry}
      />
    );
  }

  getEntriesTableColumns(): IEntriesTableColumnDefinition[] {
    return [
      {
        key: "_start",
        getHeaderReactNode: () => "Start",
        getValueReactNode: (_: IEntriesTableGroup, entry: IEntry) => (
          <FormatDate
            value={(entry as ITimerEntry).startDate}
            dateFormat={DateFormat.timeOnly}
          />
        ),
      },
      {
        key: "_end",
        getHeaderReactNode: () => "End",
        getValueReactNode: (_: IEntriesTableGroup, entry: IEntry) => (
          <FormatDate
            value={(entry as ITimerEntry).endDate}
            dateFormat={DateFormat.timeOnly}
          />
        ),
      },
      {
        key: "_duration",
        getHeaderReactNode: () => "Duration",
        isAggregatable: true,
        getRawValue: (entry: IEntry) => this.getValue(entry),
        getValueReactNode: (_: IEntriesTableGroup, entry: IEntry) =>
          this.getFormatDuration(entry),
        getGroupReactNode: (group) => (
          <>
            {group.totalString}{" "}
            <span
              style={{ opacity: 0.5, fontSize: "smaller" }}
              title={`${group.entries.length} entries`}
            >
              {group.entries.length}x
            </span>
          </>
        ),
      },
    ];
  }

  getYAxisLabel(): string {
    return "Hours";
  }

  getValue(entry: IEntry): number {
    const m = entry as ITimerEntry;

    return differenceInSeconds(
      m.endDate ? new Date(m.endDate) : new Date(),
      new Date(m.startDate),
    );
  }

  formatTotalValue(totalValue: number): string {
    return getDurationAsHhMmSsFromSeconds(totalValue);
  }

  private getFormatDuration(entry: IEntry) {
    const timerEntry = entry as ITimerEntry;

    return (
      <FormatDuration start={timerEntry.startDate} end={timerEntry.endDate} />
    );
  }
}
