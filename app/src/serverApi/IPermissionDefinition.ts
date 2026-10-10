import { PermissionKind } from "./PermissionKind";
import { IPermissionUser } from "./IPermissionUser";
import { UserRole } from "./UserRole";

export interface IPermissionDefinition {
  kind: PermissionKind;
  user?: IPermissionUser;
  userRole?: UserRole;
}
