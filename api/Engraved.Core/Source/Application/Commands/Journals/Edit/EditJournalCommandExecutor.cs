using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Journals.Edit;

public class EditJournalCommandExecutor(IRepository repository, IDateService dateService)
  : ICommandExecutor<EditJournalCommand>
{
  private readonly IBaseRepository _repository = repository;

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

    IJournal? journal = await _repository.GetJournal(command.JournalId);

    if (journal == null)
    {
      throw new InvalidCommandException(command, $"Journal with key \"{command.JournalId}\" does not exist.");
    }

    var normalizedAttributes = NormalizeKeys(command.Attributes);

    journal.Attributes = normalizedAttributes;
    journal.Name = command.Name;
    journal.Description = command.Description;
    journal.Notes = command.Notes;
    journal.Thresholds = command.Thresholds;
    journal.CustomProps = command.CustomProps;
    journal.EditedOn = dateService.UtcNow;

    var removedAttributeKeys = journal.Attributes.Keys.Except(normalizedAttributes.Keys).ToArray();
    await RemoveAttributesFromEntries(journal.Id!, removedAttributeKeys);

    UpsertResult result = await _repository.UpsertJournal(journal);

    return new CommandResult(result.EntityId, journal.Permissions.GetUserIdsWithAccess());
  }

  private async Task RemoveAttributesFromEntries(string journalId, string[] removedAttributeKeys)
  {
    if (removedAttributeKeys.Length == 0)
    {
      return;
    }

    var entries = await _repository.GetEntriesForJournal(journalId);
    foreach (IEntry entry in entries)
    {
      var changed = false;
      foreach (var removedAttributeKey in removedAttributeKeys)
      {
        changed |= entry.JournalAttributeValues.Remove(removedAttributeKey);
      }

      if (changed)
      {
        await _repository.UpsertEntry(entry);
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
