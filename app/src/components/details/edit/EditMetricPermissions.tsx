import { IMetric } from "../../../serverApi/IMetric";
import React, { useState } from "react";
import { Button, styled, TextField, Typography } from "@mui/material";
import { PermissionKindSelector } from "./PermissionKindSelector";
import { PermissionKind } from "../../../serverApi/PermissionKind";
import { ServerApi } from "../../../serverApi/ServerApi";
import { useAppContext } from "../../../AppContext";
import { IUpdatePermissions } from "../../../serverApi/IUpdatePermissions";
import { UserPermission } from "./UserPermission";
import { IconButtonWrapper } from "../../common/IconButtonWrapper";
import { AddOutlined } from "@mui/icons-material";
import { isValidEmail } from "../../common/utils";

export const EditMetricPermissions: React.FC<{ metric: IMetric }> = ({
  metric,
}) => {
  const { setAppAlert } = useAppContext();

  const [userName, setUserName] = useState("");
  const [canAdd, setCanAdd] = useState(false);
  const [permissionKind, setPermissionKind] = useState(PermissionKind.Read);
  const [newPermissions, setNewPermissions] = useState<IUpdatePermissions>({});

  return (
    <div>
      {Object.keys(metric.permissions).map((k) => (
        <Typography key={k}>
          <UserPermission
            permissionDefinition={metric.permissions[k]}
            removePermissions={(u) => setPermissions(u, PermissionKind.None)}
          />
        </Typography>
      ))}
      <Typography color={"primary.main"}>
        {Object.keys(newPermissions).map((k) => (
          <UserPermission
            key={k}
            permissionDefinition={{
              kind: newPermissions[k],
              user: { name: k },
            }}
            removePermissions={removeNewPermissions}
          />
        ))}
      </Typography>

      <AddNewContainer>
        <TextField
          label={"Mail Address"}
          onChange={(event) => {
            const value = event.target.value;
            setUserName(value);
            setCanAdd(isValidEmail(value));
          }}
          value={userName}
        />
        <PermissionKindSelector
          permissionKind={permissionKind}
          onChange={(kind) => setPermissionKind(kind)}
        />
        <IconButtonWrapper
          disabled={!canAdd}
          action={{
            key: "add",
            label: "Add",
            icon: <AddOutlined fontSize="small" />,
            onClick: () => {
              setPermissions(userName, permissionKind);

              setUserName("");
              setPermissionKind(PermissionKind.Read);
            },
          }}
        />
      </AddNewContainer>

      <Button
        variant="outlined"
        color="primary"
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
  );

  function removeNewPermissions(userName: string) {
    const tempPermissions = { ...newPermissions };
    delete tempPermissions[userName];
    setNewPermissions(tempPermissions);
  }

  function setPermissions(userName: string, permissionKind: PermissionKind) {
    const tempPermissions = { ...newPermissions };
    tempPermissions[userName] = permissionKind;
    setNewPermissions(tempPermissions);
  }
};

const AddNewContainer = styled("div")`
  margin: ${(p) => p.theme.spacing(4)} 0 ${(p) => p.theme.spacing(2)} 0;
  display: flex;
  justify-items: center;
  & > * {
    margin-right: ${(p) => p.theme.spacing(2)};

    &:last-of-type {
      margin-right: 0;
    }
  }
`;
