import React, { useState } from "react";
import { ListAlt, StarOutline } from "@mui/icons-material";
import { Page } from "../../layout/pages/Page";
import { PageTitle } from "../../layout/pages/PageTitle";
import { Icon } from "../../common/Icon";
import { Journals } from "./Journals";
import { ActionFactory } from "../../common/actions/ActionFactory";
import { getPageTabs } from "../../layout/tabs/getPageTabs";
import { FilterMode } from "../../layout/pages/PageContext";
import { IconStyle } from "../../common/IconStyle";

export const JournalsPage: React.FC = () => {
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  return (
    <Page
      tabs={getPageTabs("journals")}
      documentTitle={"Journals"}
      title={
        <PageTitle
          title={"Journals"}
          icon={
            <Icon style={IconStyle.PageTitle}>
              <ListAlt />
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
