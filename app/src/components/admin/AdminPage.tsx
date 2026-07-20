import React from "react";
import { Typography } from "@mui/material";
import AdminPanelSettingsOutlined from "@mui/icons-material/AdminPanelSettingsOutlined";
import { Page } from "../layout/pages/Page";
import { PageTitle } from "../layout/pages/PageTitle";
import { PageSection } from "../layout/pages/PageSection";
import { Icon } from "../common/Icon";
import { IconStyle } from "../common/IconStyle";
import { useApiAdminUsersQuery } from "../../serverApi/reactQuery/queries/useApiAdminUsersQuery";
import { AdminUserListItem } from "./AdminUserListItem";
import { useAppContext } from "../../AppContext";

export const AdminPage: React.FC = () => {
  const { user } = useAppContext();
  const users = useApiAdminUsersQuery();

  if (!user.isAdmin) {
    return (
      <Page documentTitle="Admin" title="Admin" actions={[]}>
        <PageSection>
          <Typography>You are not allowed to view this page.</Typography>
        </PageSection>
      </Page>
    );
  }

  return (
    <Page
      documentTitle="Admin"
      title={
        <PageTitle
          title="Admin"
          icon={
            <Icon style={IconStyle.Large}>
              <AdminPanelSettingsOutlined />
            </Icon>
          }
        />
      }
      actions={[]}
    >
      <PageSection title={users ? `Users (${users.length})` : "Users"}>
        {users?.map((u) => (
          <AdminUserListItem key={u.id} user={u} />
        ))}
      </PageSection>
    </Page>
  );
};
