import React, { useEffect } from "react";
import { IJournal } from "../../../serverApi/IJournal";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { useDeleteMeasurementMutation } from "../../../serverApi/reactQuery/mutations/useDeleteMeasurementMutation";
import { DeleteButtons } from "../../common/DeleteButtons";
import { JournalType } from "../../../serverApi/JournalType";

export const DeleteEntryLauncher: React.FC<{
  journal: IJournal;
  onDeleted?: () => void;
}> = ({ journal, onDeleted }) => {
  const { renderDialog } = useDialogContext();
  const { entryId } = useParams();

  const navigate = useNavigate();

  const deleteMeasurementMutation = useDeleteMeasurementMutation(
    journal.id,
    entryId,
  );

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
              onDelete={() => deleteMeasurement(closeDialog)}
              onCancel={closeDialog}
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

  function deleteMeasurement(closeDialog: () => void) {
    deleteMeasurementMutation.mutate();

    if (onDeleted) {
      onDeleted();
    }

    closeDialog();
  }
};
