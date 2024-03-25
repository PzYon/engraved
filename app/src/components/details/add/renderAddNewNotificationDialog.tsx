import { IDialogProps } from "../../layout/dialogs/DialogContext";
import { AddNewNotificationDialog } from "./AddNewNotificationDialog";

export const renderAddNewNotificationDialog = (
  renderDialog: (dialogProps: IDialogProps) => void,
): void => {
  renderDialog({
    title: "Add Quick Notification",
    render: (closeDialog) => (
      <AddNewNotificationDialog onSuccess={closeDialog} />
    ),
  });
};
