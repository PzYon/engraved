import React, { useEffect, useState } from "react";
import { ActionIconButton } from "./actions/ActionIconButton";
import { ServerApi } from "../../serverApi/ServerApi";
import { styled } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { ActionFactory } from "./actions/ActionFactory";

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
      <ActionIconButton action={ActionFactory.refreshData(queryClient)} />
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
