import { IJournal } from "../../../serverApi/IJournal";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { EditSchedule } from "./EditSchedule";
import { useJournalContext } from "../JournalContext";

export const EditScheduleLauncher: React.FC<{
  journal: IJournal;
}> = ({ journal }) => {
  const { renderDialog } = useDialogContext();
  const { entryId } = useParams();
  const { entries } = useJournalContext();

  const navigate = useNavigate();

  useEffect(() => {
    renderDialog({
      title: "Schedule for " + (entryId ? "entry" : "journal"),
      render: (closeDialog) => (
        <EditSchedule
          initialDate={
            (entryId ? entries.filter((i) => i.id === entryId)[0] : journal)
              ?.schedule?.nextOccurrence
          }
          journalId={journal.id}
          entryId={entryId}
          onCancel={closeDialog}
        />
      ),
      onClose: () => {
        navigate(`/journals/${journal.id}`);
      },
    });
  }, [journal, entryId, entries, navigate, renderDialog]);

  return null;
};
