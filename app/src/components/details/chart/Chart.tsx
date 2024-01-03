import React, { useState } from "react";
import { IChartProps } from "./IChartProps";
import { ChartJsWrapper } from "./ChartJsWrapper";
import { Slider, styled, Typography } from "@mui/material";

export const Chart: React.FC<IChartProps> = (props) => {
  const [rollingAverageGroupSize, setRollingAverageGroupSize] = useState(0);

  const numberOfEntries = props.entries.length;

  return (
    <Host>
      <ChartJsWrapper
        {...props}
        chartUiProps={{ rollingAverage: rollingAverageGroupSize * 2 + 1 }}
      />
      <ActionsContainer>
        {props.chartType === "line" && numberOfEntries ? (
          <>
            <Typography fontSize="small" sx={{ pr: 2 }}>
              Moving avg.:
            </Typography>
            <Slider
              min={0}
              max={Math.min(15, Math.floor(numberOfEntries / 2))}
              marks={true}
              valueLabelDisplay="auto"
              sx={{ width: "40%" }}
              value={rollingAverageGroupSize}
              onChange={(x) => {
                /* eslint-disable  @typescript-eslint/no-explicit-any */
                setRollingAverageGroupSize((x.target as any).value);
              }}
            />
          </>
        ) : null}
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
