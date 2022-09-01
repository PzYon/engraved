import { IMetric } from "../../../serverApi/IMetric";
import React, { useState } from "react";
import { Avatar, Button, TextField, Typography } from "@mui/material";
import { PermissionKindSelector } from "./PermissionKindSelector";
import { PermissionKind } from "../../../serverApi/PermissionKind";
import { ServerApi } from "../../../serverApi/ServerApi";
import { useAppContext } from "../../../AppContext";
import { IconButtonWrapper } from "../../common/IconButtonWrapper";
import { DeleteOutlined } from "@mui/icons-material";
import { IUpdatePermissions } from "../../../serverApi/IUpdatePermissions";
import { IPermissionDefinition } from "../../../serverApi/IPermissionDefinition";

export const EditMetricPermissions: React.FC<{ metric: IMetric }> = ({
  metric,
}) => {
  const { setAppAlert } = useAppContext();

  const [userName, setUserName] = useState("");
  const [permissionKind, setPermissionKind] = useState(PermissionKind.Read);

  const [newPermissions, setNewPermissions] = useState<IUpdatePermissions>({});

  return (
    <div>
      <Typography>Permissions</Typography>
      {Object.keys(metric.permissions).map((k) => (
        <Typography key={k}>
          <UserPermission
            permissionDefinition={metric.permissions[k]}
            setPermissions={setPermissions}
          />
        </Typography>
      ))}
      <Typography color={"gray"}>
        {Object.keys(newPermissions).map((k) => (
          <div key={k}>
            {k}: {newPermissions[k]}
          </div>
        ))}
      </Typography>
      <TextField
        onChange={(event) => setUserName(event.target.value)}
        value={userName}
      />
      <PermissionKindSelector
        permissionKind={permissionKind}
        onChange={(kind) => setPermissionKind(kind)}
      />
      <Button
        variant="outlined"
        onClick={() => {
          setPermissions(userName, permissionKind);

          setUserName("");
          setPermissionKind(PermissionKind.Read);
        }}
      >
        Add
      </Button>

      <div>
        <Button
          onClick={() => {
            ServerApi.modifyMetricPermissions(metric.id, newPermissions)
              .then(async () => {
                setAppAlert({
                  title: `Modified metric permissions`,
                  type: "success",
                });
              })
              .catch((e) => {
                setAppAlert({
                  title: "Failed to modify metric permissions",
                  message: e.message,
                  type: "error",
                });
              });
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );

  function setPermissions(userName: string, permissionKind: PermissionKind) {
    const tempPermissions = { ...newPermissions };
    tempPermissions[userName] = permissionKind;
    setNewPermissions(tempPermissions);
  }
};

export const UserPermission: React.FC<{
  permissionDefinition: IPermissionDefinition;
  setPermissions: (userName: string, permissionKind: PermissionKind) => void;
}> = ({ permissionDefinition, setPermissions }) => {
  if (!permissionDefinition.user) {
    return <div>no user, why?</div>;
  }

  return (
    <Typography>
      <Avatar
        alt={
          permissionDefinition.user.displayName ||
          permissionDefinition.user.name
        }
        src={permissionDefinition.user.imageUrl}
      />

      {permissionDefinition.kind}
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
