import { IUserTag } from "./IUserTag";

export interface IUser {
  id?: string;
  globalUniqueId?: string;
  name: string;
  displayName?: string;
  imageUrl?: string;
  favoriteJournalIds?: string[];
  tags?: IUserTag[];
}
