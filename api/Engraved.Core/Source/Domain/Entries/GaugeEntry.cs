namespace Engraved.Core.Domain.Entries;

public class GaugeEntry : BaseEntry
{
  public double Value { get; set; }

  public override double GetValue()
  {
    return Value;
  }
}
