import React from "react";
import { IMetric } from "../../serverApi/IMetric";
import { FormatDate } from "../common/FormatDate";
import { SharedWith } from "../common/SharedWith";
import { Properties } from "../common/Properties";
import { styled } from "@mui/material";

export const MetricProperties: React.FC<{ metric: IMetric }> = ({ metric }) => (
  <Host>
    <Properties
      properties={[
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
      ]}
    />
  </Host>
);

const Host = styled("div")`
  margin-top: ${(p) => p.theme.spacing(2)};
`;
