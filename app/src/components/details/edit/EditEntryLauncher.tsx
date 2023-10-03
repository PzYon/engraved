import React, { useEffect } from "react";
import { IJournal } from "../../../serverApi/IJournal";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { useNavigate } from "react-router-dom";
import { UpsertEntry } from "../add/UpsertEntry";
import { IEntry } from "../../../serverApi/IEntry";
import { useParams } from "react-router";

export const EditEntryLauncher: React.FC<{
  journal: IJournal;
  entries: IEntry[];
}> = ({ journal, entries }) => {
  const { renderDialog } = useDialogContext();
  const { entryId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (!entries?.length) {
      return;
    }

    renderDialog({
      title: "Edit Entry",
      render: (closeDialog) => (
        <UpsertEntry
          journal={journal}
          entry={entries.find((m) => m.id === entryId)}
          onSaved={async () => {
            closeDialog();
            goToJournal();
          }}
          onCancel={closeDialog}
        />
      ),
      onClose: () => {
        goToJournal();
      },
    });
  }, [entries]);

  return null;

  function goToJournal() {
    navigate(`/journals/${journal.id}`);
  }
};
