import React, { useState } from "react";
import { styled, Typography } from "@mui/material";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import { IAdminUserItem } from "../../serverApi/IAdminUserItem";
import { IPropertyDefinition } from "../common/IPropertyDefinition";
import { IAction } from "../common/actions/IAction";
import { ListItemFooterRow } from "../overview/ListItemFooterRow";
import { DeleteButtons } from "../common/DeleteButtons";
import { FormatDate } from "../common/FormatDate";
import { useDeleteAdminUserMutation } from "../../serverApi/reactQuery/mutations/useDeleteAdminUserMutation";
import { TitleRow } from "../details/scraps/TitleRow";
import { ReadonlyTitle } from "../overview/ReadonlyTitle";

export const AdminUserListItem: React.FC<{
  user: IAdminUserItem;
  hasFocus: boolean;
}> = ({ user, hasFocus }) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const deleteUserMutation = useDeleteAdminUserMutation(user.id, user.name);

  const properties: IPropertyDefinition[] = [
    {
      key: "journals",
      label: null,
      node: () => <>{user.journalsCount} journals</>,
    },
    {
      key: "entries",
      label: null,
      node: () => <>{user.entriesCount} entries</>,
    },
    {
      key: "last-login",
      label: "Last login",
      node: () => (
        <FormatDate value={user.lastLoginDate} fallbackValue="never" />
      ),
    },
  ];

  const actions: IAction[] = [
    {
      key: "delete",
      label: "Delete user",
      icon: <DeleteOutlined fontSize="small" />,
      onClick: () => setIsConfirmingDelete(true),
    },
  ];

  return (
    <>
      <TitleRow hasFocus={hasFocus} hasNoContent={true} hasTitle={true}>
        <ReadonlyTitle
          entity={user}
          hasFocus={hasFocus}
          title={
            <>
              {user.displayName ? `${user.displayName} · ` : ""}
              {user.name}
            </>
          }
        />
      </TitleRow>
      <ListItemFooterRow
        hasFocus={hasFocus}
        properties={properties}
        actions={actions}
      />
      {isConfirmingDelete ? (
        <ConfirmContainer>
          <Typography>
            Are you sure you want to delete <b>{user.name}</b>? This will
            permanently delete the user and all of their journals and entries.
            You will not be able to recover this data.
          </Typography>
          <DeleteButtons
            entityType="user"
            requiresConfirmation={true}
            confirmationValue={user.name}
            onCancel={() => setIsConfirmingDelete(false)}
            onDelete={() => deleteUserMutation.mutate()}
          />
        </ConfirmContainer>
      ) : null}
    </>
  );
};

const ConfirmContainer = styled("div")`
  margin-top: ${(p) => p.theme.spacing(2)};
`;
