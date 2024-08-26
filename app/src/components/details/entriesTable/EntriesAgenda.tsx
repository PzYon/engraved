import React from "react";
import { IEntry } from "../../../serverApi/IEntry";
import { JournalTypeFactory } from "../../../journalTypes/JournalTypeFactory";
import { IJournal } from "../../../serverApi/IJournal";
import { styled } from "@mui/material";

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
              <ItemContainer key={entry.id}>
                {JournalTypeFactory.create(journal.type).getEntry(
                  journal,
                  entry,
                  false,
                  () => {},
                )}
              </ItemContainer>
              {index < entries.length - 1 ? <div>date goes here!</div> : null}
            </>
          );
        })}
    </div>
  );
};

const ItemContainer = styled("div")`
  background-color: ${(p) => p.theme.palette.common.white};
  padding: ${(p) => p.theme.spacing(2)};
`;
