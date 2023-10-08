namespace Engraved.Core.Application.Commands.Users.AddJournalToFavorites;

public class AddJournalToFavoritesCommand : ICommand
{
  public string? JournalId { get; set; }
  public string? UserId { get; set; }

  public ICommandExecutor CreateExecutor()
  {
    return new AddJournalToFavoritesCommandExecutor(this);
  }
}
