import React from "react";
import { Page } from "../../layout/pages/Page";
import { PageTitle } from "../../layout/pages/PageTitle";
import { Icon } from "../../common/Icon";
import { AssistantDirection } from "@mui/icons-material";
import { IconStyle } from "../../common/IconStyle";
import { GoTo } from "./GoTo";

export const GoToPage: React.FC = () => {
  return (
    <Page
      title={
        <PageTitle
          title={"Go To"}
          icon={
            <Icon style={IconStyle.Large}>
              <AssistantDirection />
            </Icon>
          }
        />
      }
      showFilters={false}
      hideActions={true}
    >
      <GoTo />
    </Page>
  );
};
