import { Page } from "../../layout/pages/Page";
import { PageTitle } from "../../layout/pages/PageTitle";
import { Icon } from "../../common/Icon";
import { IconStyle } from "../../common/IconStyle";
import { AddOutlined, Style } from "@mui/icons-material";
import { ListOfTags } from "./ListOfTags";
import React from "react";
import { getPageTabs } from "../../layout/tabs/getPageTabs";

export const TagsPage: React.FC = () => {
  return (
    <Page
      title={
        <PageTitle
          title={"Tags"}
          icon={
            <Icon style={IconStyle.Large}>
              <Style />
            </Icon>
          }
        />
      }
      tabs={getPageTabs("tags")}
      showFilters={false}
      actions={[
        {
          hotkey: "alt+n",
          href: "/settings",
          icon: <AddOutlined fontSize="small" />,
          label: "Add tag",
          key: "add-tag",
        },
      ]}
    >
      <ListOfTags />
    </Page>
  );
};
