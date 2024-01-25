import { IUserPermissions } from "../../serverApi/IUserPermissions";
import { useAppContext } from "../../AppContext";
import { useMemo } from "react";
import { UserRole } from "../../serverApi/UserRole";
import { IUser } from "../../serverApi/IUser";

export const useJournalPermissions = (permissions: IUserPermissions) => {
  const { user } = useAppContext();

  return useMemo(() => getPermission(permissions, user), [user, permissions]);
};

function getPermission(permissions: IUserPermissions, user: IUser) {
  if (!permissions) {
    return null;
  }

  return {
    owner: getOwner(permissions),
    allExceptOwner: getAllExceptOwner(permissions),
    userId: user.id,
    userRole: getRoleForUser(user.id, permissions),
  };
}

function getRoleForUser(
  userId: string,
  permissions: IUserPermissions,
): UserRole {
  return permissions[userId].userRole;
}

function getOwner(permissions: IUserPermissions): IUser {
  return Object.values(permissions).find(
    (permissionDefinition) => permissionDefinition.userRole === UserRole.Owner,
  )?.user;
}

function getAllExceptOwner(permissions: IUserPermissions) {
  return Object.values(permissions)
    .filter((x) => x.userRole !== UserRole.Owner)
    .map((x) => x.user);
}
