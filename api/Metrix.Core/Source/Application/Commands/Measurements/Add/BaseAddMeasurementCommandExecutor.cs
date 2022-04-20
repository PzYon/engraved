using Metrix.Core.Application.Commands.Metrics;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Measurements.Add;

public abstract class BaseAddMeasurementCommandExecutor<TCommand, TMeasurement, TMetric> : ICommandExecutor
  where TCommand : BaseAddMeasurementCommand
  where TMeasurement : IMeasurement
  where TMetric : IMetric
{
  protected TCommand Command { get; }

  protected abstract TMeasurement CreateMeasurement(IDateService dateService);

  protected virtual void PerformAdditionalValidation(IDb db, TMetric metric) { }

  protected virtual void UpdateMetric(TMetric metric, IDateService dateService) { }

  protected BaseAddMeasurementCommandExecutor(TCommand command)
  {
    Command = command;
  }

  public async Task Execute(IDb db, IDateService dateService)
  {
    var metric = MetricUtil.LoadAndValidateMetric<TMetric>(db, Command, Command.MetricKey);

    EnsureCompatibleMetricType(metric);
    ValidateMetricFlag(metric);

    PerformAdditionalValidation(db, metric);

    TMeasurement measurement = CreateMeasurement(dateService);
    measurement.MetricKey = Command.MetricKey;
    measurement.Notes = Command.Notes;
    measurement.DateTime = dateService.UtcNow;
    measurement.MetricFlagKey = Command.MetricFlagKey;

    db.Measurements.Add(measurement);

    UpdateMetric(metric, dateService);

    metric.LastMeasurementDate = dateService.UtcNow;
  }

  private void EnsureCompatibleMetricType(IMetric metric)
  {
    if (metric.Type != Command.GetSupportedMetricType())
    {
      throw CreateInvalidCommandException(
        $"Command with metric type \"{Command.GetSupportedMetricType()}\" is not compatible with metric of type \"{metric.Type}\"."
      );
    }
  }

  private void ValidateMetricFlag(IMetric metric)
  {
    if (!string.IsNullOrEmpty(Command.MetricFlagKey) && !metric.Flags.ContainsKey(Command.MetricFlagKey))
    {
      throw CreateInvalidCommandException($"Flag \"{Command.MetricFlagKey}\" does not exist on metric.");
    }
  }

  protected InvalidCommandException CreateInvalidCommandException(string message)
  {
    return new InvalidCommandException(Command, message);
  }
}
