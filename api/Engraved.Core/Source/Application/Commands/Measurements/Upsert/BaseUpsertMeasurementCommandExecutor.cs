using Engraved.Core.Application.Commands.Journals;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Measurements;

namespace Engraved.Core.Application.Commands.Measurements.Upsert;

public abstract class BaseUpsertMeasurementCommandExecutor<TCommand, TMeasurement, TMetric> : ICommandExecutor
  where TCommand : BaseUpsertMeasurementCommand
  where TMeasurement : class, IMeasurement, new()
  where TMetric : class, IJournal
{
  protected BaseUpsertMeasurementCommandExecutor(TCommand command)
  {
    Command = command;
  }

  protected TCommand Command { get; }

  public async Task<CommandResult> Execute(IRepository repository, IDateService dateService)
  {
    var metric = await JournalCommandUtil.LoadAndValidateJournal<TMetric>(repository, Command, Command.JournalId);

    await ValidateCommand(metric);

    UpsertResult result = await UpsertMeasurement(repository, dateService, metric);

    await UpdateMetric(repository, dateService, metric);

    return new CommandResult(result.EntityId, metric.Permissions.GetUserIdsWithAccess());
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
    await repository.UpsertJournal(metric);
  }

  private void SetCommonValues(IDateService dateService, TMeasurement measurement)
  {
    measurement.ParentId = Command.JournalId;
    measurement.Notes = Command.Notes;
    measurement.JournalAttributeValues = Command.MetricAttributeValues;
    measurement.DateTime = Command.DateTime ?? dateService.UtcNow;
    measurement.EditedOn = dateService.UtcNow;
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

  private void EnsureCompatibleMetricType(IJournal journal)
  {
    if (journal.Type != Command.GetSupportedMetricType())
    {
      throw CreateInvalidCommandException(
        $"Command with metric type \"{Command.GetSupportedMetricType()}\" is not compatible with metric of type \"{journal.Type}\"."
      );
    }
  }

  private void ValidateMetricAttributes(IJournal journal)
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

      if (journal.Attributes.TryGetValue(attributeKey, out JournalAttribute? attribute))
      {
        errors.AddRange(
          attributeValues
            .Where(valueKey => !attribute.Values.ContainsKey(valueKey))
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
