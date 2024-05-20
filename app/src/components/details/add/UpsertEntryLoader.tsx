import React from "react";
import { IEntry } from "../../../serverApi/IEntry";
import { useJournalQuery } from "../../../serverApi/reactQuery/queries/useJournalQuery";
import { UpsertEntry } from "./UpsertEntry";

export const UpsertEntryLoader: React.FC<{ entry: IEntry }> = ({ entry }) => {
  const journal = useJournalQuery(entry.parentId);

  if (!journal) {
    return null;
  }

  return <UpsertEntry journal={journal} entry={entry} />;
};
