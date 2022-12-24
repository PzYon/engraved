namespace Metrix.Core.Application.Commands.Measurements.Add.Timer.Upsert;

public class UpsertTimerMeasurementCommand : ICommand
{
  public string MetricId { get; set; } = null!;

  // what about Notes?

  public ICommandExecutor CreateExecutor()
  {
    return new UpsertTimerMeasurementCommandExecutor(this);
  }
}
