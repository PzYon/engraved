import React from "react";
import { VisibilityOutlined } from "@mui/icons-material";
import { Page } from "../layout/pages/Page";
import { PageTitle } from "../layout/pages/PageTitle";
import { Icon, IconStyle } from "../common/Icon";
import { Journals } from "./Journals";
import { ActionFactory } from "../common/actions/ActionFactory";
import { getPageTabs } from "../layout/tabs/getPageTabs";

export const JournalsPage: React.FC = () => (
  <Page
    tabs={getPageTabs("journals")}
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
    actions={[ActionFactory.newJournal()]}
    enableFilters={true}
  >
    <Journals />
  </Page>
);
