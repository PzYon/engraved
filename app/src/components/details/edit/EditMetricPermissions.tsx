import { IMetric } from "../../../serverApi/IMetric";
import React, { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { PermissionKindSelector } from "./PermissionKindSelector";
import { PermissionKind } from "../../../serverApi/PermissionKind";
import { IPermissions } from "../../../serverApi/IPermissions";
import { ServerApi } from "../../../serverApi/ServerApi";
import { useAppContext } from "../../../AppContext";

export const EditMetricPermissions: React.FC<{ metric: IMetric }> = ({
  metric,
}) => {
  const { setAppAlert } = useAppContext();

  const [userName, setUserName] = useState("");
  const [permissionKind, setPermissionKind] = useState(PermissionKind.Read);

  const [newPermissions, setNewPermissions] = useState<IPermissions>({});

  return (
    <div>
      <Typography>Existing Permissions:</Typography>
      {Object.keys(metric.permissions).map((k) => (
        <div key={k}>
          {k}: {metric.permissions[k]}
        </div>
      ))}
      <Typography>New Permissions:</Typography>
      {Object.keys(newPermissions).map((k) => (
        <div key={k}>
          {k}: {newPermissions[k]}
        </div>
      ))}
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
          const tempPermissions = { ...newPermissions };
          tempPermissions[userName] = permissionKind;
          setNewPermissions(tempPermissions);

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
};
