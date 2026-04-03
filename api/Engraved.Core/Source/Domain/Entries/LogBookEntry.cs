namespace Engraved.Core.Domain.Entries;

public class LogBookEntry : BaseEntry
{
  public string Title { get; set; } = null!;

  public override double GetValue()
  {
    throw new NotImplementedException();
  }
}
