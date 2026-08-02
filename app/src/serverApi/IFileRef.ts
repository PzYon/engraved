// A file belonging to an entry: the metadata, not the bytes, which live in blob storage. Handed out
// by the upload endpoint and sent back on the entry when it is saved.
export interface IFileRef {
  id: string;
  fileName: string;
  contentType: string;
  contentLength: number;
  uploadedOn?: string;
  width?: number;
  height?: number;
}
