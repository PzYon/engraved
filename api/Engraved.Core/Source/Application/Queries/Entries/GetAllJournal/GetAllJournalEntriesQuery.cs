using Engraved.Core.Domain.Entries;

namespace Engraved.Core.Application.Queries.Entries.GetAllJournal;

public class GetAllJournalEntriesQuery : IQuery<IEntry[]>
{
  public string? JournalId { get; set; }

  public DateTime? FromDate { get; set; }

  public DateTime? ToDate { get; set; }

  public IDictionary<string, string[]> AttributeValues { get; set; } = new Dictionary<string, string[]>();

  IQueryExecutor<IEntry[]> IQuery<IEntry[]>.CreateExecutor()
  {
    return new GetAllJournalEntriesQueryExecutor(this);
  }
}
