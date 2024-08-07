import React from "react";
import { IJournal } from "../../../serverApi/IJournal";
import { Typography } from "@mui/material";
import { useDeleteJournalMutation } from "../../../serverApi/reactQuery/mutations/useDeleteJournalMutation";
import { DeleteButtons } from "../../common/DeleteButtons";
import { queryKeysFactory } from "../../../serverApi/reactQuery/queryKeysFactory";
import { useAppContext } from "../../../AppContext";
import { useQueryClient } from "@tanstack/react-query";
import { useItemAction } from "../../common/actions/searchParamHooks";

export const DeleteJournalAction: React.FC<{
  journal: IJournal;
}> = ({ journal }) => {
  const { setAppAlert } = useAppContext();
  const queryClient = useQueryClient();
  const { closeAction } = useItemAction();

  const deleteJournalMutation = useDeleteJournalMutation(journal.id);

  return (
    <>
      <Typography>
        Are you sure you want to delete <b>&apos;{journal.name}&apos;</b>? You
        will not be able to recover this journal and all its entries.
      </Typography>
      <DeleteButtons
        entityType="journal"
        requiresConfirmation={true}
        onCancel={closeAction}
        onDelete={() =>
          deleteJournalMutation.mutate({
            onSuccess: async () => {
              closeAction();

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
};
