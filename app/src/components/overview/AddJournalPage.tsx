import React from "react";
import { AddJournal } from "./AddJournal";
import { PageTitle } from "../layout/pages/PageTitle";
import { Icon } from "../common/Icon";
import { AddOutlined } from "@mui/icons-material";
import { Page } from "../layout/pages/Page";
import { IconStyle } from "../common/IconStyle";

export const AddJournalPage: React.FC = () => {
  return (
    <Page
      title={
        <PageTitle
          title={"Add Journal"}
          icon={
            <Icon style={IconStyle.PageTitle}>
              <AddOutlined />
            </Icon>
          }
        />
      }
      actions={[]}
    >
      <AddJournal />
    </Page>
  );
};
