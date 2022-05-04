import React, { useEffect, useState } from "react";
import { IMetric } from "../../serverApi/IMetric";
import { ServerApi } from "../../serverApi/ServerApi";
import { useAppContext } from "../../AppContext";
import { AddOutlined } from "@mui/icons-material";
import { AddMetricLauncher } from "./AddMetricLauncher";
import { MetricListItem } from "./MetricListItem";

export const MetricList: React.FC<{ showCreate?: boolean }> = ({
  showCreate,
}) => {
  const [metrics, setMetrics] = useState<IMetric[]>([]);

  const { setAppAlert, setPageTitle, setTitleActions } = useAppContext();

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

    setPageTitle("All Your Metrix");

    setTitleActions([
      {
        href: "/metrics/create",
        icon: <AddOutlined />,
        label: "Add Metric",
        key: "add_metric",
      },
    ]);

    return () => {
      setPageTitle(null);
      setTitleActions([]);
    };
  }, []);

  return (
    <>
      {metrics.map((metric) => (
        <MetricListItem key={metric.id} metric={metric} />
      ))}

      {showCreate ? <AddMetricLauncher /> : null}
    </>
  );
};
