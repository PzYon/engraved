import React from "react";
import { AddOutlined } from "@mui/icons-material";
import { AddMetricLauncher } from "./AddMetricLauncher";
import { MetricListItem } from "./MetricListItem";
import { Page } from "../layout/pages/Page";
import { useMetricsQuery } from "../../serverApi/reactQuery/queries/useMetricsQuery";

export const MetricsPage: React.FC<{ showCreate?: boolean }> = ({
  showCreate,
}) => {
  const metrics = useMetricsQuery();

  if (!metrics) {
    return null;
  }

  return (
    <Page
      title="Overview"
      actions={[
        {
          href: "/metrics/create",
          icon: <AddOutlined fontSize="small" />,
          label: "Add Metric",
          key: "add_metric",
        },
      ]}
    >
      {metrics.map((metric) => (
        <MetricListItem key={metric.id} metric={metric} />
      ))}

      {showCreate ? <AddMetricLauncher /> : null}
    </Page>
  );
};
