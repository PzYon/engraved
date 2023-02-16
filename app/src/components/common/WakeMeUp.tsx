import React, { useEffect, useState } from "react";
import { SyncOutlined } from "@mui/icons-material";
import { IconButtonWrapper } from "./IconButtonWrapper";
import { ServerApi } from "../../serverApi/ServerApi";

const tenMinutes = 10 * 60 * 1000;

export const WakeMeUp: React.FC = () => {
  const [showMe, setShowMe] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowMe(true), tenMinutes);
  }, [showMe]);

  if (!showMe) {
    return null;
  }

  return (
    <IconButtonWrapper
      action={{
        icon: <SyncOutlined />,
        onClick: () => {
          ServerApi.wakeMeUp().then(() => setShowMe(false));
        },
        label: "Wake up server",
        key: "wake_me_up",
        sx: { color: "common.white" },
      }}
    />
  );
};
