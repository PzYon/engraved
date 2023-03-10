import React, { useEffect, useState } from "react";
import { SyncOutlined } from "@mui/icons-material";
import { IconButtonWrapper } from "./IconButtonWrapper";
import { ServerApi } from "../../serverApi/ServerApi";
import { styled } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";

const tenMinutes = 10 * 60 * 1000;

export const WakeMeUp: React.FC = () => {
  const [showMe, setShowMe] = useState(false);
  const [doRotate, setDoRotate] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    setTimeout(() => setShowMe(true), tenMinutes);
  }, [showMe]);

  if (!showMe) {
    return null;
  }

  return (
    <Host className={doRotate ? "rotate" : null}>
      <IconButtonWrapper
        action={{
          icon: <SyncOutlined />,
          onClick: async () => {
            setDoRotate(true);
            await ServerApi.getSystemInfo();
            await queryClient.invalidateQueries();
            setDoRotate(false);
            setShowMe(false);
          },
          label: "Wake up server",
          key: "wake-me-up",
          sx: { color: "common.white" },
        }}
      />
    </Host>
  );
};

const Host = styled("span")`
  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }

  &.rotate {
    animation: rotation ${(ServerApi.loadingHandler.delayMs * 2) / 1000}s
      infinite;
  }
`;
