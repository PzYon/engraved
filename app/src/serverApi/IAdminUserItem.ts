export interface IAdminUserItem {
  id: string;
  name: string;
  displayName?: string;
  journalsCount: number;
  entriesCount: number;
  lastLoginDate?: string;
}
