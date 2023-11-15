import { JournalType } from "./JournalType";
import { IJournalAttributes } from "./IJournalAttributes";
import { IUserPermissions } from "./IUserPermissions";
import { IJournalThresholds } from "./IJournalThresholds";
import { IJournalCustomProps } from "./IJournalCustomProps";
import { UserRole } from "./UserRole";

export interface IJournal {
  id?: string;
  attributes?: IJournalAttributes;
  name?: string;
  description?: string;
  notes?: string;
  type: JournalType;
  editedOn?: string;
  thresholds?: IJournalThresholds;
  permissions?: IUserPermissions;
  userRole?: UserRole;
  customProps?: IJournalCustomProps;
}
