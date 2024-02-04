import React, { useEffect } from "react";
import { IJournal } from "../../../serverApi/IJournal";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { useNavigate } from "react-router-dom";
import { DeleteEntry } from "./DeleteEntry";

export const DeleteEntryLauncher: React.FC<{
  journal: IJournal;
}> = ({ journal }) => {
  const { renderDialog } = useDialogContext();

  const navigate = useNavigate();

  useEffect(() => {
    renderDialog({
      title: "Delete Entry",
      render: (closeDialog) => {
        return <DeleteEntry journal={journal} closeDialog={closeDialog} />;
      },
      onClose: () => {
        navigate(`/journals/${journal.id}`);
      },
    });
  }, [journal.id, journal.type, navigate, renderDialog]);

  return null;
};
