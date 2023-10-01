using Engraved.Core.Application.Commands.Journals;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Upsert;

public abstract class BaseUpsertEntryCommandExecutor<TCommand, TEntry, TJournal> : ICommandExecutor
  where TCommand : BaseUpsertEntryCommand
  where TEntry : class, IEntry, new()
  where TJournal : class, IJournal
{
  protected BaseUpsertEntryCommandExecutor(TCommand command)
  {
    Command = command;
  }

  protected TCommand Command { get; }

  public async Task<CommandResult> Execute(IRepository repository, IDateService dateService)
  {
    var journal = await JournalCommandUtil.LoadAndValidateJournal<TJournal>(repository, Command, Command.JournalId);

    await ValidateCommand(journal);

    UpsertResult result = await UpsertEntry(repository, dateService, journal);

    await UpdateJournal(repository, dateService, journal);

    return new CommandResult(result.EntityId, journal.Permissions.GetUserIdsWithAccess());
  }

  private async Task ValidateCommand(TJournal journal)
  {
    EnsureCompatibleJournalType(journal);

    ValidateJournalAttributes(journal);
    await PerformTypeSpecificValidation();
  }

  private async Task<UpsertResult> UpsertEntry(IRepository repository, IDateService dateService, TJournal journal)
  {
    TEntry entry = await GetOrCreateNewEntry(repository, journal);

    SetCommonValues(dateService, entry);
    SetTypeSpecificValues(dateService, entry);

    UpsertResult result = await repository.UpsertEntry(entry);
    return result;
  }

  private static async Task UpdateJournal(IRepository repository, IDateService dateService, TJournal journal)
  {
    journal.EditedOn = dateService.UtcNow;
    await repository.UpsertJournal(journal);
  }

  private void SetCommonValues(IDateService dateService, TEntry entry)
  {
    entry.ParentId = Command.JournalId;
    entry.Notes = Command.Notes;
    entry.JournalAttributeValues = Command.JournalAttributeValues;
    entry.DateTime = Command.DateTime ?? dateService.UtcNow;
    entry.EditedOn = dateService.UtcNow;
  }

  protected abstract void SetTypeSpecificValues(IDateService dateService, TEntry entry);

  protected virtual Task PerformTypeSpecificValidation()
  {
    return Task.CompletedTask;
  }

  protected virtual Task<TEntry?> LoadEntryToUpdate(IRepository repository, TJournal journal)
  {
    return Task.FromResult<TEntry?>(null);
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

  private async Task<TEntry> GetOrCreateNewEntry(IRepository repository, TJournal journal)
  {
    return await LoadEntryById(repository)
           ?? await LoadEntryToUpdate(repository, journal)
           ?? new TEntry();
  }

  private async Task<TEntry?> LoadEntryById(IRepository repository)
  {
    if (!string.IsNullOrEmpty(Command.Id))
    {
      return (TEntry)(await repository.GetEntry(Command.Id))!;
    }

    return null;
  }

  protected InvalidCommandException CreateInvalidCommandException(string message)
  {
    return new InvalidCommandException(Command, message);
  }
}
