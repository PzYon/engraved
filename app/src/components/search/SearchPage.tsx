import React from "react";
import { Page } from "../layout/pages/Page";
import { PageTitle } from "../layout/pages/PageTitle";
import { Icon } from "../common/Icon";
import { SearchOutlined } from "@mui/icons-material";
import { Entities } from "./Entities";
import { FilterMode } from "../layout/pages/PageContext";
import { IconStyle } from "../common/IconStyle";

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
      filterMode={FilterMode.Text}
      showFilters={true}
      hideActions={true}
    >
      <Entities />
    </Page>
  );
};
