import { styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ServerApi } from "../../serverApi/ServerApi";

const keyForLoadingHandler = "pulsating-dot";

export const PulsatingDot: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    ServerApi.loadingHandler.registerHandler(keyForLoadingHandler, (loading) =>
      setIsLoading(loading)
    );
    return () => ServerApi.loadingHandler.unregisterHandler("pulsating-dot");
  }, []);

  return <Dot className={isLoading ? "is-active" : undefined}>.</Dot>;
};

const Dot = styled("span")`
  color: ${(p) => p.theme.palette.common.white};

  @keyframes pulse {
    0% {
      color: white;
    }
    100% {
      color: transparent;
    }
  }

  &.is-active {
    animation: pulse ${ServerApi.loadingHandler.delayMs / 1000}s infinite;
  }
`;
