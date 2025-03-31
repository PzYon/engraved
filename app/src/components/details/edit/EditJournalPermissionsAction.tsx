import { IJournal } from "../../../serverApi/IJournal";
import React, { useState } from "react";
import { Button, styled, TextField } from "@mui/material";
import { PermissionKindSelector } from "./PermissionKindSelector";
import { PermissionKind } from "../../../serverApi/PermissionKind";
import { IUpdatePermissions } from "../../../serverApi/IUpdatePermissions";
import { UserPermission } from "./UserPermission";
import { ActionIconButton } from "../../common/actions/ActionIconButton";
import { AddOutlined } from "@mui/icons-material";
import { isValidEmail } from "../../../util/utils";
import { useModifyJournalPermissionsMutation } from "../../../serverApi/reactQuery/mutations/useModifyJournalPermissionsMutation";
import { DialogFormButtonContainer } from "../../common/FormButtonContainer";
import { useItemAction } from "../../common/actions/searchParamHooks";
import { MuiTheme } from "../../../theming/engravedTheme";

export const EditJournalPermissionsAction: React.FC<{
  journal: IJournal;
}> = ({ journal }) => {
  const [userName, setUserName] = useState("");
  const [canAdd, setCanAdd] = useState(false);
  const [permissionKind, setPermissionKind] = useState(PermissionKind.Read);
  const [newPermissions, setNewPermissions] = useState<IUpdatePermissions>({});
  const { closeAction } = useItemAction();

  const modifyJournalPermissionsMutation = useModifyJournalPermissionsMutation(
    journal.id,
  );

  return (
    <>
      {Object.keys(journal.permissions).map((k) => (
        <UserPermission
          key={k}
          permissionDefinition={journal.permissions[k]}
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
          sx={{ flexGrow: 1 }}
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
        <ActionIconButton
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

      <DialogFormButtonContainer>
        <Button variant="outlined" onClick={closeAction}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            modifyJournalPermissionsMutation.mutate({ newPermissions })
          }
        >
          Save
        </Button>
      </DialogFormButtonContainer>
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
  margin: ${(p: MuiTheme) => p.theme.spacing(4)} 0
    ${(p: MuiTheme) => p.theme.spacing(2)} 0;
  display: flex;
  justify-items: center;

  & > * {
    margin-right: ${(p: MuiTheme) => p.theme.spacing(2)};

    &:last-of-type {
      margin-right: 0;
    }
  }
`;

const NewPermissionsContainer = styled("div")`
  background-color: #f4f2f2;
`;
