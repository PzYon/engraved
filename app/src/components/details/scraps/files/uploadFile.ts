import { ServerApi } from "../../../../serverApi/ServerApi";
import { IFileRef } from "../../../../serverApi/IFileRef";

// Two steps on purpose: the API only issues a signed URL and never sees the bytes, which is what
// keeps uploads off the app service. The returned reference is not persisted anywhere until the
// entry it was put on is saved.
export async function uploadFile(
  journalId: string,
  file: File,
): Promise<IFileRef> {
  const upload = await ServerApi.createFileUpload(journalId, file);

  await ServerApi.uploadFileContent(upload.uploadUrl, file);

  return upload.file;
}
