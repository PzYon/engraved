using Engraved.Core.Application.Files;
using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Files;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Files.GetUrl;

public class GetFileUrlQueryExecutor(
  IEntryRepository entryRepository,
  IJournalRepository journalRepository,
  IFileStore fileStore
) : IQueryExecutor<GetFileUrlResult?, GetFileUrlQuery>
{
  // The URL expires, so caching it would eventually hand out a dead one.
  public bool DisableCache => true;

  public async Task<GetFileUrlResult?> Execute(GetFileUrlQuery query)
  {
    if (string.IsNullOrEmpty(query.FileId))
    {
      throw new InvalidQueryException(query, $"{nameof(GetFileUrlQuery.FileId)} must be specified.");
    }

    // Files have no permissions of their own: a file belongs to an entry, an entry belongs to a
    // journal, and the journal already answers "may this user read this". An unreferenced file is
    // therefore unreadable by anyone, which is what makes handing the read URL out at upload time
    // (see CreateFileUploadResult.ReadUrl) necessary.
    IEntry? entry = await entryRepository.GetEntryByFileId(query.FileId);
    if (entry == null)
    {
      return null;
    }

    // GetEntryByFileId is unscoped; the scoped journal repository returns null when the
    // current user may not read the parent journal, in which case the file stays hidden.
    IJournal? journal = await journalRepository.GetJournal(entry.ParentId);
    if (journal == null)
    {
      return null;
    }

    FileRef file = entry.Files.Single(f => f.Id == query.FileId);

    Uri url = await fileStore.CreateReadUrl(file);

    return new GetFileUrlResult { Url = url.ToString() };
  }
}
