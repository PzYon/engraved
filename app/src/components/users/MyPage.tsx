import React from "react";
import { Page } from "../layout/pages/Page";
import { PageTitle } from "../layout/pages/PageTitle";
import { Icon, IconStyle } from "../common/Icon";
import { SentimentSatisfiedAltOutlined } from "@mui/icons-material";
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
          title={"This is me."}
          icon={
            <Icon style={IconStyle.PageTitle}>
              <SentimentSatisfiedAltOutlined />
            </Icon>
          }
        />
      }
      actions={[]}
    >
      <Activities />
    </Page>
  );
};
