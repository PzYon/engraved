import { DeviceWidth, useDeviceWidth } from "../../common/useDeviceWidth";
import { DialogWrapper } from "./DialogWrapper";
import { DialogContext, IDialogProps } from "./DialogContext";
import React, { useState } from "react";

export const DialogContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dialogProps, setDialogProps] = useState<IDialogProps>(null);

  const deviceWidth = useDeviceWidth();

  return (
    <DialogContext.Provider value={{ renderDialog: setDialogProps }}>
      {children}
      {dialogProps ? (
        <DialogWrapper
          props={{
            fullScreen:
              deviceWidth === DeviceWidth.Small || dialogProps.isFullScreen,
          }}
          title={dialogProps.title}
          onClose={closeDialog}
        >
          {dialogProps.render(closeDialog)}
        </DialogWrapper>
      ) : null}
    </DialogContext.Provider>
  );

  function closeDialog() {
    dialogProps.onClose?.();
    setDialogProps(null);
  }
};
