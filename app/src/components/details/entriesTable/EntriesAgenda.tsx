import React from "react";
import { IEntry } from "../../../serverApi/IEntry";
import { JournalTypeFactory } from "../../../journalTypes/JournalTypeFactory";
import { IJournal } from "../../../serverApi/IJournal";
import { Chip, Paper, Typography } from "@mui/material";
import { formatDistance } from "date-fns";
import { HistoryToggleOff } from "@mui/icons-material";
import { paperBorderRadius } from "../../../theming/engravedTheme";
import { FormatDate } from "../../common/FormatDate";

export const EntriesAgenda: React.FC<{
  journal: IJournal;
  entries: IEntry[];
}> = ({ journal, entries }) => {
  if (!journal) {
    return null;
  }

  const journalType = JournalTypeFactory.create(journal.type);

  return (
    <div style={{ marginTop: "24px", marginBottom: "24px" }}>
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
              <Paper
                key={entry.id}
                sx={{ p: 2, borderRadius: paperBorderRadius }}
              >
                <Typography>
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
                  <FormatDate value={entry.dateTime} />
                </Typography>
              </Paper>
              {index < entries.length - 1 ? (
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
                  {formatDistance(entries[index + 1].dateTime, entry.dateTime)}
                </Typography>
              ) : null}
            </>
          );
        })}
    </div>
  );
};
