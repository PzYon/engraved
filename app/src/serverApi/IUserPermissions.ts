import { PermissionKind } from "./PermissionKind";

export interface IUserPermissions {
  [userid: string]: PermissionKind;
}
