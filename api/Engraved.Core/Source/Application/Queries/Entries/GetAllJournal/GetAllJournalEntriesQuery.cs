namespace Engraved.Core.Application.Queries.Entries.GetAllJournal;

public class GetAllJournalEntriesQuery : IQuery
{
  public string? JournalId { get; set; }

  public DateTime? FromDate { get; set; }

  public DateTime? ToDate { get; set; }

  public IDictionary<string, string[]> AttributeValues { get; set; } = new Dictionary<string, string[]>();
  
  public string? SearchText { get; set; }
}
