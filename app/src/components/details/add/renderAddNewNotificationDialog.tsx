import { IDialogProps } from "../../layout/dialogs/DialogContext";
import { AddQuickNotificationDialog } from "./AddQuickNotificationDialog";

export const renderAddNewNotificationDialog = (
  renderDialog: (dialogProps: IDialogProps) => void,
): void => {
  renderDialog({
    title: "Add Quick Notification",
    render: (closeDialog) => (
      <AddQuickNotificationDialog onSuccess={closeDialog} />
    ),
  });
};
