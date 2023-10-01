using Engraved.Core.Application.Commands.Journals;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Measurements;

namespace Engraved.Core.Application.Commands.Measurements.Upsert;

public abstract class BaseUpsertMeasurementCommandExecutor<TCommand, TMeasurement, TJournal> : ICommandExecutor
  where TCommand : BaseUpsertMeasurementCommand
  where TMeasurement : class, IMeasurement, new()
  where TJournal : class, IJournal
{
  protected BaseUpsertMeasurementCommandExecutor(TCommand command)
  {
    Command = command;
  }

  protected TCommand Command { get; }

  public async Task<CommandResult> Execute(IRepository repository, IDateService dateService)
  {
    var journal = await JournalCommandUtil.LoadAndValidateJournal<TJournal>(repository, Command, Command.JournalId);

    await ValidateCommand(journal);

    UpsertResult result = await UpsertMeasurement(repository, dateService, journal);

    await UpdateJournal(repository, dateService, journal);

    return new CommandResult(result.EntityId, journal.Permissions.GetUserIdsWithAccess());
  }

  private async Task ValidateCommand(TJournal journal)
  {
    EnsureCompatibleJournalType(journal);

    ValidateJournalAttributes(journal);
    await PerformTypeSpecificValidation();
  }

  private async Task<UpsertResult> UpsertMeasurement(IRepository repository, IDateService dateService, TJournal journal)
  {
    TMeasurement measurement = await GetOrCreateNewMeasurement(repository, journal);

    SetCommonValues(dateService, measurement);
    SetTypeSpecificValues(dateService, measurement);

    UpsertResult result = await repository.UpsertMeasurement(measurement);
    return result;
  }

  private static async Task UpdateJournal(IRepository repository, IDateService dateService, TJournal journal)
  {
    journal.EditedOn = dateService.UtcNow;
    await repository.UpsertJournal(journal);
  }

  private void SetCommonValues(IDateService dateService, TMeasurement measurement)
  {
    measurement.ParentId = Command.JournalId;
    measurement.Notes = Command.Notes;
    measurement.JournalAttributeValues = Command.JournalAttributeValues;
    measurement.DateTime = Command.DateTime ?? dateService.UtcNow;
    measurement.EditedOn = dateService.UtcNow;
  }

  protected abstract void SetTypeSpecificValues(IDateService dateService, TMeasurement measurement);

  protected virtual Task PerformTypeSpecificValidation()
  {
    return Task.CompletedTask;
  }

  protected virtual Task<TMeasurement?> LoadMeasurementToUpdate(IRepository repository, TJournal journal)
  {
    return Task.FromResult<TMeasurement?>(null);
  }

  private void EnsureCompatibleJournalType(IJournal journal)
  {
    if (journal.Type != Command.GetSupportedJournalType())
    {
      throw CreateInvalidCommandException(
        $"Command with journal type \"{Command.GetSupportedJournalType()}\" is not compatible with journal of type \"{journal.Type}\"."
      );
    }
  }

  private void ValidateJournalAttributes(IJournal journal)
  {
    if (Command.JournalAttributeValues.Keys.Count == 0)
    {
      return;
    }

    var errors = new List<string>();

    foreach (KeyValuePair<string, string[]> kvp in Command.JournalAttributeValues)
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

  private async Task<TMeasurement> GetOrCreateNewMeasurement(IRepository repository, TJournal journal)
  {
    return await LoadMeasurementById(repository)
           ?? await LoadMeasurementToUpdate(repository, journal)
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
