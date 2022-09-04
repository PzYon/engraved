import { PermissionKind } from "./PermissionKind";

export interface IUpdatePermissions {
  [userName: string]: PermissionKind;
}
