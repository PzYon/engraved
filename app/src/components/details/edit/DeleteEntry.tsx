import { useDeleteEntryMutation } from "../../../serverApi/reactQuery/mutations/useDeleteEntryMutation";
import { DeleteButtons } from "../../common/DeleteButtons";
import React from "react";
import { Typography } from "@mui/material";
import { IEntry } from "../../../serverApi/IEntry";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";

export const DeleteEntry: React.FC<{
  entry: IEntry;
  closeDialog: () => void;
}> = ({ entry, closeDialog }) => {
  const deleteEntryMutation = useDeleteEntryMutation(entry.parentId, entry.id);

  const isScrapJournal = !!(entry as IScrapEntry).scrapType;

  return (
    <>
      <Typography>
        Are you sure you want to delete this{" "}
        <b>{isScrapJournal ? "scrap" : "entry"}</b>? You will not be able to
        recover it.
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
