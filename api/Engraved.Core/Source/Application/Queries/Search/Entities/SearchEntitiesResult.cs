using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Search.Entities;

public class SearchEntitiesResult
{
  public SearchResultEntity[] Entities { get; set; } = Array.Empty<SearchResultEntity>();

  public IJournal[] Journals { get; set; } = Array.Empty<IJournal>();
}
