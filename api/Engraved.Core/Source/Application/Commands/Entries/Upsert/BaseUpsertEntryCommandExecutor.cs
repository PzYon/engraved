using Engraved.Core.Application.Commands.Journals;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Upsert;

public abstract class BaseUpsertEntryCommandExecutor<TCommand, TEntry, TJournal> : ICommandExecutor<TCommand>
  where TCommand : BaseUpsertEntryCommand
  where TEntry : class, IEntry, new()
  where TJournal : class, IJournal
{
  protected readonly IBaseRepository Repository;
  protected readonly IDateService DateService;

  protected BaseUpsertEntryCommandExecutor(IRepository repository, IDateService dateService)
  {
    Repository = repository;
    DateService = dateService;
  }

  public async Task<CommandResult> Execute(TCommand command)
  {
    var journal = await JournalCommandUtil.LoadAndValidateJournal<TJournal>(Repository, command, command.JournalId);

    await ValidateCommand(command, journal);

    UpsertResult result = await UpsertEntry(command, journal);

    await UpdateJournal(Repository, DateService, journal);

    return new CommandResult(result.EntityId, journal.Permissions.GetUserIdsWithAccess());
  }

  private async Task ValidateCommand(TCommand command, TJournal journal)
  {
    EnsureCompatibleJournalType(command, journal);

    ValidateJournalAttributes(command, journal);
    await PerformTypeSpecificValidation(command);
  }

  private async Task<UpsertResult> UpsertEntry(TCommand command, TJournal journal)
  {
    TEntry entry = await GetOrCreateNewEntry(command, journal);

    SetCommonValues(command, entry);
    SetTypeSpecificValues(command, entry);

    UpsertResult result = await Repository.UpsertEntry(entry);
    return result;
  }

  private static async Task UpdateJournal(IBaseRepository repository, IDateService dateService, TJournal journal)
  {
    journal.EditedOn = dateService.UtcNow;
    await repository.UpsertJournal(journal);
  }

  private void SetCommonValues(TCommand command, TEntry entry)
  {
    entry.ParentId = command.JournalId;
    entry.Notes = command.Notes;
    entry.JournalAttributeValues = command.JournalAttributeValues;
    entry.DateTime = command.DateTime ?? DateService.UtcNow;
    entry.EditedOn = DateService.UtcNow;
  }

  protected abstract void SetTypeSpecificValues(TCommand command, TEntry entry);

  protected virtual Task PerformTypeSpecificValidation(TCommand baseUpsertEntryCommand)
  {
    return Task.CompletedTask;
  }

  protected virtual Task<TEntry?> LoadEntryToUpdate(TCommand command, TJournal journal)
  {
    return Task.FromResult<TEntry?>(null);
  }

  private void EnsureCompatibleJournalType(TCommand command, IJournal journal)
  {
    if (journal.Type != command.GetSupportedJournalType())
    {
      throw CreateInvalidCommandException(
        command,
        $"Command with journal type \"{command.GetSupportedJournalType()}\" is not compatible with journal of type \"{journal.Type}\"."
      );
    }
  }

  private void ValidateJournalAttributes(TCommand command, IJournal journal)
  {
    if (command.JournalAttributeValues.Keys.Count == 0)
    {
      return;
    }

    var errors = new List<string>();

    foreach (KeyValuePair<string, string[]> kvp in command.JournalAttributeValues)
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
      throw new InvalidCommandException(command, "Invalid attributes: " + string.Join(", ", errors));
    }
  }

  private async Task<TEntry> GetOrCreateNewEntry(TCommand command, TJournal journal)
  {
    return await LoadEntryById(command)
           ?? await LoadEntryToUpdate(command, journal)
           ?? new TEntry();
  }

  private async Task<TEntry?> LoadEntryById(TCommand command)
  {
    if (!string.IsNullOrEmpty(command.Id))
    {
      return (TEntry) (await Repository.GetEntry(command.Id))!;
    }

    return null;
  }

  protected InvalidCommandException CreateInvalidCommandException(TCommand command, string message)
  {
    return new InvalidCommandException(command, message);
  }
}
