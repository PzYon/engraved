using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Files;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Files;

// A FileRef is handed to the client at upload and comes back on an entry at save, so by the time it
// is persisted every field on it - including the id - is whatever the client chose to send. This is
// the one place that decides which of it to believe, and the one place that knows what a save means
// for the bytes behind it.
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

    // Files the client left out are dropped from the entry here, but their blobs are not: the delete
    // and the entry write cannot be one atomic operation, and deleting first would lose a file
    // whenever the write then fails. DeleteRemoved does it afterwards instead.
    return accepted.ToArray();
  }

  // Deletes the blobs of files that were on the entry and are not any more. Call only once the entry
  // has been written: this order fails towards an unreferenced blob rather than towards an entry
  // pointing at bytes that are gone, the same way the delete commands do it.
  //
  // A lifecycle rule cannot do this instead - these blobs are committed and so indistinguishable
  // from live ones. Only the save that dropped them knows.
  public async Task DeleteRemoved(FileRef[] stored, FileRef[] accepted)
  {
    HashSet<string> keptIds = accepted.Select(f => f.Id).ToHashSet();

    foreach (FileRef file in stored.Where(f => !keptIds.Contains(f.Id)))
    {
      await fileStore.Delete(file.Id);
    }
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

    // Before the entry is written rather than after, and deliberately so. Failing between the two
    // then leaves a committed blob nothing references - a leak, which is recoverable - where the
    // other order would leave a referenced blob still marked pending, and the lifecycle rule would
    // delete a file that is in use.
    await fileStore.MarkCommitted(file.Id);

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
