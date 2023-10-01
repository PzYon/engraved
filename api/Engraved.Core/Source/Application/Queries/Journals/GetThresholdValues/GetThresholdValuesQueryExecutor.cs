using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Queries.Journals.Get;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Measurements;

namespace Engraved.Core.Application.Queries.Journals.GetThresholdValues;

// todo:
// - consider a specific time period for threshold (must be configured and
//   used in calculations)

public class GetThresholdValuesQueryExecutor : IQueryExecutor<IDictionary<string, IDictionary<string, ThresholdResult>>>
{
  public bool DisableCache => false;

  private readonly GetThresholdValuesQuery _query;

  public GetThresholdValuesQueryExecutor(GetThresholdValuesQuery query)
  {
    _query = query;
  }

  public async Task<IDictionary<string, IDictionary<string, ThresholdResult>>> Execute(IRepository repository)
  {
    var metricQuery = new GetJournalQueryExecutor(new GetJournalQuery { JournalId = _query.JournalId });
    IJournal? metric = await metricQuery.Execute(repository);

    if (metric == null || metric.Thresholds.Count == 0)
    {
      return new Dictionary<string, IDictionary<string, ThresholdResult>>();
    }

    IMeasurement[] measurements = await repository.GetAllMeasurements(
      _query.JournalId!,
      _query.FromDate,
      _query.ToDate,
      null
    );

    return CalculateThresholds(metric, measurements);
  }

  private static IDictionary<string, IDictionary<string, ThresholdResult>> CalculateThresholds(
    IJournal journal,
    IMeasurement[] measurements
  )
  {
    Dictionary<string, IDictionary<string, ThresholdResult>> results = new();

    foreach ((string? attributeKey, Dictionary<string, double>? thresholds) in journal.Thresholds)
    {
      Dictionary<string, ThresholdResult> attributeResults = new();

      foreach ((string? attributeValueKey, double thresholdValue) in thresholds)
      {
        double total = measurements
          .Where(
            m => m.JournalAttributeValues.TryGetValue(attributeKey, out string[]? valueKeys)
                 && valueKeys.Contains(attributeValueKey)
          )
          .Sum(m => m.GetValue());

        attributeResults.Add(
          attributeValueKey,
          new ThresholdResult
          {
            ActualValue = total,
            ThresholdValue = thresholdValue
          }
        );
      }

      if (attributeResults.Count > 0)
      {
        results.Add(attributeKey, attributeResults);
      }
    }

    return results;
  }
}
