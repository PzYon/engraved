import { ServerApi } from "../serverApi/ServerApi";
import { IFileRef } from "../serverApi/IFileRef";
import { putFileContent } from "./fileStorageApi";
import { prepareImageForUpload } from "./prepareImageForUpload";

export interface IUploadedFile {
  file: IFileRef;

  // Valid for at least an hour (see SasExpiry) and handed back by the upload itself, because there
  // is no other way to get one yet: a read URL is issued on the strength of the entry holding the
  // file, and nothing holds it until the entry is saved.
  readUrl: string;
}

// Spans both servers, which is why it lives here rather than with either: our API reserves the file
// and issues a signed URL, then the bytes go straight to blob storage without passing through it.
//
// The returned reference is not persisted anywhere until the entry it is put on is saved.
export async function uploadFile(
  journalId: string,
  file: File,
): Promise<IUploadedFile> {
  // Images are shrunk before anything is reserved, so that the size and the content type recorded
  // describe what is actually stored. Everything else passes through untouched.
  const prepared = await prepareImageForUpload(file);

  const upload = await ServerApi.createFileUpload(
    journalId,
    prepared.file,
    prepared.width,
    prepared.height,
  );

  await putFileContent(upload.uploadUrl, prepared.file);

  return { file: upload.file, readUrl: upload.readUrl };
}
