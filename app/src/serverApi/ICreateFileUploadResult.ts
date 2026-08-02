import { IFileRef } from "./IFileRef";

export interface ICreateFileUploadResult {
  file: IFileRef;
  uploadUrl: string;
  readUrl: string;
}
