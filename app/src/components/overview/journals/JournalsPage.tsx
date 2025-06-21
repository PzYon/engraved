import React, { useMemo } from "react";
import { ListAlt, StarOutline } from "@mui/icons-material";
import { Page } from "../../layout/pages/Page";
import { PageTitle } from "../../layout/pages/PageTitle";
import { Icon } from "../../common/Icon";
import { Journals } from "./Journals";
import { ActionFactory } from "../../common/actions/ActionFactory";
import { getPageTabs } from "../../layout/tabs/getPageTabs";
import { FilterMode } from "../../layout/pages/PageContext";
import { IconStyle } from "../../common/IconStyle";
import { useEngravedSearchParams } from "../../common/actions/searchParamHooks";

const favoritesOnlyParamName = "favorites-only";

export const JournalsPage: React.FC = () => {
  const searchParams = useEngravedSearchParams();

  const favoritesOnly =
    searchParams.getSearchParam(favoritesOnlyParamName) === "true";

  const actions = useMemo(() => {
    return [
      {
        icon: <StarOutline fontSize="small" />,
        label: "Show favorites only",
        key: favoritesOnlyParamName,
        onClick: () =>
          searchParams.appendSearchParams({
            [favoritesOnlyParamName]: String(!favoritesOnly),
          }),
        isNotActive: !favoritesOnly,
      },
      ActionFactory.newJournal(),
    ];
  }, [favoritesOnly, searchParams]);

  const pageTabs = useMemo(() => getPageTabs("journals"), []);

  return (
    <Page
      tabs={pageTabs}
      documentTitle={"Journals"}
      title={
        <PageTitle
          title={"Journals"}
          icon={
            <Icon style={IconStyle.Large}>
              <ListAlt />
            </Icon>
          }
        />
      }
      actions={actions}
      filterMode={FilterMode.All}
    >
      <Journals favoritesOnly={favoritesOnly} />
    </Page>
  );
};
