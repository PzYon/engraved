import React from "react";
import { IMeasurement } from "../serverApi/IMeasurement";
import { IMetric } from "../serverApi/IMetric";
import { FormatDate } from "../components/common/FormatDate";
import { styled } from "@mui/material";
import { Properties } from "../components/common/Properties";
import { MetricTypeIcon } from "../components/common/MetricTypeIcon";
import { IconStyle } from "../components/common/Icon";
import { Link } from "react-router-dom";

export const Activity: React.FC<{
  metric: IMetric;
  measurement: IMeasurement;
  children: React.ReactNode;
}> = ({ metric, measurement, children }) => {
  return (
    <>
      <Properties
        properties={[
          {
            key: "metric-type",
            node: (
              <MetricTypeIcon type={metric.type} style={IconStyle.Activity} />
            ),
            label: "",
          },
          {
            key: "name",
            node: <Link to={`/metrics/${metric.id}`}>{metric.name}</Link>,
            label: "Metric",
          },
          {
            key: "date",
            node: <FormatDate value={measurement.dateTime} />,
            label: "",
          },
        ]}
      />
      <ValueContainer>{children}</ValueContainer>
    </>
  );
};

const ValueContainer = styled("div")`
  border-top: 1px solid ${(p) => p.theme.palette.background.default};
  padding-top: ${(p) => p.theme.spacing(2)};
  margin-top: ${(p) => p.theme.spacing(2)};
`;
