namespace Engraved.Core.Domain;

public interface IScheduled
{
  Dictionary<string, Schedule> Schedules { get; set; }
}
