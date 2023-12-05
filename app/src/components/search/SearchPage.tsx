import React from "react";
import { Page } from "../layout/pages/Page";
import { PageTitle } from "../layout/pages/PageTitle";
import { Icon, IconStyle } from "../common/Icon";
import { SearchOutlined } from "@mui/icons-material";
import { GlobalSearch } from "./GlobalSearch";

export const SearchPage: React.FC = () => {
  return (
    <Page
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
      enableFilters={true}
    >
      <GlobalSearch />
    </Page>
  );
};
