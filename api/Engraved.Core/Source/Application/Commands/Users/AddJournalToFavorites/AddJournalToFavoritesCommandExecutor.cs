using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.User;

namespace Engraved.Core.Application.Commands.Users.AddJournalToFavorites;

public class AddJournalToFavoritesCommandExecutor : ICommandExecutor
{
  private readonly AddJournalToFavoritesCommand _command;

  public AddJournalToFavoritesCommandExecutor(AddJournalToFavoritesCommand command)
  {
    _command = command;
  }

  public async Task<CommandResult> Execute(IRepository repository, IDateService dateService)
  {
    if (string.IsNullOrEmpty(_command.JournalId))
    {
      throw new InvalidCommandException(_command, $"\"{nameof(_command.JournalId)}\" must be specified");
    }

    if (string.IsNullOrEmpty(_command.UserName))
    {
      throw new InvalidCommandException(_command, $"\"{nameof(_command.UserName)}\" must be specified");
    }

    IUser? user = await repository.GetUser(_command.UserName);

    if (user == null || user.FavoriteJournalIds.Contains(_command.JournalId))
    {
      return new CommandResult();
    }

    user.FavoriteJournalIds.Add(_command.JournalId);

    UpsertResult upsertResult = await repository.UpsertUser(user);
    return new CommandResult(upsertResult.EntityId, Array.Empty<string>());
  }
}
