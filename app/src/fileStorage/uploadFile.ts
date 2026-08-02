import { ServerApi } from "../serverApi/ServerApi";
import { IFileRef } from "../serverApi/IFileRef";
import { putFileContent } from "./fileStorageApi";

// Spans both servers, which is why it lives here rather than with either: our API reserves the file
// and issues a signed URL, then the bytes go straight to blob storage without passing through it.
//
// The returned reference is not persisted anywhere until the entry it is put on is saved.
export async function uploadFile(
  journalId: string,
  file: File,
): Promise<IFileRef> {
  const upload = await ServerApi.createFileUpload(journalId, file);

  await putFileContent(upload.uploadUrl, file);

  return upload.file;
}
