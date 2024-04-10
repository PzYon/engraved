namespace Engraved.Core.Domain.Schedule;

public interface IScheduled
{
  Dictionary<string, Schedule> Schedules { get; set; }
}
