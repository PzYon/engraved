using Engraved.Core.Application.Permissions;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;

namespace Engraved.Core.Application.Commands.Journals.EditPermissions;

public class EditJournalPermissionsCommandExecutor(
  IUserRestrictedRepository repository,
  PermissionsEnsurer permissionsEnsurer
) : ICommandExecutor<EditJournalPermissionsCommand>
{
  public async Task<CommandResult> Execute(EditJournalPermissionsCommand command)
  {
    if (string.IsNullOrEmpty(command.JournalId))
    {
      throw new InvalidCommandException(command, $"{nameof(EditJournalPermissionsCommand.JournalId)} is required");
    }

    IJournal? journal = await repository.GetJournal(command.JournalId);

    // Modifying permissions requires write access. The UpsertJournal write guard below would also
    // reject, but checking up front keeps PermissionsEnsurer from creating user records on behalf
    // of a caller that is not allowed to grant anything.
    if (!JournalAccessPolicy.HasAccess(journal, repository.CurrentUser.Value.Id, PermissionKind.Write))
    {
      throw new NotAllowedOperationException("Journal doesn't exist or you do not have permissions.");
    }

    string[] userIdsBefore = journal!.Permissions.GetUserIdsWithAccess();

    if (command.Permissions?.Count > 0)
    {
      // EnsurePermissions creates records for users that receive a permission for the first time
      // and mutates journal.Permissions in place; the upsert persists the modified journal.
      await permissionsEnsurer.EnsurePermissions(journal, command.Permissions);
      await repository.UpsertJournal(journal);
    }

    // users are affected that have permissions before or after
    var userIdsWithAccess = userIdsBefore
      .Union(journal.Permissions.GetUserIdsWithAccess())
      .Distinct()
      .ToArray();

    return new CommandResult(command.JournalId, userIdsWithAccess);
  }
}
