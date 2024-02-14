import React, { useState } from "react";
import { StarOutline, VisibilityOutlined } from "@mui/icons-material";
import { Page } from "../layout/pages/Page";
import { PageTitle } from "../layout/pages/PageTitle";
import { Icon } from "../common/Icon";
import { Journals } from "./Journals";
import { ActionFactory } from "../common/actions/ActionFactory";
import { getPageTabs } from "../layout/tabs/getPageTabs";
import { FilterMode } from "../layout/pages/PageContext";
import { IconStyle } from "../common/IconStyle";

export const JournalsPage: React.FC = () => {
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  return (
    <Page
      pageType="overview"
      data-testid={"page"}
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
          label: "Show favorites only",
          key: "favorites-only",
          onClick: () => setFavoritesOnly(!favoritesOnly),
          isNotActive: !favoritesOnly,
        },
        ActionFactory.newJournal(),
      ]}
      filterMode={FilterMode.All}
    >
      <Journals favoritesOnly={favoritesOnly} />
    </Page>
  );
};
