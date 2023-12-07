import React from "react";
import { Page } from "../layout/pages/Page";
import { PageTitle } from "../layout/pages/PageTitle";
import { Icon, IconStyle } from "../common/Icon";
import { HistoryOutlined } from "@mui/icons-material";
import { useAppContext } from "../../AppContext";
import { Entries } from "./Entries";
import { getPageTabs } from "../layout/tabs/getPageTabs";
import { FilterMode } from "../layout/pages/PageContext";

export const EntriesPage: React.FC = () => {
  const { user } = useAppContext();

  if (!user) {
    return null;
  }

  return (
    <Page
      tabs={getPageTabs("entries")}
      title={
        <PageTitle
          title={"Entries"}
          icon={
            <Icon style={IconStyle.PageTitle}>
              <HistoryOutlined />
            </Icon>
          }
        />
      }
      filterMode={FilterMode.All}
      actions={[]}
    >
      <Entries />
    </Page>
  );
};
