import React, { useMemo } from "react";
import { IEntry } from "../../../serverApi/IEntry";
import { JournalTypeFactory } from "../../../journalTypes/JournalTypeFactory";
import { IJournal } from "../../../serverApi/IJournal";
import { Chip, Paper, Typography } from "@mui/material";
import HistoryToggleOff from "@mui/icons-material/HistoryToggleOff";
import { paperBorderRadius } from "../../../theming/engravedTheme";
import { FormatDate } from "../../common/FormatDate";
import { getSortedEntries } from "./getSortedEntries";
import { JournalType } from "../../../serverApi/JournalType";
import { EntrySubRoutes } from "../../common/entries/EntrySubRoutes";
import { ActionIconButtonGroup } from "../../common/actions/ActionIconButtonGroup";
import { ActionFactory } from "../../common/actions/ActionFactory";
import { getDurationAsHhMmSsFromSeconds } from "../../../util/getDurationAsHhMmSs";
import { Streak } from "../entriesTable/Streak";

export const EntriesAgenda: React.FC<{
  journal: IJournal;
  entries: IEntry[];
}> = ({ journal, entries }) => {
  const sortedEntries = useMemo(() => getSortedEntries(entries), [entries]);

  if (!journal) {
    return null;
  }

  const journalType = JournalTypeFactory.create(journal.type);

  return (
    <Paper sx={{ mt: 3, mb: 3, backgroundColor: "transparent" }}>
      <Streak
        key={"streak-top"}
        journal={journal}
        entries={sortedEntries.entries}
        withBackground={true}
      />

      {sortedEntries.entries.map((entry, index) => (
        <>
          <Paper key={entry.id} sx={{ p: 2, borderRadius: paperBorderRadius }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                {journal.type === JournalType.Counter ? null : (
                  <Chip
                    label={getValueLabel(entry)}
                    sx={{
                      backgroundColor: "primary.main",
                      color: "common.white",
                      fontSize: "small",
                      height: "22px",
                      mr: 2,
                    }}
                  ></Chip>
                )}

                <Typography style={{ flexGrow: 1 }}>
                  <FormatDate value={entry.dateTime} />
                  {entry.notes ? (
                    <span>
                      <span style={{ padding: "0 8px" }}>&#183;</span>
                      {entry.notes}
                    </span>
                  ) : null}
                </Typography>

                <ActionIconButtonGroup
                  actions={[
                    ActionFactory.editEntry(entry),
                    ActionFactory.deleteEntry(entry),
                  ]}
                />
              </div>
              <EntrySubRoutes entry={entry} />
            </div>
          </Paper>
          {sortedEntries.gaps[index] ? (
            <Typography
              sx={{
                pt: 1,
                pb: 1,
                pl: 1,
                ml: 3,
                fontSize: "smaller",
                display: "flex",
                alignItems: "center",
                borderLeft: "3px solid white",
                color: "primary.main",
              }}
            >
              <HistoryToggleOff fontSize="small" sx={{ mr: 1 }} />
              {sortedEntries.gaps[index].label}
            </Typography>
          ) : null}
        </>
      ))}
      <Streak
        key={"streak-bottom"}
        journal={journal}
        entries={sortedEntries.entries}
        withBackground={true}
      />
    </Paper>
  );

  function getValueLabel(entry: IEntry) {
    if (journal.type === JournalType.Timer) {
      return getDurationAsHhMmSsFromSeconds(journalType.getValue(entry));
    }

    return journalType.getValue(entry).toString();
  }
};
