namespace Engraved.Core.Application.Commands.Journals.Delete;

public class DeleteJournalCommand : ICommand
{
  public string JournalId { get; set; } = null!;
}
