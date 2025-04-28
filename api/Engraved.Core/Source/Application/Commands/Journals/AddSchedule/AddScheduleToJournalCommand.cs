using Engraved.Core.Domain.Schedules;

namespace Engraved.Core.Application.Commands.Journals.AddSchedule;

public class AddScheduleToJournalCommand : ICommand
{
  public string? JournalId { get; set; }

  public DateTime? NextOccurrence { get; set; }

  public Recurrence? Recurrence { get; set; }

  public string? OnClickUrl { get; set; }
}
