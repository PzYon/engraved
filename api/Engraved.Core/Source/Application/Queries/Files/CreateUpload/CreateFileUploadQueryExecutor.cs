using Engraved.Core.Application.Files;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Domain.Files;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Queries.Files.CreateUpload;

public class CreateFileUploadQueryExecutor(
  IJournalRepository journalRepository,
  IFileStore fileStore,
  Lazy<IUser> currentUser
) : IQueryExecutor<CreateFileUploadResult, CreateFileUploadQuery>
{
  // Every call mints a new file id and a URL that expires, so a cached result would hand the same
  // (eventually dead) upload target to every upload.
  public bool DisableCache => true;

  public async Task<CreateFileUploadResult> Execute(CreateFileUploadQuery query)
  {
    EnsureIsValid(query);

    // The file is uploaded before the entry that will own it exists (or before an existing entry is
    // saved again), so access is decided on the journal the file is destined for. Read access on the
    // file afterwards is decided by the entry that ends up holding it - see GetFileUrlQueryExecutor.
    IJournal? journal = await journalRepository.GetJournal(query.JournalId!);
    if (!JournalAccessPolicy.HasAccess(journal, currentUser.Value.Id, PermissionKind.Write))
    {
      throw new NotAllowedOperationException("Journal doesn't exist or you do not have permissions.");
    }

    var file = new FileRef
    {
      Id = Guid.NewGuid().ToString("N"),
      FileName = FileContentPolicy.SanitizeFileName(query.FileName!),
      ContentType = query.ContentType!,
      Length = query.Length,
      Width = query.Width,
      Height = query.Height
    };

    Uri uploadUrl = await fileStore.CreateUploadUrl(file.Id);
    Uri readUrl = await fileStore.CreateReadUrl(file);

    return new CreateFileUploadResult
    {
      File = file,
      UploadUrl = uploadUrl.ToString(),
      ReadUrl = readUrl.ToString()
    };
  }

  private static void EnsureIsValid(CreateFileUploadQuery query)
  {
    if (string.IsNullOrEmpty(query.JournalId))
    {
      throw new InvalidQueryException(query, $"{nameof(CreateFileUploadQuery.JournalId)} must be specified.");
    }

    if (string.IsNullOrEmpty(query.FileName))
    {
      throw new InvalidQueryException(query, $"{nameof(CreateFileUploadQuery.FileName)} must be specified.");
    }

    if (string.IsNullOrEmpty(query.ContentType))
    {
      throw new InvalidQueryException(query, $"{nameof(CreateFileUploadQuery.ContentType)} must be specified.");
    }

    if (query.Length <= 0)
    {
      throw new InvalidQueryException(query, $"{nameof(CreateFileUploadQuery.Length)} must be greater than zero.");
    }

    // This is the size the client claims it is about to upload. A SAS cannot cap the size of the
    // put, so a client that lies gets a signed URL anyway; the actual size has to be verified
    // against the stored blob when the owning entry is saved.
    if (query.Length > FileSizeLimits.MaxFileSizeBytes)
    {
      throw new InvalidQueryException(
        query,
        $"Files must not be larger than {FileSizeLimits.MaxFileSizeBytes / 1024 / 1024} MB."
      );
    }
  }
}
