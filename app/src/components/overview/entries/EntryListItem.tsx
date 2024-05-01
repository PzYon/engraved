import React from "react";
import { IEntry } from "../../../serverApi/IEntry";
import { IJournal } from "../../../serverApi/IJournal";
import { JournalTypeFactory } from "../../../journalTypes/JournalTypeFactory";

export const EntryListItem: React.FC<{
  entry: IEntry;
  journals: IJournal[];
  hasFocus?: boolean;
  index?: number;
}> = ({ entry, journals, hasFocus, index }) => {
  return (
    <div data-testid={`entries-list-item-${index}`}>
      {renderEntry(entry, hasFocus)}
    </div>
  );

  function renderEntry(entry: IEntry, hasFocus: boolean) {
    const journal = journals.find((j) => j.id === entry.parentId);

    if (!journal) {
      return null;
    }

    return JournalTypeFactory.create(journal.type).getEntry(
      journal,
      entry,
      hasFocus,
    );
  }
};
