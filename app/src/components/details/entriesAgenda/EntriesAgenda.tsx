import React, { useMemo } from "react";
import { IEntry } from "../../../serverApi/IEntry";
import { JournalTypeFactory } from "../../../journalTypes/JournalTypeFactory";
import { IJournal } from "../../../serverApi/IJournal";
import { Chip, Paper, Typography } from "@mui/material";
import { HistoryToggleOff } from "@mui/icons-material";
import { paperBorderRadius } from "../../../theming/engravedTheme";
import { FormatDate } from "../../common/FormatDate";
import { getSortedEntries } from "./getSortedEntries";
import { JournalType } from "../../../serverApi/JournalType";
import { EntrySubRoutes } from "../../common/entries/EntrySubRoutes";
import { ActionIconButtonGroup } from "../../common/actions/ActionIconButtonGroup";
import { ActionFactory } from "../../common/actions/ActionFactory";

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
    <div style={{ marginTop: "24px", marginBottom: "24px" }}>
      {sortedEntries.entries.map((entry, index) => (
        <>
          <Paper key={entry.id} sx={{ p: 2, borderRadius: paperBorderRadius }}>
            <Typography sx={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex" }}>
                {journal.type === JournalType.Counter ? null : (
                  <Chip
                    label={journalType.getValue(entry).toString()}
                    sx={{
                      backgroundColor: "primary.main",
                      color: "common.white",
                      fontSize: "small",
                      height: "22px",
                      mr: 2,
                    }}
                  ></Chip>
                )}

                <FormatDate value={entry.dateTime} />

                <div style={{ flexGrow: 1 }} />

                <ActionIconButtonGroup
                  actions={[
                    ActionFactory.editEntry(entry),
                    ActionFactory.deleteEntry(entry),
                  ]}
                />
              </div>
              <div>
                <EntrySubRoutes entry={entry} />
              </div>
            </Typography>
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
    </div>
  );
};
