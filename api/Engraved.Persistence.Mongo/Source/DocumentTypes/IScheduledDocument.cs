namespace Engraved.Persistence.Mongo.DocumentTypes;

public interface IScheduledDocument
{
  Dictionary<string, ScheduleSubDocument> Schedules { get; set; }
}
