import React, { useState } from "react";
import { IChartProps } from "./IChartProps";
import { Slider, styled } from "@mui/material";

const ChartJs = React.lazy(() => import("./LazyChartJs"));

export const Chart: React.FC<IChartProps> = (props: IChartProps) => {
  const [rollingAverageGroupSize, setRollingAverageGroupSize] = useState(0);

  return (
    <Host>
      <ChartJs
        {...props}
        chartUiProps={{ rollingAverage: rollingAverageGroupSize * 2 + 1 }}
      />
      <ActionsContainer>
        <Slider
          min={0}
          max={15}
          marks={true}
          valueLabelDisplay="auto"
          sx={{ width: "50%" }}
          value={rollingAverageGroupSize}
          onChange={(x) => {
            /* eslint-disable  @typescript-eslint/no-explicit-any */
            setRollingAverageGroupSize((x.target as any).value);
          }}
        />
      </ActionsContainer>
    </Host>
  );
};

const Host = styled("div")``;

const ActionsContainer = styled("div")`
  display: flex;
  justify-content: end;
`;
