import { PermissionKind } from "./PermissionKind";
import { IUser } from "./IUser";

export interface IPermissionDefinition {
  kind: PermissionKind;
  user?: IUser;
}
