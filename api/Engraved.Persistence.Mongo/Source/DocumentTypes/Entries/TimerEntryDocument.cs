namespace Engraved.Persistence.Mongo.DocumentTypes.Entries;

public class TimerEntryDocument : EntryDocument
{
  public DateTime StartDate { get; set; }

  public DateTime? EndDate { get; set; }
}
