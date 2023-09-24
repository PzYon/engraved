import React, { useState } from "react";
import { ActionIconButton } from "../actions/ActionIconButton";
import { AppInfo } from "./AppInfo";
import { DialogWrapper } from "../../layout/dialogs/DialogWrapper";
import { ActionFactory } from "../actions/ActionFactory";

export const AppInfoLauncher: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <ActionIconButton
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
