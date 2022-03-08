using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Measurements.Add;

public class AddMeasurementCommandExecutor : ICommandExecutor<AddMeasurementCommand>
{
  public void Execute(IDb db, AddMeasurementCommand command)
  {
    if (string.IsNullOrEmpty(command.MetricKey))
    {
      throw new InvalidCommandException(
        typeof(AddMeasurementCommand),
        $"A {nameof(AddMeasurementCommand.MetricKey)} must be specified."
      );
    }

    Metric? metric = db.Metrics.FirstOrDefault(m => m.Key == command.MetricKey);
    if (metric == null)
    {
      throw new InvalidCommandException(
        typeof(AddMeasurementCommand),
        $"A metric with key \"{command.MetricKey}\" does not exist."
      );
    }

    double? value = metric.Type == MetricType.Counter ? 1 : command.Value;

    if (!value.HasValue)
    {
      throw new InvalidCommandException(
        typeof(AddMeasurementCommand),
        $"A \"{nameof(AddMeasurementCommand.Value)}\" must be specified."
      );
    }
    
    db.Measurements.Add(new Measurement
    {
      MetricKey = command.MetricKey,
      Notes = command.Notes,
      DateTime = DateTime.UtcNow,
      Value = value.Value
    });
  }
}
