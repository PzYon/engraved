namespace Engraved.Core.Application.Commands.Users.RemoveJournalFromFavorites;

public class RemoveJournalFromFavoritesCommand : ICommand
{
  public string? JournalId { get; set; }
  public string? UserId { get; set; }

  public ICommandExecutor CreateExecutor()
  {
    return new RemoveJournalFromFavoritesCommandExecutor(this);
  }
}
