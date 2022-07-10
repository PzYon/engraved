import React from "react";
import { IMetric } from "../../serverApi/IMetric";
import { styled, Typography } from "@mui/material";
import { MetricTypeFactory } from "../../metricTypes/MetricTypeFactory";
import { IMetricOverviewPropertyDefinition } from "../../metricTypes/IMetricType";
import { FormatDate } from "../common/FormatDate";

export const MetricProperties: React.FC<{ metric: IMetric }> = ({ metric }) => {
  const properties: IMetricOverviewPropertyDefinition[] =
    MetricTypeFactory.create(metric.type).getOverviewProperties(metric);

  const allProperties: IMetricOverviewPropertyDefinition[] = [
    {
      key: "last-measurement-date",
      node: <FormatDate value={metric.lastMeasurementDate} />,
      label: "Last measurement",
    },
    ...properties,
  ];

  return (
    <>
      {allProperties.map((p) => (
        <Property key={p.key}>
          <Typography component="span" sx={{ fontWeight: "200" }}>
            {p.label}:
          </Typography>{" "}
          <Typography sx={{ color: "primary.main" }} component="span">
            {p.node}
          </Typography>
        </Property>
      ))}
    </>
  );
};

const Property = styled(Typography)`
  word-break: break-word;
  display: inline-block;
  font-weight: lighter;
  margin-top: 16px;

  :not(:last-of-type)::after {
    content: "\\00B7";
    margin: 0 0.8rem;
  }
`;
