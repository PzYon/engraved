import { NavigateFunction } from "react-router-dom";
import { IJournal } from "../../../serverApi/IJournal";
import { IDialogProps } from "../../layout/dialogs/DialogContext";
import { DeleteEntry } from "./DeleteEntry";
import { IEntry } from "../../../serverApi/IEntry";

export const renderDeleteEntry = (
  journal: IJournal,
  entryId: string,
  entry: IEntry,
  renderDialog: (dialogProps: IDialogProps) => void,
  navigate: NavigateFunction,
  journalName?: string,
): void => {
  renderDialog({
    title: "Delete Entry",
    render: (closeDialog) => {
      return (
        <DeleteEntry
          journal={journal}
          entryId={entryId}
          closeDialog={closeDialog}
          entry={entry}
          journalName={journalName}
        />
      );
    },
    onClose: () => {
      navigate(`/journals/${journal.id}`);
    },
  });
};
