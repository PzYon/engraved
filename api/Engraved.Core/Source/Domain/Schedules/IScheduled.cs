namespace Engraved.Core.Domain.Schedules;

public interface IScheduled
{
  Dictionary<string, Schedule> Schedules { get; set; }
}
