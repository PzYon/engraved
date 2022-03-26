import React, { createContext, useContext, useState } from "react";
import { DialogWrapper } from "./DialogWrapper";

export interface IDialogProps {
  render: () => React.ReactNode;
  title: string;
  isFullScreen?: boolean;
  onClose?: () => void;
}

export interface IDialogContext {
  renderDialog(dialogProps: IDialogProps): void;
}

const DialogContext = createContext<IDialogContext>({
  renderDialog: null,
});

export const useDialogContext = () => {
  return useContext(DialogContext);
};

export const DialogContextProvider: React.FC = ({ children }) => {
  const [dialogProps, setDialogProps] = useState<IDialogProps>(null);

  return (
    <DialogContext.Provider value={{ renderDialog: setDialogProps }}>
      {children}
      {dialogProps ? (
        <DialogWrapper
          props={{
            fullScreen: dialogProps.isFullScreen,
          }}
          title={dialogProps.title}
          onClose={() => {
            setDialogProps(null);

            if (dialogProps.onClose) {
              dialogProps.onClose();
            }
          }}
        >
          {dialogProps.render()}
        </DialogWrapper>
      ) : null}
    </DialogContext.Provider>
  );
};
