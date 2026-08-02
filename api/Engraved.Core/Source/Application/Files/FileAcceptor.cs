using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Files;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Files;

// A FileRef is handed to the client at upload and comes back on an entry at save, so by the time it
// is persisted every field on it - including the id - is whatever the client chose to send. This is
// the one place that decides which of it to believe.
public class FileAcceptor(
  IFileStore fileStore,
  IFileIdFactory fileIdFactory,
  IDateService dateService,
  Lazy<IUser> currentUser
)
{
  public async Task<FileRef[]> Accept(FileRef[] fromClient, FileRef[] stored)
  {
    Dictionary<string, FileRef> storedById = stored.ToDictionary(f => f.Id);

    var accepted = new List<FileRef>();

    foreach (FileRef file in fromClient)
    {
      accepted.Add(
        storedById.TryGetValue(file.Id, out FileRef? existing)
          ? existing
          : await AcceptNew(file)
      );
    }

    // Files the client left out are dropped from the entry, but their blobs are deliberately not
    // deleted here: the delete and the entry write cannot be one atomic operation, and deleting
    // first would lose a file whenever the write then fails. Unreferenced blobs are cleaned up by
    // the store's lifecycle rules instead.
    return accepted.ToArray();
  }

  private async Task<FileRef> AcceptNew(FileRef file)
  {
    // The signature ties the id to the user the upload was issued to, so a file id someone has
    // merely seen cannot be attached to an entry of their own. Files already on the entry skip this
    // check, so a shared journal's collaborators can still edit a scrap holding someone else's file.
    if (!fileIdFactory.BelongsToUser(file.Id, currentUser.Value.Id!))
    {
      throw new NotAllowedOperationException("File does not exist or was not uploaded by you.");
    }

    var contentLength = await fileStore.GetContentLength(file.Id);
    if (contentLength == null)
    {
      throw new NotAllowedOperationException("File does not exist or was not uploaded by you.");
    }

    if (contentLength > FileSizeLimits.MaxFileSizeBytes)
    {
      throw new InvalidOperationException(
        $"Files must not be larger than {FileSizeLimits.MaxFileSizeBytes / 1024 / 1024} MB."
      );
    }

    return new FileRef
    {
      Id = file.Id,
      FileName = FileContentPolicy.SanitizeFileName(file.FileName),

      // Taken from the client and not verified. A lying content type is not worth a range read to
      // sniff: the read URL pins whatever is stored here onto the response together with nosniff, so
      // the worst a client achieves is having its own file served as the wrong type.
      ContentType = file.ContentType,

      // From the store, never from the client - this is where the size limit stops being advisory.
      ContentLength = contentLength.Value,

      UploadedOn = dateService.UtcNow,

      // Cosmetic, so client-supplied is fine: they only reserve layout space before the image loads.
      Width = file.Width,
      Height = file.Height
    };
  }
}
