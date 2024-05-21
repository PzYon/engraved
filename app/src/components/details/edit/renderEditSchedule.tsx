import { NavigateFunction } from "react-router-dom";
import { IJournal } from "../../../serverApi/IJournal";
import { IDialogProps } from "../../layout/dialogs/DialogContext";
import { EditScheduleAction } from "./EditScheduleAction";

export const renderEditSchedule = (
  journalId: string,
  entryId: string,
  journal: IJournal,
  renderDialog: (dialogProps: IDialogProps) => void,
  navigate?: NavigateFunction,
) => {
  renderDialog({
    title: "Schedule for " + (entryId ? "entry" : "journal"),
    render: () => (
      <EditScheduleAction
        journal={journal}
        journalId={journalId}
        entryId={entryId}
      />
    ),
    onClose: () => {
      navigate?.(`/journals/${journalId}`);
    },
  });
};
