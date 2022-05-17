import { IUser } from "./IUser";

export interface IAuthResult {
  jwtToken: string;
  user: IUser;
}
