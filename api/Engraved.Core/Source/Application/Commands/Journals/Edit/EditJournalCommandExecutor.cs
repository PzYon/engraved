using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Journals.Edit;

public class EditJournalCommandExecutor(
  IJournalRepository journalRepository,
  IEntryRepository entryRepository,
  IDateService dateService
)
  : ICommandExecutor<EditJournalCommand>
{

  public async Task<CommandResult> Execute(EditJournalCommand command)
  {
    if (string.IsNullOrEmpty(command.JournalId))
    {
      throw new InvalidCommandException(command, $"{nameof(EditJournalCommand.JournalId)} must be specified.");
    }

    if (string.IsNullOrEmpty(command.Name))
    {
      throw new InvalidCommandException(command, $"{nameof(EditJournalCommand.Name)} must be specified.");
    }

    IJournal? journal = await journalRepository.GetJournal(command.JournalId);

    if (journal == null)
    {
      throw new InvalidCommandException(command, $"Journal with key \"{command.JournalId}\" does not exist.");
    }

    var normalizedAttributes = NormalizeKeys(command.Attributes);
    var removedAttributeKeys = journal.Attributes.Keys.Except(normalizedAttributes.Keys).ToArray();

    await RemoveAttributesFromEntries(journal.Id!, removedAttributeKeys);

    journal.Attributes = normalizedAttributes;
    journal.Name = command.Name;
    journal.Description = command.Description;
    journal.Notes = command.Notes;
    journal.Thresholds = command.Thresholds;
    journal.CustomProps = command.CustomProps;
    journal.EditedOn = dateService.UtcNow;

    UpsertResult result = await journalRepository.UpsertJournal(journal);

    return new CommandResult(result.EntityId, journal.Permissions.GetUserIdsWithAccess());
  }

  private async Task RemoveAttributesFromEntries(string journalId, string[] removedAttributeKeys)
  {
    if (removedAttributeKeys.Length == 0)
    {
      return;
    }

    var entries = await entryRepository.GetEntriesForJournal(journalId);

    foreach (IEntry entry in entries)
    {
      var changed = false;
      foreach (var removedAttributeKey in removedAttributeKeys)
      {
        changed |= entry.JournalAttributeValues.Remove(removedAttributeKey);
      }

      if (changed)
      {
        await entryRepository.UpsertEntry(entry);
      }
    }
  }

  // todo: add tests for this stuff
  private static Dictionary<string, JournalAttribute> NormalizeKeys(Dictionary<string, JournalAttribute> attributes)
  {
    var journalAttributes = KeyNormalizer.Normalize(attributes);

    foreach (var journalAttribute in journalAttributes)
    {
      journalAttribute.Value.Values = KeyNormalizer.Normalize(journalAttribute.Value.Values);
    }

    return journalAttributes;
  }
}
