import React from "react";
import { DialogWrapper } from "./DialogWrapper";
import { useDialogContext } from "./DialogContext";

export const DialogHost: React.FC = () => {
  const { dialogProps, renderDialog } = useDialogContext();

  if (!dialogProps) {
    return null;
  }

  return (
    <DialogWrapper title={dialogProps.title} onClose={() => renderDialog(null)}>
      {dialogProps.render()}
    </DialogWrapper>
  );
};
