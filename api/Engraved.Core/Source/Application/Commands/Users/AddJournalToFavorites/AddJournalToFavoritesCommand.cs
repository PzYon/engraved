namespace Engraved.Core.Application.Commands.Users.AddJournalToFavorites;

public class AddJournalToFavoritesCommand : ICommand
{
  public string? JournalId { get; set; }
  public string? UserName { get; set; }
}
