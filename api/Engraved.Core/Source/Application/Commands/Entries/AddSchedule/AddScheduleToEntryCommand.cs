using Engraved.Core.Domain.Schedules;

namespace Engraved.Core.Application.Commands.Entries.AddSchedule;

public class AddScheduleToEntryCommand : ICommand
{
  public string? EntryId { get; set; }

  public DateTime? NextOccurrence { get; set; }

  public Recurrence? Recurrence { get; set; }

  public string? OnClickUrl { get; set; }
}