import { IJournal } from "../../../serverApi/IJournal";
import { useDeleteEntryMutation } from "../../../serverApi/reactQuery/mutations/useDeleteEntryMutation";
import { DeleteButtons } from "../../common/DeleteButtons";
import { JournalType } from "../../../serverApi/JournalType";
import React from "react";
import { Typography } from "@mui/material";
import { IEntry } from "../../../serverApi/IEntry";

export const DeleteEntry: React.FC<{
  journal: IJournal;
  entryId: string;
  entry: IEntry;
  closeDialog: () => void;
  journalName?: string;
}> = ({ journal, entryId, entry, closeDialog, journalName }) => {
  const deleteEntryMutation = useDeleteEntryMutation(
    journal?.id ?? entry?.parentId,
    entryId,
  );

  const isScrapJournal = journal?.type === JournalType.Scraps;

  return (
    <>
      <Typography>
        Are you sure you want to delete this{" "}
        <b>{isScrapJournal ? "scrap" : "entry"}</b> from journal{" "}
        <b>&quot;{journalName ?? journal?.name}&quot;</b>? You will not be able
        to recover it.
      </Typography>
      <DeleteButtons
        entityType={"entry"}
        requiresConfirmation={isScrapJournal}
        onDelete={() => deleteEntry(closeDialog)}
        onCancel={closeDialog}
      />
    </>
  );

  function deleteEntry(closeDialog: () => void) {
    deleteEntryMutation.mutate();

    closeDialog();
  }
};
