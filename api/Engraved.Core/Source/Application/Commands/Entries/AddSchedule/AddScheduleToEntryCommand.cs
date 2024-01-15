namespace Engraved.Core.Application.Commands.Entries.AddSchedule;

public class AddScheduleToEntryCommand : ICommand
{
  public string? EntryId { get; set; }
  
  public DateTime? NextOccurrence { get; set; }
}
