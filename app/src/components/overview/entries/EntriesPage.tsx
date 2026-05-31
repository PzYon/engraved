import React, { Suspense } from "react";
import { Page } from "../../layout/pages/Page";
import { PageTitle } from "../../layout/pages/PageTitle";
import { Icon } from "../../common/Icon";
import List from "@mui/icons-material/List";
import { useAppContext } from "../../../AppContext";
import { Entries } from "./Entries";
import { getPageTabs } from "../../layout/tabs/getPageTabs";
import { FilterMode } from "../../layout/pages/PageContext";
import { IconStyle } from "../../common/IconStyle";
import { CircularProgress } from "@mui/material";

export const EntriesPage: React.FC = () => {
  const { user } = useAppContext();

  if (!user) {
    return null;
  }

  return (
    <Page
      tabs={getPageTabs("entries")}
      documentTitle={"Entries"}
      title={
        <PageTitle
          title={"Entries"}
          icon={
            <Icon style={IconStyle.Large}>
              <List />
            </Icon>
          }
        />
      }
      filterMode={FilterMode.All}
      actions={[]}
    >
      {/* Suspense is used here so that a loading indicator is shown while
          entries load, instead of rendering nothing (blank page content). */}
      <Suspense fallback={<CircularProgress aria-label="Loading entries" />}>
        <Entries />
      </Suspense>
    </Page>
  );
};
