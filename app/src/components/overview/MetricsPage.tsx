import React from "react";
import { IMetric } from "../../serverApi/IMetric";
import { ServerApi } from "../../serverApi/ServerApi";
import { AddOutlined } from "@mui/icons-material";
import { AddMetricLauncher } from "./AddMetricLauncher";
import { MetricListItem } from "./MetricListItem";
import { Page } from "../layout/pages/Page";
import { useQuery } from "react-query";
import { queryKeysFactory } from "../../serverApi/queryKeysFactory";

export const MetricsPage: React.FC<{ showCreate?: boolean }> = ({
  showCreate,
}) => {
  const { data } = useQuery<IMetric[]>({
    queryKey: queryKeysFactory.getMetrics(),
    queryFn: () => ServerApi.getMetrics(),
  });

  if (!data) {
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
      {data.map((metric) => (
        <MetricListItem key={metric.id} metric={metric} />
      ))}

      {showCreate ? <AddMetricLauncher /> : null}
    </Page>
  );
};
