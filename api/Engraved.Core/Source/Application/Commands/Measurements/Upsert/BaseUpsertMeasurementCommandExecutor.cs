using Engraved.Core.Application.Commands.Metrics;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Measurements;
using Engraved.Core.Domain.Metrics;

namespace Engraved.Core.Application.Commands.Measurements.Upsert;

public abstract class BaseUpsertMeasurementCommandExecutor<TCommand, TMeasurement, TMetric> : ICommandExecutor
  where TCommand : BaseUpsertMeasurementCommand
  where TMeasurement : class, IMeasurement, new()
  where TMetric : class, IMetric
{
  protected BaseUpsertMeasurementCommandExecutor(TCommand command)
  {
    Command = command;
  }

  protected TCommand Command { get; }

  public async Task<CommandResult> Execute(IRepository repository, IDateService dateService)
  {
    var metric = await MetricCommandUtil.LoadAndValidateMetric<TMetric>(repository, Command, Command.MetricId);

    await ValidateCommand(metric);

    UpsertResult result = await UpsertMeasurement(repository, dateService, metric);

    await UpdateMetric(repository, dateService, metric);

    return new CommandResult { EntityId = result.EntityId };
  }

  private async Task ValidateCommand(TMetric metric)
  {
    EnsureCompatibleMetricType(metric);

    ValidateMetricAttributes(metric);
    await PerformTypeSpecificValidation();
  }

  private async Task<UpsertResult> UpsertMeasurement(IRepository repository, IDateService dateService, TMetric metric)
  {
    TMeasurement measurement = await GetOrCreateNewMeasurement(repository, metric);

    SetCommonValues(dateService, measurement);
    SetTypeSpecificValues(dateService, measurement);

    UpsertResult result = await repository.UpsertMeasurement(measurement);
    return result;
  }

  private static async Task UpdateMetric(IRepository repository, IDateService dateService, TMetric metric)
  {
    metric.EditedOn = dateService.UtcNow;
    await repository.UpsertMetric(metric);
  }

  private void SetCommonValues(IDateService dateService, TMeasurement measurement)
  {
    measurement.MetricId = Command.MetricId;
    measurement.Notes = Command.Notes;
    measurement.MetricAttributeValues = Command.MetricAttributeValues;
    measurement.DateTime = Command.DateTime ?? dateService.UtcNow;
  }

  protected abstract void SetTypeSpecificValues(IDateService dateService, TMeasurement measurement);

  protected virtual Task PerformTypeSpecificValidation()
  {
    return Task.CompletedTask;
  }

  protected virtual Task<TMeasurement?> LoadMeasurementToUpdate(IRepository repository, TMetric metric)
  {
    return Task.FromResult<TMeasurement?>(null);
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

  private async Task<TMeasurement> GetOrCreateNewMeasurement(IRepository repository, TMetric metric)
  {
    return await LoadMeasurementById(repository)
           ?? await LoadMeasurementToUpdate(repository, metric)
           ?? new TMeasurement();
  }

  private async Task<TMeasurement?> LoadMeasurementById(IRepository repository)
  {
    if (!string.IsNullOrEmpty(Command.Id))
    {
      return (TMeasurement)(await repository.GetMeasurement(Command.Id))!;
    }

    return null;
  }

  protected InvalidCommandException CreateInvalidCommandException(string message)
  {
    return new InvalidCommandException(Command, message);
  }
}
