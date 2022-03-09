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
      throw CreateInvalidCommandException($"A {nameof(AddMeasurementCommand.MetricKey)} must be specified.");
    }

    Metric? metric = db.Metrics.FirstOrDefault(m => m.Key == command.MetricKey);
    if (metric == null)
    {
      throw CreateInvalidCommandException($"A metric with key \"{command.MetricKey}\" does not exist.");
    }

    db.Measurements.Add(new Measurement
    {
      MetricKey = command.MetricKey,
      Notes = command.Notes,
      DateTime = DateTime.UtcNow,
      Value = GetValue(command, metric.Type)
    });
  }

  private static double GetValue(AddMeasurementCommand command, MetricType metricType)
  {
    double? value = metricType == MetricType.Counter ? 1 : command.Value;
    if (value.HasValue)
    {
      return value.Value;
    }

    throw CreateInvalidCommandException($"A \"{nameof(AddMeasurementCommand.Value)}\" must be specified.");
  }

  private static InvalidCommandException CreateInvalidCommandException(String message)
  {
    return new InvalidCommandException(typeof(AddMeasurementCommand), message);
  }
}