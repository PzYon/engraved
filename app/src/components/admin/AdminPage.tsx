import React from "react";
import AdminPanelSettingsOutlined from "@mui/icons-material/AdminPanelSettingsOutlined";
import { Page } from "../layout/pages/Page";
import { PageTitle } from "../layout/pages/PageTitle";
import { PageSection } from "../layout/pages/PageSection";
import { Icon } from "../common/Icon";
import { IconStyle } from "../common/IconStyle";
import { useApiAdminUsersQuery } from "../../serverApi/reactQuery/queries/useApiAdminUsersQuery";
import { AdminUserListItem } from "./AdminUserListItem";

// Access is gated by adminRoute's beforeLoad (see App.tsx) - by the time this renders, the current
// user is already known to be an admin.
export const AdminPage: React.FC = () => {
  const users = useApiAdminUsersQuery();

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
