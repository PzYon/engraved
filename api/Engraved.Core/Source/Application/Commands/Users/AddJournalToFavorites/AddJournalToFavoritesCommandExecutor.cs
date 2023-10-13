using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.User;

namespace Engraved.Core.Application.Commands.Users.AddJournalToFavorites;

public class AddJournalToFavoritesCommandExecutor : ICommandExecutor<AddJournalToFavoritesCommand>
{
  private readonly IRepository _repository;
  private readonly IDateService _dateService;

  public AddJournalToFavoritesCommandExecutor( IRepository repository, IDateService dateService)
  {
    _repository = repository;
    _dateService = dateService;
  }

  public async Task<CommandResult> Execute(AddJournalToFavoritesCommand command)
  {
    if (string.IsNullOrEmpty(command.JournalId))
    {
      throw new InvalidCommandException(command, $"\"{nameof(command.JournalId)}\" must be specified");
    }

    if (string.IsNullOrEmpty(command.UserName))
    {
      throw new InvalidCommandException(command, $"\"{nameof(command.UserName)}\" must be specified");
    }

    IUser? user = await _repository.GetUser(command.UserName);

    if (user == null || user.FavoriteJournalIds.Contains(command.JournalId))
    {
      return new CommandResult();
    }

    user.FavoriteJournalIds.Add(command.JournalId);

    UpsertResult upsertResult = await _repository.UpsertUser(user);
    return new CommandResult(upsertResult.EntityId, Array.Empty<string>());
  }
}
