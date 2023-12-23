import React, { useState } from "react";
import { IChartProps } from "./IChartProps";
import { Slider, styled } from "@mui/material";

const ChartJs = React.lazy(() => import("./LazyChartJs"));

export const Chart: React.FC<IChartProps> = (props: IChartProps) => {
  const [rollingAverageGroupSize, setRollingAverageGroupSize] = useState(7);

  return (
    <Host>
      <ChartJs {...props} />
      <ActionsContainer>
        <Slider
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
