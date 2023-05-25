import { IDialogProps } from "../../layout/dialogs/DialogContext";
import { IUser } from "../../../serverApi/IUser";
import { AddQuickScrapDialog } from "./AddQuickScrapDialog";

export const renderAddQuickScrapDialog = (
  user: IUser,
  renderDialog: (dialogProps: IDialogProps) => void
): void => {
  renderDialog({
    title: "Add Quick Scrap",
    render: (closeDialog) => (
      <AddQuickScrapDialog
        onSuccess={closeDialog}
        metricId={user.favoriteMetricIds[0]}
      />
    ),
  });
};
