using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Journals.EditPermissions;

public class EditJournalPermissionsCommandExecutor : ICommandExecutor
{
  private readonly EditJournalPermissionsCommand _command;

  public EditJournalPermissionsCommandExecutor(EditJournalPermissionsCommand command)
  {
    _command = command;
  }

  public async Task<CommandResult> Execute(IRepository repository, IDateService dateService)
  {
    if (string.IsNullOrEmpty(_command.JournalId))
    {
      throw new InvalidCommandException(_command, $"{nameof(EditJournalPermissionsCommand.JournalId)} is required");
    }

    IJournal journalBefore = (await repository.GetJournal(_command.JournalId))!;

    if (_command.Permissions?.Count > 0)
    {
      await repository.ModifyJournalPermissions(_command.JournalId, _command.Permissions);
    }

    IJournal journalAfter = (await repository.GetJournal(_command.JournalId))!;

    // users are affected that have permissions before or after
    string[] userIdsWithAccess = journalBefore.Permissions.GetUserIdsWithAccess()
      .Union(journalAfter.Permissions.GetUserIdsWithAccess())
      .Distinct()
      .ToArray();

    return new CommandResult(_command.JournalId, userIdsWithAccess);
  }
}
