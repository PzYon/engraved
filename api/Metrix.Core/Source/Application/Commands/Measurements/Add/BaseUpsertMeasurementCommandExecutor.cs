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
  protected BaseUpsertMeasurementCommandExecutor(TCommand command)
  {
    Command = command;
  }

  protected TCommand Command { get; }

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
    measurement.MetricFlagKeys = Command.MetricFlagKeys;

    UpsertResult result = await repository.UpsertMeasurement(measurement);

    UpdateMetric(metric, dateService);
    metric.LastMeasurementDate = dateService.UtcNow;

    await repository.UpsertMetric(metric);

    return new CommandResult { EntityId = result.EntityId };
  }

  protected abstract TMeasurement CreateMeasurement(IDateService dateService);

  protected virtual Task PerformAdditionalValidation(IRepository repository, TMetric metric)
  {
    return Task.CompletedTask;
  }

  protected virtual void UpdateMetric(TMetric metric, IDateService dateService) { }

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
    if (Command.MetricFlagKeys.Keys.Count == 0)
    {
      return;
    }

    List<string> errors = new List<string>();

    foreach (KeyValuePair<string, string[]> x in Command.MetricFlagKeys)
    {
      if (metric.Attributes.ContainsKey(x.Key))
      {
        foreach (string valueKey in x.Value)
        {
          if (!metric.Attributes[x.Key].Values.ContainsKey(valueKey))
          {
            errors.Add("Value key: " + valueKey + " (for " + x.Key);
          }
        }
      }
      else
      {
        errors.Add("Attribute key: " + x.Key);
      }
    }

    if (errors.Any())
    {
      throw new InvalidCommandException(Command, "Invalid attributes: " + string.Join(", ", errors));
    }
  }

  protected InvalidCommandException CreateInvalidCommandException(string message)
  {
    return new InvalidCommandException(Command, message);
  }
}
