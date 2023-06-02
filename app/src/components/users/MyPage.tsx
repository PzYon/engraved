import React from "react";
import { Page } from "../layout/pages/Page";
import { PageTitle } from "../layout/pages/PageTitle";
import { Icon, IconStyle } from "../common/Icon";
import { HistoryOutlined } from "@mui/icons-material";
import { useAppContext } from "../../AppContext";
import { Activities } from "../activities/Activities";

export const MyPage: React.FC = () => {
  const { user } = useAppContext();

  if (!user) {
    return null;
  }

  return (
    <Page
      title={
        <PageTitle
          title={"My Activities"}
          icon={
            <Icon style={IconStyle.PageTitle}>
              <HistoryOutlined />
            </Icon>
          }
        />
      }
      enableFilters={true}
      actions={[]}
    >
      <Activities />
    </Page>
  );
};
