import { IDialogProps } from "../../layout/dialogs/DialogContext";
import { AddQuickScrapDialog } from "./AddQuickScrapDialog";

export const renderAddScrapDialog = (
  metricId: string,
  renderDialog: (dialogProps: IDialogProps) => void,
  title: string,
): void => {
  renderDialog({
    title: title,
    render: (closeDialog) => (
      <AddQuickScrapDialog onSuccess={closeDialog} metricId={metricId} />
    ),
  });
};
