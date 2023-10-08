using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.User;

namespace Engraved.Core.Application.Commands.Users.RemoveJournalFromFavorites;

public class RemoveJournalFromFavoritesCommandExecutor : ICommandExecutor
{
  private readonly RemoveJournalFromFavoritesCommand _command;

  public RemoveJournalFromFavoritesCommandExecutor(RemoveJournalFromFavoritesCommand command)
  {
    _command = command;
  }

  public async Task<CommandResult> Execute(IRepository repository, IDateService dateService)
  {
    if (string.IsNullOrEmpty(_command.JournalId))
    {
      throw new InvalidCommandException(_command, $"\"{nameof(_command.JournalId)}\" must be specified");
    }

    if (string.IsNullOrEmpty(_command.UserId))
    {
      throw new InvalidCommandException(_command, $"\"{nameof(_command.UserId)}\" must be specified");
    }

    IUser? user = await repository.GetUser(_command.UserId);

    if (user == null || !user.FavoriteJournalIds.Contains(_command.JournalId))
    {
      return new CommandResult();
    }

    user.FavoriteJournalIds.Remove(_command.JournalId);

    UpsertResult upsertResult = await repository.UpsertUser(user);
    return new CommandResult(upsertResult.EntityId, Array.Empty<string>());
  }
}
