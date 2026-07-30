import { IFileRef } from "./IFileRef";

export interface ICreateFileUploadResult {
  file: IFileRef;
  uploadUrl: string;

  // Handed out with the upload URL so a just-uploaded file can be shown right away: until the entry
  // is saved nothing references the file, and asking for its URL resolves through the owning entry.
  readUrl: string;
}
