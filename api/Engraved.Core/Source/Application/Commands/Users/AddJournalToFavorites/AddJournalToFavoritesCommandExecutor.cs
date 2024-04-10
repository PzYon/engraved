using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Commands.Users.AddJournalToFavorites;

public class AddJournalToFavoritesCommandExecutor : ICommandExecutor<AddJournalToFavoritesCommand>
{
  private readonly IUserScopedRepository _repository;

  public AddJournalToFavoritesCommandExecutor(IUserScopedRepository repository)
  {
    _repository = repository;
  }

  public async Task<CommandResult> Execute(AddJournalToFavoritesCommand command)
  {
    if (string.IsNullOrEmpty(command.JournalId))
    {
      throw new InvalidCommandException(command, $"\"{nameof(command.JournalId)}\" must be specified");
    }

    IUser user = _repository.CurrentUser.Value;

    if (user.FavoriteJournalIds.Contains(command.JournalId))
    {
      return new CommandResult();
    }

    user.FavoriteJournalIds.Add(command.JournalId);

    UpsertResult upsertResult = await _repository.UpsertUser(user);
    return new CommandResult(upsertResult.EntityId, Array.Empty<string>());
  }
}
