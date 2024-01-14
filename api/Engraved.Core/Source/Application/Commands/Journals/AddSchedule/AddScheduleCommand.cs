namespace Engraved.Core.Application.Commands.Journals.AddSchedule;

public class AddScheduleCommand : ICommand
{
  public string? JournalId { get; set; }
  
  public DateTime? NextOccurrence { get; set; }
}
