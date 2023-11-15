import { IPermissionDefinition } from "./IPermissionDefinition";
import { UserRole } from "./UserRole";
import { IUser } from "./IUser";

export interface IUserPermissions {
  [userid: string]: IPermissionDefinition;
}

export function getRoleForUser(
  userId: string,
  permissions: IUserPermissions,
): UserRole {
  return permissions[userId].userRole;
}

export function getOwner(permissions: IUserPermissions): IUser {
  return Object.values(permissions).find(
    (permissionDefinition) => permissionDefinition.userRole === UserRole.Owner,
  )?.user;
}

export function getAllExceptOwner(permissions: IUserPermissions) {
  return Object.values(permissions)
    .filter((x) => x.userRole !== UserRole.Owner)
    .map((x) => x.user);
}
