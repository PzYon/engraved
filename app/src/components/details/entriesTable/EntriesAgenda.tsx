import React from "react";
import { IEntry } from "../../../serverApi/IEntry";
import { JournalTypeFactory } from "../../../journalTypes/JournalTypeFactory";
import { IJournal } from "../../../serverApi/IJournal";

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
          return (new Date(a.dateTime) as any) - (new Date(b.dateTime) as any);
        })
        .map((e) => {
          return (
            <div key={e.id}>
              {JournalTypeFactory.create(journal.type).getEntry(
                journal,
                e,
                false,
                () => {},
              )}
            </div>
          );
        })}
    </div>
  );
};
