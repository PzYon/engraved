import { IUser } from "../IUser";
import { StorageWrapper } from "../../util/StorageWrapper";

// Who was signed in the last time. Remembering that lets the app start with
// what it has cached for them while the sign-in is still on its way. This is
// the user and nothing else: tokens are kept in memory only, so knowing who
// was here gives no access to the API.
const storage = new StorageWrapper(localStorage);

const key = "lastUser";

export function getLastUser(): IUser | undefined {
  return storage.getValue<IUser>(key);
}

export function setLastUser(user: IUser): void {
  storage.setValue(key, user);
}
