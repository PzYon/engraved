import React, { useEffect } from "react";
import { IJournal } from "../../../serverApi/IJournal";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { renderDeleteEntry } from "./renderDeleteEntry";

export const DeleteEntryLauncher: React.FC<{
  journal: IJournal;
}> = ({ journal }) => {
  const { entryId } = useParams();
  const { renderDialog } = useDialogContext();
  const navigate = useNavigate();

  useEffect(() => {
    renderDeleteEntry(journal, entryId, null, renderDialog, navigate);
  }, [journal, entryId, navigate, renderDialog]);

  return null;
};
