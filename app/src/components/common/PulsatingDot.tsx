import { styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ServerApi } from "../../serverApi/ServerApi";

export const PulsatingDot: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    ServerApi.loadingHandler.registerHandler("pulsating-dot", (loading) =>
      setIsLoading(loading)
    );
    return () => ServerApi.loadingHandler.unregisterHandler("pulsating-dot");
  }, []);

  return <Dot className={isLoading ? "is-active" : undefined}>.</Dot>;
};

const Dot = styled("span")`
  @keyframes pulse {
    0% {
      color: white;
    }
    100% {
      color: transparent;
    }
  }

  &.is-active {
    animation: pulse 0.7s infinite;
  }

  color: ${(p) => p.theme.palette.common.white};
`;
