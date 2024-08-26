import React from "react";
import { IEntry } from "../../../serverApi/IEntry";
import { JournalTypeFactory } from "../../../journalTypes/JournalTypeFactory";
import { IJournal } from "../../../serverApi/IJournal";
import { Paper, Typography } from "@mui/material";
import { formatDistance } from "date-fns";
import { HistoryToggleOff } from "@mui/icons-material";

export const EntriesAgenda: React.FC<{
  journal: IJournal;
  entries: IEntry[];
}> = ({ journal, entries }) => {
  if (!journal) {
    return null;
  }

  return (
    <div>
      {entries
        .sort((a, b) => {
          /* eslint-disable @typescript-eslint/no-explicit-any */
          return (
            ((new Date(a.dateTime) as any) - (new Date(b.dateTime) as any)) * -1
          );
        })
        .map((entry, index) => {
          return (
            <>
              <Paper key={entry.id} sx={{ p: 2 }}>
                {JournalTypeFactory.create(journal.type).getEntry(
                  journal,
                  entry,
                  false,
                  () => {},
                )}
              </Paper>
              {index < entries.length - 1 ? (
                <Typography
                  sx={{
                    pt: 1,
                    pb: 1,
                    pl: 1,
                    ml: 3,
                    display: "flex",
                    alignItems: "center",
                    borderLeft: "3px solid white",
                    color: "primary.main",
                  }}
                >
                  <HistoryToggleOff fontSize="small" sx={{ mr: 1 }} />
                  {formatDistance(entries[index + 1].dateTime, entry.dateTime)}
                </Typography>
              ) : null}
            </>
          );
        })}
    </div>
  );
};
