namespace Engraved.Core.Application.Queries.Journals.GetThresholdValues;

public class GetThresholdValuesQuery : IQuery<IDictionary<string, IDictionary<string, ThresholdResult>>>
{
  public string? JournalId { get; set; }

  public DateTime? FromDate { get; set; }

  public DateTime? ToDate { get; set; }

  public IQueryExecutor<IDictionary<string, IDictionary<string, ThresholdResult>>> CreateExecutor()
  {
    return new GetThresholdValuesQueryExecutor(this);
  }
}
