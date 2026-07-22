using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Commands.Users.Delete;

public class DeleteUserCommandExecutor(IUnrestrictedRepository unrestrictedRepository, Lazy<IUser> currentUser)
  : ICommandExecutor<DeleteUserCommand>
{
  public async Task<CommandResult> Execute(DeleteUserCommand command)
  {
    if (string.IsNullOrEmpty(command.UserId))
    {
      throw new InvalidCommandException(command, $"{nameof(DeleteUserCommand.UserId)} is required");
    }

    if (command.UserId == currentUser.Value.Id)
    {
      throw new NotAllowedOperationException("You cannot delete your own account.");
    }

    IUser? user = await unrestrictedRepository.GetUser(command.UserId);
    if (user == null)
    {
      return new CommandResult();
    }

    // a user's journals - and their entries - die with the user; this cascade is a use-case rule
    // and therefore lives here, not in the repository (mirrors DeleteJournalCommandExecutor)
    var journalIds = await unrestrictedRepository.GetJournalIdsForUser(user.Id!);
    foreach (var journalId in journalIds)
    {
      await unrestrictedRepository.DeleteEntriesForJournal(journalId);
      await unrestrictedRepository.DeleteJournal(journalId);
    }

    await unrestrictedRepository.DeleteUser(user.Id!);

    return new CommandResult(user.Id!, [user.Id!]);
  }
}
