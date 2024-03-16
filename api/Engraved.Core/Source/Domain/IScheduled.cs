namespace Engraved.Core.Domain;

public interface IScheduled
{
  [Obsolete]
  Schedule? Schedule { get; set; }

  Dictionary<string, Schedule> Schedules { get; set; }
}
