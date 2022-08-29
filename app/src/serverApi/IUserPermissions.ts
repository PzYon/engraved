import { IPermissionDefinition } from "./IPermissionDefinition";

export interface IUserPermissions {
  [userid: string]: IPermissionDefinition;
}
