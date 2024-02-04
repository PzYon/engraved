import React, { useEffect } from "react";
import { IJournal } from "../../../serverApi/IJournal";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { useNavigate } from "react-router-dom";
import { DeleteEntry } from "./DeleteEntry";
import { useParams } from "react-router";

export const DeleteEntryLauncher: React.FC<{
  journal: IJournal;
}> = ({ journal }) => {
  const { renderDialog } = useDialogContext();
  const { entryId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    renderDialog({
      title: "Delete Entry",
      render: (closeDialog) => {
        return (
          <DeleteEntry
            journal={journal}
            entryId={entryId}
            closeDialog={closeDialog}
          />
        );
      },
      onClose: () => {
        navigate(`/journals/${journal.id}`);
      },
    });
  }, [journal.id, journal.type, navigate, renderDialog]);

  return null;
};
