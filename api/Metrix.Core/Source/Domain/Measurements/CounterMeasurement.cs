namespace Metrix.Core.Domain.Measurements;

public class CounterMeasurement : BaseMeasurement
{
  public override double GetValue()
  {
    return 1;
  }
}
