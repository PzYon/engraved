using Engraved.Core.Application.Commands.Journals;
using Engraved.Core.Application.Files;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Files;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Upsert;

public abstract class BaseUpsertEntryCommandExecutor<TCommand, TEntry, TJournal>(
  IJournalRepository journalRepository,
  IEntryRepository entryRepository,
  IDateService dateService,
  FileAcceptor fileAcceptor
) : ICommandExecutor<TCommand>
  where TCommand : BaseUpsertEntryCommand
  where TEntry : class, IEntry, new()
  where TJournal : class, IJournal
{
  protected readonly IDateService DateService = dateService;
  protected readonly IEntryRepository EntryRepository = entryRepository;
  protected readonly IJournalRepository JournalRepository = journalRepository;

  public async Task<CommandResult> Execute(TCommand command)
  {
    var journal =
      await JournalCommandUtil.LoadAndValidateJournal<TJournal>(JournalRepository, command, command.JournalId);

    await ValidateCommand(command, journal);

    UpsertResult result = await UpsertEntry(command, journal);

    await UpdateJournal(JournalRepository, DateService, journal);

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

    // Captured before the command is applied: which files the entry already holds is what decides
    // whether an incoming one is new and therefore has to prove where it came from.
    FileRef[] storedFiles = entry.Files;

    SetCommonValues(command, entry);
    SetTypeSpecificValues(command, entry);

    entry.Files = await fileAcceptor.Accept(command.Files, storedFiles);

    UpsertResult result = await EntryRepository.UpsertEntry(entry);

    // Only once the entry no longer refers to them. Before the write, a failing write would leave
    // the entry pointing at files that had already been deleted.
    await fileAcceptor.DeleteRemoved(storedFiles, entry.Files);

    return result;
  }

  private static async Task UpdateJournal(IJournalRepository repository, IDateService dateService, TJournal journal)
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

  private static void ValidateJournalAttributes(TCommand command, IJournal journal)
  {
    if (command.JournalAttributeValues.Keys.Count == 0)
    {
      return;
    }

    var errors = new List<string>();

    foreach (var kvp in command.JournalAttributeValues)
    {
      var attributeKey = kvp.Key;
      var attributeValues = kvp.Value;

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
      return (TEntry)(await EntryRepository.GetEntry(command.Id))!;
    }

    return null;
  }

  protected InvalidCommandException CreateInvalidCommandException(TCommand command, string message)
  {
    return new InvalidCommandException(command, message);
  }
}
