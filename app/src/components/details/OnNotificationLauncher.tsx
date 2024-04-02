import { useDialogContext } from "../layout/dialogs/DialogContext";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { OnNotification } from "./OnNotification";
import { useJournalContext } from "./JournalContext";
import { IScrapEntry } from "../../serverApi/IScrapEntry";
import { IJournal } from "../../serverApi/IJournal";

export const OnNotificationLauncher: React.FC<{ journal: IJournal }> = ({
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
      render: () => {
        return <OnNotification journal={journal} entry={entry} />;
      },
      onClose: () => {
        navigate(`/journals/${journal.id}`);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry, entryId, journal]);

  return null;
};
