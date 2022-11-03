using Metrix.Core.Application.Persistence;
using Metrix.Core.Application.Queries.Metrics.Get;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Queries.Metrics.GetThresholdValues;

// todo:
// - consider a specific time period for threshold (must be configured and
//   used in calculations)
// - consider introducing IMetric.GetValue() so there's no need to cast in CalculateThresholds
// - what should be returned in results? only value/total? or also threshold limit, etc.?

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
    var metricQuery = new GetMetricQueryExecutor(new GetMetricQuery { MetricId = _query.MetricId });
    IMetric? metric = await metricQuery.Execute(repository);

    if (metric == null || metric.Thresholds.Count == 0)
    {
      return new Dictionary<string, IDictionary<string, ThresholdResult>>();
    }

    IMeasurement[] measurements = await repository.GetAllMeasurements(
      _query.MetricId!,
      _query.FromDate,
      _query.ToDate,
      null
    );

    return CalculateThresholds(metric, measurements);
  }

  private static IDictionary<string, IDictionary<string, ThresholdResult>> CalculateThresholds(
    IMetric metric,
    IMeasurement[] measurements
  )
  {
    Dictionary<string, IDictionary<string, ThresholdResult>> results = new();

    foreach ((string? attributeKey, Dictionary<string, double>? thresholds) in metric.Thresholds)
    {
      Dictionary<string, ThresholdResult> attributeResults = new();

      foreach ((string? attributeValueKey, double thresholdValue) in thresholds)
      {
        double total = measurements.Where(
            m => m.MetricAttributeValues.TryGetValue(attributeKey, out string[]? valueKeys)
                 && valueKeys.Contains(attributeValueKey)
          )
          .OfType<GaugeMeasurement>()
          .Sum(m => m.Value);

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
