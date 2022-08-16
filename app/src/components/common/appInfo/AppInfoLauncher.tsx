import React, { useRef, useState } from "react";
import { IconButtonWrapper } from "../IconButtonWrapper";
import { HelpOutline } from "@mui/icons-material";
import { Popover } from "@mui/material";
import { AppInfo } from "./AppInfo";

export const AppInfoLauncher: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);
  const iconRef = useRef();

  return (
    <>
      <span ref={iconRef}>
        <IconButtonWrapper
          action={{
            icon: <HelpOutline />,
            onClick: () => setShowInfo(!showInfo),
            label: "Show App Info",
            key: "app_info",
            sx: { color: "white" },
          }}
        />
      </span>
      <Popover
        id={"app_info_callout"}
        open={showInfo}
        anchorEl={iconRef.current}
        onClose={() => setShowInfo(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <AppInfo />
      </Popover>
    </>
  );
};
