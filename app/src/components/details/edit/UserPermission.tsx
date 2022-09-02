import React from "react";
import { IPermissionDefinition } from "../../../serverApi/IPermissionDefinition";
import { PermissionKind } from "../../../serverApi/PermissionKind";
import { Chip, Typography } from "@mui/material";
import { User } from "../../common/User";
import { IconButtonWrapper } from "../../common/IconButtonWrapper";
import { DeleteOutlined } from "@mui/icons-material";

export const UserPermission: React.FC<{
  permissionDefinition: IPermissionDefinition;
  setPermissions: (userName: string, permissionKind: PermissionKind) => void;
}> = ({ permissionDefinition, setPermissions }) => {
  if (!permissionDefinition.user) {
    return <div>no user, why?</div>;
  }

  return (
    <Typography sx={{ display: "flex", alignItems: "center" }}>
      <User user={permissionDefinition.user} showUserName={true} />
      <Chip
        label={permissionDefinition.kind?.toString()}
        title={permissionDefinition.kind?.toString()}
      />
      <IconButtonWrapper
        action={{
          key: "remove",
          label: "Remove",
          icon: <DeleteOutlined fontSize="small" />,
          onClick: () =>
            setPermissions(permissionDefinition.user.name, PermissionKind.None),
        }}
      />
    </Typography>
  );
};
