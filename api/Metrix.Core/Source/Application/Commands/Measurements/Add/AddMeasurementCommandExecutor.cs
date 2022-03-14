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
    EnsureMetricKeyIsPresent();

    Metric? metric = db.Metrics.FirstOrDefault(m => m.Key == _command.MetricKey);

    EnsureMetricExists(metric);
    ValidateMetricFlag(metric);

    db.Measurements.Add(
      new Measurement
      {
        MetricKey = _command.MetricKey,
        Notes = _command.Notes,
        DateTime = DateTime.UtcNow,
        Value = GetValue(_command, metric.Type),
        MetricFlagKey = _command.MetricFlagKey
      }
    );
  }

  private void ValidateMetricFlag(Metric? metric)
  {
    if (!string.IsNullOrEmpty(_command.MetricFlagKey) && !metric.Flags.ContainsKey(_command.MetricFlagKey))
    {
      throw CreateInvalidCommandException($"Flag \"{_command.MetricFlagKey}\" does not exist on metric.");
    }
  }

  private void EnsureMetricExists(Metric? metric)
  {
    if (metric == null)
    {
      throw CreateInvalidCommandException($"A metric with key \"{_command.MetricKey}\" does not exist.");
    }
  }

  private void EnsureMetricKeyIsPresent()
  {
    if (string.IsNullOrEmpty(_command.MetricKey))
    {
      throw CreateInvalidCommandException($"A {nameof(AddMeasurementCommand.MetricKey)} must be specified.");
    }
  }

  private double GetValue(AddMeasurementCommand command, MetricType metricType)
  {
    if (metricType == MetricType.Counter)
    {
      return 1;
    }

    if (command.Value.HasValue)
    {
      return command.Value.Value;
    }

    throw CreateInvalidCommandException($"A \"{nameof(AddMeasurementCommand.Value)}\" must be specified.");
  }

  private InvalidCommandException CreateInvalidCommandException(string message)
  {
    return new InvalidCommandException(_command, message);
  }
}
