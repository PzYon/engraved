import React from "react";
import { IMetric } from "../../serverApi/IMetric";
import { MetricTypeIcon, MetricTypeIconStyle } from "../common/MetricTypeIcon";
import { PageTitle } from "./PageTitle";

export const MetricPageTitle: React.FC<{ metric: IMetric }> = ({ metric }) => {
  if (!metric) {
    return null;
  }

  return (
    <PageTitle
      icon={
        <MetricTypeIcon
          type={metric?.type}
          style={MetricTypeIconStyle.PageTitle}
        />
      }
      title={metric?.name}
    />
  );
};
