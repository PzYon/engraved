import React, { useEffect } from "react";
import { IJournal } from "../../../serverApi/IJournal";
import {
  IDialogProps,
  useDialogContext,
} from "../../layout/dialogs/DialogContext";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { DeleteEntry } from "./DeleteEntry";
import { useParams } from "react-router";

export const renderDeleteEntry = (
  journal: IJournal,
  entryId: string,
  renderDialog: (dialogProps: IDialogProps) => void,
  navigate: NavigateFunction,
): void => {
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
};

export const DeleteEntryLauncher: React.FC<{
  journal: IJournal;
}> = ({ journal }) => {
  const { entryId } = useParams();
  const { renderDialog } = useDialogContext();
  const navigate = useNavigate();

  useEffect(() => {
    renderDeleteEntry(journal, entryId, renderDialog, navigate);
  }, [journal, entryId, navigate, renderDialog]);

  return null;
};
