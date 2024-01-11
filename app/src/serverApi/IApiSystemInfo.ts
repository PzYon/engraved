import { ISystemInfo } from "./ISystemInfo";

export interface IApiSystemInfo extends ISystemInfo {
  journalsCount: number;
  entriesCount: number;
  usersCount: number;
}
