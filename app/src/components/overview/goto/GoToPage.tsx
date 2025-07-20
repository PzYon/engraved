import React from "react";
import { Page } from "../../layout/pages/Page";
import { PageTitle } from "../../layout/pages/PageTitle";
import { Icon } from "../../common/Icon";
import Shortcut from "@mui/icons-material/Shortcut";
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
              <Shortcut />
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
