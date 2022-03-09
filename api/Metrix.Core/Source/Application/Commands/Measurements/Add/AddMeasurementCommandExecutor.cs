using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Measurements.Add;

public class AddMeasurementCommandExecutor : ICommandExecutor
{
  private readonly AddMeasurementCommand _command;

  public AddMeasurementCommandExecutor(AddMeasurementCommand command)
  {
    _command = command;
  }

  public void Execute(IDb db)
  {
    if (string.IsNullOrEmpty(_command.MetricKey))
    {
      throw CreateInvalidCommandException($"A {nameof(AddMeasurementCommand.MetricKey)} must be specified.");
    }

    Metric? metric = db.Metrics.FirstOrDefault(m => m.Key == _command.MetricKey);
    if (metric == null)
    {
      throw CreateInvalidCommandException($"A metric with key \"{_command.MetricKey}\" does not exist.");
    }

    db.Measurements.Add(new Measurement
    {
      MetricKey = _command.MetricKey,
      Notes = _command.Notes,
      DateTime = DateTime.UtcNow,
      Value = GetValue(_command, metric.Type)
    });
  }

  private double GetValue(AddMeasurementCommand command, MetricType metricType)
  {
    double? value = metricType == MetricType.Counter ? 1 : command.Value;
    if (value.HasValue)
    {
      return value.Value;
    }

    throw CreateInvalidCommandException($"A \"{nameof(AddMeasurementCommand.Value)}\" must be specified.");
  }

  private InvalidCommandException CreateInvalidCommandException(String message)
  {
    return new InvalidCommandException(_command, message);
  }
}
