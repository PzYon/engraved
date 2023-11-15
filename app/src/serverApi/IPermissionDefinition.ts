import { PermissionKind } from "./PermissionKind";
import { IUser } from "./IUser";
import { UserRole } from "./UserRole";

export interface IPermissionDefinition {
  kind: PermissionKind;
  user?: IUser;
  userRole?: UserRole;
}
