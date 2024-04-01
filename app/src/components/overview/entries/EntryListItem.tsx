import React from "react";
import { IEntry } from "../../../serverApi/IEntry";
import { IJournal } from "../../../serverApi/IJournal";
import { PageSection } from "../../layout/pages/PageSection";
import { JournalTypeFactory } from "../../../journalTypes/JournalTypeFactory";

export const EntryListItem: React.FC<{
  entry: IEntry;
  journals: IJournal[];
  hasFocus?: boolean;
  index?: number;
}> = ({ entry, journals, hasFocus, index }) => {
  return (
    <PageSection testId={`entries-list-item-${index}`}>
      {renderEntry(entry, hasFocus)}
    </PageSection>
  );

  function renderEntry(entry: IEntry, hasFocus: boolean) {
    const journal = journals.find((j) => j.id === entry.parentId);

    return JournalTypeFactory.create(journal.type).getEntry(
      journal,
      entry,
      hasFocus,
    );
  }
};
