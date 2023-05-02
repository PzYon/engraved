import React, { useState } from "react";
import { IconButtonWrapper } from "../IconButtonWrapper";
import { HelpOutline } from "@mui/icons-material";
import { AppInfo } from "./AppInfo";
import { DialogWrapper } from "../../layout/dialogs/DialogWrapper";

export const AppInfoLauncher: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <IconButtonWrapper
        action={{
          icon: <HelpOutline />,
          onClick: () => setShowInfo(true),
          label: "Show App Info",
          key: "app_info",
          sx: { color: "common.white" },
        }}
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
