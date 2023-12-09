using Engraved.Core.Application.Persistence;
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

    journal.Attributes = NormalizeKeys(command.Attributes);
    journal.Name = command.Name;
    journal.Description = command.Description;
    journal.Notes = command.Notes;
    journal.Thresholds = command.Thresholds;
    journal.CustomProps = command.CustomProps;
    journal.EditedOn = dateService.UtcNow;

    UpsertResult result = await _repository.UpsertJournal(journal);

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
