import { IDialogProps } from "../../layout/dialogs/DialogContext";
import { QuickAddDialog } from "../scraps/QuickAddDialog";

export const renderQuickAddDialog = (
  selectedJournalId: string,
  renderDialog: (dialogProps: IDialogProps) => void,
  title: string,
): void => {
  renderDialog({
    title: title,
    render: (closeDialog) => (
      <QuickAddDialog
        onSuccess={closeDialog}
        targetJournalId={selectedJournalId}
      />
    ),
  });
};
