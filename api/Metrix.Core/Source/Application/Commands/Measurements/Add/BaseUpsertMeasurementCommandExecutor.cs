using Metrix.Core.Application.Commands.Metrics;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Measurements.Add;

public abstract class BaseUpsertMeasurementCommandExecutor<TCommand, TMeasurement, TMetric> : ICommandExecutor
  where TCommand : BaseUpsertMeasurementCommand
  where TMeasurement : IMeasurement
  where TMetric : class, IMetric
{
  protected TCommand Command { get; }

  protected abstract TMeasurement CreateMeasurement(IDateService dateService);

  protected virtual Task PerformAdditionalValidation(IRepository repository, TMetric metric)
  {
    return Task.CompletedTask;
  }

  protected virtual void UpdateMetric(TMetric metric, IDateService dateService) { }

  protected BaseUpsertMeasurementCommandExecutor(TCommand command)
  {
    Command = command;
  }

  public async Task<CommandResult> Execute(IRepository repository, IDateService dateService)
  {
    var metric = await MetricUtil.LoadAndValidateMetric<TMetric>(repository, Command, Command.MetricId);

    EnsureCompatibleMetricType(metric);
    ValidateMetricFlag(metric);

    await PerformAdditionalValidation(repository, metric);

    TMeasurement measurement = CreateMeasurement(dateService);
    measurement.MetricId = Command.MetricId;
    measurement.Notes = Command.Notes;
    measurement.DateTime = dateService.UtcNow;
    measurement.MetricFlagKey = Command.MetricFlagKey;

    UpsertResult result = await repository.UpsertMeasurement(measurement);

    UpdateMetric(metric, dateService);

    metric.LastMeasurementDate = dateService.UtcNow;

    return new CommandResult { EntityId = result.EntityId };
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
