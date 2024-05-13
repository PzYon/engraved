import { IJournal } from "../../serverApi/IJournal";
import {
  IDialogProps,
  useDialogContext,
} from "../layout/dialogs/DialogContext";
import { useJournalContext } from "./JournalContext";
import { IScrapEntry } from "../../serverApi/IScrapEntry";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { NotificationDone } from "./NotificationDone";
import { IEntry } from "../../serverApi/IEntry";

export const renderNotificationDone = (
  journal: IJournal,
  entry: IEntry,
  renderDialog: (dialogProps: IDialogProps) => void,
  navigate: NavigateFunction,
): void => {
  // todo: load entry?

  renderDialog({
    title: `Notification: ${entry ? (entry as IScrapEntry).title : journal.name}`,
    render: (closeDialog) => (
      <NotificationDone
        journal={journal}
        entry={entry}
        onSuccess={closeDialog}
      />
    ),
    onClose: () => {
      navigate(`/journals/${journal.id}`);
    },
  });
};

export const NotificationDoneLauncher: React.FC<{ journal: IJournal }> = ({
  journal,
}) => {
  const { renderDialog } = useDialogContext();

  const { entryId } = useParams();
  const { entries } = useJournalContext();

  const entry = entries.filter((e) => e.id === entryId)[0];

  const navigate = useNavigate();

  useEffect(() => {
    renderNotificationDone(journal, entry, renderDialog, navigate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry, entryId, journal]);

  return null;
};
