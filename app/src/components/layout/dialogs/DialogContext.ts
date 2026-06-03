import React, { createContext, useContext } from "react";

export interface IDialogProps {
  render: (closeDialog: () => void) => React.ReactNode;
  title: string;
  isFullScreen?: boolean;
  onClose?: () => void;
}

interface IDialogContext {
  renderDialog(dialogProps: IDialogProps | null): void;
}

export const DialogContext = createContext<IDialogContext>({
  renderDialog: null!,
});

export const useDialogContext = () => {
  return useContext(DialogContext);
};
