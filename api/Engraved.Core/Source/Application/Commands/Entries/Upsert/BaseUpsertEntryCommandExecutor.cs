using Engraved.Core.Application.Commands.Journals;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Upsert;

public abstract class BaseUpsertEntryCommandExecutor<TCommand, TEntry, TJournal>(
  IJournalRepository journalRepository,
  IEntryRepository entryRepository,
  IDateService dateService
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

    EnsureCompatibleJournalType(command, journal);

    TEntry? entry = await GetOrCreateNewEntry(command, journal);
    if (entry == null)
    {
      // the command targets an entry that no longer exists (deleted since the client cached it,
      // e.g. while the command sat in an offline outbox) -> discard it instead of resurrecting
      // the deleted entry. Deliberately before the remaining validation: a discarded command must
      // not fail on rules (like the log book's one-entry-per-day) it no longer participates in.
      return CommandResult.CreateDiscarded(command.Id!);
    }

    ValidateJournalAttributes(command, journal);
    await PerformTypeSpecificValidation(command);

    SetCommonValues(command, entry);
    SetTypeSpecificValues(command, entry);

    UpsertResult result = await EntryRepository.UpsertEntry(entry);

    await UpdateJournal(JournalRepository, DateService, journal);

    return new CommandResult(result.EntityId, journal.Permissions.GetUserIdsWithAccess());
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

  // Returns null when the command must be discarded (see Execute). Commands with an Id either
  // update the existing entry (which doubles as the idempotent replay of a create) or - only when
  // flagged IsNew - create it under the client-generated Id. An update whose entry is gone was
  // deleted in the meantime and must not come back to life via the upsert.
  private async Task<TEntry?> GetOrCreateNewEntry(TCommand command, TJournal journal)
  {
    if (!string.IsNullOrEmpty(command.Id))
    {
      TEntry? existingEntry = (TEntry?)await EntryRepository.GetEntry(command.Id);
      if (existingEntry != null)
      {
        return existingEntry;
      }

      return command.IsNew
        ? new TEntry { Id = command.Id }
        : null;
    }

    return await LoadEntryToUpdate(command, journal)
           ?? new TEntry();
  }

  protected InvalidCommandException CreateInvalidCommandException(TCommand command, string message)
  {
    return new InvalidCommandException(command, message);
  }
}
