import { IJournal } from "../../../serverApi/IJournal";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { EditJournalPermissions } from "./EditJournalPermissions";

export const EditJournalPermissionsLauncher: React.FC<{
  journal: IJournal;
}> = ({ journal }) => {
  const { renderDialog } = useDialogContext();

  const navigate = useNavigate();

  useEffect(() => {
    renderDialog({
      title: "Permissions",
      render: (closeDialog) => (
        <EditJournalPermissions journal={journal} onCancel={closeDialog} />
      ),
      onClose: () => {
        navigate(`/journals/${journal.id}`);
      },
    });
  }, [journal, navigate, renderDialog]);

  return null;
};
