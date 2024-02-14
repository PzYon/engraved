import React, { createContext, useContext } from "react";

export interface IDialogProps {
  render: (closeDialog: () => void) => React.ReactNode;
  title: string;
  isFullScreen?: boolean;
  onClose?: () => void;
}

export interface IDialogContext {
  renderDialog(dialogProps: IDialogProps): void;
}

export const DialogContext = createContext<IDialogContext>({
  renderDialog: null,
});

export const useDialogContext = () => {
  return useContext(DialogContext);
};
