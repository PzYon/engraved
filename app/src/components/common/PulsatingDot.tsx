import { styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ServerApi } from "../../serverApi/ServerApi";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

export const useIsLoading = () => {
  const isMutating = useIsMutating() > 0;
  const isFetching = useIsFetching() > 0;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isCurrentlyLoading = isMutating || isFetching;

    if (isCurrentlyLoading !== isLoading) {
      if (isCurrentlyLoading) {
        setIsLoading(true);
      } else {
        setIsLoading(isCurrentlyLoading);
      }
    }
  }, [isMutating, isFetching]);

  console.log("useIsLoading:" + isLoading);

  return isLoading;
};

export const PulsatingDot: React.FC = () => {
  // const [isLoading, setIsLoading] = useState(false);
  //
  // useEffect(() => {
  //   ServerApi.loadingHandler.registerHandler(keyForLoadingHandler, (loading) =>
  //     setIsLoading(loading),
  //   );
  //   return () =>
  //     ServerApi.loadingHandler.unregisterHandler(keyForLoadingHandler);
  // }, []);

  const isLoading = useIsLoading();

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
