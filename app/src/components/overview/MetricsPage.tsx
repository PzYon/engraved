import React, { useEffect, useState } from "react";
import { IMetric } from "../../serverApi/IMetric";
import { ServerApi } from "../../serverApi/ServerApi";
import { useAppContext } from "../../AppContext";
import { AddOutlined } from "@mui/icons-material";
import { AddMetricLauncher } from "./AddMetricLauncher";
import { MetricListItem } from "./MetricListItem";
import { Page } from "../layout/pages/Page";

export const MetricsPage: React.FC<{ showCreate?: boolean }> = ({
  showCreate,
}) => {
  const [metrics, setMetrics] = useState<IMetric[]>([]);

  const { setAppAlert } = useAppContext();

  useEffect(() => {
    ServerApi.getMetrics()
      .then((data) => {
        setMetrics(data);
      })
      .catch((e) => {
        setAppAlert({
          title: e.message,
          message: e.message,
          type: "error",
        });
      });
  }, []);

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
