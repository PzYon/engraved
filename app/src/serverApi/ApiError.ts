import { IApiError } from "./IApiError";

export class ApiError extends Error {
  constructor(public status: number, public apiError: IApiError) {
    super(status + ": " + apiError?.message || "-");
  }
}
