namespace Engraved.Core.Application.Queries.Journals.GetThresholdValues;

public class GetThresholdValuesQuery : IQuery
{
  public string? JournalId { get; set; }

  public DateTime? FromDate { get; set; }

  public DateTime? ToDate { get; set; }
}
