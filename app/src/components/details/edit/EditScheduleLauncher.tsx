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
import { IEntity } from "../../../serverApi/IEntity";
import { getScheduleForUser } from "../../overview/scheduled/scheduleUtils";
import { IEntry } from "../../../serverApi/IEntry";

export const renderEditSchedule = (
  journalId: string,
  renderDialog: (dialogProps: IDialogProps) => void,
  userId: string,
  entryId: string,
  journal: IJournal,
  entries: IEntry[],
  navigate?: NavigateFunction,
) => {
  renderDialog({
    title: "Schedule for " + (entryId ? "entry" : "journal"),
    render: (closeDialog) => (
      <EditSchedule
        initialDate={getNextOccurrence()}
        journalId={journalId}
        entryId={entryId}
        onCancel={closeDialog}
      />
    ),
    onClose: () => {
      navigate?.(`/journals/${journalId}`);
    },
  });

  function getNextOccurrence() {
    const entity: IEntity = entryId
      ? entries.filter((i) => i.id === entryId)[0]
      : journal;

    if (!entity) {
      return null;
    }

    return getScheduleForUser(entity, userId).nextOccurrence;
  }
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
    renderEditSchedule(
      journal.id,
      renderDialog,
      user.id,
      entryId,
      journal,
      entries,
      navigate,
    );
  }, [journal, entryId, entries, navigate, renderDialog, user.id]);

  return null;
};
