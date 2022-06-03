import { IAuthResult } from "../IAuthResult";
import { StorageUtil } from "../../util/StorageUtil";

export class AuthTokenStorage {
  private static key = "metrix::auth-token";

  private storageUtil: StorageUtil;

  constructor() {
    this.storageUtil = new StorageUtil(sessionStorage);
  }

  hasResult(): boolean {
    return !!this.getAuthResult();
  }

  getAuthResult(): IAuthResult {
    return this.storageUtil.getValue(AuthTokenStorage.key);
  }

  setAuthResult(result: IAuthResult): void {
    this.storageUtil.setValue(AuthTokenStorage.key, result);
  }
}
