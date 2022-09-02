import { IMetric } from "../../../serverApi/IMetric";
import React, { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { PermissionKindSelector } from "./PermissionKindSelector";
import { PermissionKind } from "../../../serverApi/PermissionKind";
import { ServerApi } from "../../../serverApi/ServerApi";
import { useAppContext } from "../../../AppContext";
import { IUpdatePermissions } from "../../../serverApi/IUpdatePermissions";
import { UserPermission } from "./UserPermission";

export const EditMetricPermissions: React.FC<{ metric: IMetric }> = ({
  metric,
}) => {
  const { setAppAlert } = useAppContext();

  const [userName, setUserName] = useState("");
  const [permissionKind, setPermissionKind] = useState(PermissionKind.Read);
  const [newPermissions, setNewPermissions] = useState<IUpdatePermissions>({});

  return (
    <div>
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
          <UserPermission
            key={k}
            permissionDefinition={{
              kind: newPermissions[k],
              user: { name: k },
            }}
            setPermissions={() => alert("Not yet implemented")}
          />
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
