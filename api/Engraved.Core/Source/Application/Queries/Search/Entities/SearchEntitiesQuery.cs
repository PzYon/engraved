using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Search.Entities;

public class SearchEntitiesQuery : IEntitiesQuery
{
  public int? Limit { get; set; }

  public string? SearchText { get; set; }

  public bool ScheduledOnly { get; set; }
  
  // todo: extend with types here!
  public JournalType[] OnlyEntriesOfTypes { get; set; } = [];
}
