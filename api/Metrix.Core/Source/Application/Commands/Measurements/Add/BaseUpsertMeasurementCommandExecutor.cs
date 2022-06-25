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
    ValidateMetricAttributes(metric);

    await PerformAdditionalValidation(repository, metric);

    TMeasurement measurement = await GetMeasurement(repository, dateService);
    measurement.MetricId = Command.MetricId;
    measurement.Notes = Command.Notes;
    measurement.DateTime = Command.DateTime ?? dateService.UtcNow;
    measurement.MetricAttributeValues = Command.MetricAttributeValues;

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

  private void ValidateMetricAttributes(IMetric metric)
  {
    if (Command.MetricAttributeValues.Keys.Count == 0)
    {
      return;
    }

    var errors = new List<string>();

    foreach (KeyValuePair<string, string[]> kvp in Command.MetricAttributeValues)
    {
      string attributeKey = kvp.Key;
      string[] attributeValues = kvp.Value;

      if (metric.Attributes.ContainsKey(attributeKey))
      {
        errors.AddRange(
          attributeValues
            .Where(valueKey => !metric.Attributes[attributeKey].Values.ContainsKey(valueKey))
            .Select(valueKey => "Value key: " + valueKey + " (for " + attributeKey)
        );
      }
      else
      {
        errors.Add("Attribute key: " + attributeKey);
      }
    }

    if (errors.Any())
    {
      throw new InvalidCommandException(Command, "Invalid attributes: " + string.Join(", ", errors));
    }
  }

  private async Task<TMeasurement> GetMeasurement(IRepository repository, IDateService dateService)
  {
    if (string.IsNullOrEmpty(Command.Id))
    {
      return CreateMeasurement(dateService);
    }

    IMeasurement[] allMeasurements = await repository.GetAllMeasurements(Command.MetricId);
    return allMeasurements.OfType<TMeasurement>().First(m => m.Id == Command.Id);
  }

  protected InvalidCommandException CreateInvalidCommandException(string message)
  {
    return new InvalidCommandException(Command, message);
  }
}
