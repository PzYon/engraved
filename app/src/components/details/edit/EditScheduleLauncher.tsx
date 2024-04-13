import { IJournal } from "../../../serverApi/IJournal";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { EditSchedule } from "./EditSchedule";
import { useJournalContext } from "../JournalContext";
import { useAppContext } from "../../../AppContext";
import { IEntity } from "../../../serverApi/IEntity";
import { getScheduleForUser } from "../../overview/scheduled/scheduleUtils";

export const EditScheduleLauncher: React.FC<{
  journal: IJournal;
}> = ({ journal }) => {
  const { renderDialog } = useDialogContext();
  const { entryId } = useParams();
  const { entries } = useJournalContext();
  const { user } = useAppContext();

  const navigate = useNavigate();

  useEffect(() => {
    renderDialog({
      title: "Schedule for " + (entryId ? "entry" : "journal"),
      render: (closeDialog) => (
        <EditSchedule
          initialDate={getNextOccurrence()}
          journalId={journal.id}
          entryId={entryId}
          onCancel={closeDialog}
        />
      ),
      onClose: () => {
        navigate(`/journals/${journal.id}`);
      },
    });

    function getNextOccurrence() {
      const entity: IEntity = entryId
        ? entries.filter((i) => i.id === entryId)[0]
        : journal;

      return getScheduleForUser(entity, user.id).nextOccurrence;
    }
  }, [journal, entryId, entries, navigate, renderDialog, user.id]);

  return null;
};
