using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Utils;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Journals.Edit;

public class EditJournalCommandExecutor : ICommandExecutor
{
  private readonly EditJournalCommand _command;

  public EditJournalCommandExecutor(EditJournalCommand command)
  {
    _command = command;
  }

  public async Task<CommandResult> Execute(IRepository repository, IDateService dateService)
  {
    if (string.IsNullOrEmpty(_command.JournalId))
    {
      throw new InvalidCommandException(_command, $"{nameof(EditJournalCommand.JournalId)} must be specified.");
    }

    if (string.IsNullOrEmpty(_command.Name))
    {
      throw new InvalidCommandException(_command, $"{nameof(EditJournalCommand.Name)} must be specified.");
    }

    IJournal? journal = await repository.GetJournal(_command.JournalId);

    if (journal == null)
    {
      throw new InvalidCommandException(_command, $"Metric with key \"{_command.JournalId}\" does not exist.");
    }

    journal.Attributes = NormalizeKeys(_command.Attributes);
    journal.Name = _command.Name;
    journal.Description = _command.Description;
    journal.Notes = _command.Notes;
    journal.Thresholds = _command.Thresholds;
    journal.CustomProps = _command.CustomProps;
    journal.EditedOn = dateService.UtcNow;

    UpsertResult result = await repository.UpsertJournal(journal);

    return new CommandResult(result.EntityId, journal.Permissions.GetUserIdsWithAccess());
  }

  // todo: add tests for this stuff
  private static Dictionary<string, JournalAttribute> NormalizeKeys(Dictionary<string, JournalAttribute> attributes)
  {
    Dictionary<string, JournalAttribute> journalAttributes = KeyNormalizer.Normalize(attributes);

    foreach (KeyValuePair<string, JournalAttribute> journalAttribute in journalAttributes)
    {
      journalAttribute.Value.Values = KeyNormalizer.Normalize(journalAttribute.Value.Values);
    }

    return journalAttributes;
  }
}
