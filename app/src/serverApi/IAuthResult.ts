import { IUser } from "./IUser";

export interface IAuthResult {
  jwtToken: string;
  expiresAt: string;
  refreshToken: string;
  user: IUser;
}
