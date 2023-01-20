namespace Metrix.Core.Domain.Measurements;

public class GaugeMeasurement : BaseMeasurement
{
  public double Value { get; set; }

  public override double GetValue() => Value;
}
