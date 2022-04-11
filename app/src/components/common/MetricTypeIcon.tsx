import React from "react";
import { MetricType } from "../../serverApi/MetricType";
import { BarChartSharp, PlusOneSharp, TimerSharp } from "@mui/icons-material";
import { styled } from "@mui/material";

export const MetricTypeIcon: React.FC<{ type: MetricType }> = ({ type }) => {
  return <Host>{getIcon()}</Host>;

  function getIcon() {
    switch (type) {
      case MetricType.Counter:
        return <PlusOneSharp />;
      case MetricType.Gauge:
        return <BarChartSharp />;
      case MetricType.Timer:
        return <TimerSharp />;
    }
  }
};

const Host = styled("div")`
  svg {
    border-radius: 100%;
    border: 2px solid ${(p) => p.theme.palette.primary.main};
    padding: 8px;
    color: ${(p) => p.theme.palette.primary.main};
    background-color: ${(p) => p.theme.palette.background.default};
  }
`;
