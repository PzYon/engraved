import React, { useEffect } from "react";
import { IJournal } from "../../../serverApi/IJournal";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { useDeleteEntryMutation } from "../../../serverApi/reactQuery/mutations/useDeleteEntryMutation";
import { DeleteButtons } from "../../common/DeleteButtons";
import { JournalType } from "../../../serverApi/JournalType";

export const DeleteEntryLauncher: React.FC<{
  journal: IJournal;
}> = ({ journal }) => {
  const { renderDialog } = useDialogContext();
  const { entryId } = useParams();

  const navigate = useNavigate();

  const deleteEntryMutation = useDeleteEntryMutation(journal.id, entryId);

  useEffect(() => {
    renderDialog({
      title: "Delete Entry",
      render: (closeDialog) => {
        return (
          <>
            <Typography>
              Are you sure you want to delete this <b>scrap</b>? You will not be
              able to recover it.
            </Typography>
            <DeleteButtons
              entityType={"entry"}
              requiresConfirmation={journal.type === JournalType.Scraps}
              onDelete={() => deleteEntry(closeDialog)}
              onCancel={closeDialog}
            />
          </>
        );
      },
      onClose: () => {
        navigate(`/journals/${journal.id}`);
      },
    });

    function deleteEntry(closeDialog: () => void) {
      deleteEntryMutation.mutate();

      closeDialog();
    }
  }, [deleteEntryMutation, journal.id, journal.type, navigate, renderDialog]);

  return null;
};
