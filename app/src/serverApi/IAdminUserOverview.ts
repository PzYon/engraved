export interface IAdminUserOverview {
  id: string;
  name: string;
  displayName?: string;
  journalsCount: number;
  entriesCount: number;
  lastLoginDate?: string;
}
