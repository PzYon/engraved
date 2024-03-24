import { IDialogProps } from "../../layout/dialogs/DialogContext";
import { AddNewNotificationDialog } from "./addNewNotificationDialog";

export const renderAddNewNotificationDialog = (
  renderDialog: (dialogProps: IDialogProps) => void,
): void => {
  renderDialog({
    title: "Add new notification",
    render: (closeDialog) => (
      <AddNewNotificationDialog onSuccess={closeDialog} />
    ),
  });
};
