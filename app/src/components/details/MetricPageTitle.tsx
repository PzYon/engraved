import React from "react";
import { IMetric } from "../../serverApi/IMetric";
import { PageTitle } from "../layout/pages/PageTitle";
import { IconStyle } from "../common/Icon";
import { MetricTypeIcon } from "../common/MetricTypeIcon";

export const MetricPageTitle: React.FC<{ metric: IMetric }> = ({ metric }) => {
  if (!metric) {
    return null;
  }

  return (
    <PageTitle
      icon={<MetricTypeIcon type={metric?.type} style={IconStyle.PageTitle} />}
      title={metric?.name}
    />
  );
};
