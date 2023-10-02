import React, { useEffect } from "react";
import { IJournal } from "../../../serverApi/IJournal";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { useDeleteJournalMutation } from "../../../serverApi/reactQuery/mutations/useDeleteJournalMutation";
import { DeleteButtons } from "../../common/DeleteButtons";

export const DeleteJournalLauncher: React.FC<{
  journal: IJournal;
  onDeleted: () => void;
}> = ({ journal, onDeleted }) => {
  const { renderDialog } = useDialogContext();

  const navigate = useNavigate();

  const deleteJournalMutation = useDeleteJournalMutation(journal.id);

  useEffect(() => {
    renderDialog({
      title: "Delete Journal",
      render: (closeDialog) => {
        return (
          <>
            <Typography>
              Are you sure you want to delete <b>&apos;{journal.name}&apos;</b>?
              You will not be able to recover this journal and all its entries.
            </Typography>
            <DeleteButtons
              entityType="journal"
              requiresConfirmation={true}
              onCancel={closeDialog}
              onDelete={() =>
                deleteJournalMutation.mutate({
                  onSuccess: async () => {
                    closeDialog();
                    await onDeleted();
                  },
                })
              }
            />
          </>
        );
      },
      onClose: () => {
        navigate(`/journals/${journal.id}`);
      },
    });
  }, []);

  return null;
};
