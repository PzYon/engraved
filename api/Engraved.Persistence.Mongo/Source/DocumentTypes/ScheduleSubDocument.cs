﻿namespace Engraved.Persistence.Mongo.DocumentTypes;

public class ScheduleSubDocument
{
  public DateTime? NextOccurrence { get; set; }

  public RecurrenceSubDocument? Recurrence { get; set; }

  public bool DidNotify { get; set; }

  public string? NotificationId { get; set; }

  public string? OnClickUrl { get; set; }
}
