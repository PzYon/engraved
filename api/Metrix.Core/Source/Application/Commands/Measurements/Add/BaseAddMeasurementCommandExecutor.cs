using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Measurements.Add;

public abstract class BaseAddMeasurementCommandExecutor<TCommand, TMeasurement> : ICommandExecutor
  where TCommand : BaseAddMeasurementCommand
  where TMeasurement : IMeasurement
{
  protected BaseAddMeasurementCommandExecutor(TCommand command)
  {
    Command = command;
  }

  protected TCommand Command { get; }

  public void Execute(IDb db)
  {
    EnsureMetricKeyIsPresent();

    Metric? metric = db.Metrics.FirstOrDefault(m => m.Key == Command.MetricKey);

    EnsureMetricExists(metric);
    ValidateMetricFlag(metric);

    IMeasurement measurement = CreateMeasurement();

    measurement.MetricKey = Command.MetricKey;
    measurement.Notes = Command.Notes;
    measurement.DateTime = DateTime.UtcNow;
    measurement.MetricFlagKey = Command.MetricFlagKey;

    db.Measurements.Add(measurement);
  }

  protected abstract TMeasurement CreateMeasurement();

  private void ValidateMetricFlag(Metric? metric)
  {
    if (!string.IsNullOrEmpty(Command.MetricFlagKey) && !metric.Flags.ContainsKey(Command.MetricFlagKey))
    {
      throw CreateInvalidCommandException($"Flag \"{Command.MetricFlagKey}\" does not exist on metric.");
    }
  }

  private void EnsureMetricExists(Metric? metric)
  {
    if (metric == null)
    {
      throw CreateInvalidCommandException($"A metric with key \"{Command.MetricKey}\" does not exist.");
    }
  }

  private void EnsureMetricKeyIsPresent()
  {
    if (string.IsNullOrEmpty(Command.MetricKey))
    {
      throw CreateInvalidCommandException($"A {nameof(BaseAddMeasurementCommand.MetricKey)} must be specified.");
    }
  }

  private InvalidCommandException CreateInvalidCommandException(string message)
  {
    return new InvalidCommandException(Command, message);
  }
}
