using Engraved.Core.Domain.Entries;

namespace Engraved.Core.Application.Queries.Entries.GetActive;

public class GetActiveEntryQuery : IQuery<IEntry?>
{
  public string? JournalId { get; set; }

  IQueryExecutor<IEntry?> IQuery<IEntry?>.CreateExecutor()
  {
    return new GetActiveEntryQueryExecutor(this);
  }
}
