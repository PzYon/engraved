import React from "react";
import { IMetric } from "../../serverApi/IMetric";
import { Avatar, AvatarGroup, styled, Typography } from "@mui/material";
import { MetricTypeFactory } from "../../metricTypes/MetricTypeFactory";
import { IMetricOverviewPropertyDefinition } from "../../metricTypes/IMetricType";
import { FormatDate } from "../common/FormatDate";

export const MetricProperties: React.FC<{ metric: IMetric }> = ({ metric }) => {
  const properties: IMetricOverviewPropertyDefinition[] =
    MetricTypeFactory.create(metric.type).getOverviewProperties(metric);

  const allProperties: IMetricOverviewPropertyDefinition[] = [
    {
      key: "edited-on-date",
      node: <FormatDate value={metric.editedOn} />,
      label: "Edited",
    },
    {
      key: "shared-with",
      node: (
        <AvatarGroup max={4} sx={{ display: "inline-flex" }}>
          {Object.keys(metric.permissions).map((i) => {
            const u = metric.permissions[i].user;
            return (
              <Avatar
                key={u.name}
                alt={u.displayName}
                src={u.imageUrl}
                sx={{ width: "15px", height: "15px" }}
              />
            );
          })}
        </AvatarGroup>
      ),
      hideWhen: () => !Object.keys(metric.permissions).length,
      label: "Shared with",
    },
    ...properties,
  ];

  return (
    <>
      {allProperties
        .filter((p) => !p.hideWhen || !p.hideWhen())
        .map((p) => (
          <Property key={p.key}>
            <Typography component="span" sx={{ fontWeight: "200" }}>
              {p.label}
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
  margin-top: ${(p) => p.theme.spacing(2)};

  :not(:last-of-type)::after {
    content: "\\00B7";
    margin: 0 0.8rem;
  }
`;
