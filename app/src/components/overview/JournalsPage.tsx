import React, { useState } from "react";
import { StarOutline, VisibilityOutlined } from "@mui/icons-material";
import { Page } from "../layout/pages/Page";
import { PageTitle } from "../layout/pages/PageTitle";
import { Icon, IconStyle } from "../common/Icon";
import { Journals } from "./Journals";
import { ActionFactory } from "../common/actions/ActionFactory";
import { getPageTabs } from "../layout/tabs/getPageTabs";

export const JournalsPage: React.FC = () => {
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  return (
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
      actions={[
        {
          icon: <StarOutline fontSize="small" />,
          label: "Unlike",
          key: "unlike",
          onClick: () => setFavoritesOnly(!favoritesOnly),
          isNotActive: !favoritesOnly,
        },
        ActionFactory.newJournal(),
      ]}
      enableFilters={true}
    >
      <Journals favoritesOnly={favoritesOnly} />
    </Page>
  );
};
