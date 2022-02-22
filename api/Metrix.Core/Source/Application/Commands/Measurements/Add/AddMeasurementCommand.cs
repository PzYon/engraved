namespace Metrix.Core.Application.Commands.Measurements.Add;

public class AddMeasurementCommand : ICommand
{
  public string MetricKey { get; set; }

  public DateTime DateTime { get;  } = DateTime.UtcNow;
  
  public string Notes { get; set; }
}
