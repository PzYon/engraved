// Talks to blob storage, which is a different server from our API and shares none of its
// conventions: no bearer token (the signed URL is the credential, and sending our token to a third
// party would leak it), no JSON, no base URL of ours, and no 401-refresh flow. Hence its own module
// rather than a method on ServerApi.

// The browser leaves this empty for types it does not recognise. Shared with the call that reserves
// the upload, so the type we record and the type we store agree.
export function getContentType(file: File) {
  return file.type || "application/octet-stream";
}

export async function putFileContent(
  uploadUrl: string,
  file: File,
): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "x-ms-blob-type": "BlockBlob",
      "Content-Type": getContentType(file),
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error(`Uploading "${file.name}" failed (${response.status}).`);
  }
}
