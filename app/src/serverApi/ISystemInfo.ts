export interface ISystemInfo {
  version: string;
  commitHash: string;
  mergeDateTime: string;
}

export interface IApiSystemInfo extends ISystemInfo {
  journalsCount: number;
  entriesCount: number;
  usersCount: number;
}
