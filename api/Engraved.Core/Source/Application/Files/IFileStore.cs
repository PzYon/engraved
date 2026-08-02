using Engraved.Core.Domain.Files;

namespace Engraved.Core.Application.Files;

// Bytes live outside the database: storing them in mongo/cosmos would spend request units (and, on
// cosmos, the shared throughput budget of the whole application) on data that never needs querying.
// The application only ever hands out time-bound URLs and lets the browser talk to the store
// directly, so no file content passes through the API.
public interface IFileStore
{
  // URL the client may PUT the bytes to. Deliberately short-lived: it is used immediately after
  // being issued. Note that it constrains who may write, not what: neither the content type nor the
  // size of the upload can be pinned by the URL, which is why the read URL sets the content type
  // itself and why the stored size has to be verified when the owning entry is saved.
  Task<Uri> CreateUploadUrl(string fileId);

  // URL the browser may GET the bytes from. The file's name and content type are pinned onto the
  // response by the store rather than taken from whatever the client happened to upload, which is
  // what makes FileContentPolicy's disposition decision enforceable.
  Task<Uri> CreateReadUrl(FileRef file);

  Task Delete(string fileId);

  // Marks a file as belonging to an entry. Uploads start out pending (see FileTags) and are swept up
  // by the store if they never reach this, which is what stops a cancelled edit from leaving bytes
  // behind forever. Must therefore be reliable: a file that is attached but stays pending would be
  // deleted while still referenced, so failing here has to fail the save.
  Task MarkCommitted(string fileId);

  // The size the store actually holds, or null when there is no such file. The client states a size
  // when asking for an upload URL, but a SAS cannot cap what is then put, so this is the only size
  // that can be believed.
  Task<long?> GetContentLength(string fileId);
}
