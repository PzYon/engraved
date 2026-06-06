import React from "react";
import { IJournal } from "../../../serverApi/IJournal";
import { Typography } from "@mui/material";
import { useDeleteJournalMutation } from "../../../serverApi/reactQuery/mutations/useDeleteJournalMutation";
import { DeleteButtons } from "../../common/DeleteButtons";
import { useItemAction } from "../../common/actions/searchParamHooks";
import { useMatchRoute, useNavigate } from "@tanstack/react-router";

export const DeleteJournalAction: React.FC<{
  journal: IJournal;
}> = ({ journal }) => {
  const { closeAction } = useItemAction();
  const matchRoute = useMatchRoute();
  const navigate = useNavigate();

  const deleteJournalMutation = useDeleteJournalMutation(
    journal.id ?? "",
    () => {
      // If we just deleted the journal whose details page we're on, that page
      // no longer exists, so go home. Otherwise (deleting from a list) just
      // close the action panel and stay put.
      const isOnDeletedJournalPage = matchRoute({
        to: "/journals/details/$journalId",
        params: { journalId: journal.id ?? "" },
        fuzzy: true,
      });

      if (isOnDeletedJournalPage) {
        navigate({ to: "/" });
      } else {
        closeAction();
      }
    },
  );

  return (
    <>
      <Typography>
        Are you sure you want to delete <b>{journal.name}</b>? You will not be
        able to recover this journal and all its entries.
      </Typography>
      <DeleteButtons
        entityType="journal"
        requiresConfirmation={true}
        onCancel={closeAction}
        onDelete={() => deleteJournalMutation.mutate()}
      />
    </>
  );
};
