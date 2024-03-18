namespace Engraved.Core.Application.Jobs;

public class NotificationJobResult
{
  public HashSet<string> ProcessedJournalIds { get; set; } = [];
  public HashSet<string> ProcessedEntryIds { get; set; } = [];
}
