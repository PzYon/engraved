using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Entries.GetAll;

public class GetAllEntriesQuery : IQuery<GetAllEntriesQueryResult>
{
  public int? Limit { get; set; }

  public string? SearchText { get; set; }

  public JournalType[]? JournalTypes { get; set; }

  IQueryExecutor<GetAllEntriesQueryResult> IQuery<GetAllEntriesQueryResult>.CreateExecutor()
  {
    return new GetAllEntriesQueryExecutor(this);
  }
}
