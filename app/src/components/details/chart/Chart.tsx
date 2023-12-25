import { IChartProps } from "./IChartProps";
import { ChartJsWrapper } from "./ChartJsWrapper";
import { Slider, Typography, styled } from "@mui/material";
import { useState } from "react";

export const Chart: React.FC<IChartProps> = (props: IChartProps) => {
  const [rollingAverageGroupSize, setRollingAverageGroupSize] = useState(0);

  return (
    <Host>
      <ChartJsWrapper
        {...props}
        chartUiProps={{ rollingAverage: rollingAverageGroupSize * 2 + 1 }}
      />
      <ActionsContainer>
        <Typography fontSize="small" sx={{ pr: 1 }}>
          Moving avg.:
        </Typography>
        <Slider
          min={0}
          max={15}
          marks={true}
          valueLabelDisplay="auto"
          sx={{ width: "40%" }}
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
  align-items: center;
`;
