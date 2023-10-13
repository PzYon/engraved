namespace Engraved.Core.Application.Commands.Entries.Move;

public class MoveEntryCommand : ICommand
{
  public string EntryId { get; set; } = null!;

  public string TargetJournalId { get; set; } = null!;
}
