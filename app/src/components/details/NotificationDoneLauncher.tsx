import { IJournal } from "../../serverApi/IJournal";
import { useDialogContext } from "../layout/dialogs/DialogContext";
import { useJournalContext } from "./JournalContext";
import { IScrapEntry } from "../../serverApi/IScrapEntry";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { NotificationDone } from "./NotificationDone";

export const NotificationDoneLauncher: React.FC<{ journal: IJournal }> = ({
  journal,
}) => {
  const { renderDialog } = useDialogContext();

  const { entryId } = useParams();
  const { entries } = useJournalContext();

  const entry = entries.filter((e) => e.id === entryId)[0];

  const navigate = useNavigate();

  useEffect(() => {
    if (entryId && !entry) {
      return;
    }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry, entryId, journal]);

  return null;
};
