namespace Engraved.Core.Domain.Entries;

public class LogBookEntry : BaseEntry
{
  public string? Title { get; set; }

  public override double GetValue()
  {
    throw new NotImplementedException();
  }
}
