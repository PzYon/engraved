using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Commands.Users.AddJournalToFavorites;

public class AddJournalToFavoritesCommandExecutor(IUserRepository userRepository, Lazy<IUser> currentUser)
  : ICommandExecutor<AddJournalToFavoritesCommand>
{
  public async Task<CommandResult> Execute(AddJournalToFavoritesCommand command)
  {
    if (string.IsNullOrEmpty(command.JournalId))
    {
      throw new InvalidCommandException(command, $"\"{nameof(command.JournalId)}\" must be specified");
    }

    IUser user = currentUser.Value;

    if (user.FavoriteJournalIds.Contains(command.JournalId))
    {
      return new CommandResult();
    }

    user.FavoriteJournalIds.Add(command.JournalId);

    UpsertResult upsertResult = await userRepository.UpsertUser(user);
    return new CommandResult(upsertResult.EntityId, []);
  }
}
