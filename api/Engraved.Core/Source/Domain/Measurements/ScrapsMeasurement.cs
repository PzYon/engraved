namespace Engraved.Core.Domain.Measurements;

public class ScrapsMeasurement : BaseMeasurement
{
  public string Title { get; set; } = null!;

  public ScrapType ScrapType { get; set; } = ScrapType.Markdown;

  public override double GetValue()
  {
    throw new NotImplementedException();
  }
}
