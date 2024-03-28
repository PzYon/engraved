import { IJournal } from "../../serverApi/IJournal";
import { useDialogContext } from "../layout/dialogs/DialogContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OnNotification } from "./OnJournalNotification"; /* eslint-disable-next-line react/prop-types */

export const OnNotificationLauncher: React.FC<{ journal: IJournal }> = ({
  /* eslint-disable-next-line react/prop-types */
  journal,
}) => {
  const { renderDialog } = useDialogContext();
  const navigate = useNavigate();

  useEffect(() => {
    renderDialog({
      title: "Notification",
      render: (closeDialog) => {
        return <OnNotification journal={journal} onCancel={closeDialog} />;
      },
      onClose: () => {
        /* eslint-disable-next-line react/prop-types */
        navigate(`/journals/${journal.id}`);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
