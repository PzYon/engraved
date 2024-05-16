import { IJournal } from "../../serverApi/IJournal";
import { useDialogContext } from "../layout/dialogs/DialogContext";
import { useJournalContext } from "./JournalContext";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { renderNotificationDone } from "./renderNotificationDone";

export const NotificationDoneLauncher: React.FC<{ journal: IJournal }> = ({
  journal,
}) => {
  const { renderDialog } = useDialogContext();

  const { entryId } = useParams();
  const { entries } = useJournalContext();

  const entry = entries.filter((e) => e.id === entryId)[0];

  const navigate = useNavigate();

  useEffect(() => {
    renderNotificationDone(
      journal,
      entry,
      renderDialog,
      navigate,
      journal.name,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry, entryId, journal]);

  return null;
};
