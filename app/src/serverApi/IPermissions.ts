import { PermissionKind } from "./PermissionKind";

export interface IPermissions {
  [userid: string]: PermissionKind;
}
