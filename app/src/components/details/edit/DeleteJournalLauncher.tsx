import React, { useEffect } from "react";
import { IJournal } from "../../../serverApi/IJournal";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { useDeleteJournalMutation } from "../../../serverApi/reactQuery/mutations/useDeleteJournalMutation";
import { DeleteButtons } from "../../common/DeleteButtons";
import { queryKeysFactory } from "../../../serverApi/reactQuery/queryKeysFactory";
import { useAppContext } from "../../../AppContext";
import { useQueryClient } from "@tanstack/react-query";

export const DeleteJournalLauncher: React.FC<{
  journal: IJournal;
  onDeleted: () => void;
}> = ({ journal, onDeleted }) => {
  const { renderDialog } = useDialogContext();
  const { setAppAlert } = useAppContext();
  const queryClient = useQueryClient();
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
                    onDeleted();

                    setAppAlert({
                      title: `Successfully deleted journal.`,
                      type: "success",
                    });

                    await queryClient.invalidateQueries({
                      queryKey: queryKeysFactory.journal(journal.id),
                    });
                    await queryClient.invalidateQueries({
                      queryKey: queryKeysFactory.journals(),
                    });
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
