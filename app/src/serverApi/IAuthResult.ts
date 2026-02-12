import { IUser } from "./IUser";

export interface IAuthResult {
  jwtToken: string;
  user: IUser;
}

export interface ITestAuthResult extends IAuthResult {
  journalId?: string;
}
