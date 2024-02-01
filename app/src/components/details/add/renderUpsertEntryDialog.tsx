import { UpsertEntry } from "./UpsertEntry";
import { IDialogProps } from "../../layout/dialogs/DialogContext";
import { IJournal } from "../../../serverApi/IJournal";
import React from "react";
import { useActiveEntryQuery } from "../../../serverApi/reactQuery/queries/useActiveEntryQuery";
import { JournalType } from "../../../serverApi/JournalType";
import { renderAddScrapDialog } from "./renderAddScrapDialog";

export const renderUpsertEntryDialog = (
  journal: IJournal,
  renderDialog: (dialogProps: IDialogProps) => void,
): void => {
  if (journal.type === JournalType.Scraps) {
    renderAddScrapDialog(journal.id, renderDialog, "Add scrap");
    return;
  }

  renderDialog({
    title: `Add entry to '${journal.name}'`,
    render: (closeDialog) => (
      <UpsertEntryWrapper
        journal={journal}
        onSaved={() => renderDialog(null)}
        onCancel={closeDialog}
      />
    ),
  });
};

const UpsertEntryWrapper: React.FC<{
  journal: IJournal;
  onSaved: () => void;
  onCancel: () => void;
}> = ({ journal, onSaved, onCancel }) => {
  const entry = useActiveEntryQuery(journal);
  if (entry === undefined) {
    return null;
  }

  return (
    <UpsertEntry
      journal={journal}
      entry={entry}
      onSaved={onSaved}
      onCancel={onCancel}
    />
  );
};
