namespace Metrix.Core;

public class SaliMaxProvider
{
  public SaliMax GetSaliMax()
  {
    return new SaliMax {Date = DateTime.UtcNow};
  }
}