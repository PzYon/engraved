namespace Engraved.Core.Application.Commands.Journals.AddSchedule;

public class AddScheduleToJournalCommand : ICommand
{
  public string? JournalId { get; set; }

  public DateTime? NextOccurrence { get; set; }
}
