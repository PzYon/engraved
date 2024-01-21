namespace Engraved.Persistence.Mongo.DocumentTypes;

public interface IScheduledDocument
{
  ScheduleSubDocument? Schedule { get; set; }
}
