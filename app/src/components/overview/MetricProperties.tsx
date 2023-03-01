import React from "react";
import { IMetric } from "../../serverApi/IMetric";
import { styled, Typography } from "@mui/material";
import { IMetricOverviewPropertyDefinition } from "../../metricTypes/IMetricType";
import { FormatDate } from "../common/FormatDate";
import { SharedWith } from "../common/SharedWith";

export const MetricProperties: React.FC<{ metric: IMetric }> = ({ metric }) => {
  const allProperties: IMetricOverviewPropertyDefinition[] = [
    {
      key: "edited-on-date",
      node: <FormatDate value={metric.editedOn} />,
      label: "Edited",
    },
    {
      key: "shared-with",
      node: <SharedWith metric={metric} />,
      hideWhen: () => !Object.keys(metric.permissions).length,
      label: "Shared with",
    },
  ];

  return (
    <Host>
      {allProperties
        .filter((p) => !p.hideWhen || !p.hideWhen())
        .map((p) => (
          <Property className="property" as="div" key={p.key}>
            <Typography component="span" sx={{ fontWeight: "200" }}>
              {p.label}
            </Typography>{" "}
            <Typography sx={{ color: "primary.main" }} component="span">
              {p.node}
            </Typography>
          </Property>
        ))}
    </Host>
  );
};

const Host = styled("div")`
  .property:not(:last-of-type)::after {
    content: "\\00B7";
    margin: 0 0.8rem;
  }
`;

const Property = styled(Typography)`
  word-break: break-word;
  display: inline-block;
  font-weight: lighter;
  margin-top: ${(p) => p.theme.spacing(2)};
`;
