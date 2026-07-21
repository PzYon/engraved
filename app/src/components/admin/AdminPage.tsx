import React from "react";
import AdminPanelSettingsOutlined from "@mui/icons-material/AdminPanelSettingsOutlined";
import { Page } from "../layout/pages/Page";
import { PageTitle } from "../layout/pages/PageTitle";
import { Icon } from "../common/Icon";
import { IconStyle } from "../common/IconStyle";
import { useApiAdminUsersQuery } from "../../serverApi/reactQuery/queries/useApiAdminUsersQuery";
import { AdminUserListItem } from "./AdminUserListItem";
import { OverviewList } from "../overview/overviewList/OverviewList";
import { IAdminUserOverview } from "../../serverApi/IAdminUserOverview";

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
      <OverviewList
        items={(users as IAdminUserOverview[]) ?? []}
        renderItem={(u) => (
          <AdminUserListItem key={u.id} user={u as IAdminUserOverview} />
        )}
      />
    </Page>
  );
};
