import { IDialogProps } from "../../layout/dialogs/DialogContext";
import { AddQuickScrapDialog } from "./AddQuickScrapDialog";
import { IUser } from "../../../serverApi/IUser";

export const renderAddQuickScrapDialog = (
  user: IUser,
  renderDialog: (dialogProps: IDialogProps) => void
): void => {
  renderDialog({
    title: "Add measurement",
    render: (closeDialog) => <AddQuickScrapDialog user={user} />,
  });
};
