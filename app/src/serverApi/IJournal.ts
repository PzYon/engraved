import { JournalType } from "./JournalType";
import { IJournalAttributes } from "./IJournalAttributes";
import { IUserPermissions } from "./IUserPermissions";
import { IJournalThresholdDefinitions } from "./IJournalThresholdDefinitions";
import { IJournalCustomProps } from "./IJournalCustomProps";
import { IEntity } from "./IEntity";
import { UserRole } from "./UserRole";

export interface IJournal extends IEntity {
  attributes?: IJournalAttributes;
  name?: string;
  description?: string;
  notes?: string;
  type: JournalType;
  thresholds?: IJournalThresholdDefinitions;
  permissions?: IUserPermissions;
  userRole?: UserRole;
  customProps?: IJournalCustomProps;
}
