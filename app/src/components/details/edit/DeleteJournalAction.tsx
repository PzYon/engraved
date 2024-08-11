import React from "react";
import { IJournal } from "../../../serverApi/IJournal";
import { Typography } from "@mui/material";
import { useDeleteJournalMutation } from "../../../serverApi/reactQuery/mutations/useDeleteJournalMutation";
import { DeleteButtons } from "../../common/DeleteButtons";
import { useItemAction } from "../../common/actions/searchParamHooks";
import { useLocation, useNavigate } from "react-router-dom";

export const DeleteJournalAction: React.FC<{
  journal: IJournal;
}> = ({ journal }) => {
  const { closeAction } = useItemAction();
  const loc = useLocation();
  const navigate = useNavigate();

  const deleteJournalMutation = useDeleteJournalMutation(journal.id, () => {
    if (loc.pathname.startsWith(`/journals/details/${journal.id}`)) {
      navigate("/");
    } else {
      closeAction();
    }
  });

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
        onDelete={() => deleteJournalMutation.mutate()}
      />
    </>
  );
};
