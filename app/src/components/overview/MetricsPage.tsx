import React from "react";
import { VisibilityOutlined } from "@mui/icons-material";
import { Page } from "../layout/pages/Page";
import { PageTitle } from "../layout/pages/PageTitle";
import { Icon, IconStyle } from "../common/Icon";
import { Metrics } from "./Metrics";
import { ActionFactory } from "../common/IconButtonWrapper";

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
    actions={[ActionFactory.createMetric()]}
    enableFilters={true}
  >
    <Metrics />
  </Page>
);
