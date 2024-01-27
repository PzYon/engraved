import React from "react";
import { Page } from "../layout/pages/Page";
import { PageTitle } from "../layout/pages/PageTitle";
import { Icon, IconStyle } from "../common/Icon";
import { SearchOutlined } from "@mui/icons-material";
import { GlobalSearch } from "./GlobalSearch";
import { FilterMode } from "../layout/pages/PageContext";

export const SearchPage: React.FC = () => {
  return (
    <Page
      pageType="search"
      title={
        <PageTitle
          title={"Search"}
          icon={
            <Icon style={IconStyle.PageTitle}>
              <SearchOutlined />
            </Icon>
          }
        />
      }
      filterMode={FilterMode.Text}
      showFilters={true}
      hideActions={true}
    >
      <GlobalSearch />
    </Page>
  );
};
