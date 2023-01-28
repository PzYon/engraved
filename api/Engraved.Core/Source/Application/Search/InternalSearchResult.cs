namespace Engraved.Core.Application.Search;

public class InternalSearchResult
{
  public string Key { get; set; } = null!;

  public int Occurrence { get; set; }

  public double Score { get; set; }
}
