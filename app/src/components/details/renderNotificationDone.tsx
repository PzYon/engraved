import { IJournal } from "../../serverApi/IJournal";
import { IEntry } from "../../serverApi/IEntry";
import { IDialogProps } from "../layout/dialogs/DialogContext";
import { IScrapEntry } from "../../serverApi/IScrapEntry";
import { NotificationDone } from "./NotificationDone";
import { NavigateFunction } from "react-router-dom";

export const renderNotificationDone = (
  journal: IJournal,
  entry: IEntry,
  renderDialog: (dialogProps: IDialogProps) => void,
  navigate?: NavigateFunction,
  journalName?: string,
): void => {
  renderDialog({
    title: `Notification: ${entry ? (entry as IScrapEntry).title : journal.name}`,
    render: (closeDialog) => (
      <NotificationDone
        journal={journal}
        entry={entry}
        onSuccess={closeDialog}
        journalName={journalName}
      />
    ),
    onClose: () => {
      if (journal && navigate) {
        navigate(`/journals/${journal.id}`);
      }
    },
  });
};
