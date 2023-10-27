using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Journals.EditPermissions;

public class EditJournalPermissionsCommandExecutor : ICommandExecutor<EditJournalPermissionsCommand>
{
  private readonly IRepository _repository;

  public EditJournalPermissionsCommandExecutor(IRealRepository repository)
  {
    _repository = repository;
  }

  public async Task<CommandResult> Execute(EditJournalPermissionsCommand command)
  {
    if (string.IsNullOrEmpty(command.JournalId))
    {
      throw new InvalidCommandException(command, $"{nameof(EditJournalPermissionsCommand.JournalId)} is required");
    }

    IJournal journalBefore = (await _repository.GetJournal(command.JournalId))!;

    if (command.Permissions?.Count > 0)
    {
      await _repository.ModifyJournalPermissions(command.JournalId, command.Permissions);
    }

    IJournal journalAfter = (await _repository.GetJournal(command.JournalId))!;

    // users are affected that have permissions before or after
    string[] userIdsWithAccess = journalBefore.Permissions.GetUserIdsWithAccess()
      .Union(journalAfter.Permissions.GetUserIdsWithAccess())
      .Distinct()
      .ToArray();

    return new CommandResult(command.JournalId, userIdsWithAccess);
  }
}
