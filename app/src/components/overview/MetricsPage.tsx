import React from "react";
import { AddOutlined, VisibilityOutlined } from "@mui/icons-material";
import { MetricListItem } from "./MetricListItem";
import { Page } from "../layout/pages/Page";
import { useMetricsQuery } from "../../serverApi/reactQuery/queries/useMetricsQuery";
import { PageTitle } from "../layout/pages/PageTitle";
import { Icon, IconStyle } from "../common/Icon";
import { usePageContext } from "../layout/pages/PageContext";

export const MetricsPage: React.FC = () => {
  const { searchText } = usePageContext();
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
            <Icon style={IconStyle.PageTitle}>
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
      enableSearch={true}
    >
      {metrics.map((metric) => (
        <MetricListItem key={metric.id} metric={metric} />
      ))}
    </Page>
  );
};
