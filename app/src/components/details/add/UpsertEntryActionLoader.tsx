import React from "react";
import { IEntry } from "../../../serverApi/IEntry";
import { useJournalQuery } from "../../../serverApi/reactQuery/queries/useJournalQuery";
import { UpsertEntryAction } from "./UpsertEntryAction";

export const UpsertEntryActionLoader: React.FC<{ entry: IEntry }> = ({
  entry,
}) => {
  const journal = useJournalQuery(entry.parentId);

  if (!journal) {
    return null;
  }

  return <UpsertEntryAction journal={journal} entry={entry} />;
};
