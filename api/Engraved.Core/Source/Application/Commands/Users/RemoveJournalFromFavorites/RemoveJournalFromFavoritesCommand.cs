namespace Engraved.Core.Application.Commands.Users.RemoveJournalFromFavorites;

public class RemoveJournalFromFavoritesCommand : ICommand
{
  public string? JournalId { get; set; }
}
