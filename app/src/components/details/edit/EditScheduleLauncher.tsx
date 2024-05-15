import { IJournal } from "../../../serverApi/IJournal";
import {
  IDialogProps,
  useDialogContext,
} from "../../layout/dialogs/DialogContext";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { EditSchedule } from "./EditSchedule";
import { useJournalContext } from "../JournalContext";
import { useAppContext } from "../../../AppContext";

export const renderEditSchedule = (
  journalId: string,
  renderDialog: (dialogProps: IDialogProps) => void,
  entryId: string,
  journal: IJournal,
  navigate?: NavigateFunction,
) => {
  renderDialog({
    title: "Schedule for " + (entryId ? "entry" : "journal"),
    render: (closeDialog) => (
      <EditSchedule
        journal={journal}
        journalId={journalId}
        entryId={entryId}
        onCancel={closeDialog}
      />
    ),
    onClose: () => {
      navigate?.(`/journals/${journalId}`);
    },
  });
};

export const EditScheduleLauncher: React.FC<{
  journal: IJournal;
}> = ({ journal }) => {
  const { renderDialog } = useDialogContext();
  const { entryId } = useParams();
  const { entries } = useJournalContext();
  const { user } = useAppContext();

  const navigate = useNavigate();

  useEffect(() => {
    renderEditSchedule(journal.id, renderDialog, entryId, journal, navigate);
  }, [journal, entryId, entries, navigate, renderDialog, user.id]);

  return null;
};
