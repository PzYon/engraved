namespace Engraved.Core.Application.Commands.Users.RemoveJournalFromFavorites;

public class RemoveJournalFromFavoritesCommand : ICommand
{
  public string? JournalId { get; set; }
  public string? UserName { get; set; }
}
