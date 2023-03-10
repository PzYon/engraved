import { IMetric } from "../../../serverApi/IMetric";
import React, { useState } from "react";
import { Button, styled, TextField } from "@mui/material";
import { PermissionKindSelector } from "./PermissionKindSelector";
import { PermissionKind } from "../../../serverApi/PermissionKind";
import { IUpdatePermissions } from "../../../serverApi/IUpdatePermissions";
import { UserPermission } from "./UserPermission";
import { IconButtonWrapper } from "../../common/IconButtonWrapper";
import { AddOutlined } from "@mui/icons-material";
import { isValidEmail } from "../../../util/utils";
import { useModifyMetricPermissionsMutation } from "../../../serverApi/reactQuery/mutations/useModifyMetricPermissionsMutation";

export const EditMetricPermissions: React.FC<{ metric: IMetric }> = ({
  metric,
}) => {
  const [userName, setUserName] = useState("");
  const [canAdd, setCanAdd] = useState(false);
  const [permissionKind, setPermissionKind] = useState(PermissionKind.Read);
  const [newPermissions, setNewPermissions] = useState<IUpdatePermissions>({});

  const modifyMetricPermissionsMutation = useModifyMetricPermissionsMutation(
    metric.id
  );

  return (
    <>
      {Object.keys(metric.permissions).map((k) => (
        <UserPermission
          key={k}
          permissionDefinition={metric.permissions[k]}
          removePermissions={(u) => setPermissions(u, PermissionKind.None)}
        />
      ))}
      {Object.keys(newPermissions).length ? (
        <NewPermissionsContainer style={{ backgroundColor: "#f4f2f2" }}>
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
        </NewPermissionsContainer>
      ) : null}

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
          action={{
            key: "add",
            label: "Add",
            isDisabled: !canAdd,
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
        onClick={() =>
          modifyMetricPermissionsMutation.mutate({ newPermissions })
        }
      >
        Save
      </Button>
    </>
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

const NewPermissionsContainer = styled("div")`
  background-color: #f4f2f2;
`;
