import { IJournal } from "../../../serverApi/IJournal";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { EditSchedule } from "./EditSchedule";

export const EditScheduleLauncher: React.FC<{
  journal: IJournal;
}> = ({ journal }) => {
  const { renderDialog } = useDialogContext();

  const navigate = useNavigate();

  useEffect(() => {
    renderDialog({
      title: "Schedule",
      render: (closeDialog) => (
        <EditSchedule journal={journal} onCancel={closeDialog} />
      ),
      onClose: () => {
        navigate(`/journals/${journal.id}`);
      },
    });
  }, [journal, navigate, renderDialog]);

  return null;
};
