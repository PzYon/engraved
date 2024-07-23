import { IAuthResult } from "../IAuthResult";
import { StorageWrapper } from "../../util/StorageWrapper";

export class AuthStorage {
  private static key = "engraved::auth";

  private storageUtil = new StorageWrapper(localStorage);

  hasResult(): boolean {
    return !!this.getAuthResult();
  }

  getAuthResult(): IAuthResult {
    return this.storageUtil.getValue(AuthStorage.key);
  }

  setAuthResult(result: IAuthResult): void {
    this.storageUtil.setValue(AuthStorage.key, result);
  }
}
