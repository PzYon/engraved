namespace Metrix.Core.Application.Search;

public class InternalSearchResult
{
  public string Key { get; set; }

  public int Occurrence { get; set; } = 0;

  public double Score { get; set; }
}
