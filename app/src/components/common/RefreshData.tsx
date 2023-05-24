import React, { useEffect, useState } from "react";
import { IconButtonWrapper } from "./IconButtonWrapper";
import { ServerApi } from "../../serverApi/ServerApi";
import { styled } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshOutlined } from "@mui/icons-material";

const keyForLoadingHandler = "refresh-data";

export const RefreshData: React.FC = () => {
  const queryClient = useQueryClient();

  const [doRotate, setDoRotate] = useState(false);

  useEffect(() => {
    ServerApi.loadingHandler.registerHandler(keyForLoadingHandler, setDoRotate);
    return () =>
      ServerApi.loadingHandler.unregisterHandler(keyForLoadingHandler);
  }, []);

  return (
    <Host className={doRotate ? "rotate" : null}>
      <IconButtonWrapper
        action={{
          icon: <RefreshOutlined fontSize="small" />,
          onClick: async () => await queryClient.invalidateQueries(),
          label: "Refresh data",
          key: "refresh",
          sx: { color: "common.white" },
        }}
      />
    </Host>
  );
};

const Host = styled("span")`
  display: inline-block;

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
