namespace Engraved.Core.Domain.Measurements;

public class ScrapsMeasurement : BaseMeasurement
{
  public string Title { get; set; } = null!;

  public override double GetValue()
  {
    throw new NotImplementedException();
  }
}
