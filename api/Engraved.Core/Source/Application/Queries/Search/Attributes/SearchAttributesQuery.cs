namespace Engraved.Core.Application.Queries.Search.Attributes;

public class SearchAttributesQuery : IQuery
{
  public string JournalId { get; set; } = null!;

  public string SearchText { get; set; } = null!;
}
