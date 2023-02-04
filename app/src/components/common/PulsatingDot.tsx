import { styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ServerApi } from "../../serverApi/ServerApi";

export const PulsatingDot: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    ServerApi.registerOnLoadingToggle((loading) => setIsLoading(loading));
  }, []);

  return <Dot className={isLoading ? "is-active" : undefined}>.</Dot>;
};

const Dot = styled("span")`
  &.is-active {
    animation: pulse 0.7s infinite;
  }

  color: ${(p) => p.theme.palette.common.white};
`;
