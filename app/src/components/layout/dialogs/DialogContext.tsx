import React, { createContext, useContext, useState } from "react";

export interface IDialogProps {
  render: () => React.ReactNode;
  title: string;
}

export interface IDialogContext {
  renderDialog(dialogProps: IDialogProps): void;
  dialogProps: IDialogProps;
}

const DialogContext = createContext<IDialogContext>({
  renderDialog: null,
  dialogProps: null,
});

export const useDialogContext = () => {
  return useContext(DialogContext);
};

export const DialogContextProvider: React.FC = ({ children }) => {
  const [dialogProps, setDialogProps] = useState<IDialogProps>(null);

  return (
    <DialogContext.Provider
      value={{
        renderDialog: (props: IDialogProps) => {
          setDialogProps(props);
        },
        dialogProps: dialogProps,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};
