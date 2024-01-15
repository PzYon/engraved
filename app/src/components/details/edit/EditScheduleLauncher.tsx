import { IJournal } from "../../../serverApi/IJournal";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { EditSchedule } from "./EditSchedule";

export const EditScheduleLauncher: React.FC<{
  journal: IJournal;
}> = ({ journal }) => {
  const { renderDialog } = useDialogContext();
  const { entryId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    renderDialog({
      title: "Schedule for " + entryId ? "entry" : "journal",
      render: (closeDialog) => (
        <EditSchedule
          journal={journal}
          entryId={entryId}
          onCancel={closeDialog}
        />
      ),
      onClose: () => {
        navigate(`/journals/${journal.id}`);
      },
    });
  }, [journal, entryId, navigate, renderDialog]);

  return null;
};
