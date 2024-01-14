using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Entries.GetAll;

public class GetAllEntriesQuery : IEntitiesQuery
{
  public int? Limit { get; set; }

  public string? SearchText { get; set; }

  public JournalType[]? JournalTypes { get; set; }
  
  public bool ScheduledOnly { get; set; }
}
