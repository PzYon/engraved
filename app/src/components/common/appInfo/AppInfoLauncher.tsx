import React, { useState } from "react";
import { ActionFactory, IconButtonWrapper } from "../IconButtonWrapper";
import { AppInfo } from "./AppInfo";
import { DialogWrapper } from "../../layout/dialogs/DialogWrapper";

export const AppInfoLauncher: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <IconButtonWrapper
        action={ActionFactory.appInfo(() => setShowInfo(true))}
      />
      {showInfo ? (
        <DialogWrapper
          onClose={() => setShowInfo(false)}
          props={{ fullScreen: false }}
          title="App Info"
        >
          <AppInfo />
        </DialogWrapper>
      ) : null}
    </>
  );
};
