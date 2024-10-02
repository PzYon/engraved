using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Commands.Users.RemoveJournalFromFavorites;

public class RemoveJournalFromFavoritesCommandExecutor(IUserScopedRepository repository)
  : ICommandExecutor<RemoveJournalFromFavoritesCommand>
{
  public async Task<CommandResult> Execute(RemoveJournalFromFavoritesCommand command)
  {
    if (string.IsNullOrEmpty(command.JournalId))
    {
      throw new InvalidCommandException(command, $"\"{nameof(command.JournalId)}\" must be specified");
    }

    IUser user = repository.CurrentUser.Value;

    if (!user.FavoriteJournalIds.Contains(command.JournalId))
    {
      return new CommandResult();
    }

    user.FavoriteJournalIds.Remove(command.JournalId);

    UpsertResult upsertResult = await repository.UpsertUser(user);
    return new CommandResult(upsertResult.EntityId, []);
  }
}
