using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Entries.GetAllJournal;

public class GetAllJournalEntriesQueryExecutor : IQueryExecutor<IEntry[]>
{
  public bool DisableCache => false;

  private readonly GetAllJournalEntriesQuery _query;

  public GetAllJournalEntriesQueryExecutor(GetAllJournalEntriesQuery query)
  {
    _query = query;
  }

  public async Task<IEntry[]> Execute(IRepository repository)
  {
    if (string.IsNullOrEmpty(_query.JournalId))
    {
      throw new InvalidQueryException<IEntry[]>(
        _query,
        $"{nameof(GetAllJournalEntriesQuery.JournalId)} must be specified."
      );
    }

    IJournal? journal = await repository.GetJournal(_query.JournalId);

    if (journal == null)
    {
      throw new InvalidQueryException<IEntry[]>(
        _query,
        $"Journal with key \"{_query.JournalId}\" does not exist."
      );
    }

    return await repository.GetAllEntries(
      _query.JournalId,
      _query.FromDate,
      _query.ToDate,
      _query.AttributeValues
    );
  }
}
