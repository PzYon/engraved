using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Entries.Get;

public class GetEntryQueryExecutor(IRepository repository) : IQueryExecutor<IEntry?, GetEntryQuery>
{
  public bool DisableCache => false;

  public async Task<IEntry?> Execute(GetEntryQuery query)
  {
    if (string.IsNullOrEmpty(query.EntryId))
    {
      throw new InvalidQueryException(
        query,
        $"{nameof(GetEntryQuery.EntryId)} must be specified."
      );
    }

    IEntry? entry = await repository.GetEntry(query.EntryId);
    if (entry == null)
    {
      return null;
    }

    // permission check
    IJournal? journal = await repository.GetJournal(entry.ParentId);

    if (journal == null)
    {
      return null;
    }

    return entry;
  }
}
