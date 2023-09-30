import React from "react";
import { VisibilityOutlined } from "@mui/icons-material";
import { Page, pageTabs } from "../layout/pages/Page";
import { PageTitle } from "../layout/pages/PageTitle";
import { Icon, IconStyle } from "../common/Icon";
import { Metrics } from "./Metrics";
import { ActionFactory } from "../common/actions/ActionFactory";

export const MetricsPage: React.FC = () => (
  <Page
    tabs={pageTabs}
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
    actions={[ActionFactory.newMetric()]}
    enableFilters={true}
  >
    <Metrics />
  </Page>
);
