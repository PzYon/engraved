import React, { useState } from "react";
import { IconButtonWrapper } from "../IconButtonWrapper";
import { HelpOutline } from "@mui/icons-material";
import { AppInfo } from "./AppInfo";
import { DialogWrapper } from "../../layout/dialogs/DialogWrapper";
import { styled } from "@mui/material";

export const AppInfoLauncher: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <LauncherContainer>
        <IconButtonWrapper
          action={{
            icon: <HelpOutline />,
            onClick: () => setShowInfo(true),
            label: "Show App Info",
            key: "app_info",
            sx: { color: "common.white" },
          }}
        />
      </LauncherContainer>
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

const LauncherContainer = styled("span")`
  padding-right: ${(p) => p.theme.spacing(1)};
`;
