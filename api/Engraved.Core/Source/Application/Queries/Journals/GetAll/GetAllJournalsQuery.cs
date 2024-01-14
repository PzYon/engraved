using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Journals.GetAll;

public class GetAllJournalsQuery : IEntitiesQuery
{
  public int? Limit { get; set; }

  public string? SearchText { get; set; }

  public JournalType[]? JournalTypes { get; set; }

  public bool? FavoritesOnly { get; set; }
  
  public bool ScheduledOnly { get; set; }
}
