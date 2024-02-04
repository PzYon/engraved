import { IJournal } from "../../../serverApi/IJournal";
import { useDeleteEntryMutation } from "../../../serverApi/reactQuery/mutations/useDeleteEntryMutation";
import { DeleteButtons } from "../../common/DeleteButtons";
import { JournalType } from "../../../serverApi/JournalType";
import React from "react";
import { Typography } from "@mui/material";

export const DeleteEntry: React.FC<{
  journal: IJournal;
  entryId: string;
  closeDialog: () => void;
}> = ({ journal, entryId, closeDialog }) => {
  const deleteEntryMutation = useDeleteEntryMutation(journal.id, entryId);

  debugger;

  return (
    <>
      <Typography>
        Are you sure you want to delete this <b>scrap</b>? You will not be able
        to recover it.
      </Typography>
      <DeleteButtons
        entityType={"entry"}
        requiresConfirmation={journal.type === JournalType.Scraps}
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
