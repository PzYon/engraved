import React from "react";
import { IMeasurement } from "../serverApi/IMeasurement";
import { IMetric } from "../serverApi/IMetric";
import { FormatDate } from "../components/common/FormatDate";
import { styled, Typography } from "@mui/material";
import { Properties } from "../components/common/Properties";
import { MetricTypeIcon } from "../components/common/MetricTypeIcon";
import { IconStyle } from "../components/common/Icon";

export const Activity: React.FC<{
  metric: IMetric;
  measurement: IMeasurement;
  children: React.ReactNode;
}> = ({ metric, measurement, children }) => {
  return (
    <Typography>
      <Properties
        properties={[
          {
            key: "metric-type",
            node: (
              <MetricTypeIcon type={metric.type} style={IconStyle.PageTitle} />
            ),
            label: "Metric type",
          },
          {
            key: "name",
            node: metric.name,
            label: "Metric",
          },
          {
            key: "date",
            node: <FormatDate value={measurement.dateTime} />,
            label: "Date",
          },
        ]}
      />
      <ValueContainer>{children}</ValueContainer>
    </Typography>
  );
};

const ValueContainer = styled("div")`
  font-weight: bold;
`;
