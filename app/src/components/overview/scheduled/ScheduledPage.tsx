import { Page } from "../../layout/pages/Page";
import { PageTitle } from "../../layout/pages/PageTitle";
import { Icon } from "../../common/Icon";
import { getPageTabs } from "../../layout/tabs/getPageTabs";
import { FilterMode } from "../../layout/pages/PageContext";
import { NotificationsNone } from "@mui/icons-material";
import { Scheduled } from "./Scheduled";
import { IconStyle } from "../../common/IconStyle";
import React from "react";

export const ScheduledPage: React.FC = () => {
  return (
    <Page
      documentTitle={"Scheduled"}
      title={
        <PageTitle
          title={"Scheduled"}
          icon={
            <Icon style={IconStyle.Large}>
              <NotificationsNone />
            </Icon>
          }
        />
      }
      actions={[]}
      tabs={getPageTabs("scheduled")}
      filterMode={FilterMode.Text}
      hideActions={true}
    >
      <Scheduled />
    </Page>
  );
};
