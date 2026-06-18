import { IUser } from "./IUser";

export interface IAuthResult {
  jwtToken: string;
  expiresAt: string;
  user: IUser;
}
