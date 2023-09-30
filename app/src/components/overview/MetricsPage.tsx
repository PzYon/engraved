import React from "react";
import { VisibilityOutlined } from "@mui/icons-material";
import { Page } from "../layout/pages/Page";
import { PageTitle } from "../layout/pages/PageTitle";
import { Icon, IconStyle } from "../common/Icon";
import { Metrics } from "./Metrics";
import { ActionFactory } from "../common/actions/ActionFactory";
import { getPageTabs } from "../layout/tabs/getPageTabs";

export const MetricsPage: React.FC = () => (
  <Page
    tabs={getPageTabs()}
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
