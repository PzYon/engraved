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
  entryId: string,
  journal: IJournal,
  renderDialog: (dialogProps: IDialogProps) => void,
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
    renderEditSchedule(journal.id, entryId, journal, renderDialog, navigate);
  }, [journal, entryId, entries, navigate, renderDialog, user.id]);

  return null;
};
