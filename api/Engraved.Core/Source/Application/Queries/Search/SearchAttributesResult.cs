namespace Engraved.Core.Application.Queries.Search;

public class SearchAttributesResult
{
  public Dictionary<string, string[]> Values { get; set; } = new();

  public int OccurrenceCount { get; set; }

  public double Score { get; set; }
}
