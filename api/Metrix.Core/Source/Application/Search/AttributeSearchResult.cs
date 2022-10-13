namespace Metrix.Core.Application.Search;

public class AttributeSearchResult
{
  public Dictionary<string, string[]> Values { get; set; } = new();

  public int OccurrenceCount { get; set; }

  public double Score { get; set; }
}
