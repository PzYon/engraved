import React from "react";
import { IPermissionDefinition } from "../../../serverApi/IPermissionDefinition";
import { Chip, styled } from "@mui/material";
import { User } from "../../common/User";
import { IconButtonWrapper } from "../../common/actions/IconButtonWrapper";
import { DeleteOutlined } from "@mui/icons-material";

export const UserPermission: React.FC<{
  permissionDefinition: IPermissionDefinition;
  removePermissions: (userName: string) => void;
}> = ({ permissionDefinition, removePermissions }) => {
  if (!permissionDefinition.user) {
    return <div>no user, why?</div>;
  }

  return (
    <Host>
      <User
        user={permissionDefinition.user}
        showUserName={true}
        style={{ flexGrow: 1 }}
      />
      <Chip
        label={permissionDefinition.kind?.toString()}
        title={permissionDefinition.kind?.toString()}
      />
      <IconButtonWrapper
        action={{
          key: "remove",
          label: "Remove",
          icon: <DeleteOutlined fontSize="small" />,
          onClick: () => removePermissions(permissionDefinition.user.name),
        }}
      />
    </Host>
  );
};

const Host = styled("div")`
  display: flex;
  align-items: center;
`;
