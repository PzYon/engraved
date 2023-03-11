import React from "react";
import { AddOutlined, VisibilityOutlined } from "@mui/icons-material";
import { AddMetricLauncher } from "./AddMetricLauncher";
import { MetricListItem } from "./MetricListItem";
import { Page } from "../layout/pages/Page";
import { useMetricsQuery } from "../../serverApi/reactQuery/queries/useMetricsQuery";
import { PageTitle } from "../details/PageTitle";
import { MetricTypeIconStyle } from "../common/MetricTypeIcon";
import { Icon } from "../common/Icon";

export const MetricsPage: React.FC<{ showCreate?: boolean }> = ({
  showCreate,
}) => {
  const metrics = useMetricsQuery();

  if (!metrics) {
    return null;
  }

  return (
    <Page
      title={
        <PageTitle
          title={"Overview"}
          icon={
            <Icon style={MetricTypeIconStyle.PageTitle}>
              <VisibilityOutlined />
            </Icon>
          }
        />
      }
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
