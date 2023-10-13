using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.User;

namespace Engraved.Core.Application.Commands.Users.RemoveJournalFromFavorites;

public class RemoveJournalFromFavoritesCommandExecutor : ICommandExecutor<RemoveJournalFromFavoritesCommand>
{
  private readonly IUserScopedRepository _repository;

  public RemoveJournalFromFavoritesCommandExecutor(IUserScopedRepository repository)
  {
    _repository = repository;
  }

  public async Task<CommandResult> Execute(RemoveJournalFromFavoritesCommand command)
  {
    if (string.IsNullOrEmpty(command.JournalId))
    {
      throw new InvalidCommandException(command, $"\"{nameof(command.JournalId)}\" must be specified");
    }

    IUser user = _repository.CurrentUser.Value;

    if (!user.FavoriteJournalIds.Contains(command.JournalId))
    {
      return new CommandResult();
    }

    user.FavoriteJournalIds.Remove(command.JournalId);

    UpsertResult upsertResult = await _repository.UpsertUser(user);
    return new CommandResult(upsertResult.EntityId, Array.Empty<string>());
  }
}
