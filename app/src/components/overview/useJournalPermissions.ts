import { IUserPermissions } from "../../serverApi/IUserPermissions";
import { useAppContext } from "../../AppContext";
import { useMemo } from "react";
import { UserRole } from "../../serverApi/UserRole";
import { IUser } from "../../serverApi/IUser";

export const useJournalPermissions = (permissions: IUserPermissions) => {
  const { user } = useAppContext();

  return useMemo(() => {
    const owner = getOwner(permissions);
    return {
      owner: owner,
      allExceptOwner: getAllExceptOwner(permissions),
      userId: user.id,
      userRole: getRoleForUser(user.id, permissions),
    };
  }, [user, permissions]);
};

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
