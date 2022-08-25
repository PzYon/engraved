import { IMetric } from "../../../serverApi/IMetric";
import React, { useState } from "react";
import { TextField } from "@mui/material";
import { PermissionKindSelector } from "./PermissionKindSelector";
import { PermissionKind } from "../../../serverApi/PermissionKind";
import { IPermissions } from "../../../serverApi/IPermissions";

export const EditMetricPermissions: React.FC<{ metric: IMetric }> = ({
  metric,
}) => {
  const [newPermissions, setNewPermissions] = useState<IPermissions>();

  return (
    <div>
      {Object.keys(metric.permissions).map((k) => (
        <div key={k}>
          {k}: {metric.permissions[k]}
        </div>
      ))}
      <div>
        <TextField onBlur={(event) => alert(event.target.value)} />
        <PermissionKindSelector
          permissionKind={PermissionKind.None}
          onChange={(kind) => alert(kind)}
        />
      </div>
    </div>
  );
};
