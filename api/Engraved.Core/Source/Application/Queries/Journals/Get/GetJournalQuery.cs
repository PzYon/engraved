using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Journals.Get;

public class GetJournalQuery : IQuery<IJournal?>
{
  public string? JournalId { get; set; }

  IQueryExecutor<IJournal?> IQuery<IJournal?>.CreateExecutor()
  {
    return new GetJournalQueryExecutor(this);
  }
}
