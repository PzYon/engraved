using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Journals.GetAll;

public class GetAllJournalsQuery : IQuery<IJournal[]>
{
  public int? Limit { get; set; }

  public string? SearchText { get; set; }

  public JournalType[]? JournalTypes { get; set; }

  IQueryExecutor<IJournal[]> IQuery<IJournal[]>.CreateExecutor()
  {
    return new GetAllJournalsQueryExecutor(this);
  }
}
