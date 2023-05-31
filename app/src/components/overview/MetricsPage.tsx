import React from "react";
import { AddOutlined, VisibilityOutlined } from "@mui/icons-material";
import { Page } from "../layout/pages/Page";
import { PageTitle } from "../layout/pages/PageTitle";
import { Icon, IconStyle } from "../common/Icon";
import { Metrics } from "./Metrics";

export const MetricsPage: React.FC = () => (
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
    enableFilters={true}
  >
    <Metrics />
  </Page>
);
