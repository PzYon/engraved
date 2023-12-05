import React from "react";
import { Page } from "../layout/pages/Page";
import { PageTitle } from "../layout/pages/PageTitle";
import { Icon, IconStyle } from "../common/Icon";
import { SearchOutlined } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { useSearchEntitiesQuery } from "../../serverApi/reactQuery/queries/useSearchEntitiesQuery";
import { usePageContext } from "../layout/pages/PageContext";

export const SearchPage: React.FC = () => {
  const { searchText } = usePageContext();
  const entities = useSearchEntitiesQuery(searchText);

  console.log("entities: " + entities);

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
      <Typography>Not ready yet... Coming soon. Maybe. :)</Typography>
    </Page>
  );
};
